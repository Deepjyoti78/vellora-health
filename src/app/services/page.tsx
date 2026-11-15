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
  User,
  Pill,
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
    image: '/assets/chatgpt-card-1.webp',
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
    image: '/assets/chatgpt-card-5.webp',
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
    image: '/assets/chatgpt-card-6.webp',
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
    image: '/assets/chatgpt-card-7.webp',
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
    image: '/assets/chatgpt-card-10.webp',
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
    image: '/assets/chatgpt-card-2.webp',
    servicesCount: '6 Services',
    countNumber: 6,
    icon: Zap,
    href: '/services/rehab-critical-care',
    buttonLabel: 'Book Now →',
    filterCategories: ['CRITICAL_CARE'],
  },
];

const POPULAR_SERVICES = [
  { label: 'Doctor Visit', icon: User, query: 'Doctor Visit' },
  { label: 'Wound Dressing', icon: Pill, query: 'Wound Dressing' },
  { label: '12-Hour Nursing', icon: Clock, query: '12-Hour' },
  { label: 'Physiotherapy', icon: Activity, query: 'Physiotherapy' },
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
    <div className="min-h-screen bg-[#FAFCFB] text-[#11191B] font-sans antialiased">
      {/* Top Header with active Services pill */}
      <Header theme="light" />

      {/* 2-COLUMN HERO SECTION WITH REDUCED HEIGHT & HEALTHCARE ILLUSTRATION */}
      <section className="relative w-full overflow-hidden border-b border-[#E8F0EC] bg-white">
        {/* Soft background ambient glow */}
        <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-[#ECFDF5] blur-3xl opacity-60 pointer-events-none" />

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-7 lg:pt-8 pb-7 sm:pb-8 lg:pb-9">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (col-span-7): Eyebrow, Heading, Subtitle & Search */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF7F2] border border-[#CBE9DC] px-3.5 py-1 text-[11px] font-bold tracking-[0.14em] uppercase text-[#065F46] w-fit mb-2.5 shadow-2xs animate-fade-in-up animate-delay-1">
                <Sparkles className="h-3 w-3 stroke-[2.5] text-[#059669]" />
                <span>OUR SERVICES</span>
              </div>

              {/* Main Heading with curved mint accent line under Home */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#102820] tracking-tight leading-[1.14] mb-5 sm:mb-6 animate-fade-in-up animate-delay-2">
                Expert Healthcare,<br className="hidden sm:inline" /> Delivered to Your{' '}
                <span className="relative inline-block">
                  Home
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-2.5 text-[#34D399]/70 pointer-events-none"
                    viewBox="0 0 100 20"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 14 C 30 18, 70 18, 97 10"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Search Bar Container with Enhanced Floating Shadow */}
              <div className="relative flex items-center w-full max-w-[580px] h-[52px] sm:h-[56px] rounded-full border border-slate-200/90 bg-white p-1.5 pl-4 sm:pl-5 pr-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:shadow-[0_16px_40px_rgba(6,78,59,0.11)] focus-within:shadow-[0_16px_40px_rgba(6,78,59,0.12)] focus-within:border-[#065F46] focus-within:ring-4 focus-within:ring-[#065F46]/10 transition-all animate-fade-in-up animate-delay-4">
                <Search className="h-5 w-5 text-slate-400 mr-2.5 shrink-0 stroke-[2]" />
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
                    className="mr-2 p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Subtle vertical separator before button */}
                <div className="h-6 w-px bg-slate-200 mx-1.5 shrink-0 hidden sm:block" />

                <button
                  type="button"
                  aria-label="Submit search"
                  className="h-10 w-11 sm:w-12 rounded-full bg-[#065F46] hover:bg-[#043328] text-white flex items-center justify-center shrink-0 shadow-sm transition-all cursor-pointer group"
                >
                  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              {/* Popular Quick-Filter Chips */}
              <div className="mt-3.5 flex flex-wrap items-center gap-2 sm:gap-2.5 animate-fade-in-up animate-delay-4">
                <span className="text-xs font-semibold text-slate-500 mr-1 select-none">
                  Popular:
                </span>
                {POPULAR_SERVICES.map((item) => {
                  const IconComp = item.icon;
                  const isActive = searchQuery.toLowerCase() === item.query.toLowerCase();
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        if (isActive) {
                          setSearchQuery('');
                        } else {
                          setSearchQuery(item.query);
                        }
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 shadow-2xs cursor-pointer ${
                        isActive
                          ? 'bg-[#E6F8F0] border-2 border-[#065F46] text-[#065F46] shadow-xs'
                          : 'bg-white border border-[#E2EBE7] text-slate-700 hover:border-[#065F46]/40 hover:bg-[#F2F8F5] hover:text-[#064E3B]'
                      }`}
                    >
                      <IconComp className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column (col-span-5): Unboxed Healthcare Illustration & Surrounding Badges */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end animate-card-slide-right animate-delay-2">
              <div className="relative w-full max-w-[500px] flex items-center justify-center">
                {/* Multi-layered ambient mint glow in background */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#ECFDF5] via-[#D1FAE5]/50 to-transparent blur-3xl opacity-80 pointer-events-none" />
                <div className="absolute -top-10 -right-8 h-48 w-48 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

                {/* Subtle Decorative Floating Medical Crosses */}
                <div className="absolute -top-4 left-10 text-emerald-300/60 font-black text-2xl select-none pointer-events-none animate-subtle-float">
                  ✦
                </div>
                <div className="absolute bottom-12 -left-2 text-teal-400/50 font-black text-xl select-none pointer-events-none animate-subtle-float-reverse">
                  +
                </div>
                <div className="absolute top-1/3 -right-3 text-emerald-400/40 font-black text-2xl select-none pointer-events-none animate-subtle-float">
                  +
                </div>

                {/* Floating Badge 1 (Top-Left): Board-Certified MDs */}
                <div className="absolute -top-3 -left-3 sm:-left-6 z-20 flex items-center gap-2.5 rounded-2xl border border-[#D1FAE5] bg-white/95 px-3.5 py-2 shadow-[0_8px_24px_rgba(6,95,70,0.08)] backdrop-blur-xs animate-subtle-float">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46]">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#15212B]">Board-Certified MDs</span>
                    <span className="block text-[10px] text-slate-500 font-medium">100% Verified Clinicians</span>
                  </div>
                </div>

                {/* Floating Badge 2 (Top-Right): 24/7 Clinical Care */}
                <div className="absolute top-2 right-1 sm:-right-2 z-20 hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#D1FAE5] bg-white/95 px-3 py-1 text-[11px] font-bold text-[#065F46] shadow-[0_4px_16px_rgba(6,95,70,0.06)] backdrop-blur-xs animate-subtle-float-reverse">
                  <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>24/7 Home Care</span>
                </div>

                {/* Main Illustration Floating Seamlessly in the Background (No Box, No Card) */}
                <div className="relative z-10 w-full flex items-center justify-center">
                  <img
                    src="/assets/services-hero-illustration-transparent.png"
                    alt="In-Home Doctor Consultation and Healthcare Illustration"
                    className="w-full h-auto max-h-[320px] sm:max-h-[350px] object-contain drop-shadow-[0_12px_28px_rgba(6,95,70,0.08)] transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>

                {/* Floating Badge 3 (Bottom-Left): Doorstep Arrival & Rating */}
                <div className="absolute -bottom-4 left-4 sm:left-2 z-20 flex items-center gap-2.5 rounded-2xl border border-[#D1FAE5] bg-white/95 px-3.5 py-2 shadow-[0_8px_24px_rgba(6,95,70,0.08)] backdrop-blur-xs animate-subtle-float-reverse">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#15212B]">Doorstep Visit in 45 Min</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-500">
                      <span>★ 4.9 Rating</span>
                      <span className="text-slate-400 font-normal">• 12k+ Visits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-20">
        {/* Dynamic Content: Search Results vs. Care Categories Grid */}
        {isSearching ? (
          <section className="animate-in fade-in duration-200">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 animate-fade-in-up animate-delay-2">
              <div>
                <h2 className="font-heading text-2xl sm:text-[30px] font-bold text-[#15212B] tracking-tight">
                  Explore Care Categories
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
                  Find the right healthcare services for you and your family.
                </p>
              </div>

              {/* Total Services Count Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF7F2] border border-[#CBE9DC] px-3.5 py-1.5 text-xs font-bold text-[#065F46] shadow-2xs w-fit">
                <Layers className="h-3.5 w-3.5 text-[#065F46]" />
                <span>{allServices.length} Total Services Available</span>
              </div>
            </div>

            {/* 3-Column Category Card Grid Matching Reference Image with Staggered Cascading Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES_DATA.map((cat, idx) => {
                const CategoryIcon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    style={{ animationDelay: `${idx * 90 + 120}ms` }}
                    className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#E2EBE7] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.07)] transition-all duration-300 animate-card-slide-up card-hover-lift"
                  >
                    {/* Top Image with Badge (185-200px height) */}
                    <Link href={cat.href} className="relative h-[185px] sm:h-[195px] lg:h-[200px] w-full overflow-hidden bg-slate-100 block">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        loading="eager"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                      {/* Floating Service Count Badge */}
                      <div className="absolute top-3.5 right-3.5 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1 text-[11.5px] font-bold text-slate-800 shadow-2xs border border-slate-100">
                        {cat.servicesCount}
                      </div>
                    </Link>

                    {/* Lower Bar with Mint Icon Square, Title/Description & Emerald Pill Button */}
                    <div className="p-4 sm:p-4.5 flex items-center justify-between gap-3 bg-white min-h-[96px]">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Mint Icon Box */}
                        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-[#E6F4EE] flex items-center justify-center text-[#065F46] shrink-0 border border-[#D1EADC]">
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        {/* Text Content */}
                        <div className="min-w-0">
                          <Link href={cat.href}>
                            <h3 className="font-bold text-[16px] sm:text-[17px] text-[#102820] leading-snug group-hover:text-[#065F46] transition-colors truncate">
                              {cat.title}
                            </h3>
                          </Link>
                          <p className="text-[11.5px] sm:text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
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
