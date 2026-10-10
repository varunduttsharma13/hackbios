'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Stethoscope, 
  Pill, 
  Clock, 
  Sparkles,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { WorkflowProgress } from '@/components/ui/WorkflowProgress';

export default function ConfirmMedicineDetailsPage() {
  const router = useRouter();
  const {
    extractedMedicines,
    selectedPrescriptionMedIndex,
    updateExtractedMedicine,
    addExtractedMedicine,
    removeExtractedMedicine,
    selectPrescriptionMedIndex,
    setStep,
    doctorName,
    doctorLicense,
    doctorPtr,
    patientName,
    patientAge,
    patientGender,
    patientAddress,
  } = useVerification();

  const currentMed = extractedMedicines[selectedPrescriptionMedIndex] || extractedMedicines[0] || {
    id: 'em_temp',
    medicine_name: 'FeSO4 (Ferrous Sulfate)',
    strength: '325 mg',
    frequency: 'Once daily (O.D.)',
    duration: '30 days (#30 tabs)',
    confidence_score: 96,
    confidence_level: 'HIGH',
    user_confirmed: true,
  };

  const [name, setName] = useState(currentMed.medicine_name);
  const [strength, setStrength] = useState(currentMed.strength);
  const [frequency, setFrequency] = useState(currentMed.frequency);
  const [duration, setDuration] = useState(currentMed.duration);

  const handleConfirmAndContinue = () => {
    updateExtractedMedicine(selectedPrescriptionMedIndex, {
      medicine_name: name,
      strength,
      frequency,
      duration,
      user_confirmed: true,
    });
    setStep('SCAN');
    router.push('/medicine/scan');
  };

  const handleSelectMed = (idx: number) => {
    selectPrescriptionMedIndex(idx);
    const m = extractedMedicines[idx];
    if (m) {
      setName(m.medicine_name);
      setStrength(m.strength);
      setFrequency(m.frequency);
      setDuration(m.duration);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4 pb-8">
      {/* Workflow Progress */}
      <WorkflowProgress currentStep="CONFIRM" />

      {/* Header */}
      <div className="bg-gradient-to-br from-white to-emerald-50/50 p-4 rounded-3xl border border-[#DCE8E2] shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300">
            Clinical Step 2 of 4
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-500">
            OCR Verification Confidence: {currentMed.confidence_score || 96}%
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 tracking-tight">
          Confirm Extracted Dosage
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verify digital transcription for {patientName || 'Lolita Alvarez'} before blister scan.
        </p>
      </div>

      {/* Tabs for multiple extracted medicines */}
      {extractedMedicines.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {extractedMedicines.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => handleSelectMed(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedPrescriptionMedIndex === idx
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pill className="w-3.5 h-3.5 text-teal-500" />
              {m.medicine_name || `Medicine ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      {/* Doctor Pad Visual Form Container */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Prescription Stamp Ribbon */}
        <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              ℞
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{doctorName || 'Dr. J Dela Cruz, MD'}</p>
              <p className="text-[10px] text-slate-500 font-mono">
                Lic #{doctorLicense || '12345'} • PTR #{doctorPtr || '1234567'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Transcribed
          </span>
        </div>

        {/* Medicine name */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
            <span>Medicine / Active Molecule</span>
            <span className="text-[10px] text-slate-400 font-normal">Tap to correct</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0F766E] bg-slate-50"
            placeholder="e.g. FeSO4 (Ferrous Sulfate)"
          />
        </div>

        {/* Strength */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
            <span>Prescribed Strength</span>
            <span className="text-[10px] text-slate-400 font-normal">Dosage per unit</span>
          </label>
          <input
            type="text"
            value={strength}
            onChange={(e) => setStrength(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F766E] bg-slate-50"
            placeholder="e.g. 325 mg or 100 mg"
          />
        </div>

        {/* Frequency & Duration (2 columns) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F766E] bg-slate-50"
            >
              <option value="Twice daily">Twice daily (BD)</option>
              <option value="Once daily">Once daily (OD)</option>
              <option value="Thrice daily">Thrice daily (TDS)</option>
              <option value="As needed">As needed (SOS)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0F766E] bg-slate-50"
            >
              <option value="1 month">1 month</option>
              <option value="15 days">15 days</option>
              <option value="7 days">7 days</option>
              <option value="5 days">5 days</option>
              <option value="Ongoing">Ongoing (Chronic)</option>
            </select>
          </div>
        </div>

        {/* Precaution note */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-relaxed">
            In the next step, our dual-camera engine will compare this confirmed entry directly against the physical foil barcode and manufacturing imprint.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleConfirmAndContinue}
          className="w-full h-11 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          Confirm & Scan Medicine Foil → <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => router.back()}
          className="w-full h-10 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" /> Edit Doctor Prescription First
        </button>
      </div>
    </div>
  );
}
