'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Pill,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Layers,
  Thermometer,
} from 'lucide-react';
import { MEDICINE_MONOGRAPHS } from '@/lib/data/medicinesHubData';
import { HEALTH_CONDITIONS } from '@/lib/data/conditionsData';
import { MedicineMonograph, HealthCondition } from '@/types/healthGuide';

export default function MedicineMonographPage() {
  const params = useParams();
  const medId = params?.id as string;

  const medicine = MEDICINE_MONOGRAPHS.find((m: MedicineMonograph) => m.id === medId);

  if (!medicine) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Medicine Monograph Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested medicine entry could not be located in our directory.</p>
        <Link
          href="/health-guide/medicines"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medicines Directory</span>
        </Link>
      </div>
    );
  }

  // Find linked condition objects
  const linkedConditions = HEALTH_CONDITIONS.filter((c: HealthCondition) =>
    medicine.relatedConditionIds.includes(c.id)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/health-guide/medicines"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Medicines Directory</span>
        </Link>

        <span className="text-xs text-slate-400">
          Source: {medicine.source} • Reviewed: {medicine.lastReviewedDate}
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-700/50 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30">
            {medicine.drugClass}
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              medicine.schedule.includes('OTC')
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                : 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
            }`}
          >
            {medicine.schedule}
          </span>
          {medicine.hindiName && (
            <span className="text-xs font-medium text-teal-200/80 bg-white/10 px-2.5 py-1 rounded-full">
              {medicine.hindiName}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{medicine.genericName}</h1>
        <p className="text-sm text-teal-200 mt-1 font-medium">
          Common Brands in India: {medicine.brandExamples.join(', ')}
        </p>

        <p className="text-sm text-teal-100/90 mt-3 leading-relaxed max-w-2xl">{medicine.generalPurpose}</p>

        {/* Quick specs pill */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-teal-700/60 text-xs">
          <div>
            <span className="text-teal-300/80 block text-[11px]">Available Formulations:</span>
            <strong className="text-white mt-0.5 block">{medicine.dosageForms.join(', ')}</strong>
          </div>
          <div>
            <span className="text-teal-300/80 block text-[11px]">Common Strengths:</span>
            <strong className="text-white mt-0.5 block">{medicine.typicalStrengths.join(', ')}</strong>
          </div>
          <div>
            <span className="text-teal-300/80 block text-[11px]">Review Classification:</span>
            <strong className="text-teal-300 mt-0.5 block">{medicine.reviewStatus}</strong>
          </div>
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Important Clinical Rule:</strong> The information provided is for educational reference. Never adjust dosage, discontinue prescription therapy, or start treatment without explicit instructions from your registered medical practitioner.
        </div>
      </div>

      {/* Indications and Usage Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Uses */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Pill className="w-4 h-4 text-teal-600" />
            <span>Common Clinical Indications</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {medicine.commonIndications.map((use: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Usage & Administration Guidance */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Storage & Safe Administration</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
            {medicine.storageGuidelines}
          </p>
          <div className="text-[11px] text-slate-500 pt-1">
            Status: <strong className="text-slate-700">Educational Demonstration Content (ABDM Compliant)</strong>
          </div>
        </div>
      </div>

      {/* Precautions and Contraindications */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          <span>Critical Precautions & Contraindications</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-900">
          {medicine.importantPrecautions.map((prec: string, idx: number) => (
            <div key={idx} className="bg-white/80 p-3 rounded-xl border border-amber-200/80 flex items-start gap-2">
              <span className="text-amber-600 font-bold shrink-0">•</span>
              <span>{prec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Adverse Effects and Potential Drug Interactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Side Effects */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Known Adverse Effects</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {medicine.knownSideEffects.map((side: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">•</span>
                <span>{side}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Drug Interactions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Significant Drug Interactions</span>
              </div>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {medicine.potentialInteractions.map((inter: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold shrink-0">•</span>
                  <span>{inter}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/interactions"
              className="inline-flex items-center gap-2 px-3 py-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 rounded-xl text-xs font-bold transition-colors w-full justify-center"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Verify Multi-Drug Interactions with Engine</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Linked Conditions Exploration */}
      {linkedConditions.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-slate-900">
            Explored in Related Condition Guides:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {linkedConditions.map((cond: HealthCondition) => (
              <Link
                key={cond.id}
                href={`/health-guide/conditions/${cond.id}`}
                className="p-3 bg-slate-50 hover:bg-teal-50 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-800 block">
                    {cond.name}
                  </span>
                  <span className="text-[11px] text-slate-500 capitalize">{cond.categoryLabel}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
