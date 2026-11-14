'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { SERVICES_DATA, VALUE_PILLARS } from '@/data/site-content';
import { SliderArrows } from '@/components/common/SliderArrows';
import { Icon, IconName } from '@/components/common/Icon';

export const ServicesSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="section section-services" aria-labelledby="servicesTitle">
      <div className="container">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">FOUR CORE HEALTHCARE SERVICES</p>
            <h2 id="servicesTitle">
              Hospital-Grade Clinical Care<br />Delivered to Your Doorstep
            </h2>
            <p className="section-lead">
              Avoid hospital waiting rooms and travel stress. Licensed physicians, registered nurses, compassionate caretakers, and diagnostic phlebotomy — in the comfort of your home.
            </p>
          </div>
          <SliderArrows
            trackRef={trackRef}
            prevLabel="Previous service"
            nextLabel="Next service"
          />
        </div>

        <div
          className="service-track"
          id="serviceSlider"
          ref={trackRef}
          aria-label="Core home healthcare services"
        >
          {SERVICES_DATA.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="service-photo-card group"
              aria-label={service.title}
            >
              {/* Top Media Area with earlier black pill element */}
              <div className="service-card-media">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="eager"
                />
                {/* Earlier black element at top left */}
                <div className="absolute left-3.5 top-3.5 z-20 rounded-full bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10 shadow-sm">
                  {service.number} / {service.category}
                </div>
              </div>

              {/* Lower Body with Image 3 text effect and blackish background */}
              <div className="p-5 pt-3 flex flex-col justify-between flex-1 relative z-10 min-h-[195px]">
                {/* Icon & Title Row */}
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#116b70] shadow-sm">
                    <Icon name={(service.icon as IconName) || 'stethoscope'} className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-[15px] font-bold leading-snug text-white transition group-hover:text-teal-200">
                    {service.title}
                  </h3>
                </div>

                {/* Description Text */}
                <p className="mt-3 text-xs leading-relaxed text-gray-300 flex-1">
                  {service.description}
                </p>

                {/* Bottom Right Arrow Button */}
                <div className="mt-3 flex justify-end">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#116b70] text-white shadow-xs transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0e5c60]">
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="service-values mt-14" id="values">
          {VALUE_PILLARS.map((pillar) => (
            <div key={pillar.title} className="value-item">
              <div className="value-icon text-[#116b70]">
                <Icon name={pillar.icon as IconName} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#11191b]">{pillar.title}</h3>
                <p className="mt-1 text-xs text-[#687476]">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
