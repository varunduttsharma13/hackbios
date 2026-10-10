'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Pill,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Info,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { MEDICINE_MONOGRAPHS } from '@/lib/data/medicinesHubData';
import { MedicineMonograph } from '@/types/healthGuide';

export default function MedicinesDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('ALL');
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  // Classes list
  const classes = useMemo(() => {
    const set = new Set(MEDICINE_MONOGRAPHS.map((m: MedicineMonograph) => m.drugClass));
    return Array.from(set);
  }, []);

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return MEDICINE_MONOGRAPHS.filter((med: MedicineMonograph) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesGeneric = med.genericName.toLowerCase().includes(q);
        const matchesBrands = med.brandExamples.some((b: string) => b.toLowerCase().includes(q));
        const matchesClass = med.drugClass.toLowerCase().includes(q);
        const matchesUses = med.commonIndications.some((u: string) => u.toLowerCase().includes(q));
        if (!matchesGeneric && !matchesBrands && !matchesClass && !matchesUses) return false;
      }

      if (selectedSchedule !== 'ALL' && !med.schedule.includes(selectedSchedule)) {
        return false;
      }

      if (selectedClass !== 'ALL' && med.drugClass !== selectedClass) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedSchedule, selectedClass]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/health-guide"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Common Conditions Hub</span>
        </Link>
        <span className="text-xs text-slate-400">
          Showing {filteredMedicines.length} of {MEDICINE_MONOGRAPHS.length} monographs
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-teal-700/40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide uppercase mb-3 border border-teal-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            Basic Medicines Directory & Reference
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Common Medicines Directory
          </h1>
          <p className="text-teal-100/90 text-sm mt-2 leading-relaxed">
            Educational monographs on widely utilized medicines, pharmacology classes, critical precautions, common interactions, and patient safety rules.
          </p>
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong>Important Clinical Rule:</strong> Inclusion in this directory does not constitute a prescription or medical endorsement. Exact dosage, formulation, and treatment duration must be tailored by a licensed physician according to age, weight, and renal/hepatic profile.
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by generic name, brand (e.g. Crocin, Allegra, Digene), or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100 focus:bg-white rounded-xl text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Class filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer"
          >
            <option value="ALL">All Classes</option>
            {classes.map((cls: string) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          {/* Schedule filter */}
          <select
            value={selectedSchedule}
            onChange={(e) => setSelectedSchedule(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 cursor-pointer"
          >
            <option value="ALL">All Schedules</option>
            <option value="OTC">OTC (Over the Counter)</option>
            <option value="Schedule H">Schedule H (Prescription)</option>
          </select>
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedicines.map((med: MedicineMonograph) => (
          <div
            key={med.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-500/60 hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    {med.drugClass}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2 group-hover:text-teal-700 transition-colors">
                    {med.genericName}
                  </h3>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap ${
                    med.schedule.includes('OTC')
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                  }`}
                >
                  {med.schedule.includes('OTC') ? 'OTC' : 'Schedule H'}
                </span>
              </div>

              {/* Brands */}
              <div className="text-xs text-slate-500 mt-1">
                Common Brands: <strong className="text-slate-700 font-medium">{med.brandExamples.join(', ')}</strong>
              </div>

              {/* Overview */}
              <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">{med.generalPurpose}</p>

              {/* Common uses */}
              <div className="flex flex-wrap gap-1 mt-3">
                {med.commonIndications.slice(0, 3).map((use: string, i: number) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                    {use}
                  </span>
                ))}
              </div>

              {/* Caution preview */}
              {med.importantPrecautions[0] && (
                <div className="mt-3 p-2 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-900">
                  <span className="font-bold">Caution: </span>
                  <span className="line-clamp-1">{med.importantPrecautions[0]}</span>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-teal-700 group-hover:underline">
                View Monograph & Side Effects
              </span>
              <Link
                href={`/health-guide/medicines/${med.id}`}
                className="p-1.5 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-600 hover:text-white transition-all"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
