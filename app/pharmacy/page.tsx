'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  Search,
  Scan,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';

export default function PharmacistDashboardPage() {
  const { prescriptions, history } = useVerification();

  const pendingVerification = prescriptions.filter((p) => p.status === 'APPROVED').length;
  const dispensedTotal = prescriptions.filter((p) => p.status === 'DISPENSED').length;
  const mismatchTotal = history.filter((h) => h.match_status === 'MISMATCH').length;
  const verifiedTotal = history.filter((h) => h.match_status === 'MATCHED').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Pharmacy Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E9F6F5] text-[#087E80] flex items-center justify-center font-bold border border-[#CEEBE8]">
              <Store className="w-5 h-5 text-[#087E80]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  MedPlus Pharmacy #104
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9F6F5] text-[#087E80] border border-[#CEEBE8]">
                  Licensed Dispenser
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Priya Verma, R.Ph • DL: 20B/21B-DL-9821 • Paschim Vihar, New Delhi
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/pharmacy/prescriptions"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Search className="w-4 h-4 text-[#087E80]" />
            Lookup Rx
          </Link>
          <Link
            href="/pharmacy/verify"
            className="px-4 py-2 rounded-xl bg-[#087E80] hover:bg-[#065B5C] text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Scan className="w-4 h-4 text-white" />
            Verify Strip & Dispense
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Dispensing</span>
          <p className="text-2xl font-black text-amber-600 font-mono-code">{pendingVerification}</p>
          <span className="text-[10px] text-amber-700 font-medium">Awaiting blister match</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Matches Verified</span>
          <p className="text-2xl font-black text-emerald-600 font-mono-code">{verifiedTotal}</p>
          <span className="text-[10px] text-emerald-700 font-medium">CDSCO Compliant</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mismatches Prevented</span>
          <p className="text-2xl font-black text-red-600 font-mono-code">{mismatchTotal}</p>
          <span className="text-[10px] text-red-700 font-medium">Safety Shields Triggered</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dispensed Total</span>
          <p className="text-2xl font-black text-blue-600 font-mono-code">{dispensedTotal}</p>
          <span className="text-[10px] text-blue-700 font-medium">Audited & Logged</span>
        </div>
      </div>

      {/* Operational Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#087E80] to-[#065B5C] p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/15 text-teal-100 border border-white/20 inline-block">
            Standard Operating Procedure
          </span>
          <h2 className="text-lg font-black tracking-tight">Prescription ↔ Blister Strip Cross-Check</h2>
          <p className="text-xs text-teal-50/90 leading-relaxed">
            Retrieve doctor-approved digital prescriptions using Patient Reference ID or QR code, verify physical medicine packaging via camera/OCR, and record authorized dispensing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/pharmacy/prescriptions"
            className="px-4 py-2.5 rounded-xl bg-white text-[#087E80] hover:bg-teal-50 font-black text-xs transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Lookup Prescription</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Authorized Prescriptions Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden space-y-3">
        <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Prescriptions Available for Dispensing
            </h3>
            <p className="text-xs text-slate-500">Authorized prescriptions retrieved via SMS reference or QR code.</p>
          </div>
          <Link
            href="/pharmacy/prescriptions"
            className="text-xs font-bold text-[#087E80] hover:underline"
          >
            Open Lookup →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-4 font-bold">Rx Reference</th>
                <th className="py-2.5 px-4 font-bold">Patient</th>
                <th className="py-2.5 px-4 font-bold">Prescribing Clinician</th>
                <th className="py-2.5 px-4 font-bold">Prescribed Medicines</th>
                <th className="py-2.5 px-4 font-bold">Status</th>
                <th className="py-2.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono-code font-black text-slate-900">
                    {rx.id}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{rx.patient_name}</p>
                    <p className="text-[10px] text-slate-500">{rx.patient_phone || '+91 98765 43210'}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800">{rx.doctor_name}</p>
                    <p className="text-[10px] text-slate-500">{rx.hospital_name || 'Hospital'}</p>
                  </td>
                  <td className="py-3 px-4">
                    {rx.extracted_medicines.map((m) => (
                      <span key={m.id} className="inline-block bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg text-[10px] font-bold text-slate-800 mr-1 mb-1">
                        {m.medicine_name} ({m.strength})
                      </span>
                    ))}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        rx.status === 'DISPENSED'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-[#E9F6F5] text-[#087E80] border-[#CEEBE8]'
                      }`}
                    >
                      {rx.status || 'APPROVED'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/pharmacy/verify?rxId=${rx.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#087E80] text-white hover:bg-[#065B5C] transition-colors font-bold text-[11px] shadow-2xs"
                    >
                      <Scan className="w-3.5 h-3.5 text-white" /> Verify Strip
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
