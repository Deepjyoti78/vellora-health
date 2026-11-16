'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, ArrowRight, Home } from 'lucide-react';

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
  // Ensure the viewport automatically scrolls smoothly to top when the success card is mounted
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
    <div className="w-full max-w-2xl mx-auto px-0 sm:px-4 py-2 sm:py-8">
      {/* Inline styles for guaranteed high-priority smooth animations */}
      <style>{`
        @keyframes successCardSpring {
          0% {
            opacity: 0;
            transform: translateY(44px) scale(0.95);
          }
          60% {
            opacity: 1;
            transform: translateY(-5px) scale(1.008);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes successIconSpring {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-22deg);
          }
          60% {
            opacity: 1;
            transform: scale(1.2) rotate(4deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes successItemSlideUp {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Animated Success Card Container */}
      <div
        className="overflow-hidden rounded-2xl sm:rounded-[26px] border border-[#E2EBE7] bg-white p-4 sm:p-9 shadow-[0_18px_45px_rgba(6,78,59,0.09)] text-center relative"
        style={{
          animation: 'successCardSpring 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Soft background ambient glow */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#ECFDF5] opacity-60 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#E8F8F2] opacity-50 blur-3xl"
          aria-hidden="true"
        />

        {/* Mint Success Icon with Pop & Bounce Animation */}
        <div
          className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0] text-[#065F46] shadow-sm mb-5"
          style={{
            animation: 'successIconSpring 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.15s both',
          }}
        >
          <CheckCircle2 className="h-8 w-8 stroke-[2.4]" />
        </div>

        {/* Reference Pill with Staggered Fade Up */}
        <div
          className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-[#F2F8F5] border border-[#E2EBE7] px-3.5 py-1 text-xs font-bold text-slate-700 mb-3"
          style={{
            animation: 'successItemSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both',
          }}
        >
          <span className="text-slate-400 font-medium">Reference:</span>
          <span className="text-[#065F46] font-mono">{referenceNumber}</span>
        </div>

        {/* Title & Subtitle with Staggered Entrance */}
        <div
          className="relative z-10"
          style={{
            animation: 'successItemSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.33s both',
          }}
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#102820] tracking-tight">
            {title || defaultTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {subtitle || defaultSubtitle}
          </p>
        </div>

        {/* Next Steps Box with Staggered Entrance */}
        <div
          className="relative z-10 mt-6 rounded-2xl bg-[#F5F9F7] border border-[#E2EBE7] p-4 sm:p-5 text-left text-xs space-y-3 shadow-2xs"
          style={{
            animation: 'successItemSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.42s both',
          }}
        >
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
          <div
            className="relative z-10 mt-5 divide-y divide-[#F0F5F2] rounded-2xl border border-[#E2EBE7] bg-[#FAFCFB] p-3.5 sm:p-4 text-xs text-left shadow-2xs"
            style={{
              animation: 'successItemSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.50s both',
            }}
          >
            {details.map((d, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 gap-1 sm:gap-4 text-slate-600">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 shrink-0">{d.label}</span>
                <span className="font-bold text-[#102820] sm:text-right break-words">{d.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons with Staggered Entrance */}
        <div
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{
            animation: 'successItemSlideUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.58s both',
          }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#CBDCD5] bg-white px-5 py-2.5 text-xs font-bold text-[#102820] hover:bg-[#F2F8F5] transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Return to Home</span>
          </Link>

          <Link
            href={primaryActionHref || (isDoctor ? '/doctors' : '/services')}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#064E3B] to-[#065F46] px-5 py-2.5 text-xs font-bold text-white hover:from-[#065F46] hover:to-[#047857] transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
          >
            <span>{primaryActionLabel || (isDoctor ? 'View More Specialists' : 'Explore All Services')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
