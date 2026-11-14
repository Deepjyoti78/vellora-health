'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check } from 'lucide-react';

interface StepItem {
  number: number;
  label: string;
}

interface BookingProgressProps {
  currentStep: number;
  totalSteps?: number;
  steps: StepItem[];
  backHref?: string;
  backLabel?: string;
  title: string;
  subtitle: string;
}

export const BookingProgress: React.FC<BookingProgressProps> = ({
  currentStep,
  totalSteps = 3,
  steps,
  backHref = '/services',
  backLabel = 'Back to Services',
  title,
  subtitle,
}) => {
  return (
    <div className="border-b border-[#E2EBE7] bg-white py-6 sm:py-7">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        {/* Back Link & Step Counter */}
        <div className="flex items-center justify-between mb-3">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] hover:text-[#064E3B] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{backLabel}</span>
          </Link>

          <span className="text-xs font-semibold text-slate-400">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Title, Subtitle & Integrated Progress Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-[26px] font-extrabold tracking-tight text-[#102820]">
              {title}
            </h1>
            <p className="mt-1 text-xs sm:text-[13px] text-slate-500">
              {subtitle}
            </p>
          </div>

          {/* Integrated 3-Step Pill Progress */}
          <div className="flex items-center gap-1.5 self-start md:self-auto">
            {steps.map((step, idx) => {
              const isDone = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <React.Fragment key={step.number}>
                  <div
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#064E3B] text-white shadow-2xs'
                        : isDone
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#D1FAE5]'
                        : 'bg-[#F2F8F5] text-slate-400'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : isDone
                          ? 'bg-[#065F46] text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isDone ? <Check className="h-2.5 w-2.5 stroke-[3]" /> : step.number}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <span className="text-slate-300 text-xs select-none">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
