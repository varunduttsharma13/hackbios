'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { Pill, ShieldCheck, AlertCircle, Info, FileText, ArrowLeft, HeartPulse } from 'lucide-react';
import { DEMO_MEDICINES } from '@/lib/mock/demoData';

export default function MedicineDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'USES' | 'SIDE_EFFECTS' | 'INTERACTIONS'>('OVERVIEW');

  const medicine = DEMO_MEDICINES.find((m) => m.id === id || m.medicine_name.toLowerCase().includes(id.toLowerCase())) || DEMO_MEDICINES[0];

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Back button */}
      <Link href="/history" className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Verification History
      </Link>

      {/* Header Card */}
      <div className="p-5 rounded-2xl bg-[#0F766E] text-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded-md bg-white/20 border border-white/30 text-white text-[11px] font-semibold uppercase">
            {medicine.form || 'Tablet'}
          </span>
          <span className="text-xs text-teal-100 font-medium">Prescription Drug: Schedule H</span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{medicine.medicine_name}</h1>
          <p className="text-xs text-teal-100">{medicine.generic_name}</p>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs">
          <div>
            <span className="text-teal-200 block text-[11px]">Manufacturer</span>
            <span className="font-semibold text-white">{medicine.manufacturer}</span>
          </div>
          <div>
            <span className="text-teal-200 block text-[11px]">Batch Number</span>
            <span className="font-mono font-semibold text-white">{medicine.batch_number}</span>
          </div>
        </div>
      </div>

      {/* Tabs: Overview, Uses, Side Effects, Interactions */}
      <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl text-center">
        {(['OVERVIEW', 'USES', 'SIDE_EFFECTS', 'INTERACTIONS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 text-xs">
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Generic Name</span>
                  <span className="font-semibold text-slate-900">{medicine.generic_name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Strength</span>
                  <span className="font-semibold text-slate-900">{medicine.strength}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Form</span>
                  <span className="font-semibold text-slate-900">{medicine.form}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Expiry Date</span>
                  <span className="font-semibold text-emerald-700">{medicine.expiry_date}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-2">Storage Instructions</h3>
              <p className="text-slate-600 leading-relaxed p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                {medicine.storage || 'Store below 25°C in a cool, dry place away from direct sunlight.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'USES' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Therapeutic Indications</h3>
            <ul className="space-y-2">
              {(medicine.uses || ['Used to control blood sugar levels in adults with type 2 diabetes.']).map((use, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-slate-800">{use}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'SIDE_EFFECTS' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Common Adverse Effects</h3>
            <ul className="space-y-2">
              {(medicine.side_effects || ['Nausea', 'Mild stomach upset', 'Loose stools']).map((se, i) => (
                <li key={i} className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span className="font-medium text-amber-900">{se}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'INTERACTIONS' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Documented Drug Interactions</h3>
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
              <div className="flex items-center gap-2 text-rose-800 font-bold">
                <HeartPulse className="w-4 h-4 text-rose-600" /> Caution: Concurrent NSAID Analgesics
              </div>
              <p className="text-rose-900/80 leading-relaxed text-xs">
                Concurrent use with high-dose NSAIDs may impair renal perfusion and elevate adverse response thresholds.
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#00A86B] shrink-0 mt-0.5" />
          <p>
            Always follow the prescription and consult a qualified healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
