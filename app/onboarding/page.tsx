'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FileText,
  QrCode,
  ShieldAlert,
  Lock,
} from 'lucide-react';

export default function OnboardingPage() {
  const steps = [
    {
      title: 'Doctor e-Prescription',
      desc: 'AI Vision extracts handwritten prescriptions, salt molecules, and dosage schedules.',
      icon: FileText,
      badge: 'Step 1',
      color: 'from-[#0284C7] to-[#38BDF8]',
    },
    {
      title: 'Physical Blister Strip',
      desc: 'Scan 2D DataMatrix, barcode, or blister pack batch number with instant OCR.',
      icon: QrCode,
      badge: 'Step 2',
      color: 'from-[#0F766E] to-[#2DD4BF]',
    },
    {
      title: '6-Point Verification',
      desc: 'Deterministic cross-check of active salt, strength, form, expiration, and allergies.',
      icon: ShieldCheck,
      badge: 'Step 3',
      color: 'from-[#D97706] to-[#FBBF24]',
    },
    {
      title: 'CDSCO Recall & Alerts',
      desc: 'Instant warnings for recalled drug batches, counterfeit packaging, and LASA errors.',
      icon: ShieldAlert,
      badge: 'Step 4',
      color: 'from-[#E11D48] to-[#FB7185]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] text-[#0F172A] flex flex-col justify-between p-4 sm:p-6 md:p-10 relative overflow-hidden font-sans">
      {/* Subtle Luminous Ambient Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[450px] h-[450px] bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between z-10 max-w-xl mx-auto w-full"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#0D9488] flex items-center justify-center text-white font-black shadow-md shadow-[#0F766E]/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-[#0F172A] block">
              MED-BRIDGE
            </span>
            <span className="text-[10px] text-[#0F766E] tracking-wider uppercase font-bold">
              Healthcare Network
            </span>
          </div>
        </div>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center gap-1.5 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" /> ABDM COMPLIANT
        </span>
      </motion.div>

      {/* Main Center Hero Section */}
      <div className="my-auto py-6 z-10 max-w-xl mx-auto w-full text-center">
        {/* Shield Icon Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-[#0F766E] to-[#2DD4BF] p-1 shadow-xl shadow-[#0F766E]/20"
        >
          <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center border border-teal-100 shadow-inner">
            <ShieldCheck className="w-10 h-10 text-[#0F766E]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] mb-1"
        >
          MED-BRIDGE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center justify-center gap-2 mb-2"
        >
          <span className="text-xl sm:text-2xl font-bold text-[#0F766E]">Medication Safety</span>
          <span className="text-slate-300">•</span>
          <span className="text-xs sm:text-sm font-bold text-slate-500 tracking-wide uppercase">
            National Healthcare Network
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#0F766E] font-bold text-sm sm:text-base mb-1 font-editorial italic tracking-wide"
        >
          “Sahi Dawai. Sahi Dose. Surakshit Zindagi.”
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-xs sm:text-sm text-slate-700 font-semibold mb-2"
        >
          Your medicines. Your prescription. Your safety.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed"
        >
          Access prescriptions, verify medicines, and stay informed with a connected healthcare experience connecting Doctors, Patients, and Pharmacists.
        </motion.p>

        {/* 4 Feature Process Cards in Clean White Surface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left mb-6"
        >
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-start gap-3"
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shrink-0 shadow-sm`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {s.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-[#0F172A]">{s.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="z-10 max-w-xl mx-auto w-full space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <Link
            href="/login?step=role"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0F766E]/20 hover:brightness-105 active:scale-[0.99] transition-all touch-press"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-300 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-[0.99] transition-all shadow-2xs"
          >
            Sign In
          </Link>
        </div>

        <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
          <span className="flex items-center gap-1 font-medium">
            <Lock className="w-3 h-3 text-[#0F766E]" /> 256-bit AES Encryption
          </span>
          <span>•</span>
          <span className="font-medium">ABDM Aligned</span>
          <span>•</span>
          <span className="font-medium">Patient Privacy Guaranteed</span>
        </div>
      </motion.div>
    </div>
  );
}
