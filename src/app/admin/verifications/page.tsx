'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db, ProviderApplicationRecord } from '@/lib/db';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  Award,
} from 'lucide-react';

export default function AdminVerificationsPage() {
  const [applications, setApplications] = useState<ProviderApplicationRecord[]>([]);

  const loadData = () => {
    setApplications([...db.getProviderApplications()]);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAction = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    db.updateProviderApplication(id, {
      status: newStatus,
      reviewedBy: 'Dr. Maya Patel (CMO)',
      reviewedAt: new Date().toISOString(),
    });
    loadData();
  };

  const pending = applications.filter((a) => a.status === 'UNDER_REVIEW' || a.status === 'SUBMITTED');

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46]">
                CMO Credentialing Review
              </span>
              <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                {pending.length} Applications Pending
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Provider Document Verifications
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Primary source verification queue for state medical licenses, nursing councils, and background checks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/providers/applications"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#065F46] px-4 py-2 text-xs font-bold text-white hover:bg-[#054d39]"
            >
              <span>Full Applications Queue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/admin/providers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] hover:text-[#064E3B] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>

        {/* Applicant Review Cards */}
        <div className="space-y-5">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-[#E2EBE7] bg-white p-6 shadow-xs"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-[#F2F8F5] pb-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-xs font-bold text-[#065F46]">
                      {app.role}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      License: {app.licenseNumber || 'PENDING'} ({app.registrationCouncil || app.state})
                    </span>
                  </div>
                  <h3 className="mt-1 font-heading text-lg font-bold text-[#102820]">
                    {app.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {app.qualification} • {app.experienceYears} Years Clinical Experience • {app.serviceLocations?.join(', ')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      app.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Credential Verification Documents ({app.documents.length})
                </h4>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                  {app.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-xl border border-[#E2EBE7] bg-[#F7FBF9] p-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="h-4 w-4 text-[#065F46] shrink-0" />
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-[#102820]">{doc.title}</p>
                          <p className="text-[10px] text-slate-400">{doc.size}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#F2F8F5] pt-4">
                <div className="text-xs text-slate-500">
                  Applied: {app.appliedAt}
                </div>

                <div className="flex items-center gap-2">
                  {app.status !== 'APPROVED' && (
                    <button
                      type="button"
                      onClick={() => handleAction(app.id, 'APPROVED')}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve &amp; Activate</span>
                    </button>
                  )}

                  {app.status !== 'REJECTED' && (
                    <button
                      type="button"
                      onClick={() => handleAction(app.id, 'REJECTED')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 px-3.5 py-2 text-xs font-semibold text-red-700 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
