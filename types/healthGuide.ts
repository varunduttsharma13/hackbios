export type ConditionCategoryKey =
  | 'FEVER'
  | 'COLD_NASAL'
  | 'COUGH_THROAT'
  | 'ALLERGIES'
  | 'HEADACHE'
  | 'STOMACH_DIGESTIVE'
  | 'BODY_PAIN'
  | 'SKIN'
  | 'EYE_EAR'
  | 'ORAL_HEALTH'
  | 'CHILD_HEALTH'
  | 'OTHER';

export interface HealthCondition {
  id: string;
  name: string;
  hindiName: string;
  category: ConditionCategoryKey;
  categoryLabel: string;
  iconName: string;
  shortSummary: string;
  overview: string;
  commonSymptoms: string[];
  generalSelfCare: string[];
  medicineCategories: {
    name: string;
    description: string;
    commonExamples: string[];
  }[];
  relatedMedicineIds: string[];
  importantPrecautions: string[];
  whenToContactDoctor: string[];
  emergencyWarningSigns: string[];
  clinicalDisclaimer: string;
}

export interface MedicineMonograph {
  id: string;
  genericName: string;
  hindiName: string;
  brandExamples: string[];
  drugClass: string;
  schedule: string; // e.g. 'Over-the-Counter (OTC)', 'Schedule H (Prescription Required)'
  dosageForms: string[];
  typicalStrengths: string[];
  generalPurpose: string;
  commonIndications: string[];
  importantPrecautions: string[];
  knownSideEffects: string[];
  potentialInteractions: string[];
  storageGuidelines: string;
  source: string;
  lastReviewedDate: string;
  reviewStatus: 'CLINICALLY_REVIEWED' | 'STANDARD_EDUCATIONAL_COMPLIANT';
  isEducationalOnly: boolean;
  relatedConditionIds: string[];
}
