'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Icon } from '@/components/common/Icon';

export default function LabReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const report = db.getLabReportById(id);

  if (!report) {
    return (
      <PatientLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <Icon name="flask" className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Report Not Found</h2>
          <p className="mt-2 text-xs text-gray-500">
            The diagnostic lab report #{id} could not be located.
          </p>
          <Link
            href="/patient/records"
            className="mt-6 inline-block rounded-xl bg-[#116b70] px-5 py-2.5 text-xs font-bold text-white"
          >
            Back to Records
          </Link>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Navigation & Action Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href="/patient/records"
            className="flex items-center gap-1.5 text-xs font-bold text-[#116b70] hover:underline"
          >
            <Icon name="arrow-left" className="h-3.5 w-3.5" />
            Back to Medical Records
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl bg-[#116b70] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0d5559]"
            >
              <Icon name="file-text" className="h-3.5 w-3.5" />
              Print / Save PDF Report
            </button>
          </div>
        </div>

        {/* Official Lab Report Document Paper */}
        <div className="rounded-3xl border border-gray-300 bg-white p-8 shadow-sm print:border-none print:shadow-none">
          {/* Header */}
          <div className="flex flex-col justify-between border-b-2 border-gray-900 pb-6 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#116b70] text-white font-black text-sm">
                  +
                </span>
                <span className="text-xl font-black tracking-tight text-gray-900">
                  VELLORA HEALTH
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Central Clinical Diagnostics & Pathology Laboratory
              </p>
              <p className="text-[11px] text-gray-400">
                CAP Accredited • CLIA Certified #05D2194821
              </p>
            </div>
            <div className="mt-4 text-right sm:mt-0">
              <span className="rounded-md bg-purple-100 px-3 py-1 font-mono text-xs font-bold text-purple-900">
                {report.id}
              </span>
              <p className="mt-1 text-xs text-gray-500">
                Sample Barcode: <strong className="font-mono text-gray-900">{report.barcode}</strong>
              </p>
            </div>
          </div>

          {/* Patient Demographics Grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 text-xs sm:grid-cols-4">
            <div>
              <span className="text-gray-500">Patient Name:</span>
              <p className="font-bold text-gray-900">{report.patientName}</p>
            </div>
            <div>
              <span className="text-gray-500">Specimen Type:</span>
              <p className="font-bold text-gray-900">{report.specimenType}</p>
            </div>
            <div>
              <span className="text-gray-500">Collection Time:</span>
              <p className="font-bold text-gray-900">
                {new Date(report.collectedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Report Released:</span>
              <p className="font-bold text-gray-900">
                {new Date(report.releasedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Test Title */}
          <div className="mt-8">
            <h2 className="text-lg font-black text-gray-900">{report.testName}</h2>
            <p className="text-xs text-gray-500">Category: {report.category}</p>
          </div>

          {/* Biomarkers Table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-100 font-bold text-gray-700">
                <tr>
                  <th className="px-4 py-3">Investigation Parameter</th>
                  <th className="px-4 py-3">Observed Value</th>
                  <th className="px-4 py-3">Reference Interval</th>
                  <th className="px-4 py-3 text-right">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {report.parameters.map((param, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {param.parameter}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">
                      {param.value}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{param.normalRange}</td>
                    <td className="px-4 py-3 text-right">
                      {param.status === 'NORMAL' && (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                          NORMAL
                        </span>
                      )}
                      {param.status === 'HIGH' && (
                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-800">
                          ELEVATED
                        </span>
                      )}
                      {param.status === 'LOW' && (
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                          LOW
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4 text-xs">
            <span className="font-bold text-blue-950 block">Laboratory Interpretation Summary:</span>
            <p className="mt-1 text-blue-900">{report.resultSummary}</p>
          </div>

          {/* Signoff */}
          <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6 text-xs text-gray-500">
            <div>
              <p className="font-bold text-gray-900">Dr. Elena Rostova, MD, FCAP</p>
              <p>Consultant Pathologist & Laboratory Medical Director</p>
            </div>
            <div className="text-right">
              <span className="rounded bg-emerald-50 px-2 py-1 font-mono text-[10px] font-bold text-emerald-800">
                AUTHENTICATED ELECTRONIC SIGNATURE
              </span>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
