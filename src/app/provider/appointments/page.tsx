'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import { ArrowRight, Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function ProviderAppointmentsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  const allBookings = db.getBookings();
  const myBookings = allBookings.filter(
    (b) => (currentUser && b.providerId === currentUser.id) || !b.providerId
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
      <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-1 text-[11px] font-bold text-[#065F46] uppercase tracking-wider mb-2 shadow-2xs">
              Clinical Operations
            </div>
            <h1 className="font-heading text-2xl font-black text-[#15212B] sm:text-3xl tracking-tight">
              Visits &amp; Patient Itinerary
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
              Manage in-home consultations, track scheduled patient visits, and complete bedside clinical charts.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex border-b border-[#E5EAE9] gap-1">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Assigned ({myBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'ACTIVE'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active &amp; Upcoming (
            {
              myBookings.filter((b) =>
                ['ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS', 'CONFIRMED'].includes(b.status)
              ).length
            }
            )
          </button>
          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'COMPLETED'
                ? 'border-[#064E3B] text-[#064E3B]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Past &amp; Completed ({myBookings.filter((b) => b.status === 'COMPLETED').length})
          </button>
        </div>

        {/* List of Visits */}
        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-[#E5EAE9] bg-white p-12 text-center text-xs text-slate-500">
              No appointments found in this view.
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b.id}
                className="flex flex-col justify-between gap-4 rounded-[22px] border border-[#E5EAE9] bg-white p-6 shadow-2xs sm:flex-row sm:items-center provider-card-lift transition-all"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 rounded">
                      {b.bookingNumber}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        ['ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : b.status === 'COMPLETED'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <h3 className="font-heading text-base font-extrabold text-[#15212B]">{b.serviceName}</h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span>
                      Patient: <strong className="text-[#15212B]">{b.beneficiaryName}</strong> ({b.beneficiaryRelation})
                    </span>
                    <span>Date: <strong>{b.scheduledDate}</strong> ({b.scheduledTimeSlot})</span>
                    <span>Phone: {b.patientPhone}</span>
                  </div>

                  <p className="text-xs text-slate-500 truncate max-w-xl">
                    Location: {b.addressText}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <Link
                    href={`/provider/appointments/${b.id}`}
                    className="flex items-center gap-1.5 rounded-full bg-[#064E3B] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Open Clinical Cockpit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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
