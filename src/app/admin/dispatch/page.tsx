'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db, BookingRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

export default function AdminDispatchPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>(db.getBookings());
  const allProviders = db.getUsers().filter((u) => u.role !== 'PATIENT' && u.role !== 'ADMIN');

  // Reassignment Modal state
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const columns: { key: BookingRecord['status']; label: string; bg: string }[] = [
    { key: 'REQUESTED', label: 'Unassigned Queue', bg: 'bg-amber-500/10 text-amber-900 border-amber-200' },
    { key: 'ASSIGNED', label: 'Assigned / Scheduled', bg: 'bg-blue-500/10 text-blue-900 border-blue-200' },
    { key: 'ON_THE_WAY', label: 'Clinician En Route', bg: 'bg-emerald-500/10 text-emerald-900 border-emerald-200' },
    { key: 'IN_PROGRESS', label: 'In-Home Care Delivery', bg: 'bg-purple-500/10 text-purple-900 border-purple-200' },
    { key: 'COMPLETED', label: 'Concluded Today', bg: 'bg-gray-500/10 text-gray-900 border-gray-200' },
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
    }, 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Real-Time Fleet Routing
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Live Medical Dispatch Command Board
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Drag, reassign, and track clinicians navigating across regional mobile care zones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              Auto-Routing Active
            </span>
          </div>
        </div>

        {/* Dispatch Kanban Columns */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 min-h-[500px]">
          {columns.map((col) => {
            const colBookings = bookings.filter((b) => {
              if (col.key === 'IN_PROGRESS') {
                return b.status === 'IN_PROGRESS' || b.status === 'ARRIVED';
              }
              return b.status === col.key;
            });

            return (
              <div
                key={col.key}
                className="rounded-3xl border border-gray-200 bg-white/70 p-4 shadow-xs flex flex-col"
              >
                {/* Column Header */}
                <div className={`rounded-xl border p-2.5 text-center font-bold text-xs ${col.bg}`}>
                  <div className="flex items-center justify-between">
                    <span>{col.label}</span>
                    <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black">
                      {colBookings.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="mt-3 flex-1 space-y-3 overflow-y-auto">
                  {colBookings.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-[11px] text-gray-400">
                      Empty queue
                    </div>
                  ) : (
                    colBookings.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-[11px] font-bold text-gray-500">
                            {b.bookingNumber}
                          </span>
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-600">
                            {b.category.replace(/_/g, ' ')}
                          </span>
                        </div>

                        <h4 className="mt-2 text-xs font-bold text-gray-900">{b.serviceName}</h4>
                        <p className="mt-1 text-[11px] text-gray-600">
                          Patient: <strong>{b.beneficiaryName}</strong>
                        </p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{b.addressText}</p>

                        <div className="mt-3 border-t border-gray-100 pt-2 flex items-center justify-between text-[11px]">
                          <div>
                            {b.providerName ? (
                              <span className="font-bold text-[#116b70] truncate block max-w-[110px]">
                                {b.providerName}
                              </span>
                            ) : (
                              <span className="text-amber-600 font-bold">Unassigned</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenReassign(b)}
                            className="text-[10px] font-bold text-gray-700 hover:text-[#116b70] hover:underline"
                          >
                            Reassign ⇄
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#116b70]">
                    Dispatch Override
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Reassign {selectedBooking.bookingNumber}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleConfirmReassign} className="mt-4 space-y-4">
                <div className="rounded-xl bg-gray-50 p-3 text-xs space-y-1">
                  <p>
                    <span className="text-gray-500">Service:</span>{' '}
                    <strong>{selectedBooking.serviceName}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Patient:</span>{' '}
                    <strong>{selectedBooking.beneficiaryName}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Destination:</span>{' '}
                    {selectedBooking.addressText}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Select Replacement Practitioner
                  </label>
                  <select
                    value={selectedProviderId}
                    onChange={(e) => setSelectedProviderId(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs font-medium"
                  >
                    {allProviders.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role} • Rating: {p.rating || 4.9} ★ • {p.isOnline ? 'Online' : 'Offline'})
                      </option>
                    ))}
                  </select>
                </div>

                {successMessage && (
                  <p className="text-xs font-bold text-emerald-700 text-center">
                    {successMessage}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBooking(null)}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#116b70] px-5 py-2 text-xs font-bold text-white hover:bg-[#0d5559] shadow-sm"
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
