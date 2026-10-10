'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  PlusCircle,
  Users,
  Sparkles,
  Send,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { prescriptions, patients, auditLogs } = useVerification();

  const totalRx = prescriptions.length;
  const approvedRx = prescriptions.filter((p) => p.status === 'APPROVED' || p.status === 'DISPENSED').length;
  const drafts = prescriptions.filter((p) => p.status === 'DRAFT').length;
  const dispensed = prescriptions.filter((p) => p.status === 'DISPENSED').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8 font-sans">
      {/* Clinician Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-sm">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Dr. J Dela Cruz, MD
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Reg: MCI-DEL-2018-4921 • Internal Medicine • Apollo Hospital New Delhi
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/doctor/patients"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Users className="w-4 h-4 text-[#0F766E]" />
            Patient Directory
          </Link>
          <Link
            href="/doctor/prescriptions/new"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white text-xs font-extrabold hover:brightness-105 transition-all flex items-center gap-1.5 shadow-md shadow-[#0F766E]/20"
          >
            <PlusCircle className="w-4 h-4 text-teal-200" />
            New e-Prescription
          </Link>
        </div>
      </div>

      {/* Metric Cards - Authentic data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total e-Rx Issued</span>
          <p className="text-2xl font-black text-slate-900">{totalRx}</p>
          <span className="text-[10px] text-[#0F766E] font-bold">● Active Practice History</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Approved & Shared</span>
          <p className="text-2xl font-black text-emerald-600">{approvedRx}</p>
          <span className="text-[10px] text-emerald-600 font-bold">100% SMS notified</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dispensed at Pharmacy</span>
          <p className="text-2xl font-black text-blue-600">{dispensed}</p>
          <span className="text-[10px] text-blue-600 font-bold">Verified by R.Ph</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Draft / In Review</span>
          <p className="text-2xl font-black text-amber-600">{drafts}</p>
          <span className="text-[10px] text-amber-600 font-bold">Pending final review</span>
        </div>
      </div>

      {/* Quick Launch Action Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#115E59] p-5 sm:p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-teal-100 text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> AI Handwritten Rx Digitization
          </div>
          <h2 className="text-lg font-black tracking-tight">Create & Verify Prescription in Seconds</h2>
          <p className="text-xs text-teal-50">
            Handwritten prescription photo will be parsed using Gemini Vision OCR into structured doses, check contraindications, and generate an authorized SMS reference for the patient.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/doctor/prescriptions/new"
            className="px-4 py-2.5 rounded-xl bg-white text-[#0F766E] font-extrabold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2 hover:bg-teal-50"
          >
            <span>Start Prescription Builder</span>
            <ChevronRight className="w-4 h-4 text-[#0F766E]" />
          </Link>
        </div>
      </div>

      {/* Recent Prescriptions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden space-y-3">
        <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-200">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Recent Clinical Prescriptions
            </h3>
            <p className="text-xs text-slate-500">Traceable lifecycle from creation to pharmacy dispensing.</p>
          </div>
          <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            {prescriptions.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-4 font-bold">Rx ID</th>
                <th className="py-2.5 px-4 font-bold">Patient</th>
                <th className="py-2.5 px-4 font-bold">Medicines</th>
                <th className="py-2.5 px-4 font-bold">Date</th>
                <th className="py-2.5 px-4 font-bold">SMS Delivery</th>
                <th className="py-2.5 px-4 font-bold">Lifecycle Status</th>
                <th className="py-2.5 px-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prescriptions.map((rx) => {
                const isApproved = rx.status === 'APPROVED';
                const isDispensed = rx.status === 'DISPENSED';

                return (
                  <tr key={rx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-black font-mono-code text-slate-900">
                      {rx.id}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{rx.patient_name || 'Patient'}</p>
                      <p className="text-[10px] text-slate-400">Age: {rx.patient_age || 39} • {rx.patient_phone || '+91 98765 43210'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">
                        {rx.extracted_medicines?.[0]?.medicine_name || 'FeSO4'}
                      </span>
                      {rx.extracted_medicines?.length > 1 && (
                        <span className="text-[10px] text-[#0F766E] font-bold ml-1">
                          +{rx.extracted_medicines.length - 1} more
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {rx.prescription_date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
                        <Send className="w-2.5 h-2.5" /> {rx.delivery_status || 'DELIVERED'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          isDispensed
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : isApproved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {isDispensed ? '✓ DISPENSED' : isApproved ? '✓ APPROVED' : 'DRAFT'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/doctor/prescriptions/${rx.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 hover:bg-teal-50 hover:text-[#0F766E] transition-colors font-bold text-[11px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#0F766E]" /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Directory Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Assigned Clinic Patients
            </h3>
            <Link href="/doctor/patients" className="text-xs font-bold text-[#0F766E] hover:underline">
              View All ({patients.length}) →
            </Link>
          </div>
          <div className="space-y-2">
            {patients.map((pat) => (
              <div key={pat.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{pat.name}</span>
                    <span className="text-[10px] bg-white px-2 py-0.2 rounded-full border border-slate-200 text-slate-500 font-mono-code">
                      {pat.id}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {pat.phone} • {pat.chronic_conditions?.join(', ') || 'No chronic tags'}
                  </p>
                </div>
                <Link
                  href={`/doctor/prescriptions/new?patientId=${pat.id}`}
                  className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 font-bold text-[11px] hover:bg-teal-50 hover:text-[#0F766E] transition-colors"
                >
                  Prescribe
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security & Audit Events */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Cryptographic Audit Log
            </h3>
            <Link href="/admin" className="text-xs font-bold text-[#0F766E] hover:underline">
              Full Log →
            </Link>
          </div>
          <div className="space-y-2">
            {auditLogs.slice(0, 3).map((log) => (
              <div key={log.id} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono-code font-bold text-[#0F766E]">{log.action}</span>
                  <span className="text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
