'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { FACILITIES_DATA } from '@/data/site-content';
import { ScrollAnimationProvider } from '@/components/common/ScrollAnimationProvider';

export default function FacilitiesPage() {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Infrastructure & Facilities' },
    { id: 'Hospital Affiliations', label: 'Hospital Network' },
    { id: 'Pathology & Genomics', label: 'Diagnostic Labs' },
    { id: 'Critical Care Equipment', label: 'Mobile ICU' },
    { id: 'Diagnostic Logistics', label: 'Cold-Chain Fleet' },
    { id: 'Operations Command', label: '24/7 Command Center' },
  ];

  const filteredFacilities = FACILITIES_DATA.filter((fac) => {
    return activeFilter === 'ALL' || fac.tag === activeFilter;
  });

  return (
    <ScrollAnimationProvider>
      <div className="min-h-screen bg-[#fcfdfd]">
        {/* Light, Clean Header */}
        <Header theme="light" />

        {/* Premium Light Hero Section */}
        <div className="relative border-b border-[#e5ecec] bg-gradient-to-b from-[#f0f6f6] via-[#f7fafb] to-[#fcfdfd] py-16 md:py-20 text-center overflow-hidden">
          {/* Subtle geometric background dot texture */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#116b70_0.75px,transparent_0.75px)] [background-size:20px_20px] opacity-[0.035]" />

          <div className="container relative z-10 max-w-4xl">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center justify-center gap-2 text-xs text-[#55696d] mb-4 font-medium">
              <Link href="/" className="hover:text-[#116b70] transition-colors">Home</Link>
              <span className="text-gray-300">/</span>
              <span className="text-[#11191b] font-semibold">Facilities &amp; Standards</span>
            </div>

            {/* Clinical Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#d2e5e6] px-3.5 py-1 text-xs font-semibold text-[#116b70] mb-4 shadow-xs animate-hero-trust">
              <span className="flex h-2 w-2 rounded-full bg-[#116b70] animate-pulse" />
              <span>HOSPITAL STANDARDS &amp; ACCREDITED INFRASTRUCTURE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#11191b] tracking-tight leading-[1.15] animate-hero-title">
              State-of-the-Art Facilities &amp; Clinical Infrastructure
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-[#4d5f63] leading-relaxed animate-hero-detail">
              From our accredited partner reference laboratories to portable ICU equipment suites and active cold-chain phlebotomy fleets, we deliver hospital-grade patient safety right to your doorstep.
            </p>

            {/* Quick Metrics Bar (Clean Light Clinical Style) */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl mx-auto animate-hero-actions">
              <div className="rounded-2xl bg-white p-3.5 border border-[#e1e9e9] shadow-sm">
                <p className="text-xl sm:text-2xl font-extrabold text-[#116b70]">100%</p>
                <p className="text-[11px] text-[#55696d] mt-0.5 font-medium">NABL &amp; CAP Accredited</p>
              </div>
              <div className="rounded-2xl bg-white p-3.5 border border-[#e1e9e9] shadow-sm">
                <p className="text-xl sm:text-2xl font-extrabold text-[#116b70]">2°C – 8°C</p>
                <p className="text-[11px] text-[#55696d] mt-0.5 font-medium">Cold-Chain Calibrated</p>
              </div>
              <div className="rounded-2xl bg-white p-3.5 border border-[#e1e9e9] shadow-sm">
                <p className="text-xl sm:text-2xl font-extrabold text-[#116b70]">&lt; 15 min</p>
                <p className="text-[11px] text-[#55696d] mt-0.5 font-medium">ER Escalation Window</p>
              </div>
              <div className="rounded-2xl bg-white p-3.5 border border-[#e1e9e9] shadow-sm">
                <p className="text-xl sm:text-2xl font-extrabold text-[#116b70]">24 / 7</p>
                <p className="text-[11px] text-[#55696d] mt-0.5 font-medium">Physician Command Desk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container py-10 md:py-12">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6 scroll-reveal">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                    activeFilter === cat.id
                      ? 'bg-[#11191b] text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <p className="text-xs font-medium text-gray-500">
              Showing {filteredFacilities.length} specialized facility module(s)
            </p>
          </div>

          {/* Facilities Cards Grid */}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 stagger-container">
            {filteredFacilities.map((fac) => (
              <article
                key={fac.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 scroll-reveal-card"
              >
                {/* Visual Header */}
                <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                  <img
                    src={fac.image || '/assets/facility-1.webp'}
                    alt={fac.alt || fac.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Tag Pill */}
                  <div className="absolute top-4 left-4 rounded-full bg-[#11191b]/85 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/10">
                    {fac.tag}
                  </div>

                  {/* Highlight Pill */}
                  {fac.highlight && (
                    <div className="absolute bottom-4 left-4 rounded-full bg-teal-500/90 px-3 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                      {fac.highlight}
                    </div>
                  )}
                </div>

                {/* Details Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-teal-700 transition">
                    {fac.title}
                  </h2>
                  <p className="mt-2.5 text-xs text-gray-600 leading-relaxed flex-1">
                    {fac.description}
                  </p>

                  {/* Clinical Specifications Checklist */}
                  {fac.specs && fac.specs.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-teal-800 mb-2">
                        Clinical Standards &amp; Equipment
                      </p>
                      <ul className="space-y-1.5">
                        {fac.specs.map((spec, i) => (
                          <li key={i} className="flex items-center gap-2 text-[11px] text-gray-600">
                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-teal-50 text-teal-700 font-bold text-[9px]">
                              ✓
                            </span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Bottom Action */}
                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      ● Active Protocol
                    </span>
                    <Link
                      href="/book"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition"
                    >
                      Book Visit <Icon name="arrow-right" size="xs" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Diagnostic Accreditation Banner */}
          <div className="mt-14 rounded-3xl bg-[#11191b] p-8 text-white md:p-12 relative overflow-hidden scroll-reveal-scale">
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 mb-3">
                Zero-Contamination Guarantee
              </span>
              <h2 className="text-2xl font-bold md:text-4xl text-white">
                NABL &amp; CAP-Accredited Diagnostic Infrastructure
              </h2>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-gray-300">
                All specimen samples collected at home are transported in temperature-controlled cold-chain containers with unique barcode tracking directly into our reference laboratories, ensuring the highest diagnostic accuracy and patient confidentiality.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/book?service=home-lab-investigations" className="button button-white button-sm">
                  Book Diagnostic Blood Panel <Icon name="arrow-right" size="xs" />
                </Link>
                <Link href="/contact" className="button button-outline button-sm">
                  Facility Inquiries &amp; Handoffs
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
