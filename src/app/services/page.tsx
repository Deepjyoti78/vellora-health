'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Stethoscope,
  ShieldCheck,
  FlaskConical,
  Zap,
  HeartPulse,
  Activity,
  Check,
  ArrowRight,
} from 'lucide-react';

interface CategoryCardData {
  number: string;
  count: string;
  title: string;
  description: string;
  image: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const CATEGORIES_DATA: CategoryCardData[] = [
  {
    number: '01',
    count: '10 Services',
    title: 'Doctor Consultations',
    description: 'Medical assessments and expert consultations for individuals and families at home.',
    image: '/assets/doorstep-1.webp',
    href: '/services/doctor-consultations',
    icon: Stethoscope,
    features: [
      'Multi-specialty consultations',
      'Follow-ups & care planning',
    ],
  },
  {
    number: '02',
    count: '8 Services',
    title: 'Nursing & Care Support',
    description: 'Professional nursing and daily care support for recovery, chronic care, and long-term needs.',
    image: '/assets/doorstep-2.webp',
    href: '/services/nursing-care',
    icon: HeartPulse,
    features: [
      'Wound & medication care',
      'Daily assistance & monitoring',
    ],
  },
  {
    number: '03',
    count: '9 Services',
    title: 'Diagnostics & Lab Services',
    description: 'Accurate, convenient testing and diagnostics at home with professional care.',
    image: '/assets/diagnostics.webp',
    href: '/services/diagnostics-labs',
    icon: FlaskConical,
    features: [
      'Home sample collection',
      'Lab tests & health screening',
    ],
  },
  {
    number: '04',
    count: '7 Services',
    title: 'Rehab & Critical Care',
    description: 'Rehabilitation, recovery, and advanced care at home for greater independence and safety.',
    image: '/assets/doorstep-4.webp',
    href: '/services/rehab-critical-care',
    icon: Activity,
    features: [
      'Physiotherapy & rehabilitation',
      'Post-hospital & chronic care',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#F5F9F7]">
      {/* Top Header with active Services pill */}
      <Header theme="light" />

      {/* Top Hero Section matching Image 1 */}
      <div className="pt-12 pb-8 text-center bg-transparent">
        <div className="container max-w-4xl mx-auto px-4">
          <p className="text-[11px] font-extrabold tracking-widest text-[#065F46] uppercase mb-2.5">
            SERVICES DIRECTORY
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#11191B] tracking-tight leading-tight">
            Hospital-Grade Care, Delivered to Your Doorstep
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed">
            Comprehensive, professional care at home — from doctor consultations to advanced diagnostics, nursing support, and rehabilitation.
          </p>

          {/* 4 Feature Pills Row matching Image 1 */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-4 py-2 text-xs font-bold text-[#065F46] shadow-2xs">
              <Stethoscope className="h-4 w-4 stroke-[2.2]" />
              <span>Licensed Doctors</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-4 py-2 text-xs font-bold text-[#065F46] shadow-2xs">
              <ShieldCheck className="h-4 w-4 stroke-[2.2]" />
              <span>Certified Nurses</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-4 py-2 text-xs font-bold text-[#065F46] shadow-2xs">
              <FlaskConical className="h-4 w-4 stroke-[2.2]" />
              <span>At-Home Diagnostics</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-4 py-2 text-xs font-bold text-[#065F46] shadow-2xs">
              <Zap className="h-4 w-4 stroke-[2.2]" />
              <span>Same-Day Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2x2 Category Cards Grid matching Image 1 */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 pb-12 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {CATEGORIES_DATA.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.number}
                href={cat.href}
                className="group flex flex-col justify-between overflow-hidden rounded-[26px] border border-[#E2EBE7] bg-white shadow-xs transition-all duration-300 hover:border-[#B8DCDE] hover:shadow-xl hover:-translate-y-1"
                aria-label={cat.title}
              >
                {/* Top Image Media Area */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="eager"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Top-left number badge */}
                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#064E3B] backdrop-blur-md border border-white/80 shadow-xs">
                    {cat.number}
                  </div>

                  {/* Top-right service count badge */}
                  <div className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#11191B] backdrop-blur-md border border-white/80 shadow-xs">
                    {cat.count}
                  </div>
                </div>

                {/* Lower Card Body */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    {/* Icon + Title + Explore Button */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EDF7F3] border border-[#D6EDE4] text-[#065F46] shadow-2xs">
                          <IconComponent className="h-6 w-6 stroke-[2]" />
                        </div>
                        <div>
                          <h2 className="font-heading text-lg font-extrabold text-[#11191B] group-hover:text-[#065F46] transition-colors leading-snug">
                            {cat.title}
                          </h2>
                          <p className="mt-1 text-xs text-[#5E7171] leading-relaxed line-clamp-2">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      {/* Explore Category Pill Button */}
                      <div className="shrink-0 hidden sm:block">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors group-hover:bg-[#065F46]">
                          <span>Explore Category</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>

                    {/* Features checklist row matching reference */}
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#F2F8F5] pt-3.5">
                      {cat.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                          <Check className="h-3.5 w-3.5 text-[#065F46] stroke-[2.5]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Explore Category Button */}
                  <div className="mt-4 pt-2 sm:hidden">
                    <div className="w-full flex items-center justify-center gap-2 rounded-full bg-[#064E3B] py-2.5 px-4 text-xs font-bold text-white">
                      <span>Explore Category</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Assurance Banner Pill matching Image 1 */}
        <div className="mt-8 flex justify-center">
          <div className="w-full max-w-4xl flex items-center justify-center gap-2 rounded-full bg-[#E8F5EE] border border-[#D6EDE2] py-3 px-6 text-xs sm:text-sm font-bold text-[#065F46] shadow-2xs">
            <ShieldCheck className="h-4 w-4 stroke-[2.5]" />
            <span>Instant confirmation with bedside PIN verification</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
