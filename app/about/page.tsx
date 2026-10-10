'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileCheck,
  Stethoscope,
  Pill,
  QrCode,
  Lock,
  PhoneCall,
  Mail,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  FolderLock,
  FileUp,
  FileDown,
} from 'lucide-react';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'about' | 'records_guide' | 'privacy' | 'support'>('about');

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Brand Hero */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-700/50 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide uppercase mb-3 border border-teal-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            MED-BRIDGE • National Healthcare Safety Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            MED-BRIDGE
          </h1>
          <p className="text-teal-100/90 text-sm mt-3 leading-relaxed">
            An end-to-end clinical prescription verification and medication safety platform protecting patients from adverse drug events, counterfeit dispensing, and multi-drug interactions across India.
          </p>
          <div className="flex items-center gap-3 mt-4 text-xs text-teal-200">
            <span>Version <strong>2.4.0 (Enterprise Clinical)</strong></span>
            <span>•</span>
            <span>ABDM & DLT Ready</span>
            <span>•</span>
            <span>Dual OCR Engine</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'about', label: 'About MED-BRIDGE' },
          { id: 'records_guide', label: 'Health Records & Documents' },
          { id: 'privacy', label: 'Privacy & Security (ABDM)' },
          { id: 'support', label: 'Help, Toll-Free & Support' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: About MED-BRIDGE */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          {/* Core Architecture */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">How Prescription Verification Works</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              MED-BRIDGE deploys a 6-point clinical safety engine bridging clinicians, patients, and dispensing pharmacists. Every digitized prescription undergoes automated verification prior to medication fulfillment:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <strong className="text-xs text-slate-900 block">Clinician Authorization</strong>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Doctor enters e-prescription with automated allergy screening, dosage caps, and drug-drug interaction alerts.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <strong className="text-xs text-slate-900 block">Patient Verification & SMS</strong>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Patient receives SMS notification with secure QR token and real-time safety warnings in regional languages.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <strong className="text-xs text-slate-900 block">Pharmacist Strip Scan</strong>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Pharmacist scans physical strip barcode/text. System verifies composition, batch number, and expiry date.
                </p>
              </div>
            </div>
          </div>

          {/* Clinical Workflows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-blue-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
                <Stethoscope className="w-4 h-4" />
                <span>Doctor Workspace</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate digitally-signed e-prescriptions with automatic interaction warnings, patient clinical history review, and instant dispensing trackability.
              </p>
              <Link
                href="/doctor"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 pt-1"
              >
                <span>Launch Doctor Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-emerald-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                <Pill className="w-4 h-4" />
                <span>Patient Portal</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                View current medications, download PDF prescriptions, verify strips at home with AI vision camera, and manage encrypted health records.
              </p>
              <Link
                href="/patient"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 pt-1"
              >
                <span>Launch Patient Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-teal-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
                <QrCode className="w-4 h-4" />
                <span>Pharmacy Verification</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lookup prescription QR tokens, perform two-point physical strip validation, check expiry, and record cryptographic dispensing confirmation.
              </p>
              <Link
                href="/pharmacy"
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 pt-1"
              >
                <span>Launch Pharmacy Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Health Records Guide */}
      {activeTab === 'records_guide' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Health Records Management Features</h3>
            <Link
              href="/records"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold"
            >
              <span>Open Health Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            MED-BRIDGE provides a comprehensive document vault supporting 13 medical record categories, multi-format export, and bulk import:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Supported Record Categories</strong>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Digital Prescriptions, Doctor Handwritten Prescriptions, Blood Tests, Lab Reports, Imaging (X-Ray/MRI), Allergy Profiles, Vaccination Certificates, Discharge Summaries, and Medical Fitness Certificates.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-1">Multi-Format Import & Export</strong>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Import CSV, XLSX, and JSON files with automatic field mapping and duplicate candidate detection. Export PDF clinical summaries, Excel workbooks, or CSV files with UTF-8 Hindi text preservation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Privacy & Security */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Lock className="w-5 h-5 text-teal-700" />
            <span>Privacy Principles & ABDM Data Standards</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">1. Cryptographic Record Privacy</strong>
              <p>
                Health records and medical documents are restricted exclusively to the authenticated user. Public links are never generated without explicit consent.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">2. No Unverified Clinical Diagnosis</strong>
              <p>
                MED-BRIDGE does not infer medical diagnoses from uploaded documents or symptom selections. OCR extractions are explicitly tagged as &ldquo;Needs Review&rdquo; until confirmed by a clinician.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">3. Immutable Audit Trails</strong>
              <p>
                All prescription approvals, dispensing actions, and SMS dispatches are recorded with tamper-evident cryptographic checksums conforming to the ABDM Health Data Management Policy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Help & Support */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">National Health Helplines & Support</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-teal-800">MED-BRIDGE Patient Desk</span>
              <strong className="text-base text-teal-900 block">1800-MED-BRIDGE (1800-633-274)</strong>
              <span className="text-[11px] text-teal-700 block">Toll-free 24/7 across India</span>
            </div>

            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-rose-800">National Emergency Services</span>
              <strong className="text-base text-rose-900 block">112 (National) / 108 (Ambulance)</strong>
              <span className="text-[11px] text-rose-700 block">Immediate clinical dispatch</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Pharmacovigilance Programme of India</span>
              <strong className="text-sm text-slate-900 block">PvPI Helpline: 1800-180-3024</strong>
              <span className="text-[11px] text-slate-500 block">Adverse Drug Reaction Reporting</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-500">Technical Support</span>
              <strong className="text-sm text-slate-900 block">support@medbridge.gov.in</strong>
              <span className="text-[11px] text-slate-500 block">Response within 24 hours</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
