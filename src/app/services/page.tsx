'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db, ServiceRecord } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { ScrollAnimationProvider } from '@/components/common/ScrollAnimationProvider';

export default function ServicesPage() {
  const allServices = db.getServices();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServices = allServices.filter((service) => {
    const matchesCat =
      selectedCategory === 'ALL' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.supportedOptions.some((opt) =>
        opt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'ALL', label: 'All Services' },
    { id: 'DOCTOR_VISIT', label: 'Doctor Consultations' },
    { id: 'NURSING_CARE', label: 'Home Nursing' },
    { id: 'CARETAKER', label: 'Caretakers & Attendants' },
    { id: 'LAB_TESTS', label: 'Diagnostics & Blood Tests' },
    { id: 'REHAB_THERAPY', label: 'Physiotherapy & Rehab' },
    { id: 'CRITICAL_CARE', label: 'Critical Care & ICU' },
  ];

  return (
    <ScrollAnimationProvider>
      <div className="min-h-screen bg-[#fcfdfd]">
        {/* Light, Clean Header */}
        <Header theme="light" />

        {/* Minimal, Sleek Top Hero Section */}
        <div className="border-b border-[#e5ecec] bg-white py-10 sm:py-12 text-center">
          <div className="container max-w-3xl">
            <p className="text-[11px] font-bold tracking-widest text-[#116b70] uppercase mb-2 animate-hero-trust">
              SERVICES DIRECTORY
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11191b] tracking-tight leading-tight animate-hero-title">
              Complete Hospital-Grade Care, Delivered to Your Doorstep
            </h1>
            <p className="mx-auto mt-2.5 max-w-xl text-xs sm:text-sm text-[#55696d] leading-relaxed animate-hero-detail">
              Licensed doctor visits, registered nurses, compassionate caretakers, and diagnostic lab draws right at your home.
            </p>
          </div>
        </div>

        {/* Services Directory */}
        <div className="container py-10 md:py-12">
          {/* Search & Category Filter */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 scroll-reveal">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'bg-[#11191b] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search services or tests..."
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
            <p>Showing {filteredServices.length} healthcare service(s)</p>
            <p className="text-emerald-700 font-medium">● Instant confirmation with bedside PIN verification</p>
          </div>

          {/* Services Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-container">
            {filteredServices.map((service) => (
              <article
                key={service.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 scroll-reveal-card"
              >
                {/* Visual Header */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute left-4 top-4 rounded-full bg-[#11191b]/85 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/10">
                    {service.categoryLabel}
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-extrabold text-teal-900 shadow-md">
                    From ${service.basePrice}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition">
                    {service.name}
                  </h2>
                  <p className="mt-1 text-[11px] font-medium text-teal-700">
                    {service.duration}
                  </p>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                    {service.shortDesc}
                  </p>

                  {/* Clinical Deliverables List */}
                  <div className="mt-4 border-t border-gray-100 pt-3 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Key Deliverables
                    </p>
                    <ul className="space-y-1.5">
                      {service.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600">
                          <span className="flex-shrink-0 text-teal-700 font-bold mt-0.5">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sub-options tags */}
                  {service.supportedOptions && service.supportedOptions.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3">
                      {service.supportedOptions.slice(0, 2).map((opt, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-gray-50 border border-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                        >
                          {opt}
                        </span>
                      ))}
                      {service.supportedOptions.length > 2 && (
                        <span className="rounded-md bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-400">
                          +{service.supportedOptions.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <Link
                      href={`/services/${service.slug}`}
                      className="text-xs font-semibold text-gray-600 hover:text-teal-700 transition"
                    >
                      Service Details
                    </Link>
                    <Link
                      href={`/book?service=${service.slug}`}
                      className="button button-dark button-sm text-xs"
                    >
                      <span>Book Service</span>
                      <Icon name="arrow-right" size="xs" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Assurance Banner */}
          <div className="mt-14 rounded-3xl bg-[#11191b] p-8 text-white md:p-12 relative overflow-hidden scroll-reveal-scale">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 mb-3">
                Patient Protection Guarantee
              </span>
              <h2 className="text-2xl font-bold md:text-3xl text-white">
                Every Clinician is Council-Verified &amp; Insured
              </h2>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-gray-300">
                All doctors, nurses, phlebotomists, and caretakers undergo mandatory license verification, police background screening, and clinical skill vetting before visiting patient homes.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/book" className="button button-white button-sm">
                  Book an Appointment <Icon name="arrow-right" size="xs" />
                </Link>
                <Link href="/contact" className="button button-outline button-sm">
                  Speak to Care Coordinator
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ScrollAnimationProvider>
  );
}
