'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  HeartPulse, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Search,
  Sparkles,
  Pill,
  Clock,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { DEMO_INTERACTIONS } from '@/lib/mock/demoData';

export default function InteractionsPage() {
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | 'HIGH' | 'MODERATE'>('ALL');
  const [searchDrug, setSearchDrug] = useState('');

  const filteredInteractions = DEMO_INTERACTIONS.filter((item) => {
    const matchesSeverity =
      selectedSeverity === 'ALL' ? true :
      selectedSeverity === 'HIGH' ? item.severity === 'HIGH' :
      item.severity === 'MODERATE';

    const matchesSearch =
      searchDrug.trim() === '' ||
      item.medicine_a.toLowerCase().includes(searchDrug.toLowerCase()) ||
      item.medicine_b.toLowerCase().includes(searchDrug.toLowerCase()) ||
      item.description.toLowerCase().includes(searchDrug.toLowerCase());

    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-800 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-200">
              Pharmacology Cross-Check
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            CDSCO & Lexicomp Index
          </span>
        </div>

        <div className="mt-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Drug-Drug Interaction Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Real-time contraindication screen cross-referencing your active prescription against concurrent medications.
          </p>
        </div>

        {/* Personalized Profile Cross-Match Pill */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Your Active Regimen</p>
              <p className="text-[11px] text-slate-500">Metformin 500mg • Atorvastatin 10mg</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md border border-violet-200">
            2 Active Meds
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchDrug}
            onChange={(e) => setSearchDrug(e.target.value)}
            placeholder="Search interaction by drug name (e.g. Clopidogrel, Aspirin)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:border-violet-600 shadow-xs"
          />
        </div>

        <div className="flex gap-2">
          {(['ALL', 'HIGH', 'MODERATE'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSeverity === sev
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev === 'ALL' ? 'All Risks' : `${sev === 'HIGH' ? 'High' : 'Moderate'} Risk`}
            </button>
          ))}
        </div>
      </div>

      {/* Interactions List */}
      <div className="space-y-4">
        {filteredInteractions.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Known Interactions Found</h3>
            <p className="text-xs text-slate-500">The searched drug does not show documented contraindications in this index.</p>
          </div>
        ) : (
          filteredInteractions.map((item) => {
            const isHigh = item.severity === 'HIGH';

            return (
              <div
                key={item.id}
                className={`rounded-3xl p-5 border transition-all ${
                  isHigh
                    ? 'bg-gradient-to-b from-rose-50/70 via-white to-white border-rose-300 shadow-sm'
                    : 'bg-gradient-to-b from-amber-50/70 via-white to-white border-amber-300 shadow-sm'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    SEVERITY: {item.severity}
                  </span>
                  
                  <span className="text-[10px] font-mono text-slate-400">
                    RULE ID #{item.id}
                  </span>
                </div>

                {/* Drugs Involved */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Prescribed</span>
                    <span className="text-sm font-black text-slate-900">{item.medicine_a}</span>
                  </div>
                  <span className="text-sm font-black text-slate-400">+</span>
                  <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Concurrent</span>
                    <span className="text-sm font-black text-slate-900">{item.medicine_b}</span>
                  </div>
                </div>

                {/* Mechanism / Clinical explanation */}
                <div className="mt-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3 text-purple-600" /> Clinical Mechanism
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Suggested Clinical Action */}
                <div className={`mt-2.5 p-3.5 rounded-2xl border space-y-1 ${
                  isHigh 
                    ? 'bg-rose-50/80 border-rose-200 text-rose-950' 
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}>
                  <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1 opacity-80">
                    <ShieldAlert className="w-3 h-3" /> Recommended Protocol
                  </span>
                  <p className="text-xs font-bold leading-relaxed">
                    {item.recommendation}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <Info className="w-4 h-4 text-emerald-600" /> Clinical Safety Disclaimer
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Interaction alerts are derived from standard pharmacovigilance databases and are intended for patient risk awareness. Never stop or modify life-sustaining therapy without direct clinical authorization from your registered medical practitioner.
        </p>
      </div>
    </div>
  );
}
