'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { BackButton } from '@/components/common/BackButton';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Check,
  X,
  ArrowRight,
  FileText,
  HeartPulse,
  FlaskConical,
  Plus,
  AlertCircle,
} from 'lucide-react';

export default function PatientBookingsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Personal emergency');

  const allBookings = db.getBookingsByPatient(currentUser?.id || '');

  const activeCount = allBookings.filter((b) =>
    ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  ).length;
  const completedCount = allBookings.filter((b) => b.status === 'COMPLETED').length;
  const cancelledCount = allBookings.filter((b) => b.status === 'CANCELLED').length;

  const filteredBookings = allBookings.filter((b) => {
    if (activeTab === 'ACTIVE') {
      return ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status);
    }
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  const handleCancelBooking = (id: string) => {
    db.updateBookingStatus(id, 'CANCELLED', `Cancelled by patient: ${cancelReason}`);
    setCancellingBookingId(null);
  };

  const formatDateDisplay = (dateStr: string) => {
    try {
      if (!dateStr) return 'Date Pending';
      if (dateStr.includes(',')) return dateStr;
      const [year, month, day] = dateStr.split('-');
      if (year && month && day) {
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EE] border border-[#C6E7D9] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
            <Check className="h-3 w-3 stroke-[2.5]" />
            <span>Confirmed</span>
          </span>
        );
      case 'IN_PROGRESS':
      case 'ON_THE_WAY':
      case 'ARRIVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 text-[11px] font-bold text-[#B45309]">
            <Clock className="h-3 w-3 stroke-[2.2]" />
            <span>In Progress</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EE] border border-[#C6E7D9] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
            <Check className="h-3 w-3 stroke-[2.5]" />
            <span>Completed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE2E2] border border-[#FECACA] px-2.5 py-0.5 text-[11px] font-bold text-[#DC2626]">
            <X className="h-3 w-3 stroke-[2.5]" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
            <span>Requested</span>
          </span>
        );
    }
  };

  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'DOCTOR_VISIT':
        return { label: 'Doctor Visit', Icon: Stethoscope };
      case 'NURSING_CARE':
        return { label: 'Nursing Care', Icon: HeartPulse };
      case 'LAB_TESTS':
        return { label: 'Lab Tests', Icon: FlaskConical };
      default:
        return { label: category.replace(/_/g, ' '), Icon: Stethoscope };
    }
  };

  return (
    <PatientLayout>
      <div className="relative min-h-[calc(100vh-80px)] bg-[#F7FBF9] overflow-hidden w-full max-w-full">
        {/* Soft decorative background ambient glow */}
        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-[#E8F8F1] opacity-70 blur-3xl -translate-y-1/3 translate-x-1/3" />
        <div className="pointer-events-none absolute top-1/3 left-0 h-80 w-80 rounded-full bg-[#F0FAF5] opacity-60 blur-3xl -translate-x-1/3" />

        {/* Centered content container matching 1360px specification */}
        <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-6 sm:py-9 animate-fade-in-up w-full max-w-full">
          {/* Back to Dashboard Navigation Button */}
          <div className="mb-5 sm:mb-6">
            <BackButton
              href="/patient/dashboard"
              label="Back to Dashboard"
              className="rounded-full border border-[#D9ECE7] bg-white px-4 py-1.5 text-xs font-semibold text-[#102723] hover:bg-[#F2F8F5] transition-all shadow-2xs"
            />
          </div>

          {/* Heading Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7 sm:mb-8">
            <div>
              <p className="text-[12px] font-bold tracking-[0.14em] uppercase text-[#065F46] mb-1.5">
                APPOINTMENTS
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#102723] tracking-tight leading-tight">
                My Care Bookings
              </h1>
              <p className="mt-1 text-sm sm:text-[15px] text-slate-500 max-w-2xl font-normal leading-relaxed">
                Track and manage your care appointments, from upcoming visits to past records.
              </p>
            </div>

            {/* Primary Action Button: + Book New Appointment */}
            <Link
              href="/patient/book"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] hover:bg-[#065F46] px-5 sm:px-6 py-3 text-xs sm:text-[13px] font-bold text-white shadow-xs transition-all duration-200 shrink-0 self-start sm:self-center"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Book New Appointment</span>
            </Link>
          </div>

          {/* Filter Tabs Row */}
          <div className="border-b border-[#E2EBE7] pb-6 mb-7 sm:mb-8">
            <div className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('ALL')}
                className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === 'ALL'
                    ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-[#E2EBE7] hover:bg-slate-50'
                }`}
              >
                All Appointments ({allBookings.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ACTIVE')}
                className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === 'ACTIVE'
                    ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-[#E2EBE7] hover:bg-slate-50'
                }`}
              >
                Active &amp; Upcoming ({activeCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('COMPLETED')}
                className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === 'COMPLETED'
                    ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-[#E2EBE7] hover:bg-slate-50'
                }`}
              >
                Past &amp; Completed ({completedCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CANCELLED')}
                className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === 'CANCELLED'
                    ? 'bg-[#D1FAE5] text-[#065F46] border border-[#A7F3D0] shadow-2xs font-bold'
                    : 'bg-white text-slate-600 border border-[#E2EBE7] hover:bg-slate-50'
                }`}
              >
                Cancelled ({cancelledCount})
              </button>
            </div>
          </div>

          {/* Bookings List Cards */}
          <div className="space-y-5 sm:space-y-6">
            {filteredBookings.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[#D9ECE7] bg-white p-12 text-center shadow-xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#065F46] mb-3">
                  <Calendar className="h-6 w-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#102723]">No appointments found</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  You do not have any appointments under this category. Schedule a doctor visit, nursing care, or home diagnostic test anytime.
                </p>
                <Link
                  href="/patient/book"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Book New Appointment</span>
                </Link>
              </div>
            ) : (
              filteredBookings.map((b) => {
                const categoryInfo = getCategoryDetails(b.category);
                const CategoryIcon = categoryInfo.Icon;

                return (
                  <div
                    key={b.id}
                    className="group rounded-[20px] border border-[#D9ECE7] bg-white p-6 sm:p-7 sm:px-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#A7F3D0] hover:shadow-md transition-all duration-300 w-full max-w-full overflow-hidden"
                  >
                    {/* Top Metadata Row: Booking ID | Status Badge | Category Badge */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs text-slate-600 mb-2">
                      <span className="font-medium text-slate-500">
                        Booking ID: <strong className="font-mono text-[#102723]">{b.bookingNumber}</strong>
                      </span>

                      {getStatusBadge(b.status)}

                      <span className="text-slate-300 font-light select-none">|</span>

                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                        <CategoryIcon className="h-3.5 w-3.5 text-[#065F46]" />
                        <span>{categoryInfo.label}</span>
                      </div>
                    </div>

                    {/* Main Appointment Title */}
                    <h3 className="font-heading text-lg sm:text-[21px] font-bold text-[#102723] leading-snug mb-5 group-hover:text-[#065F46] transition-colors truncate">
                      {b.serviceName}
                    </h3>

                    {/* Lower Info Grid & Actions */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 sm:gap-6 pt-1 w-full min-w-0">
                      {/* 4 Information Columns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 flex-1 min-w-0">
                        {/* Col 1: Date & Time */}
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#065F46] shrink-0 border border-[#D9ECE7]">
                            <Calendar className="h-3.5 w-3.5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-xs sm:text-[13px] text-[#102723] truncate">
                              {formatDateDisplay(b.scheduledDate)}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              {b.scheduledTimeSlot}
                            </p>
                          </div>
                        </div>

                        {/* Col 2: Patient */}
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#065F46] shrink-0 border border-[#D9ECE7]">
                            <User className="h-3.5 w-3.5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Patient
                            </p>
                            <p className="font-bold text-xs sm:text-[13px] text-[#102723] mt-0.5 truncate">
                              {b.beneficiaryName} {b.beneficiaryRelation ? `(${b.beneficiaryRelation})` : '(Self)'}
                            </p>
                          </div>
                        </div>

                        {/* Col 3: Assigned Clinician */}
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#065F46] shrink-0 border border-[#D9ECE7]">
                            <Stethoscope className="h-3.5 w-3.5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Clinician
                            </p>
                            <p className="font-bold text-xs sm:text-[13px] text-[#065F46] mt-0.5 truncate">
                              {b.providerName || 'Coordinator Dispatch'}
                            </p>
                          </div>
                        </div>

                        {/* Col 4: Location */}
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#065F46] shrink-0 border border-[#D9ECE7]">
                            <MapPin className="h-3.5 w-3.5 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Location
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-snug line-clamp-2">
                              {b.addressText}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start xl:self-center pt-3 xl:pt-0 border-t xl:border-t-0 border-[#F2F8F5]">
                        <Link
                          href={`/patient/bookings/${b.id}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] hover:bg-[#065F46] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors whitespace-nowrap"
                        >
                          <span>View Details &amp; Track</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        {/* Cancel Action (Confirmed or Requested) */}
                        {['REQUESTED', 'CONFIRMED'].includes(b.status) && (
                          <button
                            type="button"
                            onClick={() => setCancellingBookingId(b.id)}
                            className="rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}

                        {/* Medical Records Action (Completed) */}
                        {b.status === 'COMPLETED' && (
                          <Link
                            href="/patient/records"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9ECE7] bg-white hover:bg-[#F2F8F5] text-[#102723] px-4 py-2.5 text-xs font-bold transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5 text-[#065F46]" />
                            <span>Medical Records</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cancel Confirmation Modal */}
          {cancellingBookingId && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fade-in"
            >
              <div className="w-full max-w-md rounded-[22px] bg-white p-6 sm:p-7 shadow-2xl border border-[#D9ECE7] animate-scale-in">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 shrink-0">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#102723]">Cancel Appointment?</h3>
                    <p className="text-xs text-slate-500">
                      Are you sure you want to cancel this booking?
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  If you paid online, your refund will be processed back to your original payment method within 24 hours.
                </p>

                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Reason for cancellation
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="block w-full rounded-xl border border-[#CBDCD5] bg-white p-2.5 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none"
                  >
                    <option value="Personal emergency">Personal emergency</option>
                    <option value="Symptoms improved">Symptoms improved</option>
                    <option value="Need to reschedule time">Need to reschedule time</option>
                    <option value="Booked by mistake">Booked by mistake</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCancellingBookingId(null)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Keep Appointment
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCancelBooking(cancellingBookingId)}
                    className="rounded-xl bg-red-600 hover:bg-red-700 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer shadow-2xs"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
