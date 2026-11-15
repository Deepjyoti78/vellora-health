'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import {
  X,
  Stethoscope,
  HeartPulse,
  FlaskConical,
  Activity,
  HelpCircle,
  Check,
  CheckCircle2,
  Phone,
  User,
  Mail,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

const CARE_TYPES = [
  { id: 'DOCTOR_VISIT', label: 'Doctor Consultations', icon: Stethoscope },
  { id: 'NURSING_CARE', label: 'Nursing & Care Support', icon: HeartPulse },
  { id: 'LAB_TESTS', label: 'Diagnostics & Lab Services', icon: FlaskConical },
  { id: 'CARETAKER', label: 'Rehab & Critical Care', icon: Activity },
  { id: 'NOT_SURE', label: 'Not Sure / General Enquiry', icon: HelpCircle },
];

export const BookingModal: React.FC = () => {
  const { isOpen, closeBooking, specialty, doctor } = useBooking();
  const { currentUser, isAuthenticated } = useAuth();

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

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmittedRecord(null);
      setErrorMsg('');
      setFullName(currentUser?.name || '');
      setMobileNumber(currentUser?.phone || '');
      setEmail(currentUser?.email || '');
      setConsent(false);
      setSelectedCareType(
        specialty ? 'DOCTOR_VISIT' : 'DOCTOR_VISIT'
      );
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 80);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, specialty, currentUser]);

  // Escape key & focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeBooking();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeBooking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!mobileNumber.trim() || mobileNumber.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please provide a valid contact mobile number.');
      return;
    }

    if (!consent) {
      setErrorMsg('Please confirm your consent to receive a callback.');
      return;
    }

    setIsSubmitting(true);

    try {
      const careItem = CARE_TYPES.find((c) => c.id === selectedCareType);
      const careLabel = careItem?.label || 'General Healthcare Enquiry';

      const newBooking = db.createBooking({
        bookingType: 'QUICK_ENQUIRY',
        patientId: currentUser ? currentUser.id : 'pat-guest',
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
        notes: `Quick appointment request modal. Care: ${careLabel}${
          doctor ? ` Preferred Dr: ${doctor}` : ''
        }.`,
      });

      setSubmittedRecord({
        referenceNumber: newBooking.bookingNumber,
        patientName: fullName.trim(),
        phone: mobileNumber.trim(),
        careLabel,
      });
    } catch (err) {
      setErrorMsg('Unable to submit enquiry right now. Please call our 24/7 hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickAppointmentTitle"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeBooking();
        }
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg overflow-hidden rounded-[26px] border border-[#E2EBE7] bg-white p-6 sm:p-8 shadow-2xl transition-all my-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeBooking}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F8F5] text-slate-500 hover:bg-[#E2EBE7] hover:text-[#102820] transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {submittedRecord ? (
          /* ================= SUCCESS STATE ================= */
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] shadow-2xs mb-4">
              <CheckCircle2 className="h-7 w-7 stroke-[2.2]" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F2F8F5] border border-[#E2EBE7] px-3 py-0.5 text-xs font-bold text-slate-700 mb-2">
              <span className="text-slate-400 font-medium">Reference:</span>
              <span className="text-[#065F46] font-mono">{submittedRecord.referenceNumber}</span>
            </div>

            <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#102820]">
              Callback Request Received
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-[#102820]">{submittedRecord.patientName}</strong>. Our clinical coordination desk has received your request.
            </p>

            <div className="mt-5 rounded-2xl bg-[#F5F9F7] border border-[#E2EBE7] p-4 text-left text-xs space-y-2">
              <p className="font-bold uppercase tracking-wider text-[11px] text-[#065F46] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>What Happens Next</span>
              </p>
              <p className="text-slate-600">
                1. A coordinator will call you back on <strong className="text-[#102820]">{submittedRecord.phone}</strong> in <strong>15–30 minutes</strong>.
              </p>
              <p className="text-slate-600">
                2. We will confirm your symptoms, schedule an in-home clinician or teleconsult, and answer any questions.
              </p>
              <p className="text-slate-600">
                3. No payment is charged upfront.
              </p>
            </div>

            <button
              type="button"
              onClick={closeBooking}
              className="mt-6 w-full rounded-full bg-[#064E3B] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* ================= FORM STATE ================= */
          <div>
            {/* Modal Heading */}
            <div className="pr-8">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[10px] font-bold text-[#065F46] uppercase tracking-wider mb-2">
                <ShieldCheck className="h-3 w-3 stroke-[2.5]" />
                <span>Fast Callback</span>
              </div>
              <h2
                id="quickAppointmentTitle"
                className="font-heading text-2xl sm:text-[26px] font-extrabold tracking-tight text-[#102820]"
              >
                How can I help you today?
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Tell us what care you need. Our team will get in touch.
              </p>

              {currentUser ? (
                <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-1.5 text-xs text-[#065F46] font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#065F46]" />
                  <span>Authenticated as <strong>{currentUser.name}</strong> (Details auto-filled)</span>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-3 py-1.5 text-[11px] text-slate-600">
                  <span>Booking as Guest Visitor</span>
                  <span className="text-[#065F46] font-semibold">No account required</span>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Type of Care Pills */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
                  What kind of care do you need?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CARE_TYPES.map((care) => {
                    const IconComponent = care.icon;
                    const isSelected = selectedCareType === care.id;
                    return (
                      <button
                        key={care.id}
                        type="button"
                        onClick={() => setSelectedCareType(care.id)}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all ${
                          isSelected
                            ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] ring-1 ring-[#064E3B] font-bold shadow-2xs'
                            : 'border-[#E2EBE7] bg-white text-slate-700 hover:bg-[#F2F8F5]'
                        }`}
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                            isSelected
                              ? 'bg-[#064E3B] text-white'
                              : 'bg-[#F2F8F5] text-slate-500'
                          }`}
                        >
                          <IconComponent className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs">{care.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>

              {/* Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="eleanor@example.com"
                      className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-9 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                    />
                  </div>
                </div>
              </div>

              {/* Consent Checkbox */}
              <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  required
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#064E3B] focus:ring-[#064E3B]"
                />
                <span className="text-[11px] text-slate-600 leading-snug">
                  I agree to receive a callback or WhatsApp from Vellora Health care coordination team.
                </span>
              </label>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#064E3B] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span>Request a Callback</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
