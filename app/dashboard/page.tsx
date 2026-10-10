'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  QrCode,
  Pill,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Activity,
  FileCheck2,
  Zap,
  Heart,
  Clock,
  Calendar,
  AlertOctagon,
  FileText,
  BadgeAlert,
  Layers,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { ResponsiveSheet } from '@/components/ui/ResponsiveSheet';

export default function DashboardPage() {
  const router = useRouter();
  const { user, activeFamilyMember, history, alerts, triggerDemoScenario } = useVerification();
  const [showDemoSheet, setShowDemoSheet] = useState(false);

  const activeAlertCount = alerts.filter((a) => a.active).length;

  const handleRunDemo = (scenario: 'MATCH' | 'MISMATCH' | 'EXPIRED' | 'LOW_CONFIDENCE' | 'ALERT' | 'LOLITA_SAFE') => {
    triggerDemoScenario(scenario);
    setShowDemoSheet(false);
    if (scenario === 'MATCH' || scenario === 'MISMATCH' || scenario === 'EXPIRED' || scenario === 'ALERT' || scenario === 'LOLITA_SAFE') {
      router.push('/match');
    } else {
      router.push('/prescription/results');
    }
  };

  const totalScans = history.length;
  const matchCount = history.filter((h) => h.match_status === 'MATCHED').length;
  const passRate = totalScans > 0 ? Math.round((matchCount / totalScans) * 100) : 100;

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-6">
      {/* Top Greeting & Verification Profile Bar */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Namaste, {user?.name ? user.name.split(' ')[0] : 'Varun'}
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Protecting <span className="text-[#0F766E] font-bold">{activeFamilyMember?.name || 'Varun (Self)'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDemoSheet(true)}
            className="px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#0F766E] text-[11px] font-black flex items-center gap-1.5 hover:bg-teal-100 active:scale-95 transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0F766E] animate-spin" style={{ animationDuration: '6s' }} />
            <span>5 Scenarios</span>
          </button>
        </div>
      </div>

      {/* Hero Card: Refined Clinical Teal & Cyan Accents */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F766E] via-[#0D9488] to-[#115E59] text-white p-5 sm:p-6 shadow-xl shadow-teal-900/10 border border-teal-600/40 space-y-3.5">
        {/* Glow backdrop decorative blobs */}
        <div className="absolute -top-10 -right-10 w-36 h-36 bg-teal-300/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-sky-400/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[10px] font-black tracking-wider uppercase backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-white" /> MED-BRIDGE AI ENGINE
          </div>
          <span className="text-[10px] text-teal-100 font-bold bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
            CDSCO Synced
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight uppercase drop-shadow-xs">
            VERIFY PRESCRIPTION ↔ MEDICINE STRIP
          </h2>
          <p className="text-xs text-teal-50 mt-1 leading-relaxed font-medium">
            AI handwritten OCR cross-matched against national medicine blister packaging registry.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Link
            href="/prescription/capture"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-[#0F766E] font-black text-xs hover:bg-teal-50 active:scale-95 transition-all shadow-md flex-1 touch-press"
          >
            <Camera className="w-4 h-4" /> Scan Prescription (Rx) <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/medicine/scan"
            className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs active:scale-95 transition-all"
          >
            <QrCode className="w-4 h-4 text-teal-200" /> Scan Strip QR
          </Link>
        </div>
      </div>

      {/* Role Workspace Navigation: Doctor -> Patient -> Pharmacist -> Admin */}
      <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0F766E]" /> Digital Healthcare Portals
          </span>
          <span className="text-[10px] text-[#0F766E] font-bold">End-to-End Workflow</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <Link
            href="/doctor"
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50/60 hover:border-teal-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold mb-1 group-hover:scale-105 transition-transform">
              🩺
            </div>
            <span className="font-extrabold text-slate-900 text-[11px]">Doctor Portal</span>
            <span className="text-[9px] text-slate-500">Create & Approve Rx</span>
          </Link>

          <Link
            href="/patient"
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50/60 hover:border-teal-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#059669] text-white flex items-center justify-center font-bold mb-1 group-hover:scale-105 transition-transform">
              👤
            </div>
            <span className="font-extrabold text-slate-900 text-[11px]">Patient Portal</span>
            <span className="text-[9px] text-slate-500">SMS e-Prescription</span>
          </Link>

          <Link
            href="/pharmacy"
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50/60 hover:border-teal-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-bold mb-1 group-hover:scale-105 transition-transform">
              🏪
            </div>
            <span className="font-extrabold text-slate-900 text-[11px]">Pharmacy Portal</span>
            <span className="text-[9px] text-slate-500">Lookup & Dispense</span>
          </Link>

          <Link
            href="/admin"
            className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-teal-50/60 hover:border-teal-300 transition-all flex flex-col items-center text-center group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-bold mb-1 group-hover:scale-105 transition-transform">
              📊
            </div>
            <span className="font-extrabold text-slate-900 text-[11px]">Admin & Logs</span>
            <span className="text-[9px] text-slate-500">Audit & Analytics</span>
          </Link>
        </div>
      </div>

      {/* Colorful 1-Tap Quick Demo Scenarios Strip */}
      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#0F766E]" /> Hackathon Demo Scenarios
          </span>
          <span className="text-[9px] text-slate-500 font-bold">1-Click Live Tests</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => handleRunDemo('MATCH')}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-900 border border-teal-300 text-[10px] font-black whitespace-nowrap hover:bg-[#0F766E] hover:text-white transition-all shadow-2xs flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ✓ S1: Exact Match (Safe)
          </button>
          <button
            onClick={() => handleRunDemo('MISMATCH')}
            className="px-3 py-1.5 rounded-xl bg-white text-[#E11D48] border border-[#F43F5E] text-[10px] font-black whitespace-nowrap hover:bg-[#E11D48] hover:text-white transition-all shadow-2xs flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
            🚨 S2: Mismatch (Hero Alert)
          </button>
          <button
            onClick={() => handleRunDemo('EXPIRED')}
            className="px-3 py-1.5 rounded-xl bg-white text-[#D97706] border border-[#F59E0B] text-[10px] font-black whitespace-nowrap hover:bg-[#D97706] hover:text-white transition-all shadow-2xs flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            ⚠ S3: Expired Product
          </button>
          <button
            onClick={() => handleRunDemo('LOW_CONFIDENCE')}
            className="px-3 py-1.5 rounded-xl bg-white text-[#1D4ED8] border border-[#3B82F6] text-[10px] font-black whitespace-nowrap hover:bg-[#1D4ED8] hover:text-white transition-all shadow-2xs flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            🟡 S4: Unclear Rx Handwriting
          </button>
          <button
            onClick={() => handleRunDemo('ALERT')}
            className="px-3 py-1.5 rounded-xl bg-white text-[#7C3AED] border border-[#8B5CF6] text-[10px] font-black whitespace-nowrap hover:bg-[#7C3AED] hover:text-white transition-all shadow-2xs flex items-center gap-1"
          >
            <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
            🚨 S5: CDSCO Recall Batch
          </button>
        </div>
      </div>

      {/* 4 Colorful Medical Safety Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Card 1: Total Verifications */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Verifications</span>
            <div className="w-6 h-6 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-900 mt-1">{totalScans}</p>
          <p className="text-[10px] text-[#0F766E] font-bold mt-0.5">Logs Recorded</p>
        </div>

        {/* Card 2: Match Precision */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Safety Score</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-emerald-600 mt-1">{passRate}%</p>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Verified Safe</p>
        </div>

        {/* Card 3: Hazard Alerts */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">CDSCO Alerts</span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-rose-600 mt-1">{activeAlertCount}</p>
          <p className="text-[10px] text-rose-600 font-bold mt-0.5">Action Needed</p>
        </div>

        {/* Card 4: Drug Interactions */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Interactions</span>
            <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-xl font-black text-purple-600 mt-1">2</p>
          <p className="text-[10px] text-purple-600 font-bold mt-0.5">Monitored</p>
        </div>
      </div>

      {/* Active Medical Regimen Card (Human Healthcare Detail) */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                Current Active Prescriptions
              </h3>
              <p className="text-[10px] text-slate-500">Dr. Arvind Mehta • Apollo Hospitals</p>
            </div>
          </div>
          <Link href="/interactions" className="text-[11px] font-bold text-blue-600 hover:underline">
            Interaction Check →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Medicine 1 */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-900">Metformin 500 mg</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                ✓ Confirmed
              </span>
            </div>
            <p className="text-[11px] text-slate-600">Twice daily with meals (Breakfast & Dinner)</p>
            <p className="text-[10px] text-slate-400 font-mono-code">Batch: MET500A | Exp: Aug 2026</p>
          </div>

          {/* Medicine 2 */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-all space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-slate-900">Atorvastatin 10 mg</span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                ✓ Confirmed
              </span>
            </div>
            <p className="text-[11px] text-slate-600">Once daily at bedtime</p>
            <p className="text-[10px] text-slate-400 font-mono-code">Batch: ATO1001 | Exp: Dec 2026</p>
          </div>
        </div>
      </div>

      {/* Two Main Verification Action Portals */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase px-1">
          Quick Verification Portals
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Scan Prescription */}
          <Link
            href="/prescription/capture"
            className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-[#0F766E] shadow-xs hover:shadow-md transition-all space-y-2.5 group active:scale-95 touch-press"
          >
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs">Scan Prescription</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Read doctor Rx with AI OCR</p>
            </div>
          </Link>

          {/* Scan Medicine */}
          <Link
            href="/medicine/scan"
            className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all space-y-2.5 group active:scale-95 touch-press"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs">Scan Strip / QR</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Scan QR or strip barcode</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Health Records & Conditions Hub Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase px-1">
          Health Records & Clinical Guide
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Link
            href="/records"
            className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-md transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                Encrypted Vault
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <h4 className="font-black text-slate-900 text-xs group-hover:text-teal-700 transition-colors">
              Health Records & Reports
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Maintain diagnostic reports, import CSV/XLSX/JSON & export PDF summaries.
            </p>
          </Link>

          <Link
            href="/health-guide"
            className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-teal-500 shadow-xs hover:shadow-md transition-all space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                12 Categories
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <h4 className="font-black text-slate-900 text-xs group-hover:text-teal-700 transition-colors">
              Medicines & Conditions Hub
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Explore symptoms (fever, cough, cold, digestion), precautions & emergency signs.
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Verifications Activity Feed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-[#758F83] tracking-wider uppercase">
            Recent Verification Records
          </h3>
          <Link href="/history" className="text-[11px] font-extrabold text-[#0F766E] hover:underline">
            View All ({history.length}) →
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xs space-y-2">
          {history.slice(0, 3).map((item) => {
            const isMatched = item.match_status === 'MATCHED';

            return (
              <div
                key={item.id}
                onClick={() => router.push('/safety')}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:bg-teal-50/40 cursor-pointer transition-all active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isMatched ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {isMatched ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 truncate max-w-[160px]">
                      {item.scanned_medicine_name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {isMatched ? 'Rx ↔ Strip Match verified' : 'Mismatch detected!'}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    isMatched
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isMatched ? 'MATCHED' : 'MISMATCH'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Recall Urgent Notification Banner */}
      <Link href="/alerts" className="block">
        <div className="p-3.5 bg-gradient-to-r from-amber-50 via-amber-100/60 to-rose-50 border border-amber-300 rounded-2xl flex items-center justify-between hover:shadow-xs active:scale-98 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">CDSCO DRUG RECALL BULLETIN ACTIVE</p>
              <p className="text-[11px] text-slate-600 font-semibold">{activeAlertCount} alert requires patient attention</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-600" />
        </div>
      </Link>

      {/* Demo Scenarios Drawer */}
      <ResponsiveSheet
        isOpen={showDemoSheet}
        onClose={() => setShowDemoSheet(false)}
        title="Hackathon Live Verification Scenarios"
      >
        <div className="space-y-2.5">
          <p className="text-xs text-slate-500">
            Test complete end-to-end clinical verification logic with 1 click:
          </p>

          <button
            onClick={() => handleRunDemo('LOLITA_SAFE')}
            className="w-full p-3 bg-gradient-to-r from-teal-50 via-teal-100/60 to-emerald-50 border-2 border-[#0F766E] rounded-2xl text-left hover:brightness-105 transition-all flex items-center justify-between shadow-xs"
          >
            <div>
              <p className="text-xs font-black text-slate-900">⭐ Featured: Lolita Alvarez Rx (FeSO4 + Vit C)</p>
              <p className="text-[11px] text-[#0F766E] font-bold">FeSO4 tab #30 ↔ Ferrous Sulfate 325mg Strip Match</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#0F766E]" />
          </button>

          <button
            onClick={() => handleRunDemo('MATCH')}
            className="w-full p-3 bg-teal-50/70 border border-teal-300 rounded-2xl text-left hover:bg-teal-100/60 transition-all flex items-center justify-between shadow-2xs"
          >
            <div>
              <p className="text-xs font-black text-slate-900">✓ Scenario 1: Rx ↔ Strip MATCH</p>
              <p className="text-[11px] text-slate-600">Metformin 500mg Rx ↔ Metformin 500mg Strip</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#0F766E]" />
          </button>

          <button
            onClick={() => handleRunDemo('MISMATCH')}
            className="w-full p-3 bg-rose-50 border border-rose-300 rounded-2xl text-left hover:bg-rose-100/60 transition-all flex items-center justify-between shadow-2xs"
          >
            <div>
              <p className="text-xs font-black text-rose-700">🚨 Scenario 2: MISMATCH (WOW DEMO)</p>
              <p className="text-[11px] text-slate-600">Metformin 500mg Rx ↔ Azithromycin 500mg Strip</p>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-600" />
          </button>

          <button
            onClick={() => handleRunDemo('EXPIRED')}
            className="w-full p-3 bg-amber-50 border border-amber-300 rounded-2xl text-left hover:bg-amber-100/60 transition-all flex items-center justify-between shadow-2xs"
          >
            <div>
              <p className="text-xs font-black text-amber-700">⚠ Scenario 3: EXPIRED MEDICINE</p>
              <p className="text-[11px] text-slate-600">Pantoprazole 40mg Rx ↔ Expired Strip Batch</p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-600" />
          </button>

          <button
            onClick={() => handleRunDemo('LOW_CONFIDENCE')}
            className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-left hover:border-[#0F766E] transition-all flex items-center justify-between shadow-2xs"
          >
            <div>
              <p className="text-xs font-black text-slate-900">🟡 Scenario 4: UNCLEAR RX HANDWRITING (61%)</p>
              <p className="text-[11px] text-slate-600">Unclear doctor cursive handwriting confirmation</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#0F766E]" />
          </button>

          <button
            onClick={() => handleRunDemo('ALERT')}
            className="w-full p-3 bg-rose-50 border border-rose-300 rounded-2xl text-left hover:bg-rose-100/60 transition-all flex items-center justify-between shadow-2xs"
          >
            <div>
              <p className="text-xs font-black text-rose-700">🚨 Scenario 5: CDSCO RECALL BATCH</p>
              <p className="text-[11px] text-slate-600">Paracetamol 500mg Rx ↔ Recalled Batch PAR500REC</p>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-600" />
          </button>
        </div>
      </ResponsiveSheet>
    </div>
  );
}


