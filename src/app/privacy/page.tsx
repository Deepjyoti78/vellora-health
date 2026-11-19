'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFCFB] text-[#15212B] font-sans antialiased">
      <Header theme="light" />

      {/* Hero Banner */}
      <section className="border-b border-[#E2EBE7] bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-xs font-bold text-[#065F46] uppercase tracking-wider mb-4">
            <Lock className="h-3.5 w-3.5" />
            <span>Clinical Data Governance</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102820] tracking-tight">
            Privacy Policy &amp; HIPAA Practices
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            How Vellora Healthcare protects your protected health information (PHI), clinical records, and in-home consultation data.
          </p>
          <p className="mt-2 text-xs text-slate-400">
            Last Updated: November 2026 • Compliant with HIPAA, HITECH, and Clinical Data Protection Standards
          </p>
        </div>
      </section>

      {/* Main Legal Content */}
      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-12 sm:py-16 space-y-10 text-sm sm:text-[15px] leading-relaxed text-slate-700">
        {/* Notice of Privacy Practices */}
        <section className="bg-white rounded-2xl border border-[#E2EBE7] p-6 sm:p-8 shadow-xs">
          <h2 className="font-heading text-xl font-bold text-[#102820] mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#065F46]" />
            1. Notice of Privacy Practices (HIPAA)
          </h2>
          <p>
            This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully. Vellora Healthcare is dedicated to maintaining the confidentiality of your personal health information (PHI) in compliance with the Health Insurance Portability and Accountability Act (HIPAA) and applicable regional clinical privacy laws.
          </p>
        </section>

        {/* What Information We Collect */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#102820]">
            2. Health Information We Collect
          </h2>
          <p>
            When you schedule an in-home medical consultation, nursing care visit, diagnostic specimen collection, or attendant care session, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Demographic Details:</strong> Full legal name, date of birth, emergency contact, residence address, and contact numbers.</li>
            <li><strong>Clinical Intake Data:</strong> Medical history, existing conditions, current medications, drug allergies, and active symptoms.</li>
            <li><strong>Bedside Consultation Records:</strong> Vital signs (BP, SpO2, pulse, blood glucose, temperature), clinical notes, and physical examination summaries.</li>
            <li><strong>Diagnostic Specimen Logs:</strong> Laboratory order requisitions, chain-of-custody timestamps, and verified diagnostic laboratory results.</li>
            <li><strong>Authentication &amp; Security Data:</strong> Dual 4-digit bedside verification PINs and encrypted transaction records.</li>
          </ul>
        </section>

        {/* How We Use Your PHI */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#102820]">
            3. Permitted Uses &amp; Disclosures
          </h2>
          <p>
            We use and disclose your Protected Health Information strictly for:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="rounded-xl border border-[#E2EBE7] bg-white p-4">
              <h3 className="font-bold text-[#065F46] text-xs uppercase tracking-wider mb-1">Clinical Treatment</h3>
              <p className="text-xs text-slate-600">Providing, coordinating, and managing in-home care between visiting physicians, nurses, and allied clinicians.</p>
            </div>
            <div className="rounded-xl border border-[#E2EBE7] bg-white p-4">
              <h3 className="font-bold text-[#065F46] text-xs uppercase tracking-wider mb-1">Care Operations</h3>
              <p className="text-xs text-slate-600">Conducting clinical audit reviews, clinician credentialing, protocol safety audits, and customer support.</p>
            </div>
            <div className="rounded-xl border border-[#E2EBE7] bg-white p-4">
              <h3 className="font-bold text-[#065F46] text-xs uppercase tracking-wider mb-1">Payment &amp; Invoicing</h3>
              <p className="text-xs text-slate-600">Generating transparent itemized digital receipts, insurance claim documentation, and visit invoices.</p>
            </div>
          </div>
        </section>

        {/* Encryption & Security Architecture */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#102820]">
            4. Data Security &amp; Encryption Standards
          </h2>
          <p>
            Vellora utilizes industry-leading enterprise encryption protocols:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li><strong>Data in Transit:</strong> Encrypted using TLS 1.3 cryptographic protocols across all portal, mobile, and API channels.</li>
            <li><strong>Data at Rest:</strong> Encrypted using AES-256 standard encryption on dedicated HIPAA-compliant database infrastructure.</li>
            <li><strong>Bedside Security PIN:</strong> Proprietary dynamic 4-digit verification code generated exclusively for patient and clinician handshake.</li>
            <li><strong>Role-Based Access Control (RBAC):</strong> Visiting clinicians can access records only for patients assigned to their active care shifts.</li>
          </ul>
        </section>

        {/* Patient Rights */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#102820]">
            5. Your Legal Rights Under HIPAA
          </h2>
          <p>
            As a patient, you retain the legal right to:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Inspect and export an electronic copy of your unified clinical records via your Patient Portal.</li>
            <li>Request corrections to any inaccurate health information.</li>
            <li>Request confidential communications through preferred phone numbers or addresses.</li>
            <li>Receive an accounting of non-routine disclosures of your health records.</li>
            <li>Revoke clinical consent for non-essential communications at any time.</li>
          </ul>
        </section>

        {/* Contact Clinical Privacy Officer */}
        <section className="rounded-2xl bg-[#F0F7F3] border border-[#CDE5D8] p-6 sm:p-8">
          <h2 className="font-heading text-lg font-bold text-[#064E3B] mb-2">
            Questions or Privacy Inquiries?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            Contact our Clinical Privacy Officer at{' '}
            <a href="mailto:privacy@vellorahealth.com" className="font-semibold text-[#065F46] hover:underline">
              privacy@vellorahealth.com
            </a>{' '}
            or call our 24/7 Care Coordination Desk at{' '}
            <span className="font-semibold text-[#102820]">+1 (800) 835-5672</span>.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
