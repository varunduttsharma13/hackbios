'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileScan,
  QrCode,
  Pill,
  History,
  ShieldAlert,
  HelpCircle,
  User,
  SlidersHorizontal,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { useToast } from '@/components/ui/Toast';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutUser, activeRole } = useVerification();
  const { toast } = useToast();

  const handleLogout = () => {
    logoutUser();
    toast.info('Signed Out', 'You have been safely signed out of MED-BRIDGE.');
    router.push('/login');
  };

  if (pathname === '/onboarding' || pathname === '/login') {
    return null;
  }

  const roleWorkspaces = [
    { label: 'Doctor Workspace', href: '/doctor', icon: FileScan, color: 'text-[#2458A6]', bg: 'hover:bg-[#EEF4FC]' },
    { label: 'Patient Portal', href: '/patient', icon: User, color: 'text-[#217A56]', bg: 'hover:bg-[#EEF7F0]' },
    { label: 'Pharmacy Verification', href: '/pharmacy', icon: QrCode, color: 'text-[#087E80]', bg: 'hover:bg-[#E9F6F5]' },
    { label: 'Admin Audit Center', href: '/admin', icon: SlidersHorizontal, color: 'text-[#5250A8]', bg: 'hover:bg-[#F0F0FA]' },
  ];

  const tools = [
    { label: 'Dashboard Hub', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Health Records Vault', href: '/records', icon: FileScan },
    { label: 'Health Guide & Symptoms', href: '/health-guide', icon: HelpCircle },
    { label: 'Scan Prescription', href: '/prescription/capture', icon: FileScan },
    { label: 'Scan Medicine Strip', href: '/medicine/scan', icon: QrCode },
    { label: 'Medicine Regimen', href: '/history', icon: Pill },
    { label: 'Safety Reports & Alerts', href: '/alerts', icon: ShieldAlert },
    { label: 'Drug Interactions', href: '/interactions', icon: HelpCircle },
    { label: 'About & Support', href: '/about', icon: ShieldCheck },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full overflow-y-auto p-4 select-none shrink-0">
      {/* Workspaces Section */}
      <div className="mb-6">
        <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
          Clinical Portals
        </p>
        <div className="space-y-1">
          {roleWorkspaces.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : `text-slate-600 ${item.bg} hover:text-slate-900 border border-transparent`
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : item.color}`} />
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Safety Tools Section */}
      <div className="space-y-1 flex-1">
        <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-2">
          Verification Tools
        </p>
        {tools.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium text-xs transition-all ${
                isActive
                  ? 'bg-teal-50 text-[#0F766E] font-bold border border-teal-200/60'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0F766E]' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 mt-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
          <span className="text-xs font-bold text-slate-800">CDSCO Registry</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          ABDM verified & deterministic safety verification engine.
        </p>
      </div>

      {/* User Session & Logout Card */}
      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0F766E] to-[#0D9488] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
              {user?.name ? user.name.charAt(0) : 'V'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {user?.name || 'Varun Sharma'}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold capitalize truncate">
                {activeRole} portal
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50/80 hover:bg-rose-100 border border-rose-200/80 text-rose-700 active:scale-98 font-bold text-xs transition-all shadow-2xs group"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
