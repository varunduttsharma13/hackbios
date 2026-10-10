'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Stethoscope,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Send,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Upload,
  Calendar,
  Lock,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { ExtractedMedicine, Prescription } from '@/types/prescription';
import { DEMO_LOLITA_PRESCRIPTION } from '@/lib/mock/demoData';

function NewPrescriptionBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdParam = searchParams.get('patientId');

  const {
    patients,
    createOrUpdatePrescription,
    finalizeAndSharePrescription,
    extractedMedicines: contextMeds,
  } = useVerification();

  // Patient Selection
  const [selectedPatientId, setSelectedPatientId] = useState(patientIdParam || 'PAT-10452');
  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  // Clinician Details
  const [doctorName, setDoctorName] = useState('Dr. J Dela Cruz, MD');
  const [doctorLicense, setDoctorLicense] = useState('MCI-DEL-2018-4921');
  const [doctorPtr, setDoctorPtr] = useState('PTR-90214');
  const [hospitalName, setHospitalName] = useState('Apollo Indraprastha Hospital, New Delhi');
  const [rxDate, setRxDate] = useState(new Date().toISOString().split('T')[0]);
  const [diagnosis, setDiagnosis] = useState('Iron deficiency anemia with mild clinical fatigue');
  const [allergyNotes, setAllergyNotes] = useState('Penicillin, Sulfa drugs');
  const [followUpDate, setFollowUpDate] = useState('2026-11-10');

  // Medicines List
  const [medicines, setMedicines] = useState<ExtractedMedicine[]>([
    {
      id: 'med_1',
      medicine_name: 'FeSO4 (Ferrous Sulfate)',
      generic_name: 'Ferrous Sulfate',
      strength: '325 mg',
      dosage_form: 'Tablet',
      frequency: 'Once a day',
      duration: '30 days (#30 tabs)',
      quantity: '# 30',
      route: 'Oral',
      instructions: 'Take with full glass of water. Vitamin C enhances absorption.',
      confidence_score: 98,
      confidence_level: 'HIGH',
      user_confirmed: true,
    },
    {
      id: 'med_2',
      medicine_name: 'Ascorbic Acid (Vitamin C)',
      generic_name: 'Ascorbic Acid',
      strength: '100 mg',
      dosage_form: 'Tablet',
      frequency: 'Once a day',
      duration: '30 days (#30 tabs)',
      quantity: '# 30',
      route: 'Oral',
      instructions: 'Co-prescribed synergistically to boost non-heme iron enteral uptake.',
      confidence_score: 96,
      confidence_level: 'HIGH',
      user_confirmed: true,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareSuccess, setShareSuccess] = useState<{ rxId: string; notif: any } | null>(null);

  // Sync with AI Extracted medicines if user came from Rx capture
  const handleLoadAiScan = () => {
    if (contextMeds && contextMeds.length > 0) {
      setMedicines(contextMeds);
    } else {
      setMedicines(DEMO_LOLITA_PRESCRIPTION.extracted_medicines);
    }
  };

  const handleAddMedicine = () => {
    const newMed: ExtractedMedicine = {
      id: `med_${Date.now()}`,
      medicine_name: '',
      strength: '',
      dosage_form: 'Tablet',
      frequency: 'Twice daily',
      duration: '5 days',
      confidence_score: 100,
      confidence_level: 'HIGH',
      user_confirmed: true,
    };
    setMedicines([...medicines, newMed]);
  };

  const handleUpdateMed = (index: number, field: keyof ExtractedMedicine, value: any) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleRemoveMed = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleFinalizeAndShare = async () => {
    if (medicines.length === 0 || !medicines[0].medicine_name) {
      alert('Please add at least one medicine with a valid name.');
      return;
    }

    setIsSubmitting(true);
    try {
      const rxId = `DS-${Math.floor(10000 + Math.random() * 90000)}`;
      createOrUpdatePrescription({
        id: rxId,
        doctor_name: doctorName,
        doctor_license: doctorLicense,
        doctor_ptr: doctorPtr,
        hospital_name: hospitalName,
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.name,
        patient_phone: selectedPatient.phone,
        patient_age: selectedPatient.age,
        patient_gender: selectedPatient.gender,
        patient_address: selectedPatient.address,
        abha_id: selectedPatient.abha_id,
        prescription_date: rxDate,
        diagnosis,
        allergy_notes: allergyNotes,
        follow_up_date: followUpDate,
        extracted_medicines: medicines,
        status: 'APPROVED',
      });

      const res = await finalizeAndSharePrescription(rxId);
      setShareSuccess({ rxId: res.prescription.id, notif: res.notification });
    } catch (err) {
      console.error(err);
      alert('Failed to finalize prescription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/doctor"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Digital Prescription Builder</h1>
            <p className="text-xs text-slate-500">Authoritative digital prescription creation & secure SMS distribution</p>
          </div>
        </div>

        <button
          onClick={handleLoadAiScan}
          className="px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] text-xs font-black hover:bg-teal-100 transition-all flex items-center gap-1.5 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>Load AI OCR Scan</span>
        </button>
      </div>

      {/* Success Modal / Banner */}
      {shareSuccess && (
        <div className="p-6 rounded-3xl bg-teal-50 border-2 border-[#0F766E] shadow-lg space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Prescription Finalized & Securely Shared!
              </h3>
              <p className="text-xs text-[#0F766E] font-semibold mt-0.5">
                Prescription Identifier: <span className="font-mono-code font-bold underline">{shareSuccess.rxId}</span>
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">Patient Notification Status:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                ✓ {shareSuccess.notif?.status || 'DELIVERED'}
              </span>
            </div>
            <p className="text-slate-600 text-xs font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono leading-relaxed">
              &quot;{shareSuccess.notif?.messageText}&quot;
            </p>
            <p className="text-[11px] text-slate-500">
              Recipient: {selectedPatient.phone} • Provider: {shareSuccess.notif?.provider} (Ref: {shareSuccess.notif?.providerReference})
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/doctor/prescriptions/${shareSuccess.rxId}`}
              className="px-3.5 py-2 rounded-lg bg-[#2458A6] text-white text-xs font-semibold hover:bg-[#1D4785] transition-colors shadow-xs"
            >
              View Prescription Details →
            </Link>
            <Link
              href="/pharmacy/prescriptions"
              className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
            >
              Test Pharmacy Retrieval →
            </Link>
          </div>
        </div>
      )}

      {/* Main Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Patient & Clinician Metadata */}
        <div className="space-y-4">
          {/* Patient Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Patient Selection
            </h3>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">
                Select Clinic Patient
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#2458A6]"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id}) - {p.phone}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-[#F8FAF9] rounded-2xl border border-[#E2ECE6] space-y-1 text-xs">
              <p className="font-bold text-[#0A1C16]">{selectedPatient.name}</p>
              <p className="text-[11px] text-[#687875]">{selectedPatient.age} yrs • {selectedPatient.gender}</p>
              <p className="text-[11px] text-[#059669] font-medium font-mono-code">{selectedPatient.phone}</p>
              {selectedPatient.abha_id && (
                <p className="text-[10px] text-[#1D4ED8] font-mono-code">ABHA: {selectedPatient.abha_id}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4A6357] block mb-1">
                Clinical Diagnosis
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#F8FAF9] border border-[#D5E2DC] text-xs font-medium text-[#0A1C16]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4A6357] block mb-1">
                Allergy / Adverse Precautions
              </label>
              <input
                type="text"
                value={allergyNotes}
                onChange={(e) => setAllergyNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FFF1F2] border border-[#F43F5E]/30 text-xs font-bold text-[#BE123C]"
              />
            </div>
          </div>

          {/* Clinician Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              2. Prescriber Information
            </h3>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Doctor Name</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#2458A6]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Medical License (MCI/NMC)</label>
              <input
                type="text"
                value={doctorLicense}
                onChange={(e) => setDoctorLicense(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-[#2458A6]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Hospital Affiliation</label>
              <input
                type="text"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#2458A6]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Issue Date</label>
                <input
                  type="date"
                  value={rxDate}
                  onChange={(e) => setRxDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prescribed Medicines & Actions */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  3. Prescribed Medicines & Dosage Instructions
                </h3>
                <p className="text-xs text-slate-500">Explicit clinical directions for patient and dispensing pharmacist</p>
              </div>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="px-3 py-1.5 rounded-lg bg-[#EEF4FC] border border-[#6B8FC9]/30 text-[#2458A6] text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Drug
              </button>
            </div>

            {/* Medicines List Form Items */}
            <div className="space-y-3.5">
              {medicines.map((med, idx) => (
                <div
                  key={med.id || idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900">
                      Rx Item #{idx + 1}
                    </span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMed(idx)}
                        className="text-rose-600 hover:text-rose-700 p-1 rounded-md hover:bg-rose-50"
                        title="Remove drug"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Medicine Name & Salt
                      </label>
                      <input
                        type="text"
                        value={med.medicine_name}
                        onChange={(e) => handleUpdateMed(idx, 'medicine_name', e.target.value)}
                        placeholder="e.g. Ferrous Sulfate (FeSO4)"
                        className="w-full p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#2458A6]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                        Strength
                      </label>
                      <input
                        type="text"
                        value={med.strength}
                        onChange={(e) => handleUpdateMed(idx, 'strength', e.target.value)}
                        placeholder="e.g. 325 mg"
                        className="w-full p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#2458A6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-[#687875] uppercase tracking-wider block mb-1">
                        Dosage Form
                      </label>
                      <select
                        value={med.dosage_form || 'Tablet'}
                        onChange={(e) => handleUpdateMed(idx, 'dosage_form', e.target.value)}
                        className="w-full p-2 rounded-xl bg-white border border-[#D5E2DC] text-xs font-semibold"
                      >
                        <option value="Tablet">Tablet</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Syrup">Syrup</option>
                        <option value="Injection">Injection</option>
                        <option value="Ointment">Ointment</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#687875] uppercase tracking-wider block mb-1">
                        Frequency
                      </label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleUpdateMed(idx, 'frequency', e.target.value)}
                        placeholder="Once a day"
                        className="w-full p-2 rounded-xl bg-white border border-[#D5E2DC] text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#687875] uppercase tracking-wider block mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleUpdateMed(idx, 'duration', e.target.value)}
                        placeholder="30 days"
                        className="w-full p-2 rounded-xl bg-white border border-[#D5E2DC] text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#687875] uppercase tracking-wider block mb-1">
                        Quantity
                      </label>
                      <input
                        type="text"
                        value={med.quantity || '# 30'}
                        onChange={(e) => handleUpdateMed(idx, 'quantity', e.target.value)}
                        placeholder="# 30"
                        className="w-full p-2 rounded-xl bg-white border border-[#D5E2DC] text-xs font-mono-code font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#687875] uppercase tracking-wider block mb-1">
                      Clinical Instructions for Patient
                    </label>
                    <input
                      type="text"
                      value={med.instructions || ''}
                      onChange={(e) => handleUpdateMed(idx, 'instructions', e.target.value)}
                      placeholder="e.g. Take with water after breakfast."
                      className="w-full p-2.5 rounded-xl bg-white border border-[#D5E2DC] text-xs text-[#0A1C16]"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Final Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock className="w-4 h-4 text-[#0F766E]" />
                <span>Digitally signed with clinician credentials & timestamp</span>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalizeAndShare}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white font-extrabold text-xs hover:brightness-105 active:scale-95 transition-all shadow-lg shadow-[#0F766E]/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing & Dispatching SMS...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-teal-200" />
                    <span>FINALIZE & SHARE PRESCRIPTION</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewPrescriptionBuilderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#687875]">Loading prescription builder...</div>}>
      <NewPrescriptionBuilderContent />
    </Suspense>
  );
}
