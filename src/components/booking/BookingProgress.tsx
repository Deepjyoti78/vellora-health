'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Phone } from 'lucide-react';

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
    <header className="border-b border-[#E2EBE7] bg-white sticky top-0 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Top Branding & Direct Navigation Row */}
      <div className="border-b border-[#F2F8F5]">
        <div className="container max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Vellora Health Brand Identity */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 group"
            aria-label="Vellora Health Home"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#064E3B] text-white font-black text-sm shadow-2xs group-hover:bg-[#065F46] transition-colors">
              +
            </div>
            <span className="font-heading text-lg font-black tracking-tight text-[#102820]">
              Vellora Health
            </span>
          </Link>

          {/* Clinical Support & Back Action */}
          <div className="flex items-center gap-3 sm:gap-5">
            <a
              href="tel:18008355672"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#065F46] transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-[#065F46]" />
              <span>Need help? +1 (800) 835-5672</span>
            </a>

            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#CBDCD5] bg-white px-3 sm:px-3.5 py-1.5 text-xs font-bold text-[#102820] hover:bg-[#F2F8F5] hover:border-[#064E3B] transition-all shadow-2xs"
            >
              <ArrowLeft className="h-3 w-3 text-[#065F46]" />
              <span>{backLabel}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Title & 3-Step Progress Indicators */}
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-400">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <h1 className="font-heading text-xl sm:text-2xl lg:text-[26px] font-extrabold tracking-tight text-[#102820]">
              {title}
            </h1>
            <p className="mt-0.5 text-xs sm:text-[13px] text-slate-500">
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
    </header>
  );
};
