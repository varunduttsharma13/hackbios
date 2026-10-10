'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  UserPlus,
  KeyRound,
  Trash2,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Phone,
  Clock,
  Info,
  Calendar,
} from 'lucide-react';
import { CaregiverDelegation, CaregiverPermission } from '@/types/family';
import { useVerification } from '@/lib/context/VerificationContext';

export default function FamilyCaregiverPage() {
  const { activeFamilyMember } = useVerification();
  const [delegations, setDelegations] = useState<CaregiverDelegation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // New Caregiver Form State
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [selectedPermissions, setSelectedPermissions] = useState<CaregiverPermission[]>([
    'VIEW_PRESCRIPTIONS',
    'MANAGE_REMINDERS',
  ]);

  const allPermissions: { key: CaregiverPermission; label: string; desc: string }[] = [
    { key: 'VIEW_PRESCRIPTIONS', label: 'View Prescriptions', desc: 'Can view doctor e-prescriptions and verified strips' },
    { key: 'MANAGE_REMINDERS', label: 'Manage Reminders', desc: 'Can log medication intake (Taken / Skipped) on behalf of patient' },
    { key: 'VIEW_LAB_REPORTS', label: 'View Lab Reports', desc: 'Can access uploaded blood test and diagnostic records' },
    { key: 'RECEIVE_EMERGENCY_ALERTS', label: 'Emergency Alerts', desc: 'Receives alerts for drug recalls and interaction warnings' },
  ];

  const fetchDelegations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/family?patient_id=PAT-10452');
      const data = await res.json();
      if (data.success) {
        setDelegations(data.delegations || []);
      }
    } catch (err) {
      console.error('Failed to load caregiver delegations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelegations();
  }, []);

  const handleTogglePermission = (perm: CaregiverPermission) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverName.trim() || !caregiverPhone.trim()) {
      setFeedback({ type: 'error', message: 'Caregiver name and phone number are required.' });
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: 'PAT-10452',
          patient_name: activeFamilyMember?.name || 'Lolita Sharma',
          caregiver_name: caregiverName.trim(),
          caregiver_phone: caregiverPhone.trim(),
          relationship,
          permissions: selectedPermissions,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Explicit access granted to ${caregiverName}.` });
        setShowAddModal(false);
        setCaregiverName('');
        setCaregiverPhone('');
        fetchDelegations();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to grant access.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeAccess = async (delegationId: string, name: string) => {
    if (!confirm(`Are you sure you want to revoke all health record and prescription access for ${name}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/family?id=${delegationId}&reason=Patient revoked delegation`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFeedback({ type: 'success', message: `Access for ${name} has been revoked immediately.` });
        fetchDelegations();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Failed to revoke access.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-full pb-20 bg-slate-50 text-slate-900">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/patient"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#0F766E]" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900">Caregiver Access & Explicit Delegation</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
                  ABDM Compliant
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Grant, review, and revoke authorized access to health records and prescriptions
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Caregiver</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-5">
        {feedback && (
          <div
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Security Rule Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Lock className="w-4 h-4 text-[#0F766E]" />
            Explicit Patient Consent & Consent Revocation Architecture
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In MED-BRIDGE, family members do not automatically gain access to each other&apos;s records. All access requires explicit authorization with granular scopes. You can inspect active authorizations and revoke access at any time with immediate server-side revocation.
          </p>
        </div>

        {/* Active Caregivers List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0F766E]" /> Authorized Caregivers & Representatives
          </h2>

          {loading ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Loading authorized delegates...
            </div>
          ) : delegations.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <KeyRound className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No external caregivers authorized</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Only you have access to your health records and prescriptions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {delegations.map((del) => {
                const isActive = del.status === 'ACTIVE';

                return (
                  <div
                    key={del.id}
                    className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-3 transition-all ${
                      isActive ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">{del.caregiver_name}</span>
                          <span className="text-xs text-slate-500 font-medium">({del.relationship})</span>
                          {isActive ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                              Revoked
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> {del.caregiver_phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" /> Granted: {new Date(del.granted_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <button
                          onClick={() => handleRevokeAccess(del.id, del.caregiver_name)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Revoke Access
                        </button>
                      )}
                    </div>

                    {/* Permissions list */}
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Authorized Permissions:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {del.permissions.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-1 rounded-lg bg-teal-50 text-[#0F766E] border border-teal-200 text-[11px] font-medium"
                          >
                            ✓ {p.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Caregiver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#0F766E]" /> Grant Caregiver Access
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGrantAccess} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Caregiver Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={caregiverPhone}
                    onChange={(e) => setCaregiverPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0F766E]"
                  >
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Caregiver / Nurse">Caregiver / Nurse</option>
                    <option value="Legal Guardian">Legal Guardian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Granted Scopes & Permissions</label>
                <div className="space-y-2">
                  {allPermissions.map(({ key, label, desc }) => {
                    const checked = selectedPermissions.includes(key);
                    return (
                      <label
                        key={key}
                        className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer transition-colors ${
                          checked ? 'bg-teal-50/60 border-teal-300' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleTogglePermission(key)}
                          className="mt-0.5 rounded text-[#0F766E] focus:ring-[#0F766E]"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900">{label}</p>
                          <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F766E] hover:bg-[#0D9488] text-white shadow-xs"
                >
                  {submitting ? 'Granting...' : 'Confirm & Grant Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
