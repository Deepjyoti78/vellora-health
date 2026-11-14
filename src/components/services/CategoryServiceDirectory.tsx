'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { ServiceRecord } from '@/lib/db';
import {
  ArrowLeft,
  Check,
  Clock,
  ShieldCheck,
  Search,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

export interface CategoryPageConfig {
  number: string;
  slug: string;
  title: string;
  tagline: string;
  scopeOfCare: string[];
  clinicianType: string;
  clinicianRoleBadge: string;
  services: ServiceRecord[];
}

interface CategoryServiceDirectoryProps {
  config: CategoryPageConfig;
}

export const CategoryServiceDirectory: React.FC<CategoryServiceDirectoryProps> = ({
  config,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = config.services.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.shortDesc.toLowerCase().includes(q) ||
      s.features.some((f) => f.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F5F9F7]">
      <Header theme="light" />

      {/* Top Banner / Breadcrumb & Category Hero */}
      <div className="border-b border-[#E2EBE7] bg-white py-10 sm:py-12">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb & Back Link */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-[#E2EBE7] bg-[#F2F8F5] px-3.5 py-1.5 text-xs font-bold text-[#065F46] hover:bg-[#E8F3EE] hover:text-[#064E3B] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>All Service Categories</span>
            </Link>

            <span className="text-xs font-semibold text-slate-400">
              Category {config.number} of 04
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                  Category {config.number}
                </span>
                <span className="rounded-full bg-[#F2F8F5] border border-[#E2EBE7] px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                  {config.clinicianType}
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[#102820]">
                {config.title}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                {config.tagline}
              </p>

              {/* Scope of Care at Home (Image 2 table details) */}
              <div className="mt-4 flex flex-wrap gap-2">
                {config.scopeOfCare.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-1 text-xs font-medium text-[#065F46]"
                  >
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Clinician Badge Card */}
            <div className="rounded-2xl border border-[#E2EBE7] bg-[#F2F8F5] p-4 min-w-[260px] shadow-2xs">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#065F46]">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Practitioners</span>
              </div>
              <p className="mt-1 font-heading text-sm font-bold text-[#102820]">
                {config.clinicianRoleBadge}
              </p>
              <p className="mt-1 text-[11px] text-slate-500">
                Mandatory council license verification &amp; 4-digit bedside PIN check.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Services List */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Search & Counter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2EBE7] pb-6 mb-8">
          <div>
            <h2 className="font-heading text-xl font-bold text-[#102820]">
              Available In-Home Procedures &amp; Shifts
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filteredServices.length} specialized service(s) available for doorstep booking
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search in this category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#E2EBE7] bg-white py-2 pl-10 pr-4 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B] shadow-2xs"
            />
          </div>
        </div>

        {/* 10 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#E2EBE7] bg-white shadow-xs transition-all duration-300 hover:border-[#B8DCDE] hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Image Header with Number & Price Tag */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top-left number badge */}
                  <div className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#064E3B] backdrop-blur-md border border-white/80 shadow-xs">
                    {String(index + 1).padStart(2, '0')} • {service.duration}
                  </div>

                  {/* Top-right Price badge */}
                  <div className="absolute bottom-3.5 right-3.5 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#102820] shadow-md">
                    From ${service.basePrice}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5">
                  <h3 className="font-heading text-base font-extrabold text-[#102820] group-hover:text-[#065F46] transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-[#5E7171] leading-relaxed line-clamp-2">
                    {service.shortDesc}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="mt-4 border-t border-[#F2F8F5] pt-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                      Key Clinical Deliverables
                    </p>
                    <ul className="space-y-1.5">
                      {service.features.slice(0, 3).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                          <Check className="h-3.5 w-3.5 text-[#065F46] shrink-0 mt-0.5 stroke-[2.5]" />
                          <span className="line-clamp-1">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Supported Options / Shifts */}
                  {service.supportedOptions && service.supportedOptions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[#F2F8F5] pt-2.5">
                      {service.supportedOptions.slice(0, 2).map((opt, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-[#F2F8F5] border border-[#E2EBE7] px-2 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          {opt}
                        </span>
                      ))}
                      {service.supportedOptions.length > 2 && (
                        <span className="rounded-md bg-[#F2F8F5] px-1.5 py-0.5 text-[10px] text-slate-400">
                          +{service.supportedOptions.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0">
                <div className="flex items-center justify-between border-t border-[#F2F8F5] pt-3.5">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-semibold text-slate-500 hover:text-[#065F46] transition-colors"
                  >
                    Clinical Details
                  </Link>
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Assurance Banner */}
        <div className="mt-14 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-2xs">
          <div className="flex items-center justify-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#065F46] mb-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Hospital-Grade Safety Standard</span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-[#102820]">
            Every Visit Backed by 4-Digit Bedside PIN Verification
          </h3>
          <p className="mx-auto mt-1 max-w-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your assigned healthcare practitioner will ask for your secure 4-digit PIN before starting care. Medical records, visit notes, and prescriptions instantly sync to your secure patient portal.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full border border-[#CBDCD5] bg-white px-5 py-2 text-xs font-bold text-[#102820] hover:bg-[#F2F8F5] transition-colors shadow-2xs"
            >
              <span>Explore Other Categories</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-5 py-2 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-xs"
            >
              <span>Speak to Care Coordinator</span>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
