'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

export default function AdminDashboardPage() {
  const bookingsData = [
    {
      number: 'VEL-2026-8941',
      patient: 'Eleanor Vance',
      service: 'Home Visit Doctor Consultations',
      clinician: 'Dr. Maya Patel',
      isUnassigned: false,
      status: 'CONFIRMED',
      statusClass: 'bg-[#e0f2fe] text-[#0369a1]',
      amount: '$95',
    },
    {
      number: 'VEL-2026-8942',
      patient: 'Harold Vance (Father)',
      service: 'Home Nursing Care',
      clinician: 'Nurse Sarah Jenkins',
      isUnassigned: false,
      status: 'IN_PROGRESS',
      statusClass: 'bg-[#dcfce7] text-[#15803d]',
      amount: '$55',
    },
    {
      number: 'VEL-2026-8943',
      patient: 'Eleanor Vance',
      service: 'Home Lab Investigations',
      clinician: 'Alex Rivera',
      isUnassigned: false,
      status: 'COMPLETED',
      statusClass: 'bg-[#f1f5f9] text-[#475569]',
      amount: '$45',
    },
    {
      number: 'VEL-2026-8944',
      patient: 'Arthur Pendelton',
      service: 'Patient Caretakers & Medical Maids',
      clinician: 'James Thornton',
      isUnassigned: false,
      status: 'ASSIGNED',
      statusClass: 'bg-[#ede9fe] text-[#6d28d9]',
      amount: '$120',
    },
    {
      number: 'VEL-2026-8945',
      patient: 'Arthur Pendelton',
      service: 'Home Visit Doctor Consultations',
      clinician: 'Unassigned',
      isUnassigned: true,
      status: 'REQUESTED',
      statusClass: 'bg-[#e0f2fe] text-[#0284c7]',
      amount: '$95',
    },
  ];

  const cliniciansData = [
    {
      initials: 'DMP',
      name: 'Dr. Maya Patel',
      role: 'DOCTOR',
      rating: '4.9 ★',
      status: 'ON DUTY',
      statusClass: 'bg-[#e6f7f2] text-[#0d7858]',
    },
    {
      initials: 'DEP',
      name: 'Dr. Ethan Park',
      role: 'DOCTOR',
      rating: '4.8 ★',
      status: 'OFFLINE',
      statusClass: 'bg-[#f1f5f9] text-[#64748b]',
    },
    {
      initials: 'NSJ',
      name: 'Nurse Sarah Jenkins',
      role: 'NURSE',
      rating: '4.9 ★',
      status: 'ON DUTY',
      statusClass: 'bg-[#e6f7f2] text-[#0d7858]',
    },
    {
      initials: 'JT',
      name: 'James Thornton',
      role: 'CARETAKER',
      rating: '4.8 ★',
      status: 'ON DUTY',
      statusClass: 'bg-[#e6f7f2] text-[#0d7858]',
    },
    {
      initials: 'AR',
      name: 'Alex Rivera',
      role: 'PHLEBOTOMIST',
      rating: '4.9 ★',
      status: 'ON DUTY',
      statusClass: 'bg-[#e6f7f2] text-[#0d7858]',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-7 max-w-7xl mx-auto">
        {/* Page Title & Operational Action */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#0e756e]">
              OPERATIONAL COMMAND
            </p>
            <h1 className="font-heading text-2xl font-black text-[#11191b] sm:text-3xl">
              Platform Executive Overview
            </h1>
            <p className="mt-1 text-xs text-[#5c6e75]">
              Live monitoring of in-home clinical visits, practitioner fleets, patient demand, and revenue flows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/dispatch"
              className="inline-flex items-center gap-2 rounded-full bg-[#0e756e] hover:bg-[#0b5c57] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
              <span>Live Dispatch Board</span>
            </Link>
          </div>
        </div>

        {/* 4 Hero KPI Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Gross Platform GMV */}
          <div className="relative overflow-hidden rounded-2xl border border-[#dce5eb] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-gradient-to-tl from-emerald-200/50 via-teal-100/30 to-transparent pointer-events-none blur-2xl" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e6f7f2] text-[#0e756e]">
                  <Icon name="layers" className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  GROSS PLATFORM GMV
                </span>
              </div>
              <span className="rounded-full bg-[#e2f8f0] px-2 py-0.5 text-[10px] font-bold text-[#0d7858]">
                ▲ +15.4% MoM
              </span>
            </div>
            <div className="mt-3.5 text-3xl font-black text-[#11191b] tracking-tight relative z-10">
              $38,810
            </div>
            <p className="mt-1 text-xs text-gray-500 relative z-10">
              Includes in-home visits &amp; 24h nursing shifts
            </p>
          </div>

          {/* Card 2: Active Visits Today */}
          <div className="relative overflow-hidden rounded-2xl border border-[#dce5eb] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-gradient-to-tl from-teal-200/50 via-emerald-100/30 to-transparent pointer-events-none blur-2xl" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e6f7f2] text-[#0e756e]">
                  <Icon name="calendar" className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  ACTIVE VISITS TODAY
                </span>
              </div>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="mt-3.5 text-3xl font-black text-[#0e756e] tracking-tight relative z-10">
              4 Visits
            </div>
            <p className="mt-1 text-xs font-semibold text-[#0d7858] relative z-10">
              92.3% on-time arrival within scheduled slot
            </p>
          </div>

          {/* Card 3: Clinician Roster */}
          <div className="relative overflow-hidden rounded-2xl border border-[#dce5eb] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-gradient-to-tl from-blue-200/50 via-sky-100/30 to-transparent pointer-events-none blur-2xl" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ebf4ff] text-[#2563eb]">
                  <Icon name="users" className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  CLINICIAN ROSTER
                </span>
              </div>
              <span className="rounded-full bg-[#e0edff] px-2 py-0.5 text-[10px] font-bold text-[#1d4ed8]">
                Active Fleet
              </span>
            </div>
            <div className="mt-3.5 text-3xl font-black text-[#11191b] tracking-tight relative z-10">
              5 Vetted
            </div>
            <p className="mt-1 text-xs text-gray-500 relative z-10">
              Doctors, Nurses, Caretakers, Phlebotomists
            </p>
          </div>

          {/* Card 4: Action Queue */}
          <div className="relative overflow-hidden rounded-2xl border border-[#dce5eb] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-gradient-to-tl from-amber-200/50 via-orange-100/30 to-transparent pointer-events-none blur-2xl" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fef3eb] text-[#d97706]">
                  <span className="text-sm font-bold">⚡</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  ACTION QUEUE
                </span>
              </div>
              <span className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[10px] font-bold text-[#b45309]">
                Requires Review
              </span>
            </div>
            <div className="mt-3.5 text-3xl font-black text-[#d97706] tracking-tight relative z-10">
              2 Pending
            </div>
            <p className="mt-1 text-xs text-gray-500 relative z-10">
              1 provider credentialing • 1 support tickets
            </p>
          </div>
        </div>

        {/* Two Columns Grid: Booking Stream (Left) & Clinician Fleet Status (Right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* Left: Real-Time Booking Stream (8 Columns) */}
          <div className="lg:col-span-8 rounded-2xl border border-[#dce5eb] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between pb-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#11191b]">
                  Real-Time Booking Stream
                </h2>
                <p className="text-xs text-[#5c6e75] mt-0.5">
                  Latest patient home care requests across the Bay Area.
                </p>
              </div>
              <Link
                href="/admin/bookings"
                className="text-xs font-bold text-[#0e756e] hover:underline"
              >
                View all (6) →
              </Link>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e5edf1] text-[11px] font-extrabold text-[#5c6e75]">
                    <th className="py-3 px-3">Booking #</th>
                    <th className="py-3 px-3">Patient</th>
                    <th className="py-3 px-3">Service</th>
                    <th className="py-3 px-3">Assigned Clinician</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f4f7]">
                  {bookingsData.map((b) => (
                    <tr key={b.number} className="hover:bg-[#f8fafb] transition-colors">
                      <td className="py-3.5 px-3 font-mono font-medium text-gray-700 whitespace-nowrap">
                        {b.number}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#11191b] whitespace-nowrap">
                        {b.patient}
                      </td>
                      <td className="py-3.5 px-3 text-gray-600 whitespace-nowrap">
                        {b.service}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {b.isUnassigned ? (
                          <span className="font-semibold text-amber-600">Unassigned</span>
                        ) : (
                          <span className="font-medium text-[#0e756e]">{b.clinician}</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${b.statusClass}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-[#11191b] whitespace-nowrap">
                        {b.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Clinician Fleet Status & Actions (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Clinician Fleet Status */}
            <div className="rounded-2xl border border-[#dce5eb] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div>
                <h2 className="font-heading text-base font-bold text-[#11191b]">
                  Clinician Fleet Status
                </h2>
                <p className="text-xs text-[#5c6e75] mt-0.5">
                  Live practitioner availability by role.
                </p>
              </div>

              <div className="mt-5 space-y-3.5">
                {cliniciansData.map((c) => (
                  <div
                    key={c.initials}
                    className="flex items-center justify-between rounded-xl p-1.5 hover:bg-[#f8fafb] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf1f4] text-[11px] font-black text-[#11191b]">
                        {c.initials}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#11191b] leading-tight">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {c.role} · {c.rating}
                        </p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wide ${c.statusClass}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Command Actions */}
            <div className="rounded-2xl border border-[#dce5eb] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <h3 className="font-heading text-sm font-bold text-[#11191b] mb-3">
                Emergency Command Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/admin/dispatch"
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-[#fbfcfc] px-3.5 py-2.5 text-xs font-semibold text-gray-800 hover:border-[#0e756e] hover:text-[#0e756e] transition"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-amber-500">⚠</span> Broadcast Triage Alert
                  </span>
                  <span>→</span>
                </Link>
                <Link
                  href="/admin/verifications"
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-[#fbfcfc] px-3.5 py-2.5 text-xs font-semibold text-gray-800 hover:border-[#0e756e] hover:text-[#0e756e] transition"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-blue-500">🛡</span> Review Pending Credentials (1)
                  </span>
                  <span>→</span>
                </Link>
                <Link
                  href="/admin/finance"
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-[#fbfcfc] px-3.5 py-2.5 text-xs font-semibold text-gray-800 hover:border-[#0e756e] hover:text-[#0e756e] transition"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-500">📊</span> Download Daily Operations CSV
                  </span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
