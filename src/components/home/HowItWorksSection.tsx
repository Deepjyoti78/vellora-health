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
    <section id="how-it-works" className="section py-14 sm:py-18" aria-labelledby="howItWorksTitle">
      <div className="container">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 scroll-reveal">
          <div>
            <p className="eyebrow text-[#065F46] font-bold tracking-wider uppercase">STREAMLINED CLINICAL PROCESS</p>
            <h2 id="howItWorksTitle" className="font-heading text-3xl font-extrabold text-[#11191B] md:text-5xl tracking-tight leading-tight">
              Doctors Who Listen.<br />Experts You Can Trust.
            </h2>
          </div>
          <p className="text-sm md:text-base text-[#55696D] leading-relaxed max-w-md">
            Meet our dedicated team of healthcare professionals committed to providing exceptional, hospital-grade care tailored to your needs.
          </p>
        </div>

        {/* 3 Large Cards with Clean White Base and Greenish Hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-container mb-12">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              className="group relative overflow-hidden flex flex-col justify-between rounded-3xl bg-white hover:bg-gradient-to-br hover:from-[#064E3B] hover:via-[#043D2E] hover:to-[#022A20] p-8 border border-[#E5EAE7] hover:border-[#10B981]/70 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(6,78,59,0.25)] transition-all duration-700 ease-out hover:-translate-y-2 scroll-reveal-card"
            >
              {/* Designer Watermark Number */}
              <span
                aria-hidden="true"
                className="absolute top-2 right-7 select-none text-[108px] font-semibold leading-none text-slate-400 group-hover:text-white/30 pointer-events-none transition-all duration-700 group-hover:scale-105"
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Didot, 'Bodoni MT', 'Cinzel', 'Times New Roman', serif",
                }}
              >
                {step.num}
              </span>

              {/* Top Row: Icon Badge */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EAF5F0] group-hover:bg-[#10B981] text-[#065F46] group-hover:text-white border border-[#D1E6DC] group-hover:border-transparent shadow-xs transition-all duration-700 ease-out">
                  <Icon name={step.icon === 'shield' ? 'shield' : step.icon === 'calendar' ? 'calendar' : 'star'} size="sm" />
                </div>
              </div>

              {/* Title & Description */}
              <div className="mt-8 mb-6 relative z-10">
                <h3 className="font-heading text-xl font-bold text-[#11191B] group-hover:text-white mb-2 leading-snug transition-colors duration-700 ease-out">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-[13px] leading-relaxed text-[#55696D] group-hover:text-emerald-50/90 transition-colors duration-700 ease-out">
                  {step.desc}
                </p>
              </div>

              {/* Bottom "Learn More" Link */}
              <div className="pt-4 border-t border-gray-100 group-hover:border-white/15 relative z-10 transition-colors duration-700 ease-out">
                <Link
                  href={step.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] group-hover:text-emerald-300 transition-colors duration-700 ease-out"
                >
                  <span>Learn More</span>
                  <Icon name="arrow-right" size="xs" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Centered "Get Started" Button */}
        <div className="text-center scroll-reveal">
          <Link
            href="/book"
            prefetch={true}
            className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] hover:bg-[#043D2E] text-white font-bold px-8 py-3.5 text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Get Started</span>
            <Icon name="arrow-right" size="xs" />
          </Link>
        </div>
      </div>
    </section>
  );
};
