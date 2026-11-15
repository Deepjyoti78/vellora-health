'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db, ServiceRecord } from '@/lib/db';
import {
  Stethoscope,
  HeartPulse,
  FlaskConical,
  Activity,
  Users,
  Zap,
  Check,
  ArrowRight,
  Search,
  X,
  ShieldCheck,
  Clock,
  Sparkles,
  Layers,
  Heart,
  ChevronRight,
} from 'lucide-react';

interface CategoryCardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  servicesCount: string;
  countNumber: number;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  buttonLabel: string;
  filterCategories: string[];
}

const CATEGORIES_DATA: CategoryCardItem[] = [
  {
    id: 'doctor-visit',
    title: 'Doctor Visit',
    description: 'Consult with licensed doctors at home for checkups, follow-ups, and ongoing care.',
    image: '/assets/doorstep-1.webp',
    servicesCount: '10 Services',
    countNumber: 10,
    icon: Stethoscope,
    href: '/services/doctor-consultations',
    buttonLabel: 'Book Now →',
    filterCategories: ['DOCTOR_VISIT'],
  },
  {
    id: 'nursing-care',
    title: 'Nursing Care',
    description: 'Professional at-home nursing support, from basic care to long-duration needs.',
    image: '/assets/doorstep-2.webp',
    servicesCount: '12 Services',
    countNumber: 12,
    icon: HeartPulse,
    href: '/services/nursing-care',
    buttonLabel: 'Explore Services →',
    filterCategories: ['NURSING_CARE'],
  },
  {
    id: 'physiotherapy',
    title: 'Physiotherapy',
    description: 'Expert physiotherapy at home to restore mobility, strength, and comfort.',
    image: '/assets/physiotherapy-card.webp',
    servicesCount: '10 Services',
    countNumber: 10,
    icon: Activity,
    href: '/services/rehab-critical-care',
    buttonLabel: 'Book Now →',
    filterCategories: ['REHAB_THERAPY'],
  },
  {
    id: 'diagnostics-labs',
    title: 'Home Diagnostics & Labs',
    description: 'Routine and specialized blood tests with safe, sterile doorstep sample collection.',
    image: '/assets/diagnostics.webp',
    servicesCount: '12 Services',
    countNumber: 12,
    icon: FlaskConical,
    href: '/services/diagnostics-labs',
    buttonLabel: 'Book Now →',
    filterCategories: ['LAB_TESTS'],
  },
  {
    id: 'caretakers',
    title: 'Patient Caretakers',
    description: 'Compassionate support, daily living assistance, and bedside companionship for loved ones.',
    image: '/assets/doorstep-3.webp',
    servicesCount: '8 Services',
    countNumber: 8,
    icon: Users,
    href: '/services/rehab-critical-care',
    buttonLabel: 'Book Now →',
    filterCategories: ['CARETAKER'],
  },
  {
    id: 'critical-care',
    title: 'Critical Care at Home',
    description: 'ICU-trained nursing, medical equipment setups, and round-the-clock vital monitoring.',
    image: '/assets/compassionate-hospital-care.webp',
    servicesCount: '6 Services',
    countNumber: 6,
    icon: Zap,
    href: '/services/rehab-critical-care',
    buttonLabel: 'Book Now →',
    filterCategories: ['CRITICAL_CARE'],
  },
];

const POPULAR_CHIPS = [
  { label: 'Doctor Visit', query: 'Doctor Visit', icon: Stethoscope },
  { label: 'Wound Dressing', query: 'Wound Dressing', icon: ShieldCheck },
  { label: 'Full Body Checkup', query: 'Checkup', icon: Heart },
  { label: '12-Hour Nursing', query: '12-Hour', icon: Clock },
  { label: 'Physiotherapy', query: 'Physiotherapy', icon: Activity },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Retrieve full verified dataset from local database
  const allServices = useMemo(() => db.getServices(), []);

  // Live search filtering across real service dataset
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];

    return allServices.filter((service) => {
      const matchName = service.name.toLowerCase().includes(q);
      const matchDesc =
        service.shortDesc.toLowerCase().includes(q) || service.description.toLowerCase().includes(q);
      const matchCategory =
        service.categoryLabel.toLowerCase().includes(q) || service.category.toLowerCase().includes(q);
      const matchFeatures = service.features?.some((f) => f.toLowerCase().includes(q));
      const matchOptions = service.supportedOptions?.some((opt) => opt.toLowerCase().includes(q));

      return matchName || matchDesc || matchCategory || matchFeatures || matchOptions;
    });
  }, [allServices, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#11191B] font-sans antialiased">
      {/* Top Header with active Services pill */}
      <Header theme="light" />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-20">
        {/* HERO SECTION MATCHING REFERENCE IMAGE */}
        <section className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#F0F8F5] via-[#E8F5F0] to-[#E3F2EB] border border-[#D5E8DF] p-6 sm:p-10 lg:p-12 mb-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          {/* Subtle curved background wave for the right image */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[50%] lg:w-[46%] pointer-events-none overflow-hidden hidden md:block">
            <div className="absolute -right-12 -top-12 -bottom-12 w-[120%] bg-gradient-to-l from-white/35 via-white/20 to-transparent rounded-l-[120px]" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
            {/* Left Column: Heading, Search & Popular Tags */}
            <div className="w-full lg:max-w-xl xl:max-w-2xl flex flex-col justify-center">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F4EE] border border-[#C6E6D8] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#065F46] w-fit mb-4 shadow-2xs">
                <Sparkles className="h-3 w-3 stroke-[2.5] text-[#059669]" />
                <span>OUR SERVICES</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#102820] tracking-tight leading-[1.15] mb-3.5">
                Expert Healthcare,<br className="hidden sm:inline" /> Delivered to Your Home
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed max-w-xl mb-6 font-normal">
                Explore doctor consultations, nursing care, diagnostics, and personalized healthcare services designed around your needs.
              </p>

              {/* Search Bar Container */}
              <div className="relative flex items-center w-full max-w-lg rounded-full border border-[#D1DCD6] bg-white p-1.5 pl-5 pr-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] focus-within:border-[#065F46] focus-within:ring-4 focus-within:ring-[#065F46]/10 transition-all">
                <Search className="h-5 w-5 text-slate-400 mr-3 shrink-0 stroke-[2]" />
                <input
                  type="text"
                  role="searchbox"
                  aria-label="Search services, treatments, or care types"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchQuery('');
                  }}
                  placeholder="Search services, treatments, or care types..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#102820] placeholder-slate-400 focus:outline-none font-medium"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mr-2 p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {}}
                  aria-label="Submit search"
                  className="h-10 w-10 rounded-full bg-[#065F46] hover:bg-[#043328] text-white flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer group"
                >
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* Popular Search Chips */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold text-xs mr-0.5">Popular:</span>
                {POPULAR_CHIPS.map((chip) => {
                  const ChipIcon = chip.icon;
                  const isSelected = searchQuery === chip.query;
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => setSearchQuery(isSelected ? '' : chip.query)}
                      className={`rounded-full border px-3 py-1 flex items-center gap-1.5 text-xs font-medium shadow-2xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#065F46] bg-[#065F46] text-white'
                          : 'border-slate-200/90 bg-white/90 hover:bg-white text-slate-700 hover:border-[#065F46] hover:text-[#065F46]'
                      }`}
                    >
                      <ChipIcon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Doctor & Patient Scene Photo matching reference */}
            <div className="w-full lg:w-[44%] relative flex items-center justify-center lg:justify-end">
              <div className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] shadow-sm max-h-[300px] sm:max-h-[340px] w-full">
                <img
                  src="/assets/services-hero-doctor.webp"
                  alt="Doctor and patient consultation at home"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Section: Search Results vs. Care Categories Grid */}
        {isSearching ? (
          <section className="mt-8 animate-in fade-in duration-200">
            {/* Search Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EBE7] pb-3.5 mb-6">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg sm:text-xl font-bold text-[#102820]">
                  Matching Services
                </h2>
                <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-xs font-bold text-[#065F46]">
                  {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                <span>Clear search results</span>
              </button>
            </div>

            {/* Empty State when no services match */}
            {filteredServices.length === 0 ? (
              <div className="py-12 px-4 text-center bg-white border border-[#E2EBE7] rounded-[22px] max-w-xl mx-auto shadow-xs">
                <div className="h-12 w-12 rounded-full bg-[#ECFDF5] text-[#065F46] flex items-center justify-center mx-auto mb-3">
                  <Search className="h-5 w-5 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#102820]">
                  No services matching &ldquo;{searchQuery}&rdquo;
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Try searching for general procedures such as &ldquo;Doctor visit&rdquo;, &ldquo;Wound dressing&rdquo;, &ldquo;Blood test&rdquo;, or &ldquo;Elderly attendant&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-xs"
                >
                  <span>Reset Search & View Categories</span>
                </button>
              </div>
            ) : (
              /* Grid of Matching Individual Services */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex flex-col justify-between rounded-[20px] border border-[#E2EBE7] bg-white p-5 shadow-2xs hover:shadow-md hover:border-[#065F46]/30 transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-[#065F46] bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 rounded-full">
                          {service.categoryLabel}
                        </span>
                        <span className="text-xs font-extrabold text-[#102820]">
                          ${service.basePrice}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#102820] leading-snug">
                        {service.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {service.shortDesc || service.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {service.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                          Doorstep Care
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/book/service/${service.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#064E3B] py-2 px-3 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-2xs"
                      >
                        <span>Book Service</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* DEFAULT VIEW: EXPLORE CARE CATEGORIES MATCHING REFERENCE IMAGE */
          <section className="animate-in fade-in duration-200">
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl sm:text-[30px] font-extrabold text-[#102820] tracking-tight">
                  Explore Care Categories
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                  Find the right healthcare services for you and your family.
                </p>
              </div>

              {/* Total Services Count Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F4EE] border border-[#C6E6D8] px-3.5 py-1.5 text-xs font-bold text-[#065F46] shadow-2xs w-fit">
                <Layers className="h-3.5 w-3.5 text-[#065F46]" />
                <span>{allServices.length} Total Services Available</span>
              </div>
            </div>

            {/* 3-Column Category Card Grid Matching Reference Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES_DATA.map((cat) => {
                const CategoryIcon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-[22px] border border-[#E2EBE7] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300"
                  >
                    {/* Top Image with Badge */}
                    <Link href={cat.href} className="relative h-[165px] sm:h-[180px] w-full overflow-hidden bg-slate-100 block">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        loading="eager"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                      {/* Floating Service Count Badge */}
                      <div className="absolute top-3 right-3 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-slate-800 shadow-2xs border border-slate-100">
                        {cat.servicesCount}
                      </div>
                    </Link>

                    {/* Lower Bar with Mint Icon Square, Title/Description & Emerald Pill Button */}
                    <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Mint Icon Box */}
                        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-[#E6F4EE] flex items-center justify-center text-[#065F46] shrink-0 border border-[#D1EADC]">
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        {/* Text Content */}
                        <div className="min-w-0">
                          <Link href={cat.href}>
                            <h3 className="font-bold text-[15px] sm:text-[16px] text-[#102820] leading-snug group-hover:text-[#065F46] transition-colors truncate">
                              {cat.title}
                            </h3>
                          </Link>
                          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Action Pill Button */}
                      <Link
                        href={cat.href}
                        className="inline-flex items-center gap-1 rounded-full bg-[#064E3B] hover:bg-[#043328] text-white px-3.5 py-2 text-xs font-bold whitespace-nowrap shadow-2xs group-hover:bg-[#059669] transition-all shrink-0"
                      >
                        <span>{cat.buttonLabel}</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle Reassurance Trust Banner */}
            <div className="mt-12 rounded-[22px] border border-[#E2EBE7] bg-white p-5 sm:p-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="flex items-start gap-3 pt-2 md:pt-0">
                  <div className="rounded-xl bg-[#ECFDF5] p-2 text-[#065F46] shrink-0">
                    <ShieldCheck className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#102820]">100% Verified Clinicians</h4>
                    <p className="mt-0.5 text-xs text-slate-500">Board-certified doctors, RNs, and certified phlebotomists.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 md:pt-0 md:pl-5">
                  <div className="rounded-xl bg-[#ECFDF5] p-2 text-[#065F46] shrink-0">
                    <Check className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#102820]">Bedside Safety PIN</h4>
                    <p className="mt-0.5 text-xs text-slate-500">4-digit identity code verification before clinician enters your home.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 md:pt-0 md:pl-5">
                  <div className="rounded-xl bg-[#ECFDF5] p-2 text-[#065F46] shrink-0">
                    <Zap className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#102820]">Upfront Transparent Rates</h4>
                    <p className="mt-0.5 text-xs text-slate-500">Clear pricing with zero hidden facility or equipment surcharge.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
