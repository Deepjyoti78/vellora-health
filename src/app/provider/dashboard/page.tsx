'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import { Icon } from '@/components/common/Icon';

export default function ProviderDashboardPage() {
  const { currentUser } = useAuth();
  const allBookings = db.getBookings();

  // Clinician's assigned visits or requested matching their role
  const myVisits = allBookings.filter(
    (b) => b.providerId === currentUser.id || (!b.providerId && b.status === 'CONFIRMED')
  );

  const activeVisits = myVisits.filter((b) =>
    ['ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );

  const completedVisits = myVisits.filter((b) => b.status === 'COMPLETED');

  // New incoming requests awaiting acceptance
  const incomingRequests = allBookings.filter(
    (b) => b.status === 'REQUESTED' || (b.status === 'CONFIRMED' && !b.providerId)
  );

  const [acceptedId, setAcceptedId] = useState<string | null>(null);

  const handleAcceptRequest = (id: string) => {
    db.assignProvider(id, currentUser.id);
    setAcceptedId(id);
    setTimeout(() => setAcceptedId(null), 3000);
  };

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome & Status Bar */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {currentUser.role}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs font-semibold text-gray-500">
                License: {currentUser.qualification || 'Board Certified'}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
              Good day, {currentUser.name}
            </h1>
            <p className="mt-0.5 text-xs text-gray-500">
              {currentUser.specialty || 'General Practitioner'} • Central Bay Area Mobile Care Unit
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/provider/appointments"
              className="rounded-xl bg-[#116b70] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
            >
              View Full Clinical Schedule
            </Link>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-gray-500">Active Visits Today</span>
            <div className="mt-2 text-2xl font-black text-gray-900">{activeVisits.length}</div>
            <span className="text-[11px] text-emerald-700 font-semibold">1 in transit</span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-gray-500">Completed Shifts</span>
            <div className="mt-2 text-2xl font-black text-gray-900">
              {completedVisits.length + 18}
            </div>
            <span className="text-[11px] text-gray-400">Past 30 days</span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-gray-500">Estimated Earnings</span>
            <div className="mt-2 text-2xl font-black text-[#116b70]">$1,485</div>
            <span className="text-[11px] text-emerald-700 font-semibold">Next payout Friday</span>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <span className="text-xs font-bold text-gray-500">Patient Rating</span>
            <div className="mt-2 text-2xl font-black text-amber-500">
              {currentUser.rating || 4.9} ★
            </div>
            <span className="text-[11px] text-gray-400">
              {currentUser.reviewsCount || 124} verified reviews
            </span>
          </div>
        </div>

        {/* Incoming Dispatch Queue */}
        {incomingRequests.length > 0 && (
          <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-950">
                  New Care Requests In Your Proximity
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-800">
                {incomingRequests.length} Pending Acceptance
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-900">
                        {req.bookingNumber}
                      </span>
                      <span className="text-sm font-black text-gray-900">
                        Payout: ${Math.round(req.totalAmount * 0.75)}
                      </span>
                    </div>

                    <h3 className="mt-2 text-base font-bold text-gray-900">{req.serviceName}</h3>
                    <div className="mt-1 space-y-0.5 text-xs text-gray-600">
                      <p>
                        <strong className="text-gray-800">Patient:</strong> {req.beneficiaryName} ({req.beneficiaryRelation})
                      </p>
                      <p>
                        <strong className="text-gray-800">Scheduled:</strong> {req.scheduledDate} ({req.scheduledTimeSlot})
                      </p>
                      <p className="text-gray-500 truncate max-w-sm">
                        Address: {req.addressText}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => handleAcceptRequest(req.id)}
                      className="rounded-xl bg-[#116b70] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0d5559] transition-colors"
                    >
                      Accept Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Active Visits Cockpit */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Today&apos;s Active Itinerary</h2>
            <Link
              href="/provider/appointments"
              className="text-xs font-bold text-[#116b70] hover:underline"
            >
              See all appointments →
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {activeVisits.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
                No active visits underway. Check incoming requests above or update shift availability.
              </div>
            ) : (
              activeVisits.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center transition-shadow hover:shadow-md"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-500">
                        {v.bookingNumber}
                      </span>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        {v.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900">{v.serviceName}</h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                      <span>Patient: <strong className="text-gray-900">{v.beneficiaryName}</strong></span>
                      <span>Time: {v.scheduledTimeSlot}</span>
                      <span>Phone: {v.patientPhone}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Destination: <strong>{v.addressText}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <Link
                      href={`/provider/appointments/${v.id}`}
                      className="rounded-xl bg-[#116b70] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
                    >
                      Open Visit Cockpit & Documentation
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
