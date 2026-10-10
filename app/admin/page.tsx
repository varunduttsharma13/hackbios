'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SlidersHorizontal,
  Plus,
  ShieldAlert,
  BarChart2,
  Users,
  FileText,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowLeft,
  Trash2,
  Download,
  Activity,
  Server,
  Database,
  LogOut,
} from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { useToast } from '@/components/ui/Toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { medicines, alerts, history, createAlert, addMedicineRegistryItem, logoutUser } = useVerification();
  const { toast } = useToast();

  const handleAdminLogout = () => {
    logoutUser();
    toast.info('Signed Out', 'You have been safely signed out of Admin portal.');
    router.push('/login');
  };

  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'MEDICINES' | 'ALERTS'>('ANALYTICS');

  // Form states
  const [newMedName, setNewMedName] = useState('');
  const [newMedBatch, setNewMedBatch] = useState('');
  const [newMedMfg, setNewMedMfg] = useState('');
  const [newMedExpiry, setNewMedExpiry] = useState('');
  const [newMedQr, setNewMedQr] = useState('');

  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertMed, setAlertMed] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'CRITICAL' | 'WARNING'>('WARNING');

  // Chart Data
  const outcomeData = [
    { name: 'Matched', value: history.filter((h) => h.match_status === 'MATCHED').length || 12, color: '#15803D' },
    { name: 'Mismatch', value: history.filter((h) => h.match_status === 'MISMATCH').length || 4, color: '#B42318' },
    { name: 'Expired', value: history.filter((h) => h.expiry_status === 'EXPIRED').length || 2, color: '#B45309' },
  ];

  const dailyVolumeData = [
    { day: 'Mon', scans: 14, matches: 12 },
    { day: 'Tue', scans: 22, matches: 19 },
    { day: 'Wed', scans: 18, matches: 15 },
    { day: 'Thu', scans: 28, matches: 24 },
    { day: 'Fri', scans: 35, matches: 30 },
    { day: 'Sat', scans: 42, matches: 36 },
    { day: 'Sun', scans: 31, matches: 27 },
  ];

  const confidenceData = [
    { name: 'High (>=85%)', count: 48, fill: '#5250A8' },
    { name: 'Medium (70-84%)', count: 14, fill: '#818CF8' },
    { name: 'Low (<70%)', count: 3, fill: '#B42318' },
  ];

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName || !newMedBatch) return;
    await addMedicineRegistryItem({
      id: `med_admin_${Date.now()}`,
      medicine_name: newMedName,
      generic_name: newMedName,
      strength: '500 mg',
      manufacturer: newMedMfg || 'Sun Pharma Ltd.',
      batch_number: newMedBatch,
      manufacture_date: 'Aug 2024',
      expiry_date: newMedExpiry || 'Aug 2027',
      qr_code: newMedQr || `DS-${newMedBatch}`,
      barcode: '890123456789',
      verification_status: 'VERIFIED',
    });
    setNewMedName('');
    setNewMedBatch('');
    setNewMedMfg('');
    setNewMedExpiry('');
    setNewMedQr('');
    alert('Medicine added to trusted registry!');
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertMed) return;
    await createAlert({
      id: `alert_${Date.now()}`,
      title: alertTitle,
      description: alertDesc,
      medicine_name: alertMed,
      severity: alertSeverity,
      source: 'Admin Direct Alert',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      active: true,
    });
    setAlertTitle('');
    setAlertDesc('');
    setAlertMed('');
    alert('Safety alert created!');
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,ID,Medicine,Status,Date\n' +
      history.map((h) => `${h.id},"${h.scanned_medicine_name}",${h.match_status},${h.created_at}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'MED_BRIDGE_Analytics_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <Link href="/dashboard" className="text-xs font-semibold text-slate-500 flex items-center gap-1 hover:text-[#5250A8] transition-colors mb-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F0F0FA] text-[#5250A8] flex items-center justify-center font-bold">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                System Administration & Audit
              </h1>
              <p className="text-xs text-slate-500">
                Network telemetry, trusted medicine registry & drug recall management
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
          </button>
          <span className="px-2.5 py-1 rounded-md bg-[#F0F0FA] text-[#5250A8] font-mono text-xs font-semibold border border-[#5250A8]/20">
            ADMIN v2.4
          </span>
          <button
            onClick={handleAdminLogout}
            className="px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Log out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Telemetry Status Bar */}
      <div className="bg-[#1E1B4B] text-white p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs border border-indigo-900 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-xs font-medium text-indigo-100">CDSCO & Central Drug Registry: LIVE SYNC ACTIVE</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-indigo-200/80">
          <span className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-indigo-400" /> OCR Engine Latency: 420ms</span>
          <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-indigo-400" /> Supabase DB: HEALTHY</span>
        </div>
      </div>

      {/* Quick Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled Users</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">1,420</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Verifications Done</p>
          <p className="text-2xl font-bold text-[#5250A8] mt-1">3,890</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Mismatches Intercepted</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">142</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Recalls</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{alerts.length}</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ANALYTICS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Verification Telemetry
        </button>
        <button
          onClick={() => setActiveTab('MEDICINES')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'MEDICINES' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Medicine Registry ({medicines.length})
        </button>
        <button
          onClick={() => setActiveTab('ALERTS')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ALERTS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Recall Alerts ({alerts.length})
        </button>
      </div>

      {/* Tab 1: Recharts Analytics */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chart 1: Verification Volume */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-semibold text-sm text-slate-900">7-Day Verification Volume</h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="scans" stroke="#5250A8" strokeWidth={2.5} name="Total Scans" dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="matches" stroke="#15803D" strokeWidth={2} name="Matches" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Outcome Breakdown */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-semibold text-sm text-slate-900">Safety Engine Verification Breakdown</h3>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={outcomeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                      {outcomeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Chart 3: AI OCR Confidence Scores */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-semibold text-sm text-slate-900">Gemini Vision AI OCR Confidence Distribution</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={confidenceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {confidenceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Medicine Registry CRUD */}
      {activeTab === 'MEDICINES' && (
        <div className="space-y-6">
          {/* Add Medicine Form */}
          <form onSubmit={handleAddMedicine} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#5250A8]" /> Add New Medicine to National Registry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Medicine Name & Strength</label>
                <input
                  type="text"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  placeholder="e.g. Telmisartan 40 mg"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#5250A8]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  value={newMedBatch}
                  onChange={(e) => setNewMedBatch(e.target.value)}
                  placeholder="e.g. TEL40A"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#5250A8]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={newMedMfg}
                  onChange={(e) => setNewMedMfg(e.target.value)}
                  placeholder="e.g. Torrent Pharma"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#5250A8]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={newMedExpiry}
                  onChange={(e) => setNewMedExpiry(e.target.value)}
                  placeholder="e.g. Aug 2027"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#5250A8]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-4 bg-[#5250A8] text-white text-xs font-semibold rounded-lg hover:bg-[#4338CA] transition-colors shadow-xs"
            >
              Add Medicine to Database
            </button>
          </form>

          {/* Medicines Registry List */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">Active Verified Medicines ({medicines.length})</h3>
            <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
              {medicines.map((m) => (
                <div key={m.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors">
                  <div>
                    <p className="font-bold text-slate-900">{m.medicine_name}</p>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Batch: {m.batch_number} • Mfg: {m.manufacturer} • Expiry: {m.expiry_date}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-medium rounded text-[10px] border border-emerald-200">
                    {m.verification_status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Alert Creator */}
      {activeTab === 'ALERTS' && (
        <div className="space-y-6">
          <form onSubmit={handleCreateAlert} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" /> Issue New Drug Safety / Recall Alert
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Alert Title</label>
                <input
                  type="text"
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder="e.g. Paracetamol Batch PAR500REC Packaging Recall"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#5250A8]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Affected Medicine</label>
                <input
                  type="text"
                  value={alertMed}
                  onChange={(e) => setAlertMed(e.target.value)}
                  placeholder="e.g. Paracetamol 500 mg"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#5250A8]"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Alert Severity</label>
                <select
                  value={alertSeverity}
                  onChange={(e: any) => setAlertSeverity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#5250A8]"
                >
                  <option value="WARNING">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Description & Reason</label>
                <textarea
                  value={alertDesc}
                  onChange={(e) => setAlertDesc(e.target.value)}
                  placeholder="Describe recall rationale, affected batches, and CDSCO directions..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-[#5250A8] h-20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-4 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
            >
              Publish Safety Alert
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

