'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '@/data/site-content';

// Distinct category tags matching the design specification
const SERVICE_CATEGORY_TAGS: Record<string, string> = {
  'doctor-visit': 'PRIMARY CARE',
  'nursing-care': 'HOME CARE',
  'caretakers': 'CARE SUPPORT',
  'lab-tests': 'DIAGNOSTICS',
};

export const ServicesSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-white py-14 sm:py-18 lg:py-22"
      aria-labelledby="servicesTitle"
    >
      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header: Left Column (Eyebrow, Title, Subtitle) & Right Column (Navigation Arrows) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12 lg:mb-14">
          <div className="max-w-2xl">
            {/* Eyebrow Label */}
            <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-2">
              COMPREHENSIVE HEALTHCARE AT HOME
            </p>

            {/* Main Section Heading */}
            <h2
              id="servicesTitle"
              className="font-heading font-extrabold text-[#102723] tracking-tight leading-[1.12] text-3xl sm:text-4xl lg:text-[48px]"
            >
              Our Services
            </h2>

            {/* Subtitle Description */}
            <p className="text-slate-600 text-sm sm:text-[15px] lg:text-[16px] leading-relaxed mt-3 max-w-[580px]">
              From routine checkups to specialized treatment, our physicians bring
              expertise and human kindness together under one roof.
            </p>
          </div>

          {/* Carousel Navigation Arrow Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start sm:self-end">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous services"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5 stroke-[2]" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next services"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ArrowRight className="h-4.5 w-4.5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* 4 Cards Grid - Responsive: Horizontally scrollable on mobile/small-tablet with snap, 4-col grid on desktop */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 lg:pb-0 lg:grid lg:grid-cols-4 gap-5 sm:gap-6 no-scrollbar w-full"
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service, index) => {
            const categoryTag = SERVICE_CATEGORY_TAGS[service.id] || 'SPECIALTY CARE';

            return (
              <Link
                key={service.id}
                href={service.href}
                className="group relative flex-none w-[280px] sm:w-[320px] lg:w-auto h-[440px] sm:h-[460px] lg:h-[480px] rounded-[28px] sm:rounded-[32px] overflow-hidden snap-start shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 focus:outline-none focus-visible:ring-3 focus-visible:ring-[#059669]"
                aria-label={service.title}
                style={{
                  animationDelay: `${index * 120}ms`,
                }}
              >
                {/* Full-Cover Background Image */}
                <div className="absolute inset-0 w-full h-full bg-slate-900">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay for high-contrast legible text at bottom */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#061713] from-15% via-[#061713]/85 via-48% to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                </div>

                {/* Card Content Aligned to the Bottom */}
                <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-end">
                  {/* Category Eyebrow Tag */}
                  <span className="text-[#6EE7B7] font-bold text-[11px] sm:text-xs uppercase tracking-[0.16em] mb-1.5 drop-shadow-xs">
                    {categoryTag}
                  </span>

                  {/* Service Title */}
                  <h3 className="font-heading font-bold text-white text-lg sm:text-[21px] leading-[1.22] mb-3 group-hover:text-[#A7F3D0] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description + Circular Action Arrow Button Row */}
                  <div className="flex items-end justify-between gap-3 pt-1">
                    <p className="text-slate-200/90 text-xs sm:text-[13px] leading-relaxed max-w-[185px] sm:max-w-[205px]">
                      {service.description}
                    </p>

                    {/* Circular White Action Button with Right Arrow */}
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#102723] flex items-center justify-center shrink-0 shadow-lg group-hover:bg-[#E6F4EA] group-hover:scale-110 active:scale-95 transition-all duration-300"
                      aria-hidden="true"
                    >
                      <ArrowRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2.3] text-[#102723]" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
