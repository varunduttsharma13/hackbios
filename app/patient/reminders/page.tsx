'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bell,
  Calendar,
  Pill,
  ChevronLeft,
  Flame,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { MedicationReminder, AdherenceStatus, AdherenceMetric } from '@/types/reminders';
import { useVerification } from '@/lib/context/VerificationContext';

export default function PatientRemindersPage() {
  const { activeFamilyMember } = useVerification();
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [metrics, setMetrics] = useState<AdherenceMetric>({
    total_scheduled: 0,
    taken_count: 0,
    skipped_count: 0,
    snoozed_count: 0,
    adherence_rate: 100,
    streak_days: 14,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reminders?patient_id=PAT-10452');
      const data = await res.json();
      if (data.success) {
        setReminders(data.reminders || []);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleUpdateAdherence = async (reminder: MedicationReminder, status: AdherenceStatus) => {
    try {
      // Optimistic update
      setReminders((prev) =>
        prev.map((r) =>
          r.id === reminder.id
            ? { ...r, status, logged_at: new Date().toISOString() }
            : r
        )
      );

      // Recompute metrics locally
      setMetrics((prev) => {
        const newTaken = status === 'TAKEN' ? prev.taken_count + 1 : prev.taken_count;
        const newSkipped = status === 'SKIPPED' ? prev.skipped_count + 1 : prev.skipped_count;
        const newRate = prev.total_scheduled > 0 ? Math.round((newTaken / prev.total_scheduled) * 100) : 100;
        return {
          ...prev,
          taken_count: newTaken,
          skipped_count: newSkipped,
          adherence_rate: newRate,
        };
      });

      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reminder_id: reminder.id,
          status,
          patient_id: reminder.patient_id,
          medicine_name: reminder.medicine_name,
          notes: status === 'TAKEN' ? 'Taken on schedule' : `Marked as ${status}`,
        }),
      });

      const resData = await res.json();
      if (resData.success) {
        setActionSuccessMessage(`Marked "${reminder.medicine_name}" as ${status}`);
        setTimeout(() => setActionSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update adherence:', err);
    }
  };

  // Group reminders by time slot
  const slots: { slot: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT'; title: string; time: string }[] = [
    { slot: 'MORNING', title: 'Morning Doses', time: '08:00 AM' },
    { slot: 'AFTERNOON', title: 'Afternoon Doses', time: '01:30 PM' },
    { slot: 'EVENING', title: 'Evening Doses', time: '08:00 PM' },
    { slot: 'NIGHT', title: 'Bedtime Doses', time: '09:30 PM' },
  ];

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
                <h1 className="text-base font-extrabold text-slate-900">Medication Reminders & Adherence</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
                  Prescription-Linked
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Patient: <span className="font-semibold text-slate-800">{activeFamilyMember?.name || 'Lolita Sharma'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-2xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{metrics.streak_days} Day Streak</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-5 space-y-5">
        {actionSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* Adherence Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Adherence Rate</span>
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
            </div>
            <div className="text-2xl font-black text-[#0F766E]">
              {metrics.adherence_rate}%
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-[#0F766E] h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.adherence_rate}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Taken Today</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {metrics.taken_count} / {metrics.total_scheduled}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Doses completed</p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Skipped</span>
              <XCircle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700">
              {metrics.skipped_count}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Logged with reason</p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Current Streak</span>
              <Flame className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics.streak_days} <span className="text-xs font-semibold text-slate-500">days</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">On-time intake</p>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0F766E]" /> Today&apos;s Medication Timeline
            </h2>
            <button
              onClick={fetchReminders}
              className="text-xs text-[#0F766E] hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="w-3 h-3" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Loading prescribed medication schedule...
            </div>
          ) : reminders.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <Pill className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-800">No active medications scheduled today</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Reminders are generated deterministically from verified doctor e-prescriptions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {slots.map(({ slot, title, time }) => {
                const slotReminders = reminders.filter((r) => r.slot === slot);
                if (slotReminders.length === 0) return null;

                return (
                  <div key={slot} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="bg-slate-50/80 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span className="text-xs font-extrabold text-slate-900">{title}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                        {time}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {slotReminders.map((rem) => {
                        const isTaken = rem.status === 'TAKEN';
                        const isSkipped = rem.status === 'SKIPPED';
                        const isSnoozed = rem.status === 'SNOOZED';

                        return (
                          <div
                            key={rem.id}
                            className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                              isTaken ? 'bg-emerald-50/30' : isSkipped ? 'bg-amber-50/20' : ''
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-slate-900">{rem.medicine_name}</span>
                                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                  {rem.strength}
                                </span>
                                <span className="text-[11px] text-slate-500">({rem.dosage_form})</span>
                                {isTaken && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                                    <Check className="w-3 h-3" /> Taken
                                  </span>
                                )}
                                {isSkipped && (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                                    Skipped
                                  </span>
                                )}
                                {isSnoozed && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                                    Snoozed 15m
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {rem.instructions}
                              </p>
                              <div className="text-[10px] text-slate-600">
                                Rx ID: <span className="font-mono font-medium">{rem.prescription_id}</span>
                                {rem.logged_at && (
                                  <span className="ml-2 text-emerald-700 font-medium">
                                    • Logged at {new Date(rem.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleUpdateAdherence(rem, 'TAKEN')}
                                disabled={isTaken}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                                  isTaken
                                    ? 'bg-emerald-600 text-white cursor-default shadow-xs'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 active:scale-95'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                {isTaken ? 'Completed' : 'Take Dose'}
                              </button>

                              {!isTaken && (
                                <>
                                  <button
                                    onClick={() => handleUpdateAdherence(rem, 'SKIPPED')}
                                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                      isSkipped
                                        ? 'bg-amber-200 text-amber-900 font-bold'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                    title="Skip dose"
                                  >
                                    Skip
                                  </button>
                                  <button
                                    onClick={() => handleUpdateAdherence(rem, 'SNOOZED')}
                                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                      isSnoozed
                                        ? 'bg-blue-200 text-blue-900 font-bold'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                    title="Snooze for 15 minutes"
                                  >
                                    Snooze
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clinical Safety Disclaimer on Reminders */}
        <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-2xl space-y-1.5 text-xs text-slate-700">
          <div className="flex items-center gap-2 font-bold text-[#0F766E]">
            <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
            Adherence Protocol & Missed Dose Guidance
          </div>
          <p className="text-[11px] leading-relaxed text-slate-600">
            Never double a dose to make up for a missed tablet. Take the scheduled medication as soon as remembered unless it is almost time for your next dose, in which case skip the missed dose and resume your regular schedule. Always consult your prescribing doctor for critical maintenance medications.
          </p>
        </div>
      </div>
    </div>
  );
}
