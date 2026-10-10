'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, FamilyMember } from '@/types/user';
import { Prescription, ExtractedMedicine } from '@/types/prescription';
import { MedicineRegistryItem } from '@/types/medicine';
import { VerificationRecord, VerificationStep, generateVerificationId } from '@/types/verification';
import { SafetyReport, AlertItem } from '@/types/safety';
import {
  DEMO_USER,
  DEMO_MEDICINES,
  DEMO_ALERTS,
  DEMO_VERIFICATION_HISTORY,
  DEMO_PRESCRIPTION,
  DEMO_LOLITA_PRESCRIPTION,
  DEMO_SAIRAM_PRESCRIPTION,
  DEMO_DOD_PRESCRIPTION,
  DEMO_INTERACTIONS,
  DEMO_PATIENTS,
  DEMO_AUDIT_LOGS,
} from '@/lib/mock/demoData';
import { runVerificationEngine } from '@/lib/safety/engine';
import { DatabaseService } from '@/lib/db/supabase';
import { apiRequest } from '@/lib/api/client';
import { getNotificationProvider } from '@/lib/notifications/smsService';
import { HealthRecord } from '@/types/healthRecords';
import { INITIAL_HEALTH_RECORDS } from '@/lib/data/initialHealthRecords';

interface VerificationContextType {
  user: User | null;
  isLoggedIn: boolean;
  activeFamilyMember: FamilyMember;
  selectFamilyMember: (member: FamilyMember) => void;
  loginUser: (phone: string, otp: string) => boolean;
  logoutUser: () => void;

  // Active Scan Workflow State Machine
  verificationId: string;
  currentStep: VerificationStep;
  setStep: (step: VerificationStep) => void;
  prescriptionImage: string | null;
  doctorName: string;
  doctorLicense: string;
  doctorPtr: string;
  prescriptionDate: string;
  patientName: string;
  patientAge: string | number;
  patientGender: string;
  patientAddress: string;
  extractedMedicines: ExtractedMedicine[];
  selectedPrescriptionMedIndex: number;
  scannedStrip: MedicineRegistryItem | null;
  currentVerification: VerificationRecord | null;
  currentSafetyReport: SafetyReport | null;
  isAnalyzing: boolean;

  // Workflow Actions
  setPrescriptionImage: (url: string) => void;
  setExtractedMedicines: (
    medicines: ExtractedMedicine[],
    docName?: string,
    date?: string,
    patientInfo?: {
      name?: string;
      age?: string | number;
      gender?: string;
      address?: string;
      doctorLicense?: string;
      doctorPtr?: string;
    }
  ) => void;
  updateExtractedMedicine: (index: number, updated: Partial<ExtractedMedicine>) => void;
  addExtractedMedicine: (medicine: ExtractedMedicine) => void;
  removeExtractedMedicine: (index: number) => void;
  selectPrescriptionMedIndex: (index: number) => void;
  setScannedStrip: (strip: MedicineRegistryItem) => void;
  runMatchVerification: (customStrip?: MedicineRegistryItem) => { record: VerificationRecord; report: SafetyReport } | null;
  resetWorkflow: () => void;
  triggerDemoScenario: (
    scenario: 'MATCH' | 'MISMATCH' | 'EXPIRED' | 'LOW_CONFIDENCE' | 'ALERT' | 'LOLITA_SAFE' | 'SAIRAM_SAFE' | 'DOD_SAFE'
  ) => void;

  // App Data & History
  history: VerificationRecord[];
  alerts: AlertItem[];
  medicines: MedicineRegistryItem[];
  viewHistoryRecord: (recordId: string) => void;
  createAlert: (alert: AlertItem) => Promise<void>;
  addMedicineRegistryItem: (item: MedicineRegistryItem) => Promise<void>;

  // Healthcare Network State (Doctor, Patient, Pharmacy, Admin)
  activeRole: 'doctor' | 'patient' | 'pharmacist' | 'admin';
  setActiveRole: (role: 'doctor' | 'patient' | 'pharmacist' | 'admin') => void;
  prescriptions: Prescription[];
  patients: typeof DEMO_PATIENTS;
  auditLogs: typeof DEMO_AUDIT_LOGS;
  createOrUpdatePrescription: (prescription: Partial<Prescription>) => Prescription;
  finalizeAndSharePrescription: (prescriptionId: string) => Promise<{ success: boolean; prescription: Prescription; notification: any }>;
  recordDispensing: (prescriptionId: string, pharmacyName: string, notes?: string) => Promise<Prescription>;
  getPrescriptionById: (prescriptionId: string) => Prescription | undefined;

  // Health Records Manager
  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>) => HealthRecord;
  updateHealthRecord: (id: string, updates: Partial<HealthRecord>) => void;
  deleteHealthRecord: (id: string) => void;
  importHealthRecords: (newRecords: HealthRecord[]) => void;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeFamilyMember, setActiveFamilyMember] = useState<FamilyMember>({
    id: 'f_lolita',
    name: 'Lolita Alvarez',
    relation: 'Patient (Self)',
    age: 39,
  });

  // Workflow State Machine (defaults to Lolita Alvarez prescription)
  const [verificationId, setVerificationId] = useState<string>(generateVerificationId());
  const [currentStep, setCurrentStep] = useState<VerificationStep>('PRESCRIPTION');
  const [prescriptionImage, setPrescriptionImageState] = useState<string | null>(DEMO_LOLITA_PRESCRIPTION.image_url || '/demo/prescription_lolita.jpg');
  const [doctorName, setDoctorName] = useState<string>(DEMO_LOLITA_PRESCRIPTION.doctor_name || 'Dr. J Dela Cruz, MD');
  const [doctorLicense, setDoctorLicense] = useState<string>(DEMO_LOLITA_PRESCRIPTION.doctor_license || '12345');
  const [doctorPtr, setDoctorPtr] = useState<string>(DEMO_LOLITA_PRESCRIPTION.doctor_ptr || '1234567');
  const [prescriptionDate, setPrescriptionDate] = useState<string>(DEMO_LOLITA_PRESCRIPTION.prescription_date || '2013-02-05');
  const [patientName, setPatientName] = useState<string>(DEMO_LOLITA_PRESCRIPTION.patient_name || 'Lolita Alvarez');
  const [patientAge, setPatientAge] = useState<string | number>(DEMO_LOLITA_PRESCRIPTION.patient_age || 39);
  const [patientGender, setPatientGender] = useState<string>(DEMO_LOLITA_PRESCRIPTION.patient_gender || 'Female');
  const [patientAddress, setPatientAddress] = useState<string>(DEMO_LOLITA_PRESCRIPTION.patient_address || 'Bagong Ilog, Pasig City');
  const [extractedMedicines, setExtractedMedicinesState] = useState<ExtractedMedicine[]>(DEMO_LOLITA_PRESCRIPTION.extracted_medicines);
  const [selectedPrescriptionMedIndex, setSelectedPrescriptionMedIndex] = useState<number>(0);
  const [scannedStrip, setScannedStripState] = useState<MedicineRegistryItem | null>(null);
  const [currentVerification, setCurrentVerification] = useState<VerificationRecord | null>(null);
  const [currentSafetyReport, setCurrentSafetyReport] = useState<SafetyReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Global collections
  const [history, setHistory] = useState<VerificationRecord[]>(DEMO_VERIFICATION_HISTORY);
  const [alerts, setAlerts] = useState<AlertItem[]>(DEMO_ALERTS);
  const [medicines, setMedicines] = useState<MedicineRegistryItem[]>(DEMO_MEDICINES);

  // Healthcare Network State
  const [activeRole, setActiveRole] = useState<'doctor' | 'patient' | 'pharmacist' | 'admin'>('doctor');
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
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
    DEMO_SAIRAM_PRESCRIPTION,
    DEMO_DOD_PRESCRIPTION,
  ]);
  const [patients, setPatients] = useState(DEMO_PATIENTS);
  const [auditLogs, setAuditLogs] = useState(DEMO_AUDIT_LOGS);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          medicineRes,
          historyRes,
          alertsRes,
          prescriptionsRes,
          recordsRes,
          auditRes,
          patientsRes,
        ] = await Promise.allSettled([
          apiRequest<{ success: boolean; data: MedicineRegistryItem[] }>('/api/medicines'),
          apiRequest<{ success: boolean; data: VerificationRecord[] }>('/api/history'),
          apiRequest<{ success: boolean; data: AlertItem[] }>('/api/alerts'),
          apiRequest<{ success: boolean; data: Prescription[] }>('/api/prescriptions'),
          apiRequest<{ success: boolean; data: HealthRecord[] }>('/api/records'),
          apiRequest<{ success: boolean; data: any[] }>('/api/audit'),
          apiRequest<{ success: boolean; data: any[] }>('/api/patients'),
        ]);

        if (medicineRes.status === 'fulfilled' && medicineRes.value.data) {
          setMedicines(medicineRes.value.data);
        }
        if (historyRes.status === 'fulfilled' && historyRes.value.data && historyRes.value.data.length > 0) {
          setHistory(historyRes.value.data);
        }
        if (alertsRes.status === 'fulfilled' && alertsRes.value.data) {
          setAlerts(alertsRes.value.data);
        }
        if (prescriptionsRes.status === 'fulfilled' && prescriptionsRes.value.data && prescriptionsRes.value.data.length > 0) {
          setPrescriptions(prescriptionsRes.value.data);
        }
        if (recordsRes.status === 'fulfilled' && recordsRes.value.data && recordsRes.value.data.length > 0) {
          setHealthRecords(recordsRes.value.data);
        }
        if (auditRes.status === 'fulfilled' && auditRes.value.data && auditRes.value.data.length > 0) {
          setAuditLogs(auditRes.value.data);
        }
        if (patientsRes.status === 'fulfilled' && patientsRes.value.data && patientsRes.value.data.length > 0) {
          setPatients(patientsRes.value.data);
        }
      } catch {
        // Resilient fallback using database service
        const [dbMeds, dbVers, dbAlerts, dbRxs, dbRecords] = await Promise.all([
          DatabaseService.getMedicines(),
          DatabaseService.getVerifications(),
          DatabaseService.getAlerts(),
          DatabaseService.getPrescriptions(),
          DatabaseService.getHealthRecords(),
        ]);
        setMedicines(dbMeds);
        setHistory(dbVers);
        setAlerts(dbAlerts);
        if (dbRxs.length > 0) setPrescriptions(dbRxs);
        if (dbRecords.length > 0) setHealthRecords(dbRecords);
      }
    }
    loadData();
  }, []);

  const selectFamilyMember = (member: FamilyMember) => {
    setActiveFamilyMember(member);
  };

  const loginUser = (phone: string, otp: string) => {
    if (phone.includes('9999999999') || otp === '123456' || (phone.trim() && otp.trim())) {
      setUser(DEMO_USER);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const setStep = (step: VerificationStep) => {
    setCurrentStep(step);
  };

  const setPrescriptionImage = (url: string) => {
    setPrescriptionImageState(url);
  };

  const setExtractedMedicines = (
    meds: ExtractedMedicine[],
    docName?: string,
    date?: string,
    patientInfo?: {
      name?: string;
      age?: string | number;
      gender?: string;
      address?: string;
      doctorLicense?: string;
      doctorPtr?: string;
    }
  ) => {
    setExtractedMedicinesState(meds);
    if (docName) setDoctorName(docName);
    if (date) setPrescriptionDate(date);
    if (patientInfo?.name) setPatientName(patientInfo.name);
    if (patientInfo?.age) setPatientAge(patientInfo.age);
    if (patientInfo?.gender) setPatientGender(patientInfo.gender);
    if (patientInfo?.address) setPatientAddress(patientInfo.address);
    if (patientInfo?.doctorLicense) setDoctorLicense(patientInfo.doctorLicense);
    if (patientInfo?.doctorPtr) setDoctorPtr(patientInfo.doctorPtr);
    if (meds.length > 0) setSelectedPrescriptionMedIndex(0);
    setCurrentStep('CONFIRM');
  };

  const updateExtractedMedicine = (index: number, updated: Partial<ExtractedMedicine>) => {
    setExtractedMedicinesState((prev) => {
      const newMeds = [...prev];
      if (newMeds[index]) {
        newMeds[index] = { ...newMeds[index], ...updated, user_confirmed: true };
      }
      return newMeds;
    });
  };

  const addExtractedMedicine = (med: ExtractedMedicine) => {
    setExtractedMedicinesState((prev) => [...prev, med]);
  };

  const removeExtractedMedicine = (index: number) => {
    setExtractedMedicinesState((prev) => prev.filter((_, i) => i !== index));
  };

  const selectPrescriptionMedIndex = (index: number) => {
    setSelectedPrescriptionMedIndex(index);
  };

  const setScannedStrip = (strip: MedicineRegistryItem) => {
    setScannedStripState(strip);
    setCurrentStep('SCAN');
  };

  const runMatchVerification = (customStrip?: MedicineRegistryItem) => {
    const stripToUse = customStrip || scannedStrip || DEMO_MEDICINES[0];
    const currentPrescribedMed = extractedMedicines[selectedPrescriptionMedIndex] || extractedMedicines[0];

    if (!currentPrescribedMed || !stripToUse) {
      return null;
    }

    const { record, report } = runVerificationEngine(
      currentPrescribedMed,
      stripToUse,
      alerts,
      DEMO_INTERACTIONS,
      history
    );

    record.id = verificationId;
    record.family_member_name = activeFamilyMember.name;

    setCurrentVerification(record);
    setCurrentSafetyReport(report);
    setCurrentStep('SAFETY');

    setHistory((prev) => [record, ...prev]);
    DatabaseService.saveVerification(record);

    // Keep the workflow responsive with its local safety engine, then let the
    // dedicated FastAPI service persist and return its authoritative result.
    // This also leaves the app usable if the external backend is temporarily down.
    void apiRequest<{ success: boolean; data: { record: VerificationRecord; report: SafetyReport } }>('/api/match', {
      method: 'POST',
      body: JSON.stringify({ prescribed: currentPrescribedMed, stripItem: stripToUse }),
    })
      .then((response) => {
        const backendRecord = {
          ...response.data.record,
          id: verificationId,
          family_member_name: activeFamilyMember.name,
        };
        setCurrentVerification(backendRecord);
        setCurrentSafetyReport({ ...response.data.report, verification_id: verificationId });
        setHistory((previous) => [backendRecord, ...previous.filter((item) => item.id !== verificationId)]);
      })
      .catch(() => undefined);

    return { record, report };
  };

  const resetWorkflow = () => {
    setVerificationId(generateVerificationId());
    setScannedStripState(null);
    setCurrentVerification(null);
    setCurrentSafetyReport(null);
    setCurrentStep('PRESCRIPTION');
  };

  const triggerDemoScenario = (scenario: 'MATCH' | 'MISMATCH' | 'EXPIRED' | 'LOW_CONFIDENCE' | 'ALERT' | 'LOLITA_SAFE') => {
    setVerificationId(generateVerificationId());
    if (scenario === 'MATCH') {
      setExtractedMedicines(DEMO_PRESCRIPTION.extracted_medicines);
      setScannedStrip(DEMO_MEDICINES[0]); // Metformin
      runMatchVerification(DEMO_MEDICINES[0]);
    } else if (scenario === 'MISMATCH') {
      setExtractedMedicines(DEMO_PRESCRIPTION.extracted_medicines);
      setScannedStrip(DEMO_MEDICINES[1]); // Azithromycin
      runMatchVerification(DEMO_MEDICINES[1]);
    } else if (scenario === 'EXPIRED') {
      const panMed: ExtractedMedicine = {
        id: 'em_pan',
        medicine_name: 'Pantoprazole',
        strength: '40 mg',
        frequency: 'Once daily',
        duration: '1 month',
        confidence_score: 95,
        confidence_level: 'HIGH',
        user_confirmed: true,
      };
      setExtractedMedicines([panMed]);
      setScannedStrip(DEMO_MEDICINES[3]); // Pantoprazole Expired
      runMatchVerification(DEMO_MEDICINES[3]);
    } else if (scenario === 'LOW_CONFIDENCE') {
      const lowMed: ExtractedMedicine = {
        id: 'em_low',
        medicine_name: 'Amoxicillin',
        strength: '500 mg',
        frequency: 'Thrice daily',
        duration: '7 days',
        confidence_score: 61,
        confidence_level: 'LOW',
        user_confirmed: false,
        notes: 'Unclear handwriting. Required human confirmation.',
      };
      setExtractedMedicines([lowMed]);
      setCurrentStep('CONFIRM');
    } else if (scenario === 'ALERT') {
      const pcmMed: ExtractedMedicine = {
        id: 'em_pcm',
        medicine_name: 'Paracetamol',
        strength: '500 mg',
        frequency: 'As needed',
        duration: '5 days',
        confidence_score: 92,
        confidence_level: 'HIGH',
        user_confirmed: true,
      };
      setExtractedMedicines([pcmMed]);
      setScannedStrip(DEMO_MEDICINES[4]); // Paracetamol Recall Alert
      runMatchVerification(DEMO_MEDICINES[4]);
    } else if (scenario === 'LOLITA_SAFE') {
      setExtractedMedicines(
        DEMO_LOLITA_PRESCRIPTION.extracted_medicines,
        DEMO_LOLITA_PRESCRIPTION.doctor_name,
        DEMO_LOLITA_PRESCRIPTION.prescription_date,
        {
          name: DEMO_LOLITA_PRESCRIPTION.patient_name,
          age: DEMO_LOLITA_PRESCRIPTION.patient_age,
          gender: DEMO_LOLITA_PRESCRIPTION.patient_gender,
          address: DEMO_LOLITA_PRESCRIPTION.patient_address,
          doctorLicense: DEMO_LOLITA_PRESCRIPTION.doctor_license,
          doctorPtr: DEMO_LOLITA_PRESCRIPTION.doctor_ptr,
        }
      );
      setPrescriptionImageState(DEMO_LOLITA_PRESCRIPTION.image_url || '/demo/prescription_lolita.jpg');
      const feso4Strip = DEMO_MEDICINES.find((m) => m.id === 'med_feso4_325') || DEMO_MEDICINES[0];
      setScannedStrip(feso4Strip);
      runMatchVerification(feso4Strip);
    } else if (scenario === 'SAIRAM_SAFE') {
      setExtractedMedicines(
        DEMO_SAIRAM_PRESCRIPTION.extracted_medicines,
        DEMO_SAIRAM_PRESCRIPTION.doctor_name,
        DEMO_SAIRAM_PRESCRIPTION.prescription_date,
        {
          name: DEMO_SAIRAM_PRESCRIPTION.patient_name,
          age: DEMO_SAIRAM_PRESCRIPTION.patient_age,
          gender: DEMO_SAIRAM_PRESCRIPTION.patient_gender,
          address: DEMO_SAIRAM_PRESCRIPTION.patient_address,
          doctorLicense: DEMO_SAIRAM_PRESCRIPTION.doctor_license,
          doctorPtr: DEMO_SAIRAM_PRESCRIPTION.doctor_ptr,
        }
      );
      setPrescriptionImageState(DEMO_SAIRAM_PRESCRIPTION.image_url || '/demo/prescription_sairam_aman.jpg');
      const opoxStrip = DEMO_MEDICINES.find((m) => m.id === 'med_opox_200') || DEMO_MEDICINES[0];
      setScannedStrip(opoxStrip);
      runMatchVerification(opoxStrip);
    } else if (scenario === 'DOD_SAFE') {
      setExtractedMedicines(
        DEMO_DOD_PRESCRIPTION.extracted_medicines,
        DEMO_DOD_PRESCRIPTION.doctor_name,
        DEMO_DOD_PRESCRIPTION.prescription_date,
        {
          name: DEMO_DOD_PRESCRIPTION.patient_name,
          age: DEMO_DOD_PRESCRIPTION.patient_age,
          gender: DEMO_DOD_PRESCRIPTION.patient_gender,
          address: DEMO_DOD_PRESCRIPTION.patient_address,
          doctorLicense: DEMO_DOD_PRESCRIPTION.doctor_license,
          doctorPtr: DEMO_DOD_PRESCRIPTION.doctor_ptr,
        }
      );
      setPrescriptionImageState(DEMO_DOD_PRESCRIPTION.image_url || '/demo/prescription_dod_doe.jpg');
      const amphStrip = DEMO_MEDICINES.find((m) => m.id === 'med_amphojel') || DEMO_MEDICINES[0];
      setScannedStrip(amphStrip);
      runMatchVerification(amphStrip);
    }
  };

  const viewHistoryRecord = (recordId: string) => {
    const found = history.find((h) => h.id === recordId);
    if (found) {
      setCurrentVerification(found);
      const dummyMed: ExtractedMedicine = {
        id: `em_${found.id}`,
        medicine_name: found.prescribed_medicine_name || found.prescription_medicine || 'Medicine',
        strength: found.prescribed_strength || 'Standard Dose',
        frequency: found.prescribed_frequency || 'Once daily',
        duration: '1 month',
        confidence_score: 95,
        confidence_level: 'HIGH',
        user_confirmed: true,
      };
      const dummyStrip: MedicineRegistryItem = {
        id: `strip_${found.id}`,
        medicine_name: found.scanned_medicine_name || found.scanned_medicine || 'Scanned Strip',
        generic_name: found.scanned_medicine_name || found.scanned_medicine || 'Scanned Strip',
        strength: found.scanned_strength || found.prescribed_strength || 'Standard Dose',
        manufacturer: found.scanned_manufacturer || 'Certified Pharma Ltd',
        batch_number: found.scanned_batch || found.batch_number || 'BATCH-001',
        manufacture_date: 'Aug 2024',
        expiry_date: found.scanned_expiry || 'Aug 2026',
        qr_code: 'DS-DEMO',
        barcode: '12345678',
        verification_status: found.expiry_status === 'EXPIRED' ? 'EXPIRED' : 'VERIFIED',
      };
      const { report } = runVerificationEngine(dummyMed, dummyStrip, alerts, DEMO_INTERACTIONS, history);
      setCurrentSafetyReport(report);
      setCurrentStep('SAFETY');
    }
  };

  const createAlert = async (alert: AlertItem) => {
    setAlerts((prev) => [alert, ...prev]);
    try {
      await apiRequest('/api/alerts', {
        method: 'POST',
        body: JSON.stringify(alert),
      });
    } catch {
      await DatabaseService.saveAlert(alert);
    }
  };

  const addMedicineRegistryItem = async (item: MedicineRegistryItem) => {
    setMedicines((prev) => [item, ...prev]);
  };

  const getPrescriptionById = (prescriptionId: string) => {
    return prescriptions.find((p) => p.id === prescriptionId || p.id.toUpperCase() === prescriptionId.toUpperCase());
  };

  const createOrUpdatePrescription = (prescriptionData: Partial<Prescription>): Prescription => {
    const rxId = prescriptionData.id || `DS-${Math.floor(10000 + Math.random() * 90000)}`;
    const newRx: Prescription = {
      id: rxId,
      version: (prescriptionData.version || 0) + 1,
      doctor_name: prescriptionData.doctor_name || doctorName || 'Dr. J Dela Cruz, MD',
      doctor_id: prescriptionData.doctor_id || 'DOC-4921',
      doctor_license: prescriptionData.doctor_license || doctorLicense || 'MCI-DEL-2018-4921',
      doctor_ptr: prescriptionData.doctor_ptr || doctorPtr || 'PTR-90214',
      hospital_name: prescriptionData.hospital_name || 'Apollo Indraprastha Hospital, New Delhi',
      patient_id: prescriptionData.patient_id || 'PAT-10452',
      patient_name: prescriptionData.patient_name || patientName || 'Lolita Alvarez',
      patient_phone: prescriptionData.patient_phone || '+91 98765 43210',
      patient_age: prescriptionData.patient_age || patientAge || 39,
      patient_gender: prescriptionData.patient_gender || patientGender || 'Female',
      patient_address: prescriptionData.patient_address || patientAddress || 'B-14 Sector 62, Noida, UP',
      prescription_date: prescriptionData.prescription_date || prescriptionDate || new Date().toISOString().split('T')[0],
      extracted_medicines: prescriptionData.extracted_medicines || extractedMedicines,
      status: prescriptionData.status || 'DRAFT',
      created_at: prescriptionData.created_at || new Date().toISOString(),
      allergy_notes: prescriptionData.allergy_notes || 'None noted',
      diagnosis: prescriptionData.diagnosis || 'Clinical Consultation',
      follow_up_date: prescriptionData.follow_up_date || '2026-11-15',
    };

    setPrescriptions((prev) => {
      const idx = prev.findIndex((p) => p.id === rxId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newRx;
        return copy;
      }
      return [newRx, ...prev];
    });

    // Sync with backend API
    void apiRequest<{ success: boolean; data: Prescription }>('/api/prescriptions', {
      method: 'POST',
      body: JSON.stringify(newRx),
    }).catch(() => {
      void DatabaseService.savePrescription(newRx);
    });

    return newRx;
  };

  const finalizeAndSharePrescription = async (prescriptionId: string) => {
    const existing = getPrescriptionById(prescriptionId);
    const targetRx = existing || createOrUpdatePrescription({ id: prescriptionId });

    // 1. Dispatch SMS Notification via configured provider
    const provider = getNotificationProvider();
    const smsResult = await provider.sendPrescriptionAlert({
      recipientPhone: targetRx.patient_phone || '+91 98765 43210',
      recipientName: targetRx.patient_name || 'Patient',
      prescriptionId: targetRx.id,
      doctorName: targetRx.doctor_name,
      medicinesCount: targetRx.extracted_medicines.length,
    });

    // 2. Transition Prescription State
    const approvedRx: Prescription = {
      ...targetRx,
      status: 'APPROVED',
      approved_at: new Date().toISOString(),
      delivery_status: smsResult.status,
      delivery_timestamp: smsResult.timestamp,
    };

    setPrescriptions((prev) => prev.map((p) => (p.id === approvedRx.id ? approvedRx : p)));

    // 3. Log Immutable Audit Trails
    const rxAuditItem = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actor_id: targetRx.doctor_id || 'DOC-4921',
      actor_name: targetRx.doctor_name,
      actor_role: 'doctor' as const,
      action: 'PRESCRIPTION_FINALIZED_AND_APPROVED',
      target_resource: approvedRx.id,
      details: `Clinician approved ${approvedRx.extracted_medicines.length} prescribed items for ${approvedRx.patient_name}. Cryptographic approval logged.`,
      ip_or_hash: `SHA256:${Math.random().toString(36).substring(2, 10)}`,
    };

    const smsAuditItem = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: smsResult.timestamp,
      actor_id: 'SYSTEM_GATEWAY',
      actor_name: 'SMS Gateway',
      actor_role: 'admin' as const,
      action: 'SMS_NOTIFICATION_DISPATCHED',
      target_resource: approvedRx.id,
      details: `Dispatched notification to ${smsResult.recipientPhone} (Status: ${smsResult.status}, Ref: ${smsResult.providerReference || 'DLT_GATEWAY'}).`,
      ip_or_hash: 'TELCO-DLT-IN',
    };

    setAuditLogs((prev) => [rxAuditItem, smsAuditItem, ...prev]);

    // 4. Sync with Backend APIs
    void apiRequest(`/api/prescriptions/${encodeURIComponent(prescriptionId)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'APPROVED',
        approved_at: approvedRx.approved_at,
        delivery_status: approvedRx.delivery_status,
        delivery_timestamp: approvedRx.delivery_timestamp,
      }),
    }).catch(() => undefined);

    void apiRequest('/api/audit', { method: 'POST', body: JSON.stringify(rxAuditItem) }).catch(() => undefined);
    void apiRequest('/api/audit', { method: 'POST', body: JSON.stringify(smsAuditItem) }).catch(() => undefined);

    return {
      success: true,
      prescription: approvedRx,
      notification: smsResult,
    };
  };

  const recordDispensing = async (prescriptionId: string, pharmacyName: string, notes?: string): Promise<Prescription> => {
    const rx = getPrescriptionById(prescriptionId);
    if (!rx) throw new Error('Prescription not found');

    const updatedRx: Prescription = {
      ...rx,
      status: 'DISPENSED',
      dispensed_at: new Date().toISOString(),
      dispensed_by_pharmacy: pharmacyName,
    };

    setPrescriptions((prev) => prev.map((p) => (p.id === prescriptionId ? updatedRx : p)));

    // Record Dispensing Audit Event
    const dispensingAudit = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      actor_id: 'PHARM-CURRENT',
      actor_name: pharmacyName,
      actor_role: 'pharmacist' as const,
      action: 'MEDICATION_DISPENSED',
      target_resource: prescriptionId,
      details: `Dispensing completed by ${pharmacyName}. Status updated to DISPENSED. ${notes ? `Notes: ${notes}` : ''}`,
      ip_or_hash: '122.161.49.201',
    };

    setAuditLogs((prev) => [dispensingAudit, ...prev]);

    // Sync with backend API
    try {
      const res = await apiRequest<{ success: boolean; data: Prescription }>(
        `/api/prescriptions/${encodeURIComponent(prescriptionId)}/dispense`,
        {
          method: 'POST',
          body: JSON.stringify({ pharmacy_name: pharmacyName, notes }),
        }
      );
      if (res.data) {
        setPrescriptions((prev) => prev.map((p) => (p.id === prescriptionId ? res.data : p)));
        return res.data;
      }
    } catch {
      await DatabaseService.updatePrescription(prescriptionId, {
        status: 'DISPENSED',
        dispensed_at: updatedRx.dispensed_at,
        dispensed_by_pharmacy: pharmacyName,
      });
      await DatabaseService.saveAuditLog(dispensingAudit);
    }

    return updatedRx;
  };

  // Health Records State & Persistence
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);

  const addHealthRecord = (recordData: Omit<HealthRecord, 'id' | 'created_at' | 'updated_at'>): HealthRecord => {
    const newRecord: HealthRecord = {
      ...recordData,
      id: `HR-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient_id: recordData.patient_id || user?.id || 'PAT-10452',
      patient_name: recordData.patient_name || activeFamilyMember?.name || 'Lolita Alvarez',
    };
    setHealthRecords((prev) => [newRecord, ...prev]);

    // Sync with backend API
    void apiRequest<{ success: boolean; data: HealthRecord }>('/api/records', {
      method: 'POST',
      body: JSON.stringify(newRecord),
    }).catch(() => {
      void DatabaseService.saveHealthRecord(newRecord);
    });

    return newRecord;
  };

  const updateHealthRecord = (id: string, updates: Partial<HealthRecord>) => {
    setHealthRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r))
    );

    // Sync with backend API
    void apiRequest('/api/records', {
      method: 'PUT',
      body: JSON.stringify({ id, ...updates }),
    }).catch(() => {
      void DatabaseService.updateHealthRecord(id, updates);
    });
  };

  const deleteHealthRecord = (id: string) => {
    setHealthRecords((prev) => prev.filter((r) => r.id !== id));

    // Sync with backend API
    void apiRequest(`/api/records?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch(() => {
      void DatabaseService.deleteHealthRecord(id);
    });
  };

  const importHealthRecords = (newRecords: HealthRecord[]) => {
    setHealthRecords((prev) => [...newRecords, ...prev]);

    // Sync with backend API
    void apiRequest('/api/records', {
      method: 'POST',
      body: JSON.stringify(newRecords),
    }).catch(() => {
      for (const rec of newRecords) {
        void DatabaseService.saveHealthRecord(rec);
      }
    });
  };

  return (
    <VerificationContext.Provider
      value={{
        user,
        isLoggedIn,
        activeFamilyMember,
        selectFamilyMember,
        loginUser,
        logoutUser,
        verificationId,
        currentStep,
        setStep,
        prescriptionImage,
        doctorName,
        doctorLicense,
        doctorPtr,
        prescriptionDate,
        patientName,
        patientAge,
        patientGender,
        patientAddress,
        extractedMedicines,
        selectedPrescriptionMedIndex,
        scannedStrip,
        currentVerification,
        currentSafetyReport,
        isAnalyzing,
        setPrescriptionImage,
        setExtractedMedicines,
        updateExtractedMedicine,
        addExtractedMedicine,
        removeExtractedMedicine,
        selectPrescriptionMedIndex,
        setScannedStrip,
        runMatchVerification,
        resetWorkflow,
        triggerDemoScenario,
        history,
        alerts,
        medicines,
        viewHistoryRecord,
        createAlert,
        addMedicineRegistryItem,
        activeRole,
        setActiveRole,
        prescriptions,
        patients,
        auditLogs,
        createOrUpdatePrescription,
        finalizeAndSharePrescription,
        recordDispensing,
        getPrescriptionById,
        healthRecords,
        addHealthRecord,
        updateHealthRecord,
        deleteHealthRecord,
        importHealthRecords,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};
