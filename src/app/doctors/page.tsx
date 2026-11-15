'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  X,
  CheckCircle2,
  MapPin,
  Sparkles,
  ChevronRight,
  FileText,
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
    image: '/assets/avatar-indian-2.jpg',
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
    image: '/assets/avatar-indian-3.jpg',
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
    image: '/assets/avatar-indian-4.jpg',
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
  {
    id: 'doc-7',
    name: 'Dr. Vikram Sen',
    specialty: 'Orthopedic & Joint Care',
    category: 'REHAB',
    qualification: '15 Years • MS (Orthopedics)',
    rating: 4.92,
    reviewsCount: 118,
    image: '/assets/avatar-indian-5.jpg',
    bio: 'Comprehensive musculoskeletal assessments, arthritis pain relief, and post-fracture home mobility guidance.',
    tags: ['Joint Pain', 'Arthritis Care', 'Spine Mobility'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-8',
    name: 'Dr. Neha Kapoor',
    specialty: 'Endocrinology & Diabetic Care',
    category: 'INTERNAL',
    qualification: '13 Years • MD, DM (Endocrinology)',
    rating: 4.88,
    reviewsCount: 142,
    image: '/assets/avatar-indian-6.jpg',
    bio: 'Targeted glucose control regimens, thyroid balance therapies, and lifestyle optimization at home.',
    tags: ['Type 2 Diabetes', 'Thyroid Care', 'Metabolic Health'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-9',
    name: 'Dr. Siddharth Nair',
    specialty: 'Physiotherapy & Neuro-Rehabilitation',
    category: 'REHAB',
    qualification: '14 Years • MPT (Neuro-Physiotherapy)',
    rating: 4.94,
    reviewsCount: 126,
    image: '/assets/avatar-indian-8.jpg',
    bio: 'Stroke rehabilitation, paralysis recovery, gait training, and personalized geriatric mobility protocols.',
    tags: ['Stroke Rehab', 'Gait Training', 'Neuropathy'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-10',
    name: 'Dr. Kavita Deshmukh',
    specialty: 'Geriatric Medicine & Palliative Care',
    category: 'INTERNAL',
    qualification: '18 Years • MD (Geriatric Medicine)',
    rating: 4.96,
    reviewsCount: 164,
    image: '/assets/avatar-indian-10.jpg',
    bio: 'Compassionate elderly palliative evaluations, polypharmacy simplification, and comfort care at home.',
    tags: ['Senior Wellness', 'Dementia Care', 'Medication Review'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-11',
    name: 'Dr. Amitav Ghosh',
    specialty: 'Family Medicine & Preventive Health',
    category: 'GENERAL',
    qualification: '12 Years • MD (Family Medicine)',
    rating: 4.86,
    reviewsCount: 94,
    image: '/assets/avatar-indian-11.jpg',
    bio: 'Annual family health screenings, vital sign surveillance, infection control, and doorstep routine diagnostics.',
    tags: ['Routine Checkup', 'Preventive Care', 'Family Health'],
    moreTagsCount: 2,
  },
  {
    id: 'doc-12',
    name: 'Dr. Sunita Joshi',
    specialty: 'Pediatric Development & Allergy',
    category: 'PEDIATRICS',
    qualification: '11 Years • MD (Pediatrics & Allergy)',
    rating: 4.91,
    reviewsCount: 108,
    image: '/assets/avatar-indian-12.jpg',
    bio: 'Childhood asthma evaluations, food allergy management, and developmental milestone assessments.',
    tags: ['Pediatric Asthma', 'Allergy Testing', 'Child Milestones'],
    moreTagsCount: 2,
  },
];

export default function DoctorsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Doctor Pop-up Card & Confirmation Modal State
  const [selectedDoctorModal, setSelectedDoctorModal] = useState<DoctorSpecialist | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState<boolean>(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<string>('');

  // Close modal with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDoctorModal(null);
        setIsBookingConfirmed(false);
      }
    };
    if (selectedDoctorModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDoctorModal]);

  const handleOpenDoctorModal = (doc: DoctorSpecialist) => {
    setSelectedDoctorModal(doc);
    setIsBookingConfirmed(false);
    setConfirmedBookingRef(`VEL-2026-DOC${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleConfirmDoctorBooking = () => {
    setIsBookingConfirmed(true);
  };

  const handleProceedToBookingSystem = () => {
    if (selectedDoctorModal) {
      router.push(`/book/doctor/${selectedDoctorModal.id}`);
    }
  };

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

  // Display ALL doctors directly — no truncation or "View All" toggle button
  const displayedDoctors = filteredDoctors;

  return (
    <div className="min-h-screen bg-white text-[#15212B]">
      <Header theme="light" />

      {/* Main Container - Expanded to 1400px to eliminate side empty spaces */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
              Showing <span className="text-[#15212B] font-bold">{displayedDoctors.length}</span> verified specialists
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
        <section className="mt-5 sm:mt-6 pb-14 sm:pb-20">
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
                  className={`group flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#E6EBE9] bg-white p-5 sm:p-5.5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#B8DCDE] hover:shadow-lg hover:-translate-y-0.5 animate-fade-in-up ${delayClass} card-hover-lift`}
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
                    <p className="mt-3.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-2">
                      {doc.bio}
                    </p>

                    {/* Tags row */}
                    <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
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
                  <div className="mt-4.5 flex items-center justify-between border-t border-[#F2F8F5] pt-3.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDoctorModal(doc)}
                      className="text-xs font-bold text-[#065F46] hover:underline cursor-pointer"
                    >
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDoctorModal(doc)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors cursor-pointer"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ================= DOCTOR DETAILS & BOOKING CONFIRMATION POP-UP MODAL ================= */}
      {selectedDoctorModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="doctor-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedDoctorModal(null);
              setIsBookingConfirmed(false);
            }
          }}
        >
          <div className="w-full max-w-[540px] rounded-[26px] bg-white p-6 sm:p-7 border border-[#E2EBE7] shadow-2xl relative animate-modal-pop overflow-hidden">
            {/* Top Close Button */}
            <button
              type="button"
              onClick={() => {
                setSelectedDoctorModal(null);
                setIsBookingConfirmed(false);
              }}
              aria-label="Close dialog"
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {!isBookingConfirmed ? (
              /* ================= STEP 1: DOCTOR DETAILS POP-UP ================= */
              <div className="space-y-4 sm:space-y-5">
                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 text-[11px] font-bold text-[#065F46]">
                  <Stethoscope className="h-3 w-3 stroke-[2.5]" />
                  <span>DOORSTEP DOCTOR CONSULTATION</span>
                </div>

                {/* Doctor Header Profile */}
                <div className="flex items-start gap-4 pt-1">
                  <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl border border-[#D1FAE5] bg-slate-50 shadow-2xs">
                    <img
                      src={selectedDoctorModal.image}
                      alt={selectedDoctorModal.name}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#065F46] border border-[#D1FAE5]">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                        <span>Verified Specialist</span>
                      </span>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 ml-auto">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{selectedDoctorModal.rating} ({selectedDoctorModal.reviewsCount}+)</span>
                      </div>
                    </div>

                    <h3 id="doctor-modal-title" className="font-heading text-lg sm:text-xl font-bold text-[#102820]">
                      {selectedDoctorModal.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#065F46] mt-0.5">
                      {selectedDoctorModal.specialty}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {selectedDoctorModal.qualification}
                    </p>
                  </div>
                </div>

                {/* Clinical Bio */}
                <div className="rounded-2xl bg-[#F8FAF9] border border-[#E8F0EC] p-3.5 text-xs text-slate-600 leading-relaxed">
                  <p className="font-medium text-[#102820] mb-1 text-[11px] uppercase tracking-wider text-slate-400">
                    Clinical Expertise &amp; Background
                  </p>
                  <p>{selectedDoctorModal.bio}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {selectedDoctorModal.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-white border border-[#E2EBE7] px-2 py-0.5 text-[10.5px] font-medium text-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Consultation Details Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
                  <div className="rounded-xl border border-[#E2EBE7] bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Consultation Mode
                    </p>
                    <p className="font-bold text-[#102820] mt-0.5 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#065F46]" />
                      Doorstep Home Visit
                    </p>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      In-home clinical assessment
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E2EBE7] bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Standard Arrival
                    </p>
                    <p className="font-bold text-[#102820] mt-0.5 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#065F46]" />
                      30–45 Mins Arrival
                    </p>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      Same-day availability
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E2EBE7] bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Consultation Duration
                    </p>
                    <p className="font-bold text-[#102820] mt-0.5">
                      45–60 Mins Bedside
                    </p>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      Thorough physical evaluation
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#E2EBE7] bg-white p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Consultation Fee
                    </p>
                    <p className="font-bold text-[#065F46] text-sm mt-0.5">
                      $85 Total
                    </p>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">
                      Includes e-prescription
                    </p>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDoctorModal(null);
                      setIsBookingConfirmed(false);
                    }}
                    className="flex-1 rounded-full border border-slate-200 bg-white py-2.5 px-4 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmDoctorBooking}
                    className="flex-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#064E3B] hover:bg-[#065F46] py-2.5 px-5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Confirm Booking</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* ================= STEP 2: CONFIRMED BOOKING VIEW ================= */
              <div className="space-y-5 animate-scale-in">
                {/* Success Icon & Heading */}
                <div className="text-center pt-2">
                  <div className="h-14 w-14 rounded-full bg-[#ECFDF5] border-2 border-[#10B981] text-[#065F46] flex items-center justify-center mx-auto mb-3 animate-pulse-glow">
                    <CheckCircle2 className="h-8 w-8 stroke-[2.2] text-[#059669]" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#102820]">
                    Booking Confirmed!
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                    Your home visit doctor appointment with {selectedDoctorModal.name} has been placed.
                  </p>
                </div>

                {/* Clickable Confirmed Booking Card */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleProceedToBookingSystem}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleProceedToBookingSystem();
                    }
                  }}
                  className="group rounded-2xl border-2 border-[#10B981] bg-[#F0FDF4] p-4.5 text-left shadow-sm hover:shadow-md hover:border-[#059669] hover:bg-[#DCFCE7]/70 transition-all cursor-pointer relative"
                >
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#A7F3D0]">
                    <span className="font-mono text-xs font-bold text-[#065F46]">
                      {confirmedBookingRef}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                      ● Confirmed
                    </span>
                  </div>

                  <div className="mt-3 flex items-start gap-3.5">
                    <img
                      src={selectedDoctorModal.image}
                      alt={selectedDoctorModal.name}
                      className="h-12 w-12 rounded-xl object-cover shrink-0 border border-[#A7F3D0] shadow-2xs"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading text-sm font-bold text-[#102820] group-hover:text-[#065F46] transition-colors truncate">
                        {selectedDoctorModal.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#065F46] truncate">
                        {selectedDoctorModal.specialty}
                      </p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Doorstep Home Visit • Today (30–45 min arrival)
                      </p>
                    </div>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between pt-2.5 border-t border-[#A7F3D0] text-xs font-bold text-[#065F46]">
                    <span>Click this booking to open booking system</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleProceedToBookingSystem}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#064E3B] hover:bg-[#065F46] py-3 px-5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Proceed to Home Visit Doctor Booking</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDoctorModal(null);
                      setIsBookingConfirmed(false);
                    }}
                    className="text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 cursor-pointer"
                  >
                    Dismiss &amp; Stay on Doctors List
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
