'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { SERVICES_DATA } from '@/data/site-content';
import { SliderArrows } from '@/components/common/SliderArrows';

export const ServicesSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="section section-services py-12 sm:py-16 bg-[#FAFCFB]" aria-labelledby="servicesTitle">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Centered Main Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <p className="uppercase tracking-[0.18em] text-[#065F46] text-xs font-bold mb-2">
            Four Core Healthcare Services
          </p>
          <h2 id="servicesTitle" className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#102820] mb-3 leading-tight">
            Our Services
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
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

        {/* 4 Cards Row matching reference image */}
        <div
          ref={trackRef}
          id="serviceSlider"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 w-full"
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative flex flex-col justify-end overflow-hidden rounded-[26px] h-[440px] sm:h-[460px] lg:h-[480px] w-full shadow-[0_6px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(4,51,40,0.22)] transition-all duration-300 hover:-translate-y-1.5"
              aria-label={service.title}
            >
              {/* Full-bleed photograph */}
              <img
                src={service.image}
                alt={service.alt}
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Seamless dark green gradient overlay matching reference image */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#043328] via-[#043328]/85 via-48% to-transparent pointer-events-none" />

              {/* Lower content pinned to bottom */}
              <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-end w-full">
                {/* Title */}
                <h3 className="font-heading text-lg sm:text-[19px] font-extrabold text-white leading-snug tracking-tight">
                  {service.title}
                </h3>

                {/* Subtitle / Short description */}
                <p className="mt-1.5 text-xs sm:text-[13px] text-white/85 leading-relaxed font-normal">
                  {service.description}
                </p>

                {/* Vibrant Emerald Pill Button */}
                <div className="mt-4 w-full">
                  <div className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[#059669] py-2.5 px-4 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-200 group-hover:bg-[#10b981] group-hover:shadow-lg">
                    <span>Book Now</span>
                    <span className="text-sm font-bold transition-transform duration-200 group-hover:translate-x-1">→</span>
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
