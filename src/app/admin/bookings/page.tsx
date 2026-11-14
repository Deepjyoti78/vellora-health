'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db, BookingRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  Search,
  Filter,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  XCircle,
} from 'lucide-react';

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

  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
      case 'ARRIVED':
      case 'ON_THE_WAY':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-bold text-[#065F46]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {status.replace(/_/g, ' ')}
          </span>
        );
      case 'ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Assigned
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
            <CheckCircle2 className="h-3 w-3 text-slate-500" />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700">
            <XCircle className="h-3 w-3 text-rose-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
            <Clock className="h-3 w-3 text-amber-500" />
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                Clinical Registry
              </span>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                {filtered.length} Bookings Logged
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Master Care Bookings Registry
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Audit and manage every home visit, shift assignment, and clinical documentation transaction.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-xl border border-[#E2EBE7] bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[#F2F8F5] shadow-2xs self-start sm:self-center transition-colors"
          >
            <Download className="h-4 w-4 text-slate-400" />
            <span>Export Audit Ledger</span>
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="rounded-2xl border border-[#E2EBE7] bg-white p-4 shadow-xs flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Booking #, Patient, or Clinician..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2 pl-10 pr-4 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[#E2EBE7] bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#064E3B] focus:outline-none"
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
              className="rounded-xl border border-[#E2EBE7] bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#064E3B] focus:outline-none"
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
        <div className="overflow-hidden rounded-2xl border border-[#E2EBE7] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E2EBE7] text-left text-xs">
              <thead className="bg-[#F2F8F5] font-extrabold uppercase tracking-wider text-[11px] text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Booking ID</th>
                  <th className="px-5 py-3.5">Patient / Beneficiary</th>
                  <th className="px-5 py-3.5">Care Service</th>
                  <th className="px-5 py-3.5">Assigned Clinician</th>
                  <th className="px-5 py-3.5">Scheduled Slot</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F8F5] bg-white">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-slate-400">
                      No bookings found matching filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F9FCFA] transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-[#065F46]">
                        {b.bookingNumber}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-[#102820] block">
                          {b.beneficiaryName}
                        </span>
                        <span className="text-[11px] text-slate-400">{b.patientPhone}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-800 block">
                          {b.serviceName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {b.shiftType?.replace(/_/g, ' ') || 'Standard Home Visit'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {b.providerName ? (
                          <span className="font-bold text-[#064E3B]">{b.providerName}</span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        <span className="block font-medium">{b.scheduledDate}</span>
                        <span className="text-[11px] text-slate-400">{b.scheduledTimeSlot}</span>
                      </td>
                      <td className="px-5 py-4 text-center">{getStatusBadge(b.status)}</td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-[#102820] block">
                          ${b.totalAmount}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right space-x-1.5">
                        {b.status !== 'COMPLETED' && b.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(b.id, 'COMPLETED')}
                            className="rounded-lg bg-[#064E3B] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#065F46] shadow-2xs transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {b.status !== 'CANCELLED' && b.status !== 'COMPLETED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                            className="rounded-lg border border-rose-200 px-3 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-50 transition-colors"
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
      </div>
    </AdminLayout>
  );
}
