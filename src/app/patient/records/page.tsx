'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Icon } from '@/components/common/Icon';

export default function PatientRecordsPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'PRESCRIPTIONS' | 'VITALS' | 'LABS'>('PRESCRIPTIONS');

  const userId = currentUser?.id || '';
  const prescriptions = db.getPrescriptionsByPatient(userId);
  const vitals = db.getVitalsByPatient(userId);
  const labReports = db.getLabReportsByPatient(userId);

  return (
    <PatientLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Health Dossier
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Medical Records & Diagnostics
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Review verified prescriptions, biomarker lab test panels, and continuous vital logs.
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs sm:self-center"
          >
            <Icon name="file-text" className="h-4 w-4" />
            Print Full Medical Dossier
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('PRESCRIPTIONS')}
            className={`border-b-2 px-5 py-3 text-xs font-bold transition-colors ${
              activeTab === 'PRESCRIPTIONS'
                ? 'border-[#116b70] text-[#116b70]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Prescriptions ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('VITALS')}
            className={`border-b-2 px-5 py-3 text-xs font-bold transition-colors ${
              activeTab === 'VITALS'
                ? 'border-[#116b70] text-[#116b70]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Vital Sign Logs ({vitals.length})
          </button>
          <button
            onClick={() => setActiveTab('LABS')}
            className={`border-b-2 px-5 py-3 text-xs font-bold transition-colors ${
              activeTab === 'LABS'
                ? 'border-[#116b70] text-[#116b70]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Lab Diagnostic Reports ({labReports.length})
          </button>
        </div>

        {/* TAB 1: PRESCRIPTIONS */}
        {activeTab === 'PRESCRIPTIONS' && (
          <div className="mt-6 space-y-6">
            {prescriptions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
                No active prescriptions recorded yet.
              </div>
            ) : (
              prescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs"
                >
                  <div className="flex flex-col justify-between gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
                          {rx.id}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          Issued by {rx.doctorName}
                        </span>
                      </div>
                      <h3 className="mt-1 text-base font-bold text-gray-900">
                        Diagnosis: {rx.diagnosis}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      Issued on {new Date(rx.issuedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Medications list */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                      Prescribed Medications
                    </h4>
                    <div className="mt-2 divide-y divide-gray-100">
                      {rx.medications.map((med, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center"
                        >
                          <div>
                            <span className="text-sm font-bold text-gray-900">{med.name}</span>
                            <span className="ml-2 text-xs font-medium text-[#116b70]">
                              {med.dosage}
                            </span>
                            <p className="mt-0.5 text-xs text-gray-500">
                              Schedule: {med.frequency} • Duration: {med.duration}
                            </p>
                          </div>
                          <span className="rounded-lg bg-gray-50 px-3 py-1 text-xs text-gray-600 font-medium">
                            {med.instructions}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctor advice */}
                  {rx.advice && (
                    <div className="mt-4 rounded-xl bg-blue-50/60 p-3.5 text-xs text-blue-900">
                      <strong>Physician Advice:</strong> {rx.advice}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: VITALS LOGS */}
        {activeTab === 'VITALS' && (
          <div className="mt-6 space-y-6">
            {vitals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
                No vitals recorded yet.
              </div>
            ) : (
              vitals.map((v) => (
                <div
                  key={v.id}
                  className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs"
                >
                  <div className="flex flex-col justify-between gap-2 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                    <div>
                      <span className="text-xs font-bold text-gray-900">
                        Recorded by {v.recordedBy}
                      </span>
                      <p className="text-[11px] text-gray-500">
                        Patient: {v.patientName} • {new Date(v.recordedAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                      Verified Clinical In-Home Check
                    </span>
                  </div>

                  {/* Grid of Biomarkers */}
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    <div className="rounded-2xl bg-gray-50 p-3 text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-500">Blood Pressure</span>
                      <div className="mt-1 text-lg font-black text-gray-900">{v.bloodPressure}</div>
                      <span className="text-[10px] text-emerald-700 font-semibold">mmHg (Normal)</span>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3 text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-500">Heart Rate</span>
                      <div className="mt-1 text-lg font-black text-gray-900">{v.heartRate}</div>
                      <span className="text-[10px] text-emerald-700 font-semibold">bpm</span>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3 text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-500">Oxygen (SpO2)</span>
                      <div className="mt-1 text-lg font-black text-gray-900">{v.spo2}%</div>
                      <span className="text-[10px] text-emerald-700 font-semibold">Optimal</span>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3 text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-500">Temperature</span>
                      <div className="mt-1 text-lg font-black text-gray-900">{v.temperature}°F</div>
                      <span className="text-[10px] text-emerald-700 font-semibold">Afebrile</span>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3 text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-500">Blood Glucose</span>
                      <div className="mt-1 text-lg font-black text-gray-900">{v.bloodGlucose}</div>
                      <span className="text-[10px] text-amber-700 font-semibold">mg/dL (Fasting)</span>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3 text-center">
                      <span className="text-[10px] font-bold uppercase text-gray-500">Respiration</span>
                      <div className="mt-1 text-lg font-black text-gray-900">{v.respiratoryRate}</div>
                      <span className="text-[10px] text-emerald-700 font-semibold">breaths/min</span>
                    </div>
                  </div>

                  {v.clinicalNotes && (
                    <div className="mt-4 rounded-xl bg-gray-50 p-3.5 text-xs text-gray-700">
                      <strong>Nurse Observation Notes:</strong> {v.clinicalNotes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: LAB REPORTS */}
        {activeTab === 'LABS' && (
          <div className="mt-6 space-y-4">
            {labReports.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-xs text-gray-500">
                No diagnostic reports available.
              </div>
            ) : (
              labReports.map((lab) => (
                <div
                  key={lab.id}
                  className="flex flex-col justify-between gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-500">{lab.id}</span>
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">
                        {lab.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{lab.testName}</h3>
                    <p className="text-xs text-gray-500">
                      Specimen: {lab.specimenType} • Barcode: <span className="font-mono">{lab.barcode}</span>
                    </p>
                    <p className="text-xs text-emerald-700 font-medium">
                      Summary: {lab.resultSummary}
                    </p>
                  </div>

                  <Link
                    href={`/patient/records/${lab.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#116b70] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#0d5559] transition-colors self-start sm:self-center"
                  >
                    View Official Lab Report
                    <Icon name="arrow-right" className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
