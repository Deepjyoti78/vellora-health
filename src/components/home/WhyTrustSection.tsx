'use client';

import React from 'react';
import Link from 'next/link';
import { useBooking } from '@/context/BookingContext';
import {
  ShieldCheck,
  Clock,
  FileText,
  HeartPulse,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface TrustFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRUST_FEATURES: TrustFeature[] = [
  {
    id: 'certified-experts',
    title: 'Certified Medical Experts',
    description: 'Only board-certified doctors, verified hospital physicians, and licensed specialists.',
    icon: ShieldCheck,
  },
  {
    id: 'same-day',
    title: 'Same-Day Appointments',
    description: 'No waiting rooms or travel strain. Book doorstep doctor consultations within hours.',
    icon: Clock,
  },
  {
    id: 'digital-records',
    title: 'Secure Digital Health Records',
    description: 'Dynamic bedside safety PIN, instant e-prescriptions, and encrypted visit history.',
    icon: FileText,
  },
  {
    id: 'doorstep-care',
    title: 'In-Person Doorstep Care',
    description: 'Unhurried 45-minute bedside examinations, diagnostics, and continuous follow-ups.',
    icon: HeartPulse,
  },
];

export const WhyTrustSection: React.FC = () => {
  const { openBooking } = useBooking();

  return (
    <section id="why-trust" className="w-full py-8 sm:py-14 lg:py-16" aria-labelledby="whyTrustTitle">
      <div className="w-full sm:container mx-auto max-w-[1540px] px-2 sm:px-5 lg:px-6">
        {/* Main Showcase Card */}
        <div className="relative overflow-hidden rounded-[20px] sm:rounded-[34px] bg-gradient-to-br from-[#064E3B] via-[#043D2E] to-[#022A20] border border-[#10B981]/30 shadow-[0_24px_64px_rgba(2,42,32,0.35)] p-3.5 sm:p-6 lg:p-7 text-white">
          {/* Subtle Ambient Mint/Emerald Glow Effects */}
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#10B981]/12 blur-3xl pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-8 px-1 sm:px-0 scroll-reveal">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-[0.14em] uppercase text-emerald-300 mb-2 sm:mb-2.5 shadow-2xs">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>WHY THOUSANDS TRUST VELLORA</span>
            </div>
            <h2 id="whyTrustTitle" className="font-heading text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight !text-white leading-tight">
              Why Thousands Trust Velora Healthcare
            </h2>
            <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal px-2">
              We&apos;re committed to providing you with the highest quality healthcare experience directly at your doorstep.
            </p>
          </div>

          {/* Two-Column Layout: Single Group Photo on Left + Clean Feature Cards on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-7 items-stretch">
            {/* Left Column: Prominent Single Group Photo of Doctors */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center scroll-reveal-left" style={{ transitionDelay: '250ms' }}>
              <div className="relative w-full h-[380px] sm:h-[440px] lg:h-[490px] xl:h-[520px] rounded-[20px] sm:rounded-[24px] overflow-hidden shadow-2xl bg-[#021A13] group border border-emerald-500/20">
                <img
                  src="/assets/doctors-group-team.png"
                  alt="Vellora Healthcare Medical Team of Specialists"
                  className="w-full h-full object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Dark Vignette Overlay for Crisp Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-semibold text-emerald-300 shadow-2xs truncate">
                    <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate">Board-Certified Physicians</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-amber-300 shadow-2xs shrink-0">
                    <span>★</span>
                    <span>4.9 (1,250+ Visits)</span>
                  </span>
                </div>

                {/* Bottom Overlay: Team Info & Quick Book */}
                <div className="absolute bottom-0 inset-x-0 p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 sm:gap-4">
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-xs font-bold text-emerald-400 tracking-wider uppercase block">
                      Multidisciplinary Physician Council
                    </span>
                    <h3 className="font-heading text-base sm:text-2xl font-bold text-white mt-0.5">
                      Senior Specialists &amp; Care Coordinators
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-300 mt-1 line-clamp-2 max-w-lg leading-relaxed hidden sm:block">
                      Bringing verified hospital expertise, unhurried consultations, and compassionate care directly to your family&apos;s bedside.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openBooking()}
                    className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                  >
                    <span>Book Visit</span>
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Clean Non-Border Feature Cards */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between gap-3 sm:gap-3.5">
              <div className="flex flex-col gap-2.5 sm:gap-3 stagger-container">
                {TRUST_FEATURES.map((item, index) => {
                  const IconComp = item.icon;

                  return (
                    <div
                      key={item.id}
                      style={{ transitionDelay: `${450 + index * 120}ms` }}
                      className="w-full text-left p-3.5 sm:p-4 rounded-[18px] sm:rounded-[20px] bg-white/[0.08] hover:bg-white/[0.14] transition-all duration-300 flex items-center gap-3.5 scroll-reveal-card"
                    >
                      {/* Left Icon Badge - Clean, no white border outline */}
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center shrink-0 bg-white/10 text-emerald-300">
                        <IconComp className="h-5 w-5 sm:h-5.5 sm:w-5.5 stroke-[2]" />
                      </div>

                      {/* Card Content without white outline or gluiness */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-[15px] font-bold text-white tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-xs text-emerald-100/75 mt-0.5 leading-snug">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Button matching the reference image */}
              <div className="pt-2 sm:pt-3 scroll-reveal" style={{ transitionDelay: '930ms' }}>
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-3 rounded-full bg-white text-[#064E3B] hover:bg-[#F2FBF7] pl-5 pr-2 py-2 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all group/btn cursor-pointer"
                >
                  <span>Meet Our Doctors</span>
                  <span className="h-8 w-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center transition-transform duration-200 group-hover/btn:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
