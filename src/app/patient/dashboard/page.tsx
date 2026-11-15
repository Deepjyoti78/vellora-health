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
} from 'lucide-react';

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

  const firstName = currentUser?.name?.split(' ')[0] || 'Patient';

  const quickServices = [
    {
      name: 'Doctor Visit',
      desc: 'Physician consultation at home',
      href: '/services/doctor-consultations',
      icon: Stethoscope,
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-100 group-hover:bg-[#064E3B] group-hover:text-white',
    },
    {
      name: 'Home Nursing',
      desc: 'Dressing, injections & IV care',
      href: '/services/nursing-care',
      icon: HeartPulse,
      bg: 'bg-teal-50 text-teal-800 border-teal-100 group-hover:bg-[#064E3B] group-hover:text-white',
    },
    {
      name: 'Caretaker Shift',
      desc: '12h / 24h bedside support',
      href: '/services/rehab-critical-care',
      icon: Bed,
      bg: 'bg-amber-50 text-amber-800 border-amber-100 group-hover:bg-[#064E3B] group-hover:text-white',
    },
    {
      name: 'Lab Blood Draw',
      desc: 'Diagnostic panels at doorstep',
      href: '/services/diagnostics-labs',
      icon: FlaskConical,
      bg: 'bg-purple-50 text-purple-800 border-purple-100 group-hover:bg-[#064E3B] group-hover:text-white',
    },
  ];

  return (
    <PatientLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* SECTION A — PERSONALIZED WELCOME BANNER (Animated Fade Down) */}
        <section className="animate-fade-in-down flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-0.5 text-[11px] font-bold text-[#065F46] uppercase tracking-wider mb-2 shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Personal Healthcare Portal</span>
            </div>
            <h1 className="text-2xl font-black text-[#102820] sm:text-3xl tracking-tight flex items-center gap-2">
              <span>Welcome back, {firstName}</span>
              <span className="inline-block animate-pulse text-emerald-600 text-xl">✦</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-normal">
              Manage your appointments, medical records, and family healthcare in one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/patient/book"
              className="group inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span>Book Appointment</span>
            </Link>
          </div>
        </section>

        {/* SECTION B — UPCOMING APPOINTMENTS (Animated Fade Up Delay 1) */}
        <section aria-labelledby="upcomingVisitsHeading" className="animate-fade-in-up animate-delay-1">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:shadow-md transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center border border-[#D1FAE5] shadow-2xs">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="upcomingVisitsHeading" className="text-base sm:text-lg font-bold text-[#102820]">
                    Upcoming &amp; Active Appointments
                  </h2>
                  <p className="text-xs text-slate-500 font-normal">
                    Scheduled doorstep clinician visits and clinical procedures
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>{activeBookings.length} Active Visit{activeBookings.length === 1 ? '' : 's'}</span>
                </span>
                <Link
                  href="/patient/bookings"
                  className="group inline-flex items-center gap-1 text-xs font-bold text-[#065F46] hover:underline"
                >
                  <span>View All Bookings ({bookings.length})</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="card-hover-lift rounded-2xl border border-slate-200/80 bg-[#FAFCFB] p-5 transition-all duration-300 hover:border-[#065F46]/40 hover:bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                          {booking.bookingNumber}
                        </span>
                        <span className="text-xs text-slate-500">• Doorstep Service</span>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                          booking.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : booking.status === 'IN_PROGRESS' || booking.status === 'ON_THE_WAY'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        ● {booking.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="mt-3.5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <h3 className="text-base font-bold text-[#102820]">{booking.serviceName}</h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Patient: <strong className="text-slate-900">{booking.beneficiaryName}</strong> ({booking.beneficiaryRelation})
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#065F46]" />
                            {booking.scheduledDate}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#065F46]" />
                            {booking.scheduledTimeSlot}
                          </span>
                          {booking.addressText && (
                            <span className="inline-flex items-center gap-1.5 max-w-xs truncate">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{booking.addressText}</span>
                            </span>
                          )}
                        </div>
                        {booking.providerName && (
                          <p className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-100 px-2.5 py-1 rounded-lg w-fit">
                            Assigned Clinician: {booking.providerName}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:self-center">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer"
                        >
                          View Details
                        </button>
                        {['ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(booking.status) ? (
                          <Link
                            href={`/patient/bookings/${booking.id}`}
                            className="rounded-full bg-[#064E3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-2xs"
                          >
                            Track Visit Live
                          </Link>
                        ) : (
                          <Link
                            href="/patient/bookings"
                            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            Reschedule / Cancel
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 px-4 text-center bg-[#FAFCFB] rounded-2xl border border-dashed border-slate-200">
                <Calendar className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#102820]">No active visits scheduled at this moment</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Book a verified home doctor consultation, nursing procedure, or doorstep blood test whenever needed.
                </p>
                <Link
                  href="/patient/book"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-5 py-2 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-xs mt-4"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Book Your First Visit</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* SECTION C — HEALTHCARE MANAGEMENT HUB (Animated Fade Up Delay 2) */}
        <section aria-labelledby="healthcareManagementHeading" className="animate-fade-in-up animate-delay-2">
          <div className="mb-4">
            <h2 id="healthcareManagementHeading" className="text-lg font-bold text-[#102820]">
              Healthcare Management Hub
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Direct access to your records, appointments, family circles, and personal health metrics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: My Bookings */}
            <div className="card-hover-lift flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-[#065F46]/40 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center border border-[#D1FAE5] group-hover:bg-[#064E3B] group-hover:text-white transition-all duration-300 shadow-2xs">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                    {bookings.length} Total
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#102820] group-hover:text-[#065F46] transition-colors">
                  My Bookings
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Upcoming and previous doorstep visits, consultation status, and care logs.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <Link
                  href="/patient/bookings"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] group-hover:translate-x-1 transition-transform"
                >
                  <span>View Bookings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Medical Records */}
            <div className="card-hover-lift flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-[#065F46]/40 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center border border-[#D1FAE5] group-hover:bg-[#064E3B] group-hover:text-white transition-all duration-300 shadow-2xs">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                    {prescriptions.length + labReports.length} Files
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#102820] group-hover:text-[#065F46] transition-colors">
                  Medical Records
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Verified clinician prescriptions, NABL lab test panels, and health reports.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <Link
                  href="/patient/records"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] group-hover:translate-x-1 transition-transform"
                >
                  <span>View Records</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Family Members */}
            <div className="card-hover-lift flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-[#065F46]/40 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center border border-[#D1FAE5] group-hover:bg-[#064E3B] group-hover:text-white transition-all duration-300 shadow-2xs">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
                    {familyMembers.length} Members
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#102820] group-hover:text-[#065F46] transition-colors">
                  Family Members
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Saved family profiles, dependents, and blood groups for one-click care booking.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <Link
                  href="/patient/family"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] group-hover:translate-x-1 transition-transform"
                >
                  <span>Manage Family</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 4: My Profile & Vitals */}
            <div className="card-hover-lift flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs hover:border-[#065F46]/40 hover:shadow-lg transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="h-11 w-11 rounded-2xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center border border-[#D1FAE5] group-hover:bg-[#064E3B] group-hover:text-white transition-all duration-300 shadow-2xs">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    Verified
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#102820] group-hover:text-[#065F46] transition-colors">
                  My Profile &amp; Vitals
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Personal contacts, registered home addresses, safety PIN, and vital statistics.
                </p>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <Link
                  href="/patient/account"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] group-hover:translate-x-1 transition-transform"
                >
                  <span>View Profile</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION D — QUICK BOOKING (Animated Fade Up Delay 3) */}
        <section aria-labelledby="quickBookingHeading" className="animate-fade-in-up animate-delay-3">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 id="quickBookingHeading" className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Quick Healthcare Dispatch
              </h2>
              <p className="text-xs text-slate-400 font-normal">
                Schedule a routine doctor visit, nurse, attendant, or diagnostic panel
              </p>
            </div>
            <Link href="/services" className="text-xs font-bold text-[#065F46] hover:underline flex items-center gap-1">
              <span>All 42 Services</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {quickServices.map((qs) => {
              const ServiceIcon = qs.icon;
              return (
                <Link
                  key={qs.name}
                  href={qs.href}
                  className="card-hover-lift flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-[#064E3B] hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200 ${qs.bg}`}>
                    <ServiceIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#102820] truncate group-hover:text-[#064E3B]">
                      {qs.name}
                    </p>
                    <p className="text-[10.5px] text-slate-500 truncate flex items-center gap-0.5">
                      <span>Book visit</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SECTION E — SUPPORT & EMERGENCY GUIDANCE (Animated Fade Up Delay 4) */}
        <section aria-labelledby="supportGuidanceHeading" className="animate-fade-in-up animate-delay-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 24/7 Clinical Assistance */}
            <div className="card-hover-lift rounded-3xl border border-[#E2EBE7] bg-white p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="h-9 w-9 rounded-xl bg-[#ECFDF5] text-[#065F46] flex items-center justify-center border border-[#D1FAE5]">
                    <PhoneCall className="h-4 w-4" />
                  </div>
                  <h3 id="supportGuidanceHeading" className="text-sm font-bold text-[#102820]">
                    Vellora 24/7 Care Coordination
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Need assistance with your booking, clinician dispatch updates, or medical prescriptions? Our triage team is available round the clock.
                </p>
                <div className="mt-3.5 text-xs">
                  <span className="font-semibold text-slate-500">Toll-Free Helpline: </span>
                  <span className="font-bold text-[#065F46] tracking-wide">1800-123-CARE (2273)</span>
                </div>
              </div>
              <div className="mt-5 pt-3.5 border-t border-slate-100">
                <Link
                  href="/patient/support"
                  className="group inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] hover:underline"
                >
                  <span>Open Assistance Hub</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Regional Emergency Guidance (Accurate: 112 / 108 Ambulance) */}
            <div className="card-hover-lift rounded-3xl border border-red-200 bg-red-50/70 p-6 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600 text-white text-xs font-bold shadow-2xs">
                    !
                  </span>
                  <h3 className="text-sm font-bold text-red-950">
                    Emergency Medical Guidance
                  </h3>
                </div>
                <p className="text-xs text-red-900 leading-relaxed">
                  Vellora Health provides scheduled home healthcare. For acute life-threatening emergencies (severe chest pain, respiratory distress, major trauma), immediately contact public ambulance dispatch.
                </p>
                <div className="mt-3.5 flex items-center gap-4 text-xs font-bold text-red-900">
                  <span className="bg-white/80 px-2 py-0.5 rounded-md border border-red-200">National: 112</span>
                  <span className="bg-white/80 px-2 py-0.5 rounded-md border border-red-200">Ambulance: 108</span>
                </div>
              </div>
              <div className="mt-5 pt-3.5 border-t border-red-200/60 flex items-center justify-between">
                <span className="text-[11px] text-red-800 font-medium">Public Emergency Services</span>
                <Link
                  href="/patient/support"
                  className="rounded-full bg-red-700 px-3.5 py-1 text-[11px] font-bold text-white hover:bg-red-800 transition-colors shadow-2xs"
                >
                  Emergency Protocol
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* APPOINTMENT DETAILS MINIMAL POPUP MODAL */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bookingModalTitle"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#E2EBE7] bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header: Title, Reference & Close */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {selectedBooking.bookingNumber}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      selectedBooking.status === 'CONFIRMED'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : ['IN_PROGRESS', 'ON_THE_WAY', 'ARRIVED'].includes(selectedBooking.status)
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    ● {selectedBooking.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 id="bookingModalTitle" className="text-lg font-bold text-[#102820] leading-snug">
                  {selectedBooking.serviceName}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Clean Details Grid */}
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              {/* Schedule & Time */}
              <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF9] p-3.5 border border-slate-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100/70 text-[#065F46] shrink-0">
                  <Calendar className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {selectedBooking.scheduledDate} • {selectedBooking.scheduledTimeSlot}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Doorstep Bedside Visit</p>
                </div>
              </div>

              {/* Patient / Beneficiary & Location */}
              <div className="flex items-start gap-3 rounded-2xl bg-[#F8FAF9] p-3.5 border border-slate-100">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100/70 text-blue-700 shrink-0">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-900">
                    {selectedBooking.beneficiaryName}{' '}
                    <span className="font-normal text-slate-500">({selectedBooking.beneficiaryRelation})</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{selectedBooking.addressText}</span>
                  </p>
                </div>
              </div>

              {/* Assigned Clinician & Bedside Safety PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="rounded-2xl bg-[#F8FAF9] p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Clinician</p>
                  <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5 text-xs truncate">
                    <Stethoscope className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                    <span className="truncate">{selectedBooking.providerName || 'Pending Clinician Dispatch'}</span>
                  </p>
                </div>

                <div className="rounded-2xl bg-[#F8FAF9] p-3 border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bedside Safety PIN</p>
                  <p className="font-mono font-black text-emerald-800 text-sm mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{selectedBooking.verificationPin || '4829'}</span>
                  </p>
                </div>
              </div>

              {/* Payment & Rate Status */}
              <div className="flex items-center justify-between rounded-2xl bg-[#F8FAF9] px-4 py-2.5 border border-slate-100">
                <span className="text-slate-500">Service Fee:</span>
                <span className="font-bold text-slate-900">
                  ${selectedBooking.totalAmount || 95}.00 •{' '}
                  <span className="text-emerald-700 font-semibold">{selectedBooking.paymentStatus || 'Paid'}</span>
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                Close
              </button>

              <Link
                href={`/patient/bookings/${selectedBooking.id}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-4.5 py-2 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-xs"
              >
                <span>Full Tracking Page</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
