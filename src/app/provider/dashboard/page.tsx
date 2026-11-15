'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import {
  Activity,
  CalendarCheck,
  DollarSign,
  Star,
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  FileText,
  User,
  ShieldCheck,
  Phone,
  Check,
  Radio,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(currentUser?.isOnline ?? true);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const allBookings = db.getBookings();

  // Clinician's assigned visits or requested matching their role
  const myVisits = allBookings.filter(
    (b) => (currentUser && b.providerId === currentUser.id) || (!b.providerId && b.status === 'CONFIRMED')
  );

  const activeVisits = myVisits.filter((b) =>
    ['ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );

  const completedVisits = myVisits.filter((b) => b.status === 'COMPLETED');

  // New incoming proximity requests awaiting clinician acceptance
  const incomingRequests = allBookings.filter(
    (b) => b.status === 'REQUESTED' || (b.status === 'CONFIRMED' && !b.providerId)
  );

  const toggleDutyStatus = () => {
    if (!currentUser) return;
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    db.updateUser(currentUser.id, { isOnline: nextStatus });
  };

  const handleAcceptRequest = (id: string) => {
    if (!currentUser) return;
    db.assignProvider(id, currentUser.id);
    db.updateBookingStatus(id, 'ASSIGNED');
    setAcceptedId(id);
    setTimeout(() => {
      setAcceptedId(null);
      router.push(`/provider/appointments/${id}`);
    }, 700);
  };

  const roleTitle = currentUser?.role ? currentUser.role.replace(/_/g, ' ') : 'Clinician';

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-[1560px] px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* ================= 1. SPACIOUS WELCOME HERO SECTION ================= */}
        <div className="rounded-[28px] border border-[#D9ECE7] bg-gradient-to-r from-white via-[#F7FBF9] to-[#ECFDF5] p-6 sm:p-10 shadow-[0_4px_24px_rgba(6,95,70,0.04)] relative overflow-hidden">
          {/* Subtle decorative background blur */}
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#D1FAE5]/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D9ECE7] px-3.5 py-1 text-xs font-bold text-[#065F46] shadow-2xs mb-3">
                <Sparkles className="h-3.5 w-3.5 text-[#10B981]" />
                <span className="uppercase tracking-wider">
                  {roleTitle} Workstation • Central Mobile Care Fleet
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-[#102723]">
                Good day, {currentUser?.name || 'Alex Rivera'}
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {currentUser?.specialty || 'General Mobile Healthcare Delivery'} • License:{' '}
                <span className="font-semibold text-slate-800">
                  {currentUser?.qualification || 'CPT - Certified Phlebotomy Technician'}
                </span>
              </p>

              {/* Quick action buttons */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/provider/appointments"
                  className="inline-flex items-center gap-2 rounded-full bg-[#065F46] hover:bg-[#054d39] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:gap-3"
                >
                  <span>View Clinical Schedule</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/provider/clinical-records"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D9ECE7] bg-white hover:bg-[#F2F8F5] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#102723] transition-colors shadow-2xs"
                >
                  <FileText className="h-4 w-4 text-[#065F46]" />
                  <span>Bedside Charting</span>
                </Link>
              </div>
            </div>

            {/* Right: Dedicated Availability & Dispatch Readiness Card */}
            <div className="shrink-0 w-full lg:w-88 rounded-[22px] border border-[#D9ECE7] bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2F8F5]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                    {isOnline && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                        isOnline ? 'bg-emerald-600' : 'bg-slate-400'
                      }`}
                    />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#102723]">
                    Dispatch Readiness
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleDutyStatus}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    isOnline ? 'bg-[#065F46]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle availability status"
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isOnline ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span
                    className={`font-bold ${
                      isOnline ? 'text-[#065F46]' : 'text-slate-500'
                    }`}
                  >
                    {isOnline ? '● On Duty (Accepting)' : '○ Off Duty'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Active Shift:</span>
                  <span className="font-semibold text-slate-800">08:00 AM – 06:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Assigned Zone:</span>
                  <span className="font-semibold text-slate-800">Central Bay Area Corridor</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#F2F8F5] flex items-center justify-between text-[11px]">
                <Link
                  href="/provider/availability"
                  className="font-bold text-[#065F46] hover:underline flex items-center gap-1"
                >
                  <span>Edit Schedule &amp; Zones</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
                <span className="text-slate-400">Auto-GPS Sync</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accepted notification banner */}
        {acceptedId && (
          <div className="rounded-[20px] bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Visit accepted! Opening clinical appointment cockpit &amp; bedside verification...</span>
          </div>
        )}

        {/* ================= 2. FOUR ELEVATED KPI METRIC CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Active Visits Today */}
          <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active Visits Today
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46]">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#102723]">{activeVisits.length}</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>1 in transit (En route to patient)</span>
            </div>
          </div>

          {/* Card 2: Completed Shifts */}
          <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Completed Shifts
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
                <CalendarCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#102723]">
              {completedVisits.length + 19}
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              Past 30 days • <span className="text-[#065F46] font-bold">100% on-time</span>
            </div>
          </div>

          {/* Card 3: Estimated Earnings */}
          <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Weekly Earnings
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46]">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-[#065F46]">$1,485.00</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Next ACH payout Friday, Nov 20</span>
            </div>
          </div>

          {/* Card 4: Patient Rating */}
          <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Patient Rating
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-500">
              {currentUser?.rating || 4.9} ★
            </div>
            <div className="mt-2 text-xs text-slate-500 font-medium">
              Based on <span className="font-bold text-slate-700">{currentUser?.reviewsCount || 130}</span> verified reviews
            </div>
          </div>
        </div>

        {/* ================= 3. NEW CARE REQUESTS IN YOUR PROXIMITY ================= */}
        {incomingRequests.length > 0 && (
          <div className="rounded-[28px] border border-[#D1FAE5] bg-gradient-to-r from-white via-white to-[#ECFDF5] p-6 sm:p-8 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#F2F8F5]">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
                </span>
                <h2 className="font-heading text-lg font-bold text-[#102723]">
                  New Care Requests in Your Proximity
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 text-xs font-bold text-[#065F46] self-start sm:self-center">
                <span>{incomingRequests.length} Pending Acceptance</span>
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-[22px] border border-[#D9ECE7] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top line: Booking ID + Payout */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-md bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#065F46]">
                        {req.bookingNumber}
                      </span>
                      <span className="text-sm font-black text-[#065F46] bg-[#F7FBF9] border border-[#D9ECE7] px-3 py-1 rounded-full">
                        Payout: ${Math.round(req.totalAmount * 0.75)} Net
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-[#102723] mt-1">{req.serviceName}</h3>

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          Patient: <strong className="text-[#102723]">{req.beneficiaryName || req.patientName}</strong> ({req.beneficiaryRelation || 'Self'})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          Scheduled: <strong>{req.scheduledDate}</strong> ({req.scheduledTimeSlot})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-sm">
                          Address: {req.addressText}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#F2F8F5] flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">4-Digit PIN Security Verified</span>
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(req.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Accept Visit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 4. TODAY'S ACTIVE ITINERARY ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#102723]">
                Today&apos;s Active Clinical Itinerary
              </h2>
              <p className="text-xs text-slate-500">
                Scheduled bedside patient visits, in-transit telemetry, and clinical charts.
              </p>
            </div>
            <Link
              href="/provider/appointments"
              className="text-xs font-bold text-[#065F46] hover:underline flex items-center gap-1"
            >
              <span>See all appointments</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {activeVisits.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#D9ECE7] bg-white p-12 text-center text-slate-500">
                <Calendar className="mx-auto h-9 w-9 text-slate-300 mb-2.5" />
                <h3 className="font-bold text-sm text-[#102723]">No Active Visits Currently Underway</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  You have no pending home visits in transit. Review proximity requests above or check the open dispatch pool.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    href="/provider/requests"
                    className="rounded-full bg-[#065F46] hover:bg-[#054d39] px-5 py-2.5 text-xs font-bold text-white shadow-2xs"
                  >
                    Browse Open Job Offers
                  </Link>
                  <Link
                    href="/provider/availability"
                    className="rounded-full border border-[#D9ECE7] bg-white hover:bg-[#F2F8F5] px-4 py-2.5 text-xs font-bold text-slate-700"
                  >
                    Update Available Shifts
                  </Link>
                </div>
              </div>
            ) : (
              activeVisits.map((v) => (
                <div
                  key={v.id}
                  className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-[#F7FBF9] border border-[#D9ECE7] px-2.5 py-0.5 rounded-md">
                        {v.bookingNumber}
                      </span>
                      <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-800">
                        {v.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#102723]">{v.serviceName}</h3>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
                      <span>
                        Patient: <strong className="text-[#102723]">{v.beneficiaryName}</strong>
                      </span>
                      <span>Time: <strong>{v.scheduledTimeSlot}</strong></span>
                      <span>Phone: <strong>{v.patientPhone}</strong></span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Destination Address: <strong className="text-slate-800">{v.addressText}</strong>
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Link
                      href={`/provider/appointments/${v.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-3 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <span>Open Visit Cockpit &amp; Charting</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================= 5. QUICK PRACTITIONER SHORTCUTS HUB ================= */}
        <div>
          <h2 className="font-heading text-lg font-bold text-[#102723] mb-4">
            Practitioner Management Hub
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/provider/clinical-records"
              className="rounded-[22px] border border-[#D9ECE7] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#102723]">Clinical Charting</h3>
              <p className="mt-1 text-xs text-slate-500">Record prescriptions, bedside vitals telemetry, and lab tags.</p>
            </Link>

            <Link
              href="/provider/availability"
              className="rounded-[22px] border border-[#D9ECE7] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 mb-3 group-hover:scale-105 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#102723]">Duty Shifts &amp; Zones</h3>
              <p className="mt-1 text-xs text-slate-500">Set weekly operational timetables and travel radius.</p>
            </Link>

            <Link
              href="/provider/earnings"
              className="rounded-[22px] border border-[#D9ECE7] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 group-hover:scale-105 transition-transform">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#102723]">Earnings &amp; Payouts</h3>
              <p className="mt-1 text-xs text-slate-500">Track net remuneration, bank ACH deposits, and 1099 vouchers.</p>
            </Link>

            <Link
              href="/provider/profile"
              className="rounded-[22px] border border-[#D9ECE7] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 mb-3 group-hover:scale-105 transition-transform">
                <User className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#102723]">Credentials &amp; Profile</h3>
              <p className="mt-1 text-xs text-slate-500">Update licensing credentials, specialty bio, and patient ratings.</p>
            </Link>
          </div>
        </div>

        {/* ================= 6. CLINICAL DISPATCH & ASSISTANCE ================= */}
        <div className="rounded-[24px] border border-[#D9ECE7] bg-[#F2F8F5] p-6 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#D9ECE7] text-[#065F46]">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-[#102723] text-sm">24/7 Clinical Coordination &amp; Dispatch Desk</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Need assistance with patient home access, route delays, or bedside emergencies?</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1.5 font-mono font-bold text-sm text-[#065F46] bg-white border border-[#D9ECE7] px-4 py-2 rounded-xl">
              +1 (800) 555-CARE
            </span>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
