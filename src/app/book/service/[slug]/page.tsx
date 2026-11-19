'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db, ServiceRecord } from '@/lib/db';
import { bookingDate, isValidBookingDate } from '@/lib/booking-date';
import { useAuth } from '@/context/AuthContext';
import { RequestSuccessState } from '@/components/booking/RequestSuccessState';
import { BackButton } from '@/components/common/BackButton';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Check,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  FileText,
  AlertCircle,
  Home,
  Sparkles,
} from 'lucide-react';

interface ServiceBookingPageProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceBookingPage({ params }: ServiceBookingPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { currentUser } = useAuth();

  const service = db.getServiceBySlug(slug) || db.getServiceById(slug);

  if (!service) {
    notFound();
  }

  // 3-Step Wizard State
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // STEP 1 State: Care & Location
  const [pinCode, setPinCode] = useState('94107');
  const [coverageStatus, setCoverageStatus] = useState<string>('Demo coverage estimate — availability requires confirmation');
  const [selectedOption, setSelectedOption] = useState<string>(
    service.supportedOptions[0] || 'Standard Procedure'
  );

  // STEP 2 State: Patient & Schedule
  const [recipient, setRecipient] = useState<'SELF' | 'OTHER'>('SELF');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [relationship, setRelationship] = useState('Parent');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [preferredDate, setPreferredDate] = useState(
    bookingDate(1)
  );
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(
    'Morning (08:00 AM – 12:00 PM)'
  );
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [careNotes, setCareNotes] = useState('');

  // Pre-load saved addresses & family members for authenticated patient
  const savedAddresses = currentUser ? db.getAddresses(currentUser.id) : [];
  const savedFamily = currentUser ? db.getFamilyMembers(currentUser.id) : [];

  // Auto-fill from currentUser when available
  useEffect(() => {
    if (currentUser && recipient === 'SELF') {
      if (!patientName) setPatientName(currentUser.name);
      if (!contactPhone) setContactPhone(currentUser.phone);
    }
  }, [currentUser, recipient]);

  // STEP 3 State: Review & Submit
  const [consent, setConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<{
    referenceNumber: string;
    patientName: string;
    phone: string;
  } | null>(null);

  // Validation per step
  const handleNextFromStep1 = () => {
    setErrorMsg('');
    if (!pinCode.trim() || pinCode.trim().length < 4) {
      setErrorMsg('Please enter a valid PIN code or postal area.');
      return;
    }
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    setErrorMsg('');
    if (!isValidBookingDate(preferredDate)) {
      setErrorMsg('Please choose a valid appointment date today or later.');
      return;
    }
    if (!patientName.trim()) {
      setErrorMsg('Please enter the patient full name.');
      return;
    }
    if (!contactPhone.trim() || contactPhone.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please enter a valid mobile number for visit updates.');
      return;
    }
    if (!streetAddress.trim()) {
      setErrorMsg('Please enter the street address where care will be provided.');
      return;
    }
    setStep(3);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!isValidBookingDate(preferredDate)) {
      setErrorMsg('Please choose a valid appointment date today or later.');
      setStep(2);
      return;
    }

    if (!consent) {
      setErrorMsg('Please confirm your request and bedside arrival consent.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullAddress = `${streetAddress}${apartment ? `, Apt/Flat ${apartment}` : ''}, PIN: ${pinCode}`;

      const newBooking = db.createBooking({
        bookingType: 'SERVICE_REQUEST',
        patientId: currentUser ? currentUser.id : 'pat-guest',
        patientName: recipient === 'SELF' && currentUser ? currentUser.name : patientName.trim(),
        patientPhone: contactPhone.trim(),
        patientEmail: currentUser?.email,
        beneficiaryName: patientName.trim(),
        beneficiaryRelation: recipient === 'SELF' ? 'Self' : relationship,
        serviceId: service.id,
        serviceName: service.name,
        category: service.category as any,
        addressText: fullAddress,
        scheduledDate: preferredDate,
        scheduledTimeSlot: preferredTimeSlot,
        status: 'REQUESTED',
        totalAmount: service.basePrice,
        paymentStatus: 'PENDING',
        notes: `Selected Option: ${selectedOption}. Notes: ${careNotes || 'None'}`,
      });

      setSubmittedBooking({
        referenceNumber: newBooking.bookingNumber,
        patientName: patientName.trim(),
        phone: contactPhone.trim(),
      });
    } catch (err) {
      setErrorMsg('Failed to submit care request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplexCare =
    service.category === 'CRITICAL_CARE' ||
    service.slug.includes('icu') ||
    service.slug.includes('tracheostomy');

  const ctaLabel = isComplexCare
    ? 'Request Clinical Assessment'
    : 'Request This Service';

  const isDoctorVisit =
    service.slug.includes('doctor') ||
    service.category === 'DOCTOR_VISIT' ||
    service.name.toLowerCase().includes('doctor');

  const pageTitle = isDoctorVisit ? 'Booking Home Visit Doctor' : `Booking ${service.name}`;

  return (
    <div className="min-h-screen bg-[#F5F9F7]">
      <div className="py-6 sm:py-12">
        {/* Main Form Content */}
        <main className="max-w-2xl mx-auto px-2.5 sm:px-6">
        {submittedBooking ? (
          <RequestSuccessState
            type="SERVICE_REQUEST"
            referenceNumber={submittedBooking.referenceNumber}
            patientName={submittedBooking.patientName}
            phone={submittedBooking.phone}
            details={[
              { label: 'Service', value: service.name },
              { label: 'Selected Option', value: selectedOption },
              { label: 'Estimated Schedule', value: `${preferredDate} • ${preferredTimeSlot}` },
              { label: 'Visit Address', value: `${streetAddress}${apartment ? `, Apt ${apartment}` : ''}, PIN: ${pinCode}` },
              { label: 'Estimated Fee', value: `$${service.basePrice} (Pay upon visit)` },
            ]}
          />
        ) : (
          <div>
            {/* Back to Services Navigation Button */}
            <div className="mb-3 sm:mb-4 animate-fade-in-down">
              <BackButton href="/services" label="Back to Services" />
            </div>

            {/* Main Heading - Clean and Minimal */}
            <div className="mb-4 sm:mb-6 animate-fade-in-up">
              <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#102820] tracking-tight">
                {pageTitle}
              </h1>
            </div>

            {/* Focused Single Form Card */}
            <div className="w-full bg-white border border-[#E2EBE7] rounded-2xl sm:rounded-[24px] p-4 sm:p-7 shadow-xs animate-card-slide-right">
              {errorMsg && (
                <div className="mb-6 flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs font-semibold text-rose-700">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: CARE & LOCATION */}
              {step === 1 && (
                <div key="step-1" className="space-y-6 animate-step-transition">
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#102820]">
                      1. Confirm Care Options &amp; Service Area
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Verify your area coverage and select clinical specifications for this visit.
                    </p>
                  </div>

                  {/* Selected Service Preview - Crisp, Non-Blurry, High-Contrast */}
                  <div className="rounded-2xl border border-[#A7F3D0] bg-[#ECFDF5] p-3.5 sm:p-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border border-white bg-white shadow-xs">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold text-[#065F46] tracking-tight">
                            {service.categoryLabel} • {service.duration}
                          </span>
                          <Link
                            href="/services"
                            className="text-[11px] font-bold text-[#065F46] hover:underline shrink-0"
                          >
                            Change
                          </Link>
                        </div>
                        <h3 className="font-heading text-sm sm:text-base font-bold text-[#102820] leading-snug mt-0.5">
                          {service.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-600 mt-0.5">
                          From <span className="font-extrabold text-[#064E3B] text-sm">${service.basePrice}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Area PIN Code Coverage Check */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Service Area / PIN Code <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative max-w-sm">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={pinCode}
                        onChange={(e) => {
                          setPinCode(e.target.value);
                          if (e.target.value.length >= 4) {
                            setCoverageStatus('Demo coverage estimate — availability requires confirmation');
                          } else {
                            setCoverageStatus('');
                          }
                        }}
                        placeholder="Enter 5 or 6 digit PIN code"
                        className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 pl-10 pr-4 text-xs font-semibold text-[#102820] focus:bg-white focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                      />
                    </div>
                    {coverageStatus && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-[#065F46]">
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        <span>{coverageStatus}</span>
                      </p>
                    )}
                  </div>

                  {/* Conditional Service Specific Options */}
                  {service.supportedOptions && service.supportedOptions.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Select Clinical Shift or Delivery Option
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {service.supportedOptions.map((opt, i) => {
                          const isSelected = selectedOption === opt;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setSelectedOption(opt)}
                              className={`flex items-center justify-between rounded-xl p-3 text-left text-xs font-bold transition-all border ${
                                isSelected
                                  ? 'bg-[#ECFDF5] border-[#065F46] text-[#065F46] shadow-2xs'
                                  : 'bg-white border-[#E2EBE7] text-slate-600 hover:bg-[#F2F8F5]'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Navigation CTA */}
                  <div className="pt-4 flex justify-end border-t border-[#F2F8F5]">
                    <button
                      type="button"
                      onClick={handleNextFromStep1}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#064E3B] px-6 py-2.5 sm:py-3 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors whitespace-nowrap cursor-pointer"
                    >
                      <span>Continue to Patient Details</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PATIENT & SCHEDULE */}
              {step === 2 && (
                <div key="step-2" className="space-y-6 animate-step-transition">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-[#102820]">
                      2. Patient &amp; Schedule Details
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Who will receive the medical care and what is your preferred arrival window?
                    </p>
                  </div>

                  {/* Authentication Intent Banner */}
                  {currentUser ? (
                    <div className="flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] p-3 text-xs text-[#065F46]">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-[#065F46]" />
                      <span>
                        Logged in as <strong>{currentUser.name}</strong>. Your profile details and verified contacts have been pre-filled.
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
                      <span>Booking as Guest Visitor. Have a Vellora patient account?</span>
                      <Link
                        href={`/patient/login?redirect=/book/service/${slug}`}
                        className="inline-flex items-center gap-1 font-bold text-[#064E3B] hover:underline"
                      >
                        <span>Sign In to auto-fill</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}

                  {/* Family member quick-selector if authenticated and OTHER */}
                  {currentUser && recipient === 'OTHER' && savedFamily.length > 0 && (
                    <div className="rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] p-3 text-xs space-y-2">
                      <span className="font-bold text-[#102820] text-[11px] uppercase tracking-wider block">
                        Select from your registered family profiles:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {savedFamily.map((fam) => (
                          <button
                            key={fam.id}
                            type="button"
                            onClick={() => {
                              setPatientName(fam.fullName);
                              setRelationship(fam.relationship);
                            }}
                            className="rounded-lg bg-white border border-[#D1DCD6] px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors shadow-2xs"
                          >
                            {fam.fullName} ({fam.relationship})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Self vs Dependent Toggle */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Who is receiving this care?
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setRecipient('SELF')}
                        className={`flex-1 rounded-xl py-2.5 px-4 text-xs font-bold border transition-all ${
                          recipient === 'SELF'
                            ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-2xs'
                            : 'bg-white text-slate-700 border-[#E2EBE7] hover:bg-[#F2F8F5]'
                        }`}
                      >
                        Myself
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecipient('OTHER')}
                        className={`flex-1 rounded-xl py-2.5 px-4 text-xs font-bold border transition-all ${
                          recipient === 'OTHER'
                            ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-2xs'
                            : 'bg-white text-slate-700 border-[#E2EBE7] hover:bg-[#F2F8F5]'
                        }`}
                      >
                        Family Member / Dependent
                      </button>
                    </div>
                  </div>

                  {/* Patient Name & Relationship */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Patient Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor Vance"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 px-3.5 text-xs font-medium text-[#102820] focus:bg-white focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                      />
                    </div>

                    {recipient === 'OTHER' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Relationship to Patient
                        </label>
                        <select
                          value={relationship}
                          onChange={(e) => setRelationship(e.target.value)}
                          className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 px-3.5 text-xs font-semibold text-[#102820] focus:bg-white focus:border-[#064E3B] focus:outline-none"
                        >
                          <option value="Parent">Parent (Mother / Father)</option>
                          <option value="Spouse">Spouse / Partner</option>
                          <option value="Child">Child (Son / Daughter)</option>
                          <option value="Relative">Other Relative</option>
                        </select>
                      </div>
                    )}

                    <div className={recipient === 'SELF' ? 'sm:col-span-1' : 'sm:col-span-2'}>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Contact Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="For SMS and WhatsApp live visit updates"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 px-3.5 text-xs font-medium text-[#102820] focus:bg-white focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                      />
                    </div>
                  </div>

                  {/* Schedule: Preferred Date & Time Window */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Preferred Date <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="date"
                          value={preferredDate}
                          min={bookingDate()}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 pl-10 pr-3.5 text-xs font-semibold text-[#102820] focus:bg-white focus:border-[#064E3B] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Preferred Time Window <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <select
                          value={preferredTimeSlot}
                          onChange={(e) => setPreferredTimeSlot(e.target.value)}
                          className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 pl-10 pr-3.5 text-xs font-semibold text-[#102820] focus:bg-white focus:border-[#064E3B] focus:outline-none"
                        >
                          <option value="Morning (08:00 AM – 12:00 PM)">Morning (08:00 AM – 12:00 PM)</option>
                          <option value="Afternoon (12:00 PM – 04:00 PM)">Afternoon (12:00 PM – 04:00 PM)</option>
                          <option value="Evening (04:00 PM – 08:00 PM)">Evening (04:00 PM – 08:00 PM)</option>
                          <option value="Full Day Shift (12h / 24h)">Full Day Shift (12h / 24h)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Visit Address Fields */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700">
                        Doorstep Visit Address <span className="text-rose-500">*</span>
                      </label>
                      {currentUser && savedAddresses.length > 0 && (
                        <span className="text-[11px] text-slate-500">Pick saved address:</span>
                      )}
                    </div>

                    {currentUser && savedAddresses.length > 0 && (
                      <div className="flex flex-wrap gap-2 pb-1">
                        {savedAddresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => {
                              setStreetAddress(addr.streetAddress);
                              setApartment(addr.apartment || '');
                              if (addr.postalCode) setPinCode(addr.postalCode);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#D1DCD6] px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors shadow-2xs"
                          >
                            <Home className="h-3 w-3 text-[#065F46]" />
                            <span>{addr.tag}: {addr.streetAddress}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <input
                      type="text"
                      required
                      placeholder="Street address, building name, house number"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 px-3.5 text-xs font-medium text-[#102820] focus:bg-white focus:border-[#064E3B] focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Apartment / Suite (Optional)"
                        value={apartment}
                        onChange={(e) => setApartment(e.target.value)}
                        className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2 px-3.5 text-xs font-medium text-[#102820] focus:bg-white focus:border-[#064E3B] focus:outline-none"
                      />
                      <input
                        type="text"
                        readOnly
                        value={`PIN: ${pinCode}`}
                        className="w-full rounded-xl border border-[#E2EBE7] bg-[#F2F8F5] py-2 px-3.5 text-xs font-bold text-slate-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Optional Care Instructions */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Care Instructions / Special Clinical Requests (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Elderly patient requires gentle mobility assistance; doorbell out of order."
                      value={careNotes}
                      onChange={(e) => setCareNotes(e.target.value)}
                      className="w-full rounded-xl border border-[#E2EBE7] bg-[#F5F9F7] py-2.5 px-3.5 text-xs font-medium text-[#102820] focus:bg-white focus:border-[#064E3B] focus:outline-none"
                    />
                  </div>

                  {/* Step Buttons */}
                  <div className="pt-4 flex items-center justify-between gap-2 border-t border-[#F2F8F5]">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#102820] whitespace-nowrap shrink-0 py-2 cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span className="sm:hidden">Back</span>
                      <span className="hidden sm:inline">Back to Care Options</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleNextFromStep2}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#064E3B] px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Review &amp; Request</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW & SUBMIT */}
              {step === 3 && (
                <div key="step-3" className="space-y-6 animate-step-transition">
                  <div>
                    <h2 className="font-heading text-lg sm:text-xl font-bold text-[#102820]">
                      3. Review Care Request &amp; Submit
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Please verify visit details before requesting clinician dispatch.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="rounded-2xl border border-[#E2EBE7] bg-[#F5F9F7] p-4 sm:p-5 space-y-3.5 text-xs">
                    <div className="flex justify-between items-start border-b border-[#E2EBE7] pb-3">
                      <div className="min-w-0 pr-3">
                        <span className="text-[10px] font-extrabold uppercase text-[#065F46]">
                          Service
                        </span>
                        <h4 className="font-heading font-extrabold text-sm text-[#102820] leading-snug">
                          {service.name}
                        </h4>
                        <p className="text-slate-500 text-[11px] mt-0.5">{selectedOption}</p>
                      </div>
                      <span className="font-heading font-black text-base text-[#102820] shrink-0">
                        ${service.basePrice}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-slate-600">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">
                          Patient
                        </span>
                        <span className="font-bold text-[#102820] block">{patientName}</span>
                        {recipient === 'OTHER' && (
                          <span className="block text-[11px] text-slate-500">({relationship})</span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">
                          Contact Phone
                        </span>
                        <span className="font-bold text-[#102820] block">{contactPhone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-slate-600 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">
                          Visit Window
                        </span>
                        <span className="font-bold text-[#102820] block">{preferredDate}</span>
                        <span className="block text-[11px] text-slate-500">{preferredTimeSlot}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">
                          Doorstep Address
                        </span>
                        <span className="font-medium text-[#102820] block line-clamp-2">
                          {streetAddress || 'Home Address'}
                          {apartment ? `, Apt ${apartment}` : ''}, PIN: {pinCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Truthful Pricing & Dispatch Notice */}
                  <div className="rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] p-3.5 text-xs text-[#065F46] space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      <span>Transparent Billing Policy</span>
                    </p>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      This is an estimated price request. No payment is charged online today. Billing is confirmed only after clinician arrival and verification via your 4-digit bedside PIN.
                    </p>
                  </div>

                  {/* Consent Checkbox */}
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-[#CBDCD5] text-[#064E3B] focus:ring-[#064E3B]"
                      />
                      <span className="text-[11px] sm:text-xs text-slate-600 select-none">
                        I confirm that the above home visit details are correct and request Vellora Health to coordinate and dispatch an accredited clinician.
                      </span>
                    </label>
                  </div>

                  {/* Final Submit & Back CTA */}
                  <div className="pt-4 flex items-center justify-between gap-2 border-t border-[#F2F8F5]">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#102820] whitespace-nowrap shrink-0 py-2 cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                      <span>Edit Patient Info</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleSubmitBooking}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#064E3B] px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>{isSubmitting ? 'Submitting...' : ctaLabel}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  </div>
);
}
