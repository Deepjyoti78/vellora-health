'use client';

import React from 'react';
import { SPECIALTIES_DATA } from '@/data/site-content';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@/components/common/Icon';

export const SpecialtiesSection: React.FC = () => {
  const { openBooking } = useBooking();

  return (
    <section id="specialties" className="section section-specialties" aria-labelledby="specialtiesTitle">
      <div className="container">
        <div className="section-heading-row specialty-head">
          <div>
            <p className="eyebrow">EXPERTISE THAT CONNECTS</p>
            <h2 id="specialtiesTitle">
              Expert care across<br />every major specialty.
            </h2>
            <p className="section-lead">
              Find the right expertise for your needs, without navigating care alone.
            </p>
          </div>
          <div className="section-cta">
            <button
              type="button"
              className="button button-dark"
              onClick={() => openBooking()}
            >
              <Icon name="calendar" size="sm" /> Book an Appointment
            </button>
            <a href="#doctors" className="button button-line-dark">
              <Icon name="search" size="sm" /> Find a Doctor
            </a>
          </div>
        </div>

        <div className="specialty-grid" aria-label="Medical specialties">
          {SPECIALTIES_DATA.map((specialty) => (
            <button
              key={specialty.name}
              type="button"
              className="specialty-tile"
              onClick={() => openBooking({ specialty: specialty.name })}
            >
              <span className="specialty-symbol">{specialty.symbol}</span>
              <span>{specialty.name}</span>
              <Icon name="arrow-right" className="tile-arrow" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
