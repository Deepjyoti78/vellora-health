'use client';

import React from 'react';
import Link from 'next/link';
import { User, ArrowUpRight, ArrowUp, Calendar } from 'lucide-react';

interface FeaturedDoctorCardProps {
  name?: string;
  specialty?: string;
  consultations?: number | string;
  trend?: string;
  image?: string;
}

export const FeaturedDoctorCard: React.FC<FeaturedDoctorCardProps> = ({
  name = 'Dr. Arjun Mehta',
  specialty = 'Cardiologist',
  consultations = 248,
  trend = '+12%',
  image = '/assets/top-doctor-illustration-clean.png',
}) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-[20px] border border-[#E2EBE7] bg-white p-5 sm:p-6 shadow-xs transition-all hover:border-[#CBDCD5]">
      {/* Header: User Icon + "Top Doctor" + Dark Green Arrow Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#075239]">
            <User className="h-4 w-4 fill-[#075239] text-[#075239]" />
          </div>
          <h3 className="font-heading text-base font-bold text-[#102820]">
            Top Doctor
          </h3>
        </div>

        <Link
          href="/admin/providers"
          className="group flex h-8 w-8 items-center justify-center rounded-full bg-[#075239] text-white hover:bg-[#06422D] transition-colors shadow-2xs"
          aria-label="View doctor profile"
        >
          <ArrowUpRight className="h-4 w-4 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* Middle: Doctor Illustration with Soft Mint Backdrop */}
      <div className="my-2 sm:my-3 flex items-center justify-center min-h-[130px] flex-1">
        <div className="relative flex items-center justify-center">
          <img
            src={image}
            alt={name}
            className="h-32 sm:h-36 w-auto object-contain"
          />
        </div>
      </div>

      {/* Bottom: Doctor Name, Specialty, Metric & Pagination Dots */}
      <div className="space-y-3">
        <div>
          <h4 className="font-heading text-base font-extrabold text-[#102820] tracking-tight">
            {name}
          </h4>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {specialty}
          </p>
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Calendar className="h-4 w-4 text-slate-400 stroke-[1.8]" />
            <span>
              <strong className="font-bold text-[#102820]">{consultations}</strong> Consultations
            </span>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-bold text-[#059669] border border-[#A7F3D0]/60">
            <ArrowUp className="h-3 w-3 stroke-[2.5]" />
            <span>{trend}</span>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#075239]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#D1DCD6]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#D1DCD6]" />
        </div>
      </div>
    </div>
  );
};
