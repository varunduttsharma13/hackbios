'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, QrCode, ArrowRight, FileText, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { useRouter } from 'next/navigation';

export default function ScanPickerPage() {
  const router = useRouter();
  const { triggerDemoScenario } = useVerification();

  const handleQuickDemo = (scenario: 'MATCH' | 'MISMATCH' | 'SAIRAM_SAFE' | 'DOD_SAFE') => {
    triggerDemoScenario(scenario);
    router.push('/match');
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pt-2">
      <div className="text-center space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
          Verification Hub
        </span>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">Select Verification Action</h1>
        <p className="text-xs text-slate-500">Choose a clinical verification method below to proceed.</p>
      </div>

      <div className="space-y-3 pt-2">
        {/* Option 1: Scan Prescription */}
        <Link
          href="/prescription/capture"
          className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-[#0F766E] shadow-2xs hover:shadow-xs transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-teal-100">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-slate-900">Scan Doctor Prescription (Rx)</h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Gemini Vision OCR
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extract clinician handwriting, drug salts, strength & frequency schedule automatically.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-[#0F766E] group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Option 2: Scan Medicine */}
        <Link
          href="/medicine/scan"
          className="p-5 bg-white rounded-3xl border border-slate-200 hover:border-teal-600 shadow-2xs hover:shadow-xs transition-all flex items-center gap-4 group"
        >
          <div className="w-13 h-13 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-slate-200">
            <QrCode className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-sm text-slate-900">Scan Physical Medicine Strip</h3>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
                2D DataMatrix + OCR
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload strip photo, scan 2D DataMatrix QR, or barcode to extract salt, batch & expiry.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-slate-800 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Quick Testing Box */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#0F766E]" /> Live Simulation Bench
          </span>
          <span className="text-[10px] text-slate-400 font-semibold">For Demonstrations</span>
        </div>
        <p className="text-xs text-slate-500">
          Trigger live deterministic safety verification test scenarios instantly:
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => handleQuickDemo('SAIRAM_SAFE')}
            className="py-2.5 px-3 rounded-xl bg-white text-teal-800 font-black text-xs border border-teal-200 hover:bg-teal-50 transition-all shadow-2xs text-left"
          >
            <span className="block text-[11px] font-bold text-slate-900 truncate">🏥 Sai Ram Clinic</span>
            <span className="text-[10px] text-teal-600 font-semibold truncate block">Mr. Aman • Opox Match</span>
          </button>
          <button
            onClick={() => handleQuickDemo('DOD_SAFE')}
            className="py-2.5 px-3 rounded-xl bg-white text-blue-800 font-black text-xs border border-blue-200 hover:bg-blue-50 transition-all shadow-2xs text-left"
          >
            <span className="block text-[11px] font-bold text-slate-900 truncate">🎖️ DOD Form 1289</span>
            <span className="text-[10px] text-blue-600 font-semibold truncate block">John Doe • Amphojel Match</span>
          </button>
          <button
            onClick={() => handleQuickDemo('MATCH')}
            className="py-2 px-3 rounded-xl bg-white text-slate-800 font-bold text-xs border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 transition-all shadow-2xs"
          >
            ✓ Lolita FeSO4 Match
          </button>
          <button
            onClick={() => handleQuickDemo('MISMATCH')}
            className="py-2 px-3 rounded-xl bg-white text-rose-700 font-bold text-xs border border-rose-200 hover:bg-rose-50 transition-all shadow-2xs"
          >
            🚨 Simulate Mismatch Alert
          </button>
        </div>
      </div>
    </div>
  );
}

