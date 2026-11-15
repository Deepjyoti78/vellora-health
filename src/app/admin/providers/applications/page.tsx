'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, ProviderApplicationRecord, UserRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  AlertTriangle,
  Stethoscope,
  Activity,
  HeartHandshake,
  UserCheck,
  Syringe,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function AdminProviderApplicationsPage() {
  const [applications, setApplications] = useState<ProviderApplicationRecord[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = () => {
    setApplications([...db.getProviderApplications()]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = (app: ProviderApplicationRecord) => {
    db.updateProviderApplication(app.id, {
      status: 'APPROVED',
      reviewedBy: 'Dr. Maya Patel (CMO)',
      reviewedAt: new Date().toISOString(),
      adminNotes: 'Primary source credentials verified against State Council Registry. Fully cleared for in-home dispatch.',
    });

    // Check if user exists or create them
    const existingUsers = db.getUsers();
    const userMatch = existingUsers.find((u) => u.email.toLowerCase() === app.email.toLowerCase());
    if (userMatch) {
      db.updateUser(userMatch.id, {
        verificationStatus: 'APPROVED',
        isOnline: true,
      });
    } else {
      db.createUser({
        name: app.fullName,
        email: app.email,
        phone: app.phone,
        role: app.role,
        rating: 4.9,
        reviewsCount: 1,
        isOnline: true,
        verificationStatus: 'APPROVED',
        specialty: app.specialty || (app.role === 'DOCTOR' ? 'General & Acute Care' : 'Bedside Care'),
        qualification: app.qualification,
        licenseNumber: app.licenseNumber,
        registrationCouncil: app.registrationCouncil,
        serviceLocations: app.serviceLocations,
      });
    }

    loadData();
    setActionMessage(`Approved ${app.fullName} as verified ${app.role}! Clinician is now active on the dispatch roster.`);
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleReject = (appId: string, name: string) => {
    const reason = prompt(`Enter reason for rejecting ${name}'s application:`, 'Unverifiable medical council license number');
    if (!reason) return;

    db.updateProviderApplication(appId, {
      status: 'REJECTED',
      reviewedBy: 'Dr. Maya Patel (CMO)',
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason,
    });

    loadData();
    setActionMessage(`Application for ${name} marked as REJECTED.`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleRequestInfo = (appId: string, name: string) => {
    const notes = prompt(`Note for ${name} requesting additional information:`, 'Please re-upload a higher-resolution copy of your state council certificate.');
    if (!notes) return;

    db.updateProviderApplication(appId, {
      status: 'ADDITIONAL_INFO_REQUIRED',
      reviewedBy: 'Dr. Maya Patel (CMO)',
      reviewedAt: new Date().toISOString(),
      adminNotes: notes,
    });

    loadData();
    setActionMessage(`Requested additional information from ${name}.`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus = selectedStatus === 'ALL' || app.status === selectedStatus;
    const matchesRole = selectedRole === 'ALL' || app.role === selectedRole;
    const matchesSearch =
      !searchQuery ||
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.licenseNumber && app.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesRole && matchesSearch;
  });

  const pendingCount = applications.filter((a) => a.status === 'UNDER_REVIEW' || a.status === 'SUBMITTED').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                Clinical Governance &amp; Credentialing
              </span>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                {pendingCount} Pending CMO Review
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Provider Application &amp; Credential Queue
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Review degrees, authenticate state licensing councils, and grant bedside dispatch authority across the clinical network.
            </p>
          </div>

          <Link
            href="/admin/providers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] hover:text-[#064E3B] transition-colors self-start sm:self-center"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Active Clinician Directory</span>
          </Link>
        </div>

        {/* Action alert message */}
        {actionMessage && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{actionMessage}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs">✕</button>
          </div>
        )}

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#D9ECE7] bg-white p-4 shadow-2xs">
            <p className="text-xs text-slate-500 font-bold uppercase">Total Applications</p>
            <p className="text-2xl font-bold text-[#102820] mt-1">{applications.length}</p>
          </div>
          <div className="rounded-2xl border border-[#D9ECE7] bg-white p-4 shadow-2xs">
            <p className="text-xs text-amber-600 font-bold uppercase">Under CMO Review</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="rounded-2xl border border-[#D9ECE7] bg-white p-4 shadow-2xs">
            <p className="text-xs text-emerald-600 font-bold uppercase">Approved Clinicians</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{approvedCount}</p>
          </div>
          <div className="rounded-2xl border border-[#D9ECE7] bg-white p-4 shadow-2xs">
            <p className="text-xs text-slate-500 font-bold uppercase">Action Required</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {applications.filter((a) => a.status === 'ADDITIONAL_INFO_REQUIRED').length}
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2EBE7] pb-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'UNDER_REVIEW', 'SUBMITTED', 'APPROVED', 'ADDITIONAL_INFO_REQUIRED', 'REJECTED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedStatus === st
                    ? 'bg-[#065F46] text-white shadow-2xs'
                    : 'bg-white border border-[#E2EBE7] text-slate-600 hover:bg-[#F2F8F5]'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by clinician, license #, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#E2EBE7] bg-white pl-9 pr-3.5 py-1.5 text-xs text-[#102820] placeholder-slate-400 focus:border-[#065F46] focus:outline-hidden"
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApps.length === 0 ? (
            <div className="rounded-2xl border border-[#D9ECE7] bg-white p-12 text-center text-slate-500">
              <FileText className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="font-bold text-sm text-[#102820]">No applications match the selected criteria</p>
              <p className="text-xs mt-1">Try clearing your filters or search terms.</p>
            </div>
          ) : (
            filteredApps.map((app) => {
              const RoleIcon =
                app.role === 'DOCTOR'
                  ? Stethoscope
                  : app.role === 'NURSE'
                  ? Activity
                  : app.role === 'CARETAKER'
                  ? HeartHandshake
                  : app.role === 'PHYSIOTHERAPIST'
                  ? UserCheck
                  : Syringe;

              return (
                <div
                  key={app.id}
                  className="rounded-[22px] border border-[#D9ECE7] bg-white p-6 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    {/* Left: Applicant details */}
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#065F46] border border-[#D1FAE5]">
                          <RoleIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-heading text-lg font-bold text-[#102820]">{app.fullName}</h3>
                            <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[10px] font-bold text-[#065F46]">
                              {app.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {app.email} • {app.phone}
                          </p>
                        </div>
                      </div>

                      {/* Credentials Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                        <div className="rounded-xl bg-[#F7FBF9] border border-[#D9ECE7] p-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">License Number</p>
                          <p className="font-mono font-bold text-[#065F46] mt-0.5">{app.licenseNumber || 'N/A'}</p>
                          <p className="text-[10px] text-slate-500 truncate">{app.registrationCouncil || 'State Council'}</p>
                        </div>

                        <div className="rounded-xl bg-[#F7FBF9] border border-[#D9ECE7] p-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience &amp; Degree</p>
                          <p className="font-bold text-[#102820] mt-0.5">{app.experienceYears} Years Clinical</p>
                          <p className="text-[10px] text-slate-500 truncate">{app.qualification}</p>
                        </div>

                        <div className="rounded-xl bg-[#F7FBF9] border border-[#D9ECE7] p-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Service Coverage</p>
                          <p className="font-bold text-[#102820] mt-0.5">{app.city}, {app.state}</p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {app.serviceLocations?.join(', ') || 'Metro Area'}
                          </p>
                        </div>
                      </div>

                      {/* Uploaded Documents */}
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                          Submitted Credential Files ({app.documents.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {app.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D9ECE7] bg-[#F7FBF9] px-2.5 py-1 text-[11px] text-slate-700"
                            >
                              <FileText className="h-3 w-3 text-[#065F46]" />
                              <span className="font-medium">{doc.title}</span>
                              <span className="text-[10px] text-slate-400">({doc.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Admin notes if any */}
                      {app.adminNotes && (
                        <div className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs text-slate-600">
                          <strong className="text-slate-800">Governance Note:</strong> {app.adminNotes}
                        </div>
                      )}
                    </div>

                    {/* Right: Status badge & Review Actions */}
                    <div className="flex flex-col sm:items-end justify-between gap-4 lg:min-w-[200px]">
                      <div>
                        {app.status === 'APPROVED' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            APPROVED
                          </span>
                        ) : app.status === 'UNDER_REVIEW' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-bold text-amber-800">
                            <Clock className="h-3.5 w-3.5 text-amber-600" />
                            UNDER REVIEW
                          </span>
                        ) : app.status === 'ADDITIONAL_INFO_REQUIRED' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-300 px-3 py-1 text-xs font-bold text-blue-800">
                            <AlertTriangle className="h-3.5 w-3.5 text-blue-600" />
                            INFO REQUIRED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 border border-red-300 px-3 py-1 text-xs font-bold text-red-800">
                            <XCircle className="h-3.5 w-3.5 text-red-600" />
                            {app.status}
                          </span>
                        )}
                        <p className="text-[10px] text-slate-400 mt-1 sm:text-right">Applied: {app.appliedAt}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap lg:flex-col gap-2 w-full sm:w-auto">
                        {app.status !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleApprove(app)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Approve Clinician</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRequestInfo(app.id, app.fullName)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#D9ECE7] bg-white hover:bg-[#F2F8F5] px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          <span>Request Details</span>
                        </button>

                        {app.status !== 'REJECTED' && (
                          <button
                            type="button"
                            onClick={() => handleReject(app.id, app.fullName)}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors"
                          >
                            <span>Reject</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
