'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { SERVICES_DATA } from '@/data/site-content';
import { SliderArrows } from '@/components/common/SliderArrows';

// Distinct category tags matching the reference design
const SERVICE_CATEGORY_TAGS: Record<string, string> = {
  'doctor-visit': 'PRIMARY CARE',
  'nursing-care': 'HOME CARE',
  'caretakers': 'CARE SUPPORT',
  'lab-tests': 'DIAGNOSTICS',
};

// Mobile-specific copy matching user's mobile reference design
const MOBILE_SERVICE_DETAILS: Record<
  string,
  { title: string; desc: string; tag: string }
> = {
  'doctor-visit': {
    title: 'Doctor Home Consultation',
    desc: 'Qualified doctors at your doorstep for timely care.',
    tag: 'DOCTOR VISIT',
  },
  'nursing-care': {
    title: 'Home Nursing Care',
    desc: 'Professional nursing care at home.',
    tag: 'NURSING CARE',
  },
  'caretakers': {
    title: 'Patient Caretakers & Attendants',
    desc: 'Compassionate support for your loved ones.',
    tag: 'CARE SUPPORT',
  },
  'lab-tests': {
    title: 'Home Diagnostic & Vaccination',
    desc: 'Tests and vaccinations at your convenience.',
    tag: 'DIAGNOSTICS',
  },
};

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

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

  const handleMobileScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.clientWidth * 0.78;
    if (cardWidth > 0) {
      const idx = Math.round(scrollLeft / cardWidth);
      setActiveMobileIndex(Math.min(Math.max(idx, 0), SERVICES_DATA.length - 1));
    }
  };

  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const card = container.children[index] as HTMLElement;
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-white pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-14 lg:pb-16 shadow-[0_10px_35px_rgba(0,0,0,0.02)]"
      aria-labelledby="servicesTitle"
    >
      {/* Soft atmospheric ambient glow shadow effect in background - Hidden on mobile to prevent whitish bleed */}
      <div
        className="hidden md:block pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[720px] h-[340px] rounded-full bg-gradient-to-b from-[#E8F8F2]/60 via-[#ECFDF5]/30 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div
        className="hidden md:block pointer-events-none absolute bottom-0 right-0 w-[500px] h-[300px] rounded-full bg-[#EBF7F2]/40 blur-3xl"
        aria-hidden="true"
      />

      {/* Main Container - Aligns pixel-for-pixel with "Meet Our Medical Specialists" */}
      <div className="container relative">
        {/* Section Heading Row */}
        <div
          className={`section-heading-row [&.section-heading-row]:mb-5 md:[&.section-heading-row]:mb-6 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div>
            <p className="eyebrow flex items-center gap-2">
              <span>COMPREHENSIVE HEALTHCARE AT HOME</span>
              <span className="md:hidden inline-block h-[1.5px] w-6 bg-[#07583F]/60" />
            </p>
            <h2 id="servicesTitle">Our Services</h2>
            <p className="section-lead">
              <span className="md:hidden">
                From routine checkups to specialized treatment, our care team brings expert healthcare to your home.
              </span>
              <span className="hidden md:inline">
                From routine checkups to specialized treatment, our physicians bring expertise and human kindness together under one roof.
              </span>
            </p>
          </div>

          {/* Desktop Slider Arrows - Hidden on mobile in favor of bottom pill indicator */}
          <div className="hidden md:flex">
            <SliderArrows
              trackRef={scrollContainerRef}
              prevLabel="Previous service"
              nextLabel="Next service"
            />
          </div>
        </div>

        {/* Cards Row: Swipable peek carousel on mobile, 4-column responsive grid on desktop with tighter gap */}
        <div
          ref={scrollContainerRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible pt-3 md:pt-4 pb-3 md:pb-4 gap-4 md:gap-0 lg:gap-0 snap-x snap-mandatory scroll-smooth no-scrollbar w-full"
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service, index) => {
            const categoryTagDesktop = SERVICE_CATEGORY_TAGS[service.id] || 'SPECIALTY CARE';
            const mobileDetails = MOBILE_SERVICE_DETAILS[service.id] || {
              title: service.title,
              desc: service.description,
              tag: categoryTagDesktop,
            };

            return (
              <Link
                key={service.id}
                href={service.href}
                className={`group relative flex-none w-[80vw] max-w-[310px] sm:w-[320px] md:w-auto h-[315px] sm:h-[335px] lg:h-[365px] rounded-[24px] sm:rounded-[26px] overflow-hidden snap-start border border-[#E2EBE7]/50 shadow-[0_12px_28px_rgba(16,39,35,0.08)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)] hover:border-white/35 transition-all duration-300 hover:-translate-y-2 focus:outline-none focus-visible:ring-3 focus-visible:ring-[#059669] ${
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

                  {/* Gradient Overlay: Clean neutral dark base without greenish tint for text readability */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.02) 30%, rgba(0, 0, 0, 0.28) 52%, rgba(0, 0, 0, 0.76) 74%, rgba(0, 0, 0, 0.94) 100%)',
                    }}
                    aria-hidden="true"
                  />
                </div>

                {/* Card Content: Top pill badge on both mobile & desktop + Bottom title & desc */}
                <div className="relative z-10 h-full p-4 sm:p-5 lg:p-6 flex flex-col justify-between">
                  {/* Category Eyebrow Tag: Mint Pill Badge pinned to TOP on both mobile & desktop */}
                  <div>
                    <span className="inline-block rounded-full bg-[#A7F3D0] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#064E3B] shadow-xs">
                      {mobileDetails.tag}
                    </span>
                  </div>

                  {/* Bottom Content Block */}
                  <div>
                    {/* Service Title */}
                    <h3 className="font-heading font-bold text-white text-[18px] sm:text-[19px] lg:text-[20px] leading-[1.2] mb-1.5 transition-colors">
                      <span className="md:hidden">{mobileDetails.title}</span>
                      <span className="hidden md:inline">{service.title}</span>
                    </h3>

                    {/* Description Text */}
                    <p className="text-slate-200/95 text-[11.5px] sm:text-[12.5px] leading-relaxed line-clamp-2 pt-0.5">
                      <span className="md:hidden">{mobileDetails.desc}</span>
                      <span className="hidden md:inline">{service.description}</span>
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile Carousel Indicators matching Reference Image */}
        <div className="flex md:hidden items-center justify-center gap-2 pt-4">
          {SERVICES_DATA.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToCard(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeMobileIndex === idx
                  ? 'w-7 bg-[#075239]'
                  : 'w-5 bg-[#D1DCD6]'
              }`}
              aria-label={`Go to service ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
