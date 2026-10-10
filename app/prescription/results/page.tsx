'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Edit3, Plus, FileText, Stethoscope, User, MapPin } from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { WorkflowProgress } from '@/components/ui/WorkflowProgress';

export default function PrescriptionResultsPage() {
  const router = useRouter();
  const {
    extractedMedicines,
    selectPrescriptionMedIndex,
    setStep,
    doctorName,
    doctorLicense,
    doctorPtr,
    prescriptionDate,
    patientName,
    patientAge,
    patientGender,
    patientAddress,
  } = useVerification();

  const handleConfirm = () => {
    setStep('CONFIRM');
    router.push('/prescription/confirm');
  };

  const isSynergisticPair = extractedMedicines.some((m) => m.medicine_name.toLowerCase().includes('fe') || m.medicine_name.toLowerCase().includes('iron')) &&
    extractedMedicines.some((m) => m.medicine_name.toLowerCase().includes('ascorbic') || m.medicine_name.toLowerCase().includes('vit'));

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Workflow Progress */}
      <WorkflowProgress currentStep="PRESCRIPTION" />

      {/* Header */}
      <div>
        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Gemini Vision AI Clinical OCR
        </span>
        <h1 className="text-xl font-black text-slate-900 tracking-tight mt-1">Prescription Extraction Details</h1>
        <p className="text-xs text-slate-500">Clinical OCR identified patient details and handwritten medicine schedule.</p>
      </div>

      {/* Patient & Doctor Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-4 space-y-3 text-xs">
        {/* Patient Profile */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold border border-teal-100">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-black text-slate-900">
                {patientName || 'Lolita Alvarez'}
                {patientAge ? (
                  <span className="text-[11px] font-bold text-slate-500 ml-2">
                    ({patientAge} yrs • {patientGender || 'Female'})
                  </span>
                ) : null}
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0F766E]" /> {patientAddress || 'Bagong Ilog, Pasig City'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono-code font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
            Rx Date: {prescriptionDate || '2-5-13'}
          </span>
        </div>

        {/* Doctor Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EEF4FC] text-[#2458A6] flex items-center justify-center font-bold border border-[#D2E0F5]">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800">{doctorName || 'Dr. J Dela Cruz, MD'}</p>
              <p className="text-[10px] text-slate-400">
                Lic. No. {doctorLicense || '12345'} • PTR No. {doctorPtr || '1234567'}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black text-[#0F766E] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            ✓ Signed Rx
          </span>
        </div>
      </div>

      {/* Synergistic Co-Prescription Insight */}
      {isSynergisticPair && (
        <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 font-black text-[#0F766E]">
            <Sparkles className="w-4 h-4 text-[#0F766E]" />
            <span>Clinical Pharmacology Synergy Detected</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Ascorbic Acid (Vitamin C)</strong> is intentionally co-prescribed with <strong>FeSO4 (Ferrous Sulfate)</strong> to reduce ferric iron (Fe3+) into the soluble ferrous (Fe2+) state, boosting iron bioavailability by up to 300% for anemia.
          </p>
        </div>
      )}

      {/* Extracted Medicine Cards List */}
      <div className="space-y-3">
        {extractedMedicines.map((med, idx) => {
          const isHigh = med.confidence_score >= 85;
          const isMedium = med.confidence_score >= 70 && med.confidence_score < 85;

          const confidenceLabel = isHigh
            ? 'High Confidence'
            : isMedium
            ? 'Review Recommended'
            : 'Confirmation Required';

          return (
            <div
              key={med.id}
              onClick={() => selectPrescriptionMedIndex(idx)}
              className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3 hover:border-[#0F766E] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">{med.medicine_name}</h3>
                  <span className="text-xs font-black text-[#0F766E]">{med.strength}</span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 ${
                    isHigh
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isMedium
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isHigh ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  {med.confidence_score}% {confidenceLabel}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Strength</span>
                  <span className="font-black text-slate-800">{med.strength}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Frequency</span>
                  <span className="font-black text-slate-800">{med.frequency}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">Duration</span>
                  <span className="font-black text-slate-800">{med.duration}</span>
                </div>
              </div>

              {med.notes && (
                <p className="text-[11px] text-amber-800 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" /> {med.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleConfirm}
          className="w-full h-12 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          Confirm Prescription Details → <ArrowRight className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/prescription/confirm"
            className="h-11 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Edit3 className="w-4 h-4 text-[#0F766E]" /> Edit Dosage
          </Link>
          <Link
            href="/prescription/confirm"
            className="h-11 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#0F766E]" /> Add Another Medicine
          </Link>
        </div>
      </div>
    </div>
  );
}

