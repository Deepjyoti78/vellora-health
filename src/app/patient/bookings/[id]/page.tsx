'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import {
  ArrowLeft,
  LayoutGrid,
  Home,
  Calendar,
  Clock,
  Check,
  Download,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Phone,
  FileText,
  User,
  AlertCircle,
  XCircle,
  X,
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

// Medical Clipboard, Healthcare Cross & Stethoscope Illustration Component
const MedicalClipboardIllustration = () => (
  <div className="relative w-48 sm:w-56 lg:w-64 h-36 sm:h-44 flex items-center justify-center select-none pointer-events-none">
    {/* Soft Mint Ambient Glow */}
    <div className="absolute inset-0 rounded-full bg-[#EAF8F2] blur-xl opacity-90" />

    <svg
      viewBox="0 0 240 180"
      className="w-full h-full relative z-10 drop-shadow-[0_8px_20px_rgba(6,95,70,0.12)]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background soft circular badge */}
      <circle cx="160" cy="85" r="65" fill="#E6F7F0" />
      <circle cx="160" cy="85" r="50" fill="#D1FAE5" opacity="0.6" />

      {/* Floating Plus Icons */}
      <path d="M70 50h8m-4-4v8" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
      <path d="M210 110h6m-3-3v6" stroke="#059669" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* Clipboard Body */}
      <g transform="rotate(-6 150 90)">
        {/* Board base */}
        <rect x="110" y="30" width="76" height="104" rx="10" fill="#10B981" />
        <rect x="111" y="31" width="74" height="102" rx="9" fill="#34D399" />

        {/* Paper Sheet */}
        <rect x="116" y="42" width="64" height="86" rx="5" fill="#FFFFFF" />

        {/* Medical Cross on Paper */}
        <rect x="144" y="52" width="8" height="8" rx="1.5" fill="#ECFDF5" />
        <path d="M148 53v6M145 56h6" stroke="#059669" strokeWidth="2" strokeLinecap="round" />

        {/* Paper Lines */}
        <rect x="124" y="66" width="48" height="2.5" rx="1" fill="#E2E8F0" />
        <rect x="124" y="73" width="48" height="2.5" rx="1" fill="#E2E8F0" />
        <rect x="124" y="80" width="36" height="2.5" rx="1" fill="#E2E8F0" />
        <rect x="124" y="87" width="44" height="2.5" rx="1" fill="#E2E8F0" />
        <rect x="124" y="94" width="40" height="2.5" rx="1" fill="#E2E8F0" />
        <rect x="124" y="101" width="48" height="2.5" rx="1" fill="#E2E8F0" />

        {/* Top Metallic Clip */}
        <rect x="136" y="24" width="24" height="12" rx="3" fill="#64748B" />
        <rect x="140" y="22" width="16" height="6" rx="2" fill="#94A3B8" />
        <circle cx="148" cy="30" r="2.5" fill="#CBD5E1" />
      </g>

      {/* Stethoscope Looping Around Clipboard */}
      <path
        d="M95 125 C 90 90, 110 55, 138 52 C 160 50, 175 70, 178 95 C 182 120, 155 145, 125 142 C 105 140, 92 120, 95 105"
        stroke="#1E293B"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      {/* Binaural & Earpieces */}
      <path
        d="M102 70 C 100 55, 95 45, 88 40"
        stroke="#94A3B8"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="88" cy="40" r="2.5" fill="#334155" />
      <path
        d="M112 65 C 110 50, 106 42, 102 38"
        stroke="#94A3B8"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="102" cy="38" r="2.5" fill="#334155" />

      {/* Chestpiece / Bell */}
      <circle cx="188" cy="115" r="9" fill="#94A3B8" />
      <circle cx="188" cy="115" r="6.5" fill="#CBD5E1" />
      <circle cx="188" cy="115" r="3.5" fill="#334155" />
    </svg>
  </div>
);

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser } = useAuth();
  const booking = db.getBookingById(id);

  // Review & Collapsible Details state
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // If not found
  if (!booking) {
    return (
      <PatientLayout>
        <div className="min-h-[80vh] flex items-center justify-center bg-[#F7FAF9] px-4 py-16">
          <div className="max-w-md w-full text-center bg-white rounded-[24px] border border-[#E5EAE9] p-8 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF5] text-[#065F46] mb-4">
              <Calendar className="h-6 w-6 stroke-[2]" />
            </div>
            <h2 className="text-xl font-bold text-[#15212B]">Booking Not Found</h2>
            <p className="mt-2 text-xs text-slate-500">
              The booking reference &ldquo;{id}&rdquo; could not be located in our records.
            </p>
            <Link
              href="/patient/bookings"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Bookings</span>
            </Link>
          </div>
        </div>
      </PatientLayout>
    );
  }

  // The 7 Stages specified in design specification
  const stages: { key: BookingRecord['status']; label: string; desc: string }[] = [
    { key: 'REQUESTED', label: 'Requested', desc: 'Booking submitted and received by care dispatch.' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Validated by clinical coordinator.' },
    { key: 'ASSIGNED', label: 'Assigned', desc: 'Vetted medical specialist assigned to this visit.' },
    { key: 'ON_THE_WAY', label: 'On The Way', desc: 'Clinician is in transit with diagnostic kit.' },
    { key: 'ARRIVED', label: 'Arrived', desc: 'Clinician is at the home address.' },
    { key: 'IN_PROGRESS', label: 'In Progress', desc: 'In-home clinical consultation / procedure is underway.' },
    { key: 'COMPLETED', label: 'Completed', desc: 'Visit concluded. Medical summary and records generated.' },
  ];

  const getStageIndex = (status: BookingRecord['status']) => {
    if (status === 'CANCELLED') return -1;
    const idx = stages.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStageIndex = getStageIndex(booking.status);
  const isCancelled = booking.status === 'CANCELLED';

  // Category badge label
  const categoryBadgeLabel =
    booking.category === 'DOCTOR_VISIT'
      ? 'Home Visit Consultation'
      : booking.category === 'NURSING_CARE'
      ? 'At-Home Nursing Care'
      : booking.category === 'CARETAKER'
      ? 'Patient Caretaker Service'
      : booking.category === 'LAB_TESTS'
      ? 'Home Diagnostic & Labs'
      : 'Doorstep Healthcare Service';

  // Format Status Label
  const displayStatus =
    booking.status === 'CANCELLED'
      ? 'Cancelled'
      : booking.status === 'ON_THE_WAY'
      ? 'On The Way'
      : booking.status === 'IN_PROGRESS'
      ? 'In Progress'
      : booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase();

  return (
    <PatientLayout>
      <div className="min-h-screen bg-[#F7FAF9] text-[#15212B] font-sans antialiased py-6 sm:py-8 lg:py-10">
        <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
          {/* ================= 3. TOP NAVIGATION (PILL BUTTONS ON HORIZONTAL ROW) ================= */}
          <div className="mb-5 flex items-center gap-3">
            <Link
              href="/patient/bookings"
              className="inline-flex items-center gap-2 rounded-full border border-[#DCE6E1] bg-white px-4 py-2 text-xs font-bold text-[#065F46] hover:bg-[#F2F8F5] hover:border-[#065F46]/30 transition-all shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Bookings</span>
            </Link>

            <Link
              href="/patient/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-[#DCE6E1] bg-white px-4 py-2 text-xs font-bold text-[#15212B] hover:bg-[#F2F8F5] hover:border-slate-300 transition-all shadow-2xs cursor-pointer"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* ================= 2. MAIN UNIFIED CARD ================= */}
          <div className="relative overflow-hidden rounded-[26px] border border-[#E5EAE9] bg-white p-6 sm:p-10 lg:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
            {/* Ambient Background Glow in Top-Right */}
            <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#EAF8F2]/60 blur-3xl pointer-events-none" />

            {/* ================= 4. APPOINTMENT HEADER + STATUS PILL ================= */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left Column: Category Badge, Heading, Subtitle */}
              <div className="max-w-2xl">
                {/* Category Badge */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-xs font-semibold text-[#065F46] mb-3 shadow-2xs">
                  <Home className="h-3.5 w-3.5" />
                  <span>{categoryBadgeLabel}</span>
                </div>

                {/* Main Heading - Refined, clean, not overly thick */}
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#102723] tracking-tight leading-snug">
                  {booking.serviceName}
                </h1>

                {/* Subtitle with Scheduled Date & Slot */}
                <div className="mt-2.5 flex items-center gap-2 text-xs sm:text-[13.5px] text-[#64748B] font-normal">
                  <Calendar className="h-4 w-4 text-[#64748B] shrink-0" />
                  <span>
                    Scheduled for {formatDisplayDate(booking.scheduledDate)} ({booking.scheduledTimeSlot})
                  </span>
                </div>
              </div>

              {/* Right Column: Confirmed Status Glowing Pill Badge with Stethoscope & Sparkles */}
              <div className="relative shrink-0 flex items-center self-start md:self-center">
                {/* Ambient Soft Glow Behind */}
                <div
                  className={`absolute inset-0 blur-xl rounded-full scale-125 pointer-events-none ${
                    isCancelled ? 'bg-rose-200/50' : 'bg-[#A7F3D0]/60'
                  }`}
                />

                {/* Subtle Decorative Sparkles (+) */}
                {!isCancelled && (
                  <>
                    <span className="absolute -top-3.5 left-4 text-[#10B981] text-xs font-bold select-none pointer-events-none">+</span>
                    <span className="absolute -top-1 -left-2 text-[#34D399] text-[10px] font-bold select-none pointer-events-none">+</span>
                    <span className="absolute -bottom-2 -right-1 text-[#10B981] text-sm font-bold select-none pointer-events-none">+</span>

                    {/* Faint stethoscope outline */}
                    <div className="absolute -right-6 -top-4 opacity-35 pointer-events-none text-[#059669]">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                        <path d="M4.5 3v5a4.5 4.5 0 0 0 9 0V3" />
                        <path d="M9 12.5v2a3.5 3.5 0 0 0 7 0v-2" />
                        <circle cx="18" cy="10" r="2.5" />
                      </svg>
                    </div>
                  </>
                )}

                {/* The Pill Badge */}
                <div
                  className={`relative z-10 flex items-center gap-3 rounded-full border px-6 sm:px-7 py-2.5 sm:py-3 shadow-[0_4px_20px_rgba(16,185,129,0.12)] ${
                    isCancelled
                      ? 'bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200 text-rose-800'
                      : 'bg-gradient-to-r from-[#F0FDF4] via-[#E8FAF0] to-[#DCFCE7] border-[#A7F3D0] text-[#064E3B]'
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-xs ${
                      isCancelled ? 'bg-rose-600' : 'bg-[#059669]'
                    }`}
                  >
                    {isCancelled ? (
                      <X className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <Check className="h-5 w-5 stroke-[2.8]" />
                    )}
                  </div>
                  <span className="font-heading text-lg sm:text-[21px] font-bold tracking-tight">
                    {displayStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= 5. VISIT PROGRESS ROW & ACTIONS ================= */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#F2F8F5]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                {/* Left: VISIT PROGRESS Label */}
                <h3 className="text-xs sm:text-[13px] font-bold uppercase tracking-wider text-[#065F46]">
                  VISIT PROGRESS
                </h3>

                {/* Right: Download Receipt & Support Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-full border border-[#DCE6E1] bg-white px-4 py-2 text-xs font-semibold text-[#15212B] hover:bg-[#F2F8F5] hover:border-slate-300 transition-colors shadow-2xs cursor-pointer active:scale-98"
                  >
                    <Download className="h-3.5 w-3.5 text-slate-600" />
                    <span>Download Receipt</span>
                  </button>

                  <Link
                    href="/patient/support"
                    className="inline-flex items-center gap-2 rounded-full border border-[#DCE6E1] bg-white px-4 py-2 text-xs font-semibold text-[#15212B] hover:bg-[#F2F8F5] hover:border-slate-300 transition-colors shadow-2xs cursor-pointer active:scale-98"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-slate-600" />
                    <span>Support</span>
                  </Link>
                </div>
              </div>

              {/* ================= 6. HORIZONTAL BOOKING PROGRESS TRACKER ================= */}
              {isCancelled ? (
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-5 text-xs text-rose-800">
                  <div className="flex items-center gap-2 font-bold text-rose-900 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>This appointment was cancelled</span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    Reason: {booking.notes || 'Cancelled by request.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Horizontal Tracker (7 Stages) */}
                  <div className="hidden md:block pt-2">
                    <div className="grid grid-cols-7 gap-2 relative">
                      {stages.map((stage, idx) => {
                        const isDone = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const isCompletedOrActive = idx <= currentStageIndex;

                        return (
                          <div key={stage.key} className="relative flex flex-col items-center text-center">
                            {/* Horizontal Connector to next stage */}
                            {idx < stages.length - 1 && (
                              <div
                                className={`absolute top-4 left-1/2 w-full h-[2px] -translate-y-1/2 z-0 ${
                                  idx < currentStageIndex ? 'bg-[#059669]' : 'bg-[#E2E8F0]'
                                }`}
                              />
                            )}

                            {/* Node Circle */}
                            <div
                              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                isDone
                                  ? 'bg-[#059669] text-white shadow-xs'
                                  : isCurrent
                                  ? 'bg-[#059669] text-white ring-4 ring-[#ECFDF5] shadow-xs'
                                  : 'bg-white border border-[#CBD5E1] text-[#64748B]'
                              }`}
                            >
                              {isCompletedOrActive ? (
                                <Check className="h-4 w-4 stroke-[2.5]" />
                              ) : (
                                <span>{idx + 1}</span>
                              )}
                            </div>

                            {/* Stage Name */}
                            <h4
                              className={`mt-3 text-xs sm:text-[13px] leading-tight ${
                                isCurrent
                                  ? 'text-[#065F46] font-bold'
                                  : isDone
                                  ? 'text-[#15212B] font-bold'
                                  : 'text-[#64748B] font-semibold'
                              }`}
                            >
                              {stage.label}
                            </h4>

                            {/* Stage Description */}
                            <p className="mt-1 text-[11px] text-[#64748B] leading-snug px-1 line-clamp-3">
                              {stage.desc}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Responsive Vertical Tracker */}
                  <div className="md:hidden space-y-4 pt-1">
                    <div className="relative pl-6 border-l-2 border-[#E2E8F0] space-y-5">
                      {stages.map((stage, idx) => {
                        const isDone = idx < currentStageIndex;
                        const isCurrent = idx === currentStageIndex;
                        const isCompletedOrActive = idx <= currentStageIndex;

                        return (
                          <div key={stage.key} className="relative flex items-start gap-3">
                            {/* Node Circle */}
                            <div
                              className={`absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                                isCompletedOrActive
                                  ? 'bg-[#059669] text-white'
                                  : 'bg-white text-slate-400 border border-slate-300'
                              }`}
                            >
                              {isCompletedOrActive ? <Check className="h-3 w-3 stroke-[2.5]" /> : idx + 1}
                            </div>

                            <div className="pt-0.5">
                              <h4
                                className={`text-xs font-semibold ${
                                  isCurrent
                                    ? 'text-[#065F46] font-bold'
                                    : isDone
                                    ? 'text-[#15212B] font-bold'
                                    : 'text-slate-400'
                                }`}
                              >
                                {stage.label}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">{stage.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ================= 10. RESTRAINED COLLAPSIBLE CLINICAL & PAYMENT DETAILS ================= */}
            <div className="mt-10 pt-6 border-t border-[#F2F8F5]">
              <button
                type="button"
                onClick={() => setShowFullDetails(!showFullDetails)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-[#065F46] hover:text-[#043328] transition-colors cursor-pointer group"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#059669]" />
                  <span>
                    {showFullDetails
                      ? 'Hide Full Clinical & Payment Details'
                      : 'View Full Clinical & Payment Details (Assigned Clinician, Security PIN, Invoice)'}
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-[#065F46] transition-transform duration-200 ${
                    showFullDetails ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showFullDetails && (
                <div className="mt-5 pt-5 border-t border-[#F2F8F5] grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                  {/* Left Column: Clinician & Safety PIN */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#E2EBE7] bg-[#FBFDFD] p-5 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#065F46]">
                        Assigned Healthcare Specialist
                      </span>

                      {booking.providerName ? (
                        <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46] font-bold text-base border border-[#D1FAE5]">
                              {booking.providerName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-[#15212B]">{booking.providerName}</h4>
                              <p className="text-xs text-[#065F46] font-medium">
                                {booking.providerRole?.replace(/_/g, ' ')} • Verified Practitioner
                              </p>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                                <ShieldCheck className="h-3 w-3 text-[#059669]" />
                                <span>Council Registered &amp; Verified</span>
                              </div>
                            </div>
                          </div>

                          <a
                            href="tel:+15553456789"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#DCE6E1] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#15212B] hover:bg-slate-50 transition-colors shadow-2xs w-fit"
                          >
                            <Phone className="h-3 w-3 text-[#065F46]" />
                            <span>Call Clinician</span>
                          </a>
                        </div>
                      ) : (
                        <p className="mt-2 text-xs text-slate-500">
                          Specialist matching in progress by central care dispatch.
                        </p>
                      )}

                      {/* Safety PIN */}
                      <div className="mt-4 rounded-xl bg-[#ECFDF5] p-3.5 border border-[#D1FAE5] flex items-center justify-between">
                        <div className="text-xs text-[#064E3B]">
                          <strong className="block font-bold">Doorstep Security PIN: 4829</strong>
                          <span className="text-[11px] text-[#065F46]">
                            Verify this 4-digit code with the clinician before welcoming them inside.
                          </span>
                        </div>
                        <span className="rounded-lg bg-[#065F46] px-3 py-1 font-mono text-sm font-black text-white tracking-widest shadow-2xs">
                          4829
                        </span>
                      </div>
                    </div>

                    {/* Beneficiary & Address */}
                    <div className="rounded-2xl border border-[#E2EBE7] bg-[#FBFDFD] p-5 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#065F46]">
                        Patient &amp; Location Details
                      </span>
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl bg-white border border-[#E2EBE7] p-3">
                          <span className="text-slate-500 font-medium block">Booking Reference</span>
                          <span className="text-sm font-bold font-mono text-[#065F46] mt-0.5 block">
                            {booking.bookingNumber}
                          </span>
                          <span className="text-slate-500 mt-1 block">
                            {formatDisplayDate(booking.scheduledDate)} • {booking.scheduledTimeSlot}
                          </span>
                        </div>
                        <div className="rounded-xl bg-white border border-[#E2EBE7] p-3">
                          <span className="text-slate-500 font-medium block">Patient Name</span>
                          <span className="text-sm font-bold text-[#15212B] mt-0.5 block">
                            {booking.beneficiaryName} ({booking.beneficiaryRelation})
                          </span>
                          <span className="text-slate-500 mt-1 block">Phone: {booking.patientPhone}</span>
                        </div>
                        <div className="rounded-xl bg-white border border-[#E2EBE7] p-3 sm:col-span-2">
                          <span className="text-slate-500 font-medium block">Home Address</span>
                          <span className="text-xs font-bold text-[#15212B] mt-0.5 block">
                            {booking.addressText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Payment & Feedback */}
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-[#E2EBE7] bg-[#FBFDFD] p-5 shadow-2xs">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#065F46]">
                        Invoice &amp; Payment Summary
                      </span>
                      <div className="mt-3 space-y-2 text-xs text-slate-600">
                        <div className="flex justify-between">
                          <span>Care Fee</span>
                          <span className="font-semibold text-[#15212B]">
                            ${booking.totalAmount + (booking.discountAmount || 0) - 15}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Disposables &amp; Transit</span>
                          <span className="font-semibold text-[#15212B]">$15</span>
                        </div>
                        {booking.discountAmount > 0 && (
                          <div className="flex justify-between text-[#059669] font-semibold">
                            <span>Discount ({booking.couponCode})</span>
                            <span>-${booking.discountAmount}</span>
                          </div>
                        )}
                        <div className="border-t border-[#E2EBE7] pt-2.5 flex justify-between text-sm font-bold text-[#15212B]">
                          <span>Total Amount</span>
                          <span className="text-[#064E3B] font-extrabold">${booking.totalAmount}</span>
                        </div>
                        <div className="mt-3 rounded-xl bg-white border border-[#E2EBE7] p-3 flex items-center justify-between text-xs">
                          <span className="text-slate-500">Payment Status:</span>
                          <span
                            className={`font-bold ${
                              booking.paymentStatus === 'PAID' ? 'text-[#059669]' : 'text-amber-600'
                            }`}
                          >
                            {booking.paymentStatus} ({booking.paymentMethod})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Post-Visit Review (When Completed) */}
                    {booking.status === 'COMPLETED' && (
                      <div className="rounded-2xl border border-[#E2EBE7] bg-[#FBFDFD] p-5 shadow-2xs">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#065F46]">
                          Care Feedback
                        </span>
                        {reviewSubmitted ? (
                          <div className="mt-2 text-xs text-[#065F46] font-semibold">
                            Thank you! Your verified feedback has been recorded.
                          </div>
                        ) : (
                          <div className="mt-2 space-y-2.5">
                            <div className="flex items-center gap-1 text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  className={`text-lg cursor-pointer ${
                                    star <= rating ? 'text-amber-400' : 'text-slate-300'
                                  }`}
                                >
                                  ★
                                </button>
                              ))}
                              <span className="ml-2 text-xs font-bold text-[#15212B]">{rating} / 5</span>
                            </div>
                            <textarea
                              rows={2}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Share your experience..."
                              className="w-full rounded-xl border border-[#E2EBE7] bg-white p-2.5 text-xs focus:outline-none focus:border-[#065F46]"
                            />
                            <button
                              type="button"
                              onClick={() => setReviewSubmitted(true)}
                              className="rounded-full bg-[#064E3B] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#065F46] transition-colors"
                            >
                              Submit Feedback
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
