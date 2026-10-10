import {
  checkMedicineMatch,
  checkStrengthMatch,
  checkExpiry,
  checkRecall,
  checkDuplicateScan,
  checkInteractions,
  runVerificationEngine,
} from '../lib/safety/engine';
import { ExtractedMedicine } from '../types/prescription';
import { MedicineRegistryItem } from '../types/medicine';
import { AlertItem, DrugInteraction } from '../types/safety';

console.log('🧪 RUNNING MED-BRIDGE DETERMINISTIC SAFETY ENGINE TEST SUITE...\n');

let passedTests = 0;
let totalTests = 0;

function assert(description: string, condition: boolean) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${description}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${description}`);
    process.exitCode = 1;
  }
}

// TEST SUITE 1: MEDICINE IDENTITY & SALT MATCHING
console.log('--- Suite 1: Medicine Identity Matching ---');
assert('Exact name match matches', checkMedicineMatch('Paracetamol', 'Paracetamol'));
assert('Synonym / clinical salt alias matches (FeSO4 -> Ferrous Sulfate)', checkMedicineMatch('FeSO4', 'Ferrous Sulfate'));
assert('Brand to generic alias matches (Crocin -> Paracetamol)', checkMedicineMatch('Crocin', 'Paracetamol'));
assert('Completely different medicines do NOT match (Metformin vs Paracetamol)', !checkMedicineMatch('Metformin', 'Paracetamol'));
assert('Empty prescribed name fails safely (never false positive)', !checkMedicineMatch('', 'Paracetamol'));
assert('Empty scanned name fails safely (never false positive)', !checkMedicineMatch('Paracetamol', ''));
assert('Whitespace only names fail safely', !checkMedicineMatch('   ', '   '));

// TEST SUITE 2: STRENGTH TOLERANCE & COMPLETENESS
console.log('\n--- Suite 2: Strength Matching & Missing Data ---');
assert('Matching strength matches (325 mg vs 325 mg)', checkStrengthMatch('325 mg', '325 mg'));
assert('Clinical elemental iron equivalence matches (325 mg FeSO4 / 65 mg elemental iron)', checkStrengthMatch('325 mg', '65 mg'));
assert('Different strengths do NOT match (10 mg vs 20 mg)', !checkStrengthMatch('10 mg', '20 mg'));
assert('Missing prescribed strength fails safely (never assumes match)', !checkStrengthMatch('', '500 mg'));
assert('Missing scanned strength fails safely (never assumes match)', !checkStrengthMatch('500 mg', ''));
assert('Both missing strengths fail safely', !checkStrengthMatch('', ''));

// TEST SUITE 3: EXPIRY EVALUATION
console.log('\n--- Suite 3: Expiry Evaluation ---');
assert('Future date is VALID', checkExpiry('2028-12-31') === 'VALID');
assert('Past date is EXPIRED', checkExpiry('2023-01-01') === 'EXPIRED');

// TEST SUITE 4: RECALL & HAZARD DETECTION
console.log('\n--- Suite 4: CDSCO Recall Batch Alerts ---');
const sampleAlerts: AlertItem[] = [
  {
    id: 'alt_1',
    medicine_name: 'Metformin',
    batch_number: 'MET-RECALL-99',
    severity: 'CRITICAL',
    title: 'NDMA Impurity Recall',
    description: 'Voluntary recall of Metformin batch',
    source: 'CDSCO',
    date: '2026-03-01',
    active: true,
  },
];
assert('Matching recalled batch is flagged as alert', checkRecall('Metformin', 'MET-RECALL-99', sampleAlerts).hasAlert === true);
assert('Unrelated safe batch has no recall alert', checkRecall('Metformin', 'MET-SAFE-01', sampleAlerts).hasAlert === false);

// TEST SUITE 5: DRUG INTERACTIONS
console.log('\n--- Suite 5: Drug Interactions ---');
const sampleInteractions: DrugInteraction[] = [
  {
    medicine_a: 'Warfarin',
    medicine_b: 'Paracetamol',
    severity: 'MODERATE',
    description: 'High-dose paracetamol may potentiate anticoagulant effect',
    recommendation: 'Monitor INR closely',
  },
];
assert('Known interacting pair is identified', checkInteractions('Warfarin', sampleInteractions).hasInteraction === true);
assert('Non-interacting drug is cleared', checkInteractions('Amoxicillin', sampleInteractions).hasInteraction === false);

// TEST SUITE 6: FULL VERIFICATION ENGINE INTEGRATION
console.log('\n--- Suite 6: Full Verification Engine Execution ---');

const safePrescription: ExtractedMedicine = {
  id: 'm1',
  medicine_name: 'Ferrous Sulfate',
  strength: '325 mg',
  frequency: 'Once a day',
  duration: '30 days',
  confidence_score: 98,
  confidence_level: 'HIGH',
  user_confirmed: true,
};

const safeStrip: MedicineRegistryItem = {
  id: 's1',
  medicine_name: 'Ferrous Sulfate',
  generic_name: 'Ferrous Sulfate',
  strength: '325 mg',
  batch_number: 'BATCH-SAFE-101',
  manufacture_date: '2025-10-01',
  expiry_date: '2027-10-31',
  manufacturer: 'Sun Pharma',
  qr_code: 'DS-QR-101',
  barcode: '8901234567890',
  verification_status: 'VERIFIED',
};

const resExact = runVerificationEngine(safePrescription, safeStrip);
assert('Correct medicine produces MATCHED status', resExact.record.match_status === 'MATCHED');
assert('Correct medicine produces overall SAFE status', resExact.report.overall_status === 'SAFE');

// Wrong medicine test
const wrongStrip: MedicineRegistryItem = {
  ...safeStrip,
  medicine_name: 'Metformin Hydrochloride',
  strength: '500 mg',
};
const resMismatch = runVerificationEngine(safePrescription, wrongStrip);
assert('Wrong medicine produces MISMATCH status', resMismatch.record.match_status === 'MISMATCH');
assert('Wrong medicine produces overall DANGER status', resMismatch.report.overall_status === 'DANGER');

// Expired strip test
const expiredStrip: MedicineRegistryItem = {
  ...safeStrip,
  expiry_date: '2022-01-01',
  verification_status: 'EXPIRED',
};
const resExpired = runVerificationEngine(safePrescription, expiredStrip);
assert('Expired strip produces DANGER status with EXPIRED alert', resExpired.report.overall_status === 'DANGER');

console.log(`\n==============================================`);
console.log(`📊 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log(`==============================================\n`);

if (passedTests === totalTests) {
  console.log('🎉 ALL SAFETY ENGINE DETERMINISTIC TESTS PASSED WITH 100% ACCURACY!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED.');
  process.exit(1);
}
