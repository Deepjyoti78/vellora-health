'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db, ServiceRecord } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { useBooking } from '@/context/BookingContext';

export default function ServicesPage() {
  const allServices = db.getServices();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { openBooking } = useBooking();

  const filteredServices = allServices.filter((service) => {
    const matchesCat =
      selectedCategory === 'ALL' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'ALL', label: 'All Healthcare Services' },
    { id: 'DOCTOR_VISIT', label: 'Doctor Consultations' },
    { id: 'NURSING_CARE', label: 'Home Nursing' },
    { id: 'CARETAKER', label: 'Caretakers & Attendants' },
    { id: 'LAB_TESTS', label: 'Diagnostics & Blood Tests' },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <div className="bg-[#11191b] text-white">
        <Header />
        <div className="container py-16 text-center">
          <p className="eyebrow text-teal-300">COMPREHENSIVE CARE AT HOME</p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Healthcare Designed Around Your Life
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-300">
            From licensed physician visits and sterile nursing to compassionate bedside caretakers
            and doorstep blood collections — certified care delivered directly to you.
          </p>
        </div>
      </div>

      <div className="container py-12">
        {/* Search & Category Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  selectedCategory === cat.id
                    ? 'bg-[#11191b] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
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

        {/* Services Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
            >
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                <div className="absolute left-4 top-4 rounded-full bg-[#11191b]/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                  {service.categoryLabel}
                </div>
                <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-extrabold text-teal-800 shadow-md">
                  Starts at ${service.basePrice}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">
                  {service.name}
                </h2>
                <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                  {service.description}
                </p>

                <div className="mt-4 border-t border-gray-100 pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    What&apos;s Included:
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-gray-700">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-teal-600">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900"
                  >
                    View Service Details →
                  </Link>
                  <Link
                    href={`/patient/book/service?serviceId=${service.id}`}
                    className="button button-dark button-sm"
                  >
                    Book Now <Icon name="arrow-right" size="xs" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
