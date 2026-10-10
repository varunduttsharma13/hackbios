'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { VerificationProvider } from '@/lib/context/VerificationContext';
import { ToastProvider } from '@/components/ui/Toast';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import {
  Wifi,
  Signal,
  Battery,
  ShieldCheck,
  Smartphone,
  Monitor,
  PhoneCall,
  Lock,
} from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'mobile'>('responsive');
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  const isAuthOrOnboarding = pathname === '/onboarding' || pathname === '/login' || pathname === '/';
  const isAdmin = pathname.startsWith('/admin');
  const isDoctor = pathname.startsWith('/doctor');
  const isPatient = pathname.startsWith('/patient');
  const isPharmacy = pathname.startsWith('/pharmacy');
  const isCameraViewfinder = pathname === '/prescription/capture' || pathname === '/medicine/scan';

  // Expand comfortably for portals or responsive mode
  const isExpanded = deviceMode === 'responsive';

  return (
    <VerificationProvider>
      <ToastProvider>
        <div className="h-[100dvh] bg-[#F1F5F9] md:bg-gradient-to-b md:from-[#F8FAFC] md:via-[#EDF2F7] md:to-[#E2E8F0] text-[#0F172A] flex flex-col justify-start md:justify-center items-center py-0 md:py-3 px-0 md:px-4 select-none relative overflow-hidden">
        {/* Desktop Ambient Background Elements */}
        <div className="hidden md:flex items-center justify-between w-full max-w-7xl px-4 mb-2 text-xs z-20">
          {/* Brand & Compliance Badges */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0F766E] to-[#0D9488] flex items-center justify-center text-white font-black shadow-md shadow-[#0F766E]/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-[#0F172A] text-sm tracking-tight group-hover:text-[#0F766E] transition-colors">
                MED-BRIDGE <span className="text-[#0F766E] font-semibold text-xs ml-1">CLINICAL SAFETY</span>
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-300 text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                CDSCO National Registry Active
              </span>
              <span className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full shadow-2xs font-semibold">
                <Lock className="w-3 h-3 text-[#0F766E]" />
                ABDM 256-bit Encrypted
              </span>
            </div>
          </div>

          {/* Right Desktop Controls: Viewport Switcher & Quick Hotline */}
          <div className="flex items-center gap-3">
            {!isAdmin && !isAuthOrOnboarding && (
              <div className="bg-slate-200/80 p-1 rounded-xl border border-slate-300 flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setDeviceMode('responsive')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    deviceMode === 'responsive'
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Full Web Width View"
                >
                  <Monitor className="w-3.5 h-3.5" /> Wide View
                </button>
                <button
                  onClick={() => setDeviceMode('mobile')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    deviceMode === 'mobile'
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Mobile App Viewport Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" /> Mobile View
                </button>
              </div>
            )}

            <a
              href="tel:18003292472"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-[11px] font-semibold shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Helpline: 1800-MED-BRIDGE</span>
            </a>
          </div>
        </div>

        {/* Mobile App Canvas Container / Desktop Mockup Frame */}
        <div
          className={`w-full bg-[#F8FAFC] flex flex-col min-h-0 overflow-hidden transition-all duration-300 relative ${
            isExpanded
              ? 'max-w-7xl h-[100dvh] md:h-[calc(100dvh-2.5rem)] md:rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-200/90'
              : 'max-w-[440px] h-[100dvh] md:h-[calc(100dvh-2.5rem)] md:max-h-[920px] md:rounded-[36px] shadow-2xl shadow-slate-900/15 md:border-[8px] md:border-slate-800'
          }`}
        >
          {/* Desktop Status Bar Simulation (Only for phone preview) */}
          {!isExpanded && (
            <div className="hidden md:flex items-center justify-between px-7 pt-3 pb-2 bg-slate-900 text-white text-[11px] font-semibold tracking-tight z-50 shrink-0 border-b border-slate-800">
              <span className="font-mono-code font-bold tracking-tight">{currentTime}</span>
              {/* Dynamic Island Pill */}
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center border border-slate-700 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="flex items-center gap-1.5 opacity-90">
                <Signal className="w-3 h-3 text-slate-300" />
                <Wifi className="w-3 h-3 text-slate-300" />
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          )}

          <div className="flex-1 flex min-h-0 w-full overflow-hidden">
            {isExpanded && !isAuthOrOnboarding && (
              <div className="hidden md:block shrink-0">
                <Sidebar />
              </div>
            )}

            <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden relative">
              {!isAuthOrOnboarding && !isAdmin && <Navbar />}

              <main
                className={`flex-1 min-h-0 w-full overflow-y-auto overscroll-contain ${
                  isCameraViewfinder
                    ? 'p-0 h-[100dvh] overflow-hidden'
                    : isAuthOrOnboarding
                    ? 'p-0'
                    : 'px-4 md:px-6 pt-3 pb-[calc(88px+env(safe-area-inset-bottom))] md:pb-6'
                }`}
              >
                {children}
              </main>

              {!isAuthOrOnboarding && !isAdmin && (
                <div className={isExpanded ? 'md:hidden' : ''}>
                  <BottomNav />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  </VerificationProvider>
  );
};
