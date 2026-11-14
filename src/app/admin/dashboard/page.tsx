'use client';

import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

export default function AdminDashboardPage() {
  const allBookings = db.getBookings();
  const allUsers = db.getUsers();
  const providers = allUsers.filter((u) => u.role !== 'PATIENT' && u.role !== 'ADMIN');
  const patients = allUsers.filter((u) => u.role === 'PATIENT');
  const openTickets = db.getSupportTickets().filter((t) => t.status === 'OPEN');

  const activeVisits = allBookings.filter((b) =>
    ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );

  const totalRevenue = allBookings.reduce((sum, b) => sum + b.totalAmount, 0) + 38400;

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Operational Command
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Platform Executive Overview
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Live monitoring of in-home clinical visits, practitioner fleets, patient demand, and revenue flows.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/dispatch"
              className="flex items-center gap-2 rounded-xl bg-[#116b70] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
              Live Dispatch Board
            </Link>
          </div>
        </div>

        {/* 4 Hero KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-500">Gross Platform GMV</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                +18.4% MoM
              </span>
            </div>
            <div className="mt-3 text-3xl font-black text-gray-900">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-gray-500">Includes in-home visits & 24h nursing shifts</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-500">Active Visits Today</span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="mt-3 text-3xl font-black text-[#116b70]">
              {activeVisits.length} Visits
            </div>
            <p className="mt-1 text-xs text-emerald-700 font-semibold">
              98.2% on-time arrival within scheduled slot
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-500">Clinician Roster</span>
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                Active Fleet
              </span>
            </div>
            <div className="mt-3 text-3xl font-black text-gray-900">
              {providers.length} Vetted
            </div>
            <p className="mt-1 text-xs text-gray-500">Doctors, Nurses, Caretakers, Phlebotomists</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-gray-500">Action Queue</span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                Requires Review
              </span>
            </div>
            <div className="mt-3 text-3xl font-black text-amber-600">
              {openTickets.length + 1} Pending
            </div>
            <p className="mt-1 text-xs text-gray-500">1 provider credentialing • {openTickets.length} support tickets</p>
          </div>
        </div>

        {/* Two Columns: Live Dispatch Activity & Recent Bookings */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Recent Platform Bookings */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Real-Time Booking Stream</h3>
                  <p className="text-xs text-gray-500">Latest patient home care requests across the Bay Area.</p>
                </div>
                <Link
                  href="/admin/bookings"
                  className="text-xs font-bold text-[#116b70] hover:underline"
                >
                  View all ({allBookings.length}) →
                </Link>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
                  <thead className="bg-gray-50 font-bold text-gray-600">
                    <tr>
                      <th className="px-4 py-3">Booking #</th>
                      <th className="px-4 py-3">Patient</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Assigned Clinician</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {allBookings.slice(0, 6).map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono font-bold text-gray-600">
                          {b.bookingNumber}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {b.beneficiaryName}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{b.serviceName}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {b.providerName ? (
                            <span className="font-medium text-[#116b70]">{b.providerName}</span>
                          ) : (
                            <span className="text-amber-600 italic font-medium">Unassigned</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              ['ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
                                ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                                : b.status === 'COMPLETED'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-gray-900 text-right">
                          ${b.totalAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Fleet Utilization & Quick Commands */}
          <div className="space-y-6">
            {/* Clinician Fleet Status */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900">Clinician Fleet Status</h3>
              <p className="text-xs text-gray-500">Live practitioner availability by role.</p>

              <div className="mt-4 divide-y divide-gray-100">
                {providers.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-xs font-bold text-gray-800">
                        {p.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-900 block">{p.name}</span>
                        <span className="text-[10px] text-gray-500 block">
                          {p.role} • {p.rating || 4.9} ★
                        </span>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        p.isOnline
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {p.isOnline ? 'ON DUTY' : 'OFFLINE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900">Emergency Command Actions</h3>
              <div className="mt-4 space-y-2">
                <Link
                  href="/admin/dispatch"
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-xs font-bold text-gray-800 hover:border-[#116b70] transition-colors"
                >
                  <span>Manual Route Reassignment</span>
                  <Icon name="arrow-right" className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/admin/verifications"
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-xs font-bold text-gray-800 hover:border-[#116b70] transition-colors"
                >
                  <span>Review Pending Medical Licenses</span>
                  <Icon name="arrow-right" className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  href="/admin/finance"
                  className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-xs font-bold text-gray-800 hover:border-[#116b70] transition-colors"
                >
                  <span>Approve Weekly Payout Batch</span>
                  <Icon name="arrow-right" className="h-4 w-4 text-gray-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
