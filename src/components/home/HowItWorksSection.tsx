'use client';

import React from 'react';
import Link from 'next/link';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@/components/common/Icon';

export const HowItWorksSection: React.FC = () => {
  const { openBooking } = useBooking();

  const workflowSteps = [
    {
      num: '1',
      title: 'Find a Specialist',
      desc: 'Use filters to choose the best clinical match for your needs — board-certified visiting doctors, nurses, or lab technicians.',
      icon: 'shield',
      href: '/doctors',
    },
    {
      num: '2',
      title: 'Book an Appointment',
      desc: 'Pick a time that works for you — on-demand immediate arrival or scheduled bedside shifts tailored to your family.',
      icon: 'calendar',
      href: '/book',
    },
    {
      num: '3',
      title: 'Start Your Healing Journey',
      desc: 'Experience unhurried care at home verified by secret 4-digit PIN, with digital prescriptions and continuous follow-up.',
      icon: 'star',
      href: '/book',
    },
  ];

  return (
    <section id="how-it-works" className="section bg-gradient-to-b from-white via-[#fbfdfe] to-[#f4f9f9]/50 py-20 border-b border-[#e5e9e9]" aria-labelledby="howItWorksTitle">
      <div className="container">
        {/* Section Heading - Matching Image 3 layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 scroll-reveal">
          <div>
            <p className="eyebrow text-[#116b70]">STREAMLINED CLINICAL PROCESS</p>
            <h2 id="howItWorksTitle" className="font-heading text-3xl font-extrabold text-[#11191b] md:text-5xl tracking-tight leading-tight">
              Doctors Who Listen.<br />Experts You Can Trust.
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#55696d] leading-relaxed max-w-md">
            Meet our dedicated team of healthcare professionals committed to providing exceptional, hospital-grade care tailored to your needs.
          </p>
        </div>

        {/* 3 Large Cards - Matching Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-container mb-12">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              className="relative flex flex-col justify-between rounded-3xl bg-white p-8 border border-[#e8eeee] shadow-xs hover:border-[#b8dcde] hover:shadow-md transition-all duration-300 scroll-reveal-card"
            >
              {/* Top Row: Icon Badge + Huge Light Watermark Number */}
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef7f7] text-[#116b70] border border-[#d2e7e8] shadow-xs">
                  <Icon name={step.icon === 'shield' ? 'shield' : step.icon === 'calendar' ? 'calendar' : 'star'} size="sm" />
                </div>
                <span className="font-heading text-6xl font-light text-gray-200 select-none leading-none -mt-2">
                  {step.num}
                </span>
              </div>

              {/* Title & Description */}
              <div className="mt-8 mb-6">
                <h3 className="font-heading text-xl font-bold text-[#11191b] mb-2 leading-snug">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#55696d]">
                  {step.desc}
                </p>
              </div>

              {/* Bottom "Learn More" Link */}
              <div className="pt-4 border-t border-[#f2f6f6]">
                <Link
                  href={step.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#116b70] hover:text-[#0b494c] transition-colors"
                >
                  <span>Learn More</span>
                  <Icon name="arrow-right" size="xs" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Centered "Get Started" Button - Matching Image 3 */}
        <div className="text-center scroll-reveal">
          <Link
            href="/book"
            prefetch={true}
            className="button button-dark"
          >
            <span>Get Started</span>
            <Icon name="arrow-right" size="xs" />
          </Link>
        </div>
      </div>
    </section>
  );
};
