export type UserRole = 'user' | 'patient' | 'doctor' | 'pharmacist' | 'admin';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age?: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
  family_members: FamilyMember[];
  role: UserRole;
  license_number?: string;
  hospital_affiliation?: string;
  pharmacy_name?: string;
  pharmacy_license?: string;
}

export interface PatientRecord {
  id: string; // Internal Patient ID (e.g. PAT-10452)
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address: string;
  abha_id?: string; // Optional ABDM ID (e.g. 91-4567-8910-1122)
  emergency_contact?: string;
  known_allergies?: string[];
  chronic_conditions?: string[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor_id: string;
  actor_name: string;
  actor_role: UserRole;
  action: string;
  target_resource: string;
  details: string;
  ip_or_hash?: string;
}
