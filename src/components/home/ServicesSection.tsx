'use client';

import React from 'react';
import Link from 'next/link';
import { HeartPulse, Stethoscope, Users, Syringe, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '@/data/site-content';

export const ServicesSection: React.FC = () => {
  // Render matching medical icon for each service card
  const renderServiceIcon = (id: string) => {
    switch (id) {
      case 'doctor-visit':
        return <Stethoscope className="h-5 w-5 stroke-[2.2]" />;
      case 'nursing-care':
        return (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 7v10m-5-5h10" />
            <rect x="3" y="3" width="18" height="18" rx="4" />
          </svg>
        );
      case 'caretakers':
        return <Users className="h-5 w-5 stroke-[2.2]" />;
      case 'lab-tests':
        return <Syringe className="h-5 w-5 stroke-[2.2]" />;
      default:
        return <Stethoscope className="h-5 w-5 stroke-[2.2]" />;
    }
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-b from-[#F2FBF7] via-[#FAFDFB] to-white py-14 sm:py-18 lg:py-22"
      aria-labelledby="servicesTitle"
    >
      {/* Soft organic mint ambient glow & wave in top-left matching reference */}
      <div
        className="pointer-events-none absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[520px] h-[520px] rounded-full bg-[#E3F8EE] opacity-70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-[460px] h-[460px] rounded-full bg-[#ECFDF5] opacity-60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 w-[500px] h-[260px] rounded-full bg-[#E8F8F0] opacity-40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Centered Main Header */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#E8F8F2] border border-[#BDEBD7] px-4 py-1.5 text-xs font-semibold text-[#065F46] tracking-wide shadow-2xs">
              <HeartPulse className="h-4 w-4 text-[#065F46] stroke-[2.2]" />
              <span>Our Care Services</span>
            </span>
          </div>

          {/* Heading */}
          <h2
            id="servicesTitle"
            className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#102820] mt-3.5 leading-[1.18]"
          >
            Complete Care, <span className="text-[#065F46]">Right at Your Home</span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-[15.5px] max-w-2xl mx-auto mt-3 leading-relaxed font-normal">
            Avoid hospital waiting rooms with licensed physician visits, registered nursing, and diagnostics delivered to your home.
          </p>

          {/* Accent Line */}
          <div className="w-14 h-1 bg-[#065F46] rounded-full mx-auto mt-4.5" />
        </div>

        {/* 4 Service Cards Grid */}
        <div
          className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5.5 xl:gap-6.5 w-full"
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group flex flex-col h-full bg-white rounded-[26px] sm:rounded-[28px] overflow-hidden border border-slate-100/90 shadow-[0_10px_28px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_42px_rgba(6,78,59,0.12)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-3 focus-visible:ring-[#059669]"
              aria-label={service.title}
            >
              {/* Card Photo Top */}
              <div className="relative w-full h-[225px] sm:h-[235px] lg:h-[225px] xl:h-[240px] overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-104"
                />
              </div>

              {/* Card Body Content */}
              <div className="p-5 sm:p-5.5 flex flex-col flex-1 justify-between bg-white">
                {/* Icon + Title & Description Row */}
                <div className="flex items-start gap-3.5">
                  {/* Mint rounded icon badge */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#E8F8F2] border border-[#BDEBD7] flex items-center justify-center shrink-0 text-[#065F46] group-hover:bg-[#DCFCE7] transition-colors">
                    {renderServiceIcon(service.id)}
                  </div>

                  {/* Title and Short Description */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-[16.5px] sm:text-[17.5px] text-[#102820] leading-snug group-hover:text-[#065F46] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-[12.5px] sm:text-[13px] leading-relaxed mt-1">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Full-Width "Book Now →" Pill Button */}
                <div className="mt-5 w-full pt-1">
                  <div className="w-full h-[44px] rounded-full bg-[#064E3B] group-hover:bg-[#065F46] text-white text-[13.5px] font-semibold flex items-center justify-center gap-2 shadow-xs transition-all duration-200">
                    <span>Book Now</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
