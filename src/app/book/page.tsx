'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { db, ServiceRecord } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { ScrollAnimationProvider } from '@/components/common/ScrollAnimationProvider';

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const services = db.getServices();
  const initialServiceSlug = searchParams.get('service') || 'home-doctor-visit';
  const initialDoctorName = searchParams.get('doctor') || '';

  // Multi-step State
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Service & Shift
  const [selectedService, setSelectedService] = useState<ServiceRecord>(
    services.find((s) => s.slug === initialServiceSlug) || services[0]
  );
  const [shiftType, setShiftType] = useState<'SINGLE_VISIT' | 'SHIFT_12H' | 'SHIFT_24H'>('SINGLE_VISIT');

  // Step 2: Patient Info
  const [beneficiaryRelation, setBeneficiaryRelation] = useState<string>('Self');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientAge, setPatientAge] = useState<string>('');
  const [patientGender, setPatientGender] = useState<string>('Female');

  // Step 3: Address & Schedule
  const [streetAddress, setStreetAddress] = useState<string>('742 Evergreen Terrace, Apt 4B');
  const [city, setCity] = useState<string>('San Francisco');
  const [postalCode, setPostalCode] = useState<string>('94107');
  const [landmark, setLandmark] = useState<string>('Building intercom #402, 4th floor with elevator');
  const [appointmentDate, setAppointmentDate] = useState<string>('2026-11-16');
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM - 12:00 PM');

  // Step 4: Medical notes & preferences
  const [symptoms, setSymptoms] = useState<string>('');
  const [medicalHistory, setMedicalHistory] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>(initialDoctorName || 'Next Available Certified Specialist');
  const [genderPreference, setGenderPreference] = useState<string>('NO_PREFERENCE');

  // Step 5: Pricing, Promo & Security PIN
  const [promoCode, setPromoCode] = useState<string>('');
  const [discount, setDiscount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');
  const [generatedPin, setGeneratedPin] = useState<string>('4829');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any>(null);

  useEffect(() => {
    setGeneratedPin(Math.floor(1000 + Math.random() * 9000).toString());
  }, []);

  useEffect(() => {
    if (initialDoctorName) {
      setSelectedDoctor(initialDoctorName);
    }
  }, [initialDoctorName]);

  // Pricing calculation
  let basePrice = selectedService.basePrice;
  if (shiftType === 'SHIFT_12H') basePrice = selectedService.basePrice * 3;
  if (shiftType === 'SHIFT_24H') basePrice = selectedService.basePrice * 5;

  const hygieneKitFee = 10;
  const platformFee = 5;
  const subtotal = basePrice + hygieneKitFee + platformFee;
  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'VELLORA10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setPromoMessage('10% discount applied successfully!');
    } else if (promoCode.trim().toUpperCase() === 'CARE50') {
      setDiscount(50);
      setPromoMessage('$50 care voucher applied!');
    } else {
      setPromoMessage('Invalid promo code. Use "VELLORA10" for 10% off.');
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullAddress = `${streetAddress}, ${city}, CA ${postalCode} (${landmark})`;

    setTimeout(() => {
      const newBooking = db.createBooking({
        patientId: 'pat-guest',
        patientName: patientName || 'Eleanor Vance',
        patientPhone: patientPhone || '+1 (555) 234-5678',
        beneficiaryName: patientName || 'Eleanor Vance',
        beneficiaryRelation: beneficiaryRelation,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category: selectedService.category as any,
        providerId: 'doc-1',
        providerName: selectedDoctor.includes('Dr.') ? selectedDoctor : 'Dr. Maya Patel',
        providerRole: 'DOCTOR',
        addressText: fullAddress,
        scheduledDate: appointmentDate,
        scheduledTimeSlot: timeSlot,
        shiftType: shiftType as any,
        clinicalNotes: `Symptoms: ${symptoms || 'General routine consultation'}. History: ${medicalHistory || 'None reported'}. Access notes: ${landmark}`,
        status: 'CONFIRMED',
        totalAmount: finalTotal,
        paymentStatus: 'PAID',
        verificationPin: generatedPin,
      });

      setBookingConfirmed(newBooking);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const timeSlots = [
    '08:00 AM - 10:00 AM (Morning)',
    '10:00 AM - 12:00 PM (Late Morning)',
    '12:00 PM - 02:00 PM (Afternoon)',
    '02:00 PM - 04:00 PM (Mid-Afternoon)',
    '04:00 PM - 06:00 PM (Evening)',
    '06:00 PM - 08:00 PM (Late Evening)',
    '08:00 PM - 08:00 AM (12h Night Shift)',
  ];

  return (
    <div className="min-h-screen bg-[#fcfdfd]">
      {/* Header Banner */}
      <div className="bg-[#11191b] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#116b70_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
        <Header />
        <div className="container py-12 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-semibold text-teal-300 border border-teal-500/30 mb-3 animate-hero-trust">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            INSTANT DOORSTEP CLINICAL RESERVATION
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl text-white max-w-3xl mx-auto animate-hero-title">
            Book an Appointment
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-xs md:text-sm text-gray-300 animate-hero-detail">
            Schedule a council-registered doctor, licensed nurse, bedside caretaker, or home blood test in under 2 minutes.
          </p>

          {/* Step Progress Indicator (Hidden on Success) */}
          {!bookingConfirmed && (
            <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4 max-w-2xl mx-auto">
              {[
                { num: 1, label: 'Service' },
                { num: 2, label: 'Patient' },
                { num: 3, label: 'Schedule & Address' },
                { num: 4, label: 'Clinical Notes' },
                { num: 5, label: 'Confirm' },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      currentStep === s.num
                        ? 'bg-teal-400 text-[#11191b] ring-4 ring-teal-400/30'
                        : currentStep > s.num
                        ? 'bg-teal-800 text-teal-200 cursor-pointer'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {currentStep > s.num ? '✓' : s.num}
                  </button>
                  <span
                    className={`hidden sm:inline text-xs font-medium ${
                      currentStep === s.num ? 'text-white font-bold' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  {s.num < 5 && <div className="h-0.5 w-4 sm:w-8 bg-white/20" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Flow Container */}
      <div className="container py-12 max-w-4xl">
        {bookingConfirmed ? (
          /* Confirmation Success Screen */
          <div className="rounded-3xl border border-teal-200 bg-white p-8 md:p-12 shadow-xl text-center scroll-reveal-scale">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-800 border border-emerald-200">
              BOOKING CONFIRMED &amp; DISPATCH QUEUED
            </span>

            <h2 className="mt-3 text-2xl md:text-4xl font-extrabold text-gray-900">
              Your Home Care Visit is Scheduled!
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
              Our clinical care coordination team has received your request. A council-verified clinician has been notified and scheduled for your doorstep visit.
            </p>

            {/* Essential Booking Details Card */}
            <div className="mt-8 rounded-2xl bg-gray-50 border border-gray-200 p-6 text-left max-w-xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <span className="text-[11px] text-gray-500 uppercase font-bold">Booking Reference</span>
                  <p className="text-base font-extrabold text-teal-800">{bookingConfirmed.bookingNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-500 uppercase font-bold">Total Demo Fee</span>
                  <p className="text-base font-extrabold text-gray-900">${bookingConfirmed.totalAmount}</p>
                </div>
              </div>

              {/* Security PIN Display */}
              <div className="rounded-xl bg-teal-900 p-4 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                    Bedside Security PIN
                  </span>
                  <p className="text-2xl font-extrabold tracking-widest text-white mt-0.5">
                    {bookingConfirmed.verificationPin}
                  </p>
                  <p className="text-[11px] text-gray-300 mt-0.5">
                    Ask your clinician for this 4-digit PIN before unlocking bedside examination.
                  </p>
                </div>
                <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-teal-800 text-teal-300">
                  <Icon name="shield" size="md" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-gray-400 font-medium">Service</span>
                  <p className="font-bold text-gray-800">{bookingConfirmed.serviceName}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Assigned Clinician</span>
                  <p className="font-bold text-gray-800">{bookingConfirmed.providerName}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Date &amp; Slot</span>
                  <p className="font-bold text-gray-800">{bookingConfirmed.scheduledDate} ({bookingConfirmed.scheduledTimeSlot})</p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Patient</span>
                  <p className="font-bold text-gray-800">{bookingConfirmed.beneficiaryName} ({bookingConfirmed.beneficiaryRelation})</p>
                </div>
              </div>

              <div className="text-xs pt-1 border-t border-gray-200">
                <span className="text-gray-400 font-medium">Home Location</span>
                <p className="font-medium text-gray-800">{bookingConfirmed.addressText}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/patient/dashboard" className="button button-dark">
                <span>View in Patient Portal</span>
                <Icon name="arrow-right" size="xs" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setBookingConfirmed(null);
                  setCurrentStep(1);
                }}
                className="button button-outline"
              >
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Wizard */
          <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-10 shadow-lg">
            {/* STEP 1: Select Service & Shift Type */}
            {currentStep === 1 && (
              <div className="space-y-6 scroll-reveal">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 1 of 5</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">Select Healthcare Service</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose the medical care required for your doorstep appointment.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((srv) => {
                    const isSelected = selectedService.id === srv.id;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20 shadow-md'
                            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-bold uppercase text-teal-800 bg-teal-100/60 px-2 py-0.5 rounded-full">
                            {srv.categoryLabel}
                          </span>
                          <span className="text-sm font-extrabold text-gray-900">${srv.basePrice}</span>
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mt-2">{srv.name}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{srv.shortDesc}</p>
                        <p className="text-[11px] font-medium text-teal-700 mt-2">⏱ {srv.duration}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Shift Type Duration */}
                <div className="border-t border-gray-100 pt-5">
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    Shift Duration &amp; Attendance Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'SINGLE_VISIT', label: 'Standard Single Visit', note: '45-60 min bedside care' },
                      { id: 'SHIFT_12H', label: '12-Hour Day/Night Shift', note: 'Continuous nursing/caretaker' },
                      { id: 'SHIFT_24H', label: '24-Hour Continuous Shift', note: 'Full-day dedicated care' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setShiftType(st.id as any)}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          shiftType === st.id
                            ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-xs font-bold">{st.label}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{st.note}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="button button-dark"
                  >
                    <span>Continue to Patient Details</span>
                    <Icon name="arrow-right" size="xs" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Patient & Contact Details */}
            {currentStep === 2 && (
              <div className="space-y-6 scroll-reveal">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 2 of 5</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">Patient &amp; Contact Details</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Tell us who will be receiving clinical care.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">Who is this care for?</label>
                  <div className="flex flex-wrap gap-2">
                    {['Self', 'Parent', 'Spouse', 'Child', 'Other Family Member'].map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setBeneficiaryRelation(rel)}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                          beneficiaryRelation === rel
                            ? 'bg-[#11191b] text-white'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Patient Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Harold Vance"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Primary Contact Phone <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 234-5678"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="patient@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Age</label>
                      <input
                        type="number"
                        placeholder="72"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Gender</label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="button button-outline button-sm text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="button button-dark button-sm text-xs"
                  >
                    <span>Schedule &amp; Address</span>
                    <Icon name="arrow-right" size="xs" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Address & Schedule */}
            {currentStep === 3 && (
              <div className="space-y-6 scroll-reveal">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 3 of 5</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">Schedule &amp; Home Address</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Where and when should our verified clinician arrive?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Time Window</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                    >
                      {timeSlots.map((ts) => (
                        <option key={ts} value={ts}>{ts}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 border-t border-gray-100 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">Home Address</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Street Address, Apt / Unit</label>
                    <input
                      type="text"
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Landmark &amp; Doorstep Access Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Intercom code, elevator floor, parking landmark"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="button button-outline button-sm text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="button button-dark button-sm text-xs"
                  >
                    <span>Clinical Notes</span>
                    <Icon name="arrow-right" size="xs" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Symptoms, History & Clinician Preferences */}
            {currentStep === 4 && (
              <div className="space-y-6 scroll-reveal">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 4 of 5</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">Clinical Reason &amp; Clinician</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Help our medical team prepare specialized single-use kits and review requirements.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Primary Symptoms or Medical Procedure Needed
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Persistent fever and cough for 3 days, post-surgical knee dressing change, routine geriatric vitals review..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Existing Medical Conditions or Known Drug Allergies (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Type 2 Diabetes, Allergic to Penicillin"
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Clinician Assignment</label>
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                    >
                      <option value="Next Available Certified Specialist">Next Available Certified Specialist (Fastest)</option>
                      <option value="Dr. Maya Patel">Dr. Maya Patel (Internal Medicine &amp; Geriatrics)</option>
                      <option value="Dr. Ethan Park">Dr. Ethan Park (Pediatrics &amp; Family Care)</option>
                      <option value="Dr. Daniel Reed">Dr. Daniel Reed (Cardiology &amp; Chronic Care)</option>
                      <option value="Dr. Sofia Morgan">Dr. Sofia Morgan (Post-Op Rehabilitation)</option>
                      <option value="Dr. Marcus Vance">Dr. Marcus Vance (Acute Illness &amp; Emergency)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Gender Preference</label>
                    <select
                      value={genderPreference}
                      onChange={(e) => setGenderPreference(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                    >
                      <option value="NO_PREFERENCE">No Preference</option>
                      <option value="FEMALE_CLINICIAN">Female Clinician Preferred</option>
                      <option value="MALE_CLINICIAN">Male Clinician Preferred</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="button button-outline button-sm text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="button button-dark button-sm text-xs"
                  >
                    <span>Review &amp; Confirm</span>
                    <Icon name="arrow-right" size="xs" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Summary, Security PIN, Promo & Confirm */}
            {currentStep === 5 && (
              <form onSubmit={handleFinalSubmit} className="space-y-6 scroll-reveal">
                <div>
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Step 5 of 5</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">Review &amp; Confirm Booking</h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Review your appointment details and bedside verification PIN before confirming.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{selectedService.name}</p>
                      <p className="text-xs text-teal-700">{shiftType.replace('_', ' ')} • {timeSlot}</p>
                    </div>
                    <span className="text-base font-extrabold text-gray-900">${basePrice}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div>
                      <span className="text-gray-400 font-medium">Patient:</span>
                      <p className="font-semibold text-gray-800">{patientName || 'Eleanor Vance'} ({beneficiaryRelation})</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Date:</span>
                      <p className="font-semibold text-gray-800">{appointmentDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Assigned Clinician:</span>
                      <p className="font-semibold text-gray-800">{selectedDoctor}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Contact:</span>
                      <p className="font-semibold text-gray-800">{patientPhone || '+1 (555) 234-5678'}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600 border-t border-gray-200 pt-2">
                    <span className="text-gray-400 font-medium">Address:</span>
                    <p className="font-medium text-gray-800">{streetAddress}, {city}, CA {postalCode}</p>
                  </div>
                </div>

                {/* Bedside PIN Notice */}
                <div className="rounded-xl bg-teal-50 border border-teal-200 p-4 flex items-center gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white font-bold">
                    <Icon name="shield" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-teal-950">Pre-Generated Bedside Verification PIN: {generatedPin}</p>
                    <p className="text-[11px] text-teal-800 leading-relaxed mt-0.5">
                      For your safety, the arriving clinician will verify this security code with you before entering your home.
                    </p>
                  </div>
                </div>

                {/* Promo Code & Fee Calculation */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. VELLORA10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-xs focus:border-teal-500 focus:outline-none uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p className={`text-xs font-medium ${discount > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {promoMessage}
                    </p>
                  )}

                  <div className="space-y-1.5 text-xs text-gray-600 pt-2">
                    <div className="flex justify-between">
                      <span>Clinical Service Base Rate</span>
                      <span>${basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sterile Single-Use Consumables &amp; PPE Kit</span>
                      <span>${hygieneKitFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Dispatch &amp; Cold-Chain Telemetry</span>
                      <span>${platformFee}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Voucher Discount</span>
                        <span>-${discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-200 pt-2">
                      <span>Total Demo Fee</span>
                      <span>${finalTotal}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="button button-outline button-sm text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button button-dark"
                  >
                    {isSubmitting ? (
                      <span>Scheduling Clinician...</span>
                    ) : (
                      <>
                        <span>Confirm Appointment (${finalTotal})</span>
                        <Icon name="arrow-right" size="xs" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <ScrollAnimationProvider>
      <Suspense fallback={<div className="min-h-screen bg-[#11191b] flex items-center justify-center text-white">Loading booking experience...</div>}>
        <BookAppointmentContent />
      </Suspense>
    </ScrollAnimationProvider>
  );
}
