'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, ChevronRight } from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';

export default function PatientPrescriptionsHistoryPage() {
  const { prescriptions, activeFamilyMember } = useVerification();

  const patientPrescriptions = prescriptions.filter(
    (p) => p.patient_name === activeFamilyMember?.name || p.patient_id === 'PAT-10452'
  );
  const activeRxList = patientPrescriptions.length > 0 ? patientPrescriptions : prescriptions;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/patient"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Prescription Records</h1>
            <p className="text-xs text-slate-500">Chronological e-prescriptions issued to your health profile</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {activeRxList.map((rx) => (
          <div
            key={rx.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-code font-black text-sm text-slate-900">{rx.id}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#EEF7F0] text-[#217A56] border border-[#D0E7D7]">
                    {rx.status || 'APPROVED'}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 mt-0.5">
                  {rx.doctor_name} • {rx.hospital_name || 'Apollo Hospital'}
                </p>
              </div>

              <span className="text-xs text-slate-500 font-semibold">
                Issued: {rx.prescription_date}
              </span>
            </div>

            {/* Medicines List */}
            <div className="space-y-2">
              {rx.extracted_medicines.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-black text-slate-900">{m.medicine_name}</span>
                    <span className="text-[#217A56] font-bold ml-1.5">{m.strength}</span>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.instructions || 'Take as directed.'}</p>
                  </div>
                  <span className="font-semibold text-slate-600 text-[11px] self-start sm:self-center">
                    {m.frequency} • {m.duration}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <Link
                href={`/patient/prescriptions/${rx.id}`}
                className="px-4 py-2 rounded-xl bg-[#217A56] text-white text-xs font-bold hover:bg-[#1B6447] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>View Full Instructions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
