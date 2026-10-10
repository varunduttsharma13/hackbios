export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export type PrescriptionStatus = 
  | 'DRAFT' 
  | 'APPROVED' 
  | 'SHARING_PENDING' 
  | 'SHARED' 
  | 'DELIVERY_FAILED' 
  | 'VIEWED' 
  | 'PARTIALLY_DISPENSED' 
  | 'DISPENSED' 
  | 'CANCELLED' 
  | 'SUPERSEDED';

export type NotificationDeliveryStatus = 
  | 'PENDING' 
  | 'SENT' 
  | 'DELIVERED' 
  | 'FAILED' 
  | 'RETRY_SCHEDULED' 
  | 'RETRY_EXHAUSTED';

export interface ExtractedMedicine {
  id: string;
  medicine_name: string;
  generic_name?: string;
  active_ingredient?: string;
  strength: string;
  dosage_form?: string; // Tablet, Capsule, Syrup, Injection, etc.
  frequency: string;
  duration: string;
  route?: string; // Oral, Topical, IV, etc.
  instructions?: string;
  quantity?: string;
  confidence_score: number;
  confidence_level: ConfidenceLevel;
  user_confirmed: boolean;
  confirmed_at?: string;
  notes?: string;
}

export interface Prescription {
  id: string;
  version?: number;
  doctor_name: string;
  doctor_id?: string;
  hospital_name?: string;
  doctor_license?: string;
  doctor_ptr?: string;
  patient_id?: string;
  patient_name?: string;
  patient_phone?: string;
  patient_age?: number | string;
  patient_gender?: string;
  patient_address?: string;
  abha_id?: string; // Optional ABDM health ID reference
  prescription_date: string;
  image_url?: string;
  extracted_medicines: ExtractedMedicine[];
  created_at?: string;
  approved_at?: string;
  status?: PrescriptionStatus | string;
  delivery_status?: NotificationDeliveryStatus;
  delivery_timestamp?: string;
  dispensed_at?: string;
  dispensed_by_pharmacy?: string;
  user_id?: string;
  allergy_notes?: string;
  diagnosis?: string;
  follow_up_date?: string;
}
