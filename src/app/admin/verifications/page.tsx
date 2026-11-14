'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import {
  ShieldCheck,
  ShieldAlert,
  FileText,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Download,
  ExternalLink,
  Award,
} from 'lucide-react';

interface VerificationApplicant {
  id: string;
  name: string;
  role: 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHLEBOTOMIST';
  licenseNumber: string;
  state: string;
  specialty: string;
  experienceYears: number;
  documents: { title: string; size: string; status: 'VALID' | 'PENDING' }[];
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
}

export default function AdminVerificationsPage() {
  const [applicants, setApplicants] = useState<VerificationApplicant[]>([
    {
      id: 'app-1',
      name: 'Dr. Michael Chen',
      role: 'DOCTOR',
      licenseNumber: 'MD-CA-981240',
      state: 'California',
      specialty: 'Family Medicine & Preventive Care',
      experienceYears: 15,
      documents: [
        { title: 'California_State_Medical_Board_License.pdf', size: '2.4 MB', status: 'VALID' },
        { title: 'Medical_Malpractice_Umbrella_COI.pdf', size: '1.8 MB', status: 'VALID' },
        { title: 'DEA_Controlled_Substance_Reg.pdf', size: '1.1 MB', status: 'VALID' },
      ],
      status: 'PENDING_REVIEW',
      appliedDate: 'Nov 13, 2026',
    },
    {
      id: 'app-2',
      name: 'Jessica Vance, RN',
      role: 'NURSE',
      licenseNumber: 'RN-CA-442190',
      state: 'California',
      specialty: 'Pediatric & Infusion Home Care',
      experienceYears: 7,
      documents: [
        { title: 'RN_Board_of_Registered_Nursing_Cert.pdf', size: '1.9 MB', status: 'VALID' },
        { title: 'AHA_BLS_ACLS_Certification.pdf', size: '940 KB', status: 'VALID' },
      ],
      status: 'PENDING_REVIEW',
      appliedDate: 'Nov 12, 2026',
    },
  ]);

  const handleAction = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setApplicants(
      applicants.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

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
                2 Applications Pending
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#102820] sm:text-3xl mt-0.5">
              Provider Document Verifications
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Primary source verification queue for state medical licenses, DEA registrations, and malpractice insurance.
            </p>
          </div>
          <Link
            href="/admin/providers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] hover:text-[#064E3B] transition-colors self-start sm:self-center"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Provider Directory</span>
          </Link>
        </div>

        {/* Applicant Review Cards */}
        <div className="space-y-5">
          {applicants.map((app) => (
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
                      License: {app.licenseNumber} ({app.state})
                    </span>
                  </div>
                  <h3 className="mt-1 font-heading text-lg font-bold text-[#102820]">
                    {app.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Specialty: {app.specialty} • {app.experienceYears} Years Clinical Practice • Applied on {app.appliedDate}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                      app.status === 'APPROVED'
                        ? 'bg-[#ECFDF5] text-[#065F46]'
                        : app.status === 'REJECTED'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {app.status === 'APPROVED' && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {app.status === 'REJECTED' && <XCircle className="h-3.5 w-3.5" />}
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Uploaded Documents List */}
              <div className="mt-5">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Primary Source Credentials Dossier
                </h4>
                <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {app.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] p-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <FileText className="h-4 w-4 shrink-0 text-[#065F46]" />
                        <div className="truncate">
                          <span className="font-semibold text-[#102820] block truncate">
                            {doc.title}
                          </span>
                          <span className="text-[10px] text-slate-400">{doc.size}</span>
                        </div>
                      </div>
                      <span className="rounded-md bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Buttons */}
              {app.status === 'PENDING_REVIEW' && (
                <div className="mt-6 flex justify-end gap-3 border-t border-[#F2F8F5] pt-4">
                  <button
                    type="button"
                    onClick={() => handleAction(app.id, 'REJECTED')}
                    className="rounded-xl border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(app.id, 'APPROVED')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#065F46] transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Approve & Authorize for Dispatch</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
