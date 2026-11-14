'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/common/Icon';

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHLEBOTOMIST'>('DOCTOR');
  const [fullName, setFullName] = useState('Dr. Marcus Lee');
  const [licenseNumber, setLicenseNumber] = useState('MD-CA-928104');
  const [state, setState] = useState('California');
  const [experience, setExperience] = useState('12');
  const [specialty, setSpecialty] = useState('Internal Medicine & Geriatrics');
  const [uploadedDoc, setUploadedDoc] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#116b70] text-white font-black text-sm">
              +
            </span>
            <span className="text-lg font-black tracking-tight text-gray-900">
              VELLORA HEALTH
            </span>
          </Link>
          <span className="mt-2 block text-xs font-bold uppercase tracking-wider text-[#116b70]">
            Clinician Credentialing
          </span>
          <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
            Join the Vellora Medical Network
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Deliver premium care at home with complete schedule flexibility and competitive payouts.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Select Your Clinical Designation
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(['DOCTOR', 'NURSE', 'CARETAKER', 'PHLEBOTOMIST'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-xl border p-3 text-center text-xs font-bold transition-all ${
                        role === r
                          ? 'border-[#116b70] bg-[#116b70]/5 text-[#116b70] ring-2 ring-[#116b70]'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {r.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal & License Info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    State License / NPI Number
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">State of Licensure</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Clinical Specialty</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Years of Practice</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                  />
                </div>
              </div>

              {/* Document Upload Simulation */}
              <div>
                <label className="text-xs font-semibold text-gray-700">
                  Upload Primary Credentials & Insurance
                </label>
                <div className="mt-2 rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#116b70] transition-colors">
                  <Icon name="file-text" className="mx-auto h-8 w-8 text-[#116b70]" />
                  <p className="mt-2 text-xs font-bold text-gray-900">
                    Medical_License_CA_928104.pdf (2.4 MB)
                  </p>
                  <p className="mt-1 text-[11px] text-emerald-700 font-semibold">
                    Document scanned & encrypted successfully
                  </p>
                  <button
                    type="button"
                    className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Replace Document
                  </button>
                </div>
              </div>

              {/* Background check consent */}
              <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="mt-0.5 h-4 w-4 rounded text-[#116b70] focus:ring-[#116b70]"
                />
                <div className="text-xs text-gray-600">
                  <strong className="text-gray-900">Criminal Background & Sanction Screening:</strong>{' '}
                  I authorize Vellora Health to run primary source verification with state licensing boards and the OIG exclusion list.
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <Link
                  href="/provider/login"
                  className="text-xs font-bold text-gray-500 hover:text-gray-900"
                >
                  ← Back to Login
                </Link>
                <button
                  type="submit"
                  className="rounded-xl bg-[#116b70] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
                >
                  Submit Application for Peer Review
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon name="check" className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-black text-gray-900">Application Submitted!</h2>
              <p className="mt-2 text-xs text-gray-600 max-w-md mx-auto">
                Thank you, <strong className="text-gray-900">{fullName}</strong>. Your credentialing dossier has been queued for Chief Medical Officer (CMO) review.
              </p>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Designation:</span>
                  <span className="font-bold text-gray-900">{role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">License #:</span>
                  <span className="font-mono font-bold text-gray-900">{licenseNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification Status:</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                    UNDER REVIEW
                  </span>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/provider/dashboard')}
                  className="rounded-xl bg-[#116b70] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559]"
                >
                  Enter Provider Portal (Test Mode)
                </button>
                <Link
                  href="/provider/login"
                  className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
