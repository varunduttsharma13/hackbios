export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  medicine_name: string;
  batch_number?: string;
  severity: AlertSeverity;
  source: string;
  date: string;
  active: boolean;
}

export interface DrugInteraction {
  id?: string;
  medicine_a: string;
  medicine_b: string;
  description: string;
  recommendation: string;
  severity?: 'HIGH' | 'MODERATE' | 'LOW';
}

export interface SafetyReport {
  id?: string;
  verification_id?: string;
  overall_status: 'SAFE' | 'WARNING' | 'DANGER' | 'ATTENTION_REQUIRED';
  prescription_status?: 'CONFIRMED' | 'PENDING' | 'REJECTED';
  strip_status?: 'VERIFIED' | 'EXPIRED' | 'UNVERIFIED' | 'ALERT';
  medicine_match: boolean;
  strength_match: boolean;
  expiry_status: 'VALID' | 'EXPIRED' | 'NEAR_EXPIRY';
  expiry_date?: string;
  recall_status: 'NO_ALERTS' | 'ACTIVE_ALERT' | 'RECALLED_BATCH';
  recall_details?: string;
  interaction_status: 'SAFE' | 'POTENTIAL_INTERACTION';
  interaction_details?: string;
  duplicate_status: 'NOT_DETECTED' | 'DUPLICATE_SCAN' | 'DUPLICATE_THERAPY';
  alerts?: AlertItem[];
  interactions?: DrugInteraction[];
  summary?: string;
  warnings?: string[];
  recommendations?: string[];
  created_at?: string;
}
