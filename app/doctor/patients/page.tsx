'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  MapPin,
  Shield,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';

export default function DoctorPatientDirectoryPage() {
  const { patients, prescriptions } = useVerification();
  const [search, setSearch] = useState('');

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.abha_id && p.abha_id.includes(q))
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Patient Directory</h1>
              <p className="text-xs text-slate-500">Verified clinic patients with ABHA & SMS contact status</p>
            </div>
          </div>
        </div>

        <Link
          href="/doctor/prescriptions/new"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-[#0F766E]/20 hover:brightness-105 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-teal-200" />
          New Prescription
        </Link>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Patient ID, Name, Phone, or ABHA Number..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] shadow-2xs"
        />
      </div>

      {/* Patient Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((pat) => {
          const patRx = prescriptions.filter((rx) => rx.patient_id === pat.id || rx.patient_name === pat.name);

          return (
            <div
              key={pat.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-slate-900">{pat.name}</h3>
                    <span className="text-[10px] bg-teal-50 text-[#0F766E] font-mono-code font-bold px-2 py-0.5 rounded-md border border-teal-200">
                      {pat.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {pat.age} yrs • {pat.gender}
                  </p>
                </div>

                <Link
                  href={`/doctor/prescriptions/new?patientId=${pat.id}`}
                  className="px-3 py-1.5 rounded-xl bg-[#0F766E] text-white text-xs font-bold hover:brightness-110 transition-colors shadow-2xs"
                >
                  Prescribe
                </Link>
              </div>

              {/* Contact & Identity Details */}
              <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{pat.phone}</span>
                  <span className="text-[10px] text-[#0F766E] font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200">
                    SMS Verified
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate text-slate-600">{pat.address}</span>
                </div>
                {pat.abha_id && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-mono-code text-[11px] text-blue-700 font-semibold">ABHA: {pat.abha_id}</span>
                  </div>
                )}
              </div>

              {/* Allergies / Chronic Conditions Tag */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {pat.known_allergies && pat.known_allergies.length > 0 && (
                  <span className="text-[10px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-lg border border-rose-200 flex items-center gap-1">
                    <AlertCircle className="w-2.5 h-2.5" /> Allergy: {pat.known_allergies.join(', ')}
                  </span>
                )}
                {pat.chronic_conditions?.map((c) => (
                  <span key={c} className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-lg">
                    {c}
                  </span>
                ))}
              </div>

              {/* Prescription History Links */}
              <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {patRx.length} Prescription{patRx.length !== 1 ? 's' : ''} on record
                </span>
                {patRx.length > 0 ? (
                  <Link
                    href={`/doctor/prescriptions/${patRx[0].id}`}
                    className="text-[#0F766E] font-bold hover:underline flex items-center gap-1"
                  >
                    Latest ({patRx[0].id}) <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-slate-400 text-[11px]">No active prescriptions</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
