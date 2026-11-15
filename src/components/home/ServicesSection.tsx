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
      className="relative overflow-hidden bg-white py-12 sm:py-16 lg:py-20"
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

      {/* Expanded container: reduces side margins and increases card width */}
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Centered Main Heading */}
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-14">
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
            className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#15212B] mb-3.5 leading-[1.18]"
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

        {/* 4 Cards Row: Reduced height, wider images, and reduced corner roundness */}
        <div
          ref={trackRef}
          id="serviceSlider"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 xl:gap-6 w-full"
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative flex flex-col justify-end overflow-hidden rounded-[16px] h-[410px] sm:h-[425px] lg:h-[435px] xl:h-[440px] w-full shadow-[0_6px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_38px_rgba(0,43,33,0.18)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-3 focus-visible:ring-[#059669]"
              aria-label={service.title}
            >
              {/* Full-bleed photograph covering 100% of card */}
              <img
                src={service.image}
                alt={service.alt}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
              />

              {/* Smooth, balanced bottom-to-top gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0, 43, 33, 0.98) 0%, rgba(0, 48, 38, 0.88) 22%, rgba(0, 52, 40, 0.52) 44%, rgba(0, 52, 40, 0.15) 62%, transparent 74%)',
                }}
              />

              {/* Bottom-aligned text & button overlay */}
              <div className="relative z-10 p-5 sm:p-5.5 pb-5 flex flex-col justify-end w-full">
                {/* Title container aligned with min-height */}
                <div className="min-h-[48px] flex items-end">
                  <h3 className="text-[18px] sm:text-[19px] font-bold text-white leading-snug tracking-tight">
                    {service.title}
                  </h3>
                </div>

                {/* Description container */}
                <div className="min-h-[38px] mt-1.5 flex items-start">
                  <p className="text-[12.5px] sm:text-[13px] text-white/90 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Full-width Book Now pill button aligned along horizontal baseline */}
                <div className="mt-4 w-full">
                  <div className="w-full h-[42px] sm:h-[44px] flex items-center justify-center gap-2 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-[13.5px] font-semibold shadow-xs transition-all duration-200 group-hover:bg-[#047857] group-hover:shadow-sm">
                    <span>Book Now</span>
                    <span className="text-[15px] leading-none transition-transform duration-200 group-hover:translate-x-1">
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
