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
    <section id="specialists" className="section section-doctors py-14 sm:py-18" aria-labelledby="specialistsTitle">
      <div className="container">
        <div className="section-heading-row scroll-reveal mb-10">
          <div>
            <p className="eyebrow text-[#065F46] font-bold tracking-wider uppercase">LICENSED HOME CARE CLINICIANS</p>
            <h2 id="specialistsTitle" className="font-heading text-3xl font-extrabold text-[#11191B] md:text-5xl tracking-tight leading-tight">
              Meet Our Medical<br />Specialists &amp; Physicians
            </h2>
            <p className="section-lead text-[#55696D]">
              Board-certified doctors dedicated to compassionate, unhurried examinations right at your bedside.
            </p>
          </div>
          <div className="hidden md:flex">
            <SliderArrows
              trackRef={trackRef}
              prevLabel="Previous doctor"
              nextLabel="Next doctor"
            />
          </div>
        </div>

        <div
          className="doctor-track scroll-track stagger-container"
          id="doctorSlider"
          ref={trackRef}
          aria-label="Doctor profiles"
        >
          {DOCTORS_DATA.map((doctor) => (
            <article
              key={doctor.id}
              role="button"
              tabIndex={0}
              onClick={() => openBooking({ doctor: doctor.name })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openBooking({ doctor: doctor.name });
                }
              }}
              aria-label={`Book appointment with ${doctor.name}`}
              className="doctor-card scroll-reveal-card border border-[#E5EAE7] hover:border-[#10B981]/60 transition-all shadow-md hover:shadow-xl cursor-pointer group"
            >
              <img
                src={doctor.image}
                alt={doctor.alt}
                loading="eager"
              />
              <span className="doctor-rating bg-black/70 backdrop-blur-md text-amber-300 border border-white/20">
                <Icon name="star" size="xs" /> {doctor.rating}
              </span>
              <div className="doctor-card-content">
                <p className="doctor-overline text-emerald-400">{doctor.specialty}</p>
                <h3 className="text-white font-bold">{doctor.name}</h3>
                <p className="text-slate-300">{doctor.quote}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="demo-note text-[#687476] mt-6">Illustrative doctor profiles for the website prototype.</p>
      </div>
    </section>
  );
};
