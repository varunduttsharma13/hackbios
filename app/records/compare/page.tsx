'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Activity,
  ArrowUpDown,
  ChevronLeft,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Info,
  Building,
  Check,
} from 'lucide-react';

interface LabParameter {
  test_name: string;
  category: string;
  unit: string;
  reference_range: string;
  history: {
    date: string;
    value: number;
    unit: string;
    lab: string;
    status: 'NORMAL' | 'ELEVATED' | 'LOW';
    doctor_reviewed: boolean;
  }[];
}

const DEMO_LAB_PANELS: LabParameter[] = [
  {
    test_name: 'Glycated Hemoglobin (HbA1c)',
    category: 'Diabetic Profile',
    unit: '%',
    reference_range: '4.0 - 5.6 % (Non-diabetic), < 7.0 % (Target for Diabetic)',
    history: [
      { date: '2026-10-02', value: 6.8, unit: '%', lab: 'Dr. Lal PathLabs', status: 'NORMAL', doctor_reviewed: true },
      { date: '2026-07-14', value: 7.4, unit: '%', lab: 'Max Healthcare Pathology', status: 'ELEVATED', doctor_reviewed: true },
      { date: '2026-04-10', value: 8.1, unit: '%', lab: 'SRL Diagnostics', status: 'ELEVATED', doctor_reviewed: true },
    ],
  },
  {
    test_name: 'Fasting Blood Glucose',
    category: 'Diabetic Profile',
    unit: 'mg/dL',
    reference_range: '70 - 100 mg/dL',
    history: [
      { date: '2026-10-02', value: 118, unit: 'mg/dL', lab: 'Dr. Lal PathLabs', status: 'ELEVATED', doctor_reviewed: true },
      { date: '2026-07-14', value: 134, unit: 'mg/dL', lab: 'Max Healthcare Pathology', status: 'ELEVATED', doctor_reviewed: true },
      { date: '2026-04-10', value: 152, unit: 'mg/dL', lab: 'SRL Diagnostics', status: 'ELEVATED', doctor_reviewed: true },
    ],
  },
  {
    test_name: 'Serum Creatinine',
    category: 'Renal Function Panel',
    unit: 'mg/dL',
    reference_range: '0.6 - 1.2 mg/dL',
    history: [
      { date: '2026-10-02', value: 0.9, unit: 'mg/dL', lab: 'Dr. Lal PathLabs', status: 'NORMAL', doctor_reviewed: true },
      { date: '2026-07-14', value: 1.0, unit: 'mg/dL', lab: 'Max Healthcare Pathology', status: 'NORMAL', doctor_reviewed: true },
    ],
  },
  {
    test_name: 'Total Cholesterol',
    category: 'Lipid Panel',
    unit: 'mg/dL',
    reference_range: '< 200 mg/dL (Desirable)',
    history: [
      { date: '2026-10-02', value: 182, unit: 'mg/dL', lab: 'Dr. Lal PathLabs', status: 'NORMAL', doctor_reviewed: true },
      { date: '2026-07-14', value: 215, unit: 'mg/dL', lab: 'Max Healthcare Pathology', status: 'ELEVATED', doctor_reviewed: true },
    ],
  },
  {
    test_name: 'Hemoglobin (Hb)',
    category: 'Complete Blood Count (CBC)',
    unit: 'g/dL',
    reference_range: '12.0 - 15.5 g/dL (Adult Female)',
    history: [
      { date: '2026-10-02', value: 12.8, unit: 'g/dL', lab: 'Dr. Lal PathLabs', status: 'NORMAL', doctor_reviewed: true },
      { date: '2026-07-14', value: 11.9, unit: 'g/dL', lab: 'Max Healthcare Pathology', status: 'LOW', doctor_reviewed: true },
    ],
  },
];

export default function LabReportComparisonPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Diabetic Profile', 'Renal Function Panel', 'Lipid Panel', 'Complete Blood Count (CBC)'];

  const filteredPanels = DEMO_LAB_PANELS.filter(
    (p) => selectedCategory === 'ALL' || p.category === selectedCategory
  );

  return (
    <div className="min-h-full pb-20 bg-slate-50 text-slate-900">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/records"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#0F766E]" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900">Laboratory Report Comparison</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
                  Unit-Safe Comparison
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Track chronological laboratory measurements across accredited diagnostic reports
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-5">
        {/* Important Clinical Disclaimer */}
        <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-2xl shadow-2xs space-y-1.5 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-[#0F766E]">
            <Info className="w-4 h-4 text-[#0F766E]" />
            Clinical Measurement & Comparison Principles
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Laboratory values are organized chronologically and compared strictly when measurement units and clinical definitions match. Trends provide observational history for clinical review and do not constitute an autonomous medical diagnosis. Always consult your healthcare provider.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat === 'ALL' ? 'All Panels' : cat}
            </button>
          ))}
        </div>

        {/* Lab Panels List */}
        <div className="space-y-4">
          {filteredPanels.map((panel) => {
            const latest = panel.history[0];
            const previous = panel.history[1];
            const diff = previous ? latest.value - previous.value : null;

            return (
              <div
                key={panel.test_name}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs"
              >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900">{panel.test_name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {panel.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Standard Unit: <span className="font-semibold text-slate-700">{panel.unit}</span> • Ref: {panel.reference_range}
                    </p>
                  </div>

                  {/* Summary Trend */}
                  {diff !== null && (
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs text-slate-500">Change from prev:</span>
                      <span
                        className={`text-xs font-bold flex items-center gap-0.5 px-2 py-1 rounded-lg ${
                          diff < 0
                            ? 'bg-emerald-50 text-emerald-700'
                            : diff > 0
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {diff < 0 ? (
                          <TrendingDown className="w-3.5 h-3.5" />
                        ) : diff > 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : null}
                        {diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1)} {panel.unit}
                      </span>
                    </div>
                  )}
                </div>

                {/* Chronological Table */}
                <div className="divide-y divide-slate-100">
                  {panel.history.map((record, idx) => {
                    const isLatest = idx === 0;

                    return (
                      <div
                        key={record.date}
                        className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          isLatest ? 'bg-teal-50/20' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-slate-900">
                                {record.value} {record.unit}
                              </span>
                              {record.status === 'NORMAL' && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                  Within Range
                                </span>
                              )}
                              {record.status === 'ELEVATED' && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                                  Elevated
                                </span>
                              )}
                              {record.status === 'LOW' && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                                  Below Range
                                </span>
                              )}
                              {isLatest && (
                                <span className="text-[10px] font-extrabold text-[#0F766E] uppercase tracking-wider">
                                  • Latest
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" /> {new Date(record.date).toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building className="w-3 h-3 text-slate-400" /> {record.lab}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500">
                          {record.doctor_reviewed ? (
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Clinician Reviewed
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Unreviewed</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
