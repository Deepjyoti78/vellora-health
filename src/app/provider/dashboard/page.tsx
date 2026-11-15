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
  Bell,
  HeartPulse,
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
      <div className="mx-auto max-w-[1360px] px-4 py-6 sm:py-8 lg:py-10 space-y-8 sm:space-y-10">
        {/* ================= 1. HERO / WELCOME SECTION ================= */}
        <section className="relative overflow-hidden rounded-[26px] border border-[#E5EAE9] bg-white p-6 sm:p-10 lg:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          {/* Ambient Background Mint Curves */}
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#EAF8F2]/70 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Heading, Subtitle, CTAs */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-[11px] font-bold text-[#065F46] uppercase tracking-wider mb-3.5 shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{roleTitle} Workstation • Mobile Care Unit</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#15212B] tracking-tight leading-[1.15] flex items-center gap-2.5">
                <span>Good day, {currentUser?.name || 'Alex Rivera'}</span>
                <span className="text-[#059669] text-2xl sm:text-3xl font-light select-none">✦</span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-[#64748B] font-normal max-w-xl leading-relaxed">
                {currentUser?.specialty || 'Home Blood Draw & Specimen Handling'} • License:{' '}
                <span className="font-semibold text-slate-800">
                  {currentUser?.qualification || 'CPT - Certified Phlebotomy Technician'}
                </span>
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/provider/appointments"
                  className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#065F46] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Calendar className="h-4 w-4" />
                  <span>View Clinical Schedule</span>
                </Link>
                <Link
                  href="/provider/clinical-records"
                  className="inline-flex items-center gap-2 rounded-full border border-[#D9ECE7] bg-[#F7FAF9] hover:bg-white px-5 py-3 text-xs sm:text-sm font-bold text-[#15212B] transition-colors shadow-2xs"
                >
                  <FileText className="h-4 w-4 text-[#065F46]" />
                  <span>Bedside Charting</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Clean Dispatch Readiness Card */}
            <div className="lg:col-span-5">
              <div className="rounded-[22px] border border-[#E2EBE7] bg-[#F4FAF7] p-5 sm:p-6 shadow-[0_4px_24px_rgba(6,95,70,0.04)]">
                <div className="flex items-center justify-between pb-4 border-b border-[#E2EBE7]">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-3 w-3 items-center justify-center">
                      {isOnline && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          isOnline ? 'bg-emerald-600' : 'bg-slate-400'
                        }`}
                      />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#15212B]">
                      Dispatch Status
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleDutyStatus}
                    className={`flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                      isOnline
                        ? 'bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46]'
                        : 'bg-white border border-slate-300 text-slate-600'
                    }`}
                  >
                    <span>{isOnline ? 'On Duty' : 'Off Duty'}</span>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-4 space-y-2.5 text-xs text-[#64748B]">
                  <div className="flex items-center justify-between">
                    <span>Shift Window:</span>
                    <strong className="text-[#15212B]">08:00 AM – 06:00 PM</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Assigned Territory:</span>
                    <strong className="text-[#15212B]">Central Care Corridor</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Live GPS Telemetry:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                      Active &amp; Ready
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#E2EBE7] flex items-center justify-between text-xs">
                  <Link
                    href="/provider/availability"
                    className="font-bold text-[#065F46] hover:underline flex items-center gap-1"
                  >
                    <span>Manage Shift Windows</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <span className="text-[11px] text-slate-400">Auto-GPS Sync</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accepted notification banner */}
        {acceptedId && (
          <div className="rounded-[20px] bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center gap-2.5 shadow-2xs animate-in fade-in duration-200">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Visit accepted! Opening clinical appointment cockpit &amp; bedside verification...</span>
          </div>
        )}

        {/* ================= 2. UNIFIED STATS SUMMARY ROW ================= */}
        <section className="rounded-[22px] border border-[#E5EAE9] bg-white p-5 sm:p-6 shadow-[0_2px_14px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-[#E5ECE9]">
            {/* Stat 1: Active Visits Today */}
            <div className="flex items-center gap-4 pt-0 sm:pt-0 lg:pl-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                <Activity className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#15212B] leading-none">
                  {activeVisits.length}
                </div>
                <div className="text-xs text-[#64748B] font-medium mt-1">Active Visits Today</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-0.5">1 in transit</div>
              </div>
            </div>

            {/* Stat 2: Completed Shifts */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 lg:pl-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                <CalendarCheck className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#15212B] leading-none">
                  {completedVisits.length + 19}
                </div>
                <div className="text-xs text-[#64748B] font-medium mt-1">Completed Shifts</div>
                <div className="text-[11px] font-bold text-slate-500 mt-0.5">Past 30 days</div>
              </div>
            </div>

            {/* Stat 3: Weekly Earnings */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 lg:pl-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs">
                <DollarSign className="h-5 w-5 stroke-[2]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-[#065F46] leading-none">
                  $1,485.00
                </div>
                <div className="text-xs text-[#64748B] font-medium mt-1">Weekly Remuneration</div>
                <div className="text-[11px] font-bold text-emerald-700 mt-0.5">Next payout Friday</div>
              </div>
            </div>

            {/* Stat 4: Patient Rating */}
            <div className="flex items-center gap-4 pt-3 sm:pt-0 lg:pl-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-2xs">
                <Star className="h-5 w-5 stroke-[2] fill-amber-400 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-500 leading-none">
                  {currentUser?.rating || 4.9} ★
                </div>
                <div className="text-xs text-[#64748B] font-medium mt-1">Patient Satisfaction</div>
                <div className="text-[11px] font-bold text-slate-500 mt-0.5">130 verified reviews</div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. PROXIMITY CARE REQUESTS ================= */}
        {incomingRequests.length > 0 && (
          <section className="rounded-[26px] border border-[#E5EAE9] bg-white p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#F2F8F5]">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46] border border-[#D1FAE5]">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-[#15212B]">
                    New Care Requests in Your Proximity
                  </h2>
                  <p className="text-xs text-slate-500">Live bedside visit dispatches awaiting your acceptance</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-xs font-bold text-[#065F46] self-start sm:self-center">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{incomingRequests.length} Pending Acceptance</span>
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-[22px] border border-[#E5EAE9] bg-[#F7FAF9] p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded-md bg-white border border-[#D9ECE7] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#065F46]">
                        {req.bookingNumber}
                      </span>
                      <span className="text-xs font-black text-[#065F46] bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1 rounded-full">
                        Payout: ${Math.round(req.totalAmount * 0.75)} Net
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-[#15212B] mt-1">{req.serviceName}</h3>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          Patient: <strong className="text-[#15212B]">{req.beneficiaryName || req.patientName}</strong> ({req.beneficiaryRelation || 'Self'})
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

                  <div className="mt-5 pt-4 border-t border-[#E5ECE9] flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">4-Digit PIN Security Verified</span>
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(req.id)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] hover:bg-[#065F46] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Accept Visit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= 4. TODAY'S ACTIVE ITINERARY ================= */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#15212B]">
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
              <div className="rounded-[24px] border border-dashed border-[#E5EAE9] bg-white p-12 text-center text-slate-500">
                <Calendar className="mx-auto h-9 w-9 text-slate-300 mb-2.5" />
                <h3 className="font-bold text-sm text-[#15212B]">No Active Visits Currently Underway</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  You have no pending home visits in transit. Review proximity requests above or check the open dispatch pool.
                </p>
                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    href="/provider/requests"
                    className="rounded-full bg-[#064E3B] hover:bg-[#065F46] px-5 py-2.5 text-xs font-bold text-white shadow-2xs"
                  >
                    Browse Open Job Offers
                  </Link>
                  <Link
                    href="/provider/availability"
                    className="rounded-full border border-[#E5EAE9] bg-white hover:bg-[#F2F8F5] px-4 py-2.5 text-xs font-bold text-slate-700"
                  >
                    Update Available Shifts
                  </Link>
                </div>
              </div>
            ) : (
              activeVisits.map((v) => (
                <div
                  key={v.id}
                  className="rounded-[24px] border border-[#E5EAE9] bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-[#F7FAF9] border border-[#E5EAE9] px-2.5 py-0.5 rounded-md">
                        {v.bookingNumber}
                      </span>
                      <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-0.5 text-xs font-bold text-emerald-800">
                        {v.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-[#15212B]">{v.serviceName}</h3>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-600">
                      <span>
                        Patient: <strong className="text-[#15212B]">{v.beneficiaryName}</strong>
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
                      className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] hover:bg-[#065F46] px-6 py-3 text-xs font-bold text-white shadow-xs transition-colors"
                    >
                      <span>Open Visit Cockpit &amp; Charting</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ================= 5. PRACTITIONER MANAGEMENT HUB ================= */}
        <section>
          <div className="mb-4">
            <h2 className="font-heading text-lg font-bold text-[#15212B]">
              Practitioner Management Hub
            </h2>
            <p className="text-xs text-slate-500">Direct access to clinical tools, earnings, shifts, and credentials.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/provider/clinical-records"
              className="rounded-[22px] border border-[#E5EAE9] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 group-hover:scale-105 transition-transform">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#15212B]">Clinical Charting</h3>
              <p className="mt-1 text-xs text-slate-500">Record prescriptions, bedside vitals telemetry, and lab tags.</p>
            </Link>

            <Link
              href="/provider/availability"
              className="rounded-[22px] border border-[#E5EAE9] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 group-hover:scale-105 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#15212B]">Duty Shifts &amp; Zones</h3>
              <p className="mt-1 text-xs text-slate-500">Set weekly operational timetables and travel radius.</p>
            </Link>

            <Link
              href="/provider/earnings"
              className="rounded-[22px] border border-[#E5EAE9] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 group-hover:scale-105 transition-transform">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#15212B]">Earnings &amp; Payouts</h3>
              <p className="mt-1 text-xs text-slate-500">Track net remuneration, bank ACH deposits, and 1099 vouchers.</p>
            </Link>

            <Link
              href="/provider/profile"
              className="rounded-[22px] border border-[#E5EAE9] bg-white p-5 shadow-2xs hover:shadow-xs hover:border-[#A7F3D0] transition-all group"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] mb-3 group-hover:scale-105 transition-transform">
                <User className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-sm font-bold text-[#15212B]">Credentials &amp; Profile</h3>
              <p className="mt-1 text-xs text-slate-500">Update licensing credentials, specialty bio, and patient ratings.</p>
            </Link>
          </div>
        </section>

        {/* ================= 6. CLINICAL DISPATCH & ASSISTANCE ================= */}
        <section className="rounded-[24px] border border-[#E5EAE9] bg-[#F4FAF7] p-6 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#E2EBE7] text-[#064E3B] shadow-2xs">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-[#15212B] text-sm">24/7 Clinical Coordination &amp; Dispatch Desk</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Need assistance with patient home access, route delays, or bedside emergencies?</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1.5 font-mono font-bold text-sm text-[#064E3B] bg-white border border-[#E2EBE7] px-4 py-2 rounded-full shadow-2xs">
              +1 (800) 555-CARE
            </span>
          </div>
        </section>
      </div>
    </ProviderLayout>
  );
}
