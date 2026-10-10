export type CaregiverPermission =
  | 'VIEW_PRESCRIPTIONS'
  | 'MANAGE_REMINDERS'
  | 'VIEW_LAB_REPORTS'
  | 'RECEIVE_EMERGENCY_ALERTS';

export interface CaregiverDelegation {
  id: string;
  patient_id: string;
  patient_name: string;
  caregiver_name: string;
  caregiver_phone: string;
  relationship: string;
  permissions: CaregiverPermission[];
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  granted_at: string;
  expires_at?: string;
  revoked_at?: string;
  revocation_reason?: string;
}
