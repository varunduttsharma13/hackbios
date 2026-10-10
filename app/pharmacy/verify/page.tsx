'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Scan,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  RotateCcw,
  Pill,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  Calendar,
  Lock,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { DEMO_MEDICINES } from '@/lib/mock/demoData';
import { MedicineRegistryItem } from '@/types/medicine';

function PharmacyMedicineVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rxIdParam = searchParams.get('rxId') || 'DS-10452';

  const {
    getPrescriptionById,
    runMatchVerification,
    recordDispensing,
    setScannedStrip,
    medicines,
    currentVerification,
    currentSafetyReport,
  } = useVerification();

  const rx = getPrescriptionById(rxIdParam) || {
    id: rxIdParam,
    patient_name: 'Lolita Alvarez',
    doctor_name: 'Dr. J Dela Cruz, MD',
    prescription_date: '2026-10-09',
    extracted_medicines: [
      {
        id: 'med_1',
        medicine_name: 'FeSO4 (Ferrous Sulfate)',
        strength: '325 mg',
        frequency: 'Once a day',
        duration: '30 days',
        confidence_score: 98,
        confidence_level: 'HIGH' as const,
        user_confirmed: true,
      },
    ],
  };

  const prescribedDrug = rx.extracted_medicines[0];

  // Selected strip to cross-match
  const [selectedMedicineId, setSelectedMedicineId] = useState(
    rxIdParam === 'DS-10453' ? 'med_met_500' : 'med_feso4_325'
  );
  const [dispenseDone, setDispenseDone] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    outcome: 'MATCH' | 'MISMATCH' | 'UNVERIFIED';
    details: string;
    report: any;
  } | null>(null);

  const handleRunVerify = (medItem: MedicineRegistryItem) => {
    setScannedStrip(medItem);
    const result = runMatchVerification(medItem);
    if (!result) return;

    const isMatch = result.record.match_status === 'MATCHED' && result.report.overall_status === 'SAFE';
    const isMismatch = result.record.match_status === 'MISMATCH' || result.report.overall_status === 'DANGER';

    setVerificationResult({
      outcome: isMatch ? 'MATCH' : isMismatch ? 'MISMATCH' : 'UNVERIFIED',
      details: result.report.summary || result.record.notes || '',
      report: result.report,
    });
  };

  const handleConfirmDispensing = async () => {
    if (!rx.id) return;
    await recordDispensing(rx.id, 'MedPlus Pharmacy #104 (Paschim Vihar)');
    setDispenseDone(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/pharmacy"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Medicine Verification & Dispensing
            </h1>
            <p className="text-xs text-slate-500">
              Cross-match prescription #{rx.id} against physical blister packaging
            </p>
          </div>
        </div>

        <Link
          href="/match"
          className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
        >
          Visual OCR Cross-Matcher →
        </Link>
      </div>

      {/* Target Prescription Overview */}
      <div className="bg-gradient-to-br from-[#087E80] to-[#065B5C] text-white p-5 rounded-3xl shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono-code font-black text-teal-100">Rx Ref: {rx.id}</span>
          <span className="text-teal-100 font-semibold">Patient: {rx.patient_name}</span>
        </div>

        <div className="p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-teal-100 uppercase font-bold tracking-wider block">
              Authorized Clinician Instruction
            </span>
            <p className="text-base font-black text-white">{prescribedDrug?.medicine_name}</p>
            <p className="text-xs text-teal-100 font-semibold">
              Prescribed Dose: {prescribedDrug?.strength} • Frequency: {prescribedDrug?.frequency}
            </p>
          </div>
          <span className="text-xs text-teal-100 font-mono-code bg-white/15 px-3 py-1 rounded-xl">
            {prescribedDrug?.duration || '30 days'}
          </span>
        </div>
      </div>

      {/* Step 2: Select / Scan Physical Medicine */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
            Select Physical Medicine Blister Strip from Inventory
          </h3>
          <p className="text-xs text-slate-500">
            Pick the medicine strip scanned at the pharmacy counter to trigger AI Safety Check.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {medicines.map((m) => {
            const isSelected = selectedMedicineId === m.id;

            return (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMedicineId(m.id);
                  handleRunVerify(m);
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#E9F6F5] border-[#087E80] shadow-sm ring-1 ring-[#087E80]'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="font-black text-xs text-slate-900">{m.medicine_name}</span>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                      m.verification_status === 'EXPIRED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : m.verification_status === 'ALERT'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {m.verification_status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-semibold mt-1">Dose: {m.strength}</p>
                <p className="text-[10px] text-slate-400">Batch: {m.batch_number} • Exp: {m.expiry_date}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification Results Panel */}
      {verificationResult && (
        <div
          className={`p-6 rounded-3xl border shadow-sm space-y-4 ${
            verificationResult.outcome === 'MATCH'
              ? 'bg-[#F0FDF4] border-emerald-300'
              : verificationResult.outcome === 'MISMATCH'
              ? 'bg-[#FEF2F2] border-rose-300'
              : 'bg-[#FFFBEB] border-amber-300'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white ${
                  verificationResult.outcome === 'MATCH'
                    ? 'bg-[#15803D]'
                    : verificationResult.outcome === 'MISMATCH'
                    ? 'bg-[#B42318]'
                    : 'bg-[#B45309]'
                }`}
              >
                {verificationResult.outcome === 'MATCH' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertOctagon className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  VERIFICATION OUTCOME: {verificationResult.outcome}
                </h3>
                <p className="text-xs font-semibold text-slate-600">
                  {verificationResult.outcome === 'MATCH'
                    ? 'Physical drug matches doctor-approved prescription Salt & Strength perfectly.'
                    : verificationResult.outcome === 'MISMATCH'
                    ? 'Safety Engine flagged clinical discrepancy between prescribed salt and scanned product.'
                    : 'Required packaging information missing or cannot be reliably verified.'}
                </p>
              </div>
            </div>

            <Link
              href="/safety"
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs font-black shadow-2xs hover:bg-slate-50"
            >
              Full Clinical Certificate →
            </Link>
          </div>

          {/* Action Bar */}
          <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-medium text-slate-600">
              {dispenseDone
                ? '✓ Dispensing outcome recorded in national audit log.'
                : 'Confirm medicine release and update digital prescription lifecycle.'}
            </span>

            {verificationResult.outcome === 'MATCH' && !dispenseDone && (
              <button
                type="button"
                onClick={handleConfirmDispensing}
                className="px-5 py-2.5 rounded-xl bg-[#087E80] hover:bg-[#065B5C] text-white font-black text-xs shadow-xs flex items-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>RECORD DISPENSING & NOTIFY</span>
              </button>
            )}

            {dispenseDone && (
              <span className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs">
                ✓ DISPENSED TO PATIENT
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PharmacyMedicineVerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading verification session...</div>}>
      <PharmacyMedicineVerifyContent />
    </Suspense>
  );
}
