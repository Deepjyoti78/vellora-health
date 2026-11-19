'use client';

import React from 'react';
import Link from 'next/link';
import { CARE_OPTIONS_DATA } from '@/data/site-content';

export const CareOptionsSection: React.FC = () => {
  return (
    <section id="care-options" className="section py-14 sm:py-18" aria-labelledby="careOptionsTitle">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12 scroll-reveal">
          <p className="eyebrow text-[#065F46] font-bold tracking-wider uppercase">FLEXIBLE CLINICAL SCHEDULES</p>
          <h2 id="careOptionsTitle" className="font-heading text-3xl font-extrabold text-[#11191B] md:text-5xl tracking-tight leading-tight">
            Home Care Options &amp; Shift Packages
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#55696D] leading-relaxed font-normal">
            Whether you need a one-time doctor examination, a 12-hour surgical nursing shift, a 24-hour elder attendant, or routine diagnostic blood testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-container">
          {CARE_OPTIONS_DATA.map((opt) => (
            <div
              key={opt.id}
              className="group flex flex-col justify-between rounded-3xl border border-[#E5EAE7] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#10B981]/60 hover:shadow-[0_16px_36px_rgba(6,78,59,0.12)] transition-all duration-300 hover:-translate-y-1.5 scroll-reveal-card"
            >
              <div>
                <span className="inline-block rounded-full bg-[#EAF5F0] border border-[#D1E6DC] px-3 py-1 text-[11px] font-bold text-[#065F46] uppercase tracking-wide">
                  {opt.badge}
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-[#11191B]">
                  {opt.title}
                </h3>
                <p className="mt-1 text-xs text-[#687476]">{opt.subtitle}</p>

                <div className="my-5 rounded-xl border border-dashed border-[#D1E4DB] bg-[#F8FCFA] p-3 text-center">
                  <p className="text-[11px] font-semibold text-[#687476] uppercase tracking-wider">Demo Estimate</p>
                  <p className="font-heading text-lg font-extrabold text-[#11191B]">{opt.demoPrice}</p>
                  <p className="text-[11px] text-[#065F46] font-medium">{opt.duration}</p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#415054]">
                  {opt.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#065F46] font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 pt-4 border-t border-gray-100 flex flex-col gap-2">
                <Link
                  href={`/book?service=${opt.serviceSlug}`}
                  prefetch={true}
                  className="w-full text-center rounded-full bg-[#064E3B] text-white hover:bg-[#043D2E] py-2.5 text-xs font-bold transition shadow-sm hover:shadow"
                >
                  Book This Option
                </Link>
                <Link
                  href={`/services/${opt.serviceSlug}`}
                  prefetch={true}
                  className="text-center text-[11px] font-semibold text-[#065F46] hover:text-[#043D2E] transition-colors"
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
