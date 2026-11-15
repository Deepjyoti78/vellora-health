'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db, UserRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  Star,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  Mail,
  Award,
} from 'lucide-react';

export default function AdminProvidersPage() {
  const [users, setUsers] = useState<UserRecord[]>(db.getUsers());
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const providers = users.filter((u) => u.role !== 'PATIENT' && u.role !== 'ADMIN');

  const filtered = providers.filter((p) => {
    const matchesRole = filterRole === 'ALL' || p.role === filterRole;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.specialty && p.specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
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
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                Clinical Network
              </span>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                {providers.length} Vetted Practitioners
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Doctor & Clinician Fleet Roster
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Audit council certifications, active doorstep shift status, patient review ratings, and dispatch eligibility.
            </p>
          </div>

          <Link
            href="/admin/providers/applications"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#065F46] transition-colors self-start sm:self-center"
          >
            <span>Credential Verification Queue ({db.getProviderApplications().filter(a => a.status === 'UNDER_REVIEW' || a.status === 'SUBMITTED').length} Pending)</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Toolbar: Role Filter Pills & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2EBE7] pb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'DOCTOR', 'NURSE', 'CARETAKER', 'PHYSIOTHERAPIST', 'PHLEBOTOMIST'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFilterRole(role)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  filterRole === role
                    ? 'bg-[#064E3B] text-white shadow-2xs'
                    : 'bg-white border border-[#E2EBE7] text-slate-600 hover:bg-[#F2F8F5]'
                }`}
              >
                {role.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by clinician name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#E2EBE7] bg-white py-1.5 pl-9 pr-3 text-xs text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none"
            />
          </div>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const isApproved = p.verificationStatus === 'APPROVED' || !p.verificationStatus;

            return (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs hover:border-[#CBDCD5] hover:shadow-sm transition-all"
              >
                <div>
                  {/* Top: Avatar, Role Pill & Status Badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] font-heading font-black text-sm text-[#065F46] border border-[#D1FAE5]">
                        {p.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <h3 className="font-heading text-sm font-bold text-[#102820]">
                          {p.name}
                        </h3>
                        <span className="inline-block rounded-md bg-[#F2F8F5] px-1.5 py-0.5 text-[10px] font-bold text-[#065F46] uppercase">
                          {p.role}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        isApproved
                          ? 'bg-[#ECFDF5] text-[#065F46]'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <ShieldCheck className="h-3 w-3" />
                          <span>Verified</span>
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="h-3 w-3" />
                          <span>Suspended</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Specialty & Metrics */}
                  <div className="mt-4 space-y-2 rounded-xl bg-[#F5F9F7] p-3 text-xs border border-[#E2EBE7]/80">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Specialty:</span>
                      <strong className="text-[#102820]">
                        {p.specialty || 'General In-Home Medicine'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Experience:</span>
                      <span className="text-slate-700 font-medium">
                        {p.experienceYears || 8} Years
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hourly Rate:</span>
                      <strong className="text-[#065F46]">
                        ${p.hourlyRate || 80}/hr
                      </strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Satisfaction:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <strong className="text-[#102820]">{p.rating || 4.9}</strong>
                        <span className="text-[10px] text-slate-400">
                          ({p.reviewsCount || 100}+)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="mt-5 flex items-center justify-between border-t border-[#F2F8F5] pt-3 text-xs">
                  <button
                    type="button"
                    onClick={() => toggleOnline(p.id, !!p.isOnline)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                      p.isOnline
                        ? 'bg-[#ECFDF5] text-[#065F46] border border-[#D1FAE5]'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        p.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <span>{p.isOnline ? 'On Duty' : 'Offline'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleVerification(p.id, p.verificationStatus)}
                    className={`text-xs font-bold transition-colors ${
                      isApproved
                        ? 'text-rose-600 hover:text-rose-800'
                        : 'text-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    {isApproved ? 'Suspend Access' : 'Reactivate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
