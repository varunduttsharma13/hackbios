'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, CheckCircle2, AlertTriangle, AlertOctagon, ArrowRight, Pill } from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';

export default function HistoryPage() {
  const router = useRouter();
  const { history, viewHistoryRecord } = useVerification();
  const [filter, setFilter] = useState<'ALL' | 'MATCHED' | 'MISMATCH' | 'EXPIRED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter((item) => {
    if (filter === 'MATCHED' && item.match_status !== 'MATCHED') return false;
    if (filter === 'MISMATCH' && item.match_status !== 'MISMATCH') return false;
    if (filter === 'EXPIRED' && item.expiry_status !== 'EXPIRED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const sMed = (item.scanned_medicine_name || item.scanned_medicine || '').toLowerCase();
      const pMed = (item.prescribed_medicine_name || item.prescription_medicine || '').toLowerCase();
      const batch = (item.scanned_batch || item.batch_number || '').toLowerCase();
      return sMed.includes(q) || pMed.includes(q) || batch.includes(q);
    }
    return true;
  });

  const handleSelectRecord = (recordId: string) => {
    viewHistoryRecord(recordId);
    router.push('/safety');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Verification History</h1>
        <p className="text-xs text-slate-500">Chronological audit log of prescription-to-strip comparative verifications</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by medicine, brand or batch number..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F766E] shadow-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['ALL', 'MATCHED', 'MISMATCH', 'EXPIRED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                filter === f
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History Cards List */}
      <div className="space-y-2.5">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <Pill className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-slate-800 text-sm">No verification records found</p>
            <p className="text-xs text-slate-500">Try modifying your search query or filter selection.</p>
          </div>
        ) : (
          filteredHistory.map((item) => {
            const isMatched = item.match_status === 'MATCHED';
            const isExpired = item.expiry_status === 'EXPIRED';

            return (
              <div
                key={item.id}
                onClick={() => handleSelectRecord(item.id)}
                className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold shrink-0 ${
                      isExpired
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : isMatched
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                    }`}
                  >
                    {isExpired ? (
                      <AlertOctagon className="w-4 h-4" />
                    ) : isMatched ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{item.scanned_medicine_name}</h3>
                    <p className="text-[11px] text-slate-600">
                      Prescribed: {item.prescribed_medicine_name} ({item.prescribed_strength})
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Batch: {item.scanned_batch} • Mfg: {item.scanned_manufacturer}
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2.5 shrink-0">
                  <div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider ${
                        isExpired
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : isMatched
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isExpired ? 'EXPIRED' : isMatched ? 'MATCHED' : 'MISMATCH'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      {new Date(item.created_at || item.timestamp || '2026-03-01').toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
