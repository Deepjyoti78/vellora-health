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
              className="service-photo-card group scroll-reveal-card"
              aria-label={service.title}
            >
              {/* Top Media Area with Image 1 styled white & green pill badge */}
              <div className="service-card-media">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="eager"
                />
                {/* White pill with green number badge matching Image 1 */}
                <div className="absolute left-3.5 top-3.5 z-20 flex items-center gap-2 rounded-full bg-white/95 px-2 py-1.5 shadow-md border border-white/60 backdrop-blur-md">
                  <span className="flex items-center justify-center rounded-full bg-[#0b5c43] px-2.5 py-0.5 text-xs font-extrabold text-white shadow-xs">
                    {service.number}
                  </span>
                  <span className="pr-2 text-xs font-bold text-[#11191b] tracking-tight">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Lower Body with clean icon, title, and greener Explore Service button */}
              <div className="p-5 flex flex-col justify-between flex-1 relative z-10 bg-white">
                {/* Icon & Title Row */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eef7f7] text-[#0b5c43] border border-[#d8e7e8] shadow-xs">
                    <Icon name={(service.icon as IconName) || 'stethoscope'} className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-base font-extrabold leading-snug text-[#11191b] transition group-hover:text-[#0b5c43]">
                    {service.title}
                  </h3>
                </div>

                {/* Explore Service Button with Greener Background */}
                <div className="mt-5 pt-3 border-t border-[#edf3f4]">
                  <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-[#0b5c43] text-white font-bold text-xs tracking-wide shadow-sm transition-all duration-300 group-hover:bg-[#07402e] group-hover:shadow-md">
                    <span>Explore Service</span>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-300 group-hover:translate-x-1">
                      <Icon name="arrow-right" className="h-3.5 w-3.5" />
                    </div>
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
