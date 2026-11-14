'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Clock, ArrowRight, Home, PhoneCall } from 'lucide-react';

interface RequestSuccessStateProps {
  type: 'QUICK_ENQUIRY' | 'SERVICE_REQUEST' | 'DOCTOR_CONSULTATION';
  referenceNumber: string;
  title?: string;
  subtitle?: string;
  patientName: string;
  phone: string;
  details?: { label: string; value: string }[];
  onReset?: () => void;
  primaryActionHref?: string;
  primaryActionLabel?: string;
}

export const RequestSuccessState: React.FC<RequestSuccessStateProps> = ({
  type,
  referenceNumber,
  title,
  subtitle,
  patientName,
  phone,
  details = [],
  primaryActionHref,
  primaryActionLabel,
}) => {
  const isEnquiry = type === 'QUICK_ENQUIRY';
  const isDoctor = type === 'DOCTOR_CONSULTATION';

  const defaultTitle = isEnquiry
    ? 'Callback Request Received'
    : isDoctor
    ? 'Doctor Consultation Requested'
    : 'Home Care Service Requested';

  const defaultSubtitle = isEnquiry
    ? 'Thank you for contacting Vellora Health. Our clinical care coordination team has received your enquiry.'
    : isDoctor
    ? 'Your doctor consultation request has been received. Our clinical coordinator will verify doctor availability and contact you shortly.'
    : 'Your care request has been logged in our dispatch stream and is awaiting clinician assignment.';

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="overflow-hidden rounded-[26px] border border-[#E2EBE7] bg-white p-6 sm:p-10 shadow-xs text-center">
        {/* Mint Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs mb-5">
          <CheckCircle2 className="h-8 w-8 stroke-[2.2]" />
        </div>

        {/* Reference Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F2F8F5] border border-[#E2EBE7] px-3.5 py-1 text-xs font-bold text-slate-700 mb-3">
          <span className="text-slate-400 font-medium">Reference:</span>
          <span className="text-[#065F46] font-mono">{referenceNumber}</span>
        </div>

        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#102820]">
          {title || defaultTitle}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          {subtitle || defaultSubtitle}
        </p>

        {/* Next Steps Box */}
        <div className="mt-6 rounded-2xl bg-[#F5F9F7] border border-[#E2EBE7] p-4 sm:p-5 text-left text-xs space-y-3">
          <p className="font-extrabold uppercase tracking-wider text-[11px] text-[#065F46] flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Next Steps in Your Care Process</span>
          </p>

          <div className="space-y-2 text-slate-600">
            {isEnquiry ? (
              <>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-[#065F46]">1.</span>
                  <span>Our senior care coordinator will call you back on <strong className="text-[#102820]">{phone}</strong> within 15–30 minutes.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-[#065F46]">2.</span>
                  <span>We will understand your specific medical or home care requirements and recommend the ideal clinician.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-[#065F46]">3.</span>
                  <span>No upfront payment or billing is processed until the visit is scheduled.</span>
                </p>
              </>
            ) : (
              <>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-[#065F46]">1.</span>
                  <span>Our medical dispatch board is currently verifying nearby clinician availability for <strong className="text-[#102820]">{patientName}</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-[#065F46]">2.</span>
                  <span>You will receive an SMS and WhatsApp confirmation with the clinician profile and real-time arrival ETA.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-[#065F46]">3.</span>
                  <span>Your secure 4-digit verification PIN will be transmitted prior to the physical examination.</span>
                </p>
              </>
            )}
          </div>
        </div>

        {/* Summary Details if provided */}
        {details.length > 0 && (
          <div className="mt-5 divide-y divide-[#F2F8F5] rounded-xl border border-[#E2EBE7] bg-white p-3.5 text-xs text-left">
            {details.map((d, i) => (
              <div key={i} className="flex justify-between py-2 text-slate-600">
                <span className="font-medium text-slate-400">{d.label}</span>
                <span className="font-bold text-[#102820]">{d.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#CBDCD5] bg-white px-5 py-2.5 text-xs font-bold text-[#102820] hover:bg-[#F2F8F5] transition-colors shadow-2xs"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return to Home</span>
          </Link>

          <Link
            href={primaryActionHref || (isDoctor ? '/doctors' : '/services')}
            className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-xs"
          >
            <span>{primaryActionLabel || (isDoctor ? 'View More Specialists' : 'Explore All Services')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
