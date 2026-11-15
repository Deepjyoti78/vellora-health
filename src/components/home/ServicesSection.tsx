'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '@/data/site-content';

// Distinct category tags matching the reference design
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
      className="relative bg-white pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24"
      aria-labelledby="servicesTitle"
    >
      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header: Left Column (Eyebrow, Title, Subtitle) & Right Column (Navigation Arrows) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-14 lg:mb-16">
          <div className="max-w-2xl">
            {/* Small uppercase eyebrow tag */}
            <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-2">
              COMPREHENSIVE HEALTHCARE AT HOME
            </p>

            {/* Main Section Heading */}
            <h2
              id="servicesTitle"
              className="font-heading font-extrabold text-[#102723] tracking-tight leading-[1.1] text-4xl sm:text-5xl lg:text-[52px]"
            >
              Our Services
            </h2>

            {/* Subtitle Description */}
            <p className="text-slate-600 text-sm sm:text-[15px] lg:text-[16px] leading-relaxed mt-3 max-w-[560px]">
              From routine checkups to specialized treatment, our physicians bring
              expertise and human kindness together under one roof.
            </p>
          </div>

          {/* Carousel Navigation Arrow Controls */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous services"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5 stroke-[2] text-[#102723]" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next services"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ArrowRight className="h-4.5 w-4.5 stroke-[2] text-[#102723]" />
            </button>
          </div>
        </div>

        {/* 4 Cards Grid - Responsive:
            Desktop: 4 columns in a single row with aspect ratio ~0.88-0.92 (height ~350px-365px).
            Tablet: 2 columns.
            Mobile: horizontal swipeable snap scroll.
        */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 snap-x snap-mandatory scroll-smooth pb-4 md:pb-0 no-scrollbar w-full"
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service, index) => {
            const categoryTag = SERVICE_CATEGORY_TAGS[service.id] || 'SPECIALTY CARE';

            return (
              <Link
                key={service.id}
                href={service.href}
                className="group relative flex-none w-[285px] sm:w-[320px] md:w-auto h-[350px] sm:h-[360px] lg:h-[365px] rounded-[24px] sm:rounded-[26px] overflow-hidden snap-start shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-3 focus-visible:ring-[#059669]"
                aria-label={service.title}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Full-Cover Background Image with Natural Proportions */}
                <div className="absolute inset-0 w-full h-full bg-slate-900">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay precisely matching Reference Image 1:
                      - Upper 65-70% remains bright and clearly visible
                      - Smooth dark fade in the bottom 30-35% for crystal-clear white text contrast
                  */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(0, 25, 22, 0) 0%, rgba(0, 25, 22, 0.02) 35%, rgba(0, 25, 22, 0.25) 55%, rgba(0, 22, 20, 0.78) 78%, rgba(0, 19, 17, 0.98) 100%)',
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Card Content: Positioned at bottom-left with ~28-32px padding */}
                <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-end">
                  {/* Category Eyebrow Tag */}
                  <span className="text-[#6EE7B7] font-bold text-[12px] sm:text-[13px] uppercase tracking-[0.12em] mb-1.5 drop-shadow-xs">
                    {categoryTag}
                  </span>

                  {/* Service Title */}
                  <h3 className="font-heading font-bold text-white text-[22px] sm:text-[24px] lg:text-[25px] xl:text-[26px] leading-[1.16] mb-2.5 group-hover:text-[#A7F3D0] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description + Circular Action Arrow Button Row */}
                  <div className="flex items-end justify-between gap-3 pt-0.5">
                    <p className="text-slate-200 text-xs sm:text-[13.5px] lg:text-[14px] leading-relaxed max-w-[195px] sm:max-w-[210px] line-clamp-2">
                      {service.description}
                    </p>

                    {/* Circular White Action Button (~46-48px diameter) with Right Arrow */}
                    <div
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#102723] flex items-center justify-center shrink-0 shadow-md group-hover:bg-[#E8F8F2] group-hover:scale-108 active:scale-95 transition-all duration-200"
                      aria-hidden="true"
                    >
                      <ArrowRight className="h-4.5 w-4.5 sm:h-5 sm:w-5 stroke-[2.3] text-[#102723] group-hover:translate-x-0.5 transition-transform duration-200" />
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
