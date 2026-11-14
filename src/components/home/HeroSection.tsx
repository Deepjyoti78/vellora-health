'use client';

import React from 'react';
import Image from 'next/image';
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

        <div className="hero-detail">
          <h2>Comprehensive Care</h2>
          <p>Accessible, modern medical care — where technology meets compassion.</p>
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
