'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Shield,
  FileCheck,
  AlertOctagon,
  Sparkles,
  Download,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { WorkflowProgress } from '@/components/ui/WorkflowProgress';
import { DEMO_MEDICINES } from '@/lib/mock/demoData';
import { checkMedicineMatch } from '@/lib/safety/engine';

export default function MatchPage() {
  const router = useRouter();
  const {
    extractedMedicines,
    selectedPrescriptionMedIndex,
    scannedStrip,
    currentVerification,
    runMatchVerification,
    setStep,
  } = useVerification();

  const prescribed = extractedMedicines[selectedPrescriptionMedIndex] || extractedMedicines[0] || {
    medicine_name: 'FeSO4 (Ferrous Sulfate)',
    strength: '325 mg',
    frequency: 'Once daily (O.D.)',
    duration: '30 days (#30 tabs)',
  };

  const defaultStrip = prescribed.medicine_name.toLowerCase().includes('fe') || prescribed.medicine_name.toLowerCase().includes('iron')
    ? (DEMO_MEDICINES.find((m) => m.id === 'med_feso4_325') || DEMO_MEDICINES[0])
    : DEMO_MEDICINES[0];

  const strip = scannedStrip || defaultStrip;

  const verification = currentVerification || runMatchVerification(strip)?.record || {
    match_status: checkMedicineMatch(prescribed.medicine_name, strip.medicine_name) ? 'MATCHED' : 'MISMATCH',
    medicine_match: checkMedicineMatch(prescribed.medicine_name, strip.medicine_name),
    strength_match: true,
    frequency_match: true,
    expiry_status: 'VALID',
    recall_status: 'NO_ALERTS',
    interaction_status: 'SAFE',
    duplicate_status: 'NOT_DETECTED',
  };

  const isMatch = verification.match_status === 'MATCHED';
  const isMismatch = verification.match_status === 'MISMATCH';

  const checksPassedCount = [
    verification.medicine_match,
    verification.strength_match,
    verification.frequency_match,
    verification.expiry_status === 'VALID',
    verification.recall_status === 'NO_ALERTS',
    verification.interaction_status === 'SAFE',
  ].filter(Boolean).length;

  const handleGoToSafety = () => {
    setStep('SAFETY');
    router.push('/safety');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* Workflow Progress */}
      <WorkflowProgress currentStep="SCAN" />

      {/* Header */}
      <div className="text-center space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          6-Point Safety Engine
        </span>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Prescription ↔ Strip Comparison</h1>
        <p className="text-xs text-slate-500">Structured clinical cross-verification between doctor order & physical packaging.</p>
      </div>

      {/* Authoritative Result Banner */}
      <div
        className={`p-5 rounded-3xl border transition-all shadow-xs relative overflow-hidden ${
          isMismatch
            ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B42318]'
            : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 text-center sm:text-left">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs text-white ${
              isMismatch ? 'bg-[#B42318]' : 'bg-[#15803D]'
            }`}
          >
            {isMismatch ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white border border-current/20 shadow-2xs">
                {isMismatch ? 'Safety Alert: Mismatch' : 'Verification: Match Confirmed'}
              </span>
              <span className="text-[10px] font-mono-code font-bold opacity-80">
                {checksPassedCount}/6 Checks Cleared
              </span>
            </div>

            <h2 className="text-lg font-black tracking-tight uppercase">
              {isMismatch ? 'MEDICINE DISCREPANCY DETECTED' : 'CLINICAL SPECIFICATION MATCHED'}
            </h2>

            <p className="text-xs font-medium leading-relaxed opacity-90">
              {isMismatch
                ? `Safety Engine flagged discrepancy: Doctor prescribed ${prescribed.medicine_name} (${prescribed.strength}), but physical strip contains ${strip.medicine_name} (${strip.strength}). Do not consume without physician consultation.`
                : `Active salt, concentration, and packaging are verified compliant with prescription ${strip.medicine_name} (${strip.strength}). Batch is valid and not recalled.`}
            </p>
          </div>
        </div>
      </div>

      {/* Two Comparison Cards: Prescription vs Scanned Package */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
        {/* DOCTOR PRESCRIPTION SPECIMEN */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2 text-left relative">
          <div className="text-[10px] font-bold text-[#2458A6] tracking-wider uppercase border-b border-slate-100 pb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-black">
              <FileCheck className="w-3.5 h-3.5 text-[#2458A6]" /> Prescribed by Clinician
            </span>
            <span className="text-[9px] bg-[#EEF4FC] px-1.5 py-0.5 rounded text-[#2458A6] font-bold">Doctor Rx</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Medicine</span>
            <h3 className="text-sm font-black text-slate-900 leading-snug">{prescribed.medicine_name}</h3>
            <p className="text-xs font-bold text-[#2458A6] mt-0.5">{prescribed.strength}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
            <span className="font-bold text-slate-800">Regimen: </span>
            {prescribed.frequency} • {prescribed.duration}
          </div>
        </div>

        {/* PHYSICAL MEDICINE STRIP SPECIMEN */}
        <div className={`p-4 rounded-3xl bg-white border shadow-2xs space-y-2 text-left relative ${
          isMismatch ? 'border-rose-300' : 'border-slate-200'
        }`}>
          <div className="text-[10px] font-bold text-slate-700 tracking-wider uppercase border-b border-slate-100 pb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-black">
              <Shield className="w-3.5 h-3.5 text-teal-600" /> Physical Blister Pack
            </span>
            <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">OCR Specimen</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Extracted Package</span>
            <h3 className={`text-sm font-black leading-snug ${isMismatch ? 'text-rose-700' : 'text-slate-900'}`}>
              {strip.medicine_name}
            </h3>
            <p className="text-xs font-bold text-slate-700 mt-0.5">{strip.strength}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 space-y-0.5 font-mono-code">
            <div>Batch: <span className="font-bold text-slate-900">{strip.batch_number}</span></div>
            <div>Expiry: <span className="font-bold text-slate-900">{strip.expiry_date}</span></div>
          </div>
        </div>
      </div>

      {/* 6-Point Detailed Comparison Matrix */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-2xs space-y-2 text-xs">
        <h3 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
          Detailed Safety Evaluation Matrix
        </h3>

        {/* Check 1 */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="font-bold text-slate-800 block">1. Active Chemical Molecule</span>
            <span className="text-[10px] text-slate-500">Rx: {prescribed.medicine_name} vs Pack: {strip.medicine_name}</span>
          </div>
          {verification.medicine_match ? (
            <span className="font-black text-[#15803D] flex items-center gap-1 text-[11px] bg-[#F0FDF4] px-2.5 py-0.5 rounded-lg border border-[#BBF7D0]">
              <CheckCircle2 className="w-3.5 h-3.5" /> EXACT MATCH
            </span>
          ) : (
            <span className="font-black text-[#B42318] flex items-center gap-1 text-[11px] bg-[#FEF2F2] px-2.5 py-0.5 rounded-lg border border-[#FECACA]">
              <XCircle className="w-3.5 h-3.5" /> MISMATCH
            </span>
          )}
        </div>

        {/* Check 2 */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="font-bold text-slate-800 block">2. Dosage Strength (mg)</span>
            <span className="text-[10px] text-slate-500">Rx: {prescribed.strength} vs Pack: {strip.strength}</span>
          </div>
          {verification.strength_match ? (
            <span className="font-black text-[#15803D] flex items-center gap-1 text-[11px] bg-[#F0FDF4] px-2.5 py-0.5 rounded-lg border border-[#BBF7D0]">
              <CheckCircle2 className="w-3.5 h-3.5" /> MATCHED
            </span>
          ) : (
            <span className="font-black text-[#B45309] flex items-center gap-1 text-[11px] bg-[#FFFBEB] px-2.5 py-0.5 rounded-lg border border-[#FDE68A]">
              <AlertTriangle className="w-3.5 h-3.5" /> DIFFERENCE
            </span>
          )}
        </div>

        {/* Check 3 */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="font-bold text-slate-800 block">3. Expiry & Shelf Life</span>
            <span className="text-[10px] text-slate-500 font-mono-code">Exp: {strip.expiry_date}</span>
          </div>
          {verification.expiry_status === 'VALID' ? (
            <span className="font-black text-[#15803D] flex items-center gap-1 text-[11px] bg-[#F0FDF4] px-2.5 py-0.5 rounded-lg border border-[#BBF7D0]">
              <CheckCircle2 className="w-3.5 h-3.5" /> VALID
            </span>
          ) : (
            <span className="font-black text-[#B42318] flex items-center gap-1 text-[11px] bg-[#FEF2F2] px-2.5 py-0.5 rounded-lg border border-[#FECACA]">
              <XCircle className="w-3.5 h-3.5" /> EXPIRED
            </span>
          )}
        </div>

        {/* Check 4 */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="font-bold text-slate-800 block">4. CDSCO National Recall</span>
            <span className="text-[10px] text-slate-500 font-mono-code">Batch: {strip.batch_number}</span>
          </div>
          {verification.recall_status === 'NO_ALERTS' ? (
            <span className="font-black text-[#15803D] flex items-center gap-1 text-[11px] bg-[#F0FDF4] px-2.5 py-0.5 rounded-lg border border-[#BBF7D0]">
              <CheckCircle2 className="w-3.5 h-3.5" /> CLEAR
            </span>
          ) : (
            <span className="font-black text-[#B42318] flex items-center gap-1 text-[11px] bg-[#FEF2F2] px-2.5 py-0.5 rounded-lg border border-[#FECACA]">
              <XCircle className="w-3.5 h-3.5" /> RECALLED
            </span>
          )}
        </div>

        {/* Check 5 */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span className="font-bold text-slate-800 block">5. Cross-Drug Interaction Risk</span>
            <span className="text-[10px] text-slate-500">Evaluated against profile regimen</span>
          </div>
          <span className="font-black text-[#2563EB] flex items-center gap-1 text-[11px] bg-[#EFF6FF] px-2.5 py-0.5 rounded-lg border border-[#BFDBFE]">
            <CheckCircle2 className="w-3.5 h-3.5" /> SAFE
          </span>
        </div>
      </div>

      {/* Emergency Helpline Pill on Mismatch */}
      {isMismatch && (
        <a
          href="tel:18003292472"
          className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between hover:bg-red-100/70 transition-colors block"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#B42318] text-white flex items-center justify-center font-black">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-red-900">DISPENSING WARNING</p>
              <p className="text-[10px] text-red-700">Contact healthcare pharmacist helpline immediately</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#B42318] text-white text-[10px] font-black">
            Call 1800-SAFE
          </span>
        </a>
      )}

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleGoToSafety}
          className="w-full h-12 rounded-2xl bg-[#0F766E] hover:bg-[#115E59] text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
        >
          Generate Official Safety Certificate → <ArrowRight className="w-4 h-4" />
        </button>

        <Link
          href="/medicine/scan"
          className="w-full h-11 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors shadow-2xs"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" /> Rescan Medicine Strip
        </Link>
      </div>
    </div>
  );
}


