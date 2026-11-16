'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { db, ServiceRecord } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  CreditCard,
  Building2,
  Wallet,
  Sparkles,
} from 'lucide-react';

interface ServiceBookingPageProps {
  params: Promise<{ slug: string }>;
}

type StepType =
  | 'details'      // Image 1: Enter Booking Details (Step 1)
  | 'schedule'     // Image 6: Choose Date & Time (Step 2)
  | 'review'       // Image 5: Review & Confirm (Step 3)
  | 'payment'      // Image 8: Payment (₹1,200)
  | 'confirmed'    // Image 7: Booking Confirmed!
  | 'details_view' // Image 4: Booking Details
  | 'reschedule'   // Image 3: Reschedule Booking
  | 'cancel';      // Image 2: Cancel Booking

const SCHEDULE_DAYS = [
  { dayName: 'Tue', dayNum: '20', fullDate: 'Tue, 20 May 2025' },
  { dayName: 'Wed', dayNum: '21', fullDate: 'Wed, 21 May 2025' },
  { dayName: 'Thu', dayNum: '22', fullDate: 'Thu, 22 May 2025' },
  { dayName: 'Fri', dayNum: '23', fullDate: 'Fri, 23 May 2025' },
  { dayName: 'Sat', dayNum: '24', fullDate: 'Sat, 24 May 2025' },
];

const SCHEDULE_TIMES = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];

const RESCHEDULE_TIMES = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

const CANCELLATION_REASONS = [
  'Change of plans',
  'Doctor not available at preferred time',
  'Patient feeling better / recovered',
  'Booked appointment by mistake',
  'Found alternative medical care',
  'Other personal reason',
];

export default function ServiceBookingPage({ params }: ServiceBookingPageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const { currentUser } = useAuth();

  const service = db.getServiceBySlug(slug) || db.getServiceById(slug);

  if (!service) {
    notFound();
  }

  // Active step
  const [currentStep, setCurrentStep] = useState<StepType>('details');

  // Step 1: Details (Image 1)
  const [fullName, setFullName] = useState(currentUser?.name || 'Arjun Mehta');
  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '+91 98765 43210');
  const [emailAddress, setEmailAddress] = useState(currentUser?.email || 'arjun.mehta@gmail.com');
  const [serviceAddress, setServiceAddress] = useState(
    'A-402, Green Valley Apartments, Bangalore - 560068'
  );

  // Step 2: Schedule (Image 6)
  const [selectedDayIndex, setSelectedDayIndex] = useState(1); // Wed 21
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('02:00 PM'); // 02:00 PM

  // Step 4: Payment (Image 8)
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'>('UPI');

  // Step 7: Reschedule (Image 3)
  const [rescheduleDay, setRescheduleDay] = useState(16); // 16 May 2025
  const [rescheduleTime, setRescheduleTime] = useState('03:00 PM'); // 03:00 PM

  // Step 8: Cancel (Image 2)
  const [cancelReason, setCancelReason] = useState('Select a reason');
  const [showCancelDropdown, setShowCancelDropdown] = useState(false);

  // Dynamic booking state
  const [bookingConfirmedDate, setBookingConfirmedDate] = useState('Wed, 21 May 2025');
  const [bookingConfirmedTime, setBookingConfirmedTime] = useState('02:00 PM');

  const selectedDateStr = SCHEDULE_DAYS[selectedDayIndex]?.fullDate || 'Wed, 21 May 2025';

  // Navigation handlers
  const handleBack = () => {
    switch (currentStep) {
      case 'details':
        router.back();
        break;
      case 'schedule':
        setCurrentStep('details');
        break;
      case 'review':
        setCurrentStep('schedule');
        break;
      case 'payment':
        setCurrentStep('review');
        break;
      case 'confirmed':
        router.push('/services/doctor-consultations');
        break;
      case 'details_view':
        router.push('/services/doctor-consultations');
        break;
      case 'reschedule':
        setCurrentStep('details_view');
        break;
      case 'cancel':
        setCurrentStep('details_view');
        break;
      default:
        router.push('/services/doctor-consultations');
    }
  };

  const handleStep1Continue = () => {
    if (!fullName.trim() || !phoneNumber.trim()) {
      alert('Please enter your full name and phone number.');
      return;
    }
    setCurrentStep('schedule');
  };

  const handleStep2Continue = () => {
    setBookingConfirmedDate(selectedDateStr);
    setBookingConfirmedTime(selectedTimeSlot);
    setCurrentStep('review');
  };

  const handleStep3ProceedToPayment = () => {
    setCurrentStep('payment');
  };

  const handleStep4Pay = () => {
    // Show Confirmation screen (Image 7)
    setCurrentStep('confirmed');
  };

  const handleViewMyBookings = () => {
    // Show Booking Details screen (Image 4)
    setCurrentStep('details_view');
  };

  const handleUpdateBooking = () => {
    const updatedDate = `${rescheduleDay} May 2025`;
    setBookingConfirmedDate(updatedDate);
    setBookingConfirmedTime(rescheduleTime);
    setCurrentStep('details_view');
  };

  const handleConfirmCancel = () => {
    alert('Your home visit doctor appointment has been cancelled successfully.');
    router.push('/services/doctor-consultations');
  };

  // Header Component (Matches all 8 images)
  const renderHeader = (isCloseIcon = false) => (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F3] bg-white sticky top-0 z-20">
      <button
        type="button"
        onClick={handleBack}
        className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#102820] hover:bg-[#F2F8F5] transition-colors"
        aria-label="Back"
      >
        {isCloseIcon ? <X className="w-5 h-5" /> : <ChevronLeft className="w-6 h-6" />}
      </button>

      <div className="flex items-center gap-2">
        <img
          src="/assets/logo-dark.png"
          alt="Velora Healthcare"
          className="h-7 w-auto object-contain select-none"
        />
      </div>

      <div className="w-8" />
    </div>
  );

  // 3-Step Stepper Header (Used in Step 1, 2, and 3)
  const renderProgressStepper = (activeStepNumber: 1 | 2 | 3) => {
    return (
      <div className="flex items-center justify-center px-4 pt-4 pb-6">
        {/* Step 1: Details */}
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              activeStepNumber >= 1
                ? 'bg-[#0F5B43] text-white shadow-xs'
                : 'bg-[#F1F5F3] text-slate-500 border border-[#E2EBE7]'
            }`}
          >
            {activeStepNumber > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
          </div>
          <span
            className={`mt-1.5 text-[11px] font-semibold ${
              activeStepNumber === 1 ? 'text-[#102820]' : 'text-slate-500'
            }`}
          >
            Details
          </span>
        </div>

        {/* Connector 1 -> 2 */}
        <div
          className={`flex-1 h-[2px] mx-3 mb-5 transition-colors ${
            activeStepNumber >= 2 ? 'bg-[#0F5B43]' : 'bg-[#E2EBE7]'
          }`}
        />

        {/* Step 2: Schedule */}
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              activeStepNumber >= 2
                ? 'bg-[#0F5B43] text-white shadow-xs'
                : 'bg-[#F1F5F3] text-slate-500 border border-[#E2EBE7]'
            }`}
          >
            {activeStepNumber > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
          </div>
          <span
            className={`mt-1.5 text-[11px] font-semibold ${
              activeStepNumber === 2 ? 'text-[#102820]' : 'text-slate-500'
            }`}
          >
            Schedule
          </span>
        </div>

        {/* Connector 2 -> 3 */}
        <div
          className={`flex-1 h-[2px] mx-3 mb-5 transition-colors ${
            activeStepNumber >= 3 ? 'bg-[#0F5B43]' : 'bg-[#E2EBE7]'
          }`}
        />

        {/* Step 3: Review */}
        <div className="flex flex-col items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              activeStepNumber === 3
                ? 'bg-[#0F5B43] text-white shadow-xs'
                : 'bg-[#F1F5F3] text-slate-500 border border-[#E2EBE7]'
            }`}
          >
            3
          </div>
          <span
            className={`mt-1.5 text-[11px] font-semibold ${
              activeStepNumber === 3 ? 'text-[#102820]' : 'text-slate-500'
            }`}
          >
            Review
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex justify-center py-0 sm:py-6 px-0 sm:px-4">
      {/* Mobile container centered on desktop */}
      <div className="w-full max-w-md bg-white sm:rounded-[32px] sm:shadow-2xl sm:border sm:border-[#E2EBE7] overflow-hidden flex flex-col min-h-screen sm:min-h-[820px] relative">
        {/* ========================================================================= */}
        {/* 1. STEP 1: ENTER BOOKING DETAILS (Image 1)                                */}
        {/* ========================================================================= */}
        {currentStep === 'details' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {renderHeader(false)}
              <div className="px-5 pt-1 pb-28">
                {renderProgressStepper(1)}

                <h1 className="text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight mb-5">
                  Enter Booking Details
                </h1>

                {/* Card 1: Full Name */}
                <div className="flex items-center gap-3.5 bg-white border border-[#E2EBE7] rounded-2xl p-4 mb-3.5 shadow-2xs hover:border-[#0F5B43]/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-[#102820] shrink-0">
                    <User className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-sm font-bold text-[#102820] bg-transparent outline-none focus:text-[#0F5B43]"
                      placeholder="Arjun Mehta"
                    />
                  </div>
                </div>

                {/* Card 2: Phone Number */}
                <div className="flex items-center gap-3.5 bg-white border border-[#E2EBE7] rounded-2xl p-4 mb-3.5 shadow-2xs hover:border-[#0F5B43]/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-[#102820] shrink-0">
                    <Phone className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full text-sm font-bold text-[#102820] bg-transparent outline-none focus:text-[#0F5B43]"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Card 3: Email Address */}
                <div className="flex items-center gap-3.5 bg-white border border-[#E2EBE7] rounded-2xl p-4 mb-3.5 shadow-2xs hover:border-[#0F5B43]/30 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-[#102820] shrink-0">
                    <Mail className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full text-sm font-bold text-[#102820] bg-transparent outline-none focus:text-[#0F5B43]"
                      placeholder="arjun.mehta@gmail.com"
                    />
                  </div>
                </div>

                {/* Card 4: Service Address */}
                <div className="flex items-center gap-3.5 bg-white border border-[#E2EBE7] rounded-2xl p-4 mb-3.5 shadow-2xs hover:border-[#0F5B43]/30 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-[#102820] shrink-0">
                    <MapPin className="w-5 h-5 text-slate-700" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                      Service Address
                    </label>
                    <input
                      type="text"
                      value={serviceAddress}
                      onChange={(e) => setServiceAddress(e.target.value)}
                      className="w-full text-sm font-bold text-[#102820] bg-transparent outline-none focus:text-[#0F5B43]"
                      placeholder="Enter full address"
                    />
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#0F5B43] transition-colors shrink-0" />
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Button */}
            <div className="p-5 border-t border-[#F1F5F3] bg-white sticky bottom-0 z-20">
              <button
                type="button"
                onClick={handleStep1Continue}
                className="w-full py-4 rounded-full bg-[#0F5B43] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#0c4a36] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Continue</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. STEP 2: CHOOSE DATE & TIME (Image 6)                                  */}
        {/* ========================================================================= */}
        {currentStep === 'schedule' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {renderHeader(false)}
              <div className="px-5 pt-1 pb-28">
                {renderProgressStepper(2)}

                <h1 className="text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight mb-6">
                  Choose Date &amp; Time
                </h1>

                {/* Section: Select Date */}
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="text-sm font-bold text-[#102820]">Select Date</h2>
                  <Calendar className="w-4 h-4 text-slate-500" />
                </div>

                {/* Horizontal Day Pills */}
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
                  {SCHEDULE_DAYS.map((day, idx) => {
                    const isSelected = selectedDayIndex === idx;
                    return (
                      <button
                        key={day.dayNum}
                        type="button"
                        onClick={() => setSelectedDayIndex(idx)}
                        className={`flex-1 min-w-[58px] py-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#0F5B43] text-white border-[#0F5B43] shadow-sm'
                            : 'bg-white text-[#102820] border-[#E2EBE7] hover:border-slate-300'
                        }`}
                      >
                        <span className={`text-[11px] font-medium ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                          {day.dayName}
                        </span>
                        <span className="text-base font-extrabold mt-0.5">{day.dayNum}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Section: Select Time */}
                <div className="mt-7 mb-3.5">
                  <h2 className="text-sm font-bold text-[#102820]">Select Time</h2>
                </div>

                {/* Time Slots Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {SCHEDULE_TIMES.map((time) => {
                    const isSelected = selectedTimeSlot === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTimeSlot(time)}
                        className={`py-3 px-4 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F5B43] text-white border-[#0F5B43] shadow-xs'
                            : 'bg-white text-[#102820] border-[#E2EBE7] hover:border-slate-300'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Button */}
            <div className="p-5 border-t border-[#F1F5F3] bg-white sticky bottom-0 z-20">
              <button
                type="button"
                onClick={handleStep2Continue}
                className="w-full py-4 rounded-full bg-[#0F5B43] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#0c4a36] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Continue</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. STEP 3: REVIEW & CONFIRM (Image 5)                                     */}
        {/* ========================================================================= */}
        {currentStep === 'review' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {renderHeader(false)}
              <div className="px-5 pt-1 pb-28">
                {renderProgressStepper(3)}

                <h1 className="text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight mb-5">
                  Review &amp; Confirm
                </h1>

                {/* Summary Card with Image */}
                <div className="bg-white border border-[#E2EBE7] rounded-[22px] overflow-hidden shadow-xs">
                  <div className="h-44 w-full relative bg-slate-100">
                    <img
                      src={service.image || '/assets/chatgpt-card-1.webp'}
                      alt="Doctor Consultation"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  <div className="p-5 space-y-3.5">
                    <h2 className="text-base font-extrabold text-[#102820]">
                      Home Visit Doctor Consultation
                    </h2>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <Calendar className="w-4 h-4 text-[#0F5B43] shrink-0" />
                      <span>
                        Date: <strong className="text-[#102820] font-bold">{bookingConfirmedDate}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <Clock className="w-4 h-4 text-[#0F5B43] shrink-0" />
                      <span>
                        Time: <strong className="text-[#102820] font-bold">{bookingConfirmedTime}</strong>
                      </span>
                    </div>

                    <div className="flex items-start gap-3 text-xs text-slate-600">
                      <MapPin className="w-4 h-4 text-[#0F5B43] shrink-0 mt-0.5" />
                      <span>
                        Address: <strong className="text-[#102820] font-bold">{serviceAddress}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Button */}
            <div className="p-5 border-t border-[#F1F5F3] bg-white sticky bottom-0 z-20">
              <button
                type="button"
                onClick={handleStep3ProceedToPayment}
                className="w-full py-4 rounded-full bg-[#0F5B43] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#0c4a36] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Proceed to Payment</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 4. PAYMENT SCREEN (Image 8)                                              */}
        {/* ========================================================================= */}
        {currentStep === 'payment' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {renderHeader(false)}
              <div className="px-5 pt-3 pb-28">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight">
                  Payment
                </h1>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Complete your booking by making a secure payment.
                </p>

                {/* Amount Mint Card */}
                <div className="bg-[#EAF5EE] rounded-2xl p-4 flex items-center justify-between mb-5 border border-[#D5EADF]">
                  <span className="text-xs font-bold text-[#0F5B43]">Booking Amount</span>
                  <span className="text-xl font-black text-[#0F5B43]">₹1,200</span>
                </div>

                {/* Payment Options List */}
                <div className="space-y-3">
                  {/* Option 1: UPI */}
                  <label
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-[#0F5B43] bg-[#F7FCF9] shadow-2xs'
                        : 'border-[#E2EBE7] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#0F5B43] flex items-center justify-center">
                        {paymentMethod === 'UPI' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0F5B43]" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#102820]">UPI</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] font-extrabold text-[#0F5B43] bg-[#EAF5EE] px-1.5 py-0.5 rounded">
                            GPay
                          </span>
                          <span className="text-[10px] font-extrabold text-[#0F5B43] bg-[#EAF5EE] px-1.5 py-0.5 rounded">
                            PhonePe
                          </span>
                          <span className="text-[10px] font-extrabold text-[#0F5B43] bg-[#EAF5EE] px-1.5 py-0.5 rounded">
                            Paytm
                          </span>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Debit / Credit Card */}
                  <label
                    onClick={() => setPaymentMethod('CARD')}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-[#0F5B43] bg-[#F7FCF9] shadow-2xs'
                        : 'border-[#E2EBE7] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#0F5B43] flex items-center justify-center">
                        {paymentMethod === 'CARD' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0F5B43]" />
                        )}
                      </div>
                      <CreditCard className="w-5 h-5 text-slate-700 ml-1" />
                      <span className="text-sm font-bold text-[#102820]">Debit / Credit Card</span>
                    </div>
                  </label>

                  {/* Option 3: Net Banking */}
                  <label
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-[#0F5B43] bg-[#F7FCF9] shadow-2xs'
                        : 'border-[#E2EBE7] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#0F5B43] flex items-center justify-center">
                        {paymentMethod === 'NETBANKING' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0F5B43]" />
                        )}
                      </div>
                      <Building2 className="w-5 h-5 text-slate-700 ml-1" />
                      <span className="text-sm font-bold text-[#102820]">Net Banking</span>
                    </div>
                  </label>

                  {/* Option 4: Wallet */}
                  <label
                    onClick={() => setPaymentMethod('WALLET')}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'WALLET'
                        ? 'border-[#0F5B43] bg-[#F7FCF9] shadow-2xs'
                        : 'border-[#E2EBE7] bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-[#0F5B43] flex items-center justify-center">
                        {paymentMethod === 'WALLET' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#0F5B43]" />
                        )}
                      </div>
                      <Wallet className="w-5 h-5 text-slate-700 ml-1" />
                      <span className="text-sm font-bold text-[#102820]">Wallet</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Button */}
            <div className="p-5 border-t border-[#F1F5F3] bg-white sticky bottom-0 z-20">
              <button
                type="button"
                onClick={handleStep4Pay}
                className="w-full py-4 rounded-full bg-[#0F5B43] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#0c4a36] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Pay ₹1,200</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 5. BOOKING CONFIRMED! SCREEN (Image 7)                                    */}
        {/* ========================================================================= */}
        {currentStep === 'confirmed' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {renderHeader(true)}
              <div className="px-5 pt-6 pb-28 text-center flex flex-col items-center">
                {/* Checkmark with celebratory confetti particles */}
                <div className="relative w-24 h-24 flex items-center justify-center mb-5">
                  <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <div className="absolute top-2 right-3 w-2.5 h-2.5 rounded-xs bg-amber-400 rotate-45" />
                  <div className="absolute bottom-2 left-3 w-2 h-2 rounded-full bg-blue-400" />
                  <div className="absolute bottom-1 right-2 w-2.5 h-2.5 rounded-xs bg-pink-400 rotate-12" />
                  <div className="absolute -left-1 top-10 w-2 h-2 rounded-full bg-teal-400" />
                  <div className="absolute -right-2 top-9 w-2 h-2 rounded-full bg-emerald-500" />

                  <div className="w-20 h-20 rounded-full bg-[#0F5B43] text-white flex items-center justify-center shadow-lg shadow-[#0F5B43]/20">
                    <Check className="w-10 h-10 stroke-[3]" />
                  </div>
                </div>

                <h1 className="text-2xl font-black text-[#102820] tracking-tight">
                  Booking Confirmed!
                </h1>
                <p className="text-xs text-slate-500 mt-1.5 max-w-[270px] leading-relaxed">
                  Your home visit doctor consultation has been successfully booked.
                </p>

                {/* Details Card */}
                <div className="w-full bg-white border border-[#E2EBE7] rounded-2xl p-4 mt-6 text-left shadow-2xs space-y-3">
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Date
                    </span>
                    <span className="text-sm font-bold text-[#102820]">
                      {bookingConfirmedDate}
                    </span>
                  </div>
                  <div className="h-[1px] bg-[#F1F5F3]" />
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Time
                    </span>
                    <span className="text-sm font-bold text-[#102820]">
                      {bookingConfirmedTime}
                    </span>
                  </div>
                  <div className="h-[1px] bg-[#F1F5F3]" />
                  <div>
                    <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Address
                    </span>
                    <span className="text-sm font-bold text-[#102820]">
                      {serviceAddress}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions: View My Bookings + Book Another Service */}
            <div className="p-5 border-t border-[#F1F5F3] bg-white sticky bottom-0 z-20 space-y-2.5">
              <button
                type="button"
                onClick={handleViewMyBookings}
                className="w-full py-4 rounded-full bg-[#0F5B43] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#0c4a36] transition-all flex items-center justify-center cursor-pointer active:scale-[0.99]"
              >
                View My Bookings
              </button>

              <button
                type="button"
                onClick={() => router.push('/services/doctor-consultations')}
                className="w-full py-2.5 text-center text-xs font-bold text-[#0F5B43] hover:underline cursor-pointer"
              >
                Book Another Service
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 6. BOOKING DETAILS SCREEN (Image 4)                                       */}
        {/* ========================================================================= */}
        {currentStep === 'details_view' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {renderHeader(false)}
              <div className="px-5 pt-3 pb-28">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight mb-5">
                  Booking Details
                </h1>

                {/* Appointment Card */}
                <div className="bg-white border border-[#E2EBE7] rounded-[22px] p-5 shadow-2xs space-y-4 mb-6">
                  {/* Doctor Info Header */}
                  <div className="flex items-center gap-3.5 pb-4 border-b border-[#F1F5F3]">
                    <img
                      src="/assets/doctor-1.webp"
                      alt="Dr. Arjun Mehta"
                      className="w-13 h-13 rounded-full object-cover border border-[#E2EBE7] bg-slate-100"
                    />
                    <div className="flex-1">
                      <h2 className="text-sm font-extrabold text-[#102820]">
                        Home Visit Consultation
                      </h2>
                      <span className="inline-block mt-1 bg-[#EAF6ED] text-[#059669] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        Confirmed
                      </span>
                    </div>
                  </div>

                  {/* Rows */}
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <Calendar className="w-4 h-4 text-[#0F5B43] shrink-0" />
                    <div className="flex-1">
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Date</span>
                      <strong className="text-xs font-bold text-[#102820]">{bookingConfirmedDate}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <Clock className="w-4 h-4 text-[#0F5B43] shrink-0" />
                    <div className="flex-1">
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Time</span>
                      <strong className="text-xs font-bold text-[#102820]">{bookingConfirmedTime}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-[#0F5B43] shrink-0" />
                    <div className="flex-1">
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Address</span>
                      <strong className="text-xs font-bold text-[#102820]">{serviceAddress}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <User className="w-4 h-4 text-[#0F5B43] shrink-0" />
                    <div className="flex-1">
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase">Doctor</span>
                      <strong className="text-xs font-bold text-[#102820]">Dr. Arjun Mehta</strong>
                    </div>
                  </div>
                </div>

                {/* Actions: Reschedule & Cancel */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('reschedule')}
                    className="w-full py-4 rounded-full bg-[#EAF5EE] text-[#0F5B43] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#dbeee1] transition-colors cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Reschedule</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep('cancel')}
                    className="w-full py-4 rounded-full bg-[#FEE2E2] text-[#DC2626] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#fcd3d3] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 7. RESCHEDULE BOOKING SCREEN (Image 3)                                    */}
        {/* ========================================================================= */}
        {currentStep === 'reschedule' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {renderHeader(false)}
              <div className="px-5 pt-3 pb-28">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight">
                  Reschedule Booking
                </h1>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Choose a new date and time for your appointment.
                </p>

                {/* Calendar Picker Card */}
                <div className="bg-white border border-[#E2EBE7] rounded-2xl p-4 shadow-2xs mb-6">
                  <div className="flex items-center justify-between pb-3 px-2 border-b border-[#F1F5F3] mb-3">
                    <button type="button" className="p-1 text-slate-500 hover:text-black">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-extrabold text-[#102820]">May 2025</span>
                    <button type="button" className="p-1 text-slate-500 hover:text-black">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((w) => (
                      <span key={w}>{w}</span>
                    ))}
                  </div>

                  {/* Days grid 1 to 31 with 3 offset cells */}
                  <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs">
                    <div />
                    <div />
                    <div />
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                      const isSelected = rescheduleDay === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setRescheduleDay(d)}
                          className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#0F5B43] text-white font-extrabold shadow-2xs'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Time Slots */}
                <h2 className="text-xs font-bold text-[#102820] uppercase tracking-wider mb-3">
                  Available Time Slots
                </h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {RESCHEDULE_TIMES.map((time) => {
                    const isSelected = rescheduleTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setRescheduleTime(time)}
                        className={`py-3 px-4 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F5B43] text-white border-[#0F5B43] shadow-xs'
                            : 'bg-white text-[#102820] border-[#E2EBE7] hover:border-slate-300'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Sticky Action Button */}
            <div className="p-5 border-t border-[#F1F5F3] bg-white sticky bottom-0 z-20">
              <button
                type="button"
                onClick={handleUpdateBooking}
                className="w-full py-4 rounded-full bg-[#0F5B43] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#0c4a36] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>Update Booking</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 8. CANCEL BOOKING SCREEN (Image 2)                                        */}
        {/* ========================================================================= */}
        {currentStep === 'cancel' && (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {renderHeader(false)}
              <div className="px-5 pt-3 pb-28">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight">
                  Cancel Booking
                </h1>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Are you sure you want to cancel this appointment?
                </p>

                {/* Appointment Card */}
                <div className="bg-white border border-[#E2EBE7] rounded-2xl p-4 shadow-2xs mb-5">
                  <h2 className="text-sm font-extrabold text-[#102820]">
                    Home Visit Doctor Consultation
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {bookingConfirmedDate} • {bookingConfirmedTime}
                  </p>
                </div>

                {/* Reason Dropdown */}
                <label className="block text-xs font-bold text-[#102820] mb-2">
                  Reason for cancellation (optional)
                </label>
                <div className="relative mb-6">
                  <button
                    type="button"
                    onClick={() => setShowCancelDropdown(!showCancelDropdown)}
                    className="w-full p-4 rounded-2xl border border-[#E2EBE7] bg-white flex items-center justify-between text-xs font-semibold text-[#102820] hover:border-slate-300 transition-colors text-left"
                  >
                    <span className={cancelReason === 'Select a reason' ? 'text-slate-400' : 'text-[#102820]'}>
                      {cancelReason}
                    </span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {showCancelDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2EBE7] rounded-xl shadow-lg z-30 py-1.5">
                      {CANCELLATION_REASONS.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => {
                            setCancelReason(reason);
                            setShowCancelDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-[#F2F8F5] hover:text-[#0F5B43] flex items-center justify-between"
                        >
                          <span>{reason}</span>
                          {cancelReason === reason && <Check className="w-3.5 h-3.5 text-[#0F5B43]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions: Cancel & Keep */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    className="w-full py-4 rounded-full bg-[#DC2626] text-white font-bold text-sm tracking-wide shadow-md hover:bg-[#b91c1c] transition-all flex items-center justify-center cursor-pointer"
                  >
                    Cancel Booking
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep('details_view')}
                    className="w-full py-4 rounded-full bg-white text-[#0F5B43] border-2 border-[#0F5B43] font-bold text-sm tracking-wide hover:bg-[#F2F8F5] transition-all flex items-center justify-center cursor-pointer"
                  >
                    Keep Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
