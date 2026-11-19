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
  Clock,
  Sparkles,
  Layers,
  User,
  Pill,
  Calendar,
  Heart,
  ShieldCheck,
  Home,
  FileText,
} from 'lucide-react';

interface CategoryFeatureChip {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface CategoryCardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  };
  features: CategoryFeatureChip[];
  href: string;
  filterCategories: string[];
}

const CATEGORIES_DATA: CategoryCardItem[] = [
  {
    id: 'doctor-visit',
    title: 'Doctor Visit',
    description: 'Consult with experienced doctors at home for checkups, follow-ups and ongoing care.',
    image: '/assets/chatgpt-card-1.webp',
    icon: Stethoscope,
    badge: {
      icon: ShieldCheck,
      label: 'Home Visit',
    },
    features: [
      { icon: Calendar, label: 'Home Consultation' },
      { icon: Users, label: 'Follow-up Care' },
      { icon: Heart, label: 'Chronic Care' },
    ],
    href: '/services/doctor-consultations',
    filterCategories: ['DOCTOR_VISIT'],
  },
  {
    id: 'nursing-care',
    title: 'Nursing Care',
    description: 'Professional nursing support at home for daily care, recovery and long-term needs.',
    image: '/assets/chatgpt-card-5.webp',
    icon: HeartPulse,
    badge: {
      icon: HeartPulse,
      label: 'At-Home Care',
    },
    features: [
      { icon: Pill, label: 'Medication Support' },
      { icon: Activity, label: 'Vital Monitoring' },
      { icon: ShieldCheck, label: 'Post-Procedure' },
    ],
    href: '/services/nursing-care',
    filterCategories: ['NURSING_CARE'],
  },
  {
    id: 'caretakers',
    title: 'Caretaker Care',
    description: 'Trained caregivers for daily living support, companionship and personal assistance.',
    image: '/assets/chatgpt-card-9.webp',
    icon: Users,
    badge: {
      icon: Users,
      label: 'Daily Support',
    },
    features: [
      { icon: Sparkles, label: 'Daily Assistance' },
      { icon: Activity, label: 'Mobility Support' },
      { icon: Heart, label: 'Companionship' },
    ],
    href: '/services/rehab-critical-care',
    filterCategories: ['CARETAKER'],
  },
  {
    id: 'diagnostics-labs',
    title: 'Lab Investigation',
    description: 'Safe and convenient sample collection at home with reliable, accurate lab reports.',
    image: '/assets/chatgpt-card-7.webp',
    icon: FlaskConical,
    badge: {
      icon: FlaskConical,
      label: 'At Home Collection',
    },
    features: [
      { icon: Home, label: 'Home Collection' },
      { icon: FileText, label: 'Accurate Reports' },
      { icon: ShieldCheck, label: 'Trusted Labs' },
    ],
    href: '/services/diagnostics-labs',
    filterCategories: ['LAB_TESTS'],
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

      {/* 2-COLUMN HERO SECTION WITH LIGHT SUBTLE GRADIENT (MATCHING ABOUT PAGE) */}
      <section className="relative w-full overflow-hidden border-b border-[#E8F0EC]/80 bg-gradient-to-b from-[#F2F8F5] via-[#F8FBFA] to-white">
        {/* Soft background ambient mint glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-96 w-[800px] rounded-full bg-[#ECFDF5] blur-3xl opacity-75 pointer-events-none" />
        <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-[#E6F7F0] blur-3xl opacity-60 pointer-events-none" />

        <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-7 lg:pt-8 pb-7 sm:pb-8 lg:pb-9">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (col-span-7): Eyebrow, Heading, Subtitle & Search */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF7F2] border border-[#CBE9DC] px-3.5 py-1 text-[11px] font-bold tracking-[0.14em] uppercase text-[#065F46] w-fit mb-2.5 shadow-2xs animate-fade-in-up animate-delay-1">
                <Sparkles className="h-3 w-3 stroke-[2.5] text-[#059669]" />
                <span>OUR SERVICES</span>
              </div>

              {/* Main Heading without underline under Home */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#102820] tracking-tight leading-[1.14] mb-5 sm:mb-6 animate-fade-in-up animate-delay-2">
                Expert Healthcare,<br className="hidden sm:inline" /> Delivered to Your Home
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

              {/* Popular Quick-Filter Chips - Hidden on mobile view per user request */}
              <div className="hidden sm:flex mt-3.5 flex-wrap items-center gap-2 sm:gap-2.5 animate-fade-in-up animate-delay-4">
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

            {/* Right Column (col-span-5): Unboxed Healthcare Illustration - Hidden on mobile view per user request */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] flex items-center justify-center">
                {/* Multi-layered ambient mint glow in background */}
                <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#ECFDF5] via-[#D1FAE5]/50 to-transparent blur-3xl opacity-80 pointer-events-none" />
                <div className="absolute -top-10 -right-8 h-48 w-48 rounded-full bg-emerald-100/40 blur-2xl pointer-events-none" />

                {/* Main Illustration Seamlessly in the Background (No Box, No Card, Static) */}
                <div className="relative z-10 w-full flex items-center justify-center">
                  <img
                    src="/assets/services-hero-illustration-transparent.png"
                    alt="In-Home Doctor Consultation and Healthcare Illustration"
                    className="w-full h-auto max-h-[320px] sm:max-h-[350px] object-contain drop-shadow-[0_12px_28px_rgba(6,95,70,0.08)]"
                  />
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-block h-0.5 w-5 bg-[#065F46]" />
                  <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#065F46]">OUR SERVICES</span>
                </div>
                <h2 className="font-heading text-2xl sm:text-[32px] font-extrabold text-[#11231D] tracking-tight">
                  Explore Care Categories
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">
                  Find the right healthcare service for you and your family, all at home.
                </p>
              </div>

              {/* Total Services Count Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF7F2] border border-[#CBE9DC] px-3.5 py-1.5 text-xs font-bold text-[#065F46] shadow-2xs w-fit">
                <Layers className="h-3.5 w-3.5 text-[#065F46]" />
                <span>{CATEGORIES_DATA.length} Total Services Available</span>
              </div>
            </div>

            {/* Responsive Category Card Grid: 1 Column on Mobile, 2 on Tablet, 4 on Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 lg:gap-3.5">
              {CATEGORIES_DATA.map((cat, idx) => {
                const CategoryIcon = cat.icon;
                const BadgeIcon = cat.badge.icon;
                return (
                  <div
                    key={cat.id}
                    style={{ animationDelay: `${idx * 80 + 100}ms` }}
                    className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#E2EBE7] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(6,78,59,0.09)] hover:border-[#065F46]/35 transition-all duration-300 animate-card-slide-up hover:-translate-y-1"
                  >
                    {/* Top Image with Top-Left Pill Badge */}
                    <div className="relative h-[195px] sm:h-[210px] w-full overflow-hidden bg-slate-100">
                      <Link href={cat.href} className="block h-full w-full">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          loading="eager"
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

                      {/* Top-Left Category Badge Pill */}
                      <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-semibold text-[#065F46] shadow-2xs border border-white/80">
                        <BadgeIcon className="h-3.5 w-3.5 text-[#059669]" />
                        <span>{cat.badge.label}</span>
                      </div>
                    </div>

                    {/* Floating Center Icon */}
                    <div className="relative -mt-6 mb-1 flex justify-center z-10 pointer-events-none">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-[#D1E6DC] text-[#065F46] shadow-[0_4px_16px_rgba(6,78,59,0.12)] transition-transform duration-300 group-hover:scale-110 pointer-events-auto">
                        <CategoryIcon className="h-5.5 w-5.5 stroke-[2]" />
                      </div>
                    </div>

                    {/* Card Body with Refined, Tight Spacing */}
                    <div className="px-3.5 pb-4 pt-1 sm:px-4 sm:pb-4.5 sm:pt-1 flex flex-col justify-between flex-1 bg-white">
                      <div>
                        {/* Title */}
                        <Link href={cat.href} className="group-hover:text-[#065F46] transition-colors block">
                          <h3 className="font-heading text-lg sm:text-[19px] font-bold text-[#102820] leading-snug tracking-tight mb-1">
                            {cat.title}
                          </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed min-h-[38px] line-clamp-2">
                          {cat.description}
                        </p>

                        {/* 3 Micro Feature Chips with Single-Line Text */}
                        <div className="mt-3 sm:mt-3.5 grid grid-cols-3 gap-1.5 sm:gap-2">
                          {cat.features.map((feat, fIdx) => {
                            const FeatIcon = feat.icon;
                            return (
                              <div
                                key={fIdx}
                                className="flex flex-col items-center justify-center rounded-xl bg-[#F0F7F3] border border-[#D8ECE1] py-1.5 px-0.5 sm:px-1 text-center transition-colors group-hover:bg-[#EAF5EF] min-h-[50px] overflow-hidden"
                              >
                                <FeatIcon className="h-3.5 w-3.5 text-[#065F46] mb-1 stroke-[2] shrink-0" />
                                <span className="text-[9px] sm:text-[9.5px] font-semibold text-[#18392B] leading-none text-center whitespace-nowrap tracking-tight w-full truncate px-0.5">
                                  {feat.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom Action Buttons: Clean rounded-full action pills */}
                      <div className="mt-3.5 sm:mt-4 grid grid-cols-2 gap-2">
                        <Link
                          href={cat.href}
                          className="inline-flex items-center justify-center rounded-full border border-[#CBDCD5] bg-white hover:bg-[#F2F8F5] text-[#102820] py-2 px-2.5 text-xs sm:text-[12.5px] font-bold transition-all shadow-2xs hover:border-[#065F46]/40 text-center"
                        >
                          Learn More
                        </Link>
                        <Link
                          href={cat.href}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#064E3B] hover:bg-[#065F46] text-white py-2 px-2.5 text-xs sm:text-[12.5px] font-bold shadow-2xs hover:shadow-xs transition-all duration-200 group/btn text-center"
                        >
                          <span>Book Now</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
