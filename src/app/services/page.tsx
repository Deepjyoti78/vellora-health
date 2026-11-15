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
  Check,
  ArrowRight,
  Search,
  X,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface CategoryConfig {
  slug: string;
  title: string;
  description: string;
  image: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlights: string[];
  filterCategories: string[];
}

const CATEGORIES_CONFIG: CategoryConfig[] = [
  {
    slug: 'doctor-consultations',
    title: 'Doctor Consultations',
    description:
      'Comprehensive physician checkups, acute illness diagnosis, and chronic condition management delivered at your bedside.',
    image: '/assets/doorstep-1.webp',
    href: '/services/doctor-consultations',
    icon: Stethoscope,
    highlights: ['Multi-specialty home visits', 'Digital prescriptions & follow-up care'],
    filterCategories: ['DOCTOR_VISIT'],
  },
  {
    slug: 'nursing-care',
    title: 'Nursing & Care Support',
    description:
      'Registered clinical nurses providing sterile dressings, IV fluid infusions, catheter care, and post-operative recovery.',
    image: '/assets/doorstep-2.webp',
    href: '/services/nursing-care',
    icon: HeartPulse,
    highlights: ['Wound dressing & IV infusions', 'Catheter care & 12h/24h nursing shifts'],
    filterCategories: ['NURSING_CARE'],
  },
  {
    slug: 'diagnostics-labs',
    title: 'Diagnostics & Lab Services',
    description:
      'Certified phlebotomists collecting routine and specialized diagnostic samples safely and comfortably at your home.',
    image: '/assets/diagnostics.webp',
    href: '/services/diagnostics-labs',
    icon: FlaskConical,
    highlights: ['Cold-chain blood sample collection', 'Accredited digital reports in 12–24h'],
    filterCategories: ['LAB_TESTS'],
  },
  {
    slug: 'rehab-critical-care',
    title: 'Rehab & Critical Care',
    description:
      'Trained patient attendants and licensed physical therapists supporting rehabilitation, elderly mobility, and step-down care.',
    image: '/assets/doorstep-4.webp',
    href: '/services/rehab-critical-care',
    icon: Activity,
    highlights: ['Mobility assistance & physical therapy', 'Bedridden hygiene & respite care'],
    filterCategories: ['CARETAKER', 'REHAB_THERAPY', 'CRITICAL_CARE'],
  },
];

const POPULAR_SEARCH_TERMS = [
  'Doctor Visit',
  'Wound Dressing',
  'Full Body Checkup',
  '12-Hour Nursing',
  'Physiotherapy',
  'Elderly Attendant',
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Retrieve full verified dataset from local database
  const allServices = useMemo(() => db.getServices(), []);

  // Compute accurate dynamic service count for each category
  const categoriesWithCounts = useMemo(() => {
    return CATEGORIES_CONFIG.map((cat) => {
      const count = allServices.filter((s) => cat.filterCategories.includes(s.category)).length;
      return {
        ...cat,
        count,
      };
    });
  }, [allServices]);

  // Live search filtering across real service dataset
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];

    return allServices.filter((service) => {
      const matchName = service.name.toLowerCase().includes(q);
      const matchDesc = service.shortDesc.toLowerCase().includes(q) || service.description.toLowerCase().includes(q);
      const matchCategory = service.categoryLabel.toLowerCase().includes(q) || service.category.toLowerCase().includes(q);
      const matchFeatures = service.features?.some((f) => f.toLowerCase().includes(q));
      const matchOptions = service.supportedOptions?.some((opt) => opt.toLowerCase().includes(q));

      return matchName || matchDesc || matchCategory || matchFeatures || matchOptions;
    });
  }, [allServices, searchQuery]);

  // Matching categories when searching
  const matchingCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return categoriesWithCounts.filter((cat) => {
      return (
        cat.title.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.highlights.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [categoriesWithCounts, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#11191B] font-sans antialiased">
      {/* Top Header with active Services pill */}
      <Header theme="light" />

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-6 pb-16">
        {/* Hero Section - Clean, restrained, and purposeful */}
        <section className="text-center py-6 sm:py-9">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 text-[11px] font-bold tracking-[0.16em] uppercase text-[#065F46] shadow-2xs mb-3">
            <Sparkles className="h-3 w-3 stroke-[2.5]" />
            <span>Our Services</span>
          </div>

          <h1 className="font-heading text-[28px] sm:text-[36px] lg:text-[44px] font-extrabold text-[#102820] tracking-tight leading-[1.18] max-w-3xl mx-auto">
            Expert Healthcare, Delivered to Your Home
          </h1>

          <p className="mt-2.5 max-w-2xl mx-auto text-xs sm:text-[15px] text-[#5E7171] leading-relaxed">
            Explore doctor consultations, nursing care, diagnostics, and personalized healthcare services designed around your needs.
          </p>

          {/* Functional Search Field */}
          <div className="mt-6 max-w-[580px] w-full mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-slate-400 stroke-[2] pointer-events-none" />
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
                className="w-full rounded-full border border-[#D1DCD6] bg-white py-3 pl-11 pr-11 text-xs sm:text-sm text-gray-900 placeholder:text-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.03)] focus:border-[#065F46] focus:outline-none focus:ring-2 focus:ring-[#065F46]/10 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 rounded-full p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Quick Keyword Suggestions */}
            {!isSearching && (
              <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-[#5E7171]">
                <span className="font-medium text-slate-400">Popular:</span>
                {POPULAR_SEARCH_TERMS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setSearchQuery(term)}
                    className="rounded-full bg-white border border-[#E2EBE7] px-2.5 py-0.5 text-slate-600 hover:text-[#065F46] hover:border-[#065F46]/30 transition-colors shadow-2xs"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Content: Search Results vs. Care Categories Grid */}
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
              <div className="space-y-8">
                {/* Grid of Matching Services */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="group flex flex-col justify-between rounded-[20px] border border-[#E2EBE7] bg-white p-5 shadow-xs hover:border-[#116b70]/40 hover:shadow-md transition-all duration-200"
                    >
                      <div>
                        {/* Category Badge & Starting Fee */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 font-bold text-[#065F46] text-[11px]">
                            {service.categoryLabel}
                          </span>
                          <span className="font-extrabold text-[#102820]">
                            ${service.basePrice}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="mt-2.5 font-heading text-[15px] font-bold text-[#102820] group-hover:text-[#065F46] transition-colors leading-snug">
                          {service.name}
                        </h3>

                        {/* Short Description */}
                        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {service.shortDesc}
                        </p>

                        {/* Feature Badges */}
                        {service.features && service.features.length > 0 && (
                          <div className="mt-3.5 space-y-1.5 border-t border-[#F2F6F4] pt-3 text-[11px] text-slate-600">
                            {service.features.slice(0, 2).map((feat, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <Check className="h-3 w-3 text-[#065F46] stroke-[2.5] shrink-0" />
                                <span className="truncate">{feat}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Action Row */}
                      <div className="mt-4 pt-3 border-t border-[#F2F6F4] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/services/${service.slug}`}
                            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            Details
                          </Link>
                          <Link
                            href={`/book/service/${service.slug}`}
                            className="inline-flex items-center gap-1 rounded-full bg-[#064E3B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-2xs"
                          >
                            <span>Book</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Also highlight matching parent categories if applicable */}
                {matchingCategories.length > 0 && (
                  <div className="pt-4 border-t border-[#E2EBE7]">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                      Matching Care Categories
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {matchingCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={cat.href}
                          className="flex items-center justify-between rounded-xl border border-[#E2EBE7] bg-white p-3.5 shadow-2xs hover:border-[#065F46]/40 hover:bg-[#F9FCFA] transition-all"
                        >
                          <div>
                            <p className="text-xs font-bold text-[#102820]">{cat.title}</p>
                            <p className="text-[11px] text-slate-500">{cat.count} Services</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        ) : (
          <section className="mt-8">
            {/* Category Section Header */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-[#E2EBE7] pb-4">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight">
                  Explore Care Categories
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-[#5E7171]">
                  Find the right healthcare services for you and your family.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#065F46] bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 rounded-full w-fit">
                {allServices.length} Total Services Available
              </span>
            </div>

            {/* 2-Column Responsive Category Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              {categoriesWithCounts.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={cat.href}
                    className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#E2EBE7] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:border-[#116b70]/35 transition-all duration-200"
                    aria-label={`View ${cat.title} services`}
                  >
                    {/* Compact Image Banner Area (200-230px on desktop) */}
                    <div className="relative h-44 sm:h-[215px] w-full overflow-hidden bg-slate-100">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        loading="eager"
                        className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                      {/* Meaningful Service Count Badge */}
                      <div className="absolute right-3.5 top-3.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#102820] border border-white/80 shadow-xs">
                        {cat.count} Services
                      </div>
                    </div>

                    {/* Lower Card Content */}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        {/* Title, Icon, & CTA */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                              <IconComponent className="h-5 w-5 stroke-[2]" />
                            </div>
                            <h3 className="font-heading text-lg sm:text-[19px] font-bold text-[#102820] group-hover:text-[#065F46] transition-colors leading-snug">
                              {cat.title}
                            </h3>
                          </div>

                          {/* Compact View Services CTA */}
                          <div className="shrink-0 hidden sm:block">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-3.5 py-1.5 text-xs font-bold text-white transition-colors group-hover:bg-[#065F46] shadow-2xs">
                              <span>View Services</span>
                              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </span>
                          </div>
                        </div>

                        {/* Concise Category Description */}
                        <p className="mt-2.5 text-[13px] sm:text-sm text-slate-600 leading-relaxed">
                          {cat.description}
                        </p>

                        {/* Clean Two-Item Service Highlights */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-[#F2F6F4] pt-3 text-xs text-slate-700">
                          {cat.highlights.map((feat, i) => (
                            <div key={i} className="flex items-center gap-1.5 font-medium">
                              <Check className="h-3.5 w-3.5 text-[#065F46] stroke-[2.5] shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mobile View Services Button */}
                      <div className="mt-4 pt-2 sm:hidden border-t border-gray-100">
                        <div className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[#064E3B] py-2 px-3 text-xs font-bold text-white shadow-2xs">
                          <span>View Services</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Subtle Reassurance Trust Banner */}
            <div className="mt-10 rounded-[20px] border border-[#E2EBE7] bg-white p-5 sm:p-6 shadow-xs">
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
