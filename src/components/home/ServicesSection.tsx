'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { SERVICES_DATA } from '@/data/site-content';
import { SliderArrows } from '@/components/common/SliderArrows';

export const ServicesSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="section section-services py-14 sm:py-20 bg-[#FAFCFB]" aria-labelledby="servicesTitle">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Centered Main Heading matching reference image */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="hidden sm:block w-8 h-[1px] bg-[#C6E6D8]" />
            <span className="rounded-full bg-[#EBF7F2] border border-[#C6E6D8] px-4 py-1 text-xs font-semibold text-[#065F46] tracking-wide shadow-2xs">
              Home Healthcare Services
            </span>
            <span className="hidden sm:block w-8 h-[1px] bg-[#C6E6D8]" />
          </div>

          <h2 id="servicesTitle" className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#102820] mb-3 leading-tight">
            Complete Care, <span className="text-[#065F46]">Right at Your Home</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-[14px] max-w-2xl mx-auto leading-relaxed font-normal">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 w-full"
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative flex flex-col justify-end overflow-hidden rounded-[24px] h-[460px] sm:h-[490px] lg:h-[520px] w-full shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(0,43,33,0.18)] transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-3 focus-visible:ring-[#059669]"
              aria-label={service.title}
            >
              {/* Full-bleed photograph covering 100% of card */}
              <img
                src={service.image}
                alt={service.alt}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
              />

              {/* Smooth, subtle bottom-to-top gradient overlay matching Target Reference */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0, 43, 33, 0.98) 0%, rgba(0, 54, 42, 0.74) 24%, rgba(0, 54, 42, 0.25) 48%, transparent 68%)',
                }}
              />

              {/* Bottom-aligned text & button overlay */}
              <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-end w-full">
                {/* Fixed-height title container so buttons align on the same baseline */}
                <div className="min-h-[50px] flex items-end">
                  <h3 className="text-[19px] sm:text-[20px] font-semibold text-white leading-snug tracking-tight">
                    {service.title}
                  </h3>
                </div>

                {/* Fixed-height description container */}
                <div className="min-h-[40px] mt-2 flex items-start">
                  <p className="text-[13px] sm:text-[13.5px] text-white/90 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Full-width Book Now pill button aligned along horizontal baseline */}
                <div className="mt-5 w-full">
                  <div className="w-full h-[48px] sm:h-[50px] flex items-center justify-center gap-1.5 rounded-full bg-[#059669] hover:bg-[#047857] text-white text-[14px] font-semibold shadow-xs transition-all duration-200 group-hover:bg-[#047857] group-hover:shadow-sm">
                    <span>Book Now</span>
                    <span className="text-[15px] transition-transform duration-200 group-hover:translate-x-1">→</span>
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
