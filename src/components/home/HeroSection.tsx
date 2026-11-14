'use client';

import React from 'react';
import { TRUST_DATA } from '@/data/site-content';
import { useBooking } from '@/context/BookingContext';
import { Header } from '@/components/layout/Header';
import { Icon } from '@/components/common/Icon';

export const HeroSection: React.FC = () => {
  const { openBooking } = useBooking();

  return (
    <section id="home" className="hero" aria-labelledby="heroTitle">
      <Header />

      <div className="hero-main container">
        <div className="hero-copy">
          <div className="trust-row">
            <div className="trust-avatars" aria-hidden="true">
              {TRUST_DATA.avatars.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt=""
                  width={31}
                  height={31}
                />
              ))}
            </div>
            <span>
              Trusted by <strong>{TRUST_DATA.count}</strong> {TRUST_DATA.label}
            </span>
          </div>

          <h1 id="heroTitle">
            EXCEPTIONAL<br />
            HEALTHCARE<br />
            ALWAYS
          </h1>

          <div className="hero-actions">
            <button
              type="button"
              className="button button-white button-sm"
              onClick={() => openBooking()}
            >
              <Icon name="calendar" size="xs" /> Book Appointment{' '}
              <Icon name="arrow-right" size="xs" />
            </button>
            <a className="button button-outline button-sm" href="#doctors">
              <Icon name="search" size="xs" /> Find a Doctor
            </a>
          </div>
        </div>

        <div className="hero-detail">
          <p className="hero-detail-text">
            <strong>Accessible Modern Medical Care</strong> — where technology meets compassion.
          </p>
        </div>
      </div>

      <div className="hero-index" aria-hidden="true">
        <span>01</span>
        <span className="hero-index-line"></span>
        <span>07</span>
      </div>
    </section>
  );
};
