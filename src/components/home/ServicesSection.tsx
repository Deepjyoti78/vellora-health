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
              <img
                src={service.image}
                alt={service.alt}
                loading="eager"
              />
              {service.id === 'doctor-visit' && (
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-white drop-shadow-md">
                    01 / DOCTOR VISIT
                  </span>
                </div>
              )}
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
