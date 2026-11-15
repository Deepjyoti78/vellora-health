'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Icon } from '@/components/common/Icon';
import { BackButton } from '@/components/common/BackButton';

export default function PatientBookingsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Personal emergency');

  const allBookings = db.getBookingsByPatient(currentUser?.id || '');

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

  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'ON_THE_WAY':
      case 'ARRIVED':
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            {status.replace(/_/g, ' ')}
          </span>
        );
      case 'ASSIGNED':
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
            {status}
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-700">
            COMPLETED
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
            CANCELLED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            REQUESTED
          </span>
        );
    }
  };

  return (
    <PatientLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 animate-fade-in-up">
        {/* Back to Dashboard Navigation Button */}
        <div className="mb-4">
          <BackButton href="/patient/dashboard" label="Back to Dashboard" />
        </div>

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Appointments
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">My Care Bookings</h1>
            <p className="mt-1 text-xs text-gray-500">
              Track live visit progress, view clinical reports, reschedule, or cancel appointments.
            </p>
          </div>
          <Link
            href="/patient/book"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#116b70] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
          >
            + Book New Appointment
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'ALL'
                ? 'border-[#116b70] text-[#116b70]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Appointments ({allBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'ACTIVE'
                ? 'border-[#116b70] text-[#116b70]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Active & Upcoming (
            {
              allBookings.filter((b) =>
                ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(
                  b.status
                )
              ).length
            }
            )
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'COMPLETED'
                ? 'border-[#116b70] text-[#116b70]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Past & Completed ({allBookings.filter((b) => b.status === 'COMPLETED').length})
          </button>
          <button
            onClick={() => setActiveTab('CANCELLED')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'CANCELLED'
                ? 'border-[#116b70] text-[#116b70]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Cancelled ({allBookings.filter((b) => b.status === 'CANCELLED').length})
          </button>
        </div>

        {/* Bookings List */}
        <div className="mt-6 space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <Icon name="calendar" className="mx-auto h-10 w-10 text-gray-300" />
              <h3 className="mt-3 text-sm font-bold text-gray-800">No appointments found</h3>
              <p className="mt-1 text-xs text-gray-500">
                You do not have any appointments under this tab.
              </p>
              <Link
                href="/patient/book"
                className="mt-4 inline-block rounded-lg bg-[#116b70] px-4 py-2 text-xs font-bold text-white"
              >
                Schedule Care
              </Link>
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div
                key={b.id}
                className="card-hover-lift flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#065F46]/40 transition-all sm:flex-row sm:items-center"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">
                      {b.bookingNumber}
                    </span>
                    {getStatusBadge(b.status)}
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                      {b.category.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900">{b.serviceName}</h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Icon name="calendar" className="h-3.5 w-3.5 text-[#116b70]" />
                      {b.scheduledDate} ({b.scheduledTimeSlot})
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="user" className="h-3.5 w-3.5 text-gray-400" />
                      For: <strong className="text-gray-900">{b.beneficiaryName}</strong> ({b.beneficiaryRelation})
                    </span>
                    {b.providerName && (
                      <span className="flex items-center gap-1 text-[#116b70] font-semibold">
                        <Icon name="stethoscope" className="h-3.5 w-3.5" />
                        Clinician: {b.providerName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 truncate max-w-xl">
                    Location: {b.addressText}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                  <Link
                    href={`/patient/bookings/${b.id}`}
                    className="flex items-center gap-1 rounded-xl bg-[#116b70] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d5559] transition-colors"
                  >
                    View Details & Track
                    <Icon name="arrow-right" className="h-3.5 w-3.5" />
                  </Link>

                  {['REQUESTED', 'CONFIRMED'].includes(b.status) && (
                    <button
                      onClick={() => setCancellingBookingId(b.id)}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  {b.status === 'COMPLETED' && (
                    <Link
                      href="/patient/records"
                      className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                      Medical Records
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cancel Confirmation Modal */}
        {cancellingBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900">Cancel Appointment?</h3>
              <p className="mt-1 text-xs text-gray-500">
                Are you sure you want to cancel this booking? If you paid online, your refund will be processed within 24 hours.
              </p>

              <div className="mt-4">
                <label className="text-xs font-semibold text-gray-700">Reason for cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs"
                >
                  <option value="Personal emergency">Personal emergency</option>
                  <option value="Symptoms improved">Symptoms improved</option>
                  <option value="Need to reschedule time">Need to reschedule time</option>
                  <option value="Booked by mistake">Booked by mistake</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancellingBookingId(null)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelBooking(cancellingBookingId)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
