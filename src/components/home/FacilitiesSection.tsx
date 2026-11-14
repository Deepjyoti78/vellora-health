'use client';

import React, { useRef } from 'react';
import { FACILITIES_DATA } from '@/data/site-content';
import { SliderArrows } from '@/components/common/SliderArrows';
import { Icon } from '@/components/common/Icon';

export const FacilitiesSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section id="facilities" className="section section-facilities" aria-labelledby="facilitiesTitle">
      <div className="container">
        <div className="section-heading-row scroll-reveal">
          <div>
            <p className="eyebrow">A BETTER CARE EXPERIENCE</p>
            <h2 id="facilitiesTitle">
              Designed around<br />comfort and care.
            </h2>
            <p className="section-lead">Every detail designed to help you feel at ease.</p>
          </div>
          <SliderArrows
            trackRef={trackRef}
            prevLabel="Previous facility"
            nextLabel="Next facility"
          />
        </div>

        <div
          id="facilitySlider"
          className="facility-track scroll-track stagger-container"
          ref={trackRef}
        >
          {FACILITIES_DATA.map((facility) => {
            if (facility.isSolid) {
              return (
                <article key={facility.id} className="facility-card facility-solid scroll-reveal-card">
                  <div className="facility-solid-text">
                    <Icon name="stethoscope" />
                    <h3>
                      State-of-the-art<br />equipment
                    </h3>
                  </div>
                </article>
              );
            }

            return (
              <article key={facility.id} className="facility-card scroll-reveal-card">
                <img
                  src={facility.image}
                  alt={facility.alt || facility.title}
                  loading="eager"
                />
                <h3>{facility.title}</h3>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
