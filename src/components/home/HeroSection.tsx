'use client';

import React from 'react';
import Link from 'next/link';
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
          <div className="trust-row animate-hero-trust" aria-label="Patient trust indicator">
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
              Trusted by <strong>135k+ people</strong>
            </span>
          </div>

          <h1 id="heroTitle" className="hero-title animate-hero-title">
            EXCEPTIONAL<br />
            <span className="hero-title-row">
              <span className="hero-title-thumb" aria-hidden="true">
                <img src="/assets/avatar-3.webp" alt="Patient" />
              </span>
              HEALTHCARE
            </span><br />
            ALWAYS
          </h1>

          <div className="hero-actions animate-hero-actions">
            <Link
              href="/book"
              prefetch={true}
              className="button button-white button-sm"
            >
              <Icon name="calendar" size="xs" /> Book Appointment{' '}
              <Icon name="arrow-right" size="xs" />
            </Link>
            <Link
              href="/doctors"
              prefetch={true}
              className="button button-outline button-sm"
            >
              <Icon name="search" size="xs" /> Find a Doctor
            </Link>
          </div>
        </div>

        {/* Right-side statistics column */}
        <div className="hero-stats animate-hero-stats" aria-label="Key healthcare performance metrics">
          <div className="hero-stat-item">
            <span className="hero-stat-number">20K+</span>
            <span className="hero-stat-label">Patients Served Successfully</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">30+</span>
            <span className="hero-stat-label">Board-Certified Specialists</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">18</span>
            <span className="hero-stat-label">Medical Departments</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">4.9/5</span>
            <span className="hero-stat-label">Average Patient Satisfaction</span>
          </div>
        </div>

        <div className="hero-detail animate-hero-detail">
          <p className="hero-detail-text">
            Accessible Modern Medical Care — where technology meets compassion.<br />
            From routine checkups to specialized treatment, our physicians bring<br />
            expertise and human kindness together under one roof.
          </p>
        </div>
      </div>
    </section>
  );
};
