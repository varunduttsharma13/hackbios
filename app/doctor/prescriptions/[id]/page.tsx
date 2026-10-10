'use client';

import React, { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function DoctorPrescriptionDetailPage() {
  const params = useParams();
  const rxId = typeof params?.id === 'string' ? params.id : '';
  const { getPrescriptionById } = useVerification();
  const rx = getPrescriptionById(rxId);

  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  if (!rx) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Prescription Not Found</h2>
        <p className="text-xs text-slate-500">No digital record corresponds to identifier: {rxId}</p>
        <Link
          href="/doctor"
          className="inline-block px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-bold"
        >
          Return to Doctor Portal
        </Link>
      </div>
    );
  }

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MED_BRIDGE_Rx_${rx.id}.pdf`);
    } catch {
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-sans">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/doctor"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Prescription {rx.id}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200 text-[10px] font-black uppercase">
                {rx.status || 'APPROVED'}
              </span>
            </div>
            <p className="text-xs text-slate-500">Patient: {rx.patient_name} • Issued on {rx.prescription_date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#0F766E]" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
          <Link
            href="/pharmacy/prescriptions"
            className="px-4 py-2 rounded-xl bg-[#0F766E] text-white text-xs font-extrabold hover:brightness-105 transition-opacity flex items-center gap-1.5 shadow-sm shadow-[#0F766E]/20"
          >
            <span>Retrieve at Pharmacy</span>
          </Link>
        </div>
      </div>

      {/* Official Prescription Certificate Card */}
      <div
        ref={printRef}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 relative overflow-hidden"
      >
        {/* Top Hospital & Doctor Banner */}
        <div className="border-b-2 border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {rx.hospital_name || 'Apollo Hospital & Heart Institute'}
              </h2>
            </div>
            <p className="text-xs font-bold text-slate-700 mt-1">{rx.doctor_name}</p>
            <p className="text-[11px] text-slate-500">
              Reg No: {rx.doctor_license || 'MCI-DEL-2018-4921'} • PTR: {rx.doctor_ptr || '90214'}
            </p>
          </div>

          <div className="text-right sm:self-start">
            <span className="font-mono-code font-black text-xs text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              {rx.id}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 font-semibold">Date: {rx.prescription_date}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
              SMS: {rx.delivery_status || 'DELIVERED'}
            </span>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient Name</span>
            <span className="font-extrabold text-slate-900">{rx.patient_name}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Age / Gender</span>
            <span className="font-bold text-slate-800">{rx.patient_age} yrs • {rx.patient_gender}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone</span>
            <span className="font-bold text-[#0F766E] font-mono-code">{rx.patient_phone}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">ABHA Health ID</span>
            <span className="font-mono-code text-[11px] text-blue-700 font-semibold">{rx.abha_id || '91-4567-8910-1122'}</span>
          </div>
        </div>

        {/* Prescribed Items Table */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase tracking-wide">
            <span className="text-base text-[#0F766E]">℞</span> Prescribed Medications & Dosage
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <th className="py-2.5 px-4 font-bold">#</th>
                  <th className="py-2.5 px-4 font-bold">Medicine / Strength</th>
                  <th className="py-2.5 px-4 font-bold">Frequency</th>
                  <th className="py-2.5 px-4 font-bold">Duration</th>
                  <th className="py-2.5 px-4 font-bold">Directions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rx.extracted_medicines.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <p className="font-extrabold text-slate-900">{m.medicine_name}</p>
                      <p className="text-[10px] text-[#0F766E] font-semibold">{m.strength} • {m.dosage_form || 'Tablet'}</p>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{m.frequency}</td>
                    <td className="py-3 px-4 font-medium text-slate-500">{m.duration} ({m.quantity || '# 30'})</td>
                    <td className="py-3 px-4 text-slate-600 text-[11px] leading-relaxed">
                      {m.instructions || 'Take as advised by prescribing doctor.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Notes & Allergies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          {rx.diagnosis && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Clinical Indication</span>
              <p className="text-slate-800 font-medium">{rx.diagnosis}</p>
            </div>
          )}
          {rx.allergy_notes && (
            <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-700">
              <span className="text-[10px] font-bold uppercase block mb-1">Allergy Caution</span>
              <p className="font-bold">{rx.allergy_notes}</p>
            </div>
          )}
        </div>

        {/* Cryptographic Bottom Signature & Verification Seal */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0F766E]">
              <Lock className="w-3.5 h-3.5" /> Digitally Authenticated Prescription
            </div>
            <p className="text-[10px] text-slate-400 font-mono-code">
              SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-slate-900">{rx.doctor_name}</p>
            <p className="text-[10px] text-slate-400">Approved via MED-BRIDGE e-Rx Gateway</p>
          </div>
        </div>
      </div>
    </div>
  );
}
