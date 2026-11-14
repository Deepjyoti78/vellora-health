'use client';

import React from 'react';
import { HOW_IT_WORKS_DATA } from '@/data/site-content';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@/components/common/Icon';

export const HowItWorksSection: React.FC = () => {
  const { openBooking } = useBooking();

  return (
    <section id="how-it-works" className="section bg-[#f5f7f7] py-20 border-b border-[#e5e9e9]" aria-labelledby="howItWorksTitle">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
          <p className="eyebrow text-[#116b70]">STREAMLINED CLINICAL PROCESS</p>
          <h2 id="howItWorksTitle" className="font-heading text-3xl font-extrabold text-[#11191b] md:text-4xl">
            How Home Healthcare Works
          </h2>
          <p className="mt-3 text-sm text-[#687476]">
            From your initial request to bedside consultation and electronic prescription follow-up — simple, transparent, and completely verified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-container">
          {HOW_IT_WORKS_DATA.map((item) => (
            <div
              key={item.step}
              className="relative flex flex-col rounded-2xl bg-white p-7 border border-[#e5e9e9] shadow-sm transition hover:shadow-md scroll-reveal-card"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="font-heading text-2xl font-black text-[#116b70]/30 tracking-tight">
                  {item.step}
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf4f3] text-[#116b70]">
                  <Icon name={item.icon === 'calendar' ? 'calendar' : item.icon === 'shield' ? 'shield' : item.icon === 'file-text' ? 'file' : 'users'} size="sm" />
                </div>
              </div>
              <h3 className="font-heading text-base font-bold text-[#11191b] mb-2">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#687476]">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => openBooking()}
            className="button button-dark"
          >
            <span>Request Home Visit Now</span>
            <Icon name="arrow-right" size="xs" />
          </button>
        </div>
      </div>
    </section>
  );
};
