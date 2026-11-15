'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { SERVICES_DATA } from '@/data/site-content';
import { SliderArrows } from '@/components/common/SliderArrows';

export const ServicesSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
      aria-labelledby="servicesTitle"
    >
      {/* Soft organic mint ambient glow in top-left matching reference image */}
      <div
        className="pointer-events-none absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[520px] h-[520px] rounded-full bg-[#E8F8F1] opacity-75 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/4 right-0 translate-x-1/3 w-[420px] h-[420px] rounded-full bg-[#F0FAF5] opacity-60 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Centered Main Heading matching reference image */}
        <div className="mx-auto max-w-3xl text-center mb-12 sm:mb-16">
          {/* Badge with horizontal lines */}
          <div className="flex items-center justify-center gap-3.5 mb-3.5">
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#9ED2BE]/70" />
            <span className="rounded-full bg-[#EBF7F2] border border-[#BDE8D6] px-4 sm:px-5 py-1 text-xs sm:text-[13px] font-semibold text-[#065F46] tracking-wide shadow-2xs">
              Home Healthcare Services
            </span>
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#9ED2BE]/70" />
          </div>

          {/* Heading */}
          <h2
            id="servicesTitle"
            className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#102820] mb-3.5 leading-[1.18]"
          >
            Complete Care, <span className="text-[#047857]">Right at Your Home</span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-[15px] max-w-2xl mx-auto leading-relaxed font-normal">
            Avoid hospital waiting rooms with licensed physician visits, registered nursing, and diagnostics delivered to your home.
          </p>
        </div>

        {/* Mobile slide controls */}
        <div className="flex justify-end mb-3 md:hidden">
          <SliderArrows
            trackRef={trackRef}
            prevLabel="Previous service"
            nextLabel="Next service"
          />
        </div>

        {/* 4 Cards Row matching Target Reference Image */}
        <div
          ref={trackRef}
          id="serviceSlider"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 xl:gap-6.5 w-full"
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative flex flex-col justify-end overflow-hidden rounded-[26px] h-[480px] sm:h-[500px] lg:h-[520px] xl:h-[530px] w-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_18px_42px_rgba(0,43,33,0.18)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-3 focus-visible:ring-[#059669]"
              aria-label={service.title}
            >
              {/* Full-bleed photograph covering 100% of card */}
              <img
                src={service.image}
                alt={service.alt}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
              />

              {/* Smooth, subtle bottom-to-top gradient overlay matching Target Reference */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0, 43, 33, 0.98) 0%, rgba(0, 48, 38, 0.85) 20%, rgba(0, 52, 40, 0.50) 38%, rgba(0, 52, 40, 0.15) 54%, transparent 68%)',
                }}
              />

              {/* Bottom-aligned text & button overlay */}
              <div className="relative z-10 p-5 sm:p-6 pb-6 flex flex-col justify-end w-full">
                {/* Title container aligned with min-height */}
                <div className="min-h-[52px] flex items-end">
                  <h3 className="text-[19px] sm:text-[20px] font-bold text-white leading-snug tracking-tight">
                    {service.title}
                  </h3>
                </div>

                {/* Description container */}
                <div className="min-h-[42px] mt-2 flex items-start">
                  <p className="text-[13px] sm:text-[13.5px] text-white/90 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Full-width Book Now pill button aligned along horizontal baseline */}
                <div className="mt-5 w-full">
                  <div className="w-full h-[46px] sm:h-[48px] flex items-center justify-center gap-2 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-[14px] font-semibold shadow-xs transition-all duration-200 group-hover:bg-[#047857] group-hover:shadow-sm">
                    <span>Book Now</span>
                    <span className="text-[16px] leading-none transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
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
