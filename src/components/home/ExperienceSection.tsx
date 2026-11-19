'use client';

import React from 'react';

export const ExperienceSection: React.FC = () => {
  const safetyCards = [
    {
      num: '001',
      title: 'Sterile Single-Use Kits',
      subtitle: 'Hospital-grade infection control protocols',
      desc: 'Work with certified, vacuum-sealed single-use clinical packs for all cannulas, sterile dressings, and diagnostic sets — opened in front of the patient in the comfort of your home.',
    },
    {
      num: '002',
      title: 'Dual 4-Digit Bedside PIN',
      subtitle: '100% verified provider identity handshake',
      desc: 'Never open your door to uncertainty. You receive a unique 4-digit verification PIN via SMS. The visiting clinician must enter this code on their device before physical entry and examination begins.',
    },
    {
      num: '003',
      title: 'Cold-Chain Calibrated Transit',
      subtitle: 'Active 2°C–8°C specimen temperature control',
      desc: 'Phlebotomy blood samples and biologics travel in calibrated temperature-monitored cold carriers directly to accredited NABL partner laboratories for pristine diagnostic accuracy.',
    },
    {
      num: '004',
      title: 'Real-Time GPS Fleet Tracking',
      subtitle: 'Immediate dispatch with live route updates',
      desc: 'Track your assigned visiting physician or registered nurse with live map telemetry and accurate arrival ETAs, eliminating anxious waiting and uncertain arrival windows.',
    },
    {
      num: '005',
      title: 'Instant Bedside E-Prescriptions',
      subtitle: 'Encrypted digital records sent to WhatsApp & Portal',
      desc: 'Immediately following the consultation, digital prescriptions with QR doctor signatures and visit summaries sync directly to your patient portal and phone with optional home pharmacy delivery.',
    },
    {
      num: '006',
      title: '24/7 Command Desk & ICU Escalation',
      subtitle: 'Standby emergency intensive care backup',
      desc: 'Every home clinician maintains continuous communication with senior board intensivists and priority ambulance transfer pipelines with a strict < 15-minute emergency escalation protocol.',
    },
  ];

  return (
    <section className="section py-14 sm:py-18" id="standards" aria-labelledby="experienceTitle">
      <div className="container">
        {/* Section Heading */}
        <div className="section-heading-row experience-header scroll-reveal mb-12">
          <div>
            <p className="eyebrow text-[#065F46] font-bold tracking-wider uppercase">WHY CHOOSE VELLORA HEALTH</p>
            <h2 id="experienceTitle" className="font-heading text-3xl font-extrabold text-[#11191B] md:text-5xl tracking-tight leading-tight">
              Hospital-Standard Safety.<br />Doorstep Convenience.
            </h2>
          </div>
          <p className="experience-intro text-sm md:text-base text-[#55696D] leading-relaxed !max-w-[580px]">
            We bring verified medical excellence directly to your residence, prioritizing patient dignity, family peace of mind, and transparent clinical standards.
          </p>
        </div>

        {/* 6 Cards Grid (3 columns x 2 rows) - Clean White base with Smooth Greenish Gradient on Hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-container">
          {safetyCards.map((card) => (
            <div
              key={card.num}
              className="group relative flex flex-col justify-between rounded-3xl bg-white hover:bg-gradient-to-br hover:from-[#064E3B] hover:via-[#043D2E] hover:to-[#022A20] border border-[#E5EAE7] hover:border-[#10B981]/70 p-7 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(6,78,59,0.25)] transition-all duration-700 ease-out hover:-translate-y-2 scroll-reveal-card cursor-pointer"
            >
              <div>
                {/* Top Row: Star Sparkle Badge + Monospace Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF5F0] group-hover:bg-[#10B981] text-[#065F46] group-hover:text-white text-base font-black shadow-xs border border-[#D1E6DC] group-hover:border-transparent transition-all duration-700 ease-out">
                    ✦
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-400 group-hover:text-emerald-200 tracking-wider transition-colors duration-700 ease-out">
                    {card.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-bold text-[#11191B] group-hover:text-white mb-2 leading-snug transition-colors duration-700 ease-out">
                  {card.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs font-semibold text-[#065F46] group-hover:text-emerald-300 mb-3 leading-snug transition-colors duration-700 ease-out">
                  {card.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs leading-relaxed text-[#55696D] group-hover:text-emerald-50/90 transition-colors duration-700 ease-out">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
