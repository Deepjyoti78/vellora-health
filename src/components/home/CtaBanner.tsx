'use client';

import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@/components/common/Icon';

export const CtaBanner: React.FC = () => {
  const { openBooking } = useBooking();

  return (
    <section id="contact" className="cta-banner" aria-labelledby="bannerTitle">
      <img
        src="/assets/wellness.webp"
        alt="Woman enjoying a peaceful moment outdoors at sunset"
        loading="eager"
      />
      <div className="banner-shade"></div>
      <div className="container banner-inner">
        <div>
          <span className="banner-tag">GOOD HEALTH, YOUR WAY</span>
          <h2 id="bannerTitle">
            YOUR HEALTH<br />
            DESERVES<br />
            EXCEPTIONAL CARE.
          </h2>
          <p>Compassionate support and thoughtful care for every chapter of life.</p>
        </div>
        <div className="banner-actions">
          <button
            type="button"
            className="button button-white"
            onClick={() => openBooking()}
          >
            <Icon name="calendar" size="sm" /> Book Appointment{' '}
            <Icon name="arrow-right" size="sm" />
          </button>
          <a className="button button-outline" href="#doctors">
            <Icon name="search" size="sm" /> Find a Doctor
          </a>
        </div>
      </div>
    </section>
  );
};
