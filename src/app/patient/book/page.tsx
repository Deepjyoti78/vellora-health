'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, ServiceRecord } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Icon } from '@/components/common/Icon';

export default function PatientBookPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const services = db.getServices();
  const userId = currentUser?.id || '';
  const familyMembers = db.getFamilyMembers(userId);
  const savedAddresses = db.getAddresses(userId);

  // Flow State
  const [step, setStep] = useState<number>(1);
  const [selectedService, setSelectedService] = useState<ServiceRecord>(services[0]);
  const [shiftType, setShiftType] = useState<'STANDARD_VISIT' | 'SHIFT_12H' | 'SHIFT_24H'>('STANDARD_VISIT');
  const [beneficiaryType, setBeneficiaryType] = useState<'SELF' | 'FAMILY' | 'NEW'>('SELF');
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>(familyMembers[0]?.id || '');
  const [newFamilyName, setNewFamilyName] = useState<string>('');
  const [newFamilyRelation, setNewFamilyRelation] = useState<string>('Parent');

  const [selectedAddressId, setSelectedAddressId] = useState<string>(savedAddresses[0]?.id || '');
  const [newStreet, setNewStreet] = useState<string>('');
  const [newCity, setNewCity] = useState<string>('San Francisco');
  const [newZip, setNewZip] = useState<string>('94107');

  const [scheduledDate, setScheduledDate] = useState<string>('2026-11-18');
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM - 11:00 AM');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');

  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'INSURANCE' | 'CASH'>('CARD');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Calculate pricing
  let basePrice = selectedService.basePrice;
  if (shiftType === 'SHIFT_12H') basePrice = 240;
  if (shiftType === 'SHIFT_24H') basePrice = 420;

  const platformFee = 15;
  const subtotal = basePrice + platformFee;
  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  const handleApplyCoupon = () => {
    setCouponError('');
    if (couponCode.toUpperCase() === 'VELLORA10') {
      setAppliedDiscount(Math.round(subtotal * 0.1));
    } else if (couponCode.toUpperCase() === 'CARE50') {
      setAppliedDiscount(50);
    } else {
      setCouponError('Invalid promo code. Try "VELLORA10" or "CARE50".');
    }
  };

  const handleConfirmBooking = () => {
    if (!currentUser) return;

    setIsSubmitting(true);

    // Resolve beneficiary name
    let benName = currentUser.name;
    let benRel = 'Self';
    if (beneficiaryType === 'FAMILY') {
      const fam = familyMembers.find((f) => f.id === selectedFamilyId);
      if (fam) {
        benName = fam.fullName;
        benRel = fam.relationship;
      }
    } else if (beneficiaryType === 'NEW' && newFamilyName.trim()) {
      benName = newFamilyName.trim();
      benRel = newFamilyRelation;
    }

    // Resolve address
    let addressText = '742 Evergreen Terrace, San Francisco, CA 94107';
    if (selectedAddressId) {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr) {
        addressText = `${addr.streetAddress}, ${addr.city}, ${addr.state} ${addr.postalCode}`;
      }
    } else if (newStreet.trim()) {
      addressText = `${newStreet}, ${newCity}, CA ${newZip}`;
    }

    setTimeout(() => {
      const newBooking = db.createBooking({
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientPhone: currentUser.phone,
        beneficiaryName: benName,
        beneficiaryRelation: benRel,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category: selectedService.category,
        addressText: addressText,
        scheduledDate: scheduledDate,
        scheduledTimeSlot: timeSlot,
        status: 'REQUESTED',
        shiftType: shiftType,
        totalAmount: finalTotal,
        discountAmount: appliedDiscount,
        couponCode: appliedDiscount > 0 ? couponCode.toUpperCase() : undefined,
        paymentStatus: paymentMethod === 'CARD' ? 'PAID' : 'PENDING',
        paymentMethod: paymentMethod === 'CARD' ? 'Credit / Debit Card (Stripe)' : paymentMethod === 'INSURANCE' ? 'Insurance Pre-Authorization' : 'Pay After Care Delivery',
        notes: clinicalNotes,
      });

      setIsSubmitting(false);
      setConfirmedBookingId(newBooking.id);
    }, 700);
  };

  return (
    <PatientLayout>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Navigation Breadcrumb / Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
                Care Concierge
              </span>
              <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
                Schedule Healthcare at Home
              </h1>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              Step {step} of 4
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            <div className={`border-b-4 pb-2 transition-colors ${step >= 1 ? 'border-[#116b70] text-[#116b70]' : 'border-gray-200 text-gray-400'}`}>
              1. Service & Shift
            </div>
            <div className={`border-b-4 pb-2 transition-colors ${step >= 2 ? 'border-[#116b70] text-[#116b70]' : 'border-gray-200 text-gray-400'}`}>
              2. Patient & Address
            </div>
            <div className={`border-b-4 pb-2 transition-colors ${step >= 3 ? 'border-[#116b70] text-[#116b70]' : 'border-gray-200 text-gray-400'}`}>
              3. Time & Clinical Notes
            </div>
            <div className={`border-b-4 pb-2 transition-colors ${step >= 4 ? 'border-[#116b70] text-[#116b70]' : 'border-gray-200 text-gray-400'}`}>
              4. Review & Confirm
            </div>
          </div>
        </div>

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900">Select Healthcare Service</h2>
              <p className="mt-1 text-xs text-gray-500">
                Choose the specialized care package tailored to your or your loved one’s needs.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedService(svc)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedService.id === svc.id
                        ? 'border-[#116b70] bg-[#116b70]/5 shadow-sm ring-2 ring-[#116b70]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-xs">
                          <Icon name="stethoscope" className="h-5 w-5 text-[#116b70]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{svc.name}</h3>
                          <span className="text-[11px] font-medium text-[#116b70]">
                            {svc.categoryLabel}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        ${svc.basePrice}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-gray-600 line-clamp-2">{svc.shortDesc}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {svc.features.slice(0, 2).map((feat, i) => (
                        <span
                          key={i}
                          className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Duration Options */}
            {(selectedService.category === 'NURSING_CARE' ||
              selectedService.category === 'CARETAKER') && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900">Select Shift Duration</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Choose between routine visit procedures or dedicated multi-hour shifts.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div
                    onClick={() => setShiftType('STANDARD_VISIT')}
                    className={`cursor-pointer rounded-xl border p-3.5 text-center transition-all ${
                      shiftType === 'STANDARD_VISIT'
                        ? 'border-[#116b70] bg-[#116b70]/5 font-bold text-[#116b70]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="text-sm">Standard Procedure</div>
                    <div className="text-xs text-gray-500 font-normal">~45–60 mins • ${selectedService.basePrice}</div>
                  </div>
                  <div
                    onClick={() => setShiftType('SHIFT_12H')}
                    className={`cursor-pointer rounded-xl border p-3.5 text-center transition-all ${
                      shiftType === 'SHIFT_12H'
                        ? 'border-[#116b70] bg-[#116b70]/5 font-bold text-[#116b70]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="text-sm">12-Hour Day/Night Shift</div>
                    <div className="text-xs text-gray-500 font-normal">Continuous coverage • $240</div>
                  </div>
                  <div
                    onClick={() => setShiftType('SHIFT_24H')}
                    className={`cursor-pointer rounded-xl border p-3.5 text-center transition-all ${
                      shiftType === 'SHIFT_24H'
                        ? 'border-[#116b70] bg-[#116b70]/5 font-bold text-[#116b70]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="text-sm">24-Hour Live-In Shift</div>
                    <div className="text-xs text-gray-500 font-normal">Full 24h rotation • $420</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-[#116b70] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
              >
                Proceed to Patient Details
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BENEFICIARY & ADDRESS */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Beneficiary */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900">Who is this visit for?</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div
                  onClick={() => setBeneficiaryType('SELF')}
                  className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${
                    beneficiaryType === 'SELF'
                      ? 'border-[#116b70] bg-[#116b70]/5 font-bold text-[#116b70]'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <Icon name="user" className="mx-auto mb-2 h-5 w-5" />
                  <div className="text-sm">Myself ({currentUser?.name || 'Self'})</div>
                </div>
                <div
                  onClick={() => setBeneficiaryType('FAMILY')}
                  className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${
                    beneficiaryType === 'FAMILY'
                      ? 'border-[#116b70] bg-[#116b70]/5 font-bold text-[#116b70]'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <Icon name="heartbeat" className="mx-auto mb-2 h-5 w-5" />
                  <div className="text-sm">Family Member</div>
                </div>
                <div
                  onClick={() => setBeneficiaryType('NEW')}
                  className={`cursor-pointer rounded-xl border p-4 text-center transition-all ${
                    beneficiaryType === 'NEW'
                      ? 'border-[#116b70] bg-[#116b70]/5 font-bold text-[#116b70]'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <Icon name="arrow-right" className="mx-auto mb-2 h-5 w-5" />
                  <div className="text-sm">+ New Dependent</div>
                </div>
              </div>

              {beneficiaryType === 'FAMILY' && (
                <div className="mt-4">
                  <label className="text-xs font-semibold text-gray-700">Select Family Profile</label>
                  <select
                    value={selectedFamilyId}
                    onChange={(e) => setSelectedFamilyId(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                  >
                    {familyMembers.map((fam) => (
                      <option key={fam.id} value={fam.id}>
                        {fam.fullName} ({fam.relationship} • Blood Group: {fam.bloodGroup})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {beneficiaryType === 'NEW' && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Full Legal Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Martha Vance"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Relationship</label>
                    <select
                      value={newFamilyRelation}
                      onChange={(e) => setNewFamilyRelation(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Other Dependent">Other Dependent</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Address Selection */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900">Select Home Visit Address</h2>
              <div className="mt-4 space-y-3">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-[#116b70] bg-[#116b70]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="mt-1 text-[#116b70] focus:ring-[#116b70]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-[#116b70]">
                          {addr.tag}
                        </span>
                        {addr.isDefault && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">{addr.streetAddress}</p>
                      <p className="text-xs text-gray-500">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Enter new address toggle */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedAddressId('')}
                  className="text-xs font-bold text-[#116b70] hover:underline"
                >
                  + Deliver to a different address
                </button>
                {!selectedAddressId && (
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-700">Street Address</label>
                      <input
                        type="text"
                        placeholder="Street & number"
                        value={newStreet}
                        onChange={(e) => setNewStreet(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Zip Code</label>
                      <input
                        type="text"
                        value={newZip}
                        onChange={(e) => setNewZip(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded-xl bg-[#116b70] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
              >
                Proceed to Scheduling
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE & CLINICAL NOTES */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900">Select Date & Preferred Window</h2>
              <p className="mt-1 text-xs text-gray-500">
                Our care coordinators dispatch vetted specialists equipped with certified kits within this window.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Appointment Date</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Arrival Window</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-sm font-medium"
                  >
                    <option value="08:00 AM - 10:00 AM">Morning (08:00 AM - 10:00 AM)</option>
                    <option value="10:00 AM - 12:00 PM">Late Morning (10:00 AM - 12:00 PM)</option>
                    <option value="01:00 PM - 03:00 PM">Early Afternoon (01:00 PM - 03:00 PM)</option>
                    <option value="03:00 PM - 05:00 PM">Late Afternoon (03:00 PM - 05:00 PM)</option>
                    <option value="06:00 PM - 08:00 PM">Evening (06:00 PM - 08:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-semibold text-gray-700">
                  Symptoms, Chief Complaints & Instructions for the Clinician
                </label>
                <textarea
                  rows={4}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Please state primary complaints, chronic conditions, known allergies, or gate code/parking directions..."
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-[#116b70] focus:ring-[#116b70]"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="flex items-center gap-2 rounded-xl bg-[#116b70] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
              >
                Review & Payment
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Summary Card */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
                <h2 className="text-lg font-bold text-gray-900">Visit Summary</h2>
                <div className="mt-4 divide-y divide-gray-100 text-sm">
                  <div className="flex justify-between py-2.5">
                    <span className="text-gray-500">Service</span>
                    <span className="font-bold text-gray-900">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-gray-500">Shift / Duration</span>
                    <span className="font-medium text-gray-900">
                      {shiftType === 'STANDARD_VISIT'
                        ? 'Standard Consultation'
                        : shiftType === 'SHIFT_12H'
                        ? '12-Hour Shift'
                        : '24-Hour Live-In'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-gray-500">Scheduled Date & Time</span>
                    <span className="font-medium text-gray-900">
                      {scheduledDate} • {timeSlot}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-gray-500">Beneficiary</span>
                    <span className="font-medium text-gray-900">
                      {beneficiaryType === 'SELF'
                        ? `${currentUser?.name || 'Self'} (Self)`
                        : beneficiaryType === 'FAMILY'
                        ? familyMembers.find((f) => f.id === selectedFamilyId)?.fullName || 'Family Member'
                        : newFamilyName || 'New Dependent'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-gray-500">Service Location</span>
                    <span className="font-medium text-gray-900 max-w-xs text-right">
                      {savedAddresses.find((a) => a.id === selectedAddressId)?.streetAddress || 'San Francisco Home'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900">Select Payment Mode</h3>
                <div className="mt-4 space-y-3">
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-[#116b70] bg-[#116b70]/5'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'CARD'}
                        onChange={() => setPaymentMethod('CARD')}
                        className="text-[#116b70] focus:ring-[#116b70]"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">Credit / Debit Card (Stripe Test Gateway)</div>
                        <div className="text-xs text-gray-500">Instant confirmation • Visa • Mastercard • Amex</div>
                      </div>
                    </div>
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      RECOMMENDED
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      paymentMethod === 'INSURANCE'
                        ? 'border-[#116b70] bg-[#116b70]/5'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'INSURANCE'}
                        onChange={() => setPaymentMethod('INSURANCE')}
                        className="text-[#116b70] focus:ring-[#116b70]"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">Health Insurance Direct Billing</div>
                        <div className="text-xs text-gray-500">Medicare, BlueCross, Aetna pre-authorization</div>
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all ${
                      paymentMethod === 'CASH'
                        ? 'border-[#116b70] bg-[#116b70]/5'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={paymentMethod === 'CASH'}
                        onChange={() => setPaymentMethod('CASH')}
                        className="text-[#116b70] focus:ring-[#116b70]"
                      />
                      <div>
                        <div className="text-sm font-bold text-gray-900">Pay on Arrival (Point of Care)</div>
                        <div className="text-xs text-gray-500">Card reader or digital payment upon clinician arrival</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Price Breakdown Sidebar */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-gray-900">Order Total</h3>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Base Care Fee</span>
                    <span className="font-semibold text-gray-900">${basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clinical Disposables & Travel</span>
                    <span className="font-semibold text-gray-900">${platformFee}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Promo Discount</span>
                      <span>-${appliedDiscount}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-base font-black text-gray-900">
                      <span>Total Due</span>
                      <span className="text-[#116b70]">${finalTotal}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">All local taxes included. Full invoice issued.</p>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <label className="text-xs font-semibold text-gray-700">Have a coupon code?</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Try VELLORA10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-xs uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="mt-1.5 text-xs text-red-600">{couponError}</p>}
                  {appliedDiscount > 0 && (
                    <p className="mt-1.5 text-xs text-emerald-700 font-medium">Coupon applied successfully!</p>
                  )}
                </div>

                <div className="mt-6 space-y-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmBooking}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#116b70] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#0d5559] disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Confirming with Dispatch...' : `Confirm & Book ($${finalTotal})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full py-2 text-center text-xs font-bold text-gray-500 hover:text-gray-700"
                  >
                    Go Back & Change Time
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmedBookingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon name="check" className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-xl font-black text-gray-900">Appointment Scheduled!</h3>
              <p className="mt-2 text-xs text-gray-600">
                Your booking ID is <span className="font-mono font-bold text-[#116b70]">{confirmedBookingId}</span>.
                Our medical dispatch center has routed this to available nearby clinicians.
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/patient/bookings/${confirmedBookingId}`)}
                  className="rounded-xl bg-[#116b70] py-3 text-sm font-bold text-white shadow-md hover:bg-[#0d5559]"
                >
                  Track Live Appointment Status
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/patient/dashboard')}
                  className="rounded-xl border border-gray-300 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
