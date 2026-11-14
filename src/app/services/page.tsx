'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { db, ServiceRecord } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { ScrollAnimationProvider } from '@/components/common/ScrollAnimationProvider';

function ServicesContent() {
  const searchParams = useSearchParams();
  const allServices = db.getServices();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync category from URL param if present (e.g. /services?category=DOCTOR_VISIT)
  useEffect(() => {
    const cat = searchParams.get('category') || searchParams.get('cat');
    if (cat) {
      setSelectedCategory(cat.toUpperCase());
    }
  }, [searchParams]);

  const categories = [
    { id: 'ALL', label: 'All Services' },
    { id: 'DOCTOR_VISIT', label: 'Doctor Consultations' },
    { id: 'NURSING_CARE', label: 'Home Nursing' },
    { id: 'CARETAKER', label: 'Caretakers & Attendants' },
    { id: 'LAB_TESTS', label: 'Diagnostics & Blood Tests' },
    { id: 'REHAB_THERAPY', label: 'Physiotherapy & Rehab' },
    { id: 'CRITICAL_CARE', label: 'Critical Care & ICU' },
  ];

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

  const getCategoryCount = (catId: string) => {
    if (catId === 'ALL') return allServices.length;
    return allServices.filter((s) => s.category === catId).length;
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd]">
      {/* Light, Clean Header */}
      <Header theme="light" />

      {/* Minimal, Sleek Top Hero Section */}
      <div className="border-b border-[#e5ecec] bg-white py-10 sm:py-14 text-center">
        <div className="container max-w-3xl">
          <p className="text-[11px] font-bold tracking-widest text-[#0b5c43] uppercase mb-2 animate-hero-trust">
            CLINICAL CARE DIRECTORY
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#11191b] tracking-tight leading-tight animate-hero-title">
            Hospital-Grade Clinical Care, Delivered to Your Doorstep
          </h1>
          <p className="mx-auto mt-2.5 max-w-xl text-xs sm:text-sm text-[#55696d] leading-relaxed animate-hero-detail">
            Certified physician house visits, registered nurses, compassionate bedside attendants, and diagnostic testing in your home.
          </p>
        </div>
      </div>

      {/* Services Directory */}
      <div className="container py-10 md:py-12">
        {/* Search & Category Filter */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-6 scroll-reveal">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = getCategoryCount(cat.id);
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#064E3B] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-[#F2F8F5]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#edf7f3] text-[#0b5c43]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search services or tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 pl-9 text-xs focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
            />
            <div className="pointer-events-none absolute left-3 top-2.5 text-gray-400">
              <Icon name="search" size="xs" />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <p>
            Showing <strong className="text-[#11191b]">{filteredServices.length}</strong> healthcare service(s)
          </p>
          <p className="text-[#0b5c43] font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Instant confirmation with 4-digit bedside PIN verification</span>
          </p>
        </div>

        {/* Services Grid (Minimum 10 cards per category) */}
        <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 stagger-container">
          {filteredServices.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#e2ebe7] bg-white shadow-xs transition-all duration-300 hover:border-[#b8dcde] hover:shadow-xl hover:-translate-y-1 scroll-reveal-card"
            >
              <div>
                {/* Visual Header */}
                <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#064E3B] backdrop-blur-md border border-white/80 shadow-xs">
                    {service.categoryLabel}
                  </div>
                  <div className="absolute bottom-3.5 right-3.5 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#11191b] shadow-md">
                    From ${service.basePrice}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-[#edf7f3] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#0b5c43]">
                      {service.duration}
                    </span>
                  </div>

                  <h2 className="mt-2 text-base font-extrabold text-[#11191b] group-hover:text-[#0b5c43] transition-colors leading-snug">
                    {service.name}
                  </h2>
                  <p className="mt-1.5 text-xs text-[#5e7171] leading-relaxed line-clamp-2">
                    {service.shortDesc}
                  </p>

                  {/* Clinical Deliverables List */}
                  <div className="mt-4 border-t border-gray-100 pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Key Clinical Deliverables
                    </p>
                    <ul className="space-y-1.5">
                      {service.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-600">
                          <span className="flex-shrink-0 text-[#0b5c43] font-bold mt-0.5">✓</span>
                          <span className="line-clamp-1">{feat}</span>
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
                          className="rounded-md bg-[#f5f9f7] border border-[#e2ebe7] px-2 py-0.5 text-[10px] text-gray-600"
                        >
                          {opt}
                        </span>
                      ))}
                      {service.supportedOptions.length > 2 && (
                        <span className="rounded-md bg-[#f5f9f7] px-1.5 py-0.5 text-[10px] text-gray-400">
                          +{service.supportedOptions.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="p-6 pt-0">
                <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-4">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-semibold text-gray-500 hover:text-[#0b5c43] transition-colors"
                  >
                    Clinical Details
                  </Link>
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
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
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
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
  );
}

export default function ServicesPage() {
  return (
    <ScrollAnimationProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#fcfdfd]" />}>
        <ServicesContent />
      </Suspense>
    </ScrollAnimationProvider>
  );
}
