import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { FACILITIES_DATA } from '@/data/site-content';

export default function FacilitiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#11191b] text-white">
        <Header />
        <div className="container py-14 text-center">
          <p className="eyebrow text-teal-300">CLINICAL EXCELLENCE &amp; SAFETY</p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            State-of-the-Art Facilities &amp; Standards
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-300">
            From our accredited central partner laboratories to sterile portable mobile ICU and infusion equipment, we adhere to hospital-grade patient protocols.
          </p>
        </div>
      </div>

      <div className="container py-14">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FACILITIES_DATA.filter(f => !f.isSolid).map((fac) => (
            <div
              key={fac.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="h-60 w-full overflow-hidden bg-gray-100">
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900">{fac.title}</h2>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed">
                  Engineered with strict clinical environmental sterilization, advanced ergonomics, and modern medical technology to support optimal healing.
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-[#11191b] p-8 text-white md:p-12">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Diagnostic Partner Laboratories
            </span>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">
              NABL &amp; CAP-Accredited Diagnostic Infrastructure
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-gray-300">
              All specimen samples collected at home are transported in temperature-controlled cold-chain containers with unique barcode tracking directly into our reference laboratories, ensuring the highest accuracy and integrity for your test results.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/services/home-lab-investigations" className="button button-white button-sm">
                Book Diagnostic Test <Icon name="arrow-right" size="xs" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
