'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Phone,
  Users,
  Globe,
  Bell,
  Lock,
  HelpCircle,
  LogOut,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check,
  Heart,
  Sliders,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logoutUser, activeFamilyMember } = useVerification();
  const { toast } = useToast();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  const handleLogout = () => {
    logoutUser();
    toast.info('Signed Out', 'You have been safely signed out of MED-BRIDGE.');
    router.push('/login');
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Header Profile Card with Executive Brand Forest */}
      <div className="p-6 bg-gradient-to-br from-[#124A43] to-[#0F766E] text-white rounded-3xl shadow-xs border border-white/10 flex items-center gap-4 relative overflow-hidden">
        <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-xs text-white font-black text-xl flex items-center justify-center border border-white/20">
          {user?.name ? user.name.charAt(0) : 'V'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">{user?.name || 'Varun Sharma'}</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-emerald-100 border border-white/20">
              ✓ Verified
            </span>
          </div>
          <p className="text-xs text-emerald-100/80 font-medium flex items-center gap-1.5 mt-0.5">
            <Phone className="w-3.5 h-3.5 text-emerald-200" /> {user?.phone || '+91 9999999999'}
          </p>
          <p className="text-[11px] text-teal-200 font-mono-code mt-1">
            ABHA ID: 91-8429-1920-5812
          </p>
        </div>
      </div>

      {/* Patient Clinical Health Record */}
      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="font-black text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-600" /> Clinical Health Record
          </h3>
          <Link
            href="/login"
            className="text-[11px] font-extrabold text-[#0F766E] hover:underline flex items-center gap-1"
          >
            <Sliders className="w-3 h-3" /> Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Blood Group</span>
            <span className="text-sm font-black text-slate-900">O Positive (O+)</span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Age & Gender</span>
            <span className="text-sm font-black text-slate-900">34 yrs • Male</span>
          </div>
        </div>

        {/* Monitored Conditions */}
        <div className="pt-1">
          <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
            Active Conditions
          </span>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-xl bg-teal-50 text-[#0F766E] text-xs font-bold border border-teal-200">
              Type 2 Diabetes
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-teal-50 text-[#0F766E] text-xs font-bold border border-teal-200">
              Mild Hypertension
            </span>
          </div>
        </div>

        {/* Known Allergies */}
        <div className="pt-1">
          <span className="text-[10px] font-black uppercase text-rose-700 flex items-center gap-1 mb-1">
            <ShieldAlert className="w-3 h-3" /> Monitored Drug Allergies
          </span>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 text-xs font-black border border-rose-200">
              🚨 Penicillin Allergy
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 text-xs font-black border border-rose-200">
              🚨 Sulfa Drugs
            </span>
          </div>
        </div>
      </div>

      {/* Settings Menu Group */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden divide-y divide-slate-100 text-xs">
        {/* Family Members */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Protected Family Circle</p>
              <p className="text-[11px] text-slate-500">3 Active Profiles (Varun, Ramesh, Priya)</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Language */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Interface Language / भाषा</p>
              <p className="text-[11px] text-slate-500">Hindi & English prescription audio</p>
            </div>
          </div>
          <button
            onClick={() => setLanguage(language === 'English' ? 'Hindi' : 'English')}
            className="px-3.5 py-1.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-200 transition-colors"
          >
            {language}
          </button>
        </div>

        {/* Notifications toggle */}
        <div className="p-4 flex items-center justify-between hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Instant WhatsApp & Push Alerts</p>
              <p className="text-[11px] text-slate-500">CDSCO recall and dosage mismatch alerts</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationsOn(!notificationsOn)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              notificationsOn ? 'bg-[#0F766E]' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                notificationsOn ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Admin Portal Entry */}
        <Link href="/admin" className="p-4 flex items-center justify-between hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#5250A8] flex items-center justify-center border border-slate-200">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Enterprise Admin & Analytics Portal</p>
              <p className="text-[11px] text-slate-500">Live telemetry, drug database & recall issuer</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        {/* Health Records Vault */}
        <Link href="/records" className="p-4 flex items-center justify-between hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Health Records & Documents Vault</p>
              <p className="text-[11px] text-slate-500">Add, import, export, and search diagnostic records</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        {/* Privacy & Data */}
        <Link href="/about" className="p-4 flex items-center justify-between hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">About MED-BRIDGE & Privacy</p>
              <p className="text-[11px] text-slate-500">Product info, ABDM security principles, and 24/7 help</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="w-full py-3.5 px-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
      >
        <LogOut className="w-4 h-4" /> Logout from MED-BRIDGE
      </button>
    </div>
  );
}

