'use client';

import React, { useRef } from 'react';
import { DOCTORS_DATA } from '@/data/site-content';
import { useBooking } from '@/context/BookingContext';
import { SliderArrows } from '@/components/common/SliderArrows';
import { Icon } from '@/components/common/Icon';

export const DoctorsSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { openBooking } = useBooking();

  return (
    <section id="doctors" className="section section-doctors container" aria-labelledby="doctorsTitle">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">THE PEOPLE BEHIND YOUR CARE</p>
          <h2 id="doctorsTitle">
            Meet our<br />specialists.
          </h2>
          <p className="section-lead">
            A team approach that brings expertise and kindness together.
          </p>
        </div>
        <SliderArrows
          trackRef={trackRef}
          prevLabel="Previous doctor"
          nextLabel="Next doctor"
        />
      </div>

      <div
        className="doctor-track scroll-track"
        id="doctorSlider"
        ref={trackRef}
        aria-label="Doctor profiles"
      >
        {DOCTORS_DATA.map((doctor) => (
          <article key={doctor.id} className="doctor-card">
            <img
              src={doctor.image}
              alt={doctor.alt}
              loading="eager"
            />
            <span className="doctor-rating">
              <Icon name="star" size="xs" /> {doctor.rating}
            </span>
            <div className="doctor-card-content">
              <p className="doctor-overline">{doctor.specialty}</p>
              <h3>{doctor.name}</h3>
              <p>{doctor.quote}</p>
              <button
                type="button"
                className="doctor-card-cta"
                aria-label={`Request an appointment with ${doctor.name}`}
                onClick={() => openBooking({ doctor: doctor.name })}
              >
                <Icon name="arrow-right" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <p className="demo-note">Illustrative doctor profiles for the website prototype.</p>
    </section>
  );
};
