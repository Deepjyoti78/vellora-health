'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, ProviderApplicationRecord } from '@/lib/db';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Phone,
  Sparkles,
} from 'lucide-react';

export default function ProviderApplicationStatusPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [application, setApplication] = useState<ProviderApplicationRecord | null>(null);

  useEffect(() => {
    // Find latest application for user or first application in DB
    const apps = db.getProviderApplications();
    const userApp = currentUser?.email
      ? apps.find((a) => a.email.toLowerCase() === currentUser.email.toLowerCase())
      : null;
    setApplication(userApp || apps[0] || null);
  }, [currentUser]);

  const handleApproveForTest = () => {
    if (application) {
      db.updateProviderApplication(application.id, {
        status: 'APPROVED',
        adminNotes: 'Auto-approved for instant interactive demonstration.',
      });
      setApplication({
        ...application,
        status: 'APPROVED',
        adminNotes: 'Auto-approved for instant interactive demonstration.',
      });
    }
  };

  const status = application?.status || 'UNDER_REVIEW';

  return (
    <div className="min-h-screen bg-[#F7FBF9] text-[#102723] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Top Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3 group" aria-label="Velora Healthcare Home">
            <img
              src="/assets/logo-dark.png"
              alt="Velora Healthcare"
              className="h-9 w-auto mx-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-0.5 text-xs font-bold text-[#065F46]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
            <span>CREDENTIAL VERIFICATION STATUS</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-[#102723]">
            Application Tracking Dossier
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Reference ID: <span className="font-mono font-bold text-[#065F46]">{application?.id || 'APP-2026-0891'}</span>
          </p>
        </div>

        {/* Status Hero Card */}
        <div className="rounded-[26px] border border-[#D9ECE7] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(6,95,70,0.06)] mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F2F8F5]">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applicant</p>
              <h2 className="text-xl font-heading font-bold text-[#102723]">{application?.fullName || 'Dr. Maya Patel'}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {application?.role || 'DOCTOR'} • {application?.licenseNumber || 'MED-CA-928104'}
              </p>
            </div>

            <div>
              {status === 'APPROVED' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-300 px-3.5 py-1 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  VERIFIED &amp; APPROVED
                </span>
              ) : status === 'UNDER_REVIEW' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3.5 py-1 text-xs font-bold text-amber-800">
                  <Clock className="h-4 w-4 text-amber-600" />
                  UNDER CMO REVIEW
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 border border-blue-300 px-3.5 py-1 text-xs font-bold text-blue-800">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  SUBMITTED
                </span>
              )}
            </div>
          </div>

          {/* Verification Timeline */}
          <div className="pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
              Verification Milestones
            </h3>
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102723]">Application &amp; Credentials Received</h4>
                  <p className="text-[11px] text-slate-500">Digital submission registered and initial documentation validated.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102723]">Medical Council Registry Query</h4>
                  <p className="text-[11px] text-slate-500">Primary source license verified against state medical registry.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {status === 'APPROVED' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102723]">Chief Medical Officer (CMO) Peer Review</h4>
                  <p className="text-[11px] text-slate-500">
                    {status === 'APPROVED'
                      ? 'Dossier approved by Dr. Maya Patel, Chief Medical Officer.'
                      : 'Clinical board currently reviewing case history & experience records.'}
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {status === 'APPROVED' ? <CheckCircle2 className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#102723]">Dispatch &amp; Bedside PIN Activation</h4>
                  <p className="text-[11px] text-slate-500">
                    {status === 'APPROVED'
                      ? 'Account active. Eligible for patient home visit dispatch.'
                      : 'Pending peer review signoff.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Callouts */}
          <div className="mt-8 pt-6 border-t border-[#F2F8F5] flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/provider/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors"
            >
              <span>Enter Provider Workstation</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {status !== 'APPROVED' && (
              <button
                type="button"
                onClick={handleApproveForTest}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 text-xs font-bold text-emerald-800 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Simulate Admin Approval</span>
              </button>
            )}
          </div>
        </div>

        {/* Support & Credentialing Desk */}
        <div className="rounded-[22px] border border-[#D9ECE7] bg-[#F2F8F5] p-5 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-[#102723]">Questions regarding your application?</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Our medical credentialing desk is active Monday through Saturday.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="flex items-center gap-1.5 font-bold text-[#065F46]">
              <Phone className="h-3.5 w-3.5" /> +1 (800) 555-CARE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
