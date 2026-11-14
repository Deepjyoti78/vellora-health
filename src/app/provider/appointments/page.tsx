'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import { Icon } from '@/components/common/Icon';

export default function ProviderAppointmentsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  const allBookings = db.getBookings();
  const myBookings = allBookings.filter(
    (b) => b.providerId === currentUser.id || !b.providerId
  );

  const filtered = myBookings.filter((b) => {
    if (activeTab === 'ACTIVE') {
      return ['ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'CONFIRMED'].includes(b.status);
    }
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Clinical Operations
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Visits & Patient Itinerary
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Manage in-home consultations, track scheduled patient visits, and complete clinical charts.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-colors ${
              activeTab === 'ALL'
                ? 'border-[#116b70] text-[#116b70]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Assigned ({myBookings.length})
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
              myBookings.filter((b) =>
                ['ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'CONFIRMED'].includes(b.status)
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
            Past & Completed ({myBookings.filter((b) => b.status === 'COMPLETED').length})
          </button>
        </div>

        {/* List of Visits */}
        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
              No appointments found in this view.
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b.id}
                className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center transition-shadow hover:shadow-md"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">
                      {b.bookingNumber}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        ['ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : b.status === 'COMPLETED'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900">{b.serviceName}</h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span>
                      Patient: <strong className="text-gray-900">{b.beneficiaryName}</strong> ({b.beneficiaryRelation})
                    </span>
                    <span>Date: {b.scheduledDate} ({b.scheduledTimeSlot})</span>
                    <span>Phone: {b.patientPhone}</span>
                  </div>

                  <p className="text-xs text-gray-500 truncate max-w-xl">
                    Location: {b.addressText}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Link
                    href={`/provider/appointments/${b.id}`}
                    className="flex items-center gap-1.5 rounded-xl bg-[#116b70] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0d5559] transition-colors"
                  >
                    Open Clinical Cockpit
                    <Icon name="arrow-right" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ProviderLayout>
  );
}
