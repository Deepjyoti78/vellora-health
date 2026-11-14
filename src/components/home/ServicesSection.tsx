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
              className="service-photo-card group block overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:shadow-xl"
            >
              <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="eager"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3 rounded-full bg-[#11191b]/85 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                  {service.number} / {service.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-bold text-[#11191b] transition group-hover:text-[#116b70]">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#687476]">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#116b70]">
                  <span>Explore service &amp; options</span>
                  <Icon name="arrow-right" size="xs" />
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
