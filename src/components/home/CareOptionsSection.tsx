'use client';

import React from 'react';
import Link from 'next/link';
import { CARE_OPTIONS_DATA } from '@/data/site-content';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@/components/common/Icon';

export const CareOptionsSection: React.FC = () => {
  const { openBooking } = useBooking();

  return (
    <section id="care-options" className="section bg-[#ffffff] py-20 border-b border-[#e5e9e9]" aria-labelledby="careOptionsTitle">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
          <p className="eyebrow text-[#116b70]">FLEXIBLE CLINICAL SCHEDULES</p>
          <h2 id="careOptionsTitle" className="font-heading text-3xl font-extrabold text-[#11191b] md:text-4xl">
            Home Care Options &amp; Shift Packages
          </h2>
          <p className="mt-3 text-sm text-[#687476]">
            Whether you need a one-time doctor examination, a 12-hour surgical nursing shift, a 24-hour elder attendant, or routine diagnostic blood testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-container">
          {CARE_OPTIONS_DATA.map((opt) => (
            <div
              key={opt.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e5e9e9] bg-[#fbfcfc] p-6 transition hover:border-[#116b70] hover:shadow-lg scroll-reveal-card"
            >
              <div>
                <span className="inline-block rounded-full bg-[#eaf4f3] px-3 py-1 text-[11px] font-bold text-[#116b70] uppercase tracking-wide">
                  {opt.badge}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#11191b]">
                  {opt.title}
                </h3>
                <p className="mt-1 text-xs text-[#687476]">{opt.subtitle}</p>

                <div className="my-5 rounded-xl border border-dashed border-[#d1dada] bg-white p-3 text-center">
                  <p className="text-[11px] font-semibold text-[#687476] uppercase tracking-wider">Demo Estimate</p>
                  <p className="font-heading text-lg font-extrabold text-[#11191b]">{opt.demoPrice}</p>
                  <p className="text-[11px] text-[#116b70] font-medium">{opt.duration}</p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#415054]">
                  {opt.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#116b70] font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 pt-4 border-t border-[#e5e9e9] flex flex-col gap-2">
                <Link
                  href={`/book?service=${opt.serviceSlug}`}
                  prefetch={true}
                  className="w-full text-center rounded-full bg-[#11191b] py-2.5 text-xs font-bold text-white transition hover:bg-[#116b70]"
                >
                  Book This Option
                </Link>
                <Link
                  href={`/services/${opt.serviceSlug}`}
                  prefetch={true}
                  className="text-center text-[11px] font-semibold text-[#687476] hover:text-[#11191b]"
                >
                  View Full Details &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
