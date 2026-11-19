'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FileText, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFCFB] text-[#15212B] font-sans antialiased">
      <Header theme="light" />

      {/* Hero Banner */}
      <section className="border-b border-[#E2EBE7] bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-xs font-bold text-[#065F46] uppercase tracking-wider mb-4">
            <FileText className="h-3.5 w-3.5" />
            <span>Clinical Terms of Care</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102820] tracking-tight">
            Terms of Service &amp; Clinical Care Agreement
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            Important terms, informed consent guidelines, emergency disclaimers, and cancellation policies governing in-home healthcare services provided by Vellora Health.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Effective Date: November 2026 • Vellora Healthcare Clinical Services Council
          </p>
        </div>
      </section>

      {/* Main Terms Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-10 text-sm sm:text-[15px] leading-relaxed text-slate-700">
        {/* Critical Emergency Disclaimer */}
        <section className="rounded-2xl bg-amber-50 border border-amber-200 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="font-heading text-base sm:text-lg font-bold text-amber-900 mb-1">
                Emergency Medical Notice &amp; Scope of Care
              </h2>
              <p className="text-amber-800 text-xs sm:text-sm leading-relaxed">
                Vellora Health provides scheduled, elective, and continuing in-home clinical care, nursing, attendant care, and diagnostic sample collection. <strong>We do not operate as an emergency department or ambulance trauma response.</strong> If you or a family member is suffering from an acute life-threatening emergency (such as severe chest pain, signs of stroke, severe respiratory distress, acute profuse hemorrhaging, or loss of consciousness), <strong>call 911 / 112 immediately or proceed to the nearest emergency room.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* 1. Services Provided */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#102820]">
            1. Clinical Services Provided
          </h2>
          <p>
            Vellora coordinates in-home visits conducted by board-certified physicians, licensed registered nurses, certified nursing assistants (caretakers), and qualified phlebotomists. Services include bedside diagnostic physical examinations, wound dressings, catheterizations, IV therapy, diagnostic specimen draws, and personalized chronic disease follow-ups.
          </p>
        </section>

        {/* 2. Prescription Policy */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#102820]">
            2. Prescription &amp; Controlled Substances Policy
          </h2>
          <p>
            Visiting doctors evaluate patients in accordance with medical ethics and evidence-based standards. <strong>Vellora physicians strictly DO NOT prescribe Schedule II through IV controlled substances, narcotics, or opioids during home visits.</strong> Prescriptions for routine maintenance therapies, antibiotics, cardiovascular medications, and non-opioid therapeutics are provided digitally directly to the patient portal or partner pharmacy.
          </p>
        </section>

        {/* 3. Bedside Safety PIN & Identification Handshake */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#102820]">
            3. In-Home Safety Protocols &amp; Bedside PIN Handshake
          </h2>
          <p>
            For the safety of patients and clinical staff:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Patients receive a unique, dynamic 4-digit Bedside Verification PIN via SMS and Patient Portal upon clinician dispatch.</li>
            <li>The visiting clinician must verify this PIN upon entry before physical examination or clinical treatment commences.</li>
            <li>Clinicians are equipped with verified photo ID badges, sterile single-use clinical kits, and cold-chain calibrated sample carriers.</li>
            <li>Patients must ensure a safe and non-hazardous residential environment during the home visit.</li>
          </ul>
        </section>

        {/* 4. Scheduling, Fees & Cancellation Policy */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#102820]">
            4. Transparent Pricing, Rescheduling &amp; Cancellations
          </h2>
          <p>
            All visit fees are transparently displayed before booking confirmation. No hidden charges or administrative fees apply:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Cancellations &gt; 2 Hours Before Visit:</strong> Full refund or 100% credit toward rescheduling.</li>
            <li><strong>Late Cancellations (&lt; 2 Hours Before Visit):</strong> A modest $25 clinical dispatch mobilization fee may apply to cover clinician transit.</li>
            <li><strong>Payment Methods:</strong> Pay securely online via portal card payment or upon clinician arrival (cashless digital payment).</li>
          </ul>
        </section>

        {/* 5. Informed Clinical Consent */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#102820]">
            5. Patient Informed Consent
          </h2>
          <p>
            By booking a service on Vellora Health, you consent to receive in-home healthcare examination, diagnostic testing, or nursing care from licensed medical personnel. You have the right to ask questions regarding the diagnosis, proposed treatment plan, and potential risks, and you retain the right to decline or discontinue any specific intervention at any time.
          </p>
        </section>

        {/* Contact Info */}
        <section className="rounded-2xl bg-[#F0F7F3] border border-[#CDE5D8] p-6 sm:p-8">
          <h2 className="font-heading text-lg font-bold text-[#064E3B] mb-2">
            Clinical Care Council Inquiries
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            For questions regarding clinical policies or patient agreements, email{' '}
            <a href="mailto:support@vellorahealth.com" className="font-semibold text-[#065F46] hover:underline">
              support@vellorahealth.com
            </a>{' '}
            or write to: Vellora Health Clinical Council, 500 Howard Street, Suite 400, San Francisco, CA 94105.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
