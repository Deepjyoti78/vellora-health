'use client';

import React, { useState } from 'react';
import { db, UserRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  Search,
  User,
  Users,
  MapPin,
  Calendar,
  Phone,
  Mail,
  FileText,
  Heart,
  X,
  ExternalLink,
} from 'lucide-react';

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
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                Patient Registry
              </span>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                {users.length} Active Patients
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Patients & Family Care Circles
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Profiles, registered delivery addresses, elderly dependents, and clinical consultation records.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#E2EBE7] bg-white py-2 pl-10 pr-4 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none shadow-2xs"
          />
        </div>

        {/* Patients Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E2EBE7] bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E2EBE7] text-left text-xs">
              <thead className="bg-[#F2F8F5] font-extrabold uppercase tracking-wider text-[11px] text-slate-500">
                <tr>
                  <th className="px-5 py-3.5">Patient Full Name</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Family Circle</th>
                  <th className="px-5 py-3.5">Primary Location</th>
                  <th className="px-5 py-3.5">Bookings</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F8F5] bg-white">
                {filtered.map((p) => {
                  const family = db.getFamilyMembers(p.id);
                  const addrs = db.getAddresses(p.id);
                  const bookings = db.getBookingsByPatient(p.id);

                  return (
                    <tr key={p.id} className="hover:bg-[#F9FCFA] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] font-heading font-black text-xs text-[#065F46] border border-[#D1FAE5]">
                            {p.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <span className="font-bold text-[#102820] block">{p.name}</span>
                            <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[#102820] block font-medium">{p.email}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{p.phone}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        <span className="font-bold text-[#102820]">{family.length} Dependents</span>
                        {family.length > 0 && (
                          <span className="block text-[11px] text-slate-400 truncate max-w-xs">
                            {family.map((f) => f.fullName).join(', ')}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600 max-w-xs truncate">
                        {addrs[0] ? `${addrs[0].streetAddress}, ${addrs[0].city}` : 'San Francisco, CA'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-[#065F46]">
                          {bookings.length} Visits
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedPatient(p)}
                          className="rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#E2EBE7] transition-colors"
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
        </div>

        {/* Patient Dossier Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-2xl border border-[#E2EBE7] bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#E2EBE7] pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#065F46] font-bold text-xs">
                    {selectedPatient.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#102820]">
                    {selectedPatient.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-[#F2F8F5] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#F5F9F7] p-3.5 border border-[#E2EBE7]">
                  <div>
                    <span className="text-slate-400">Email Address:</span>
                    <p className="font-semibold text-[#102820]">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Primary Phone:</span>
                    <p className="font-semibold text-[#102820]">{selectedPatient.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-[#102820]">
                    Registered Dependents ({db.getFamilyMembers(selectedPatient.id).length})
                  </h4>
                  <div className="mt-2 space-y-2">
                    {db.getFamilyMembers(selectedPatient.id).map((f) => (
                      <div
                        key={f.id}
                        className="rounded-xl border border-[#E2EBE7] p-2.5 flex justify-between items-center text-xs"
                      >
                        <div>
                          <strong className="text-[#102820]">{f.fullName}</strong>{' '}
                          <span className="text-slate-500">({f.relationship})</span>
                        </div>
                        <span className="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                          Blood: {f.bloodGroup}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-[#102820]">
                    Recent Medical Visits
                  </h4>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                    {db.getBookingsByPatient(selectedPatient.id).map((b) => (
                      <div
                        key={b.id}
                        className="rounded-xl border border-[#E2EBE7] p-2.5 flex justify-between items-center text-xs"
                      >
                        <div>
                          <span className="font-semibold text-[#102820] block">
                            {b.serviceName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {b.scheduledDate} • {b.bookingNumber}
                          </span>
                        </div>
                        <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
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
                  className="rounded-xl bg-[#064E3B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#065F46] transition-colors"
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
