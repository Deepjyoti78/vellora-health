'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Icon } from '@/components/common/Icon';
import { BackButton } from '@/components/common/BackButton';

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser } = useAuth();
  const booking = db.getBookingById(id);

  // Review state
  const [rating, setRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // If not found
  if (!booking) {
    return (
      <PatientLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <Icon name="calendar" className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Booking not found</h2>
          <p className="mt-2 text-xs text-gray-500">
            The booking identifier could not be located in our records.
          </p>
          <Link
            href="/patient/bookings"
            className="mt-6 inline-block rounded-xl bg-[#116b70] px-5 py-2.5 text-xs font-bold text-white"
          >
            Back to Bookings
          </Link>
        </div>
      </PatientLayout>
    );
  }

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

  return (
    <PatientLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 animate-fade-in-up">
        {/* Navigation Bar */}
        <div className="mb-4 flex items-center gap-2">
          <BackButton href="/patient/bookings" label="Back to Bookings" />
          <BackButton href="/patient/dashboard" label="Dashboard" />
        </div>

        {/* Top bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/patient/bookings"
                className="flex items-center gap-1 text-xs font-bold text-[#116b70] hover:underline"
              >
                <Icon name="arrow-left" className="h-3 w-3" />
                All Bookings
              </Link>
              <span className="text-gray-300">•</span>
              <span className="font-mono text-xs font-bold text-gray-500">
                {booking.bookingNumber}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
              {booking.serviceName}
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">
              Scheduled for {booking.scheduledDate} ({booking.scheduledTimeSlot})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs"
            >
              <Icon name="file-text" className="h-3.5 w-3.5" />
              Download Receipt
            </button>
            <Link
              href="/patient/support"
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs"
            >
              <Icon name="chat" className="h-3.5 w-3.5" />
              Support
            </Link>
          </div>
        </div>

        {/* Live Status Tracker Card */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#116b70]">
                Live Visit Status
              </span>
              <h2 className="text-lg font-black text-gray-900">
                {booking.status === 'CANCELLED'
                  ? 'Appointment Cancelled'
                  : stages[currentStageIndex]?.label || booking.status}
              </h2>
            </div>

            {booking.status === 'ON_THE_WAY' && (
              <div className="rounded-xl bg-emerald-50 px-3 py-1.5 text-right">
                <span className="block text-[10px] font-bold uppercase text-emerald-800">
                  Estimated Arrival
                </span>
                <span className="text-xs font-extrabold text-emerald-700">~14 mins away</span>
              </div>
            )}
          </div>

          {/* Stepper Steps */}
          {booking.status !== 'CANCELLED' ? (
            <div className="mt-8 space-y-6">
              <div className="relative">
                <div className="absolute left-3.5 top-2 h-[calc(100%-20px)] w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {stages.map((stage, idx) => {
                    const isDone = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div key={stage.key} className="relative flex items-start gap-4">
                        <div
                          className={`z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : isCurrent
                              ? 'bg-[#116b70] text-white ring-4 ring-[#116b70]/20'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isDone ? (
                            <Icon name="check" className="h-3.5 w-3.5" />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div className="pt-0.5">
                          <h4
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-[#116b70]'
                                : isDone
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {stage.label}
                          </h4>
                          <p className="mt-0.5 text-[11px] text-gray-500">{stage.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-xs text-red-800">
              <p className="font-bold">This appointment was cancelled.</p>
              <p className="mt-1">
                Reason: {booking.notes || 'Cancelled by request.'}
              </p>
            </div>
          )}
        </div>

        {/* Two-column Details Layout */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Clinician Profile (if assigned) */}
            {booking.providerName ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#116b70]">
                  Assigned Healthcare Practitioner
                </span>
                <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#116b70]/10 text-[#116b70] font-black text-lg">
                      {booking.providerName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {booking.providerName}
                      </h3>
                      <p className="text-xs font-medium text-[#116b70]">
                        {booking.providerRole?.replace(/_/g, ' ')} • Verified Practitioner
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-gray-500">
                        <Icon name="shield" className="h-3 w-3 text-emerald-600" />
                        <span>Background Checked & Board Certified</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href="tel:+15553456789"
                      className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-bold text-gray-800 hover:bg-gray-100"
                    >
                      <Icon name="phone" className="h-3.5 w-3.5" />
                      Call Clinician
                    </a>
                    <Link
                      href="/patient/support"
                      className="flex items-center gap-1.5 rounded-xl bg-[#116b70] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0d5559]"
                    >
                      <Icon name="chat" className="h-3.5 w-3.5" />
                      Chat
                    </Link>
                  </div>
                </div>

                {/* Safety Verification PIN */}
                <div className="mt-5 rounded-xl bg-emerald-50/70 p-3.5 border border-emerald-100 flex items-center justify-between">
                  <div className="text-xs text-emerald-900">
                    <strong className="block">Doorstep Security PIN: 4829</strong>
                    <span className="text-[11px] text-emerald-700">
                      Verify this 4-digit code with the clinician before welcoming them inside.
                    </span>
                  </div>
                  <span className="rounded-lg bg-emerald-600 px-3 py-1 font-mono text-sm font-black text-white tracking-widest">
                    4829
                  </span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center">
                <Icon name="user" className="mx-auto h-8 w-8 text-gray-300" />
                <h4 className="mt-2 text-sm font-bold text-gray-800">
                  Practitioner Assignment in Progress
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  Our algorithm is matching the nearest board-certified specialist. You will receive an SMS alert once confirmed.
                </p>
              </div>
            )}

            {/* Beneficiary & Clinical Notes */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900">Beneficiary & Visit Address</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-xl bg-gray-50 p-3.5">
                  <span className="font-semibold text-gray-500 block">Patient Name</span>
                  <span className="text-sm font-bold text-gray-900 mt-0.5 block">
                    {booking.beneficiaryName} ({booking.beneficiaryRelation})
                  </span>
                  <span className="text-gray-500 mt-1 block">Phone: {booking.patientPhone}</span>
                </div>
                <div className="rounded-xl bg-gray-50 p-3.5">
                  <span className="font-semibold text-gray-500 block">Delivery Location</span>
                  <span className="text-xs font-bold text-gray-900 mt-0.5 block">
                    {booking.addressText}
                  </span>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 text-xs">
                  <span className="font-bold text-amber-900 block">Clinical Symptoms / Notes:</span>
                  <p className="mt-1 text-amber-800">{booking.notes}</p>
                </div>
              )}
            </div>

            {/* Post-Visit Review (When Completed) */}
            {booking.status === 'COMPLETED' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900">Rate Your Care Experience</h3>
                {reviewSubmitted ? (
                  <div className="mt-3 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800">
                    Thank you! Your verified feedback helps us maintain exceptional quality standards.
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-xl ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-bold text-gray-700">
                        {rating} of 5 Stars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with the practitioner and care team..."
                      className="w-full rounded-lg border border-gray-300 p-2 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setReviewSubmitted(true)}
                      className="rounded-lg bg-[#116b70] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d5559]"
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Billing & Clinical Records */}
          <div className="space-y-6">
            {/* Payment & Invoice Breakdown */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900">Payment Breakdown</h3>
              <div className="mt-4 space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Care Fee</span>
                  <span className="font-semibold text-gray-900">
                    ${booking.totalAmount + (booking.discountAmount || 0) - 15}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Disposables & Transit</span>
                  <span className="font-semibold text-gray-900">$15</span>
                </div>
                {booking.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount ({booking.couponCode})</span>
                    <span>-${booking.discountAmount}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm font-black text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-[#116b70]">${booking.totalAmount}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Payment Status:</span>
                    <span
                      className={`font-bold ${
                        booking.paymentStatus === 'PAID'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Method:</span>
                    <span className="font-medium text-gray-800">{booking.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access to Clinical Records */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-bold text-gray-900">Clinical Records</h3>
              <p className="mt-1 text-xs text-gray-500">
                Access official diagnostics and doctor prescriptions generated from this visit.
              </p>
              <div className="mt-4 space-y-2">
                <Link
                  href="/patient/records"
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-xs font-semibold text-gray-800 hover:border-[#116b70] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Icon name="file-text" className="h-4 w-4 text-[#116b70]" />
                    Prescriptions & Medications
                  </span>
                  <Icon name="arrow-right" className="h-3.5 w-3.5 text-gray-400" />
                </Link>
                <Link
                  href="/patient/records"
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-xs font-semibold text-gray-800 hover:border-[#116b70] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Icon name="flask" className="h-4 w-4 text-purple-700" />
                    Diagnostic Lab Reports
                  </span>
                  <Icon name="arrow-right" className="h-3.5 w-3.5 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
