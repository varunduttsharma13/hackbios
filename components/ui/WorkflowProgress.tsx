'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { VerificationStep } from '@/types/verification';

interface WorkflowProgressProps {
  currentStep: VerificationStep;
}

export const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ currentStep }) => {
  const steps: { key: VerificationStep; label: string; num: number }[] = [
    { key: 'PRESCRIPTION', label: 'Rx Capture', num: 1 },
    { key: 'CONFIRM', label: 'Confirm', num: 2 },
    { key: 'SCAN', label: 'Strip Scan', num: 3 },
    { key: 'SAFETY', label: 'Safety Report', num: 4 },
  ];

  const currentIdx = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs mb-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2 px-0.5">
        <span className="text-slate-900 tracking-wider uppercase text-[10px] font-bold">Verification Step {currentIdx + 1} of 4</span>
        <span className="text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded text-[10px] font-semibold border border-teal-200">
          {steps[currentIdx]?.label}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 items-center">
        {steps.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={`w-full h-1.5 rounded-full transition-all duration-200 ${
                  isDone
                    ? 'bg-[#0F766E]'
                    : isCurrent
                    ? 'bg-[#0F766E] shadow-xs'
                    : 'bg-slate-100'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
