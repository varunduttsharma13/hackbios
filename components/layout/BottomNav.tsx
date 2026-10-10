'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scan, Pill, Bell, User, FileText, BookOpen } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  if (
    pathname === '/onboarding' ||
    pathname === '/login' ||
    pathname === '/' ||
    pathname === '/admin'
  ) {
    return null;
  }

  // Role-Aware Bottom Navigation
  const isDoctor = pathname.startsWith('/doctor');
  const isPatient = pathname.startsWith('/patient');
  const isPharmacy = pathname.startsWith('/pharmacy');

  let navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Records', href: '/records', icon: FileText },
    { label: 'Scan', href: '/scan', icon: Scan, isPrimary: true },
    { label: 'Guide', href: '/health-guide', icon: BookOpen },
    { label: 'Hub', href: '/profile', icon: User },
  ];

  let theme = {
    primaryGrad: 'from-[#0F766E] to-[#0D9488]',
    activeBg: 'bg-teal-50',
    activeText: 'text-[#0F766E]',
    dotColor: 'bg-[#0F766E]',
    shadowColor: 'shadow-[#0F766E]/30',
  };

  if (isDoctor) {
    theme = {
      primaryGrad: 'from-[#2458A6] to-[#1E3A8A]',
      activeBg: 'bg-[#EEF4FC]',
      activeText: 'text-[#2458A6]',
      dotColor: 'bg-[#2458A6]',
      shadowColor: 'shadow-[#2458A6]/30',
    };
    navItems = [
      { label: 'Doctor', href: '/doctor', icon: Home },
      { label: 'Patients', href: '/doctor/patients', icon: User },
      { label: 'New e-Rx', href: '/doctor/prescriptions/new', icon: Scan, isPrimary: true },
      { label: 'History', href: '/history', icon: Pill },
      { label: 'Hub', href: '/dashboard', icon: Bell },
    ];
  } else if (isPatient) {
    theme = {
      primaryGrad: 'from-[#217A56] to-[#1B6447]',
      activeBg: 'bg-[#EEF7F0]',
      activeText: 'text-[#217A56]',
      dotColor: 'bg-[#217A56]',
      shadowColor: 'shadow-[#217A56]/30',
    };
    navItems = [
      { label: 'Patient', href: '/patient', icon: Home },
      { label: 'Records', href: '/records', icon: FileText },
      { label: 'Verify', href: '/scan', icon: Scan, isPrimary: true },
      { label: 'Guide', href: '/health-guide', icon: BookOpen },
      { label: 'Alerts', href: '/alerts', icon: Bell },
    ];
  } else if (isPharmacy) {
    theme = {
      primaryGrad: 'from-[#087E80] to-[#065B5C]',
      activeBg: 'bg-[#E9F6F5]',
      activeText: 'text-[#087E80]',
      dotColor: 'bg-[#087E80]',
      shadowColor: 'shadow-[#087E80]/30',
    };
    navItems = [
      { label: 'Pharmacy', href: '/pharmacy', icon: Home },
      { label: 'Lookup', href: '/pharmacy/prescriptions', icon: Pill },
      { label: 'Verify', href: '/pharmacy/verify', icon: Scan, isPrimary: true },
      { label: 'History', href: '/history', icon: Bell },
      { label: 'Hub', href: '/dashboard', icon: User },
    ];
  }

  return (
    <nav className="absolute bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-slate-200 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_25px_rgba(15,23,42,0.06)] rounded-t-3xl h-[70px] shrink-0">
      <div className="flex items-center justify-around px-3 h-full relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          if (item.isPrimary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center -mt-7 group z-10"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${theme.primaryGrad} text-white flex items-center justify-center shadow-lg ${theme.shadowColor} group-active:scale-95 group-hover:scale-105 transition-all border-[4px] border-white`}>
                  <Icon className="w-6 h-6 text-white stroke-[2.5]" />
                </div>
                <span className={`text-[10px] font-black mt-0.5 tracking-tight ${theme.activeText}`}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center px-3 py-1.5 rounded-2xl transition-all relative ${
                isActive
                  ? `${theme.activeBg} ${theme.activeText} font-black scale-105`
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? `${theme.activeText} stroke-[2.5] scale-110` : 'stroke-2'}`} />
              <span className={`text-[10px] mt-0.5 tracking-tight font-extrabold ${isActive ? theme.activeText : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor} absolute -top-0.5`}></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
