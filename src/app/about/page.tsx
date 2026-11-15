'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { ScrollAnimationProvider } from '@/components/common/ScrollAnimationProvider';

export default function AboutPage() {
  const leadership = [
    {
      name: 'Dr. Maya Patel',
      role: 'Chief Medical Officer & Co-Founder',
      qual: 'MD (Internal Medicine) - Johns Hopkins University',
      image: '/assets/chatgpt-card-3.webp',
      bio: 'Former hospital department chief passionate about bedside clinical rigor, patient autonomy, and humanized elderly care.',
    },
    {
      name: 'Dr. Ethan Park',
      role: 'Head of Pediatric & Family Medicine',
      qual: 'MD (Pediatrics) - Stanford Medicine',
      image: '/assets/chatgpt-card-4.webp',
      bio: 'Pioneer of community child health programs and preventive family health protocols delivered in comfortable home settings.',
    },
    {
      name: 'Dr. Daniel Reed',
      role: 'Director of Chronic Care & Telemetry',
      qual: 'MD (Cardiovascular Medicine) - Harvard Medical School',
      image: '/assets/chatgpt-card-4.webp',
      bio: 'Leading initiatives to eliminate unnecessary emergency room readmissions through proactive bedside cardiology reviews.',
    },
  ];

  const pillars = [
    {
      icon: 'shield',
      title: '5-Stage Clinical Vetting',
      desc: 'Every clinician undergoes council licensing verification, degree authentication, police background check, and supervised in-person skills drills.',
    },
    {
      icon: 'heart',
      title: 'Unhurried Bedside Care',
      desc: 'Our standard home visits are 45–60 minutes, ensuring physicians and nurses have ample time to listen, thoroughly examine, and answer questions.',
    },
    {
      icon: 'lock',
      title: 'Bedside PIN Security',
      desc: 'Proprietary 4-digit security verification codes generated with each booking guarantee that only your scheduled clinician enters your home.',
    },
    {
      icon: 'file',
      title: 'Integrated Digital Health Records',
      desc: 'Instant digital e-prescriptions, nursing vitals logs, and NABL diagnostic results are unified into a private, secure family medical portal.',
    },
  ];

  return (
    <ScrollAnimationProvider>
      <div className="min-h-screen bg-[#fcfdfd]">
        {/* Light, Clean Header */}
        <Header theme="light" />

        {/* Premium Light Hero Section */}
        <div className="border-b border-[#e5ecec] bg-gradient-to-b from-[#f2f8f8] via-[#f7fafb] to-[#fcfdfd] py-12 md:py-16 text-center">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest text-[#116b70] uppercase mb-2 animate-hero-trust">
              OUR CLINICAL PHILOSOPHY &amp; MISSION
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#11191b] tracking-tight leading-tight animate-hero-title">
              Where Modern Medical Science Meets Compassion
            </h1>
            <p className="mx-auto mt-3.5 max-w-2xl text-sm md:text-base text-[#4d5f63] leading-relaxed animate-hero-detail">
              Vellora Health was established to eliminate the friction in everyday healthcare. We bring board-certified doctors, registered nurses, and accredited diagnostic labs directly to the place patients feel safest: their home.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="container py-12 md:py-16 space-y-16">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 scroll-reveal">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                Patient-First Healthcare
              </span>
              <h2 className="mt-3 text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                No Hospital Waiting Rooms. No Stressful Commutes.
              </h2>
              <p className="mt-4 text-xs md:text-sm leading-relaxed text-gray-700">
                Traditional healthcare frequently forces sick children, fragile post-operative patients, and elderly relatives through congested waiting rooms and transit delays. Vellora re-engineers this experience by integrating licensed doctors, skilled nurses, and caretakers into a responsive mobile clinical service.
              </p>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-gray-700">
                Whether you need an acute physician consultation for your elderly parent, continuous post-operative wound care, or regular diabetic blood tests, we manage the entire care lifecycle with transparency and clinical accountability.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/services" prefetch={true} className="button button-dark button-sm">
                  <span>Explore Our Services</span>
                  <Icon name="arrow-right" size="xs" />
                </Link>
                <Link href="/book" prefetch={true} className="button button-outline button-sm">
                  Book an Appointment
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-xl scroll-reveal-right">
              <img
                src="/assets/compassionate-hospital-care.png"
                alt="Compassionate Vellora Healthcare Team"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-sm font-extrabold">Hospital Standards. Living Room Comfort.</p>
                <p className="text-xs text-gray-200 mt-1">Dedicated bedside clinicians providing unhurried, personalized attention.</p>
              </div>
            </div>
          </div>

          {/* Core Values Pillars */}
          <div className="border-t border-gray-200 pt-14">
            <div className="text-center max-w-2xl mx-auto scroll-reveal">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">How We Protect You</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
                The Vellora Patient Safety Charter
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mt-2">
                Every clinical encounter follows hospital-grade hygiene, digital authentication, and certified care standards.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-container">
              {pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:-translate-y-1 scroll-reveal-card"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Icon name={pillar.icon as any} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900">{pillar.title}</h3>
                  <p className="mt-2 text-xs text-gray-600 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Leadership Team */}
          <div className="border-t border-gray-200 pt-14">
            <div className="text-center max-w-2xl mx-auto scroll-reveal">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-700">Medical Governance</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">
                Our Clinical Leadership &amp; Founders
              </h2>
              <p className="text-xs md:text-sm text-gray-600 mt-2">
                Governed by practicing medical specialists committed to ethical, transparent bedside medicine.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 stagger-container">
              {leadership.map((leader, i) => (
                <article
                  key={i}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-xl hover:-translate-y-1 scroll-reveal-card"
                >
                  <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="h-full w-full object-cover object-top transition duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{leader.name}</h3>
                  <p className="text-xs font-semibold text-teal-700">{leader.role}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{leader.qual}</p>
                  <p className="mt-3 text-xs leading-relaxed text-gray-600 flex-1">{leader.bio}</p>
                </article>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="rounded-3xl bg-[#11191b] p-8 text-white md:p-12 relative overflow-hidden scroll-reveal-scale">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 mb-3 inline-block">
                Start Healing at Home
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white">
                Ready to Experience Hospital-Grade Care in Your Living Room?
              </h2>
              <p className="mt-3 text-xs md:text-sm leading-relaxed text-gray-300">
                Book a physician consultation, nursing shift, or diagnostic test in minutes. No waiting rooms. No hassle.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link href="/book" prefetch={true} className="button button-white button-sm">
                  <span>Book Appointment Now</span>
                  <Icon name="arrow-right" size="xs" />
                </Link>
                <Link href="/contact" prefetch={true} className="button button-outline button-sm">
                  Contact Care Coordinator
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
