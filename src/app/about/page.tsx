import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#11191b] text-white">
        <Header />
        <div className="container py-14 text-center">
          <p className="eyebrow text-teal-300">OUR PHILOSOPHY</p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Where Modern Medicine Meets Compassion
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-300">
            Vellora Health was founded on a simple belief: the highest quality clinical care should meet patients where they are most comfortable — at home.
          </p>
        </div>
      </div>

      <div className="container py-14 space-y-12">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Patient-Centered Mission</span>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
              Eliminating the Friction in Everyday Healthcare
            </h2>
            <p className="mt-4 text-xs leading-relaxed text-gray-700">
              Traditional healthcare often forces patients and families through crowded waiting rooms, difficult transit, and disconnected appointment silos. Vellora re-engineers this experience by integrating licensed doctors, skilled nurses, and caretakers into an accessible mobile service.
            </p>
            <p className="mt-3 text-xs leading-relaxed text-gray-700">
              Whether you need an acute physician consultation for your elderly parent, continuous post-operative wound care, or regular diabetic blood tests, we manage the entire care lifecycle with transparency and clinical accountability.
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
            <img src="/assets/care.webp" alt="Vellora Physician Care" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Icon name="shield" />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">Verified Personnel Only</h3>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Every professional undergoes a 5-step background verification: medical licensing, degree validation, police clearance, and in-person clinical skill testing.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Icon name="clock" />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">Punctual &amp; Transparent</h3>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Scheduled 1-hour appointment windows with live arrival tracking. Clear, fixed pricing before you book with no surprise invoices.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Icon name="file" />
            </div>
            <h3 className="mt-4 text-base font-bold text-gray-900">Connected Digital Records</h3>
            <p className="mt-2 text-xs text-gray-600 leading-relaxed">
              Digital prescriptions, nursing vitals logs, and laboratory reports are synchronized automatically into your private family medical portal.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
