export type MatchStatus = 'MATCHED' | 'MISMATCH' | 'PARTIAL_MATCH' | 'EXPIRED' | 'ALERT' | 'LOW_CONFIDENCE' | 'PENDING' | 'REVIEW_REQUIRED';
export type VerificationStep = 'PRESCRIPTION' | 'CONFIRM' | 'SCAN_STRIP' | 'SCAN' | 'MATCH' | 'SAFETY_REPORT' | 'SAFETY';

export interface VerificationRecord {
  id: string;
  user_id?: string;
  family_member_name?: string;
  timestamp?: string;
  created_at?: string;
  prescription_id?: string;
  medicine_scan_id?: string;
  pharmacist_id?: string;
  patient_id?: string;
  patient_name?: string;
  prescription_medicine?: string;
  prescribed_medicine_name?: string;
  prescribed_strength?: string;
  prescribed_frequency?: string;
  scanned_medicine?: string;
  scanned_medicine_name?: string;
  scanned_strength?: string;
  scanned_batch?: string;
  batch_number?: string;
  scanned_manufacturer?: string;
  scanned_expiry?: string;
  status?: string;
  match_status: MatchStatus;
  medicine_match: boolean;
  strength_match: boolean;
  frequency_match?: boolean;
  expiry_status: 'VALID' | 'EXPIRED' | 'NEAR_EXPIRY';
  recall_status: 'NO_ALERTS' | 'ACTIVE_ALERT' | 'RECALLED_BATCH';
  interaction_status: 'SAFE' | 'POTENTIAL_INTERACTION';
  duplicate_status: 'NOT_DETECTED' | 'DUPLICATE_SCAN' | 'DUPLICATE_THERAPY';
  notes?: string;
}

export function generateVerificationId(): string {
  return `VER-${Math.floor(100000 + Math.random() * 900000)}`;
}
