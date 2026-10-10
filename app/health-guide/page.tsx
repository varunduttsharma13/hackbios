'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  HeartPulse,
  Search,
  Thermometer,
  Wind,
  Stethoscope,
  ShieldAlert,
  Pill,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle2,
  PhoneCall,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { HEALTH_CONDITIONS } from '@/lib/data/conditionsData';
import { MEDICINES_HUB_DATA } from '@/lib/data/medicinesHubData';
import { HealthCondition, MedicineMonograph } from '@/types/healthGuide';

export default function HealthGuideHubPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Universal search across conditions, symptoms, and medicines
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const matchingConditions = HEALTH_CONDITIONS.filter(
      (c: HealthCondition) =>
        c.name.toLowerCase().includes(q) ||
        c.hindiName.toLowerCase().includes(q) ||
        c.overview.toLowerCase().includes(q) ||
        c.commonSymptoms.some((s: string) => s.toLowerCase().includes(q))
    );

    const matchingMedicines = MEDICINES_HUB_DATA.filter(
      (m: MedicineMonograph) =>
        m.genericName.toLowerCase().includes(q) ||
        m.brandExamples.some((b: string) => b.toLowerCase().includes(q)) ||
        m.drugClass.toLowerCase().includes(q) ||
        m.commonIndications.some((u: string) => u.toLowerCase().includes(q))
    );

    return {
      conditions: matchingConditions,
      medicines: matchingMedicines,
    };
  }, [searchQuery]);

  // Filtered conditions for directory view
  const filteredConditions = useMemo(() => {
    if (selectedCategory === 'ALL') return HEALTH_CONDITIONS;
    return HEALTH_CONDITIONS.filter((c: HealthCondition) => c.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-teal-700/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-400/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide uppercase mb-3 border border-teal-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            Clinical Educational Reference • Not an Automated Prescriber
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Medicines & Common Conditions Hub
          </h1>
          <p className="text-teal-100/90 text-sm mt-2 leading-relaxed">
            Understand common symptoms, learn supportive self-care precautions, explore foundational medicine categories, and recognize critical warning signs requiring professional clinical care.
          </p>

          {/* Search Bar in Hero */}
          <div className="relative mt-6 max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search symptoms (fever, cough, acidity) or medicines (paracetamol, cetirizine)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/95 text-slate-900 placeholder-slate-400 rounded-2xl text-xs sm:text-sm font-medium shadow-lg border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-teal-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Quick Links Row */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-teal-700/50">
          <Link
            href="/health-guide/medicines"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/30 text-teal-200 text-xs font-semibold transition-colors"
          >
            <Pill className="w-3.5 h-3.5 text-teal-300" />
            <span>Browse Basic Medicines Directory ({MEDICINES_HUB_DATA.length} monographs)</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
          <Link
            href="/interactions"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>Drug Interactions Engine</span>
          </Link>
        </div>
      </div>

      {/* Clinical Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Important Clinical Safety Rule:</strong> MED-BRIDGE does not diagnose conditions or automatically prescribe medications. Information in this guide is curated for health literacy and educational awareness. Always consult a registered medical practitioner before starting any therapeutic regimen.
        </div>
      </div>

      {/* Universal Search Results (if searching) */}
      {searchResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Search Results for &ldquo;{searchQuery}&rdquo;
            </h3>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Back to directory
            </button>
          </div>

          {/* Condition results */}
          {searchResults.conditions.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Matching Conditions ({searchResults.conditions.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.conditions.map((c: HealthCondition) => (
                  <Link
                    key={c.id}
                    href={`/health-guide/conditions/${c.id}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-teal-700 uppercase">{c.categoryLabel}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{c.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{c.shortSummary || c.overview}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Medicine results */}
          {searchResults.medicines.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 mt-4">
                Matching Medicine Monographs ({searchResults.medicines.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.medicines.map((m: MedicineMonograph) => (
                  <Link
                    key={m.id}
                    href={`/health-guide/medicines/${m.id}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold text-emerald-700 uppercase">{m.drugClass}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mt-1">{m.genericName}</h4>
                    <span className="text-[11px] text-slate-500 block">Brands: {m.brandExamples.join(', ')}</span>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{m.generalPurpose}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {searchResults.conditions.length === 0 && searchResults.medicines.length === 0 && (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">No conditions or medicines matched your query.</p>
            </div>
          )}
        </div>
      )}

      {/* Category Tabs */}
      {!searchResults && (
        <>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Conditions' },
              { id: 'FEVER', label: 'Fever (बुखार)' },
              { id: 'COLD_NASAL', label: 'Cold & Nose' },
              { id: 'COUGH_THROAT', label: 'Cough & Throat' },
              { id: 'ALLERGIES', label: 'Allergies' },
              { id: 'HEADACHE', label: 'Headache' },
              { id: 'STOMACH_DIGESTIVE', label: 'Digestion & Stomach' },
              { id: 'BODY_PAIN', label: 'Body Pain' },
              { id: 'SKIN', label: 'Skin Concerns' },
              { id: 'EYE_EAR', label: 'Eye & Ear' },
              { id: 'ORAL_HEALTH', label: 'Oral & Dental' },
              { id: 'CHILD_HEALTH', label: 'Child Health' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conditions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredConditions.map((condition: HealthCondition) => (
              <div
                key={condition.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-500/60 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      {condition.categoryLabel}
                    </span>
                    {condition.hindiName && (
                      <span className="text-xs font-medium text-slate-400">{condition.hindiName}</span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-teal-700 transition-colors">
                    {condition.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                    {condition.shortSummary || condition.overview}
                  </p>

                  {/* Common Symptoms pill row */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Key Indicators:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {condition.commonSymptoms.slice(0, 3).map((sym: string, i: number) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                        >
                          {sym}
                        </span>
                      ))}
                      {condition.commonSymptoms.length > 3 && (
                        <span className="text-[10px] font-medium bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded-md">
                          +{condition.commonSymptoms.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Medicine Categories discussed */}
                  <div className="mt-3 p-2.5 bg-teal-50/50 rounded-xl border border-teal-100">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-1">
                      Relevant Medicine Classes:
                    </span>
                    <div className="text-[11px] text-teal-900 font-medium line-clamp-1">
                      {condition.medicineCategories.map((m: { name: string }) => m.name).join(' • ')}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400 group-hover:text-teal-700 transition-colors">
                    Read self-care & precautions
                  </span>
                  <Link
                    href={`/health-guide/conditions/${condition.id}`}
                    className="p-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-600 hover:text-white transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Emergency Red Flags Educational Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-rose-800 font-bold text-sm sm:text-base mb-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>When to Seek Emergency Medical Attention Immediately (112 / 108)</span>
        </div>
        <p className="text-xs text-rose-900/90 leading-relaxed mb-3">
          If you or someone under your care experiences any of the following, do not rely on supportive home care or oral medications. Proceed to the nearest hospital emergency department:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-rose-800">
          <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/80">
            • Acute shortness of breath, cyanosis (blue lips), or wheezing
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/80">
            • Severe crushing chest pain radiating to arm or jaw
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/80">
            • High fever with neck stiffness, altered mental state, or seizure
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/80">
            • Sudden facial drooping, unilateral weakness, or slurred speech
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/80">
            • Persistent severe abdominal rigidity with persistent vomiting
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-rose-200/80">
            • Severe allergic reaction with throat swelling, hoarseness, or syncope
          </div>
        </div>
      </div>
    </div>
  );
}
