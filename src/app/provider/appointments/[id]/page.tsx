'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, BookingRecord } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import { Icon } from '@/components/common/Icon';

export default function ProviderAppointmentCockpitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser } = useAuth();
  const [booking, setBooking] = useState<BookingRecord | undefined>();
  useEffect(() => {
    const candidate = db.getBookingById(id);
    setBooking(candidate?.providerId === currentUser?.id ? candidate : undefined);
  }, [id, currentUser?.id]);

  // Security PIN Verification
  const [pinInput, setPinInput] = useState('');
  const [pinVerified, setPinVerified] = useState(false);
  const [pinError, setPinError] = useState('');

  // Doctor Clinical Documentation
  const [diagnosis, setDiagnosis] = useState('');
  const [medications, setMedications] = useState<{ name: string; dosage: string; frequency: string; duration: string; instructions: string }[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('Once daily');
  const [newMedDur, setNewMedDur] = useState('5 Days');
  const [advice, setAdvice] = useState('');
  const [rxIssued, setRxIssued] = useState(false);

  // Nurse Vitals Documentation
  const [bp, setBp] = useState('');
  const [hr, setHr] = useState('');
  const [spo2, setSpo2] = useState('');
  const [temp, setTemp] = useState('');
  const [glucose, setGlucose] = useState('');
  const [respRate, setRespRate] = useState('');
  const [nurseNotes, setNurseNotes] = useState('');
  const [vitalsSaved, setVitalsSaved] = useState(false);

  // Phlebotomist Documentation
  const [barcode, setBarcode] = useState(`VEL-BC-${Math.floor(100000 + Math.random() * 900000)}`);
  const [specimenType, setSpecimenType] = useState('Venous Whole Blood (EDTA + Serum)');
  const [coldChainOk, setColdChainOk] = useState(false);
  const [specimenSaved, setSpecimenSaved] = useState(false);

  // Caretaker Documentation
  const [mobilityAssisted, setMobilityAssisted] = useState(false);
  const [nutritionAssisted, setNutritionAssisted] = useState(false);
  const [caretakerNotes, setCaretakerNotes] = useState('');
  const [shiftSaved, setShiftSaved] = useState(false);

  if (!booking) {
    return (
      <ProviderLayout>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <Icon name="calendar" className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">Appointment Not Found</h2>
          <Link
            href="/provider/appointments"
            className="mt-6 inline-block rounded-xl bg-[#116b70] px-5 py-2.5 text-xs font-bold text-white"
          >
            Back to Itinerary
          </Link>
        </div>
      </ProviderLayout>
    );
  }

  const handleUpdateStatus = (status: BookingRecord['status']) => {
    const updated = db.updateBookingStatus(booking.id, status);
    if (updated) setBooking({ ...updated });
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '4829') {
      setPinVerified(true);
      setPinError('');
      handleUpdateStatus('IN_PROGRESS');
    } else {
      setPinError('Invalid security PIN. Patient’s screen displays 4829.');
    }
  };

  const handleAddMedication = () => {
    if (!newMedName.trim() || !newMedDosage.trim()) return;
    setMedications([
      ...medications,
      {
        name: newMedName.trim(),
        dosage: newMedDosage.trim(),
        frequency: newMedFreq,
        duration: newMedDur,
        instructions: 'Take as directed by doctor.',
      },
    ]);
    setNewMedName('');
    setNewMedDosage('');
  };

  const handleIssueRx = () => {
    if (!currentUser || !diagnosis.trim() || medications.length === 0) return;
    db.createPrescription({
      bookingId: booking.id,
      patientId: booking.patientId,
      patientName: booking.beneficiaryName,
      doctorName: currentUser?.name || 'Dr. Attending',
      diagnosis,
      medications,
      advice,
    });
    setRxIssued(true);
  };

  const handleSaveVitals = () => {
    if (![hr, spo2, temp, glucose, respRate].every(value => value.trim() && Number.isFinite(Number(value)) && Number(value) > 0) || Number(spo2) > 100) return;
    db.createVitals({
      bookingId: booking.id,
      patientId: booking.patientId,
      patientName: booking.beneficiaryName,
      recordedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'Clinician',
      bloodPressure: bp,
      heartRate: Number(hr),
      spo2: Number(spo2),
      temperature: Number(temp),
      bloodGlucose: Number(glucose),
      respiratoryRate: Number(respRate),
      clinicalNotes: nurseNotes,
    });
    setVitalsSaved(true);
  };

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2">
              <Link
                href="/provider/appointments"
                className="flex items-center gap-1 text-xs font-bold text-[#065F46] hover:underline"
              >
                <Icon name="arrow-left" className="h-3 w-3" />
                Back to Appointments
              </Link>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-xs font-bold text-slate-500">
                {booking.bookingNumber}
              </span>
            </div>
            <h1 className="font-heading mt-1 text-2xl font-black text-[#15212B] sm:text-3xl tracking-tight">
              Visit Cockpit: {booking.beneficiaryName}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Service: <strong className="text-[#15212B]">{booking.serviceName}</strong> • Scheduled: {booking.scheduledTimeSlot}
            </p>
          </div>

          {/* Quick status badge */}
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold self-start sm:self-center ${
              ['ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(booking.status)
                ? 'bg-[#ECFDF5] border border-[#D1FAE5] text-[#065F46] animate-pulse'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {booking.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Action Bar / Status Transition Buttons */}
        <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Visit Progress Control
          </span>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {booking.status === 'ASSIGNED' && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('ON_THE_WAY')}
                className="rounded-xl bg-[#065F46] px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#054d39] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Transit (Notify Patient: En Route)
              </button>
            )}

            {booking.status === 'ON_THE_WAY' && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('ARRIVED')}
                className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-amber-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Mark Arrived at Doorstep
              </button>
            )}

            {booking.status === 'ARRIVED' && !pinVerified && (
              <form onSubmit={handleVerifyPin} className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Doorstep PIN (4829)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="rounded-xl border border-[#D9ECE7] px-3 py-2 text-xs font-mono tracking-widest text-center"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#065F46] px-4 py-2 text-xs font-bold text-white hover:bg-[#054d39] shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Verify &amp; Start Care
                </button>
              </form>
            )}

            {booking.status === 'IN_PROGRESS' && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('COMPLETED')}
                className="rounded-xl bg-[#065F46] px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#054d39] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Mark Visit Completed &amp; Conclude Shift
              </button>
            )}

            {booking.status === 'COMPLETED' && (
              <span className="rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] px-4 py-2 text-xs font-bold text-[#065F46]">
                ✓ Shift Concluded &amp; Documented
              </span>
            )}
          </div>
          {pinError && <p className="mt-2 text-xs text-red-600 font-medium">{pinError}</p>}
        </div>

        {/* Patient Details & Address Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Patient Card */}
          <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-2 space-y-4">
            <h3 className="font-heading text-sm font-extrabold text-[#15212B] tracking-tight">Patient &amp; Household Details</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#F2F8F5]">
                <span className="text-slate-500">Name:</span>
                <span className="font-bold text-[#15212B]">{booking.beneficiaryName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F2F8F5]">
                <span className="text-slate-500">Relation:</span>
                <span className="font-medium text-slate-800">{booking.beneficiaryRelation}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#F2F8F5]">
                <span className="text-slate-500">Phone:</span>
                <span className="font-mono text-[#15212B] font-bold">{booking.patientPhone}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block mb-1">Destination Address:</span>
                <span className="font-bold text-[#15212B] block">{booking.addressText}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(booking.addressText)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] py-2.5 text-xs font-bold text-slate-800 hover:bg-[#F2F8F5] shadow-2xs transition-colors"
              >
                Open Google Maps Navigation
              </a>
              <a
                href={`tel:${booking.patientPhone}`}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#065F46] py-2.5 text-xs font-bold text-white hover:bg-[#054d39] shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Icon name="phone" className="h-3.5 w-3.5" />
                Call Patient
              </a>
            </div>
          </div>

          {/* Clinical Documentation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* DOCTOR MODULE */}
            {(currentUser?.role === 'DOCTOR' || booking.category === 'DOCTOR_VISIT') && (
              <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-3 space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2F8F5] pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#065F46]">
                      Physician Documentation
                    </span>
                    <h3 className="font-heading text-base font-extrabold text-[#15212B] tracking-tight">
                      Diagnosis &amp; Electronic Prescription (e-Rx)
                    </h3>
                  </div>
                  {rxIssued && (
                    <span className="rounded-full bg-emerald-100 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                      Rx Issued &amp; Released
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Clinical Diagnosis</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs font-medium"
                  />
                </div>

                {/* Medications Table */}
                <div>
                  <label className="text-xs font-semibold text-gray-700">Prescribed Therapy</label>
                  <div className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-200 text-xs">
                    {medications.map((m, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between bg-gray-50/50">
                        <div>
                          <strong className="text-gray-900">{m.name}</strong> • {m.dosage}
                          <p className="text-[11px] text-gray-500">
                            {m.frequency} for {m.duration} ({m.instructions})
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMedications(medications.filter((_, i) => i !== idx))}
                          className="text-red-600 font-bold hover:underline"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add medication inputs */}
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <input
                      type="text"
                      placeholder="Drug name"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      className="rounded-lg border border-gray-300 p-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g. 500mg)"
                      value={newMedDosage}
                      onChange={(e) => setNewMedDosage(e.target.value)}
                      className="rounded-lg border border-gray-300 p-2 text-xs"
                    />
                    <select
                      value={newMedFreq}
                      onChange={(e) => setNewMedFreq(e.target.value)}
                      className="rounded-lg border border-gray-300 p-2 text-xs"
                    >
                      <option value="Once daily">Once daily</option>
                      <option value="Twice daily">Twice daily</option>
                      <option value="Three times daily">Three times daily</option>
                      <option value="At bedtime">At bedtime</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white hover:bg-gray-800"
                    >
                      + Add Drug
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Physician Advice & Follow-Up</label>
                  <textarea
                    rows={3}
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleIssueRx}
                    className="rounded-xl bg-[#116b70] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559]"
                  >
                    {rxIssued ? 'Update Digital Prescription' : 'Save Demo Prescription'}
                  </button>
                </div>
              </div>
            )}

            {/* NURSE MODULE: VITALS */}
            {(currentUser?.role === 'NURSE' || booking.category === 'NURSING_CARE') && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#116b70]">
                      Nursing Assessment
                    </span>
                    <h3 className="text-base font-bold text-gray-900">
                      In-Home Vital Signs Checklist
                    </h3>
                  </div>
                  {vitalsSaved && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      Vitals Recorded
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700">Blood Pressure (mmHg)</label>
                    <input
                      type="text"
                      value={bp}
                      onChange={(e) => setBp(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={hr}
                      onChange={(e) => setHr(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">SpO2 (%)</label>
                    <input
                      type="number"
                      value={spo2}
                      onChange={(e) => setSpo2(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Temperature (°F)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={temp}
                      onChange={(e) => setTemp(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Blood Glucose (mg/dL)</label>
                    <input
                      type="number"
                      value={glucose}
                      onChange={(e) => setGlucose(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Respiration Rate</label>
                    <input
                      type="number"
                      value={respRate}
                      onChange={(e) => setRespRate(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">
                    Clinical Notes & Procedures Performed
                  </label>
                  <textarea
                    rows={3}
                    value={nurseNotes}
                    onChange={(e) => setNurseNotes(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveVitals}
                    className="rounded-xl bg-[#116b70] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559]"
                  >
                    {vitalsSaved ? 'Update Recorded Vitals' : 'Save & Publish Vitals Log'}
                  </button>
                </div>
              </div>
            )}

            {/* PHLEBOTOMIST MODULE: SPECIMEN */}
            {(currentUser?.role === 'PHLEBOTOMIST' || booking.category === 'LAB_TESTS') && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                      Phlebotomy Chain of Custody
                    </span>
                    <h3 className="text-base font-bold text-gray-900">
                      Specimen Collection & Barcode Tagging
                    </h3>
                  </div>
                  {specimenSaved && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800">
                      Barcode Scanned & Stored
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="font-semibold text-gray-700">Tube Barcode ID</label>
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Specimen Tube Type</label>
                    <select
                      value={specimenType}
                      onChange={(e) => setSpecimenType(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2"
                    >
                      <option value="Venous Whole Blood (EDTA + Serum)">Venous Whole Blood (EDTA + Serum)</option>
                      <option value="Sodium Fluoride (Glucose)">Sodium Fluoride (Glucose)</option>
                      <option value="Sodium Citrate (Coagulation)">Sodium Citrate (Coagulation)</option>
                      <option value="Sterile Urine Cup">Sterile Urine Cup</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-purple-50 p-3 text-xs">
                  <input
                    type="checkbox"
                    checked={coldChainOk}
                    onChange={(e) => setColdChainOk(e.target.checked)}
                    className="h-4 w-4 rounded text-purple-700 focus:ring-purple-700"
                  />
                  <span className="text-purple-900 font-semibold">
                    Cold-chain temperature confirmed (2°C – 8°C sealed transport box).
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSpecimenSaved(true)}
                    className="rounded-xl bg-purple-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-800"
                  >
                    Dispatch Sample to Central Lab
                  </button>
                </div>
              </div>
            )}

            {/* CARETAKER MODULE */}
            {(currentUser?.role === 'CARETAKER' || booking.category === 'CARETAKER') && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                      Caretaker Shift Log
                    </span>
                    <h3 className="text-base font-bold text-gray-900">
                      Patient Daily Living & Mobility Checklist
                    </h3>
                  </div>
                  {shiftSaved && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      Shift Summary Saved
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={mobilityAssisted}
                      onChange={(e) => setMobilityAssisted(e.target.checked)}
                      className="h-4 w-4 rounded text-[#116b70]"
                    />
                    <span>Mobility, walking support, and transfer assistance provided.</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={nutritionAssisted}
                      onChange={(e) => setNutritionAssisted(e.target.checked)}
                      className="h-4 w-4 rounded text-[#116b70]"
                    />
                    <span>Dietary meals served and medication schedule supervised.</span>
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Handover Summary</label>
                  <textarea
                    rows={3}
                    value={caretakerNotes}
                    onChange={(e) => setCaretakerNotes(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShiftSaved(true)}
                    className="rounded-xl bg-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-800"
                  >
                    Log Caretaker Shift
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
