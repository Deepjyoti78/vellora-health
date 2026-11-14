'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Icon } from '@/components/common/Icon';

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
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              CMO Credentialing Review
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Provider Document Verifications
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Primary source verification queue for state medical licenses, DEA registrations, and malpractice insurance.
            </p>
          </div>
          <Link
            href="/admin/providers"
            className="text-xs font-bold text-[#116b70] hover:underline"
          >
            ← Back to Provider Directory
          </Link>
        </div>

        {/* Applicant Review Cards */}
        <div className="space-y-6">
          {applicants.map((app) => (
            <div
              key={app.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs"
            >
              <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                      {app.role}
                    </span>
                    <span className="font-mono text-xs font-bold text-gray-500">
                      License: {app.licenseNumber} ({app.state})
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-gray-900">{app.name}</h3>
                  <p className="text-xs text-gray-500">
                    Specialty: {app.specialty} • {app.experienceYears} Years Clinical Practice
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Primary Source Credentials Dossier
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {app.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs"
                    >
                      <div className="truncate mr-2">
                        <span className="font-bold text-gray-900 block truncate">
                          {doc.title}
                        </span>
                        <span className="text-[10px] text-gray-500">{doc.size}</span>
                      </div>
                      <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approval Buttons */}
              {app.status === 'PENDING_REVIEW' && (
                <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => handleAction(app.id, 'REJECTED')}
                    className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(app.id, 'APPROVED')}
                    className="rounded-xl bg-[#116b70] px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-[#0d5559]"
                  >
                    Approve & Authorize for Dispatch
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
