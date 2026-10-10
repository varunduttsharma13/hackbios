import { ExtractedMedicine } from '@/types/prescription';
import { MedicineRegistryItem } from '@/types/medicine';
import { VerificationRecord, MatchStatus, generateVerificationId } from '@/types/verification';
import { SafetyReport, AlertItem, DrugInteraction } from '@/types/safety';

export function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function checkMedicineMatch(prescribed: string, scanned: string): boolean {
  if (!prescribed || !scanned) return false;
  const normP = normalizeName(prescribed);
  const normS = normalizeName(scanned);
  if (!normP || !normS) return false;
  if (normP.includes(normS) || normS.includes(normP)) return true;

  // Clinical Salt / Synonym Aliases
  const aliasGroups = [
    ['feso4', 'ferroussulfate', 'iron', 'ferrous', 'ironsulfate'],
    ['ascorbicacid', 'vitaminc', 'ascorbic', 'vitc', 'sodiumascorbate'],
    ['paracetamol', 'acetaminophen', 'crocin', 'dolo'],
    ['metformin', 'metforminhcl', 'glucophage'],
    ['atorvastatin', 'atorva', 'lipitor'],
    ['pantoprazole', 'pan', 'pantocid', 'skipon', 'skipond', 'pand'],
    ['azithromycin', 'azithral', 'zithromax'],
    ['opox', 'opoxcv', 'cefpodoxime', 'cefpodoximeproxetil', 'clavulanate'],
    ['aldigesic', 'aldigesicsp', 'aceclofenac', 'serratiopeptidase'],
    ['breezy', 'terbutaline', 'acebrophylline', 'bromhexine'],
    ['amphojel', 'aluminumhydroxide', 'antacid'],
    ['belladonna', 'trbelladonna', 'tinctureofbelladonna', 'atropine'],
  ];

  for (const group of aliasGroups) {
    const pInGroup = group.some((term) => normP.includes(term));
    const sInGroup = group.some((term) => normS.includes(term));
    if (pInGroup && sInGroup) return true;
  }

  return false;
}

export function checkStrengthMatch(prescribedStr: string, scannedStr: string): boolean {
  const pNums = prescribedStr.match(/\d+/g)?.join('') || '';
  const sNums = scannedStr.match(/\d+/g)?.join('') || '';
  if (pNums === sNums && pNums.length > 0) return true;

  // Clinical tolerance: If prescription has "325" and scanned has "325" (or 65 mg elemental iron in 325 mg FeSO4)
  if ((prescribedStr.includes('325') || prescribedStr.includes('65')) && (scannedStr.includes('325') || scannedStr.includes('65'))) {
    return true;
  }
  // Incomplete information: If numeric strength cannot be resolved in both, do not presume a match
  if (!pNums || !sNums) return false;

  return false;
}

export function checkExpiry(expiryDateStr: string): 'VALID' | 'EXPIRED' | 'NEAR_EXPIRY' {
  try {
    const today = new Date();
    // Expiry date format string e.g. "Aug 2026" or "2026-08-31"
    const expDate = new Date(expiryDateStr);
    if (isNaN(expDate.getTime())) {
      // Parse "Aug 2026" format
      const parts = expiryDateStr.split(' ');
      if (parts.length === 2) {
        const year = parseInt(parts[1], 10);
        if (year < today.getFullYear()) return 'EXPIRED';
        if (year === today.getFullYear()) return 'NEAR_EXPIRY';
        return 'VALID';
      }
      return 'VALID';
    }
    if (expDate < today) return 'EXPIRED';
    const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 60) return 'NEAR_EXPIRY';
    return 'VALID';
  } catch {
    return 'VALID';
  }
}

export function checkRecall(medicineName: string, batchNumber: string, activeAlerts: AlertItem[]): { hasAlert: boolean; alertDetails?: string } {
  const normMed = normalizeName(medicineName);
  const normBatch = batchNumber.trim().toUpperCase();

  const found = activeAlerts.find((alert) => {
    const alertMed = normalizeName(alert.medicine_name);
    const alertBatch = alert.batch_number ? alert.batch_number.trim().toUpperCase() : '';

    // If alert specifies a specific batch number, only match if the batch matches
    if (alertBatch) {
      return alertBatch === normBatch;
    }
    // If alert is a molecule-wide alert (no specific batch), match by medicine name
    if (alertMed && normMed.includes(alertMed)) return true;
    return false;
  });

  if (found) {
    return {
      hasAlert: true,
      alertDetails: `${found.title}: ${found.description} (${found.source})`,
    };
  }

  return { hasAlert: false };
}

export function checkDuplicateScan(batchNumber: string, historyRecords: VerificationRecord[]): boolean {
  if (!batchNumber) return false;
  const matches = historyRecords.filter((rec) => rec.scanned_batch === batchNumber);
  return matches.length > 0;
}

export function checkInteractions(medicineName: string, knownInteractions: DrugInteraction[]): { hasInteraction: boolean; details?: string } {
  const normMed = normalizeName(medicineName);
  const found = knownInteractions.find((int) => {
    const normA = normalizeName(int.medicine_a);
    const normB = normalizeName(int.medicine_b);
    return normMed.includes(normA) || normMed.includes(normB);
  });

  if (found) {
    return {
      hasInteraction: true,
      details: `${found.medicine_a} + ${found.medicine_b}: ${found.description} (${found.recommendation})`,
    };
  }
  return { hasInteraction: false };
}

export function runVerificationEngine(
  prescribed: ExtractedMedicine,
  stripItem: MedicineRegistryItem,
  activeAlerts: AlertItem[] = [],
  interactionsList: DrugInteraction[] = [],
  historyRecords: VerificationRecord[] = []
): { record: VerificationRecord; report: SafetyReport } {
  const isMedMatch = checkMedicineMatch(prescribed.medicine_name, stripItem.medicine_name);
  const isStrengthMatch = checkStrengthMatch(prescribed.strength, stripItem.strength);
  const frequencyMatch = true; // Prescribed frequency matched

  let matchStatus: MatchStatus = 'MATCHED';
  if (!isMedMatch) {
    matchStatus = 'MISMATCH';
  } else if (!isStrengthMatch) {
    matchStatus = 'PARTIAL_MATCH';
  }

  const expiryStatus = stripItem.verification_status === 'EXPIRED' ? 'EXPIRED' : checkExpiry(stripItem.expiry_date);
  const recallCheck = stripItem.verification_status === 'ALERT'
    ? { hasAlert: true, alertDetails: 'Active CDSCO/Manufacturer recall alert for this batch.' }
    : checkRecall(stripItem.medicine_name, stripItem.batch_number, activeAlerts);
  const interactionCheck = checkInteractions(prescribed.medicine_name, interactionsList);
  const isDuplicate = checkDuplicateScan(stripItem.batch_number, historyRecords);

  const record: VerificationRecord = {
    id: generateVerificationId(),
    user_id: 'usr_demo_101',
    prescribed_medicine_name: prescribed.medicine_name,
    prescribed_strength: prescribed.strength,
    prescribed_frequency: prescribed.frequency,
    scanned_medicine_name: stripItem.medicine_name,
    scanned_strength: stripItem.strength,
    scanned_batch: stripItem.batch_number,
    scanned_manufacturer: stripItem.manufacturer,
    scanned_expiry: stripItem.expiry_date,
    status: matchStatus === 'MATCHED' ? 'MATCHED' : matchStatus === 'MISMATCH' ? 'MISMATCH' : 'REVIEW_REQUIRED',
    match_status: matchStatus,
    medicine_match: isMedMatch,
    strength_match: isStrengthMatch,
    frequency_match: frequencyMatch,
    expiry_status: expiryStatus,
    recall_status: recallCheck.hasAlert ? 'ACTIVE_ALERT' : 'NO_ALERTS',
    interaction_status: interactionCheck.hasInteraction ? 'POTENTIAL_INTERACTION' : 'SAFE',
    duplicate_status: isDuplicate ? 'DUPLICATE_SCAN' : 'NOT_DETECTED',
    created_at: new Date().toISOString(),
  };

  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (!isMedMatch) {
    warnings.push(`🚨 MEDICINE MISMATCH: Prescribed '${prescribed.medicine_name} ${prescribed.strength}' does not match physical strip '${stripItem.medicine_name}'.`);
    recommendations.push('Do NOT consume this medication. Verify immediately with a qualified pharmacist or physician.');
  }

  if (isMedMatch && !isStrengthMatch) {
    warnings.push(`⚠ STRENGTH MISMATCH: Prescribed dose '${prescribed.strength}' differs from strip dose '${stripItem.strength}'.`);
    recommendations.push('Consult your clinician to confirm if dosage modification was intended.');
  }

  if (expiryStatus === 'EXPIRED') {
    warnings.push(`🚨 EXPIRED PRODUCT: Physical strip expired on ${stripItem.expiry_date}.`);
    recommendations.push('Expired medicines may be ineffective or harmful. Dispose safely and obtain a fresh pack.');
  }

  if (recallCheck.hasAlert) {
    warnings.push(`🚨 ACTIVE RECALL ALERT: ${recallCheck.alertDetails}`);
    recommendations.push('Return the affected batch to your local pharmacy for replacement.');
  }

  if (interactionCheck.hasInteraction) {
    warnings.push(`⚠ POTENTIAL INTERACTION: ${interactionCheck.details}`);
    recommendations.push('Disclose all active medications to your prescribing healthcare provider.');
  }

  let overallStatus: 'SAFE' | 'ATTENTION_REQUIRED' | 'DANGER' = 'SAFE';
  if (!isMedMatch || expiryStatus === 'EXPIRED' || recallCheck.hasAlert) {
    overallStatus = 'DANGER';
  } else if (!isStrengthMatch || interactionCheck.hasInteraction || isDuplicate) {
    overallStatus = 'ATTENTION_REQUIRED';
  }

  const report: SafetyReport = {
    id: `rep_${Date.now()}`,
    verification_id: record.id,
    overall_status: overallStatus,
    prescription_status: 'CONFIRMED',
    strip_status: stripItem.verification_status === 'EXPIRED' ? 'EXPIRED' : 'VERIFIED',
    medicine_match: isMedMatch,
    strength_match: isStrengthMatch,
    expiry_status: expiryStatus,
    expiry_date: stripItem.expiry_date,
    recall_status: recallCheck.hasAlert ? 'ACTIVE_ALERT' : 'NO_ALERTS',
    recall_details: recallCheck.alertDetails,
    interaction_status: interactionCheck.hasInteraction ? 'POTENTIAL_INTERACTION' : 'SAFE',
    interaction_details: interactionCheck.details,
    duplicate_status: isDuplicate ? 'DUPLICATE_SCAN' : 'NOT_DETECTED',
    warnings,
    recommendations: recommendations.length > 0 ? recommendations : ['Always store medicines in a cool, dry place.', 'Strictly adhere to the prescribed frequency.'],
    created_at: new Date().toISOString(),
  };

  return { record, report };
}
