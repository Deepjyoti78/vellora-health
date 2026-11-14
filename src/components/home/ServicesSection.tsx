'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { SERVICES_DATA } from '@/data/site-content';
import { SliderArrows } from '@/components/common/SliderArrows';
import { Icon, IconName } from '@/components/common/Icon';

export const ServicesSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="section section-services" aria-labelledby="servicesTitle">
      <div className="container">
        {/* Centered Main Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 scroll-reveal">
          <p className="eyebrow text-center uppercase tracking-widest text-[#116b70] text-xs font-bold mb-2">
            Four Core Healthcare Services
          </p>
          <h2 id="servicesTitle" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#11191b] mb-3">
            Our Services
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Avoid hospital waiting rooms with licensed physician visits, registered nursing, and diagnostics delivered to your home.
          </p>
        </div>

        {/* Mobile slide controls if needed */}
        <div className="flex justify-end mb-3 md:hidden">
          <SliderArrows
            trackRef={trackRef}
            prevLabel="Previous service"
            nextLabel="Next service"
          />
        </div>

        <div
          className="service-track stagger-container"
          id="serviceSlider"
          ref={trackRef}
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="service-photo-card group scroll-reveal-card relative overflow-hidden rounded-[24px] bg-white border border-[#e6eded] shadow-xs hover:border-[#b8dcde] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              aria-label={service.title}
            >
              {/* Top Media Area with image and badge matching reference */}
              <div className="service-card-media relative w-full overflow-hidden bg-[#edf5f5]">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* White pill with green number badge & category name matching reference image */}
                <div className="absolute left-3.5 top-3.5 z-20 flex items-center gap-2 rounded-full bg-white/95 px-2.5 py-1.5 shadow-sm border border-white/80 backdrop-blur-md">
                  <span className="flex items-center justify-center rounded-full bg-[#0b5c43] px-2.5 py-0.5 text-xs font-bold text-white shadow-xs">
                    {service.number}
                  </span>
                  <span className="pr-1 text-xs font-bold text-[#11191b] tracking-tight">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Lower Body: Icon + Title + Short Description + Explore Service link */}
              <div className="p-5 flex flex-col justify-between flex-1 relative z-10 bg-white">
                {/* Icon & Title Row */}
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf7f3] text-[#0b5c43] border border-[#d6ede4] shadow-xs">
                    <Icon name={(service.icon as IconName) || 'stethoscope'} className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-sm sm:text-[15px] font-extrabold leading-tight text-[#11191b] transition group-hover:text-[#0b5c43]">
                      {service.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-[#5e7171] leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action: Book Now -> matching reference image */}
                <div className="mt-5 pt-1">
                  <div className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-full bg-[#e8f5ee] text-[#0b5c43] text-xs sm:text-[13px] font-bold border border-[#d6ede2] transition-all duration-300 group-hover:bg-[#d8efe2] group-hover:border-[#c2e7d3] group-hover:shadow-xs">
                    <span>Book Now</span>
                    <span className="text-sm font-bold leading-none transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>

                {/* Subtle organic mint glow in bottom-right corner matching reference */}
                <div className="pointer-events-none absolute -bottom-5 -right-5 h-20 w-20 rounded-full bg-emerald-100/35 blur-xl" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
