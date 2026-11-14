'use client';

import React from 'react';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@/components/common/Icon';

export const HowItWorksSection: React.FC = () => {
  const { openBooking } = useBooking();

  const processStages = [
    {
      num: '01',
      title: 'Select Service & Schedule',
      subtitle: 'Instant online reservation in < 2 mins',
      desc: 'Pick your required service — doctor visit, 12h/24h nursing, attendant care, or home blood draw. Choose an immediate or scheduled doorstep arrival time slot.',
      badge: 'Step 1: Rapid Request',
      mockup: (
        <div className="rounded-xl bg-[#f8fbfb] p-3.5 border border-[#e2eeee] text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2eeee]">
            <span className="font-bold text-[#11191b] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#116b70]" />
              Doctor Home Visit
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#d2e5e6] text-[#116b70] font-semibold">
              Today, 10:30 AM
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#55696d]">
            <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-md border border-[#e8f1f1]">
              <span>Clinical Category:</span>
              <span className="font-bold text-[#11191b]">Internal Medicine</span>
            </div>
            <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-md border border-[#e8f1f1]">
              <span>Triage Queue:</span>
              <span className="font-semibold text-emerald-700">Immediate Dispatch ✓</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      title: 'Council Clinician Dispatched',
      subtitle: 'GPS fleet tracking & route ETA',
      desc: 'A licensed, council-registered healthcare practitioner is assigned. Receive clinician profile credentials, hospital affiliations, and active GPS transit updates.',
      badge: 'Step 2: Live Dispatch',
      mockup: (
        <div className="rounded-xl bg-[#f8fbfb] p-3.5 border border-[#e2eeee] text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2eeee]">
            <span className="font-bold text-[#11191b] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#116b70] animate-ping" />
              Dr. Maya Patel En Route
            </span>
            <span className="text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full text-emerald-800 font-bold border border-emerald-200">
              ETA 38 min
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#55696d]">
            <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-md border border-[#e8f1f1]">
              <span>License ID:</span>
              <span className="font-mono font-bold text-[#11191b]">#MD-49201-CA</span>
            </div>
            <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-md border border-[#e8f1f1]">
              <span>Sterile Kit:</span>
              <span className="font-semibold text-emerald-700">Sealed &amp; Calibrated ✓</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      title: 'Bedside Care with PIN Security',
      subtitle: 'Dual-key OTP handshake & exam',
      desc: 'Your clinician arrives in full PPE with sterilized equipment. Validate their identity via your secret 4-digit PIN before comprehensive, unhurried bedside examination begins.',
      badge: 'Step 3: Clinical Care',
      mockup: (
        <div className="rounded-xl bg-[#f8fbfb] p-3.5 border border-[#e2eeee] text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2eeee]">
            <span className="font-bold text-[#11191b] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Bedside Examination
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              PIN [4829] ✓
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#55696d]">
            <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-md border border-[#e8f1f1]">
              <span>Vitals Monitored:</span>
              <span className="font-bold text-[#11191b]">BP 120/80 &bull; SpO2 99%</span>
            </div>
            <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-md border border-[#e8f1f1]">
              <span>Consultation Time:</span>
              <span className="font-semibold text-[#116b70]">45 Mins Unhurried</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '04',
      title: 'Digital E-Rx & Laboratory Sync',
      subtitle: 'Instant records & coordinated follow-up',
      desc: 'Receive digital prescriptions directly on WhatsApp and your Vellora Portal. Lab results sync electronically with automated medication delivery and 24/7 care coordination.',
      badge: 'Step 4: Care Continuity',
      mockup: (
        <div className="rounded-xl bg-[#f8fbfb] p-3.5 border border-[#e2eeee] text-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e2eeee]">
            <span className="font-bold text-[#11191b] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#116b70]" />
              Digital Care Summary
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#d2e5e6] text-[#116b70] font-semibold">
              QR Verified
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#55696d]">
            <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-md border border-[#e8f1f1]">
              <span>e-Prescription:</span>
              <span className="font-bold text-emerald-700">Issued to WhatsApp ✓</span>
            </div>
            <div className="flex justify-between bg-white px-2.5 py-1.5 rounded-md border border-[#e8f1f1]">
              <span>Lab Diagnostics:</span>
              <span className="font-semibold text-[#116b70]">Direct Portal Sync</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="section bg-white py-20 border-b border-[#e5e9e9]" aria-labelledby="howItWorksTitle">
      <div className="container">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 scroll-reveal">
          <p className="eyebrow text-[#116b70]">STREAMLINED CLINICAL PROCESS</p>
          <h2 id="howItWorksTitle" className="font-heading text-3xl font-extrabold text-[#11191b] md:text-4xl">
            How Home Healthcare Works
          </h2>
          <p className="mt-3 text-sm text-[#55696d] leading-relaxed">
            From initial request to bedside consultation and electronic prescription follow-up — simple, transparent, and completely verified.
          </p>
        </div>

        {/* Connected Process Pathway Illustration */}
        <div className="relative">
          {/* Connecting Pathway Line for Desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-[#116b70]/20 via-[#116b70] to-[#116b70]/20 z-0" />

          {/* 4 Process Milestone Stations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 stagger-container">
            {processStages.map((stage) => (
              <div
                key={stage.num}
                className="flex flex-col justify-between rounded-2xl bg-white p-6 border border-[#e2eeee] shadow-xs hover:border-[#b8dcde] hover:shadow-md transition-all duration-300 scroll-reveal-card"
              >
                <div>
                  {/* Step Bead Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#116b70] text-white font-heading font-black text-base shadow-sm ring-4 ring-[#116b70]/15">
                      {stage.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#116b70] bg-[#eef7f7] px-2.5 py-1 rounded-full border border-[#d2e7e8]">
                      {stage.badge}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-bold text-[#11191b] mb-1">
                    {stage.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#116b70] mb-2.5">
                    {stage.subtitle}
                  </p>
                  <p className="text-xs leading-relaxed text-[#55696d] mb-4">
                    {stage.desc}
                  </p>
                </div>

                {/* Illustrated Interactive Device Mockup */}
                {stage.mockup}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Assurance & Booking CTA */}
        <div className="mt-12 rounded-2xl bg-[#f4f9f9] border border-[#d9ebeb] p-6 text-center max-w-3xl mx-auto scroll-reveal">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#44585c] mb-5">
            <span className="flex items-center gap-1.5">
              <span className="text-[#116b70]">⚡</span> Average Doorstep Dispatch: <strong>42 Mins</strong>
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#116b70]">🛡️</span> 100% Council-Registered Clinicians
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#116b70]">🔒</span> Dual-Key Bedside PIN Protected
            </span>
          </div>

          <button
            type="button"
            onClick={() => openBooking()}
            className="button button-dark"
          >
            <span>Request Home Visit Now</span>
            <Icon name="arrow-right" size="xs" />
          </button>
        </div>
      </div>
    </section>
  );
};
