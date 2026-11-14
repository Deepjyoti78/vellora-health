'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db, BookingRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>(db.getBookings());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.beneficiaryName.toLowerCase().includes(search.toLowerCase()) ||
      (b.providerName && b.providerName.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || b.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleUpdateStatus = (id: string, status: BookingRecord['status']) => {
    db.updateBookingStatus(id, status);
    setBookings([...db.getBookings()]);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Platform Registry
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Master Care Bookings Registry
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Audit and manage every home visit, shift assignment, and clinical documentation transaction.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs self-start sm:self-center"
          >
            <Icon name="file-text" className="h-4 w-4" />
            Export Audit Ledger
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Booking #, Patient, or Clinician..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3.5 py-2 text-xs font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 p-2 text-xs font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="REQUESTED">Requested</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="ON_THE_WAY">On The Way</option>
              <option value="ARRIVED">Arrived</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-gray-300 p-2 text-xs font-semibold"
            >
              <option value="ALL">All Care Categories</option>
              <option value="DOCTOR_VISIT">Doctor Visit</option>
              <option value="NURSING_CARE">Nursing Care</option>
              <option value="CARETAKER">Caretaker</option>
              <option value="LAB_TESTS">Lab Diagnostics</option>
            </select>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 font-bold text-gray-700">
              <tr>
                <th className="px-4 py-3.5">Booking Identifier</th>
                <th className="px-4 py-3.5">Patient / Beneficiary</th>
                <th className="px-4 py-3.5">Care Service</th>
                <th className="px-4 py-3.5">Assigned Clinician</th>
                <th className="px-4 py-3.5">Scheduled Slot</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Payment</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3.5 font-mono font-bold text-gray-700">
                      {b.bookingNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-gray-900 block">{b.beneficiaryName}</span>
                      <span className="text-[10px] text-gray-500">{b.patientPhone}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-gray-900">{b.serviceName}</span>
                      <span className="block text-[10px] text-gray-400">
                        {b.shiftType?.replace(/_/g, ' ') || 'Standard Visit'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {b.providerName ? (
                        <span className="font-bold text-[#116b70]">{b.providerName}</span>
                      ) : (
                        <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">
                      <span className="block font-medium">{b.scheduledDate}</span>
                      <span className="text-[10px] text-gray-400">{b.scheduledTimeSlot}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          ['ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'COMPLETED'
                            ? 'bg-gray-100 text-gray-700'
                            : b.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-gray-900 block">${b.totalAmount}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">{b.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1">
                      {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-emerald-700"
                        >
                          Complete
                        </button>
                      )}
                      {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                          className="rounded-lg border border-red-200 px-2.5 py-1 text-[10px] font-bold text-red-600 hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
