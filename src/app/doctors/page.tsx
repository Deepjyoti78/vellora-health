'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Calendar,
  ShieldCheck,
  Clock,
  Search,
  Star,
  Check,
  ArrowRight,
  Stethoscope,
  Heart,
  Users,
  Activity,
  Layers,
} from 'lucide-react';

interface DoctorSpecialist {
  id: string;
  name: string;
  specialty: string;
  category: 'ALL' | 'GENERAL' | 'INTERNAL' | 'PEDIATRICS' | 'REHAB';
  qualification: string;
  rating: number;
  reviewsCount: number;
  image: string;
  bio: string;
  tags: string[];
  moreTagsCount: number;
}

const DOCTORS_LIST: DoctorSpecialist[] = [
  {
    id: 'doc-1',
    name: 'Dr. Maya Patel',
    specialty: 'Internal Medicine & Geriatrics',
    category: 'INTERNAL',
    qualification: '14 Years • MD (Internal Medicine)',
    rating: 4.9,
    reviewsCount: 148,
    image: '/assets/doctor-maya-patel.webp',
    bio: 'Expert in adult and senior care, with a focus on preventive health and chronic disease management.',
    tags: ['Senior Care', 'Hypertension', 'Diabetes'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-2',
    name: 'Dr. Ethan Park',
    specialty: 'Pediatrics & Family Medicine',
    category: 'PEDIATRICS',
    qualification: '11 Years • MD (Pediatrics)',
    rating: 4.8,
    reviewsCount: 112,
    image: '/assets/doctor-ethan-park.webp',
    bio: 'Dedicated pediatrician providing compassionate care for children and complete family health support.',
    tags: ['Child Care', 'Vaccination', 'Growth Monitoring'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-3',
    name: 'Dr. Daniel Reed',
    specialty: 'Cardiology & Chronic Disease Management',
    category: 'INTERNAL',
    qualification: '16 Years • MD (Cardiology)',
    rating: 4.85,
    reviewsCount: 129,
    image: '/assets/doctor-daniel-reed.webp',
    bio: 'Specializes in heart health, preventive cardiology, and long-term management of chronic cardiac conditions.',
    tags: ['Heart Health', 'BP Management', 'Cardiac Rehab'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-4',
    name: 'Dr. Sofia Morgan',
    specialty: 'Rehabilitation & Orthopedics',
    category: 'REHAB',
    qualification: '12 Years • MD (Orthopedics & Rehab)',
    rating: 4.9,
    reviewsCount: 104,
    image: '/assets/doctor-4.webp',
    bio: 'Guiding surgical recovery, mobility milestones, joint recovery, and bedside rehabilitation.',
    tags: ['Post-Op Rehab', 'Joint Mobility', 'Pain Management'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-5',
    name: 'Dr. Marcus Vance',
    specialty: 'General & Acute Care',
    category: 'GENERAL',
    qualification: '15 Years • MD (Emergency & Family Medicine)',
    rating: 4.9,
    reviewsCount: 98,
    image: '/assets/doctor-3.webp',
    bio: 'Rapid acute illness evaluations, fever management, and compassionate bedside general checkups.',
    tags: ['Acute Illness', 'Fever Care', 'General Checkup'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-6',
    name: 'Dr. Ananya Rao',
    specialty: 'Pediatrics & Neonatal Care',
    category: 'PEDIATRICS',
    qualification: '10 Years • MD (Pediatrics)',
    rating: 4.95,
    reviewsCount: 135,
    image: '/assets/avatar-indian-9.jpg',
    bio: 'Specialized neonatal checkups, infant vaccinations, and developmental pediatric wellness.',
    tags: ['Infant Care', 'Immunizations', 'Nutrition'],
    moreTagsCount: 2,
  },
];

export default function DoctorsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);

  const filterTabs = [
    { id: 'ALL', label: 'All Specialists (48)', icon: Layers },
    { id: 'GENERAL', label: 'General & Acute Care (12)', icon: Stethoscope },
    { id: 'INTERNAL', label: 'Internal & Chronic Care (10)', icon: Heart },
    { id: 'PEDIATRICS', label: 'Pediatrics & Family Care (12)', icon: Users },
    { id: 'REHAB', label: 'Rehabilitation & Orthopedics (14)', icon: Activity },
  ];

  const filteredDoctors = DOCTORS_LIST.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'ALL' || doc.category === selectedCategory;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const displayedDoctors = showAll ? filteredDoctors : filteredDoctors.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F5F9F7]">
      <Header theme="light" />

      {/* Top Hero Section matching Image exactly */}
      <div className="relative overflow-hidden border-b border-[#E2EBE7] bg-white pt-10 pb-8 sm:pt-14 sm:pb-12">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Eyebrow, Heading, Subtitle & 3 Pills */}
            <div className="lg:col-span-7">
              <p className="text-[11px] font-extrabold tracking-widest text-[#065F46] uppercase mb-2">
                OUR MEDICAL SPECIALISTS
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#11191B] tracking-tight leading-tight">
                Meet Our Visiting Medical Specialists
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
                Board-certified, experienced doctors bringing comprehensive, compassionate care to your doorstep.
              </p>

              {/* 3 Feature Pills row */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1.5 text-xs font-semibold text-[#065F46] shadow-2xs">
                  <Calendar className="h-3.5 w-3.5 text-[#065F46] stroke-[2.2]" />
                  <span>Home Consultations</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1.5 text-xs font-semibold text-[#065F46] shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#065F46] stroke-[2.2]" />
                  <span>Verified &amp; Experienced</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1.5 text-xs font-semibold text-[#065F46] shadow-2xs">
                  <Clock className="h-3.5 w-3.5 text-[#065F46] stroke-[2.2]" />
                  <span>Same-Day Availability</span>
                </div>
              </div>
            </div>

            {/* Right Column: Exact Doctor Hero Photo with Organic Mint Backdrop */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              {/* Organic Soft Mint Wave & Cross Background */}
              <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-[#ECFDF5] blur-2xl pointer-events-none" />
              <div className="absolute right-12 top-6 text-emerald-200/50 pointer-events-none font-bold text-6xl">
                +
              </div>

              {/* Exact Photo from Reference Image */}
              <div className="relative w-full max-w-[480px] overflow-hidden rounded-3xl shadow-sm border border-[#E2EBE7] bg-white">
                <img
                  src="/assets/visiting-specialists-hero.webp"
                  alt="Doctor visiting senior patient at home"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Content Section */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Category Filter Pills matching Image */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {filterTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-[#E2EBE7] hover:bg-[#F2F8F5] shadow-2xs'
                }`}
              >
                <IconComponent className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-[#065F46]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Counter & Search Bar matching Image */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2EBE7] pb-5">
          <p className="text-xs font-bold text-slate-600">
            Showing <span className="text-[#102820] font-black">48</span> verified specialists
          </p>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search doctor by name, specialty, or condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#E2EBE7] bg-white py-2 pl-10 pr-4 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B] shadow-2xs"
            />
          </div>
        </div>

        {/* 3 Doctor Cards Grid matching Image */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDoctors.map((doc) => (
            <div
              key={doc.id}
              className="group flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#E2EBE7] bg-white p-6 shadow-xs transition-all duration-300 hover:border-[#B8DCDE] hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                {/* Doctor Photo & Badges Header */}
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[#E2EBE7] bg-slate-50 shadow-2xs">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[10px] font-bold text-[#065F46]">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                        <span>Verified</span>
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>
                          {doc.rating} ({doc.reviewsCount}+)
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-1.5 truncate font-heading text-base font-extrabold text-[#11191B] group-hover:text-[#065F46] transition-colors">
                      {doc.name}
                    </h3>
                    <p className="truncate text-xs font-bold text-[#065F46]">
                      {doc.specialty}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-400 font-medium">
                      {doc.qualification}
                    </p>
                  </div>
                </div>

                {/* Bio / Description */}
                <p className="mt-4 text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {doc.bio}
                </p>

                {/* Tags row */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {doc.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-[#F2F8F5] border border-[#E2EBE7] px-2.5 py-1 text-[11px] font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                  {doc.moreTagsCount > 0 && (
                    <span className="rounded-md bg-[#F2F8F5] px-2 py-1 text-[11px] font-medium text-slate-400">
                      +{doc.moreTagsCount} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="mt-6 flex items-center justify-between border-t border-[#F2F8F5] pt-4">
                <Link
                  href={`/book/doctor/${doc.id}`}
                  className="text-xs font-bold text-[#065F46] hover:underline"
                >
                  View Profile
                </Link>

                <Link
                  href={`/book/doctor/${doc.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Centered "View All Specialists →" Button */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 rounded-full border border-[#CBDCD5] bg-white px-7 py-2.5 text-xs font-bold text-[#102820] shadow-2xs hover:bg-[#F2F8F5] hover:border-[#065F46] transition-all"
          >
            <span>{showAll ? 'Show Fewer Specialists' : 'View All Specialists'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
