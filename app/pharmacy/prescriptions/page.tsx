'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
  AlertCircle,
  Building,
  User,
  CheckCircle2,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';

export default function PharmacyPrescriptionLookupPage() {
  const router = useRouter();
  const { prescriptions, getPrescriptionById } = useVerification();
  const [searchQuery, setSearchQuery] = useState('DS-10452');
  const [retrievedRx, setRetrievedRx] = useState<any | null>(prescriptions[0] || null);
  const [hasSearched, setHasSearched] = useState(true);

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim().toUpperCase();
    const found = prescriptions.find(
      (p) =>
        p.id.toUpperCase() === clean ||
        p.patient_phone?.includes(clean) ||
        p.patient_name?.toUpperCase().includes(clean)
    );
    setRetrievedRx(found || null);
    setHasSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Authorized Prescription Lookup
        </h1>
        <p className="text-xs text-slate-500">
          Retrieve doctor-approved digital prescriptions using Patient Reference ID or registered phone number.
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleLookup} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <label className="text-xs font-black text-slate-900 uppercase tracking-wide block">
          Enter Prescription Reference Number or Patient Phone
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. DS-10452 or +91 98765 43210"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono-code font-bold focus:outline-none focus:border-[#087E80] focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-[#087E80] hover:bg-[#065B5C] text-white text-xs font-black transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span>Retrieve</span>
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
          <span className="text-slate-400 font-semibold">Demo Quick Codes:</span>
          {prescriptions.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSearchQuery(p.id);
                setRetrievedRx(p);
              }}
              className="px-2.5 py-0.5 rounded-full bg-[#E9F6F5] border border-[#CEEBE8] text-[#087E80] font-mono-code font-bold hover:bg-teal-100 transition-colors"
            >
              {p.id} ({p.patient_name})
            </button>
          ))}
        </div>
      </form>

      {/* Retrieved Prescription Record Card */}
      {hasSearched && retrievedRx && (
        <div className="bg-white rounded-3xl p-6 border border-[#CEEBE8] shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-code font-black text-base text-slate-900">{retrievedRx.id}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#E9F6F5] text-[#087E80] border border-[#CEEBE8]">
                  ✓ {retrievedRx.status || 'APPROVED'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Issued by {retrievedRx.doctor_name} ({retrievedRx.hospital_name || 'Apollo Hospital'})
              </p>
            </div>

            <span className="text-xs font-bold text-slate-700 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
              Date: {retrievedRx.prescription_date}
            </span>
          </div>

          {/* Patient Demographics */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient</span>
              <span className="font-black text-slate-900">{retrievedRx.patient_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Age / Gender</span>
              <span className="font-semibold text-slate-700">{retrievedRx.patient_age} yrs • {retrievedRx.patient_gender}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Phone (SMS)</span>
              <span className="font-bold text-[#087E80] font-mono-code">{retrievedRx.patient_phone || '+91 98765 43210'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">ABHA ID</span>
              <span className="font-mono-code text-blue-700 text-[11px]">{retrievedRx.abha_id || '91-4567-8910-1122'}</span>
            </div>
          </div>

          {/* Prescribed Drugs Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide">
              Prescribed Medications
            </h3>

            <div className="space-y-2">
              {retrievedRx.extracted_medicines?.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-black text-slate-900">{m.medicine_name}</span>
                      <span className="font-bold text-[#087E80]">{m.strength}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{m.instructions || 'Standard dosage instructions'}</p>
                  </div>
                  <span className="font-semibold text-slate-600 text-[11px]">
                    {m.frequency} • {m.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action to proceed to Verification */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Ready to verify selected medicine against this approved prescription.
            </span>
            <Link
              href={`/pharmacy/verify?rxId=${retrievedRx.id}`}
              className="px-5 py-2.5 rounded-xl bg-[#087E80] hover:bg-[#065B5C] text-white font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Scan & Cross-Match Medicine Strip</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      )}

      {hasSearched && !retrievedRx && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Prescription Found</h3>
          <p className="text-xs text-slate-500">Check the reference number entered or ask the patient for their SMS receipt.</p>
        </div>
      )}
    </div>
  );
}
