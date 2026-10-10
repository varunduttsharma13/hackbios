'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Bell, 
  CheckCircle2, 
  ExternalLink, 
  Building2, 
  Calendar, 
  FileText,
  Search,
  ChevronRight,
  PhoneCall
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';

export default function SafetyAlertsPage() {
  const { alerts } = useVerification();
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAlerts = alerts.filter((a) => {
    const matchesTab = 
      activeTab === 'ALL' ? true :
      activeTab === 'CRITICAL' ? a.severity === 'CRITICAL' :
      activeTab === 'WARNING' ? a.severity === 'WARNING' :
      a.severity === 'INFO';

    const matchesSearch = 
      searchQuery.trim() === '' ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.medicine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.batch_number && a.batch_number.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              CDSCO Live Registry Sync
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Updated Today, 08:30 IST
          </span>
        </div>

        <div className="mt-3">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            National Drug Safety Bulletins
          </h1>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Real-time recalls, quality advisories, and substandard batch warnings from CDSCO and State Drug Control Authorities.
          </p>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-sm">
              {criticalCount}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">Active Recalls</p>
              <p className="text-xs font-semibold text-rose-950">Immediate Stop Order</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm">
              {warningCount}
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Quality Advisories</p>
              <p className="text-xs font-semibold text-amber-950">Verification Advised</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine name, batch number, or recall topic..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
          />
        </div>

        <div className="grid grid-cols-4 gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl text-center text-xs">
          {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 rounded-xl font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white text-emerald-950 shadow-sm font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All Alerts' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Matching Bulletins</h3>
            <p className="text-xs text-slate-500">None of your search terms match current CDSCO safety bulletins.</p>
          </div>
        ) : (
          filteredAlerts.map((item) => {
            const isCritical = item.severity === 'CRITICAL';
            const isWarning = item.severity === 'WARNING';

            return (
              <div
                key={item.id}
                className={`rounded-3xl p-5 border transition-all ${
                  isCritical
                    ? 'bg-gradient-to-b from-rose-50/70 via-white to-white border-rose-300 shadow-sm'
                    : isWarning
                    ? 'bg-gradient-to-b from-amber-50/60 via-white to-white border-amber-300 shadow-sm'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      isCritical
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : isWarning
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-sky-100 text-sky-800 border border-sky-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {item.severity} ADVISORY
                  </span>
                  
                  <span className="text-[11px] font-mono font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.date}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="mt-3">
                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Target Metadata Pill Grid */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Affected Molecule</span>
                    <strong className="text-slate-900 font-extrabold">{item.medicine_name}</strong>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Identified Batch</span>
                    {item.batch_number ? (
                      <span className="font-mono text-rose-700 font-black">
                        {item.batch_number}
                      </span>
                    ) : (
                      <span className="text-slate-600 italic">All Commercial Batches</span>
                    )}
                  </div>
                </div>

                {/* Source & Action Footer */}
                <div className="mt-3 flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.source}</span>
                  </div>

                  <Link
                    href={`/medicine/verify`}
                    className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 hover:text-emerald-900 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    Check My Strip <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Emergency Reporting Card */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Report Substandard / Spurious Medicine</h4>
            <p className="text-[11px] text-slate-400">National Pharmacovigilance Programme of India (PvPI)</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          If you have experienced an adverse drug reaction (ADR) or suspect counterfeit packaging, call the toll-free helpline at <strong className="text-amber-300">1800-180-3024</strong> or file an anonymous report.
        </p>

        <div className="flex gap-2 pt-1">
          <a
            href="tel:18001803024"
            className="flex-1 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs text-center transition-colors shadow-xs"
          >
            Call PvPI Helpline
          </a>
          <Link
            href="/medicine/scan"
            className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs text-center border border-white/20 transition-colors"
          >
            Scan Questionable Strip
          </Link>
        </div>
      </div>
    </div>
  );
}
