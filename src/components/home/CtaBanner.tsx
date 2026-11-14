'use client';

import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@/components/common/Icon';

export const CtaBanner: React.FC = () => {
  const { openBooking } = useBooking();

  return (
    <section className="section bg-[#11191b] py-20 text-white relative overflow-hidden" aria-labelledby="ctaTitle">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#116b70_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="container relative z-10 text-center max-w-3xl mx-auto">
        <span className="inline-block rounded-full bg-[#116b70]/40 px-3.5 py-1 text-xs font-semibold text-teal-300 mb-4 border border-[#116b70]/50">
          HEALTHCARE AT YOUR DOORSTEP
        </span>
        <h2 id="ctaTitle" className="font-heading text-3xl font-extrabold md:text-5xl tracking-tight text-white leading-tight">
          Experience Hospital-Quality Care in the Comfort of Your Home
        </h2>
        <p className="mt-4 text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Schedule a verified physician visit, certified nursing shift, bedside caretaker, or home blood draw in minutes. No waiting rooms. No commute.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => openBooking()}
            className="button button-white"
          >
            <Icon name="calendar" size="xs" />
            <span>Book Home Appointment</span>
            <Icon name="arrow-right" size="xs" />
          </button>
          <a
            href="/contact"
            className="button button-outline"
          >
            <span>Speak with Care Coordinator</span>
          </a>
        </div>

        <p className="mt-6 text-[11px] text-gray-400">
          *Demonstration prototype: Scheduling and clinical workflows operate with simulated demonstration data.
        </p>
      </div>
    </section>
  );
};
