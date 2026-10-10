export type HealthRecordCategory =
  | 'DIGITAL_PRESCRIPTION'
  | 'DOCTOR_PRESCRIPTION'
  | 'MEDICINE_HISTORY'
  | 'LAB_REPORT'
  | 'BLOOD_TEST'
  | 'IMAGING_REPORT'
  | 'ALLERGY_RECORD'
  | 'MEDICAL_CONDITION'
  | 'VACCINATION'
  | 'DISCHARGE_SUMMARY'
  | 'DOCTOR_VISIT_NOTE'
  | 'MEDICAL_CERTIFICATE'
  | 'OTHER_DOCUMENT';

export type HealthRecordSource =
  | 'USER_UPLOAD'
  | 'AI_EXTRACTED'
  | 'DOCTOR_CONFIRMED'
  | 'TRUSTED_IMPORT';

export type HealthRecordVerificationStatus =
  | 'UNVERIFIED'
  | 'REVIEWED'
  | 'CLINICALLY_CONFIRMED';

export interface HealthRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  title: string;
  category: HealthRecordCategory;
  record_date: string;
  doctor_or_institution?: string;
  description?: string;
  tags: string[];
  file_url?: string;
  file_name?: string;
  file_size?: number; // bytes
  file_type?: string; // MIME or extension
  source: HealthRecordSource;
  verification_status: HealthRecordVerificationStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ImportOptions {
  duplicateHandling: 'SKIP' | 'UPDATE' | 'IMPORT_ANYWAY';
  defaultCategory?: HealthRecordCategory;
}

export interface ImportSummary {
  totalRows: number;
  importedCount: number;
  skippedCount: number;
  duplicateCount: number;
  errors: { row: number; error: string; rawData?: any }[];
  importedRecords: HealthRecord[];
}

export interface HealthRecordFilter {
  category?: HealthRecordCategory | 'ALL';
  source?: HealthRecordSource | 'ALL';
  verification_status?: HealthRecordVerificationStatus | 'ALL';
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  tag?: string;
}

export const HEALTH_RECORD_CATEGORIES: {
  key: HealthRecordCategory;
  label: string;
  hindiLabel: string;
  description: string;
}[] = [
  { key: 'DIGITAL_PRESCRIPTION', label: 'Digital Prescriptions', hindiLabel: 'डिजिटल नुस्खा', description: 'Digitally verified prescriptions with QR code' },
  { key: 'DOCTOR_PRESCRIPTION', label: 'Doctor Prescriptions', hindiLabel: 'डॉक्टर का नुस्खा', description: 'Physical prescription scans and handwritten doctor notes' },
  { key: 'MEDICINE_HISTORY', label: 'Medicine History', hindiLabel: 'दवा इतिहास', description: 'Past courses, chronic medications, and dosage timelines' },
  { key: 'LAB_REPORT', label: 'Laboratory Reports', hindiLabel: 'लैब रिपोर्ट', description: 'Biochemical, pathology, and diagnostic lab test reports' },
  { key: 'BLOOD_TEST', label: 'Blood Test Reports', hindiLabel: 'रक्त परीक्षण', description: 'Complete Blood Count (CBC), Lipid, HbA1c, Liver & Kidney panels' },
  { key: 'IMAGING_REPORT', label: 'Imaging Reports', hindiLabel: 'इमेजिंग रिपोर्ट', description: 'X-Ray, Ultrasound, CT Scan, and MRI findings' },
  { key: 'ALLERGY_RECORD', label: 'Allergy Records', hindiLabel: 'एलर्जी रिकॉर्ड', description: 'Drug allergies, food sensitivities, and reaction severity' },
  { key: 'MEDICAL_CONDITION', label: 'Existing Medical Conditions', hindiLabel: 'स्वास्थ्य स्थिति', description: 'Hypertension, Diabetes, Asthma, and ongoing diagnoses' },
  { key: 'VACCINATION', label: 'Vaccination Records', hindiLabel: 'टीकाकरण रिकॉर्ड', description: 'Immunization certificates, boosters, and travel vaccines' },
  { key: 'DISCHARGE_SUMMARY', label: 'Hospital Discharge Summaries', hindiLabel: 'डिस्चार्ज सारांश', description: 'Hospitalization summaries, surgery notes, and post-op care' },
  { key: 'DOCTOR_VISIT_NOTE', label: 'Doctor Visit Notes', hindiLabel: 'परामर्श नोट्स', description: 'Outpatient consultation summaries and clinician advice' },
  { key: 'MEDICAL_CERTIFICATE', label: 'Medical Certificates', hindiLabel: 'चिकित्सा प्रमाण पत्र', description: 'Fitness certificates, sick leaves, and disability records' },
  { key: 'OTHER_DOCUMENT', label: 'Other Medical Documents', hindiLabel: 'अन्य दस्तावेज़', description: 'Bills, insurance claim approvals, and general records' },
];

export const RECORD_CATEGORY_META: Record<
  HealthRecordCategory,
  { label: string; hindiLabel: string; badgeBg: string; badgeText: string; badgeBorder: string }
> = {
  DIGITAL_PRESCRIPTION: {
    label: 'Digital Prescription',
    hindiLabel: 'डिजिटल नुस्खा',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
    badgeBorder: 'border-teal-200',
  },
  DOCTOR_PRESCRIPTION: {
    label: 'Doctor Prescription',
    hindiLabel: 'डॉक्टर का नुस्खा',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    badgeBorder: 'border-blue-200',
  },
  MEDICINE_HISTORY: {
    label: 'Medicine History',
    hindiLabel: 'दवा इतिहास',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    badgeBorder: 'border-purple-200',
  },
  LAB_REPORT: {
    label: 'Laboratory Report',
    hindiLabel: 'लैब रिपोर्ट',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
  },
  BLOOD_TEST: {
    label: 'Blood Test Report',
    hindiLabel: 'रक्त परीक्षण',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-800',
    badgeBorder: 'border-rose-200',
  },
  IMAGING_REPORT: {
    label: 'Imaging Report (X-Ray/MRI)',
    hindiLabel: 'इमेजिंग रिपोर्ट',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-800',
    badgeBorder: 'border-sky-200',
  },
  ALLERGY_RECORD: {
    label: 'Allergy Record',
    hindiLabel: 'एलर्जी रिकॉर्ड',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
  },
  MEDICAL_CONDITION: {
    label: 'Medical Condition',
    hindiLabel: 'स्वास्थ्य स्थिति',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    badgeBorder: 'border-indigo-200',
  },
  VACCINATION: {
    label: 'Vaccination Certificate',
    hindiLabel: 'टीकाकरण रिकॉर्ड',
    badgeBg: 'bg-cyan-50',
    badgeText: 'text-cyan-800',
    badgeBorder: 'border-cyan-200',
  },
  DISCHARGE_SUMMARY: {
    label: 'Discharge Summary',
    hindiLabel: 'डिस्चार्ज सारांश',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    badgeBorder: 'border-slate-300',
  },
  DOCTOR_VISIT_NOTE: {
    label: 'Doctor Visit Note',
    hindiLabel: 'परामर्श नोट्स',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-800',
    badgeBorder: 'border-teal-200',
  },
  MEDICAL_CERTIFICATE: {
    label: 'Medical Certificate',
    hindiLabel: 'चिकित्सा प्रमाण पत्र',
    badgeBg: 'bg-green-50',
    badgeText: 'text-green-800',
    badgeBorder: 'border-green-200',
  },
  OTHER_DOCUMENT: {
    label: 'Other Medical Document',
    hindiLabel: 'अन्य दस्तावेज़',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
  },
};

