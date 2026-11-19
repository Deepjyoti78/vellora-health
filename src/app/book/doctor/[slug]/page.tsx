'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db, UserRecord } from '@/lib/db';
import { bookingDate, isValidBookingDate } from '@/lib/booking-date';
import { useAuth } from '@/context/AuthContext';
import { RequestSuccessState } from '@/components/booking/RequestSuccessState';
import { BackButton } from '@/components/common/BackButton';
import {
  Stethoscope,
  Video,
  Home,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Check,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  FileText,
  Building,
  HeartPulse,
} from 'lucide-react';

interface DoctorBookingPageProps {
  params: Promise<{ slug: string }>;
}

export default function DoctorBookingPage({ params }: DoctorBookingPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { currentUser } = useAuth();

  const doctor: UserRecord | undefined =
    db.getDoctorBySlugOrId(slug);

  if (!doctor) {
    notFound();
  }

  // 3-Step Wizard State
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // STEP 1 State: Doctor & Appointment
  const [consultType, setConsultType] = useState<'HOME_VISIT' | 'TELECONSULT'>('HOME_VISIT');
  const [dateOption, setDateOption] = useState<'TODAY' | 'TOMORROW' | 'CUSTOM'>('TODAY');
  const todayStr = bookingDate();
  const tomorrowStr = bookingDate(1);
  const [customDate, setCustomDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState<'MORNING' | 'AFTERNOON' | 'EVENING'>('MORNING');
  const [pinCode, setPinCode] = useState('94107');
  const [pinStatus, setPinStatus] = useState<string>(
    'Demo coverage estimate — availability requires confirmation'
  );

  // STEP 2 State: Patient Details
  const [recipient, setRecipient] = useState<'SELF' | 'FAMILY'>('SELF');
  const [relationship, setRelationship] = useState('Parent');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientAge, setPatientAge] = useState('34');
  const [patientGender, setPatientGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || '');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [consultReason, setConsultReason] = useState('');

  // Pre-load saved records for authenticated patient
  const savedAddresses = currentUser ? db.getAddresses(currentUser.id) : [];
  const savedFamily = currentUser ? db.getFamilyMembers(currentUser.id) : [];

  useEffect(() => {
    if (currentUser && recipient === 'SELF') {
      if (!patientName) setPatientName(currentUser.name);
      if (!contactPhone) setContactPhone(currentUser.phone);
      if (!patientEmail) setPatientEmail(currentUser.email);
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

  // Pricing calculations
  const baseRate = doctor.hourlyRate || 85;
  const consultFee = consultType === 'HOME_VISIT' ? baseRate : Math.round(baseRate * 0.75);
  const travelFee = consultType === 'HOME_VISIT' ? 10 : 0;
  const totalFee = consultFee + travelFee;

  const timeSlotLabels = {
    MORNING: 'Morning (09:00 AM – 12:00 PM)',
    AFTERNOON: 'Afternoon (12:00 PM – 04:00 PM)',
    EVENING: 'Evening (04:00 PM – 08:00 PM)',
  };

  const selectedDateStr =
    dateOption === 'TODAY'
      ? `Today, ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : dateOption === 'TOMORROW'
      ? `Tomorrow, ${new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : new Date(customDate).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });

  // Step 1 Validation
  const handleNextFromStep1 = () => {
    setErrorMsg('');
    if (dateOption === 'CUSTOM' && !isValidBookingDate(customDate)) {
      setErrorMsg('Please choose a valid appointment date today or later.');
      return;
    }
    if (consultType === 'HOME_VISIT') {
      if (!pinCode.trim() || pinCode.trim().length < 4) {
        setErrorMsg('Please enter a valid 5-digit PIN or postal code for doorstep verification.');
        return;
      }
    }
    setStep(2);
  };

  // Step 2 Validation
  const handleNextFromStep2 = () => {
    setErrorMsg('');
    if (!patientName.trim()) {
      setErrorMsg('Please enter the patient full name.');
      return;
    }
    if (!patientAge.trim() || isNaN(Number(patientAge)) || Number(patientAge) <= 0 || Number(patientAge) > 120) {
      setErrorMsg('Please enter a valid patient age.');
      return;
    }
    if (!contactPhone.trim() || contactPhone.replace(/\D/g, '').length < 7) {
      setErrorMsg('Please enter a valid mobile number for visit updates.');
      return;
    }
    if (consultType === 'HOME_VISIT' && !streetAddress.trim()) {
      setErrorMsg('Please enter the doorstep address where the doctor will visit.');
      return;
    }
    setStep(3);
  };

  // Step 3 Submission
  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dateOption === 'CUSTOM' && !isValidBookingDate(customDate)) {
      setErrorMsg('Please choose a valid appointment date today or later.');
      setStep(1);
      return;
    }
    if (!consent) {
      setErrorMsg('Please confirm your consent to proceed with scheduling.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Find matching service or fallback
      const matchingService =
        db.getServicesByCategory('DOCTOR_VISIT')[0] || db.getServices()[0];

      const fullAddress =
        consultType === 'HOME_VISIT'
          ? `${apartment ? `${apartment}, ` : ''}${streetAddress}, PIN ${pinCode}`
          : 'Virtual Video Consultation Room';

      const fullScheduledDate =
        dateOption === 'TODAY'
          ? bookingDate()
          : dateOption === 'TOMORROW'
          ? bookingDate(1)
          : customDate;

      const newBooking = db.createBooking({
        bookingType: 'DOCTOR_CONSULTATION',
        patientId: currentUser ? currentUser.id : 'pat-guest',
        beneficiaryName: patientName.trim(),
        beneficiaryRelation: recipient === 'SELF' ? 'Self' : relationship,
        serviceId: matchingService ? matchingService.id : 'srv-1',
        serviceName:
          consultType === 'HOME_VISIT'
            ? `Doctor Home Visit — ${doctor.name}`
            : `Online Teleconsultation — ${doctor.name}`,
        category: 'DOCTOR_VISIT',
        providerId: doctor.id,
        providerName: doctor.name,
        providerRole: 'DOCTOR',
        patientName: recipient === 'SELF' && currentUser ? currentUser.name : `${patientName} (${relationship})`,
        patientEmail: patientEmail.trim() || currentUser?.email || doctor.email,
        patientPhone: contactPhone,
        addressText: fullAddress,
        scheduledDate: fullScheduledDate,
        scheduledTimeSlot: timeSlotLabels[timeSlot],
        status: 'REQUESTED',
        totalAmount: totalFee,
        discountAmount: 0,
        paymentStatus: 'PENDING',
        paymentMethod: 'Pay Post-Visit / Card on Arrival',
        notes: `Age: ${patientAge}, Gender: ${patientGender}. Mode: ${
          consultType === 'HOME_VISIT' ? 'Doorstep Home Visit' : 'Teleconsultation'
        }. Clinical reason: ${consultReason || 'Routine clinical assessment'}`,
        clinicalNotes: `Patient Consultation Request: ${patientName} (${patientAge}y, ${patientGender}). Contact: ${contactPhone}.`,
      });

      setSubmittedBooking({
        referenceNumber: newBooking.bookingNumber,
        patientName: patientName,
        phone: contactPhone,
      });
    } catch (err: unknown) {
      console.error('Error creating doctor booking:', err);
      setErrorMsg('Unable to submit your consultation request. Please try again or call our 24/7 hotline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9F7]">
      <div className="py-6 sm:py-12">
        {/* Main Body */}
        <main className="container max-w-5xl mx-auto px-4 sm:px-6">
        {submittedBooking ? (
          <RequestSuccessState
            type="DOCTOR_CONSULTATION"
            referenceNumber={submittedBooking.referenceNumber}
            title="Demo Consultation Request Saved"
            subtitle="Saved for this demo session. No clinician was contacted and no payment was taken."
            patientName={submittedBooking.patientName}
            phone={submittedBooking.phone}
            primaryActionHref="/doctors"
            primaryActionLabel="Browse More Doctors"
            details={[
              { label: 'Selected Specialist', value: doctor.name },
              { label: 'Specialty', value: doctor.specialty || 'General Practice' },
              {
                label: 'Consultation Mode',
                value: consultType === 'HOME_VISIT' ? 'Doorstep Home Visit' : 'Online Teleconsultation',
              },
              { label: 'Date & Slot', value: `${selectedDateStr} • ${timeSlotLabels[timeSlot]}` },
              { label: 'Estimated Fee', value: `$${totalFee} (Pay Post-Consultation)` },
              { label: 'Patient Name', value: submittedBooking.patientName },
              {
                label: 'Location / Mode',
                value: consultType === 'HOME_VISIT' ? `Area PIN ${pinCode}` : 'Secure Video Room',
              },
            ]}
          />
        ) : (
          <div>
            {/* Back to Doctors Navigation Button */}
            <div className="mb-4 animate-fade-in-down">
              <BackButton href="/doctors" label="Back to Doctors" />
            </div>

            {/* Main Heading - Clean and Minimal */}
            <div className="mb-6 sm:mb-8 animate-fade-in-up">
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#102820] tracking-tight">
                Booking Home Visit Doctor
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-card-slide-right">
            {/* Form Column (8 cols) */}
            <div className="lg:col-span-8">
              <div className="overflow-hidden rounded-[24px] border border-[#E2EBE7] bg-white p-6 sm:p-8 shadow-xs">
                {errorMsg && (
                  <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* ================= STEP 1: DOCTOR & VISIT ================= */}
                {step === 1 && (
                  <div key="step-1" className="space-y-6 animate-step-transition">
                    <div>
                      <h2 className="font-heading text-lg sm:text-xl font-extrabold text-[#102820]">
                        Step 1: Choose Consultation Type &amp; Schedule
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Select whether you prefer a doorstep visit or an online video consultation.
                      </p>
                    </div>

                    {/* Preselected Doctor Card */}
                    <div className="rounded-2xl border border-[#D1FAE5] bg-[#F2F8F5] p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={doctor.avatar || '/assets/doctor-maya-patel.webp'}
                            alt={doctor.name}
                            className="h-14 w-14 rounded-2xl object-cover object-top border border-[#CBDCD5] bg-white shadow-2xs shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-heading text-base font-extrabold text-[#102820]">
                                {doctor.name}
                              </span>
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                                <Check className="h-2.5 w-2.5 stroke-[3]" />
                                <span>Verified</span>
                              </span>
                            </div>
                            <p className="text-xs font-bold text-[#065F46] mt-0.5">
                              {doctor.specialty}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {doctor.qualification}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-[#E2EBE7] pt-2 sm:pt-0">
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span>{doctor.rating}</span>
                            <span className="text-slate-400 font-normal">({doctor.reviewsCount || 120}+ reviews)</span>
                          </div>
                          <Link
                            href="/doctors"
                            className="text-xs font-bold text-[#065F46] hover:underline mt-1"
                          >
                            Change Doctor
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Consultation Type Selector */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                        Consultation Mode
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* Option 1: Doorstep Home Visit */}
                        <button
                          type="button"
                          onClick={() => setConsultType('HOME_VISIT')}
                          className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                            consultType === 'HOME_VISIT'
                              ? 'border-[#064E3B] bg-[#ECFDF5]/60 ring-1 ring-[#064E3B] shadow-2xs'
                              : 'border-[#E2EBE7] bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                                  consultType === 'HOME_VISIT'
                                    ? 'bg-[#064E3B] text-white'
                                    : 'bg-[#F2F8F5] text-[#065F46]'
                                }`}
                              >
                                <Home className="h-4 w-4" />
                              </div>
                              <span className="font-heading text-sm font-extrabold text-[#102820]">
                                Doorstep Home Visit
                              </span>
                            </div>
                            <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                              Recommended
                            </span>
                          </div>

                          <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                            Doctor visits your home with clinical assessment kit, bedside vitals monitor, and digital prescription.
                          </p>

                          <div className="mt-3 flex items-baseline gap-1 text-xs">
                            <span className="font-heading font-extrabold text-[#064E3B] text-base">
                              ${baseRate}
                            </span>
                            <span className="text-slate-400 text-[11px] font-medium">+ $10 travel</span>
                          </div>
                        </button>

                        {/* Option 2: Online Teleconsultation */}
                        <button
                          type="button"
                          onClick={() => setConsultType('TELECONSULT')}
                          className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                            consultType === 'TELECONSULT'
                              ? 'border-[#064E3B] bg-[#ECFDF5]/60 ring-1 ring-[#064E3B] shadow-2xs'
                              : 'border-[#E2EBE7] bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                                  consultType === 'TELECONSULT'
                                    ? 'bg-[#064E3B] text-white'
                                    : 'bg-[#F2F8F5] text-[#065F46]'
                                }`}
                              >
                                <Video className="h-4 w-4" />
                              </div>
                              <span className="font-heading text-sm font-extrabold text-[#102820]">
                                Online Video Consult
                              </span>
                            </div>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              Virtual
                            </span>
                          </div>

                          <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                            1-on-1 private HD video consultation from anywhere. Instant digital prescription &amp; follow-up advice.
                          </p>

                          <div className="mt-3 flex items-baseline gap-1 text-xs">
                            <span className="font-heading font-extrabold text-[#064E3B] text-base">
                              ${Math.round(baseRate * 0.75)}
                            </span>
                            <span className="text-slate-400 text-[11px] font-medium">Flat fee</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Preferred Date
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                        <button
                          type="button"
                          onClick={() => setDateOption('TODAY')}
                          className={`rounded-xl border py-2.5 px-3 text-center text-xs font-bold transition-all ${
                            dateOption === 'TODAY'
                              ? 'border-[#064E3B] bg-[#064E3B] text-white shadow-2xs'
                              : 'border-[#E2EBE7] bg-white text-slate-700 hover:bg-[#F2F8F5]'
                          }`}
                        >
                          Today (Same-Day)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDateOption('TOMORROW')}
                          className={`rounded-xl border py-2.5 px-3 text-center text-xs font-bold transition-all ${
                            dateOption === 'TOMORROW'
                              ? 'border-[#064E3B] bg-[#064E3B] text-white shadow-2xs'
                              : 'border-[#E2EBE7] bg-white text-slate-700 hover:bg-[#F2F8F5]'
                          }`}
                        >
                          Tomorrow
                        </button>
                        <button
                          type="button"
                          onClick={() => setDateOption('CUSTOM')}
                          className={`rounded-xl border py-2.5 px-3 text-center text-xs font-bold transition-all ${
                            dateOption === 'CUSTOM'
                              ? 'border-[#064E3B] bg-[#064E3B] text-white shadow-2xs'
                              : 'border-[#E2EBE7] bg-white text-slate-700 hover:bg-[#F2F8F5]'
                          }`}
                        >
                          Pick Another Date
                        </button>
                      </div>

                      {dateOption === 'CUSTOM' && (
                        <div className="mt-3">
                          <input
                            type="date"
                            min={todayStr}
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            className="w-full sm:w-64 rounded-xl border border-[#CBDCD5] bg-white px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                          />
                        </div>
                      )}
                    </div>

                    {/* Time Slot Selection */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Preferred Arrival Window
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {(['MORNING', 'AFTERNOON', 'EVENING'] as const).map((slot) => {
                          const isSelected = timeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeSlot(slot)}
                              className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                                isSelected
                                  ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] ring-1 ring-[#064E3B]'
                                  : 'border-[#E2EBE7] bg-white text-slate-700 hover:bg-[#F2F8F5]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 text-xs font-bold">
                                <Clock className={`h-3.5 w-3.5 ${isSelected ? 'text-[#064E3B]' : 'text-slate-400'}`} />
                                <span className="capitalize">{slot.toLowerCase()}</span>
                              </div>
                              <span className="text-[11px] text-slate-500 mt-1 font-medium">
                                {slot === 'MORNING'
                                  ? '09:00 AM – 12:00 PM'
                                  : slot === 'AFTERNOON'
                                  ? '12:00 PM – 04:00 PM'
                                  : '04:00 PM – 08:00 PM'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Doorstep Area PIN Check if Home Visit */}
                    {consultType === 'HOME_VISIT' && (
                      <div className="rounded-2xl border border-[#E2EBE7] bg-[#F5F9F7] p-4 sm:p-5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Doorstep Service PIN Code
                        </label>
                        <p className="text-xs text-slate-500 mb-3">
                          Verify that your residence is within Dr. {doctor.name.split(' ')[1] || doctor.name}&apos;s doorstep travel perimeter.
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                          <div className="relative flex-1">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              value={pinCode}
                              onChange={(e) => {
                                setPinCode(e.target.value);
                                setPinStatus('Demo coverage estimate — availability requires confirmation');
                              }}
                              placeholder="e.g. 94107"
                              maxLength={6}
                              className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-10 pr-3 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                            />
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46] px-2 py-1 bg-[#ECFDF5] rounded-lg border border-[#D1FAE5]">
                            <Check className="h-3.5 w-3.5" />
                            <span>{pinStatus}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 1 Actions */}
                    <div className="flex items-center justify-end pt-4 border-t border-[#E2EBE7]">
                      <button
                        type="button"
                        onClick={handleNextFromStep1}
                        className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
                      >
                        <span>Continue to Patient Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 2: PATIENT DETAILS ================= */}
                {step === 2 && (
                  <div key="step-2" className="space-y-6 animate-step-transition">
                    <div>
                      <h2 className="font-heading text-lg sm:text-xl font-extrabold text-[#102820]">
                        Step 2: Patient Information &amp; Clinical Needs
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Help us prepare Dr. {doctor.name.split(' ')[1] || doctor.name} with accurate patient context.
                      </p>
                    </div>

                    {/* Authentication Status Banner */}
                    {currentUser ? (
                      <div className="flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] p-3 text-xs text-[#065F46]">
                        <ShieldCheck className="h-4 w-4 shrink-0 text-[#065F46]" />
                        <span>
                          Logged in as <strong>{currentUser.name}</strong>. Your profile details have been automatically filled.
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
                        <span>Booking as Guest Visitor. Have a Vellora patient account?</span>
                        <Link
                          href={`/patient/login?redirect=/book/doctor/${slug}`}
                          className="inline-flex items-center gap-1 font-bold text-[#064E3B] hover:underline"
                        >
                          <span>Sign In to auto-fill</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}

                    {/* Family member quick-selector if authenticated and FAMILY */}
                    {currentUser && recipient === 'FAMILY' && savedFamily.length > 0 && (
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
                                if (fam.gender) setPatientGender(fam.gender as any);
                              }}
                              className="rounded-lg bg-white border border-[#D1DCD6] px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#064E3B] hover:text-[#064E3B] transition-colors shadow-2xs"
                            >
                              {fam.fullName} ({fam.relationship})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Self vs Family Toggle */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Who is this consultation for?
                      </label>
                      <div className="grid grid-cols-2 gap-3 max-w-sm">
                        <button
                          type="button"
                          onClick={() => setRecipient('SELF')}
                          className={`rounded-xl border py-2.5 px-3 text-center text-xs font-bold transition-all ${
                            recipient === 'SELF'
                              ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] ring-1 ring-[#064E3B]'
                              : 'border-[#E2EBE7] bg-white text-slate-700 hover:bg-[#F2F8F5]'
                          }`}
                        >
                          Myself
                        </button>
                        <button
                          type="button"
                          onClick={() => setRecipient('FAMILY')}
                          className={`rounded-xl border py-2.5 px-3 text-center text-xs font-bold transition-all ${
                            recipient === 'FAMILY'
                              ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] ring-1 ring-[#064E3B]'
                              : 'border-[#E2EBE7] bg-white text-slate-700 hover:bg-[#F2F8F5]'
                          }`}
                        >
                          A Family Member
                        </button>
                      </div>

                      {recipient === 'FAMILY' && (
                        <div className="mt-3">
                          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                            Relationship to patient
                          </label>
                          <select
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            className="w-full sm:w-56 rounded-xl border border-[#CBDCD5] bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none"
                          >
                            <option value="Parent">Parent (Mother / Father)</option>
                            <option value="Spouse">Spouse / Partner</option>
                            <option value="Child">Child / Dependent</option>
                            <option value="Grandparent">Grandparent</option>
                            <option value="Other">Other Relative / Ward</option>
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Patient Name, Age, Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-6">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Patient Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="e.g. Arthur Pendelton"
                            className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-10 pr-3 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Age <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={120}
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          placeholder="e.g. 58"
                          className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Gender
                        </label>
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value as 'Female' | 'Male' | 'Other')}
                          className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other / Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    {/* Contact Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Contact Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="e.g. +1 (555) 234-5678"
                            className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-10 pr-3 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Used for arrival ETA updates and clinician verification code.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="email"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            placeholder="e.g. arthur@example.com"
                            className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-10 pr-3 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                          />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          For digital e-prescriptions and clinical summary receipts.
                        </p>
                      </div>
                    </div>

                    {/* Doorstep Address (Only if Home Visit) */}
                    {consultType === 'HOME_VISIT' && (
                      <div className="rounded-2xl border border-[#E2EBE7] bg-[#F5F9F7] p-4 sm:p-5 space-y-3.5">
                        <div className="flex items-center gap-1.5 font-heading text-xs font-extrabold text-[#102820]">
                          <Building className="h-4 w-4 text-[#065F46]" />
                          <span>Doorstep Visit Location</span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Street Address <span className="text-red-500">*</span>
                            </label>
                            {currentUser && savedAddresses.length > 0 && (
                              <span className="text-[11px] text-slate-500">Pick saved:</span>
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
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            placeholder="e.g. 742 Evergreen Terrace"
                            className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Apt / Suite / Unit
                            </label>
                            <input
                              type="text"
                              value={apartment}
                              onChange={(e) => setApartment(e.target.value)}
                              placeholder="e.g. Apt 4B (Gate Code #1234)"
                              className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 px-3 text-xs font-medium text-slate-800 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Area PIN
                            </label>
                            <input
                              type="text"
                              disabled
                              value={pinCode}
                              className="w-full rounded-xl border border-[#E2EBE7] bg-slate-100 py-2 px-3 text-xs font-medium text-slate-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Symptoms & Clinical Reason */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Reason for Consultation / Current Symptoms
                      </label>
                      <textarea
                        rows={3}
                        value={consultReason}
                        onChange={(e) => setConsultReason(e.target.value)}
                        placeholder="e.g. Follow-up consultation for hypertension, mild morning dizziness, request medication renewal..."
                        className="w-full rounded-xl border border-[#CBDCD5] bg-white p-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                      />
                    </div>

                    {/* Step 2 Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#E2EBE7]">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#CBDCD5] bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#F2F8F5] transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNextFromStep2}
                        className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
                      >
                        <span>Continue to Review</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ================= STEP 3: REVIEW & CONFIRMATION ================= */}
                {step === 3 && (
                  <form key="step-3" onSubmit={handleSubmitBooking} className="space-y-6 animate-step-transition">
                    <div>
                      <h2 className="font-heading text-lg sm:text-xl font-extrabold text-[#102820]">
                        Step 3: Review &amp; Request Consultation
                      </h2>
                      <p className="mt-1 text-xs text-slate-500">
                        Review your consultation details before submitting to our medical dispatch coordinator.
                      </p>
                    </div>

                    {/* Summary Card */}
                    <div className="rounded-2xl border border-[#E2EBE7] bg-[#F5F9F7] p-5 space-y-4">
                      {/* Doctor snippet */}
                      <div className="flex items-center gap-3.5 pb-4 border-b border-[#E2EBE7]">
                        <img
                          src={doctor.avatar || '/assets/doctor-maya-patel.webp'}
                          alt={doctor.name}
                          className="h-12 w-12 rounded-xl object-cover object-top border border-[#CBDCD5] bg-white shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading text-sm font-extrabold text-[#102820]">
                              {doctor.name}
                            </span>
                            <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                              {consultType === 'HOME_VISIT' ? 'Doorstep Visit' : 'Teleconsultation'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#065F46]">{doctor.specialty}</p>
                        </div>
                      </div>

                      {/* Key Facts Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 font-medium block">Patient:</span>
                          <span className="font-bold text-[#102820]">
                            {patientName} ({patientAge}y, {patientGender})
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 font-medium block">Contact Mobile:</span>
                          <span className="font-bold text-[#102820]">{contactPhone}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 font-medium block">Scheduled Date:</span>
                          <span className="font-bold text-[#102820]">{selectedDateStr}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 font-medium block">Arrival Window:</span>
                          <span className="font-bold text-[#102820]">{timeSlotLabels[timeSlot]}</span>
                        </div>

                        <div className="sm:col-span-2">
                          <span className="text-slate-400 font-medium block">
                            {consultType === 'HOME_VISIT' ? 'Visit Address:' : 'Meeting Link:'}
                          </span>
                          <span className="font-bold text-[#102820]">
                            {consultType === 'HOME_VISIT'
                              ? `${apartment ? `${apartment}, ` : ''}${streetAddress}, PIN ${pinCode}`
                              : 'Encrypted HD Video Room (link sent via SMS/Email)'}
                          </span>
                        </div>

                        {consultReason && (
                          <div className="sm:col-span-2 bg-white rounded-xl p-3 border border-[#E2EBE7]">
                            <span className="text-slate-400 font-medium block text-[11px]">
                              Symptoms / Clinical Context:
                            </span>
                            <span className="text-slate-700 italic text-xs mt-0.5 block">
                              &ldquo;{consultReason}&rdquo;
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="rounded-2xl border border-[#CBDCD5] bg-white p-4 sm:p-5">
                      <h3 className="font-heading text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
                        Estimated Fee Summary
                      </h3>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Doctor Consultation Fee ({consultType === 'HOME_VISIT' ? 'Home Visit' : 'Teleconsult'}):</span>
                          <span className="font-bold text-[#102820]">${consultFee}</span>
                        </div>

                        {consultType === 'HOME_VISIT' && (
                          <div className="flex justify-between text-slate-600">
                            <span>Bedside Clinical Kit &amp; Travel:</span>
                            <span className="font-bold text-[#102820]">${travelFee}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-xs font-bold text-[#065F46] pt-1">
                          <span>Verified Physician Discount:</span>
                          <span>Included</span>
                        </div>

                        <div className="flex justify-between border-t border-[#E2EBE7] pt-2 text-sm font-extrabold text-[#102820]">
                          <span>Total Estimated Fee:</span>
                          <span className="text-base text-[#064E3B]">${totalFee}</span>
                        </div>
                      </div>

                      <p className="mt-3 text-[11px] text-slate-400">
                        * No upfront card charge. Payment is fulfilled post-consultation bedside via cash, UPI, or card.
                      </p>
                    </div>

                    {/* Trust & Guarantee Banner */}
                    <div className="flex items-start gap-3 rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] p-4 text-xs text-[#065F46]">
                      <ShieldCheck className="h-5 w-5 shrink-0 stroke-[2.2] mt-0.5" />
                      <div>
                        <p className="font-bold text-[#064E3B]">
                          Demo Request Preview
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#065F46]/90 leading-relaxed">
                          Availability and arrival times require a live service. This demo does not dispatch clinicians.
                        </p>
                      </div>
                    </div>

                    {/* Consent Checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#064E3B] focus:ring-[#064E3B]"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I authorize Vellora Health to coordinate this clinical appointment with{' '}
                        <strong className="text-[#102820]">{doctor.name}</strong> and understand that medical information is treated strictly under patient confidentiality guidelines.
                      </span>
                    </label>

                    {/* Step 3 Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#E2EBE7]">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#CBDCD5] bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-[#F2F8F5] transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-full bg-[#064E3B] px-7 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Scheduling...</span>
                          </>
                        ) : (
                          <>
                            <span>Request Doctor Consultation</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-5 animate-card-slide-up animate-delay-2">
              <div className="rounded-[24px] border border-[#E2EBE7] bg-white p-5 sm:p-6 shadow-xs">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46] mb-3">
                  Consultation Overview
                </p>

                <div className="flex items-start gap-3 pb-4 border-b border-[#E2EBE7]">
                  <img
                    src={doctor.avatar || '/assets/doctor-maya-patel.webp'}
                    alt={doctor.name}
                    className="h-12 w-12 rounded-xl object-cover object-top border border-[#CBDCD5] bg-white shrink-0"
                  />
                  <div>
                    <h3 className="font-heading text-sm font-extrabold text-[#102820]">
                      {doctor.name}
                    </h3>
                    <p className="text-xs font-bold text-[#065F46]">{doctor.specialty}</p>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating}</span>
                      <span className="text-slate-400 font-normal">({doctor.experienceYears}y exp)</span>
                    </div>
                  </div>
                </div>

                <div className="py-4 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Mode:</span>
                    <span className="font-bold text-[#102820]">
                      {consultType === 'HOME_VISIT' ? 'Doorstep Home Visit' : 'Online Teleconsult'}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Scheduled Date:</span>
                    <span className="font-bold text-[#102820]">{selectedDateStr}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Time Window:</span>
                    <span className="font-bold text-[#102820] text-right">
                      {timeSlot === 'MORNING'
                        ? '09:00 AM – 12:00 PM'
                        : timeSlot === 'AFTERNOON'
                        ? '12:00 PM – 04:00 PM'
                        : '04:00 PM – 08:00 PM'}
                    </span>
                  </div>

                  <div className="flex justify-between border-t border-[#F2F8F5] pt-3">
                    <span className="text-slate-500 font-medium">Estimated Fee:</span>
                    <span className="font-heading font-extrabold text-[#064E3B] text-base">
                      ${totalFee}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#F5F9F7] border border-[#E2EBE7] p-3.5 text-[11px] text-slate-600 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#065F46]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Included with Every Visit:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-500">
                    <li>Certified physician checkup</li>
                    <li>Digital vitals &amp; telemetry review</li>
                    <li>Instant verifiable e-prescription</li>
                    <li>Complimentary 7-day chat follow-up</li>
                  </ul>
                </div>
              </div>

              {/* Need Immediate Assistance Box */}
              <div className="rounded-2xl border border-[#CBDCD5] bg-white p-5 text-xs text-center">
                <HeartPulse className="h-6 w-6 text-[#065F46] mx-auto mb-2" />
                <h4 className="font-heading font-extrabold text-[#102820]">
                  Need Clinical Assistance?
                </h4>
                <p className="text-slate-500 mt-1 text-[11px] leading-relaxed">
                  Call our 24/7 medical desk if you require urgent emergency consultation or triage.
                </p>
                <a
                  href="tel:18008355672"
                  className="mt-3 inline-flex items-center gap-1.5 font-bold text-[#064E3B] hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  <span>+1 (800) 835-5672</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
    </div>
  </div>
);
}
