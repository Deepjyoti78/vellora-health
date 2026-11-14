'use client';

import React from 'react';
import { EXPERIENCE_ITEMS } from '@/data/site-content';
import { Icon, IconName } from '@/components/common/Icon';

export const ExperienceSection: React.FC = () => {
  const safetyPillars = [
    {
      step: '01',
      title: 'Sterile Single-Use & Cold-Chain Kits',
      badge: 'STERILE HOSPITAL STANDARDS',
      desc: 'All syringes, wound dressings, and diagnostics are vacuum-sealed in single-use packs and opened in front of the patient. Lab samples travel in active 2°C–8°C calibrated cold-chain carriers.',
      icon: 'shield',
      illustration: (
        <div className="mt-4 rounded-xl bg-[#f4f9f9] p-3.5 border border-[#d9ebeb] text-xs">
          <div className="flex items-center justify-between font-bold text-[#11191b] mb-2">
            <span className="flex items-center gap-1.5 text-[#116b70]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Sterile Kit #VT-8840
            </span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#cbe2e2] text-[#116b70]">
              2°C - 8°C ✓
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#55696d]">
            <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded-md border border-[#e4eeef]">
              <span>Single-use sterile field pack</span>
              <span className="font-semibold text-emerald-700">Sealed</span>
            </div>
            <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded-md border border-[#e4eeef]">
              <span>Calibrated diagnostic phlebotomy</span>
              <span className="font-semibold text-emerald-700">Verified</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: '02',
      title: 'Dual 4-Digit Bedside PIN Handshake',
      badge: '100% IDENTITY PROTECTED',
      desc: 'Never open your door to uncertainty. You receive a unique 4-digit verification PIN via SMS. The visiting clinician must enter this code on their device before physical entry and treatment begin.',
      icon: 'lock',
      illustration: (
        <div className="mt-4 rounded-xl bg-[#f4f9f9] p-3.5 border border-[#d9ebeb] text-xs">
          <div className="flex items-center justify-between font-bold text-[#11191b] mb-2">
            <span className="text-[#116b70] text-[11px] uppercase tracking-wider">Bedside Security Handshake</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
              OTP MATCHED ✓
            </span>
          </div>
          <div className="flex items-center justify-center gap-2 py-1">
            {['4', '8', '2', '9'].map((digit, i) => (
              <div key={i} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[#cbe2e2] font-mono text-sm font-black text-[#11191b] shadow-xs">
                {digit}
              </div>
            ))}
          </div>
          <p className="mt-1 text-center text-[10px] text-[#55696d]">Clinician identity confirmed before bedside entry</p>
        </div>
      ),
    },
    {
      step: '03',
      title: 'Real-Time Dispatch & 15-Min ER Backup',
      badge: 'RAPID DOORSTEP RESPONSE',
      desc: 'Live GPS vehicle dispatch tracks your clinician’s route in real time. For acute escalations, our field team has direct tele-ICU connection and prioritized emergency hospital escalation.',
      icon: 'clock',
      illustration: (
        <div className="mt-4 rounded-xl bg-[#f4f9f9] p-3.5 border border-[#d9ebeb] text-xs">
          <div className="flex items-center justify-between font-bold text-[#11191b] mb-2">
            <span className="text-[#116b70] flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#116b70] animate-ping" />
              Live Route Telemetry
            </span>
            <span className="font-mono text-xs font-bold text-[#11191b]">ETA: 34 mins</span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#55696d]">
            <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded-md border border-[#e4eeef]">
              <span>Dr. Maya Patel (MD Geriatrics)</span>
              <span className="font-semibold text-[#116b70]">En Route</span>
            </div>
            <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded-md border border-[#e4eeef]">
              <span>Hospital Intensive Care Hotline</span>
              <span className="font-semibold text-emerald-700">Standby &lt; 15m</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      step: '04',
      title: 'Digital E-Prescriptions & Direct Lab Sync',
      badge: 'INSTANT CLINICAL RECORDS',
      desc: 'Immediately following the visit, complete consultation notes, signed e-prescriptions, and barcoded diagnostic requisition orders appear in your secure patient portal and via instant WhatsApp.',
      icon: 'file',
      illustration: (
        <div className="mt-4 rounded-xl bg-[#f4f9f9] p-3.5 border border-[#d9ebeb] text-xs">
          <div className="flex items-center justify-between font-bold text-[#11191b] mb-2">
            <span className="text-[#116b70] text-[11px] uppercase tracking-wider">Digital Health Record</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-[#cbe2e2] text-[#116b70]">
              QR-Signed
            </span>
          </div>
          <div className="space-y-1.5 text-[11px] text-[#55696d]">
            <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded-md border border-[#e4eeef]">
              <span>Electronic Prescription (e-Rx)</span>
              <span className="font-semibold text-emerald-700">Generated ✓</span>
            </div>
            <div className="flex items-center justify-between bg-white px-2.5 py-1 rounded-md border border-[#e4eeef]">
              <span>NABL Barcoded Lab Specimen</span>
              <span className="font-semibold text-[#116b70]">In Transit</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="section section-experience" aria-labelledby="experienceTitle">
      <div className="container">
        <div className="section-heading-row experience-header scroll-reveal">
          <div>
            <p className="eyebrow">WHY CHOOSE VELLORA HEALTH</p>
            <h2 id="experienceTitle">
              Hospital-Standard Safety.<br />Doorstep Convenience.
            </h2>
          </div>
          <p className="experience-intro">
            We bring verified medical excellence directly to your residence, prioritizing patient dignity, family peace of mind, and transparent clinical standards.
          </p>
        </div>

        {/* Illustrated Safety & Convenience Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 stagger-container mb-10">
          {safetyPillars.map((pillar) => (
            <div
              key={pillar.step}
              className="flex flex-col justify-between rounded-2xl bg-white p-6 border border-[#e1e9ea] shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#c5ddde] scroll-reveal-card"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#116b70] bg-[#eef7f7] px-2.5 py-1 rounded-full border border-[#d2e7e8]">
                    {pillar.badge}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0f6f6] text-[#116b70]">
                    <Icon name={pillar.icon as IconName} size="xs" />
                  </div>
                </div>

                <h3 className="font-heading text-[15px] font-bold text-[#11191b] leading-snug mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#55696d]">
                  {pillar.desc}
                </p>
              </div>

              {pillar.illustration}
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
