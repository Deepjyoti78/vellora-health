'use client';

import React, { useRef } from 'react';
import { SERVICES_DATA, VALUE_PILLARS } from '@/data/site-content';
import { useBooking } from '@/context/BookingContext';
import { SliderArrows } from '@/components/common/SliderArrows';
import { Icon, IconName } from '@/components/common/Icon';

export const ServicesSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  return (
    <section id="services" className="section section-services" aria-labelledby="servicesTitle">
      <div className="container">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">OUR APPROACH</p>
            <h2 id="servicesTitle">
              Everything you need for<br />better health—in one place.
            </h2>
            <p className="section-lead">
              Your care, connected. From routine checkups to specialist support, all in one place.
            </p>
          </div>
          <SliderArrows
            trackRef={trackRef}
            prevLabel="Previous service"
            nextLabel="Next service"
          />
        </div>

        <div
          className="service-track scroll-track"
          id="serviceSlider"
          ref={trackRef}
          aria-label="Care services"
        >
          {SERVICES_DATA.map((service) => {
            if (service.isBookingLink) {
              return (
                <a
                  key={service.id}
                  href="#booking"
                  className="service-photo-card"
                  onClick={(e) => {
                    e.preventDefault();
                    openBooking();
                  }}
                >
                  <img
                    src={service.image}
                    alt={service.alt}
                    loading="eager"
                  />
                  <div className="service-card-caption">
                    <span className="service-no">{service.number} / {service.category}</span>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <span className="service-mini-arrow">
                      <Icon name="arrow-right" size="sm" />
                    </span>
                  </div>
                </a>
              );
            }

            return (
              <a
                key={service.id}
                href={service.href}
                className="service-photo-card"
              >
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="eager"
                />
                <div className="service-card-caption">
                  <span className="service-no">{service.number} / {service.category}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="service-mini-arrow">
                    <Icon name="arrow-right" size="sm" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <div className="service-values" id="about">
          {VALUE_PILLARS.map((pillar) => (
            <div key={pillar.title} className="value-item">
              <div className="value-icon">
                <Icon name={pillar.icon as IconName} />
              </div>
              <div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
