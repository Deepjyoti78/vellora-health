'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck, Award, ArrowRight, MapPin, CheckCircle2 } from 'lucide-react';

export const TopDoctorCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E2EBE7] bg-white p-6 shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
            Star Clinician
          </span>
          <h3 className="font-heading text-base font-bold text-[#102820]">
            Top Performer of the Week
          </h3>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-bold text-[#065F46]">
          <Award className="h-3.5 w-3.5" />
          <span>#1 Ranked</span>
        </span>
      </div>

      {/* Doctor Profile Banner */}
      <div className="mt-5 flex items-center gap-4 rounded-2xl bg-gradient-to-br from-[#F2F8F5] to-[#ECFDF5] p-4 border border-[#D1FAE5]">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white shadow-sm bg-white">
          <Image
            src="/assets/doctor-maya-patel.jpg"
            alt="Dr. Maya Patel"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="truncate font-heading text-base font-bold text-[#102820]">
              Dr. Maya Patel
            </h4>
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#065F46]" />
          </div>
          <p className="truncate text-xs font-medium text-slate-500">
            Cardiologist & General Medicine
          </p>
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="ml-1 text-xs font-bold text-[#102820]">4.9</span>
            </div>
            <span className="text-[11px] text-slate-400">• 186 reviews</span>
          </div>
        </div>
      </div>

      {/* Operational Metrics Grid */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-y border-[#F2F8F5] py-4 text-center">
        <div>
          <span className="block font-heading text-lg font-bold text-[#102820]">
            248
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            Visits Done
          </span>
        </div>
        <div className="border-x border-[#F2F8F5]">
          <span className="block font-heading text-lg font-bold text-[#065F46]">
            99.2%
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            On-Time ETA
          </span>
        </div>
        <div>
          <span className="block font-heading text-lg font-bold text-[#102820]">
            100%
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            e-Rx Sync
          </span>
        </div>
      </div>

      {/* Live Status & CTA */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#065F46]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          </span>
          <span>On Doorstep Duty</span>
        </div>
        <Link
          href="/admin/providers"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#064E3B] hover:text-[#065F46] group transition-colors"
        >
          <span>View Profile</span>
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
