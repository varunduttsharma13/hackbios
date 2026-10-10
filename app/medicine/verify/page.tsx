'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight, RotateCcw, AlertOctagon, Building, Calendar, QrCode } from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { DEMO_MEDICINES } from '@/lib/mock/demoData';
import { WorkflowProgress } from '@/components/ui/WorkflowProgress';

export default function StripVerificationResultPage() {
  const router = useRouter();
  const { scannedStrip, runMatchVerification, setStep } = useVerification();

  const strip = scannedStrip || DEMO_MEDICINES[0];

  const isExpired = strip.verification_status === 'EXPIRED';
  const hasAlert = strip.verification_status === 'ALERT';

  const handleContinueToMatch = () => {
    runMatchVerification(strip);
    setStep('SCAN');
    router.push('/match');
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <WorkflowProgress currentStep="SCAN" />

      {/* Verification Status Header Banner */}
      <div
        className={`p-5 rounded-2xl border text-center space-y-2.5 shadow-xs ${
          isExpired || hasAlert
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center bg-white shadow-xs">
          {isExpired || hasAlert ? (
            <AlertOctagon className="w-6 h-6 text-rose-600" />
          ) : (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          )}
        </div>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-current/20 inline-block mb-1">
            CDSCO National Packaging Database
          </span>
          <h1 className="text-xl font-bold tracking-tight">
            {hasAlert ? 'Active Drug Safety Bulletin' : isExpired ? 'Product Has Expired' : 'Product Batch Verified Authentic'}
          </h1>
        </div>

        <p className="text-xs text-slate-600 max-w-sm mx-auto">
          {isExpired
            ? 'WARNING: This strip has passed its manufacturer shelf life. Do not dispense or consume.'
            : 'Genuine pharmaceutical batch found in verified national CDSCO packaging registry.'}
        </p>
      </div>

      {/* Authentic Product Blister Strip Specimen Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{strip.medicine_name}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{strip.strength} • Oral Tablet</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Hologram Verified
          </span>
        </div>

        <div className="space-y-2 text-slate-700">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Batch Number</span>
            <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {strip.batch_number}
            </span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Manufacturer</span>
            <span className="font-semibold text-slate-900">{strip.manufacturer}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Mfg Date</span>
            <span className="font-semibold text-slate-900">{strip.manufacture_date}</span>
          </div>

          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500">Expiry Date</span>
            <span className={`font-bold ${isExpired ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded' : 'text-emerald-700'}`}>
              {strip.expiry_date} {isExpired ? '(EXPIRED)' : '(Valid)'}
            </span>
          </div>

          {strip.detected_raw_text && (
            <div className="py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 uppercase tracking-wider">Vision OCR Raw Text</span>
                <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[10px]">
                  {strip.confidence_score || 95}% Match
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-800 break-words">
                "{strip.detected_raw_text}"
              </p>
            </div>
          )}

          <div className="flex justify-between py-1.5">
            <span className="text-slate-500">CDSCO Registry Status</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Legitimate Manufacturing License
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleContinueToMatch}
          className="w-full h-11 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          Compare Against Prescription → <ArrowRight className="w-4 h-4" />
        </button>

        <Link
          href="/medicine/scan"
          className="w-full h-10 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Scan Another Medicine Strip
        </Link>
      </div>
    </div>
  );
}

