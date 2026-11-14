'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db, BookingRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  MapPin,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Repeat,
  Radio,
  Filter,
  Search,
  Navigation,
} from 'lucide-react';

export default function AdminDispatchPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>(db.getBookings());
  const allProviders = db.getUsers().filter((u) => u.role !== 'PATIENT' && u.role !== 'ADMIN');

  // Reassignment Modal state
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const columns: {
    key: BookingRecord['status'];
    label: string;
    badgeColor: string;
    accentBorder: string;
  }[] = [
    {
      key: 'REQUESTED',
      label: 'Unassigned Queue',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      accentBorder: 'border-t-amber-400',
    },
    {
      key: 'ASSIGNED',
      label: 'Clinician Assigned',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      accentBorder: 'border-t-blue-500',
    },
    {
      key: 'ON_THE_WAY',
      label: 'En Route (Live GPS)',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      accentBorder: 'border-t-emerald-500',
    },
    {
      key: 'IN_PROGRESS',
      label: 'In-Home Care Delivery',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      accentBorder: 'border-t-purple-500',
    },
    {
      key: 'COMPLETED',
      label: 'Concluded Today',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      accentBorder: 'border-t-slate-400',
    },
  ];

  const handleOpenReassign = (b: BookingRecord) => {
    setSelectedBooking(b);
    setSelectedProviderId(allProviders[0]?.id || '');
  };

  const handleConfirmReassign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking || !selectedProviderId) return;

    db.assignProvider(selectedBooking.id, selectedProviderId);
    setBookings([...db.getBookings()]);
    setSuccessMessage(`Assigned clinician to ${selectedBooking.bookingNumber}!`);
    setTimeout(() => {
      setSuccessMessage('');
      setSelectedBooking(null);
    }, 1800);
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.bookingNumber.toLowerCase().includes(q) ||
      b.beneficiaryName.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      (b.providerName && b.providerName.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-full">
        {/* Board Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                Real-Time Telemetry
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
                <span>Auto-Dispatch Active</span>
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Live Medical Dispatch Board
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Live routing command center for doorstep physicians, nurses, phlebotomists, and elderly caretakers.
            </p>
          </div>

          {/* Quick Search & Filter */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search dispatch queue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border border-[#E2EBE7] bg-white py-1.5 pl-9 pr-3 text-xs text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none"
              />
            </div>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EBE7] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-[#F2F8F5] transition-colors"
            >
              <span>Master Bookings</span>
            </Link>
          </div>
        </div>

        {/* 5 Column Kanban Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 min-h-[600px] items-start">
          {columns.map((col) => {
            const colBookings = filteredBookings.filter((b) => {
              if (col.key === 'IN_PROGRESS') {
                return b.status === 'IN_PROGRESS' || b.status === 'ARRIVED';
              }
              return b.status === col.key;
            });

            return (
              <div
                key={col.key}
                className={`rounded-2xl border border-[#E2EBE7] border-t-4 ${col.accentBorder} bg-white p-3.5 shadow-xs flex flex-col`}
              >
                {/* Column Top Pill */}
                <div className={`rounded-xl border p-2.5 text-xs font-bold ${col.badgeColor}`}>
                  <div className="flex items-center justify-between">
                    <span className="truncate">{col.label}</span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black shadow-2xs">
                      {colBookings.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="mt-3.5 flex-1 space-y-3">
                  {colBookings.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[#E2EBE7] p-8 text-center text-xs text-slate-400">
                      No visits in queue
                    </div>
                  ) : (
                    colBookings.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-xl border border-[#E2EBE7] bg-white p-3.5 shadow-2xs hover:border-[#CBDCD5] hover:shadow-xs transition-all duration-150"
                      >
                        {/* Top bar with booking ID & Service Tag */}
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-mono text-[11px] font-bold text-slate-500">
                            {b.bookingNumber}
                          </span>
                          <span className="rounded-md bg-[#F2F8F5] px-1.5 py-0.5 text-[9px] font-bold text-[#065F46] uppercase truncate max-w-[100px]">
                            {b.category.replace(/_/g, ' ')}
                          </span>
                        </div>

                        {/* Service Title */}
                        <h4 className="mt-2 text-xs font-bold text-[#102820] leading-snug">
                          {b.serviceName}
                        </h4>

                        {/* Patient & Address */}
                        <div className="mt-2 space-y-1 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="font-semibold text-[#102820] truncate">
                              {b.beneficiaryName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{b.addressText}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                            <span>{b.scheduledTimeSlot || b.scheduledDate}</span>
                          </div>
                        </div>

                        {/* Footer: Clinician assignment & reassign button */}
                        <div className="mt-3.5 border-t border-[#F2F8F5] pt-2.5 flex items-center justify-between text-xs">
                          <div className="min-w-0 flex-1">
                            {b.providerName ? (
                              <span className="font-bold text-[#065F46] truncate block text-[11px]">
                                {b.providerName}
                              </span>
                            ) : (
                              <span className="text-amber-700 font-bold text-[11px]">
                                Unassigned
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenReassign(b)}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold text-[#064E3B] hover:bg-[#ECFDF5] transition-colors"
                          >
                            <Repeat className="h-3 w-3" />
                            <span>Reassign</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Reassignment Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-[#E2EBE7] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#E2EBE7] pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#065F46]">
                    Dispatch Override
                  </span>
                  <h3 className="font-heading text-base font-bold text-[#102820]">
                    Reassign {selectedBooking.bookingNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-[#F2F8F5] transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmReassign} className="mt-4 space-y-4">
                <div className="rounded-xl bg-[#F5F9F7] p-3 text-xs space-y-1.5 border border-[#E2EBE7]">
                  <p>
                    <span className="text-slate-500">Service:</span>{' '}
                    <strong className="text-[#102820]">{selectedBooking.serviceName}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Patient:</span>{' '}
                    <strong className="text-[#102820]">{selectedBooking.beneficiaryName}</strong>
                  </p>
                  <p>
                    <span className="text-slate-500">Destination:</span>{' '}
                    <span className="text-slate-700">{selectedBooking.addressText}</span>
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#102820]">
                    Select Replacement Practitioner
                  </label>
                  <select
                    value={selectedProviderId}
                    onChange={(e) => setSelectedProviderId(e.target.value)}
                    className="mt-1.5 block w-full rounded-xl border border-[#E2EBE7] bg-white p-2.5 text-xs font-semibold text-[#102820] focus:border-[#064E3B] focus:outline-none"
                  >
                    {allProviders.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role} • Rating: {p.rating || 4.9} ★ • {p.isOnline ? 'Online' : 'Offline'})
                      </option>
                    ))}
                  </select>
                </div>

                {successMessage && (
                  <p className="rounded-lg bg-[#ECFDF5] p-2 text-xs font-bold text-[#065F46] text-center">
                    {successMessage}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="rounded-xl border border-[#E2EBE7] px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-[#F2F8F5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#064E3B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#065F46] shadow-xs transition-colors"
                  >
                    Dispatch Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
