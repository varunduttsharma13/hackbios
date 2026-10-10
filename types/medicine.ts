export type VerificationStatus = 'VERIFIED' | 'EXPIRED' | 'ALERT' | 'UNVERIFIED' | 'COUNTERFEIT';

export interface MedicineRegistryItem {
  id: string;
  medicine_name: string;
  generic_name: string;
  strength: string;
  manufacturer: string;
  batch_number: string;
  manufacture_date: string;
  expiry_date: string;
  qr_code: string;
  barcode: string;
  verification_status: VerificationStatus;
  form?: string;
  prescription_required?: boolean;
  uses?: string[];
  side_effects?: string[];
  precautions?: string[];
  storage?: string;
  description?: string;
  detected_raw_text?: string;
  confidence_score?: number;
}
