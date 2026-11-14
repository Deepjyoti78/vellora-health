'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { useBooking } from '@/context/BookingContext';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const service = db.getServiceBySlug(slug);
  const { openBooking } = useBooking();

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#11191b] text-white">
        <Header />
        <div className="container py-12">
          <div className="flex items-center gap-2 text-xs text-teal-300">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:underline">Services</Link>
            <span>/</span>
            <span className="text-white">{service.name}</span>
          </div>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="rounded-full bg-teal-900/60 px-3 py-1 text-xs font-semibold text-teal-200">
                {service.categoryLabel}
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-5xl">
                {service.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-300">
                {service.shortDesc}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Starting From</p>
              <p className="text-3xl font-extrabold text-white">${service.basePrice}</p>
              <p className="text-[11px] text-teal-300">Estimated Duration: {service.duration}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <img
                src={service.image}
                alt={service.name}
                className="h-80 w-full object-cover"
              />
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900">About This Service</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">
                  {service.description}
                </p>

                <h3 className="mt-8 text-lg font-bold text-gray-900">
                  Included Clinical Care &amp; Tasks
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#fbfdfc] p-3 text-xs text-gray-800"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-100 font-bold text-teal-800">
                        ✓
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <h3 className="mt-8 text-lg font-bold text-gray-900">
                  Available Service &amp; Shift Options
                </h3>
                <div className="mt-4 space-y-2.5">
                  {service.supportedOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3.5 shadow-sm"
                    >
                      <span className="text-xs font-semibold text-gray-800">{opt}</span>
                      <span className="text-xs font-bold text-teal-700">Available Daily</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality & Safety Assurance */}
            <div className="rounded-2xl border border-teal-100 bg-[#eaf4f3] p-6 text-gray-800">
              <h3 className="text-base font-bold text-[#116b70]">
                Vellora Clinical Standards &amp; Safety Promise
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-700">
                All Vellora practitioners undergo rigorous background verification, state medical/nursing council credential verification, and routine protocol audits. We strictly use single-use sterile medical kits and hospital-grade sanitization protocols for every in-home visit.
              </p>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
              <h3 className="text-lg font-bold text-gray-900">Ready to Book?</h3>
              <p className="mt-2 text-xs text-gray-600">
                Select your preferred appointment date, time, and patient details in just 3 quick steps.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href={`/patient/book/service?serviceId=${service.id}`}
                  className="button button-dark w-full justify-center"
                >
                  Book Online Now <Icon name="arrow-right" size="sm" />
                </Link>
                <button
                  type="button"
                  onClick={() => openBooking({ specialty: service.name })}
                  className="button button-line-dark w-full justify-center text-xs"
                >
                  Quick Appointment Request
                </button>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="clock" size="xs" className="text-teal-600" />
                  <span>Transparent upfront pricing — no hidden fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="shield" size="xs" className="text-teal-600" />
                  <span>Free cancellation up to 4 hours before visit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" size="xs" className="text-teal-600" />
                  <span>100% verified &amp; certified medical personnel</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Need Help Choosing?
              </h4>
              <p className="mt-2 text-xs text-gray-700">
                Speak directly with a Vellora care coordinator to assess which level of nursing or attendant care best matches your family&apos;s medical needs.
              </p>
              <div className="mt-4">
                <Link
                  href="/contact"
                  className="text-xs font-bold text-teal-700 hover:underline"
                >
                  Contact Care Team →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
