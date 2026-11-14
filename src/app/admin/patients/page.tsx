'use client';

import React, { useState } from 'react';
import { db, UserRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

export default function AdminPatientsPage() {
  const users = db.getUsers().filter((u) => u.role === 'PATIENT');
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<UserRecord | null>(null);

  const filtered = users.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Customer Management
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Patient & Family Circles Directory
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Profiles, saved delivery addresses, dependents, and medical consultation histories.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search patient by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-medium shadow-2xs"
          />
        </div>

        {/* Patients Table */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xs">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-gray-50 font-bold text-gray-700">
              <tr>
                <th className="px-4 py-3.5">Patient Full Name</th>
                <th className="px-4 py-3.5">Contact Details</th>
                <th className="px-4 py-3.5">Family Members</th>
                <th className="px-4 py-3.5">Primary Location</th>
                <th className="px-4 py-3.5">Bookings Count</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((p) => {
                const family = db.getFamilyMembers(p.id);
                const addrs = db.getAddresses(p.id);
                const bookings = db.getBookingsByPatient(p.id);

                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#116b70]/10 text-xs font-black text-[#116b70]">
                          {p.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block">{p.name}</span>
                          <span className="text-[10px] text-gray-400">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-gray-900 block font-medium">{p.email}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{p.phone}</span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-700">
                      <span className="font-bold">{family.length} Registered</span>
                      {family.length > 0 && (
                        <span className="block text-[10px] text-gray-500">
                          {family.map((f) => f.fullName).join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-gray-600 max-w-xs truncate">
                      {addrs[0] ? `${addrs[0].streetAddress}, ${addrs[0].city}` : 'San Francisco, CA'}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-gray-900">
                      {bookings.length} Completed
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedPatient(p)}
                        className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Patient Dossier Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-lg font-bold text-gray-900">{selectedPatient.name}</h3>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 rounded-2xl bg-gray-50 p-4">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <p className="font-bold text-gray-900">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <p className="font-bold text-gray-900">{selectedPatient.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900">Registered Dependents</h4>
                  <div className="mt-2 space-y-2">
                    {db.getFamilyMembers(selectedPatient.id).map((f) => (
                      <div key={f.id} className="rounded-xl border border-gray-200 p-2.5 flex justify-between">
                        <span>
                          <strong>{f.fullName}</strong> ({f.relationship})
                        </span>
                        <span className="font-semibold text-red-700">Blood: {f.bloodGroup}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900">Recent Medical Visits</h4>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {db.getBookingsByPatient(selectedPatient.id).map((b) => (
                      <div key={b.id} className="rounded-xl border border-gray-200 p-2.5 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-gray-900 block">{b.serviceName}</span>
                          <span className="text-[10px] text-gray-500">{b.scheduledDate} • {b.bookingNumber}</span>
                        </div>
                        <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="rounded-xl bg-gray-900 px-5 py-2 text-xs font-bold text-white hover:bg-gray-800"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
