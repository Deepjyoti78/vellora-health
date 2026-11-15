'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import {
  Calendar,
  FileText,
  Users,
  User,
  Stethoscope,
  HeartPulse,
  Bed,
  FlaskConical,
  ArrowRight,
  Clock,
  ShieldCheck,
  Plus,
  PhoneCall,
  Activity,
  MapPin,
  Sparkles,
  X,
  Layers,
  Zap,
  Check,
  AlertTriangle,
  Phone,
  Home,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

// Format YYYY-MM-DD into "Nov 15, 2026"
function formatDisplayDate(dateStr: string) {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (months[monthIdx]) {
        return `${months[monthIdx]} ${day}, ${year}`;
      }
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

// 24/7 Care Coordination Headset Illustration
const CareCoordinationIllustration = () => (
  <div className="relative w-28 h-24 sm:w-36 sm:h-28 shrink-0 flex items-center justify-center select-none pointer-events-none">
    <div className="absolute inset-0 bg-[#E6F7F0] rounded-full blur-xl opacity-75" />
    <svg viewBox="0 0 160 130" className="w-full h-full relative z-10 drop-shadow-xs" fill="none">
      {/* Background Soft Bubble */}
      <circle cx="80" cy="65" r="44" fill="#EAF8F2" />
      {/* Plant Leaves */}
      <path d="M40 95 C 30 85, 32 70, 48 78 C 45 90, 42 93, 40 95 Z" fill="#A7F3D0" />
      <path d="M50 102 C 38 98, 42 85, 56 90 C 54 99, 52 101, 50 102 Z" fill="#6EE7B7" />
      {/* Headset Arc */}
      <path d="M48 68 C 48 40, 112 40, 112 68" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
      {/* Left Ear Cushion */}
      <rect x="42" y="62" width="12" height="24" rx="6" fill="#065F46" />
      {/* Right Ear Cushion */}
      <rect x="106" y="62" width="12" height="24" rx="6" fill="#065F46" />
      {/* Microphone Arm & Mic */}
      <path d="M110 78 C 110 96, 92 104, 76 102" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="74" cy="102" r="5" fill="#064E3B" />
      {/* Speech Chat Bubble */}
      <rect x="68" y="48" width="28" height="20" rx="8" fill="#FFFFFF" />
      <circle cx="77" cy="58" r="2" fill="#10B981" />
      <circle cx="82" cy="58" r="2" fill="#10B981" />
      <circle cx="87" cy="58" r="2" fill="#10B981" />
      <path d="M74 68 L 71 74 L 79 68 Z" fill="#FFFFFF" />
    </svg>
  </div>
);

// Emergency Medical Ambulance Illustration
const EmergencyAmbulanceIllustration = () => (
  <div className="relative w-28 h-20 sm:w-36 sm:h-24 shrink-0 flex items-center justify-center select-none pointer-events-none">
    <div className="absolute inset-0 bg-[#FEE2E2] rounded-full blur-xl opacity-60" />
    <svg viewBox="0 0 160 110" className="w-full h-full relative z-10 drop-shadow-xs" fill="none">
      {/* Road Shadow */}
      <ellipse cx="80" cy="94" rx="55" ry="5" fill="#E2E8F0" />
      {/* Siren Light Glow & Bulb */}
      <circle cx="68" cy="22" r="8" fill="#FCA5A5" opacity="0.4" />
      <circle cx="68" cy="22" r="4.5" fill="#EF4444" />
      {/* Ambulance Van Body */}
      <path
        d="M30 42 C 30 36, 35 32, 42 32 L 88 32 C 94 32, 98 36, 102 42 L 122 55 C 126 58, 128 62, 128 67 L 128 80 C 128 84, 125 86, 120 86 L 36 86 C 32 86, 30 83, 30 78 Z"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="2"
      />
      {/* Windshield */}
      <path d="M98 42 L 115 54 C 117 56, 117 58, 115 58 L 94 58 C 92 58, 92 56, 92 54 L 92 44 C 92 42, 94 42, 98 42 Z" fill="#E0F2FE" />
      {/* Side Window */}
      <rect x="52" y="42" width="28" height="14" rx="3" fill="#E0F2FE" />
      {/* Red Emergency Cross */}
      <rect x="62" y="64" width="8" height="8" rx="1.5" fill="#FEE2E2" />
      <path d="M66 65 v 6 M 63 68 h 6" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
      {/* Red Stripe along van */}
      <path d="M30 74 L 128 74" stroke="#EF4444" strokeWidth="2.5" />
      {/* Headlight */}
      <rect x="124" y="68" width="4" height="6" rx="2" fill="#FBBF24" />
      {/* Wheels */}
      <circle cx="50" cy="86" r="10" fill="#334155" />
      <circle cx="50" cy="86" r="4.5" fill="#E2E8F0" />
      <circle cx="108" cy="86" r="10" fill="#334155" />
      <circle cx="108" cy="86" r="4.5" fill="#E2E8F0" />
    </svg>
  </div>
);

export default function PatientDashboardPage() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedBooking(null);
    };
    if (selectedBooking) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBooking]);

  const bookings = db.getBookingsByPatient(userId);
  const activeBookings = bookings.filter((b) =>
    ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );
  const prescriptions = db.getPrescriptionsByPatient(userId);
  const labReports = db.getLabReportsByPatient(userId);
  const familyMembers = db.getFamilyMembers(userId);

  const firstName = currentUser?.name?.split(' ')[0] || 'Eleanor';

  const quickServices = [
    {
      name: 'Doctor Visit',
      desc: 'Physician consultation at home',
      href: '/services/doctor-consultations',
      icon: Stethoscope,
    },
    {
      name: 'Home Nursing',
      desc: 'Dressing, injections & IV care',
      href: '/services/nursing-care',
      icon: HeartPulse,
    },
    {
      name: 'Caretaker Shift',
      desc: '12h / 24h bedside support',
      href: '/services/rehab-critical-care',
      icon: Bed,
    },
    {
      name: 'Lab Blood Draw',
      desc: 'Diagnostic panels at doorstep',
      href: '/services/diagnostics-labs',
      icon: FlaskConical,
    },
  ];

  return (
    <PatientLayout>
      <div className="min-h-screen bg-[#F7FAF9] text-[#15212B] font-sans antialiased py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
          {/* ================= 1. SEAMLESS WELCOME HERO SECTION ================= */}
          {/* Open, unboxed layout directly on the mint-tinted page background */}
          <section className="relative pt-1 pb-2 sm:pt-2 sm:pb-3 lg:pt-3 lg:pb-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Column: Heading, Subtitle, CTA (col-span-5) */}
              <div className="lg:col-span-5 xl:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-[11px] font-bold text-[#065F46] uppercase tracking-wider shadow-2xs">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>PERSONAL HEALTHCARE PORTAL</span>
                </div>

                <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#15212B] tracking-tight leading-[1.15] flex items-center gap-2.5">
                  <span>Welcome back, {firstName}</span>
                  <span className="text-[#059669] text-2xl sm:text-3xl font-light select-none">✦</span>
                </h1>

                <p className="text-sm sm:text-base text-[#64748B] font-normal max-w-lg leading-relaxed">
                  Manage your appointments, medical records, and family healthcare in one place.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href="/patient/book"
                    className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#065F46] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Book Appointment</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Wide Seamless Lifestyle Illustration (col-span-7) */}
              <div className="lg:col-span-7 xl:col-span-7 flex items-center justify-center lg:justify-end relative">
                {/* Soft ambient mint glow & warm morning sun aura matching Image 2 */}
                <div className="absolute right-12 top-4 w-32 h-32 rounded-full bg-amber-100/50 blur-2xl pointer-events-none" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-72 rounded-full bg-gradient-to-l from-[#EAF8F2] via-[#E6F7F0]/60 to-transparent blur-3xl pointer-events-none" />

                {/* Wide panoramic illustration container covering the horizontal empty spaces */}
                <div className="relative z-10 w-full max-w-[700px] flex items-center justify-center lg:justify-end">
                  <img
                    src="/assets/patient-hero-seamless@2x.png"
                    alt="Eleanor enjoying calm home healthcare wellness"
                    className="w-full h-auto max-h-[250px] sm:max-h-[270px] lg:max-h-[285px] object-contain object-right-bottom select-none pointer-events-none drop-shadow-xs transition-transform duration-500 hover:scale-[1.01]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ================= 2. FOUR UNIFIED STATISTICS SUMMARY CARDS ================= */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Stat 1: Total Bookings */}
            <div className="rounded-[22px] border border-[#E2EBE7] bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#A7F3D0] hover:shadow-xs transition-all flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                <Calendar className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#15212B] tracking-tight block">
                  {bookings.length}
                </span>
                <span className="text-xs sm:text-[13px] text-[#64748B] font-medium block">Total Bookings</span>
              </div>
            </div>

            {/* Stat 2: Active Visits */}
            <div className="rounded-[22px] border border-[#E2EBE7] bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#A7F3D0] hover:shadow-xs transition-all flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                <Check className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#15212B] tracking-tight block">
                  {activeBookings.length}
                </span>
                <span className="text-xs sm:text-[13px] text-[#64748B] font-medium block">Active Visits</span>
              </div>
            </div>

            {/* Stat 3: Family Members */}
            <div className="rounded-[22px] border border-[#E2EBE7] bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#A7F3D0] hover:shadow-xs transition-all flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                <Users className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#15212B] tracking-tight block">
                  {familyMembers.length}
                </span>
                <span className="text-xs sm:text-[13px] text-[#64748B] font-medium block">Family Members</span>
              </div>
            </div>

            {/* Stat 4: Medical Records */}
            <div className="rounded-[22px] border border-[#E2EBE7] bg-white p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#A7F3D0] hover:shadow-xs transition-all flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                <FileText className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-extrabold text-[#15212B] tracking-tight block">
                  {prescriptions.length + labReports.length}
                </span>
                <span className="text-xs sm:text-[13px] text-[#64748B] font-medium block">Medical Records</span>
              </div>
            </div>
          </section>

          {/* ================= 3. UPCOMING & ACTIVE APPOINTMENTS SECTION ================= */}
          <section className="rounded-[26px] border border-[#E5EAE9] bg-white p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F2F8F5]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                  <Calendar className="h-5 w-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-[#15212B]">
                    Upcoming &amp; Active Appointments
                  </h2>
                  <p className="text-xs text-[#64748B] font-normal">
                    Your scheduled doorstep clinician visits and clinical procedures.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-center">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-xs font-bold text-[#065F46]">
                  <span className="h-2 w-2 rounded-full bg-[#059669] animate-pulse" />
                  <span>{activeBookings.length} Active Visit{activeBookings.length === 1 ? '' : 's'}</span>
                </span>

                <Link
                  href="/patient/bookings"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#065F46] hover:underline"
                >
                  <span>View All Bookings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Structured Appointment Cards */}
            {activeBookings.length > 0 ? (
              <div className="mt-5 space-y-3.5">
                {activeBookings.map((booking) => {
                  const isConfirmed = booking.status === 'CONFIRMED';
                  const isInProgress = ['IN_PROGRESS', 'ON_THE_WAY', 'ARRIVED'].includes(booking.status);

                  return (
                    <div
                      key={booking.id}
                      className="group rounded-[20px] border border-[#E5EAE9] bg-[#FAFCFB] p-5 transition-all duration-200 hover:border-[#A7F3D0] hover:bg-white hover:shadow-xs"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        {/* Column 1: Service Icon, Title & Reference */}
                        <div className="lg:col-span-4 flex items-center gap-3.5">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                            {booking.category === 'DOCTOR_VISIT' ? (
                              <Home className="h-5 w-5 stroke-[2]" />
                            ) : (
                              <Stethoscope className="h-5 w-5 stroke-[2]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-heading text-sm sm:text-base font-bold text-[#15212B] group-hover:text-[#065F46] transition-colors truncate">
                              {booking.serviceName}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-[11px] font-bold text-[#065F46] bg-white border border-[#D9ECE7] px-2 py-0.5 rounded-md">
                                {booking.bookingNumber}
                              </span>
                              {booking.category && (
                                <span className="text-[11px] text-slate-400 capitalize hidden sm:inline">
                                  {booking.category.toLowerCase().replace(/_/g, ' ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Date, Time, Patient & Address */}
                        <div className="lg:col-span-5 space-y-1.5 text-xs text-[#64748B]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[#15212B] font-semibold">
                              <Calendar className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                              <span>{formatDisplayDate(booking.scheduledDate)}</span>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1 text-slate-600">
                              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>{booking.scheduledTimeSlot}</span>
                            </span>
                            {booking.providerName && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px] font-bold">
                                  <Stethoscope className="h-3 w-3" />
                                  <span>{booking.providerName}</span>
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="inline-flex items-center gap-1 shrink-0">
                              <User className="h-3 w-3 text-slate-400" />
                              <strong className="text-slate-700">{booking.beneficiaryName || booking.patientName}</strong> ({booking.beneficiaryRelation || 'Self'})
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1 truncate max-w-xs">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                              <span className="truncate">{booking.addressText}</span>
                            </span>
                          </div>
                        </div>

                        {/* Column 3: Status Badge & Actions */}
                        <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F2F8F5]">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                              isConfirmed
                                ? 'bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46]'
                                : isInProgress
                                ? 'bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309]'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {isConfirmed ? (
                              <Check className="h-3 w-3 stroke-[3]" />
                            ) : (
                              <Clock className="h-3 w-3 stroke-[2.5]" />
                            )}
                            <span>
                              {isConfirmed
                                ? 'Confirmed'
                                : isInProgress
                                ? 'In Progress'
                                : booking.status.replace(/_/g, ' ')}
                            </span>
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(booking)}
                              className="rounded-full border border-[#DCE6E1] bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                            >
                              Details
                            </button>

                            <Link
                              href={`/patient/bookings/${booking.id}`}
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] hover:bg-[#D1FAE5] transition-colors shadow-2xs"
                              title="Open Booking Tracker"
                            >
                              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center bg-[#FAFCFB] rounded-2xl border border-dashed border-[#E2EBE7] mt-5">
                <Calendar className="h-9 w-9 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#15212B]">No active appointments scheduled</p>
                <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
                  Book a verified home doctor consultation, nursing procedure, or doorstep blood test whenever needed.
                </p>
                <Link
                  href="/patient/book"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-5 py-2 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Book an Appointment</span>
                </Link>
              </div>
            )}
          </section>

          {/* ================= 4. HEALTHCARE MANAGEMENT HUB ================= */}
          {/* Compact, balanced 4-column cards with content-driven height and consistent arrow alignment */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                <Layers className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-[#15212B]">
                  Healthcare Management Hub
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] font-normal">
                  Direct access to your records, appointments, family care, and personal health metrics.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: My Bookings */}
              <Link
                href="/patient/bookings"
                className="group flex flex-col justify-between rounded-[20px] border border-[#E5EAE9] bg-white p-5 shadow-2xs hover:border-[#A7F3D0] hover:shadow-xs transition-all duration-200"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                    <Calendar className="h-5 w-5 stroke-[2]" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#15212B] group-hover:text-[#065F46] transition-colors">
                    My Bookings
                  </h3>
                  <p className="mt-1 text-xs text-[#64748B] leading-relaxed line-clamp-2">
                    View and manage all your appointments.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4FAF7] flex justify-end">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#065F46] group-hover:bg-[#064E3B] group-hover:text-white transition-all shadow-2xs">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>

              {/* Card 2: Medical Records */}
              <Link
                href="/patient/records"
                className="group flex flex-col justify-between rounded-[20px] border border-[#E5EAE9] bg-white p-5 shadow-2xs hover:border-[#A7F3D0] hover:shadow-xs transition-all duration-200"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                    <FileText className="h-5 w-5 stroke-[2]" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#15212B] group-hover:text-[#065F46] transition-colors">
                    Medical Records
                  </h3>
                  <p className="mt-1 text-xs text-[#64748B] leading-relaxed line-clamp-2">
                    Access prescriptions, lab results, and health reports.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4FAF7] flex justify-end">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#065F46] group-hover:bg-[#064E3B] group-hover:text-white transition-all shadow-2xs">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>

              {/* Card 3: Family Members */}
              <Link
                href="/patient/family"
                className="group flex flex-col justify-between rounded-[20px] border border-[#E5EAE9] bg-white p-5 shadow-2xs hover:border-[#A7F3D0] hover:shadow-xs transition-all duration-200"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                    <Users className="h-5 w-5 stroke-[2]" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#15212B] group-hover:text-[#065F46] transition-colors">
                    Family Members
                  </h3>
                  <p className="mt-1 text-xs text-[#64748B] leading-relaxed line-clamp-2">
                    Manage family profiles and their healthcare.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4FAF7] flex justify-end">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#065F46] group-hover:bg-[#064E3B] group-hover:text-white transition-all shadow-2xs">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>

              {/* Card 4: My Profile & Vitals */}
              <Link
                href="/patient/account"
                className="group flex flex-col justify-between rounded-[20px] border border-[#E5EAE9] bg-white p-5 shadow-2xs hover:border-[#A7F3D0] hover:shadow-xs transition-all duration-200"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                    <User className="h-5 w-5 stroke-[2]" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#15212B] group-hover:text-[#065F46] transition-colors">
                    My Profile &amp; Vitals
                  </h3>
                  <p className="mt-1 text-xs text-[#64748B] leading-relaxed line-clamp-2">
                    Update personal details and track your vital stats.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F4FAF7] flex justify-end">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF5] text-[#065F46] group-hover:bg-[#064E3B] group-hover:text-white transition-all shadow-2xs">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* ================= 5. QUICK HEALTHCARE SERVICES ================= */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                  <Zap className="h-5 w-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#15212B]">
                    Quick Healthcare Services
                  </h2>
                  <p className="text-xs text-[#64748B]">
                    Schedule a routine doctor visit, nurse, attendant, or diagnostic service.
                  </p>
                </div>
              </div>

              <Link
                href="/services"
                className="text-xs sm:text-sm font-bold text-[#065F46] hover:underline flex items-center gap-1"
              >
                <span>All 42 Services</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickServices.map((qs) => {
                const IconComponent = qs.icon;
                return (
                  <Link
                    key={qs.name}
                    href={qs.href}
                    className="group flex items-center justify-between rounded-[20px] border border-[#E5EAE9] bg-white px-4 py-3.5 sm:px-5 sm:py-4 shadow-2xs hover:border-[#064E3B] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5 stroke-[2]" />
                      </div>
                      <span className="font-heading text-xs sm:text-sm font-bold text-[#15212B] truncate group-hover:text-[#064E3B] transition-colors">
                        {qs.name}
                      </span>
                    </div>

                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#064E3B] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ================= 6. CARE COORDINATION & EMERGENCY SUPPORT ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Card: 24/7 Care Coordination */}
            <div className="relative overflow-hidden rounded-[24px] border border-[#D9ECE7] bg-[#F4FAF7] p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46]">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#15212B]">
                    Vellora 24/7 Care Coordination
                  </h3>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed max-w-sm">
                  Need assistance with your booking, clinician dispatch updates, or medical prescriptions?
                </p>
                <div className="mt-4">
                  <Link
                    href="/patient/support"
                    className="inline-flex items-center gap-2 rounded-full border border-[#DCE6E1] bg-white px-5 py-2 text-xs font-bold text-[#15212B] hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>Open Assistance Hub</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#065F46]" />
                  </Link>
                </div>
              </div>

              {/* Headset Illustration */}
              <CareCoordinationIllustration />
            </div>

            {/* Right Card: Emergency Medical Guidance */}
            <div className="relative overflow-hidden rounded-[24px] border border-[#FEE2E2] bg-[#FFF8F8] p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#991B1B]">
                    Emergency Medical Guidance
                  </h3>
                </div>
                <p className="text-xs text-[#7F1D1D]/80 leading-relaxed max-w-sm">
                  For acute life-threatening emergencies, immediately contact public ambulance dispatch.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#FCA5A5] px-3.5 py-1 text-xs font-bold text-[#991B1B] hover:bg-red-50 transition-colors shadow-2xs"
                  >
                    <Phone className="h-3 w-3" />
                    <span>National: 112</span>
                  </a>
                  <a
                    href="tel:108"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#FCA5A5] px-3.5 py-1 text-xs font-bold text-[#991B1B] hover:bg-red-50 transition-colors shadow-2xs"
                  >
                    <span>🚑 Ambulance: 108</span>
                  </a>
                </div>
              </div>

              {/* Ambulance Illustration */}
              <EmergencyAmbulanceIllustration />
            </div>
          </section>
        </div>

        {/* ================= MODAL APPOINTMENT POP-UP ================= */}
        {selectedBooking && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookingModalTitle"
            onClick={() => setSelectedBooking(null)}
          >
            <div
              className="relative w-full max-w-lg rounded-[26px] bg-white p-6 sm:p-7 shadow-2xl border border-[#E2EBE7] animate-scale-up"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#F2F8F5] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 id="bookingModalTitle" className="font-heading text-base font-bold text-[#15212B]">
                      Appointment Details
                    </h3>
                    <p className="text-xs text-[#64748B] font-mono">{selectedBooking.bookingNumber}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="mt-4 space-y-4 text-xs">
                {/* Service & Status */}
                <div className="flex items-center justify-between rounded-xl bg-[#F7FAF9] p-3 border border-[#E8F0EC]">
                  <div>
                    <span className="text-[11px] text-[#64748B] block">Service Type</span>
                    <strong className="text-sm font-bold text-[#15212B] mt-0.5 block">
                      {selectedBooking.serviceName}
                    </strong>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      selectedBooking.status === 'CONFIRMED'
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#D1FAE5]'
                        : 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                    }`}
                  >
                    ● {selectedBooking.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Patient & Beneficiary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#E5EAE9] p-3">
                    <span className="text-slate-400 block text-[11px]">Patient Name</span>
                    <span className="font-bold text-[#15212B] mt-0.5 block">
                      {selectedBooking.beneficiaryName}
                    </span>
                    <span className="text-slate-500 text-[11px]">({selectedBooking.beneficiaryRelation})</span>
                  </div>
                  <div className="rounded-xl border border-[#E5EAE9] p-3">
                    <span className="text-slate-400 block text-[11px]">Contact Phone</span>
                    <span className="font-bold text-[#15212B] mt-0.5 block">{selectedBooking.patientPhone}</span>
                  </div>
                </div>

                {/* Date, Time & Address */}
                <div className="rounded-xl border border-[#E5EAE9] p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                    <span>
                      <strong>Date:</strong> {formatDisplayDate(selectedBooking.scheduledDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                    <span>
                      <strong>Time Window:</strong> {selectedBooking.scheduledTimeSlot}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#065F46] shrink-0 mt-0.5" />
                    <span>
                      <strong>Address:</strong> {selectedBooking.addressText}
                    </span>
                  </div>
                </div>

                {/* Assigned Clinician (if any) */}
                {selectedBooking.providerName && (
                  <div className="rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] p-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#065F46] block">
                        Assigned Clinician
                      </span>
                      <strong className="text-xs text-[#15212B] block mt-0.5">
                        {selectedBooking.providerName}
                      </strong>
                    </div>
                    <span className="text-[10px] font-bold text-[#065F46] bg-white px-2 py-0.5 rounded-full border border-[#D1FAE5]">
                      Verified Practitioner
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-5 pt-4 border-t border-[#F2F8F5] flex items-center justify-between">
                <Link
                  href={`/patient/bookings/${selectedBooking.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] hover:underline"
                >
                  <span>Open Full Tracker</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-full bg-[#064E3B] px-5 py-2 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-2xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
