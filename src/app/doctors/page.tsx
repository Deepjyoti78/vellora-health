'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { ScrollAnimationProvider } from '@/components/common/ScrollAnimationProvider';

export default function DoctorsDirectoryPage() {
  const doctors = db.getUsersByRole('DOCTOR');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const specialties = [
    'ALL',
    'Internal Medicine & Geriatrics',
    'Pediatrics & Family Medicine',
    'Cardiology & Chronic Disease Management',
    'Post-Operative Rehabilitation & Orthopedics',
    'General Practice & Acute Illness',
  ];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSpec =
      selectedSpecialty === 'ALL' ||
      doc.specialty?.toLowerCase().includes(selectedSpecialty.toLowerCase());
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualification?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpec && matchesSearch;
  });

  return (
    <ScrollAnimationProvider>
      <div className="min-h-screen bg-[#fcfdfd]">
        {/* Light, Clean Header */}
        <Header theme="light" />

        {/* Minimal, Sleek Top Hero Section */}
        <div className="border-b border-[#e5ecec] bg-white py-10 sm:py-12 text-center">
          <div className="container max-w-3xl">
            <p className="text-[11px] font-bold tracking-widest text-[#116b70] uppercase mb-2 animate-hero-trust">
              MEDICAL SPECIALISTS
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11191b] tracking-tight leading-tight animate-hero-title">
              Meet Our Visiting Medical Specialists &amp; Physicians
            </h1>
            <p className="mx-auto mt-2.5 max-w-xl text-xs sm:text-sm text-[#55696d] leading-relaxed animate-hero-detail">
              Board-certified, council-registered doctors dedicated to compassionate, unhurried examinations right at your bedside.
            </p>
          </div>
        </div>

        {/* Directory Content */}
        <div className="container py-10 md:py-12">
          {/* Search & Filter Bar */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 scroll-reveal">
            <div className="flex flex-wrap gap-2">
              {specialties.map((spec) => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    selectedSpecialty === spec
                      ? 'bg-[#11191b] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {spec === 'ALL' ? 'All Specialists' : spec}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search physician or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 pl-9 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <div className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
                <Icon name="search" size="xs" />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <p>Showing {filteredDoctors.length} verified physician(s)</p>
            <p className="text-emerald-700 font-medium">● Same-day home appointments available</p>
          </div>

          {/* Doctors Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-container">
            {filteredDoctors.map((doc) => (
              <article
                key={doc.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 scroll-reveal-card"
              >
                {/* Doctor Header */}
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    {doc.isOnline && (
                      <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" title="Online for On-Demand Dispatch" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-100">
                        Verified MD
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                        ★ {doc.rating} ({doc.reviewsCount || 100}+)
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-base font-bold text-gray-900 group-hover:text-teal-700 transition truncate">
                      {doc.name}
                    </h2>
                    <p className="text-xs font-semibold text-teal-700 leading-snug line-clamp-1">
                      {doc.specialty}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500">
                      {doc.experienceYears} Years Clinical Exp.
                    </p>
                  </div>
                </div>

                {/* Qualification & Bio */}
                <div className="mt-4 border-t border-gray-100 pt-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Accredited Degree
                    </p>
                    <p className="text-xs font-medium text-gray-800">
                      {doc.qualification}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-3">
                      {doc.bio}
                    </p>
                  </div>

                  {/* Pricing & Booking Action */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-medium">Home Bedside Exam</span>
                      <p className="text-sm font-extrabold text-gray-900">
                        ${doc.hourlyRate} <span className="text-[11px] font-normal text-gray-500">/ visit</span>
                      </p>
                    </div>
                    <Link
                      href={`/book?doctor=${encodeURIComponent(doc.name)}&service=home-doctor-visit`}
                      className="button button-dark button-sm text-xs"
                    >
                      <span>Book Visit</span>
                      <Icon name="arrow-right" size="xs" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Reassurance Banner */}
          <div className="mt-14 rounded-3xl bg-teal-50 border border-teal-100 p-8 text-teal-900 md:p-10 scroll-reveal">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Doctor Visit Guarantee
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-teal-950 mt-1">
                  Unhurried Consultations with Complete Digital Prescriptions
                </h3>
                <p className="mt-2 text-xs md:text-sm text-teal-800 leading-relaxed">
                  Every home visit includes a 45–60 minute full clinical review, vitals recording, instant verified e-prescription, and 7-day complimentary telephonic follow-up.
                </p>
              </div>
              <Link href="/book" className="button button-dark whitespace-nowrap">
                Schedule a Physician Visit <Icon name="arrow-right" size="xs" />
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ScrollAnimationProvider>
  );
}
