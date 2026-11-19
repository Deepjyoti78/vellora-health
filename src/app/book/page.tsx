'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '@/lib/db';
import { RequestSuccessState } from '@/components/booking/RequestSuccessState';
import { BackButton } from '@/components/common/BackButton';
import {
  PhoneCall,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  FlaskConical,
  Activity,
  HelpCircle,
  ArrowRight,
  Check,
} from 'lucide-react';

const CARE_TYPES = [
  { id: 'DOCTOR_VISIT', label: 'Doctor Consultations', icon: Stethoscope },
  { id: 'NURSING_CARE', label: 'Nursing & Care Support', icon: HeartPulse },
  { id: 'LAB_TESTS', label: 'Diagnostics & Lab Services', icon: FlaskConical },
  { id: 'CARETAKER', label: 'Rehab & Critical Care', icon: Activity },
  { id: 'NOT_SURE', label: 'Not Sure / General Enquiry', icon: HelpCircle },
];

function QuickEnquiryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // If redirected with ?service=... or ?doctor=..., route directly to specialized flows
  useEffect(() => {
    const serviceParam = searchParams.get('service');
    const doctorParam = searchParams.get('doctor');

    if (serviceParam) {
      router.replace(`/book/service/${serviceParam}`);
    } else if (doctorParam) {
      router.replace(`/book/doctor/${doctorParam}`);
    }
  }, [searchParams, router]);

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCareType, setSelectedCareType] = useState('DOCTOR_VISIT');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedRecord, setSubmittedRecord] = useState<{
    referenceNumber: string;
    patientName: string;
    phone: string;
    careLabel: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please enter a valid mobile number so we can reach you.');
      return;
    }
    if (!consent) {
      setErrorMsg('Please agree to receive a callback regarding your enquiry.');
      return;
    }

    setIsSubmitting(true);

    try {
      const careItem = CARE_TYPES.find((c) => c.id === selectedCareType);
      const careLabel = careItem?.label || 'General Healthcare Enquiry';

      // Save to Vellora repository with QUICK_ENQUIRY booking type
      const newBooking = db.createBooking({
        bookingType: 'QUICK_ENQUIRY',
        patientId: 'pat-guest',
        patientName: fullName.trim(),
        patientPhone: mobileNumber.trim(),
        patientEmail: email.trim() || undefined,
        beneficiaryName: fullName.trim(),
        beneficiaryRelation: 'Self',
        serviceId: 'srv-quick-enquiry',
        serviceName: `Quick Enquiry: ${careLabel}`,
        category:
          selectedCareType === 'NOT_SURE'
            ? 'DOCTOR_VISIT'
            : (selectedCareType as any),
        addressText: 'Callback Requested — Address to be confirmed by coordinator',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTimeSlot: 'Immediate Callback (15–30 mins)',
        status: 'REQUESTED',
        totalAmount: 0,
        paymentStatus: 'PENDING',
        notes: `Enquiry received from homepage quick modal for ${careLabel}.`,
      });

      setSubmittedRecord({
        referenceNumber: newBooking.bookingNumber,
        patientName: fullName.trim(),
        phone: mobileNumber.trim(),
        careLabel,
      });
    } catch (err) {
      setErrorMsg('Unable to submit enquiry right now. Please call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9F7] flex flex-col justify-between py-6 sm:py-10">
      <main className="flex-1 flex flex-col items-center justify-center py-6 sm:py-10 px-4">
        <div className="w-full max-w-lg mb-3">
          <BackButton href="/services" label="Back to Services" />
        </div>
        {submittedRecord ? (
          <RequestSuccessState
            type="QUICK_ENQUIRY"
            referenceNumber={submittedRecord.referenceNumber}
            patientName={submittedRecord.patientName}
            phone={submittedRecord.phone}
            details={[
              { label: 'Care Area', value: submittedRecord.careLabel },
              { label: 'Estimated Contact Time', value: '15 – 30 Minutes' },
              { label: 'Fee / Upfront Cost', value: 'Free Consultation Call' },
            ]}
          />
        ) : (
          <div className="w-full max-w-lg overflow-hidden rounded-[26px] border border-[#E2EBE7] bg-white p-6 sm:p-9 shadow-xs animate-card-slide-right">
            {/* Header Icon & Title */}
            <div className="text-center">
              <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs mb-4">
                <PhoneCall className="h-6 w-6 stroke-[2.2]" />
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102820]">
                How can we help you?
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
                Tell us what care you need. Our team will get in touch.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 pl-10 pr-4 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:bg-white focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 (555) 234-5678 or 10-digit mobile"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 pl-10 pr-4 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:bg-white focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              {/* Email Address (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Email Address
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">Optional</span>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="e.g. eleanor.vance@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 pl-10 pr-4 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:bg-white focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              {/* Type of Care */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  What kind of care do you need?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CARE_TYPES.map((type) => {
                    const IconComponent = type.icon;
                    const isSelected = selectedCareType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedCareType(type.id)}
                        className={`flex items-center gap-2.5 rounded-xl p-2.5 text-left text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-[#ECFDF5] border-[#065F46] text-[#065F46] shadow-2xs'
                            : 'bg-white border-[#E2EBE7] text-slate-600 hover:bg-[#F2F8F5]'
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                            isSelected
                              ? 'bg-[#065F46] text-white'
                              : 'bg-[#F2F8F5] text-slate-500'
                          }`}
                        >
                          <IconComponent className="h-3.5 w-3.5" />
                        </div>
                        <span className="truncate">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#CBDCD5] text-[#064E3B] focus:ring-[#064E3B]"
                  />
                  <span className="text-[11px] sm:text-xs text-slate-600 leading-relaxed select-none">
                    I agree to receive a clinical callback or message from Vellora Health regarding this care enquiry.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-[#064E3B] py-3 px-6 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Request a Callback'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Direct Phone Assistance Footer */}
            <div className="mt-6 text-center border-t border-[#F2F8F5] pt-4">
              <p className="text-[11px] text-slate-400">
                Need urgent care advice right now?{' '}
                <a
                  href="tel:+15552345678"
                  className="font-bold text-[#065F46] hover:underline"
                >
                  Call +1 (555) 234-5678
                </a>
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="py-6 text-center text-[11px] text-slate-400 border-t border-[#E2EBE7] bg-white">
        Vellora Health Care Platform • HIPAA Compliant &amp; 256-Bit Encrypted Dispatch
      </footer>
    </div>
  );
}

export default function QuickEnquiryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <QuickEnquiryContent />
    </Suspense>
  );
}
