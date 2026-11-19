'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useBooking } from '@/context/BookingContext';
import {
  Check,
  ShieldCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  Stethoscope,
  PhoneCall,
  CheckCircle2,
} from 'lucide-react';

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const resolvedParams = use(params);
  const rawSlug = resolvedParams?.slug;
  const slug = typeof rawSlug === 'string' ? decodeURIComponent(rawSlug) : '';
  const service = db.getServiceBySlug(slug) || db.getServiceById(slug);
  const { openBooking } = useBooking();

  if (!service) {
    notFound();
  }

  // Get doctors associated with this service category or general
  const specialists = db.getUsersByRole('DOCTOR').slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAF9] text-[#102820]">
      <Header theme="light" />

      {/* Hero Section */}
      <section className="border-b border-[#E2EBE7] bg-white pt-8 pb-12 sm:pt-12 sm:pb-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-[#065F46] hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[#065F46] hover:underline">
              Services
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#102820] truncate max-w-[200px] sm:max-w-none">
              {service.name}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 text-xs font-bold text-[#065F46]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{service.categoryLabel}</span>
              </span>

              <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#102820] tracking-tight mt-3">
                {service.name}
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                {service.shortDesc}
              </p>
            </div>

            {/* Quick Price Card */}
            <div className="rounded-2xl border border-[#CBDCD5] bg-[#F2F8F5] p-5 text-center shrink-0 min-w-[200px]">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Starting Fee
              </p>
              <p className="text-3xl font-extrabold text-[#064E3B] my-1">
                ${service.basePrice}
              </p>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#065F46]">
                <Clock className="h-3 w-3" />
                <span>Duration: {service.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Details Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Service Banner Image */}
            <div className="overflow-hidden rounded-3xl border border-[#E2EBE7] bg-white shadow-xs">
              <img
                src={service.image}
                alt={service.name}
                className="h-72 sm:h-96 w-full object-cover"
              />
              <div className="p-6 sm:p-8">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#102820]">
                  Clinical Overview
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>

                {/* Features & Inclusions */}
                <h3 className="font-heading text-lg font-bold text-[#102820] mt-8 mb-4">
                  Included Bedside Care &amp; Clinical Tasks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-xl border border-[#E2EBE7] bg-[#F8FAF9] p-3.5 text-xs text-[#102820]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ECFDF5] text-[#065F46] font-bold">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                      <span className="leading-snug">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Supported Options & Shifts */}
                <h3 className="font-heading text-lg font-bold text-[#102820] mt-8 mb-4">
                  Available Care Modules &amp; Shift Options
                </h3>
                <div className="space-y-2.5">
                  {service.supportedOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-[#E2EBE7] bg-white p-4 shadow-2xs"
                    >
                      <span className="text-xs font-bold text-[#102820]">{opt}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Doorstep Delivery</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality & Safety Assurance */}
            <div className="rounded-2xl border border-[#D1FAE5] bg-[#ECFDF5]/70 p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-5 w-5 text-[#065F46]" />
                <h3 className="font-heading text-base font-bold text-[#064E3B]">
                  Vellora Clinical Standards &amp; Safety Promise
                </h3>
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                All Vellora practitioners undergo rigorous background checks, council license verifications, and routine clinical protocol audits. For in-home consultations and procedures, we strictly adhere to sterile hospital-grade protocols with tamper-sealed single-use medical kits.
              </p>
            </div>

            {/* Recommended Visiting Doctors */}
            <div className="rounded-2xl border border-[#E2EBE7] bg-white p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#102820]">
                    Available Visiting Specialists
                  </h3>
                  <p className="text-xs text-slate-500">
                    Council-licensed medical doctors available for in-home consultations.
                  </p>
                </div>
                <Link
                  href="/doctors"
                  className="text-xs font-bold text-[#065F46] hover:underline hidden sm:inline-flex items-center gap-1"
                >
                  <span>All Doctors</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {specialists.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/book/doctor/${doc.id}`}
                    className="group rounded-xl border border-[#E2EBE7] p-3 text-left hover:border-[#064E3B] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={doc.avatar || '/assets/doctor-maya-patel.webp'}
                        alt={doc.name}
                        className="h-10 w-10 rounded-full object-cover border border-[#CBDCD5]"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#102820] truncate group-hover:text-[#064E3B]">
                          {doc.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {doc.specialty || 'General Physician'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Booking & Action Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Primary Booking Card */}
            <div className="rounded-3xl border border-[#E2EBE7] bg-white p-6 sm:p-7 shadow-md">
              <h3 className="font-heading text-lg font-extrabold text-[#102820]">
                Ready to Schedule Care?
              </h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Book online in 3 quick steps with flexible date &amp; time slots tailored to your family&apos;s schedule.
              </p>

              <div className="mt-6 space-y-3">
                {/* Fixed direct booking link */}
                <Link
                  href={`/book/service/${service.slug}`}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-[#064E3B] py-3.5 px-5 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors cursor-pointer"
                >
                  <span>Book Online Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => openBooking({ specialty: service.name })}
                  className="flex items-center justify-center gap-2 w-full rounded-full border border-slate-300 bg-white py-3 px-4 text-xs font-bold text-[#102820] hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Quick Request Modal</span>
                </button>
              </div>

              {/* Guarantees List */}
              <div className="mt-6 pt-5 border-t border-[#F0F5F2] text-xs text-slate-600 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                  <span>Upfront transparent fee: <strong>${service.basePrice}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                  <span>Free cancellation up to 4 hours before</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#065F46] shrink-0 stroke-[3]" />
                  <span>Single-use sterile medical kits included</span>
                </div>
              </div>
            </div>

            {/* Need Assistance Card */}
            <div className="rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46]">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-[#102820]">
                    Need Help Deciding?
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                    Speak directly with a Velora clinical care coordinator to determine the right care plan for your loved ones.
                  </p>
                  <a
                    href="tel:+18005550199"
                    className="mt-2.5 inline-block text-xs font-bold text-[#065F46] hover:underline"
                  >
                    Call 1-800-VELORA →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
