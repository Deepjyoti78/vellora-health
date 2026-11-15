'use client';

import React from 'react';
import Link from 'next/link';
import { Stethoscope, Users, Syringe, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '@/data/site-content';

export const ServicesSection: React.FC = () => {
  // Render matching medical icon for each service card
  const renderServiceIcon = (id: string) => {
    switch (id) {
      case 'doctor-visit':
        return <Stethoscope className="h-5 w-5 stroke-[2.2] group-hover:scale-110 transition-transform duration-300" />;
      case 'nursing-care':
        return (
          <svg
            className="h-5 w-5 group-hover:scale-110 transition-transform duration-300"
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
        return <Users className="h-5 w-5 stroke-[2.2] group-hover:scale-110 transition-transform duration-300" />;
      case 'lab-tests':
        return <Syringe className="h-5 w-5 stroke-[2.2] group-hover:scale-110 transition-transform duration-300" />;
      default:
        return <Stethoscope className="h-5 w-5 stroke-[2.2] group-hover:scale-110 transition-transform duration-300" />;
    }
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-b from-[#F2FBF7] via-[#FAFDFB] to-white py-14 sm:py-18 lg:py-22"
      aria-labelledby="servicesTitle"
    >
      {/* Soft ambient mint glow in background */}
      <div
        className="pointer-events-none absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[560px] h-[560px] rounded-full bg-[#E3F8EE] opacity-65 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 right-0 translate-x-1/3 w-[500px] h-[500px] rounded-full bg-[#ECFDF5] opacity-55 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 w-[600px] h-[280px] rounded-full bg-[#E8F8F0] opacity-45 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading - Matches typography of "Meet Our Medical Specialists" exactly */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          <h2
            id="servicesTitle"
            className="font-heading font-[750] text-[#11191b] tracking-[-0.052em] leading-[1.13] text-[clamp(34px,3.9vw,56px)] text-center"
          >
            Our Services
          </h2>
        </div>

        {/* 4 Service Cards Grid with Enhanced Card Background Effects & Aligned Spacing */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5.5 xl:gap-6.5 w-full"
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative flex flex-col h-full bg-gradient-to-b from-white via-[#FCFDFD] to-[#F4F9F6] rounded-[26px] sm:rounded-[28px] overflow-hidden border border-[#E2EBE6] hover:border-[#A7F3D0] shadow-[0_10px_30px_rgba(17,25,27,0.06)] hover:shadow-[0_22px_45px_rgba(6,95,70,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-3 focus-visible:ring-[#059669]"
              aria-label={service.title}
            >
              {/* Subtle ambient mint bloom inside card background on hover */}
              <div
                className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-[#D1FAE5]/60 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500"
                aria-hidden="true"
              />

              {/* Card Photo Top with smooth rounded crop */}
              <div className="relative w-full h-[225px] sm:h-[235px] lg:h-[225px] xl:h-[240px] overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Gentle subtle bottom fade to smoothly blend photo with card background */}
                <div
                  className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#FCFDFD]/40 to-transparent pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Card Body Content */}
              <div className="relative z-10 p-5 sm:p-5.5 flex flex-col flex-1 justify-between">
                {/* Icon + Title & Description Row */}
                <div className="flex items-start gap-3.5">
                  {/* Mint rounded icon badge with gradient background effect */}
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#E8F8F2] to-[#D5F5E7] border border-[#BDEBD7] flex items-center justify-center shrink-0 text-[#065F46] group-hover:from-[#DCFCE7] group-hover:to-[#BBF7D0] shadow-2xs group-hover:shadow-xs transition-all duration-300">
                    {renderServiceIcon(service.id)}
                  </div>

                  {/* Title and Short Description with baseline alignment */}
                  <div className="flex-1 min-w-0">
                    <div className="min-h-[46px] flex items-center">
                      <h3 className="font-heading font-bold text-[16.5px] sm:text-[17.5px] text-[#11191b] leading-snug group-hover:text-[#065F46] transition-colors">
                        {service.title}
                      </h3>
                    </div>
                    <div className="min-h-[38px] mt-1 flex items-start">
                      <p className="text-slate-500 text-[12.5px] sm:text-[13px] leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Full-Width "Book Now →" Pill Button with subtle depth */}
                <div className="mt-5 w-full pt-1">
                  <div className="w-full h-[45px] rounded-full bg-gradient-to-r from-[#064E3B] to-[#065F46] group-hover:from-[#065F46] group-hover:to-[#047857] text-white text-[13.5px] font-semibold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(6,78,59,0.2)] group-hover:shadow-[0_6px_20px_rgba(6,78,59,0.3)] transition-all duration-300">
                    <span>Book Now</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
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
