'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db, UserRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

export default function AdminProvidersPage() {
  const [users, setUsers] = useState<UserRecord[]>(db.getUsers());
  const [filterRole, setFilterRole] = useState('ALL');

  const providers = users.filter((u) => u.role !== 'PATIENT' && u.role !== 'ADMIN');

  const filtered = providers.filter((p) => {
    if (filterRole === 'ALL') return true;
    return p.role === filterRole;
  });

  const toggleOnline = (id: string, current: boolean) => {
    db.updateUser(id, { isOnline: !current });
    setUsers([...db.getUsers()]);
  };

  const toggleVerification = (id: string, currentStatus?: string) => {
    const next = currentStatus === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
    db.updateUser(id, { verificationStatus: next as any });
    setUsers([...db.getUsers()]);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Clinical Network
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Healthcare Providers Directory
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Audit board certifications, active duty status, patient ratings, and dispatch eligibility.
            </p>
          </div>

          <Link
            href="/admin/verifications"
            className="flex items-center gap-2 rounded-xl bg-[#116b70] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors self-start sm:self-center"
          >
            Review Pending Credentials Queue →
          </Link>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          {['ALL', 'DOCTOR', 'NURSE', 'CARETAKER', 'PHLEBOTOMIST'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                filterRole === role
                  ? 'bg-[#116b70] text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {role.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#116b70]/10 text-base font-black text-[#116b70]">
                    {p.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      p.verificationStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.verificationStatus || 'APPROVED'}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-gray-900">{p.name}</h3>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                  {p.role}
                </span>

                <div className="mt-3 space-y-1 text-xs text-gray-600">
                  <p>
                    <span className="text-gray-400">Specialty:</span>{' '}
                    <strong>{p.specialty || 'General Care'}</strong>
                  </p>
                  <p>
                    <span className="text-gray-400">Experience:</span>{' '}
                    {p.experienceYears || 8} Years
                  </p>
                  <p>
                    <span className="text-gray-400">Base Rate:</span>{' '}
                    <strong className="text-gray-900">${p.hourlyRate || 80}/hr</strong>
                  </p>
                  <p>
                    <span className="text-gray-400">Patient Rating:</span>{' '}
                    <strong className="text-amber-500">{p.rating || 4.9} ★</strong> ({p.reviewsCount || 100}+ reviews)
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-gray-100 pt-4 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => toggleOnline(p.id, !!p.isOnline)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                    p.isOnline
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {p.isOnline ? '● On Duty' : '○ Offline'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleVerification(p.id, p.verificationStatus)}
                  className="font-bold text-xs text-red-600 hover:underline"
                >
                  {p.verificationStatus === 'APPROVED' ? 'Suspend' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
