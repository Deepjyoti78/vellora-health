'use client';

import React, { useRef, useState, useEffect } from 'react';
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
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-white pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-24 shadow-[0_10px_35px_rgba(0,0,0,0.02)]"
      aria-labelledby="servicesTitle"
    >
      {/* Soft atmospheric ambient glow shadow effect in background */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[720px] h-[340px] rounded-full bg-gradient-to-b from-[#E8F8F2]/60 via-[#ECFDF5]/30 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full bg-[#EBF7F2]/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header: Left Column & Right Navigation Controls with entrance transition */}
        <div
          className={`flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-11 sm:mb-13 lg:mb-14 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="max-w-2xl">
            {/* Small uppercase eyebrow tag */}
            <p className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500 mb-2">
              COMPREHENSIVE HEALTHCARE AT HOME
            </p>

            {/* Main Section Heading with refined typography and soft depth */}
            <h2
              id="servicesTitle"
              className="font-heading font-extrabold text-[#102723] tracking-tight leading-[1.1] text-3xl sm:text-4xl lg:text-[48px] drop-shadow-[0_2px_4px_rgba(16,39,35,0.06)]"
            >
              Our Services
            </h2>

            {/* Subtitle Description */}
            <p className="text-slate-600 text-sm sm:text-[15px] lg:text-[15.5px] leading-relaxed mt-2.5 max-w-[560px]">
              From routine checkups to specialized treatment, our physicians bring
              expertise and human kindness together under one roof.
            </p>
          </div>

          {/* Carousel Navigation Arrow Controls with subtle shadow and border */}
          <div className="flex items-center gap-3 shrink-0 self-start sm:self-end">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous services"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-4.5 w-4.5 stroke-[2] text-[#102723]" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next services"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-sm active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <ArrowRight className="h-4.5 w-4.5 stroke-[2] text-[#102723]" />
            </button>
          </div>
        </div>

        {/* 4 Cards Grid with Staggered Entrance Animations & Enhanced Floating Shadows */}
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
                className={`group relative flex-none w-[285px] sm:w-[320px] md:w-auto h-[350px] sm:h-[360px] lg:h-[365px] rounded-[24px] sm:rounded-[26px] overflow-hidden snap-start border border-[#E2EBE7]/50 shadow-[0_12px_28px_rgba(16,39,35,0.12)] hover:shadow-[0_22px_48px_rgba(6,78,59,0.22)] transition-all duration-500 hover:-translate-y-2.5 focus:outline-none focus-visible:ring-3 focus-visible:ring-[#059669] ${
                  isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-[0.98]'
                }`}
                style={{
                  transitionDelay: isVisible ? `${index * 130}ms` : '0ms',
                  transitionDuration: '650ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                aria-label={service.title}
              >
                {/* Full-Cover Background Image with subtle scale zoom on hover */}
                <div className="absolute inset-0 w-full h-full bg-slate-900">
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay: 65-70% bright photography, dark base for text readability */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(0, 25, 22, 0) 0%, rgba(0, 25, 22, 0.02) 35%, rgba(0, 25, 22, 0.25) 55%, rgba(0, 22, 20, 0.78) 78%, rgba(0, 19, 17, 0.98) 100%)',
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Card Content with Refined Font Sizes & Deliberate Proportions */}
                <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-end">
                  {/* Category Eyebrow Tag - Compact and Clean */}
                  <span className="text-[#6EE7B7] font-bold text-[10.5px] sm:text-[11px] uppercase tracking-[0.14em] mb-1 drop-shadow-xs">
                    {categoryTag}
                  </span>

                  {/* Service Title - Reduced to ~19-20px for balanced composition */}
                  <h3 className="font-heading font-bold text-white text-[18px] sm:text-[19px] lg:text-[20px] leading-[1.2] mb-2 group-hover:text-[#A7F3D0] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description + Circular Action Arrow Button Row */}
                  <div className="flex items-end justify-between gap-3 pt-0.5">
                    {/* Refined Description Font Size */}
                    <p className="text-slate-200/95 text-[11.5px] sm:text-[12.5px] leading-relaxed max-w-[180px] sm:max-w-[195px] line-clamp-2">
                      {service.description}
                    </p>

                    {/* Circular White Action Button with Enhanced Floating Shadow */}
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#102723] flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.18)] group-hover:bg-[#E6F7F0] group-hover:scale-110 group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.24)] active:scale-95 transition-all duration-300"
                      aria-hidden="true"
                    >
                      <ArrowRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 stroke-[2.3] text-[#102723] group-hover:translate-x-0.5 transition-transform duration-200" />
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
