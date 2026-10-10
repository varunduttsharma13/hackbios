'use client';

import React from 'react';
import Link from 'next/link';
import {
  Heart,
  Pill,
  Clock,
  FileText,
  ShieldCheck,
  ChevronRight,
  Download,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';

export default function PatientDashboardPage() {
  const { prescriptions, activeFamilyMember } = useVerification();

  // Filter prescriptions for current patient
  const patientPrescriptions = prescriptions.filter(
    (p) => p.patient_name === activeFamilyMember?.name || p.patient_id === 'PAT-10452'
  );
  const activeRxList = patientPrescriptions.length > 0 ? patientPrescriptions : prescriptions;
  const currentRx = activeRxList[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Calm Patient Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF7F0] text-[#217A56] flex items-center justify-center font-bold border border-[#D0E7D7]">
              <Heart className="w-5 h-5 text-[#217A56]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Namaste, {activeFamilyMember?.name || 'Lolita'}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F0] text-[#217A56] border border-[#D0E7D7]">
                  Patient Pass
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Your personal prescription safety & medication regimen overview
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/history"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-2xs"
          >
            History
          </Link>
          <a
            href="tel:18003292472"
            className="px-3.5 py-2 rounded-xl bg-[#217A56] text-white text-xs font-bold hover:bg-[#1B6447] transition-all flex items-center gap-1.5 shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-200" />
            <span>1800-MED-BRIDGE</span>
          </a>
        </div>
      </div>

      {/* Featured Current Prescription Card */}
      {currentRx && (
        <div className="rounded-3xl bg-gradient-to-br from-[#217A56] to-[#17573D] text-white p-6 shadow-md relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/15 text-emerald-100 border border-white/20">
              Active Prescription
            </span>
            <span className="text-xs font-mono-code font-bold text-emerald-200">
              ID: {currentRx.id}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-black tracking-tight">{currentRx.doctor_name}</h2>
            <p className="text-xs text-emerald-100/80 mt-0.5">{currentRx.hospital_name || 'Apollo Multi-Specialty Clinic'}</p>
          </div>

          {/* Quick List of Medicines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {currentRx.extracted_medicines.map((m, idx) => (
              <div key={idx} className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{m.medicine_name}</span>
                  <span className="text-[10px] font-bold text-emerald-200">{m.strength}</span>
                </div>
                <p className="text-[11px] text-emerald-100/90">
                  {m.frequency} • {m.duration}
                </p>
                {m.instructions && (
                  <p className="text-[10px] text-white/80 italic">&quot;{m.instructions}&quot;</p>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Status: <strong className="text-white">{currentRx.status || 'APPROVED'}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/patient/prescriptions/${currentRx.id}`}
                className="px-4 py-2 rounded-xl bg-white text-[#217A56] hover:bg-emerald-50 font-black text-xs transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
              >
                <span>View Full Details & Instructions</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* New Major Features Quick Access Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/records"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-teal-500/50 hover:shadow-md transition-all group space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              ABDM Compliant Vault
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
            Health Records & Reports
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload diagnostic reports, search historical records, import files, and export patient dossiers in PDF/Excel.
          </p>
        </Link>

        <Link
          href="/health-guide"
          className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-teal-500/50 hover:shadow-md transition-all group space-y-2 block"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Clinical Reference
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
            Common Conditions & Medicines Hub
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Understand symptoms (fever, cough, allergies, digestion), review precautions, explore medicine classes & warning signs.
          </p>
        </Link>
      </div>

      {/* Patient Prescription History */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Your Prescriptions
            </h3>
            <p className="text-xs text-slate-500">Digital records authorized for your profile</p>
          </div>
          <Link
            href="/patient/prescriptions"
            className="text-xs font-bold text-[#217A56] hover:underline"
          >
            View All ({activeRxList.length}) →
          </Link>
        </div>

        <div className="space-y-2.5">
          {activeRxList.map((rx) => (
            <div
              key={rx.id}
              className="p-4 rounded-2xl bg-[#F8FAF9] border border-slate-200 hover:border-[#217A56]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code font-black text-slate-900">{rx.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF7F0] text-[#217A56] border border-[#D0E7D7]">
                    {rx.status || 'APPROVED'}
                  </span>
                  <span className="text-[11px] text-slate-500">{rx.prescription_date}</span>
                </div>
                <p className="font-bold text-slate-800">{rx.doctor_name}</p>
                <p className="text-[11px] text-slate-600">
                  {rx.extracted_medicines.map((m) => `${m.medicine_name} (${m.strength})`).join(' • ')}
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <Link
                  href={`/patient/prescriptions/${rx.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-xs hover:bg-[#EEF7F0] hover:text-[#217A56] transition-colors shadow-2xs"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Safe Medication Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-2 text-amber-900">
          <div className="flex items-center gap-2 font-black text-sm text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            <span>Before Consuming Your Medicine</span>
          </div>
          <p className="leading-relaxed text-amber-800">
            Always verify that the tablet blister strip given to you by the pharmacy has the exact same name, strength (mg), and valid expiry date as shown in your digital prescription.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 space-y-2 text-slate-600">
          <div className="flex items-center gap-2 font-black text-sm text-slate-900">
            <HelpCircle className="w-4 h-4 text-[#217A56]" />
            <span>Have Questions on Your Dose?</span>
          </div>
          <p className="leading-relaxed">
            If you experience unexpected side effects or need clarification on whether to take medicines with meals, reach out to your prescribing doctor or local pharmacist immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
