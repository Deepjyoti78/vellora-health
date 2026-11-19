'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/common/Icon';

export const CtaBanner: React.FC = () => {
  return (
    <section className="section bg-gradient-to-br from-[#064E3B]/90 via-[#032E23] to-[#021B14] border-t border-emerald-500/20 py-20 text-white relative overflow-hidden" aria-labelledby="ctaTitle">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />
      <div className="container relative z-10 text-center max-w-3xl mx-auto scroll-reveal-scale">
        <span className="inline-block rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-4 border border-emerald-400/40">
          HEALTHCARE AT YOUR DOORSTEP
        </span>
        <h2 id="ctaTitle" className="font-heading text-3xl font-extrabold md:text-5xl tracking-tight !text-white leading-tight">
          Experience Hospital-Quality Care in the Comfort of Your Home
        </h2>
        <p className="mt-4 text-sm md:text-base text-emerald-100/80 leading-relaxed max-w-2xl mx-auto">
          Schedule a verified physician visit, certified nursing shift, bedside caretaker, or home blood draw in minutes. No waiting rooms. No commute.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/book"
            prefetch={true}
            className="inline-flex items-center gap-2 rounded-full bg-white text-[#064E3B] hover:bg-emerald-400 hover:text-white font-bold px-7 py-3 text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <Icon name="calendar" size="xs" />
            <span>Book Home Appointment</span>
            <Icon name="arrow-right" size="xs" />
          </Link>
          <Link
            href="/contact"
            prefetch={true}
            className="inline-flex items-center gap-2 rounded-full bg-transparent border border-white/30 text-white hover:bg-white/10 font-bold px-7 py-3 text-sm transition-all"
          >
            <span>Speak with Care Coordinator</span>
          </Link>
        </div>

        <p className="mt-6 text-[11px] text-emerald-200/50">
          *Demonstration prototype: Scheduling and clinical workflows operate with simulated demonstration data.
        </p>
      </div>
    </section>
  );
};
