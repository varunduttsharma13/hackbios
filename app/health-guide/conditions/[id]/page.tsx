'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  HeartPulse,
  AlertTriangle,
  Pill,
  CheckCircle2,
  Stethoscope,
  Info,
  Clock,
  ExternalLink,
  Shield,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { HEALTH_CONDITIONS } from '@/lib/data/conditionsData';
import { MEDICINE_MONOGRAPHS } from '@/lib/data/medicinesHubData';
import { HealthCondition, MedicineMonograph } from '@/types/healthGuide';

export default function ConditionDetailPage() {
  const params = useParams();
  const conditionId = params?.id as string;

  const condition = HEALTH_CONDITIONS.find((c: HealthCondition) => c.id === conditionId);

  if (!condition) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Condition Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested educational condition page could not be located.</p>
        <Link
          href="/health-guide"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Health Guide</span>
        </Link>
      </div>
    );
  }

  // Linked medicine monographs
  const linkedMedicines = MEDICINE_MONOGRAPHS.filter((m: MedicineMonograph) =>
    condition.relatedMedicineIds.includes(m.id)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/health-guide"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Common Conditions Hub</span>
        </Link>

        <span className="text-xs text-slate-400">
          Educational Standard • Reviewed March 2026
        </span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-700/50 relative overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300 bg-teal-500/20 px-3 py-1 rounded-full border border-teal-400/30">
            {condition.categoryLabel}
          </span>
          {condition.hindiName && (
            <span className="text-xs font-medium text-teal-200/80 bg-white/10 px-2.5 py-1 rounded-full">
              {condition.hindiName}
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{condition.name}</h1>
        <p className="text-sm text-teal-100/90 mt-2 leading-relaxed max-w-2xl">{condition.overview}</p>

        {/* Clinical Disclaimer */}
        <div className="mt-5 p-3 rounded-xl bg-teal-950/60 border border-teal-600/40 text-xs text-teal-200 flex items-start gap-2">
          <Info className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" />
          <span>
            <strong>Educational Reference Only:</strong> {condition.clinicalDisclaimer}
          </span>
        </div>
      </div>

      {/* Grid of Clinical Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Symptoms */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span>Common Associated Symptoms</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {condition.commonSymptoms.map((symptom: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Supportive Self-Care & Hydration */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Supportive Self-Care & Home Measures</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700">
            {condition.generalSelfCare.map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Educational Medicine Categories */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm sm:text-base">
            <Pill className="w-5 h-5 text-teal-700" />
            <span>Medicine Categories Commonly Discussed</span>
          </div>
          <span className="text-[11px] text-slate-500">Educational Classes</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The following pharmacological classes are generally referenced in standard clinical practice for this symptom presentation. Selection depends on individual contraindications, age, organ function, and formal clinical evaluation:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {condition.medicineCategories.map((med: { name: string; description: string; commonExamples: string[] }, idx: number) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-white transition-all space-y-2"
            >
              <strong className="text-xs font-bold text-slate-900 block">{med.name}</strong>
              <p className="text-xs text-slate-600 leading-relaxed">{med.description}</p>
              <div className="text-[11px] text-teal-800 bg-teal-50 p-2 rounded-lg border border-teal-200/60 mt-1">
                <strong>Examples:</strong> {med.commonExamples.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Linked Monograph Quick Cards */}
      {linkedMedicines.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-slate-900">
            Reviewed Medicine Monographs for this Condition:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {linkedMedicines.map((m: MedicineMonograph) => (
              <Link
                key={m.id}
                href={`/health-guide/medicines/${m.id}`}
                className="p-3 bg-slate-50 hover:bg-teal-50 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors flex items-center justify-between group"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-800 block">
                    {m.genericName}
                  </span>
                  <span className="text-[11px] text-slate-500">Brands: {m.brandExamples.join(', ')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Precautions & When to Contact Doctor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Important Precautions */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Key Precautions & Common Pitfalls</span>
          </div>
          <ul className="space-y-2 text-xs text-amber-900">
            {condition.importantPrecautions.map((prec: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>{prec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* When to Contact a Doctor */}
        <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <span>When to Schedule a Doctor Appointment</span>
          </div>
          <ul className="space-y-2 text-xs text-teal-900">
            {condition.whenToContactDoctor.map((flag: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-teal-700 font-bold">•</span>
                <span>{flag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Emergency Warning Signs Banner */}
      <div className="bg-rose-50 border border-rose-300 rounded-2xl p-6 space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-rose-800 font-bold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>🚨 Emergency Warning Signs (Immediate Hospital / ER Required)</span>
        </div>
        <p className="text-xs text-rose-900 leading-relaxed">
          Do not attempt home remedies or wait for an outpatient appointment if you notice any of these signs. Call emergency services (112 / 108) or go to the nearest emergency room immediately:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-rose-900 font-medium">
          {condition.emergencyWarningSigns.map((sign: string, idx: number) => (
            <div key={idx} className="p-2.5 bg-white/90 rounded-xl border border-rose-200 flex items-start gap-2">
              <span className="text-rose-600 font-bold shrink-0">⚠️</span>
              <span>{sign}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
