'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { ScrollAnimationProvider } from '@/components/common/ScrollAnimationProvider';
import {
  ShieldCheck,
  Heart,
  Lock,
  FileText,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  Clock,
  Activity,
  Users,
} from 'lucide-react';

export default function AboutPage() {
  const leadership = [
    {
      name: 'Dr. Maya Patel',
      role: 'Chief Medical Officer & Co-Founder',
      qual: '14 Years • MD (Internal Medicine)',
      image: '/assets/chatgpt-card-3.webp',
      bio: 'Former hospital department chief passionate about bedside clinical rigor, patient autonomy, and humanized elderly care.',
      specialties: ['Geriatrics', 'Internal Medicine', 'Preventive Care'],
    },
    {
      name: 'Dr. Ethan Park',
      role: 'Head of Pediatric & Family Medicine',
      qual: '11 Years • MD (Pediatrics)',
      image: '/assets/chatgpt-card-4.webp',
      bio: 'Pioneer of community child health programs and preventive family health protocols delivered in comfortable home settings.',
      specialties: ['Pediatrics', 'Family Health', 'Immunizations'],
    },
    {
      name: 'Dr. Daniel Reed',
      role: 'Director of Chronic Care & Telemetry',
      qual: '16 Years • MD (Cardiology)',
      image: '/assets/avatar-indian-2.jpg',
      bio: 'Leading initiatives to eliminate unnecessary emergency room readmissions through proactive bedside cardiology reviews.',
      specialties: ['Cardiology', 'Hypertension', 'Remote Telemetry'],
    },
  ];

  const pillars = [
    {
      icon: ShieldCheck,
      title: '5-Stage Clinical Vetting',
      desc: 'Every clinician undergoes council licensing verification, degree authentication, police background checks, and supervised in-person clinical drills.',
    },
    {
      icon: Heart,
      title: 'Unhurried Bedside Care',
      desc: 'Our standard home visits are 45–60 minutes, ensuring physicians and nurses have ample time to listen, thoroughly examine, and answer questions.',
    },
    {
      icon: Lock,
      title: 'Bedside PIN Security',
      desc: 'Proprietary 4-digit security verification codes generated with each booking guarantee that only your scheduled clinician enters your home.',
    },
    {
      icon: FileText,
      title: 'Integrated Digital Records',
      desc: 'Instant digital e-prescriptions, nursing vitals logs, and NABL diagnostic results are unified into a private, secure family medical portal.',
    },
  ];

  const clinicalMetrics = [
    { value: '45–60 min', label: 'Average In-Home Visit', detail: 'Unhurried, thorough bedside exams' },
    { value: '100%', label: 'Council-Verified Clinicians', detail: 'MBBS/MD & registered nurses only' },
    { value: '4-Digit', label: 'Bedside PIN Verification', detail: 'Mandatory identity security check' },
    { value: '4.9 / 5', label: 'Patient Satisfaction', detail: 'Rated across 135k+ care visits' },
  ];

  return (
    <ScrollAnimationProvider>
      <div className="min-h-screen bg-[#FAFCFB] text-[#15212B] font-sans antialiased">
        {/* Header with active pill */}
        <Header theme="light" />

        {/* ================= HERO SECTION (NO SEPARATION LINE, WITH LEFT & RIGHT ILLUSTRATIONS) ================= */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8F5] via-[#F8FBFA] to-[#FAFCFB] py-10 sm:py-14 lg:py-16">
          {/* Subtle background ambient mint glow */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-96 w-[700px] rounded-full bg-[#ECFDF5] blur-3xl opacity-70 pointer-events-none" />

          <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Background Illustration: In-Home Bedside Doctor Visit (No Box, No Card) */}
              <div className="hidden lg:flex lg:col-span-3 xl:col-span-3.5 justify-start">
                <div className="relative w-full max-w-[340px] flex items-center justify-center">
                  {/* Soft Background Mint Aura */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#ECFDF5] via-[#D1FAE5]/50 to-transparent blur-2xl opacity-80 pointer-events-none" />

                  {/* Decorative Floating Accents */}
                  <div className="absolute -top-3 left-4 text-emerald-300/60 font-black text-xl select-none pointer-events-none animate-subtle-float">
                    ✦
                  </div>
                  <div className="absolute bottom-6 -left-2 text-teal-400/50 font-black text-lg select-none pointer-events-none animate-subtle-float-reverse">
                    +
                  </div>

                  {/* Floating Badge (Top Left) */}
                  <div className="absolute -top-2 left-1 z-20 flex items-center gap-1.5 rounded-full border border-[#D1FAE5] bg-white/95 px-3 py-1 text-[11px] font-bold text-[#065F46] shadow-[0_4px_16px_rgba(6,95,70,0.08)] backdrop-blur-xs animate-subtle-float">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                    <span>Compassionate Care</span>
                  </div>

                  {/* Pure Background Illustration (Unboxed) */}
                  <div className="relative z-10 w-full flex items-center justify-center">
                    <img
                      src="/assets/services-hero-illustration-transparent.png"
                      alt="In-Home Doctor Consultation Illustration"
                      className="w-full h-auto max-h-[220px] object-contain drop-shadow-[0_10px_24px_rgba(6,95,70,0.08)] transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Floating Badge (Bottom Right) */}
                  <div className="absolute -bottom-3 right-0 z-20 flex items-center gap-1.5 rounded-2xl border border-[#D1FAE5] bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#15212B] shadow-[0_4px_16px_rgba(6,95,70,0.08)] backdrop-blur-xs animate-subtle-float-reverse">
                    <span className="text-[#065F46]">45–60 Min</span>
                    <span className="text-slate-500 font-medium">Bedside Visits</span>
                  </div>
                </div>
              </div>

              {/* Center Column: Eyebrow, Mission Headline & Trust Badges */}
              <div className="lg:col-span-6 xl:col-span-5 text-center flex flex-col items-center justify-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-[11px] font-bold tracking-[0.14em] text-[#065F46] uppercase mb-3.5 shadow-2xs">
                  <Sparkles className="h-3 w-3 stroke-[2.5] text-[#059669]" />
                  <span>OUR CLINICAL PHILOSOPHY &amp; MISSION</span>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#15212B] tracking-tight leading-[1.14]">
                  Where Modern Medical Science Meets Compassion
                </h1>

                {/* Micro Trust Indicators framing the title in place of bulky text */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E2EBE7] px-3 py-1 text-xs font-semibold text-[#15212B] shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-[#059669]" />
                    100% Board-Certified Doctors
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E2EBE7] px-3 py-1 text-xs font-semibold text-[#15212B] shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-[#059669]" />
                    Hospital Standards at Home
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E2EBE7] px-3 py-1 text-xs font-semibold text-[#15212B] shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-[#059669]" />
                    4-Digit Bedside PIN Verified
                  </span>
                </div>
              </div>

              {/* Right Background Illustration: Modern Hospital Standards & Clinical Network (No Box, No Card) */}
              <div className="hidden lg:flex lg:col-span-3 xl:col-span-3.5 justify-end">
                <div className="relative w-full max-w-[340px] flex items-center justify-center">
                  {/* Soft Background Mint Aura */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tl from-[#ECFDF5] via-[#D1FAE5]/50 to-transparent blur-2xl opacity-80 pointer-events-none" />

                  {/* Decorative Floating Accents */}
                  <div className="absolute -top-3 right-4 text-emerald-300/60 font-black text-xl select-none pointer-events-none animate-subtle-float">
                    ✦
                  </div>
                  <div className="absolute bottom-6 -right-2 text-teal-400/50 font-black text-lg select-none pointer-events-none animate-subtle-float-reverse">
                    +
                  </div>

                  {/* Floating Badge (Top Right) */}
                  <div className="absolute -top-2 right-1 z-20 flex items-center gap-1.5 rounded-full border border-[#D1FAE5] bg-white/95 px-3 py-1 text-[11px] font-bold text-[#065F46] shadow-[0_4px_16px_rgba(6,95,70,0.08)] backdrop-blur-xs animate-subtle-float">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#065F46]" />
                    <span>Hospital Grade</span>
                  </div>

                  {/* Pure Background Illustration (Unboxed) */}
                  <div className="relative z-10 w-full flex items-center justify-center">
                    <img
                      src="/assets/about-hero-hospital-illustration-transparent.png"
                      alt="Modern Clinical Infrastructure & Hospital Standards Illustration"
                      className="w-full h-auto max-h-[220px] object-contain drop-shadow-[0_10px_24px_rgba(6,95,70,0.08)] transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Floating Badge (Bottom Left) */}
                  <div className="absolute -bottom-3 left-0 z-20 flex items-center gap-1.5 rounded-2xl border border-[#D1FAE5] bg-white/95 px-3 py-1.5 text-[11px] font-bold text-[#15212B] shadow-[0_4px_16px_rgba(6,95,70,0.08)] backdrop-blur-xs animate-subtle-float-reverse">
                    <span className="text-[#065F46]">NABL / ISO</span>
                    <span className="text-slate-500 font-medium">Certified Standards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MAIN CONTENT (SEAMLESS TRANSITION WITH NO HARSH DIVIDERS) ================= */}
        <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 sm:space-y-20">
          {/* Key Clinical Impact Metrics Bar */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {clinicalMetrics.map((metric, idx) => (
              <div
                key={idx}
                className="rounded-[20px] border border-[#E2EBE7] bg-white p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:border-[#B8DCDE] transition-all"
              >
                <p className="font-heading text-2xl sm:text-3xl font-bold text-[#064E3B] tracking-tight">
                  {metric.value}
                </p>
                <p className="mt-1 font-heading text-sm font-semibold text-[#15212B]">
                  {metric.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {metric.detail}
                </p>
              </div>
            ))}
          </section>

          {/* Narrative: Patient-First Healthcare */}
          <section className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#065F46]">
                <Activity className="h-3.5 w-3.5" />
                <span>PATIENT-FIRST HEALTHCARE</span>
              </span>

              <h2 className="mt-3 font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#15212B] leading-tight tracking-tight">
                No Hospital Waiting Rooms.<br />No Stressful Commutes.
              </h2>

              <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-slate-600">
                Traditional healthcare frequently forces sick children, fragile post-operative patients, and elderly relatives through congested hospital waiting rooms and transit delays. Vellora re-engineers this experience by integrating licensed doctors, skilled nurses, and caretakers into a responsive doorstep clinical service.
              </p>

              <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600">
                Whether you need an acute physician consultation for your elderly parent, continuous post-operative wound care, or regular diabetic blood tests, we manage the entire care lifecycle with transparency and strict clinical accountability.
              </p>

              {/* Feature Checklist */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Unhurried 45–60 minute doctor visits',
                  'Sterile, single-use bedside clinical kits',
                  'Instant digital prescriptions in your portal',
                  'Transparent upfront pricing — zero hidden fees',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-full border border-[#CBDCD5] bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-[#102820] hover:bg-[#F2F8F5] transition-colors shadow-2xs"
                >
                  <span>Book an Appointment</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative overflow-hidden rounded-[24px] border border-[#E2EBE7] bg-white p-2.5 shadow-lg">
              <div className="relative h-80 sm:h-96 w-full overflow-hidden rounded-[18px]">
                <img
                  src="/assets/compassionate-hospital-care.png"
                  alt="Compassionate Vellora Healthcare Team with Patient"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="rounded-full bg-[#065F46] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    Vellora Promise
                  </span>
                  <p className="mt-1.5 font-heading text-base font-bold">Hospital Standards. Living Room Comfort.</p>
                  <p className="mt-1 text-xs text-slate-200">
                    Dedicated bedside clinicians providing unhurried, personalized attention in familiar surroundings.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Pillars */}
          <section className="rounded-[26px] border border-[#E2EBE7] bg-white p-8 sm:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="text-center max-w-2xl mx-auto">
              <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#065F46]">
                HOW WE PROTECT YOU
              </span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#15212B]">
                The Vellora Patient Safety Charter
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every clinical encounter follows hospital-grade hygiene, digital authentication, and certified care standards.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar, idx) => {
                const IconComp = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="group rounded-[20px] border border-[#E2EBE7] bg-[#FBFDFD] p-6 shadow-2xs transition-all duration-300 hover:border-[#B8DCDE] hover:bg-white hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] group-hover:scale-105 transition-transform">
                      <IconComp className="h-5 w-5 stroke-[2.2]" />
                    </div>
                    <h3 className="mt-4 font-heading text-base font-bold text-[#15212B]">{pillar.title}</h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Clinical Leadership Team */}
          <section>
            <div className="text-center max-w-2xl mx-auto">
              <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#065F46]">
                MEDICAL GOVERNANCE
              </span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#15212B]">
                Our Clinical Leadership &amp; Founders
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Governed by practicing medical specialists committed to ethical, transparent bedside medicine.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {leadership.map((leader, i) => (
                <article
                  key={i}
                  className="group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#E2EBE7] bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#B8DCDE] hover:shadow-lg hover:-translate-y-1"
                >
                  <div>
                    <div className="relative h-60 w-full overflow-hidden rounded-[16px] bg-slate-100 mb-4 border border-[#E2EBE7]">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#065F46] mb-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Verified Medical Director</span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#15212B] group-hover:text-[#065F46] transition-colors">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#065F46] mt-0.5">{leader.role}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{leader.qual}</p>

                    <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-3">
                      {leader.bio}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F2F8F5] flex flex-wrap gap-1.5">
                    {leader.specialties.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-md bg-[#F2F8F5] border border-[#E2EBE7] px-2 py-0.5 text-[10px] font-medium text-slate-600"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Provider Recruitment Callout Banner */}
          <section className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 sm:p-8 shadow-[0_4px_20px_rgba(6,95,70,0.04)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#065F46]">
                  Clinician Careers
                </span>
                <h3 className="mt-1 font-heading text-lg sm:text-xl font-bold text-[#102723]">
                  Join Vellora&apos;s Healthcare Provider Fleet
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xl">
                  Are you a licensed physician, registered nurse, physiotherapist, caretaker, or phlebotomist? Deliver flexible, unhurried bedside care with transparent weekly compensation and dedicated dispatcher support.
                </p>
              </div>
            </div>
            <Link
              href="/join-as-provider"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#065F46] hover:bg-[#054d39] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:gap-3"
            >
              <span>Apply as a Provider</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {/* CTA Banner */}
          <section className="rounded-[26px] bg-[#064E3B] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
            {/* Soft decorative cross & background pattern */}
            <div className="absolute right-4 top-4 text-emerald-400/20 font-light text-8xl pointer-events-none select-none">
              +
            </div>
            <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 bg-white/10 px-3 py-1 rounded-full border border-white/20 mb-3.5 inline-block">
                Start Healing at Home
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Ready to Experience Hospital-Grade Care in Your Living Room?
              </h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-emerald-100/90 max-w-xl">
                Book a physician consultation, nursing shift, or diagnostic test in minutes. No waiting rooms. No commute fatigue.
              </p>
              <div className="mt-7 flex flex-wrap gap-3.5">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs sm:text-sm font-bold text-[#064E3B] shadow-sm hover:bg-[#F2F8F5] transition-colors"
                >
                  <span>Book Appointment Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <span>Contact Care Coordinator</span>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </ScrollAnimationProvider>
  );
}
