import { createClient } from '@supabase/supabase-js';
import {
  DEMO_MEDICINES,
  DEMO_VERIFICATION_HISTORY,
  DEMO_ALERTS,
  DEMO_USER,
  DEMO_PATIENTS,
  DEMO_AUDIT_LOGS,
  DEMO_LOLITA_PRESCRIPTION,
  DEMO_PRESCRIPTION,
} from '@/lib/mock/demoData';
import { MedicineRegistryItem } from '@/types/medicine';
import { VerificationRecord } from '@/types/verification';
import { AlertItem } from '@/types/safety';
import { Prescription } from '@/types/prescription';
import { HealthRecord } from '@/types/healthRecords';
import { INITIAL_HEALTH_RECORDS } from '@/lib/data/initialHealthRecords';
import { CaregiverDelegation } from '@/types/family';
import { MedicationReminder, AdherenceStatus } from '@/types/reminders';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !supabaseUrl || !supabaseAnonKey;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper DB client for fetching/saving data with demo fallback
export class DatabaseService {
  static async getMedicines(): Promise<MedicineRegistryItem[]> {
    if (isDemoMode || !supabase) {
      return DEMO_MEDICINES;
    }
    try {
      const { data, error } = await supabase.from('medicine_registry').select('*');
      if (error || !data || data.length === 0) return DEMO_MEDICINES;
      return data as MedicineRegistryItem[];
    } catch {
      return DEMO_MEDICINES;
    }
  }

  static async findMedicineByCode(code: string): Promise<MedicineRegistryItem | null> {
    const medicines = await this.getMedicines();
    const cleanCode = code.trim().toUpperCase();
    const found = medicines.find(
      (m) =>
        m.qr_code.toUpperCase() === cleanCode ||
        m.barcode.toUpperCase() === cleanCode ||
        m.batch_number.toUpperCase() === cleanCode ||
        cleanCode.includes(m.qr_code.toUpperCase()) ||
        cleanCode.includes(m.batch_number.toUpperCase())
    );
    if (found) return found;

    // Fuzzy matching for demo
    if (cleanCode.includes('MET') || cleanCode.includes('500')) {
      return medicines.find((m) => m.medicine_name.toLowerCase().includes('metformin')) || medicines[0];
    }
    if (cleanCode.includes('AZI') || cleanCode.includes('AZ1')) {
      return medicines.find((m) => m.medicine_name.toLowerCase().includes('azithromycin')) || medicines[1];
    }
    if (cleanCode.includes('ATO')) {
      return medicines.find((m) => m.medicine_name.toLowerCase().includes('atorvastatin')) || medicines[2];
    }
    if (cleanCode.includes('PAN')) {
      return medicines.find((m) => m.medicine_name.toLowerCase().includes('pantoprazole')) || medicines[3];
    }
    if (cleanCode.includes('PAR')) {
      return medicines.find((m) => m.medicine_name.toLowerCase().includes('paracetamol')) || medicines[4];
    }
    if (cleanCode.includes('FES') || cleanCode.includes('IRON') || cleanCode.includes('FERROUS')) {
      return medicines.find((m) => m.medicine_name.toLowerCase().includes('ferrous')) || medicines[0];
    }
    if (cleanCode.includes('ASC') || cleanCode.includes('VIT') || cleanCode.includes('VITC')) {
      return medicines.find((m) => m.medicine_name.toLowerCase().includes('ascorbic')) || medicines[0];
    }

    return null;
  }

  static async getVerifications(): Promise<VerificationRecord[]> {
    if (isDemoMode || !supabase) {
      return DEMO_VERIFICATION_HISTORY;
    }
    try {
      const { data, error } = await supabase.from('verifications').select('*').order('created_at', { ascending: false });
      if (error || !data) return DEMO_VERIFICATION_HISTORY;
      return data as VerificationRecord[];
    } catch {
      return DEMO_VERIFICATION_HISTORY;
    }
  }

  static async saveVerification(record: VerificationRecord): Promise<void> {
    if (isDemoMode || !supabase) {
      DEMO_VERIFICATION_HISTORY.unshift(record);
      return;
    }
    try {
      await supabase.from('verifications').insert([record]);
    } catch (err) {
      console.warn('Failed saving to Supabase, pushed to local state:', err);
      DEMO_VERIFICATION_HISTORY.unshift(record);
    }
  }

  static async getAlerts(): Promise<AlertItem[]> {
    if (isDemoMode || !supabase) {
      return DEMO_ALERTS;
    }
    try {
      const { data, error } = await supabase.from('alerts').select('*').eq('active', true);
      if (error || !data) return DEMO_ALERTS;
      return data as AlertItem[];
    } catch {
      return DEMO_ALERTS;
    }
  }

  static async saveAlert(alert: AlertItem): Promise<void> {
    if (isDemoMode || !supabase) {
      DEMO_ALERTS.unshift(alert);
      return;
    }
    try {
      await supabase.from('alerts').insert([alert]);
    } catch (err) {
      console.warn('Failed saving alert to Supabase:', err);
      DEMO_ALERTS.unshift(alert);
    }
  }

  // --- Prescriptions Store & Operations ---
  static memoryPrescriptions: Prescription[] = [
    {
      id: 'DS-10452',
      version: 1,
      doctor_name: 'Dr. J Dela Cruz, MD',
      doctor_id: 'DOC-4921',
      hospital_name: 'Apollo Hospital & Heart Institute',
      doctor_license: 'MCI-DEL-2018-4921',
      doctor_ptr: 'PTR-90214',
      patient_id: 'PAT-10452',
      patient_name: 'Lolita Alvarez',
      patient_phone: '+91 98765 43210',
      patient_age: 39,
      patient_gender: 'Female',
      patient_address: 'B-14 Sector 62, Noida, UP',
      abha_id: '91-4567-8910-1122',
      prescription_date: '2026-10-09',
      image_url: '/demo/prescription_lolita.jpg',
      extracted_medicines: DEMO_LOLITA_PRESCRIPTION.extracted_medicines,
      created_at: '2026-10-09T18:30:00Z',
      approved_at: '2026-10-09T18:30:00Z',
      status: 'APPROVED',
      delivery_status: 'DELIVERED',
      delivery_timestamp: '2026-10-09T18:30:05Z',
      allergy_notes: 'Penicillin, Sulfa drugs',
      diagnosis: 'Iron deficiency anemia, mild clinical fatigue',
      follow_up_date: '2026-11-10',
    },
    {
      id: 'DS-10453',
      version: 1,
      doctor_name: 'Dr. R. K. Sharma, MD',
      doctor_id: 'DOC-3312',
      hospital_name: 'Max Super Speciality Hospital',
      doctor_license: 'MCI-DEL-2015-1102',
      patient_id: 'PAT-10453',
      patient_name: 'Rajesh Kumar',
      patient_phone: '+91 98111 22334',
      patient_age: 54,
      patient_gender: 'Male',
      patient_address: '42 Karol Bagh, Central Delhi',
      abha_id: '91-1122-3344-5566',
      prescription_date: '2026-10-08',
      extracted_medicines: DEMO_PRESCRIPTION.extracted_medicines,
      created_at: '2026-10-08T11:00:00Z',
      approved_at: '2026-10-08T11:05:00Z',
      status: 'DISPENSED',
      delivery_status: 'DELIVERED',
      dispensed_at: '2026-10-08T15:20:00Z',
      dispensed_by_pharmacy: 'Apollo Pharmacy #402',
      diagnosis: 'Type 2 Diabetes Mellitus with hypercholesterolemia',
      follow_up_date: '2026-11-08',
    },
    {
      id: 'RX-2026-0891',
      version: 1,
      doctor_name: 'Dr. Sarah Jenkins, MD',
      doctor_id: 'DOC-9021',
      hospital_name: 'Max Healthcare Institute',
      doctor_license: 'MCI-2018-9921',
      patient_id: 'PAT-10452',
      patient_name: 'Lolita Sharma',
      patient_phone: '+91 98765 43210',
      patient_age: 39,
      patient_gender: 'Female',
      prescription_date: '2026-10-08',
      extracted_medicines: [
        {
          id: 'med-met-500',
          medicine_name: 'Metformin Hydrochloride SR',
          strength: '500 mg',
          dosage_form: 'Tablet',
          frequency: 'Twice daily (BD) with meals',
          duration: '30 days',
          quantity: '60 tablets',
          instructions: 'Take 1 tablet morning after breakfast and 1 tablet after dinner',
          confidence_score: 1.0,
          confidence_level: 'HIGH',
          user_confirmed: true,
        },
        {
          id: 'med-ato-20',
          medicine_name: 'Atorvastatin',
          strength: '20 mg',
          dosage_form: 'Tablet',
          frequency: 'Once daily at night (HS)',
          duration: '30 days',
          quantity: '30 tablets',
          instructions: 'Take 1 tablet at bedtime with water',
          confidence_score: 1.0,
          confidence_level: 'HIGH',
          user_confirmed: true,
        },
      ],
      created_at: '2026-10-08T09:00:00Z',
      approved_at: '2026-10-08T09:05:00Z',
      status: 'APPROVED',
      delivery_status: 'DELIVERED',
      diagnosis: 'Type 2 Diabetes Mellitus & Dyslipidemia maintenance',
      follow_up_date: '2026-11-08',
    },
  ];

  static async getPrescriptions(): Promise<Prescription[]> {
    if (isDemoMode || !supabase) {
      return this.memoryPrescriptions;
    }
    try {
      const { data, error } = await supabase.from('prescriptions').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return this.memoryPrescriptions;
      return data as Prescription[];
    } catch {
      return this.memoryPrescriptions;
    }
  }

  static async getPrescriptionById(id: string): Promise<Prescription | null> {
    const list = await this.getPrescriptions();
    const cleanId = id.trim().toUpperCase();
    return list.find((p) => p.id.toUpperCase() === cleanId) || null;
  }

  static async savePrescription(prescription: Prescription): Promise<Prescription> {
    const existingIdx = this.memoryPrescriptions.findIndex((p) => p.id === prescription.id);
    if (existingIdx >= 0) {
      this.memoryPrescriptions[existingIdx] = prescription;
    } else {
      this.memoryPrescriptions.unshift(prescription);
    }

    if (!isDemoMode && supabase) {
      try {
        await supabase.from('prescriptions').upsert([prescription]);
      } catch (err) {
        console.warn('Failed saving prescription to Supabase, saved to memory:', err);
      }
    }
    return prescription;
  }

  static async updatePrescription(id: string, updates: Partial<Prescription>): Promise<Prescription | null> {
    const existing = await this.getPrescriptionById(id);
    if (!existing) return null;
    const updated: Prescription = { ...existing, ...updates };
    return this.savePrescription(updated);
  }

  // --- Health Records Store & Operations ---
  static memoryHealthRecords: HealthRecord[] = [...INITIAL_HEALTH_RECORDS];

  static async getHealthRecords(patientId?: string): Promise<HealthRecord[]> {
    if (patientId) {
      return this.memoryHealthRecords.filter((r) => r.patient_id === patientId);
    }
    return this.memoryHealthRecords;
  }

  static async saveHealthRecord(record: HealthRecord): Promise<HealthRecord> {
    const existingIdx = this.memoryHealthRecords.findIndex((r) => r.id === record.id);
    if (existingIdx >= 0) {
      this.memoryHealthRecords[existingIdx] = record;
    } else {
      this.memoryHealthRecords.unshift(record);
    }

    if (!isDemoMode && supabase) {
      try {
        await supabase.from('health_records').upsert([record]);
      } catch (err) {
        console.warn('Failed saving health record to Supabase, saved to memory:', err);
      }
    }
    return record;
  }

  static async updateHealthRecord(id: string, updates: Partial<HealthRecord>): Promise<HealthRecord | null> {
    const existingIdx = this.memoryHealthRecords.findIndex((r) => r.id === id);
    if (existingIdx < 0) return null;
    const updated: HealthRecord = {
      ...this.memoryHealthRecords[existingIdx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.memoryHealthRecords[existingIdx] = updated;
    return updated;
  }

  static async deleteHealthRecord(id: string): Promise<boolean> {
    const initialLen = this.memoryHealthRecords.length;
    this.memoryHealthRecords = this.memoryHealthRecords.filter((r) => r.id !== id);
    return this.memoryHealthRecords.length < initialLen;
  }

  // --- Audit Logs Store & Operations ---
  static memoryAuditLogs: any[] = [...DEMO_AUDIT_LOGS];

  static async getAuditLogs(): Promise<any[]> {
    return this.memoryAuditLogs;
  }

  static async saveAuditLog(entry: any): Promise<any> {
    this.memoryAuditLogs.unshift(entry);
    return entry;
  }

  // --- Patients Store & Operations ---
  static memoryPatients: any[] = [...DEMO_PATIENTS];

  static async getPatients(): Promise<any[]> {
    return this.memoryPatients;
  }

  static async savePatient(patient: any): Promise<any> {
    const idx = this.memoryPatients.findIndex((p) => p.id === patient.id);
    if (idx >= 0) {
      this.memoryPatients[idx] = patient;
    } else {
      this.memoryPatients.push(patient);
    }
    return patient;
  }

  // --- Adherence Logs Store & Operations ---
  static memoryAdherenceLogs: {
    id: string;
    reminder_id: string;
    patient_id: string;
    medicine_name: string;
    status: AdherenceStatus;
    logged_at: string;
    notes?: string;
  }[] = [
    {
      id: 'adh-1',
      reminder_id: 'rem-metformin-morning',
      patient_id: 'PAT-10452',
      medicine_name: 'Metformin 500mg',
      status: 'TAKEN',
      logged_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      notes: 'Taken on time after breakfast',
    },
    {
      id: 'adh-2',
      reminder_id: 'rem-atorvastatin-night',
      patient_id: 'PAT-10452',
      medicine_name: 'Atorvastatin 20mg',
      status: 'TAKEN',
      logged_at: new Date(Date.now() - 3600000 * 26).toISOString(),
      notes: 'Taken before bedtime',
    },
  ];

  static async getAdherenceLogs(patientId?: string) {
    if (patientId) {
      return this.memoryAdherenceLogs.filter((l) => l.patient_id === patientId);
    }
    return this.memoryAdherenceLogs;
  }

  static async saveAdherenceLog(entry: {
    reminder_id: string;
    patient_id: string;
    medicine_name: string;
    status: AdherenceStatus;
    notes?: string;
  }) {
    const newLog = {
      id: `adh-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...entry,
      logged_at: new Date().toISOString(),
    };
    // Update or insert into memory
    const existingIdx = this.memoryAdherenceLogs.findIndex(
      (l) => l.reminder_id === entry.reminder_id && l.patient_id === entry.patient_id
    );
    if (existingIdx >= 0) {
      this.memoryAdherenceLogs[existingIdx] = newLog;
    } else {
      this.memoryAdherenceLogs.unshift(newLog);
    }
    return newLog;
  }

  // --- Caregiver & Family Delegations Store & Operations ---
  static memoryCaregiverDelegations: CaregiverDelegation[] = [
    {
      id: 'del-101',
      patient_id: 'PAT-10452',
      patient_name: 'Lolita Sharma',
      caregiver_name: 'Amit Sharma',
      caregiver_phone: '+91 98765 43210',
      relationship: 'Son / Primary Caregiver',
      permissions: ['VIEW_PRESCRIPTIONS', 'MANAGE_REMINDERS', 'VIEW_LAB_REPORTS', 'RECEIVE_EMERGENCY_ALERTS'],
      status: 'ACTIVE',
      granted_at: '2026-10-01T08:00:00Z',
      expires_at: '2027-10-01T08:00:00Z',
    },
    {
      id: 'del-102',
      patient_id: 'PAT-10452',
      patient_name: 'Lolita Sharma',
      caregiver_name: 'Pooja Sharma',
      caregiver_phone: '+91 98765 11223',
      relationship: 'Daughter-in-law',
      permissions: ['VIEW_PRESCRIPTIONS', 'MANAGE_REMINDERS'],
      status: 'ACTIVE',
      granted_at: '2026-10-05T10:30:00Z',
      expires_at: '2027-10-05T10:30:00Z',
    },
  ];

  static async getCaregiverDelegations(patientId?: string): Promise<CaregiverDelegation[]> {
    if (patientId) {
      return this.memoryCaregiverDelegations.filter((d) => d.patient_id === patientId);
    }
    return this.memoryCaregiverDelegations;
  }

  static async saveCaregiverDelegation(delegation: CaregiverDelegation): Promise<CaregiverDelegation> {
    const idx = this.memoryCaregiverDelegations.findIndex((d) => d.id === delegation.id);
    if (idx >= 0) {
      this.memoryCaregiverDelegations[idx] = delegation;
    } else {
      this.memoryCaregiverDelegations.unshift(delegation);
    }
    return delegation;
  }

  static async revokeCaregiverDelegation(id: string, reason?: string): Promise<CaregiverDelegation | null> {
    const idx = this.memoryCaregiverDelegations.findIndex((d) => d.id === id);
    if (idx < 0) return null;
    this.memoryCaregiverDelegations[idx] = {
      ...this.memoryCaregiverDelegations[idx],
      status: 'REVOKED',
      revoked_at: new Date().toISOString(),
      revocation_reason: reason || 'Access revoked by patient',
    };
    return this.memoryCaregiverDelegations[idx];
  }

  // --- Refill Requests Store & Operations ---
  static memoryRefillRequests: {
    id: string;
    prescription_id: string;
    patient_id: string;
    patient_name: string;
    medicines: string[];
    requested_days: number;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    requested_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    notes?: string;
  }[] = [
    {
      id: 'ref-501',
      prescription_id: 'RX-2026-0891',
      patient_id: 'PAT-10452',
      patient_name: 'Lolita Sharma',
      medicines: ['Metformin 500mg SR', 'Atorvastatin 20mg'],
      requested_days: 30,
      reason: 'Chronic therapy routine monthly maintenance renewal',
      status: 'PENDING',
      requested_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      notes: 'Previous prescription dispensed 30 days ago, adherence 95%',
    },
  ];

  static async getRefillRequests(prescriptionId?: string) {
    if (prescriptionId) {
      return this.memoryRefillRequests.filter((r) => r.prescription_id === prescriptionId);
    }
    return this.memoryRefillRequests;
  }

  static async saveRefillRequest(req: {
    prescription_id: string;
    patient_id: string;
    patient_name: string;
    medicines: string[];
    requested_days: number;
    reason: string;
  }) {
    const newReq = {
      id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      ...req,
      status: 'PENDING' as const,
      requested_at: new Date().toISOString(),
    };
    this.memoryRefillRequests.unshift(newReq);
    return newReq;
  }

  static async reviewRefillRequest(
    id: string,
    status: 'APPROVED' | 'REJECTED',
    doctorName: string,
    notes?: string
  ) {
    const idx = this.memoryRefillRequests.findIndex((r) => r.id === id);
    if (idx < 0) return null;
    this.memoryRefillRequests[idx] = {
      ...this.memoryRefillRequests[idx],
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: doctorName,
      notes: notes || undefined,
    };
    return this.memoryRefillRequests[idx];
  }
}

