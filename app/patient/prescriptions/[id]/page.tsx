'use client';

import React, { useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  ArrowLeft,
  Download,
  ShieldCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PatientPrescriptionDetailPage() {
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
        <p className="text-xs text-slate-500">Identifier {rxId} is not accessible in this portal.</p>
        <Link
          href="/patient"
          className="inline-block px-4 py-2 rounded-xl bg-[#217A56] text-white text-xs font-bold hover:bg-[#1B6447]"
        >
          Return to Patient Portal
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
      pdf.save(`My_Prescription_${rx.id}.pdf`);
    } catch {
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/patient"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{rx.id}</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#EEF7F0] text-[#217A56] border border-[#D0E7D7] text-[10px] font-black uppercase">
                {rx.status || 'APPROVED'}
              </span>
            </div>
            <p className="text-xs text-slate-500">Prescribed by {rx.doctor_name}</p>
          </div>
        </div>

        <button
          onClick={handleDownloadPdf}
          disabled={isExporting}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <Download className="w-4 h-4 text-[#217A56]" />
          <span>{isExporting ? 'Exporting...' : 'Save PDF'}</span>
        </button>
      </div>

      {/* Main Prescription Card */}
      <div
        ref={printRef}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6"
      >
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#217A56] bg-[#EEF7F0] px-2.5 py-0.5 rounded-full border border-[#D0E7D7] inline-block mb-1">
              Official e-Prescription
            </span>
            <h2 className="text-lg font-black text-slate-900">{rx.doctor_name}</h2>
            <p className="text-xs text-slate-600">{rx.hospital_name || 'Apollo Hospital New Delhi'}</p>
            <p className="text-[11px] text-slate-400">License: {rx.doctor_license || 'MCI-DEL-2018-4921'}</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono-code font-black text-slate-900">{rx.id}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">Date: {rx.prescription_date}</p>
            {rx.follow_up_date && (
              <p className="text-[11px] text-[#217A56] font-bold mt-1">Next Follow-up: {rx.follow_up_date}</p>
            )}
          </div>
        </div>

        {/* Medicines Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Prescribed Medications
          </h3>

          <div className="space-y-3">
            {rx.extracted_medicines.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-black text-slate-900">{m.medicine_name}</span>
                    <span className="text-xs font-bold text-[#217A56]">{m.strength}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600">
                    {m.frequency} • {m.duration}
                  </span>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed pt-1">
                  <span className="font-bold text-slate-800">Directions: </span>
                  {m.instructions || 'Take as advised by prescribing clinician.'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Instructions & Allergies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          {rx.diagnosis && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-bold text-slate-900 block mb-0.5">Consultation Diagnosis</span>
              <p className="text-slate-600">{rx.diagnosis}</p>
            </div>
          )}
          {rx.allergy_notes && (
            <div className="p-3.5 bg-red-50 rounded-2xl border border-red-200 text-red-700">
              <span className="font-bold block mb-0.5">Allergy Precautions</span>
              <p className="font-semibold">{rx.allergy_notes}</p>
            </div>
          )}
        </div>

        {/* SMS Accessibility Note */}
        <div className="p-4 rounded-2xl bg-[#EEF7F0] border border-[#D0E7D7] flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-[#217A56] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">Accessible on Simple Feature Phones</span>
            <p className="text-slate-600">
              Reference code <strong className="font-mono-code text-slate-900">{rx.id}</strong> was delivered via SMS to {rx.patient_phone || '+91 98765 43210'}. You can present this code at any registered pharmacy in India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
