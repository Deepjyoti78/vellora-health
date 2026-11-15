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
  LayoutGrid,
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
    image: '/assets/chatgpt-card-3.webp',
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
    image: '/assets/chatgpt-card-4.webp',
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
    image: '/assets/chatgpt-card-4.webp',
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
    image: '/assets/chatgpt-card-3.webp',
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
    image: '/assets/chatgpt-card-4.webp',
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
    { id: 'ALL', label: 'All Specialists (48)', icon: LayoutGrid },
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
    <div className="min-h-screen bg-white text-[#15212B]">
      <Header theme="light" />

      {/* Main Single Continuous Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= HERO SECTION ================= */}
        <section className="pt-6 pb-6 sm:pt-10 sm:pb-8 animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Left Column: Eyebrow, Heading, Description, Indicators */}
            <div className="lg:col-span-7">
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#065F46] uppercase mb-2 sm:mb-2.5 animate-fade-in-down">
                OUR MEDICAL SPECIALISTS
              </p>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#15212B] tracking-tight leading-[1.12] max-w-[570px] animate-fade-in-up">
                Meet Our Visiting<br />Medical Specialists
              </h1>

              <p className="mt-3 sm:mt-3.5 text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-[500px] animate-fade-in-up animate-delay-1">
                Board-certified, experienced doctors bringing comprehensive, compassionate care to your doorstep.
              </p>

              {/* Minimal Benefit Indicators */}
              <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-4 sm:gap-6 animate-fade-in-up animate-delay-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46]">
                    <Calendar className="h-3 w-3 stroke-[2.2]" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-[#15212B]">
                    Home Consultations
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46]">
                    <ShieldCheck className="h-3 w-3 stroke-[2.2]" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-[#15212B]">
                    Verified &amp; Experienced
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46]">
                    <Clock className="h-3 w-3 stroke-[2.2]" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-medium text-[#15212B]">
                    Same-Day Availability
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Asset with Organic Soft Mint Wave & Cross */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              {/* Organic Soft Mint Wave & Plus Sign */}
              <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-[#ECFDF5] blur-3xl opacity-80 pointer-events-none" />
              <div className="absolute right-4 top-4 text-[#A7F3D0]/60 pointer-events-none font-light text-5xl select-none">
                +
              </div>

              {/* Provided Hero Image Asset: Transparent cutout sitting naturally */}
              <div className="relative w-full max-w-[440px]">
                <img
                  src="/images/doctors-hero.png"
                  alt="Doctor visiting elderly patient at home"
                  className="w-full h-auto object-contain rounded-[22px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= SPECIALTY FILTERS SECTION ================= */}
        <section className="pt-2 sm:pt-4">
          {/* Filter Pills with Horizontal Scrolling on Mobile */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1.5 px-0.5">
            {filterTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-[13px] font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-[#064E3B] text-white shadow-xs border border-transparent'
                      : 'bg-white text-slate-700 border border-[#E2EBE7] hover:bg-[#F2F8F5]'
                  }`}
                >
                  <IconComponent
                    className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#065F46]'}`}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Counter Row */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-[13px] text-slate-600 font-medium">
              Showing <span className="text-[#15212B] font-bold">48</span> verified specialists
            </p>

            <div className="relative w-full sm:w-[340px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctor by name, specialty, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[42px] rounded-full border border-[#E2EBE7] bg-white py-2 pl-10 pr-4 text-xs font-medium text-[#15212B] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
              />
            </div>
          </div>
        </section>

        {/* ================= DOCTOR CARDS GRID ================= */}
        <section className="mt-5 sm:mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {displayedDoctors.map((doc, idx) => {
              const delayClass =
                idx === 0
                  ? 'animate-delay-1'
                  : idx === 1
                  ? 'animate-delay-2'
                  : idx === 2
                  ? 'animate-delay-3'
                  : 'animate-delay-4';

              return (
                <div
                  key={doc.id}
                  className={`group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#E6EBE9] bg-white p-4.5 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-[#B8DCDE] hover:shadow-md hover:-translate-y-0.5 animate-fade-in-up ${delayClass} card-hover-lift`}
                >
                <div>
                  {/* Doctor Photo & Badges Header */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative h-24 w-24 sm:h-[100px] sm:w-[100px] shrink-0 overflow-hidden rounded-[14px] border border-[#E6EBE9] bg-slate-50">
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                          <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                          <span>Verified</span>
                        </span>

                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span>
                            {doc.rating} ({doc.reviewsCount}+)
                          </span>
                        </div>
                      </div>

                      <h3 className="mt-1 truncate font-heading text-base sm:text-[17px] font-semibold text-[#15212B] group-hover:text-[#065F46] transition-colors">
                        {doc.name}
                      </h3>
                      <p className="truncate text-xs font-medium text-[#065F46]">
                        {doc.specialty}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">
                        {doc.qualification}
                      </p>
                    </div>
                  </div>

                  {/* Bio / Description */}
                  <p className="mt-3 text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-2">
                    {doc.bio}
                  </p>

                  {/* Tags row */}
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {doc.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-[#F2F8F5] border border-[#E2EBE7] px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                    {doc.moreTagsCount > 0 && (
                      <span className="rounded-md bg-[#F2F8F5] px-2 py-0.5 text-[11px] font-medium text-slate-400">
                        +{doc.moreTagsCount} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="mt-4 flex items-center justify-between border-t border-[#F2F8F5] pt-3">
                  <Link
                    href={`/book/doctor/${doc.id}`}
                    className="text-xs font-bold text-[#065F46] hover:underline"
                  >
                    View Profile
                  </Link>

                  <Link
                    href={`/book/doctor/${doc.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
                  >
                    <span>Book Consultation</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

          {/* Bottom Centered "View All Specialists →" Button */}
          <div className="mt-7 flex justify-center pb-10 sm:pb-14">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-full border border-[#CBDCD5] bg-white px-7 py-2.5 text-xs font-bold text-[#102820] shadow-xs hover:bg-[#F2F8F5] hover:border-[#064E3B] transition-all cursor-pointer active:scale-98"
            >
              <span>{showAll ? 'Show Fewer Specialists' : 'View All Specialists'}</span>
              <ArrowRight className="h-3.5 w-3.5 text-[#064E3B]" />
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
