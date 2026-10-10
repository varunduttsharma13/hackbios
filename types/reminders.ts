export type ReminderTimeSlot = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT';

export type AdherenceStatus = 'SCHEDULED' | 'TAKEN' | 'SKIPPED' | 'SNOOZED';

export interface MedicationReminder {
  id: string;
  patient_id: string;
  patient_name: string;
  prescription_id: string;
  medicine_name: string;
  strength: string;
  dosage_form?: string;
  slot: ReminderTimeSlot;
  time_label: string; // e.g. "08:00 AM"
  instructions: string; // e.g. "Take after breakfast with water"
  status: AdherenceStatus;
  logged_at?: string;
  notes?: string;
}

export interface AdherenceMetric {
  total_scheduled: number;
  taken_count: number;
  skipped_count: number;
  snoozed_count: number;
  adherence_rate: number; // 0 - 100 percentage
  streak_days: number;
}
