'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { useBooking } from '@/context/BookingContext';

export default function DoctorsDirectoryPage() {
  const doctors = db.getUsersByRole('DOCTOR');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const { openBooking } = useBooking();

  const specialties = ['ALL', 'Internal Medicine & Geriatrics', 'Pediatrics & Family Medicine'];

  const filteredDoctors = doctors.filter((doc) => {
    return selectedSpecialty === 'ALL' || doc.specialty?.includes(selectedSpecialty);
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#11191b] text-white">
        <Header />
        <div className="container py-14 text-center">
          <p className="eyebrow text-teal-300">CERTIFIED PHYSICIANS &amp; EXPERTS</p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Meet Our Medical Specialists
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-300">
            Every Vellora physician is board-certified, hospital-affiliated, and dedicated to compassionate, personalized care at your bedside.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div className="flex gap-2">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  selectedSpecialty === spec
                    ? 'bg-[#11191b] text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {spec === 'ALL' ? 'All Specialties' : spec}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Showing {filteredDoctors.length} available physician(s)
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doc) => (
            <article
              key={doc.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  className="h-20 w-20 rounded-2xl object-cover border border-gray-100 shadow-sm"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Verified MD
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      ★ {doc.rating} ({doc.reviewsCount})
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-base font-bold text-gray-900">{doc.name}</h2>
                  <p className="text-xs font-medium text-teal-700">{doc.specialty}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500">{doc.experienceYears} Years Clinical Exp.</p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Qualifications:</p>
                <p className="text-xs text-gray-700 font-medium">{doc.qualification}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-2">{doc.bio}</p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <div>
                  <span className="text-[11px] text-gray-400">Home Visit (Demo)</span>
                  <p className="text-sm font-extrabold text-gray-900">${doc.hourlyRate} / ₹1,499</p>
                </div>
                <button
                  type="button"
                  onClick={() => openBooking({ doctor: doc.name, specialty: doc.specialty })}
                  className="button button-dark button-sm"
                >
                  Request Visit <Icon name="arrow-right" size="xs" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">
          *Demonstration physician directory and rate cards for prototype evaluation.
        </p>
      </div>

      <Footer />
    </div>
  );
}
