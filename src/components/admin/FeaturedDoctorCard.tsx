'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Stethoscope, ArrowUpRight, Star } from 'lucide-react';

interface FeaturedDoctorCardProps {
  name?: string;
  specialty?: string;
  consultations?: number | string;
  trend?: string;
  rating?: number;
  image?: string;
}

export const FeaturedDoctorCard: React.FC<FeaturedDoctorCardProps> = ({
  name = 'Dr. Maya Patel',
  specialty = 'Cardiologist & General Medicine',
  consultations = '248 Consultations',
  trend = '+14% this month',
  rating = 4.9,
  image = '/assets/doctor-maya-patel.webp',
}) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-[18px] border border-[#E2EBE7] bg-white p-6 shadow-xs transition-all hover:border-[#CBDCD5]">
      {/* Header: Icon + "Top Doctor" + Circular Arrow button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#07583F]">
            <Stethoscope className="h-4 w-4 stroke-[2.2]" />
          </div>
          <h3 className="font-heading text-base font-bold text-[#102820]">
            Top Doctor
          </h3>
        </div>

        <Link
          href="/admin/providers"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E2EBE7] bg-white text-slate-500 shadow-2xs hover:bg-[#F2F8F5] hover:text-[#07583F] transition-colors"
          aria-label="View doctor profile"
        >
          <ArrowUpRight className="h-4 w-4 stroke-[2.2]" />
        </Link>
      </div>

      {/* Middle: Doctor Portrait with Soft Abstract Mint Shape */}
      <div className="my-5 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* Organic soft mint background backdrop */}
          <div className="absolute h-36 w-36 sm:h-40 sm:w-40 rounded-full bg-gradient-to-tr from-[#ECFDF5] via-[#D1FAE5] to-[#F2F8F5] shadow-inner" />
          
          {/* Circular framed doctor photo */}
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-white shadow-md bg-white">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover object-top"
            />
          </div>

          {/* Floating rating badge */}
          <div className="absolute -bottom-1 right-2 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#102820] shadow-md border border-[#E2EBE7]">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>
        </div>
      </div>

      {/* Bottom: Doctor Name, Specialty & Consultations Metric */}
      <div className="text-center pt-1 border-t border-[#F2F8F5]">
        <h4 className="font-heading text-lg font-black text-[#102820]">
          {name}
        </h4>
        <p className="mt-0.5 text-xs text-slate-500 font-medium">
          {specialty}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="rounded-full bg-[#F2F8F5] border border-[#E2EBE7] px-3 py-1 text-xs font-bold text-[#102820]">
            {consultations}
          </span>
          <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-bold text-[#07583F]">
            {trend}
          </span>
        </div>
      </div>
    </div>
  );
};
