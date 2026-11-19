import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Stethoscope,
  Activity,
  User,
  Home,
  PhoneCall,
  Search,
  ArrowRight,
} from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAF9] text-[#102820]">
      <Header theme="light" />

      <main className="container max-w-3xl mx-auto px-4 py-14 sm:py-20 text-center my-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-xs font-bold text-[#065F46] mb-4">
          <span>Error 404</span>
          <span>•</span>
          <span>Page Not Found</span>
        </span>

        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#102820] tracking-tight">
          Looking for In-Home Medical Care?
        </h1>

        <p className="mt-3 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          The healthcare service, doctor profile, or record you requested could not be located. Explore our certified services directory or return to the homepage.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-[#102820] shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <Search className="h-4 w-4 text-slate-500" />
            <span>Browse Care Directory</span>
          </Link>
        </div>

        {/* Quick Navigation Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <Link
            href="/services"
            className="group rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs hover:border-[#064E3B] hover:shadow-md transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46] mb-3 group-hover:scale-105 transition-transform">
              <Activity className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-extrabold text-[#102820]">
              In-Home Services
            </h2>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              Doctors, nursing, attendants, and lab tests at home.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#065F46] group-hover:underline">
              <span>View catalog</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>

          <Link
            href="/doctors"
            className="group rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs hover:border-[#064E3B] hover:shadow-md transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46] mb-3 group-hover:scale-105 transition-transform">
              <Stethoscope className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-extrabold text-[#102820]">
              Verified Doctors
            </h2>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              Browse council-licensed visiting physicians &amp; specialists.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#065F46] group-hover:underline">
              <span>Find a doctor</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>

          <Link
            href="/patient/dashboard"
            className="group rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs hover:border-[#064E3B] hover:shadow-md transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46] mb-3 group-hover:scale-105 transition-transform">
              <User className="h-5 w-5" />
            </div>
            <h2 className="text-sm font-extrabold text-[#102820]">
              Patient Portal
            </h2>
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">
              Manage your upcoming visits, family profiles &amp; records.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#065F46] group-hover:underline">
              <span>Open dashboard</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>

        {/* 24/7 Helpline Strip */}
        <div className="mt-10 pt-6 border-t border-[#E2EBE7] flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500">
          <PhoneCall className="h-4 w-4 text-[#065F46]" />
          <span>Need urgent clinical assistance?</span>
          <a href="tel:+18005550199" className="font-bold text-[#064E3B] hover:underline">
            Call 1-800-VELORA (1-800-555-0199)
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
