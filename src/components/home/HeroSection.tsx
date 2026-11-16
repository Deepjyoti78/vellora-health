'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TRUST_DATA } from '@/data/site-content';
import { useBooking } from '@/context/BookingContext';
import { Header } from '@/components/layout/Header';
import { Icon } from '@/components/common/Icon';

const AnimatedCounter: React.FC<{
  target: number;
  suffix?: string;
  decimals?: number;
  duration?: number;
}> = ({ target, suffix = '', decimals = 0, duration = 1800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Easing curve (easeOutCubic)
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = ease * target;

      setCount(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current));

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      }
    };

    animFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrame);
  }, [target, duration, decimals]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : count}
      {suffix}
    </span>
  );
};

export const HeroSection: React.FC = () => {
  const { openBooking } = useBooking();

  return (
    <section id="home" className="hero" aria-labelledby="heroTitle">
      <Header theme="dark" />

      <div className="hero-main container">
        <div className="hero-copy">
          <div className="trust-row animate-hero-trust" aria-label="Patient trust indicator">
            <div className="trust-avatars" aria-hidden="true">
              {TRUST_DATA.avatars.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt=""
                  width={26}
                  height={26}
                />
              ))}
            </div>
            <span>
              Trusted by <strong>135K+ people</strong>
            </span>
          </div>

          <h1 id="heroTitle" className="hero-title animate-hero-title">
            EXCEPTIONAL<br />
            <span className="hero-title-row">
              <span className="hero-title-thumb" aria-hidden="true">
                <img src="/assets/hero-heading-smile.jpg" alt="Smiling Doctor" />
              </span>
              <span className="hero-title-highlight">HEALTHCARE</span>
            </span><br />
            ALWAYS
          </h1>

          <div className="hero-actions animate-hero-actions">
            <button
              type="button"
              onClick={() => openBooking()}
              className="button button-white button-sm"
            >
              <Icon name="calendar" size="xs" /> Book Appointment{' '}
              <Icon name="arrow-right" size="xs" />
            </button>
            <Link
              href="/doctors"
              prefetch={true}
              className="button button-outline button-sm"
            >
              <Icon name="search" size="xs" /> Find a Doctor
            </Link>
          </div>
        </div>

        {/* Right-side statistics column with count-up animation */}
        <div className="hero-stats animate-hero-stats" aria-label="Key healthcare performance metrics">
          <div className="hero-stat-item">
            <span className="hero-stat-number">
              <AnimatedCounter target={20} suffix="K+" duration={1800} />
            </span>
            <span className="hero-stat-label">Patients Served Successfully</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">
              <AnimatedCounter target={30} suffix="+" duration={1900} />
            </span>
            <span className="hero-stat-label">Board-Certified Specialists</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">
              <AnimatedCounter target={18} duration={1700} />
            </span>
            <span className="hero-stat-label">Medical Departments</span>
          </div>
          <div className="hero-stat-item">
            <span className="hero-stat-number">
              <AnimatedCounter target={4.9} suffix="/5" decimals={1} duration={2000} />
            </span>
            <span className="hero-stat-label">Average Patient Satisfaction</span>
          </div>
        </div>

        <div className="hero-detail animate-hero-detail hidden md:block">
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
