'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Stethoscope,
  Heart,
  Store,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Zap,
  User,
  Sliders,
  ChevronRight,
  Bell,
  Users,
  Check,
  Building2,
  Key,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';

type UserRole = 'doctor' | 'patient' | 'pharmacist' | 'admin';
type LoginViewMode = 'ROLE_SELECTION' | 'SIGN_IN' | 'PHONE_OTP' | 'SETUP';

interface RoleConfig {
  role: UserRole;
  title: string;
  hindiTitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  targetDashboard: string;
  demoUser: {
    email: string;
    identifier: string;
    name: string;
    badgeNote: string;
  };
}

const ROLES: RoleConfig[] = [
  {
    role: 'doctor',
    title: 'Doctor',
    hindiTitle: 'चिकित्सक',
    description: 'Create, review, and finalize digital prescriptions with clinical AI safety.',
    icon: Stethoscope,
    color: '#2458A6',
    badge: 'Clinical Prescriber',
    targetDashboard: '/doctor',
    demoUser: {
      email: 'dr.sharma@medbridge.in',
      identifier: 'MCI-DEL-2018-4921',
      name: 'Dr. Arvind Sharma, MD',
      badgeNote: 'Apollo Hospital & Heart Institute',
    },
  },
  {
    role: 'patient',
    title: 'Patient',
    hindiTitle: 'मरीज़',
    description: 'Access prescriptions, medicine regimens, dosage schedules, and QR pass.',
    icon: Heart,
    color: '#217A56',
    badge: 'Personal Health',
    targetDashboard: '/patient',
    demoUser: {
      email: 'lolita.alvarez@gmail.com',
      identifier: 'ABHA: 91-4567-8910-1122',
      name: 'Lolita Alvarez',
      badgeNote: 'Active Rx: DS-10452',
    },
  },
  {
    role: 'pharmacist',
    title: 'Pharmacist',
    hindiTitle: 'फार्मासिस्ट',
    description: 'Verify prescriptions against medicine strips and record authorized dispensing.',
    icon: Store,
    color: '#087E80',
    badge: 'Dispensing Specialist',
    targetDashboard: '/pharmacy',
    demoUser: {
      email: 'pharmacist.rahul@medplus.in',
      identifier: 'REG-PH-2021-9840',
      name: 'Rahul Verma (R.Ph)',
      badgeNote: 'MedPlus Apollo Pharmacy #408',
    },
  },
  {
    role: 'admin',
    title: 'Administrator',
    hindiTitle: 'प्रशासक',
    description: 'Manage authorized system operations, audit trail, and CDSCO compliance.',
    icon: ShieldAlert,
    color: '#5250A8',
    badge: 'System Governance',
    targetDashboard: '/admin',
    demoUser: {
      email: 'admin@medbridge.gov.in',
      identifier: 'AUTH-GOV-ABDM-001',
      name: 'National Health Authority Admin',
      badgeNote: 'Full Regulatory Clearance',
    },
  },
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser, setActiveRole } = useVerification();

  const initialStepParam = searchParams.get('step');
  const initialRoleParam = searchParams.get('role') as UserRole | null;

  // Active view state
  const [viewMode, setViewMode] = useState<LoginViewMode>(
    initialStepParam === 'role' ? 'ROLE_SELECTION' : 'SIGN_IN'
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    initialRoleParam && ['doctor', 'patient', 'pharmacist', 'admin'].includes(initialRoleParam)
      ? initialRoleParam
      : 'doctor'
  );

  // Form states
  const activeRoleConfig = ROLES.find((r) => r.role === selectedRole) || ROLES[0];
  const [identifier, setIdentifier] = useState(activeRoleConfig.demoUser.email);
  const [password, setPassword] = useState('suraksha@demo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  // Phone + OTP State (Preserving existing workflow)
  const [phone, setPhone] = useState('9999999999');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(true);

  // Setup Wizard State (Preserving existing wizard)
  const [setupStep, setSetupStep] = useState<number>(1);
  const [setupName, setSetupName] = useState('Varun Sharma');
  const [setupAge, setSetupAge] = useState('34');
  const [setupBloodGroup, setSetupBloodGroup] = useState('O+');
  const [setupAbhaId, setSetupAbhaId] = useState('91-8429-1920-5812');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([
    'Type 2 Diabetes',
    'Mild Hypertension',
  ]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['Penicillin', 'Sulfa Drugs']);
  const [familyMembersToProtect] = useState([
    { name: 'Varun Sharma', relation: 'Self', age: '34' },
    { name: 'Ramesh Sharma', relation: 'Father (68 yrs, Cardiac)', age: '68' },
    { name: 'Priya Sharma', relation: 'Spouse', age: '32' },
  ]);
  const [enableWhatsappAlerts, setEnableWhatsappAlerts] = useState(true);
  const [audioLanguage, setAudioLanguage] = useState<'Hindi' | 'English'>('Hindi');

  const selectRoleAndSync = (role: UserRole) => {
    setSelectedRole(role);
    const config = ROLES.find((r) => r.role === role);
    if (config) {
      setIdentifier(config.demoUser.email);
      setErrorMsg('');
      setForgotPasswordNotice(false);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    selectRoleAndSync(role);
    setViewMode('SIGN_IN');
  };

  const executeLogin = (role: UserRole, targetRoute: string) => {
    setIsLoading(true);
    setErrorMsg('');

    // Role-enforced login
    setTimeout(() => {
      setActiveRole(role);
      loginUser('9999999999', '123456');
      setIsLoading(false);
      router.push(targetRoute);
    }, 350);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Please enter your email or authorized identifier.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }
    executeLogin(selectedRole, activeRoleConfig.targetDashboard);
  };

  const handle1ClickDemoLogin = () => {
    executeLogin(selectedRole, activeRoleConfig.targetDashboard);
  };

  const handlePhoneOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMsg('Please enter a valid mobile number');
      return;
    }
    const success = loginUser(phone, otp);
    if (success) {
      setActiveRole(selectedRole);
      router.push(activeRoleConfig.targetDashboard);
    } else {
      setErrorMsg('Invalid OTP. Use Demo OTP: 123456');
    }
  };

  const completeSetupWizard = () => {
    setActiveRole('patient');
    loginUser('9999999999', '123456');
    router.push('/patient');
  };

  return (
    <div className="min-h-screen bg-[#F5F8F7] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
        {/* Left Hero & Brand Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Lighting */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo & Identity */}
          <div className="relative z-10 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0F766E] to-[#0D9488] flex items-center justify-center text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  MED-BRIDGE
                </span>
                <span className="text-[10px] font-bold text-teal-300 tracking-wider uppercase">
                  Healthcare Safety Network
                </span>
              </div>
            </Link>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-teal-300 text-[11px] font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" /> ABDM Protocol • Ayushman Bharat
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-white leading-tight">
                Sahi Dawai. <br />
                Sahi Dose. <br />
                <span className="text-teal-400">Surakshit Zindagi.</span>
              </h2>
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                Connects Doctors, Patients, and Pharmacists in a verified digital prescription and medicine safety pipeline.
              </p>
            </div>
          </div>

          {/* Active Role Indicator Card */}
          <div className="relative z-10 my-6 bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-white/90">Current Role Mode</span>
              <span className="text-teal-400 font-black uppercase text-[10px] tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                Active
              </span>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-white/10">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white shadow-sm"
                style={{ backgroundColor: activeRoleConfig.color }}
              >
                <activeRoleConfig.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-white flex items-center gap-1.5">
                  {activeRoleConfig.title} Workspace
                  <span className="text-[10px] text-slate-400 font-normal">
                    ({activeRoleConfig.hindiTitle})
                  </span>
                </p>
                <p className="text-[10px] text-teal-300/90">{activeRoleConfig.badge}</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic text-center pt-1">
              Destination: <code className="text-teal-300 font-mono">{activeRoleConfig.targetDashboard}</code>
            </p>
          </div>

          {/* Bottom Security Seals */}
          <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-teal-400" /> 256-bit AES Encryption
            </span>
            <span>ABDM Aligned</span>
          </div>
        </div>

        {/* Right Interactive Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
          {/* Top Mode Navigation Tabs */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setViewMode('ROLE_SELECTION')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    viewMode === 'ROLE_SELECTION'
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Choose Role
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('SIGN_IN')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    viewMode === 'SIGN_IN'
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" /> Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('PHONE_OTP')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    viewMode === 'PHONE_OTP'
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mobile OTP
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('SETUP')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 ${
                    viewMode === 'SETUP'
                      ? 'bg-[#0F766E] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" /> Setup
                </button>
              </div>

              <span className="hidden sm:inline-block text-[10px] font-bold text-[#0F766E] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                v2.5 Connected
              </span>
            </div>
          </div>

          {/* VIEW 1: ROLE SELECTION ("How would you like to continue?") */}
          {viewMode === 'ROLE_SELECTION' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#152522] tracking-tight">
                  How would you like to continue?
                </h3>
                <p className="text-xs text-[#64736F] mt-1">
                  Select your healthcare role to open the corresponding workspace and authorized permissions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ROLES.map((roleItem) => {
                  const Icon = roleItem.icon;
                  const isSelected = selectedRole === roleItem.role;

                  return (
                    <button
                      key={roleItem.role}
                      type="button"
                      onClick={() => handleRoleSelect(roleItem.role)}
                      className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between group touch-press ${
                        isSelected
                          ? 'border-[#075E54] bg-[#EAF7F3]/70 shadow-md ring-2 ring-[#075E54]/20'
                          : 'border-[#E1EAE6] bg-white hover:border-[#0F766E]/50 hover:bg-[#F5F8F7]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
                          style={{ backgroundColor: roleItem.color }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#075E54] text-white'
                              : 'bg-[#F5F8F7] text-[#64736F] border border-[#E1EAE6]'
                          }`}
                        >
                          {roleItem.badge}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-sm text-[#152522]">
                            {roleItem.title}
                          </h4>
                          <span className="text-[11px] text-[#64736F] font-semibold">
                            ({roleItem.hindiTitle})
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64736F] mt-1 leading-snug">
                          {roleItem.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-[#E1EAE6]/60 flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#075E54] group-hover:underline flex items-center gap-1">
                          Continue as {roleItem.title} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#075E54] text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-[#64736F]">
                <Link href="/" className="hover:text-[#075E54] flex items-center gap-1 font-bold">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Welcome
                </Link>
                <button
                  type="button"
                  onClick={() => setViewMode('SIGN_IN')}
                  className="font-extrabold text-[#075E54] hover:underline flex items-center gap-1"
                >
                  Proceed to Sign In <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: ROLE-AWARE SIGN IN */}
          {viewMode === 'SIGN_IN' && (
            <div className="space-y-4">
              {/* Header with Role Badge & Switcher */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-white text-[10px] font-black tracking-wide uppercase"
                      style={{ backgroundColor: activeRoleConfig.color }}
                    >
                      <activeRoleConfig.icon className="w-3 h-3" />
                      {activeRoleConfig.title} Workspace
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewMode('ROLE_SELECTION')}
                      className="text-[11px] font-extrabold text-[#0F766E] hover:underline"
                    >
                      Change Role
                    </button>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#152522] tracking-tight">
                    {activeRoleConfig.title} Sign In
                  </h3>
                  <p className="text-xs text-[#64736F] mt-0.5">
                    {activeRoleConfig.description}
                  </p>
                </div>
              </div>

              {/* DEVELOPMENT DEMO MODE (1-Click Test Access) */}
              <div className="p-3.5 bg-gradient-to-r from-[#EAF7F3] via-[#EFF6FF] to-[#FEF3C7] border border-[#0F766E]/25 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#075E54] flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-[#0F766E]" /> Development Demo Mode
                  </span>
                  <span className="text-[10px] text-[#059669] font-bold bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#059669]/20">
                    Safe Mock Data
                  </span>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-2.5 rounded-xl border border-[#E1EAE6] text-xs flex items-center justify-between">
                  <div>
                    <p className="font-extrabold text-[#152522]">
                      {activeRoleConfig.demoUser.name}
                    </p>
                    <p className="text-[10px] text-[#64736F]">
                      {activeRoleConfig.demoUser.identifier} • {activeRoleConfig.demoUser.badgeNote}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handle1ClickDemoLogin}
                    disabled={isLoading}
                    className="px-3 py-1.5 rounded-xl text-white font-black text-xs shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                    style={{ backgroundColor: activeRoleConfig.color }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    1-Click {activeRoleConfig.title} Login
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#FFF1F2] border border-[#F43F5E]/30 rounded-xl text-xs text-[#E11D48] font-bold text-center">
                  {errorMsg}
                </div>
              )}

              {forgotPasswordNotice && (
                <div className="p-3 bg-[#EFF6FF] border border-[#3B82F6]/30 rounded-xl text-xs text-[#1D4ED8] font-medium text-center">
                  In demo mode, use credentials: <strong>{activeRoleConfig.demoUser.email}</strong> or click the 1-Click Login button above.
                </div>
              )}

              {/* Standard Credentials Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#152522] mb-1">
                    Email / Authorized Medical ID
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={activeRoleConfig.demoUser.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E1EAE6] text-sm font-semibold focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] bg-[#F5F8F7]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#152522]">Password</label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordNotice(true)}
                      className="text-[11px] font-bold text-[#0F766E] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E1EAE6] text-sm font-semibold focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E] bg-[#F5F8F7]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#64736F] hover:text-[#152522]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#64736F]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#075E54]"
                    />
                    Remember this device for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-[0.99] transition-all touch-press"
                  style={{ backgroundColor: activeRoleConfig.color }}
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Authenticating {activeRoleConfig.title}...
                    </>
                  ) : (
                    <>
                      Sign In to {activeRoleConfig.title} Portal <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Quick Switch between Roles */}
              <div className="pt-3 border-t border-[#E1EAE6]">
                <p className="text-[11px] font-bold text-[#64736F] mb-2 text-center">
                  Quick Switch Role Dashboard:
                </p>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {ROLES.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => selectRoleAndSync(r.role)}
                      className={`p-1.5 rounded-xl border text-[10px] font-black transition-all ${
                        selectedRole === r.role
                          ? 'border-[#075E54] bg-[#EAF7F3] text-[#075E54]'
                          : 'border-[#E1EAE6] text-[#64736F] hover:bg-[#F5F8F7]'
                      }`}
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: PHONE & OTP AUTHENTICATION */}
          {viewMode === 'PHONE_OTP' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#152522] tracking-tight">
                  Mobile Phone & OTP Access
                </h3>
                <p className="text-xs text-[#64736F] mt-0.5">
                  Sign in using your mobile number registered with ABDM / Ayushman Bharat.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#FFF1F2] border border-[#F43F5E]/30 rounded-xl text-xs text-[#E11D48] font-bold text-center">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handlePhoneOtpLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#152522] mb-1.5">
                    Mobile Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs font-black text-[#64736F]">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9999999999"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-[#E1EAE6] text-sm font-semibold focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] bg-[#F5F8F7]"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#152522]">Verification OTP</label>
                      <span className="text-[11px] text-[#059669] font-bold">Demo OTP: 123456</span>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-[#64736F] absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 6-digit OTP"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E1EAE6] text-sm font-semibold focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] bg-[#F5F8F7]"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#075E54] to-[#0F766E] hover:brightness-110 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#075E54]/20 transition-all touch-press"
                >
                  Verify OTP & Enter {activeRoleConfig.title} <ArrowRight className="w-4 h-4 text-[#34D399]" />
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('SIGN_IN')}
                  className="text-xs font-bold text-[#0F766E] hover:underline"
                >
                  ← Switch back to Role Credentials Login
                </button>
              </div>
            </div>
          )}

          {/* VIEW 4: SETUP HEALTH PROFILE WIZARD (Preserved Feature) */}
          {viewMode === 'SETUP' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#EAF7F3] p-2.5 rounded-2xl border border-[#0F766E]/20">
                {[
                  { step: 1, label: 'Identity' },
                  { step: 2, label: 'Allergies' },
                  { step: 3, label: 'Family' },
                  { step: 4, label: 'Alerts' },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setSetupStep(s.step)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
                      setupStep === s.step
                        ? 'bg-[#059669] text-white shadow-xs'
                        : setupStep > s.step
                        ? 'text-[#059669]'
                        : 'text-[#64736F]'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                      {setupStep > s.step ? '✓' : s.step}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>

              {setupStep === 1 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-[#075E54] flex items-center gap-1.5">
                      <User className="w-4 h-4 text-[#059669]" /> Patient Demographics
                    </h3>
                    <span className="text-[10px] text-[#64736F] font-bold">Step 1 of 4</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <label className="block font-bold text-[#152522] mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={setupName}
                        onChange={(e) => setSetupName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E1EAE6] bg-[#F5F8F7] font-bold"
                        placeholder="e.g. Varun Sharma"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#152522] mb-1">Age</label>
                      <input
                        type="number"
                        value={setupAge}
                        onChange={(e) => setSetupAge(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E1EAE6] bg-[#F5F8F7] font-bold"
                        placeholder="34"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#152522] mb-1">Blood Group</label>
                      <select
                        value={setupBloodGroup}
                        onChange={(e) => setSetupBloodGroup(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E1EAE6] bg-[#F5F8F7] font-bold"
                      >
                        <option value="O+">O Positive (O+)</option>
                        <option value="A+">A Positive (A+)</option>
                        <option value="B+">B Positive (B+)</option>
                        <option value="AB+">AB Positive (AB+)</option>
                        <option value="O-">O Negative (O-)</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block font-bold text-[#152522] mb-1">
                        ABHA ID / Ayushman Bharat Digital Number
                      </label>
                      <input
                        type="text"
                        value={setupAbhaId}
                        onChange={(e) => setSetupAbhaId(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#E1EAE6] bg-[#F5F8F7] font-mono font-bold text-[#059669]"
                        placeholder="91-XXXX-XXXX-XXXX"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSetupStep(2)}
                    className="w-full py-2.5 rounded-xl bg-[#075E54] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md mt-2"
                  >
                    Next: Chronic Conditions & Allergies <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {setupStep === 2 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-[#075E54] flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-[#F43F5E]" /> Health Conditions & Known Allergies
                    </h3>
                    <span className="text-[10px] text-[#64736F] font-bold">Step 2 of 4</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-[#64736F] mb-1">
                      Monitored Medical Conditions
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Type 2 Diabetes',
                        'Mild Hypertension',
                        'Asthma',
                        'Thyroid Disorder',
                        'Renal Caution',
                      ].map((cond) => {
                        const selected = selectedConditions.includes(cond);
                        return (
                          <button
                            key={cond}
                            type="button"
                            onClick={() =>
                              setSelectedConditions((prev) =>
                                prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
                              )
                            }
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                              selected
                                ? 'bg-[#075E54] text-white shadow-xs'
                                : 'bg-[#F5F8F7] border border-[#E1EAE6] text-[#64736F]'
                            }`}
                          >
                            {selected ? '✓ ' : '+ '}
                            {cond}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[11px] font-black uppercase text-[#E11D48] mb-1 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#E11D48]" /> Known Medicine Allergies
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Penicillin',
                        'Sulfa Drugs',
                        'Aspirin / NSAIDs',
                        'Cephalosporins',
                        'No Known Allergies',
                      ].map((allergy) => {
                        const selected = selectedAllergies.includes(allergy);
                        return (
                          <button
                            key={allergy}
                            type="button"
                            onClick={() =>
                              setSelectedAllergies((prev) =>
                                prev.includes(allergy)
                                  ? prev.filter((a) => a !== allergy)
                                  : [...prev, allergy]
                              )
                            }
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                              selected
                                ? 'bg-[#FFF1F2] border border-[#F43F5E] text-[#E11D48]'
                                : 'bg-[#F5F8F7] border border-[#E1EAE6] text-[#64736F]'
                            }`}
                          >
                            {selected ? '🚨 ' : '+ '}
                            {allergy}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSetupStep(1)}
                      className="py-2 px-3 rounded-xl border border-[#E1EAE6] text-xs font-bold text-[#64736F]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setSetupStep(3)}
                      className="flex-1 py-2 rounded-xl bg-[#075E54] text-white font-extrabold text-xs flex items-center justify-center gap-1"
                    >
                      Next: Family Circle Setup <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {setupStep === 3 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-[#075E54] flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#2563EB]" /> Family Caregiver Circle
                    </h3>
                    <span className="text-[10px] text-[#64736F] font-bold">Step 3 of 4</span>
                  </div>

                  <div className="space-y-2">
                    {familyMembersToProtect.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-[#F5F8F7] border border-[#E1EAE6] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#10B981]/20 text-[#059669] font-black flex items-center justify-center text-[10px]">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-[#152522]">{m.name}</p>
                            <p className="text-[10px] text-[#64736F]">{m.relation}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669]">
                          Protected
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSetupStep(2)}
                      className="py-2 px-3 rounded-xl border border-[#E1EAE6] text-xs font-bold text-[#64736F]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setSetupStep(4)}
                      className="flex-1 py-2 rounded-xl bg-[#075E54] text-white font-extrabold text-xs flex items-center justify-center gap-1"
                    >
                      Next: Safety Alerts & Audio <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {setupStep === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-[#075E54] flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#B45309]" /> Safety Alerts & Notification Setup
                    </h3>
                    <span className="text-[10px] text-[#64736F] font-bold">Step 4 of 4</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#F5F8F7] border border-[#E1EAE6] space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[#152522]">WhatsApp Recall Alerts</p>
                        <p className="text-[10px] text-[#64736F]">
                          Instant message if any scanned strip is flagged by CDSCO
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={enableWhatsappAlerts}
                        onChange={(e) => setEnableWhatsappAlerts(e.target.checked)}
                        className="w-4 h-4 accent-[#059669]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E1EAE6]">
                      <div>
                        <p className="font-bold text-[#152522]">Audio Prescription Readout</p>
                        <p className="text-[10px] text-[#64736F]">
                          Voice dosage instructions in local language
                        </p>
                      </div>
                      <select
                        value={audioLanguage}
                        onChange={(e: any) => setAudioLanguage(e.target.value)}
                        className="px-2 py-1 rounded-lg border border-[#E1EAE6] font-bold bg-white text-xs"
                      >
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={completeSetupWizard}
                    className="w-full py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors mt-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Complete Setup & Launch Patient Dashboard
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Discreet Privacy & Compliance Reassurance */}
          <div className="pt-2 border-t border-[#E1EAE6] text-center">
            <p className="text-[11px] text-[#64736F]">
              By signing in, you agree to MED-BRIDGE{' '}
              <span className="text-[#075E54] underline cursor-pointer font-bold">Clinical Terms</span>{' '}
              &amp;{' '}
              <span className="text-[#075E54] underline cursor-pointer font-bold">ABDM Privacy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F8F7] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#075E54] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#075E54]">Loading MED-BRIDGE Auth...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
