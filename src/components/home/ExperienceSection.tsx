'use client';

import React from 'react';
import { EXPERIENCE_ITEMS } from '@/data/site-content';
import { Icon, IconName } from '@/components/common/Icon';

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
    <section className="section bg-white py-20 border-b border-[#e5e9e9]" id="standards" aria-labelledby="experienceTitle">
      <div className="container">
        {/* Section Heading */}
        <div className="section-heading-row experience-header scroll-reveal mb-12">
          <div>
            <p className="eyebrow text-[#116b70]">WHY CHOOSE VELLORA HEALTH</p>
            <h2 id="experienceTitle" className="font-heading text-3xl font-extrabold text-[#11191b] md:text-5xl tracking-tight leading-tight">
              Hospital-Standard Safety.<br />Doorstep Convenience.
            </h2>
          </div>
          <p className="experience-intro text-sm md:text-base text-[#55696d] leading-relaxed max-w-xl">
            We bring verified medical excellence directly to your residence, prioritizing patient dignity, family peace of mind, and transparent clinical standards.
          </p>
        </div>

        {/* 6 Cards Grid - Matching Image 2 (3 columns x 2 rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-container mb-12">
          {safetyCards.map((card) => (
            <div
              key={card.num}
              className="flex flex-col justify-between rounded-3xl bg-white p-8 border border-[#e5e9ea] shadow-xs hover:border-[#b8dcde] hover:shadow-md transition-all duration-300 scroll-reveal-card"
            >
              <div>
                {/* Top Row: Star Sparkle Badge + Monospace Number */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7f7] text-[#116b70] text-base font-black shadow-xs">
                    ✦
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-400 tracking-wider">
                    {card.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-heading text-xl font-bold text-[#11191b] mb-1.5 leading-snug">
                  {card.title}
                </h3>

                {/* Subtitle */}
                <p className="text-xs font-semibold text-[#116b70] mb-3 leading-snug">
                  {card.subtitle}
                </p>

                {/* Description */}
                <p className="text-xs leading-relaxed text-[#55696d]">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Convenience Pill Row */}
        <div className="experience-grid stagger-container">
          {EXPERIENCE_ITEMS.map((item, idx) => (
            <div key={idx} className="experience-pill scroll-reveal-card">
              <Icon name={item.icon as IconName} /> {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
