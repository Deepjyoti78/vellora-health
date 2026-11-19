'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db, ClinicalNoteRecord, BookingRecord } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import {
  FileText,
  CheckCircle2,
  Stethoscope,
  Activity,
  HeartHandshake,
  UserCheck,
  Syringe,
  Plus,
  Trash2,
  Calendar,
  User,
  ShieldCheck,
  Save,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

function ClinicalRecordsContent() {
  const searchParams = useSearchParams();
  const { currentUser } = useAuth();
  const bookingIdParam = searchParams.get('bookingId');

  const providerRole = (currentUser?.role && ['DOCTOR', 'NURSE', 'CARETAKER', 'PHYSIOTHERAPIST', 'PHLEBOTOMIST'].includes(currentUser.role))
    ? currentUser.role
    : 'DOCTOR';

  const [activeRoleTab, setActiveRoleTab] = useState<'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHYSIOTHERAPIST' | 'PHLEBOTOMIST'>(
    providerRole as any
  );

  const [selectedBookingId, setSelectedBookingId] = useState(bookingIdParam || 'bkg-101');
  const [patientName, setPatientName] = useState('');
  const [title, setTitle] = useState('Comprehensive In-Home Clinical Evaluation');
  const [summary, setSummary] = useState('');
  const [observations, setObservations] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Doctor: Prescription
  const [medications, setMedications] = useState<{ name: string; dosage: string; frequency: string; duration: string }[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('Twice daily');
  const [newMedDur, setNewMedDur] = useState('5 Days');

  // Nurse: Vitals
  const [bp, setBp] = useState('');
  const [pulse, setPulse] = useState('');
  const [spo2, setSpo2] = useState('');
  const [temp, setTemp] = useState('');
  const [glucose, setGlucose] = useState('');

  // Caretaker: Tasks
  const [caretakerTasks, setCaretakerTasks] = useState([
    { task: 'Assisted Morning Bed-to-Chair Transfer', done: false },
    { task: 'Breakfast Meal & Hydration Support', done: false },
    { task: 'Scheduled Oral Medication Reminders', done: false },
    { task: 'Assisted 15-Minute Indoor Walking Session', done: false },
    { task: 'Vitals & General Comfort Check', done: false },
  ]);

  // Physiotherapist: Rehab exercises
  const [rehabExercises, setRehabExercises] = useState<string[]>([]);
  const [newExercise, setNewExercise] = useState('');

  // Phlebotomist: Specimen Barcode & Cold-chain
  const [specimenBarcode, setSpecimenBarcode] = useState(`VEL-LAB-${Math.floor(100000 + Math.random() * 900000)}`);
  const [coldChainConfirmed, setColdChainConfirmed] = useState(false);

  // Past Notes List
  const [pastNotes, setPastNotes] = useState<ClinicalNoteRecord[]>([]);

  const loadPastNotes = () => {
    setPastNotes([...db.getClinicalNotes({ providerId: currentUser?.id || '' })]);
  };

  useEffect(() => {
    loadPastNotes();
    if (bookingIdParam) {
      const b = db.getBookingById(bookingIdParam);
      if (b) {
        setSelectedBookingId(b.id);
        setPatientName(b.patientName);
      }
    }
  }, [bookingIdParam, currentUser?.id]);

  const handleAddMedication = () => {
    if (!newMedName) return;
    setMedications([...medications, { name: newMedName, dosage: newMedDosage, frequency: newMedFreq, duration: newMedDur }]);
    setNewMedName('');
    setNewMedDosage('');
  };

  const handleRemoveMedication = (idx: number) => {
    setMedications(medications.filter((_, i) => i !== idx));
  };

  const handleAddExercise = () => {
    if (!newExercise) return;
    setRehabExercises([...rehabExercises, newExercise]);
    setNewExercise('');
  };

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();

    const encounter = db.getBookingById(selectedBookingId);
    if (!encounter || !currentUser || !summary.trim()) { alert('Select a valid encounter and enter a clinical summary.'); return; }
    if (encounter.providerId !== currentUser.id) { alert('Choose an encounter assigned to your demo clinician.'); return; }
    if (currentUser.role !== activeRoleTab) { alert('Select your clinician role before saving a demo note.'); return; }
    const note = db.createClinicalNote({
      bookingId: selectedBookingId,
      patientId: encounter.patientId,
      patientName: encounter.beneficiaryName,
      providerId: currentUser?.id || 'doc-1',
      providerName: currentUser?.name || 'Dr. Maya Patel',
      providerRole: activeRoleTab,
      title,
      summary,
      observations,
      tasksCompleted: activeRoleTab === 'CARETAKER' ? caretakerTasks.filter((t) => t.done).map((t) => t.task) : undefined,
      vitalsRecorded:
        (activeRoleTab === 'NURSE' || activeRoleTab === 'DOCTOR') && [pulse, spo2, temp, glucose].every(value => value.trim() && Number.isFinite(Number(value)))
          ? {
              bp,
              pulse: Number(pulse),
              spo2: Number(spo2),
              temp: Number(temp),
              glucose: Number(glucose),
            }
          : undefined,
      specimenBarcode: activeRoleTab === 'PHLEBOTOMIST' ? specimenBarcode : undefined,
      rehabExercises: activeRoleTab === 'PHYSIOTHERAPIST' ? rehabExercises : undefined,
    });

    loadPastNotes();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
                Bedside Charting &amp; E-Records
              </span>
              <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                Digital Medical Record Sync
              </span>
            </div>
            <h1 className="font-heading text-2xl font-black text-[#15212B] sm:text-3xl tracking-tight mt-0.5">
              Clinical Documentation Workspace
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Record vitals, clinical progress notes, e-prescriptions, rehab milestones, and laboratory specimen barcodes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/provider/appointments"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D9ECE7] bg-white hover:bg-[#F2F8F5] px-4 py-2 text-xs font-bold text-[#102723] shadow-2xs hover:shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Back to Itinerary</span>
            </Link>
          </div>
        </div>

        {/* Role Tab Selector (For demonstration across all 5 clinical designations) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#D9ECE7] pb-3 animate-fade-in-up animate-delay-1">
          <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">Chart Template:</span>
          {[
            { id: 'DOCTOR' as const, label: 'Doctor E-Rx & Diagnosis', icon: Stethoscope },
            { id: 'NURSE' as const, label: 'Nurse Bedside Vitals', icon: Activity },
            { id: 'CARETAKER' as const, label: 'Caretaker Shift Tasks', icon: HeartHandshake },
            { id: 'PHYSIOTHERAPIST' as const, label: 'Physio Rehab Plan', icon: UserCheck },
            { id: 'PHLEBOTOMIST' as const, label: 'Phlebotomy Sample Tag', icon: Syringe },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isSelected = activeRoleTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRoleTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? 'bg-[#065F46] text-white shadow-xs'
                    : 'bg-white border border-[#D9ECE7] text-slate-600 hover:bg-[#F2F8F5] hover:text-[#102723]'
                }`}
              >
                <TabIcon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-2xs animate-fade-in-up">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-bounce" />
              <span>Clinical documentation encrypted &amp; synced directly to patient medical records!</span>
            </div>
            <Link href="/patient/records" className="text-emerald-700 underline text-xs">
              View in Patient Portal →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Charting Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 sm:p-8 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-2">
              <form onSubmit={handleSaveRecord} className="space-y-6">
                {/* Patient & Visit Context */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#F2F8F5]">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Patient Name</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      readOnly
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2 text-xs sm:text-sm font-bold text-[#102723]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Booking Reference</label>
                    <input
                      type="text"
                      value={selectedBookingId}
                      onChange={(e) => { setSelectedBookingId(e.target.value); const encounter = db.getBookingById(e.target.value); setPatientName(encounter?.beneficiaryName || ''); }}
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2 text-xs sm:text-sm font-mono font-bold text-[#065F46]"
                    />
                  </div>
                </div>

                {/* Common Title & Clinical Summary */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Encounter Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2 text-xs sm:text-sm text-[#102723]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Summary / Assessment</label>
                  <textarea
                    rows={3}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-3 text-xs sm:text-sm text-[#102723]"
                  />
                </div>

                {/* ROLE 1: DOCTOR (Prescription Module) */}
                {activeRoleTab === 'DOCTOR' && (
                  <div className="space-y-4 pt-4 border-t border-[#F2F8F5]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1.5">
                        <Stethoscope className="h-4 w-4" />
                        <span>Digital Prescription (E-Rx)</span>
                      </h3>
                      <span className="text-[10px] text-slate-400">Authorized Digital Prescription Form</span>
                    </div>

                    {/* Prescribed Meds List */}
                    <div className="space-y-2">
                      {medications.map((med, mIdx) => (
                        <div
                          key={mIdx}
                          className="flex items-center justify-between p-3 rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] text-xs"
                        >
                          <div>
                            <p className="font-bold text-[#102723]">{med.name} <span className="font-mono text-slate-500 font-normal">({med.dosage})</span></p>
                            <p className="text-[11px] text-slate-500">{med.frequency} • {med.duration}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(mIdx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Med Line */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Drug name (e.g. Paracetamol)"
                        value={newMedName}
                        onChange={(e) => setNewMedName(e.target.value)}
                        className="rounded-lg border border-[#D9ECE7] bg-white p-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (500mg)"
                        value={newMedDosage}
                        onChange={(e) => setNewMedDosage(e.target.value)}
                        className="rounded-lg border border-[#D9ECE7] bg-white p-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (TDS)"
                        value={newMedFreq}
                        onChange={(e) => setNewMedFreq(e.target.value)}
                        className="rounded-lg border border-[#D9ECE7] bg-white p-2 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddMedication}
                        className="rounded-lg bg-[#065F46] text-white font-bold text-xs p-2 hover:bg-[#054d39]"
                      >
                        + Add Drug
                      </button>
                    </div>
                  </div>
                )}

                {/* ROLE 2: NURSE (Vitals Module) */}
                {activeRoleTab === 'NURSE' && (
                  <div className="space-y-4 pt-4 border-t border-[#F2F8F5]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1.5">
                      <Activity className="h-4 w-4" />
                      <span>Bedside Vitals Telemetry</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-3 text-center">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Blood Pressure</label>
                        <input
                          type="text"
                          value={bp}
                          onChange={(e) => setBp(e.target.value)}
                          className="w-full text-center font-mono font-bold text-[#102723] text-sm mt-1 bg-transparent"
                        />
                        <span className="text-[9px] text-slate-400">mmHg</span>
                      </div>

                      <div className="rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-3 text-center">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Heart Rate</label>
                        <input
                          type="number"
                          value={pulse}
                          onChange={(e) => setPulse(e.target.value)}
                          className="w-full text-center font-mono font-bold text-[#102723] text-sm mt-1 bg-transparent"
                        />
                        <span className="text-[9px] text-slate-400">bpm</span>
                      </div>

                      <div className="rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-3 text-center">
                        <label className="text-[10px] font-bold uppercase text-slate-500">SpO2 Oxygen</label>
                        <input
                          type="number"
                          value={spo2}
                          onChange={(e) => setSpo2(e.target.value)}
                          className="w-full text-center font-mono font-bold text-[#102723] text-sm mt-1 bg-transparent"
                        />
                        <span className="text-[9px] text-slate-400">%</span>
                      </div>

                      <div className="rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-3 text-center">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Temperature</label>
                        <input
                          type="number"
                          step={0.1}
                          value={temp}
                          onChange={(e) => setTemp(e.target.value)}
                          className="w-full text-center font-mono font-bold text-[#102723] text-sm mt-1 bg-transparent"
                        />
                        <span className="text-[9px] text-slate-400">°F</span>
                      </div>

                      <div className="rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-3 text-center">
                        <label className="text-[10px] font-bold uppercase text-slate-500">Blood Sugar</label>
                        <input
                          type="number"
                          value={glucose}
                          onChange={(e) => setGlucose(e.target.value)}
                          className="w-full text-center font-mono font-bold text-[#102723] text-sm mt-1 bg-transparent"
                        />
                        <span className="text-[9px] text-slate-400">mg/dL</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ROLE 3: CARETAKER (Assisted Living Tasks) */}
                {activeRoleTab === 'CARETAKER' && (
                  <div className="space-y-4 pt-4 border-t border-[#F2F8F5]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1.5">
                      <HeartHandshake className="h-4 w-4" />
                      <span>Shift Care Delivery Checklist</span>
                    </h3>
                    <div className="space-y-2">
                      {caretakerTasks.map((t, idx) => (
                        <label
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] text-xs font-medium cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={(e) => {
                              const updated = [...caretakerTasks];
                              updated[idx].done = e.target.checked;
                              setCaretakerTasks(updated);
                            }}
                            className="h-4 w-4 rounded text-[#065F46] focus:ring-[#065F46]"
                          />
                          <span className={t.done ? 'text-[#102723] font-bold' : 'text-slate-500'}>
                            {t.task}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* ROLE 4: PHYSIOTHERAPIST (Rehab Exercises) */}
                {activeRoleTab === 'PHYSIOTHERAPIST' && (
                  <div className="space-y-4 pt-4 border-t border-[#F2F8F5]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4" />
                      <span>Bedside Rehabilitation Drills</span>
                    </h3>
                    <div className="space-y-2">
                      {rehabExercises.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="flex items-center justify-between p-3 rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] text-xs"
                        >
                          <span className="font-medium text-[#102723]">{ex}</span>
                          <span className="text-[10px] font-bold text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded">
                            Completed
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add new rehab exercise (e.g. 10m Gait Balance Retraining)"
                        value={newExercise}
                        onChange={(e) => setNewExercise(e.target.value)}
                        className="flex-1 rounded-xl border border-[#D9ECE7] bg-white p-2.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddExercise}
                        className="rounded-xl bg-[#065F46] px-4 text-xs font-bold text-white"
                      >
                        Add Drill
                      </button>
                    </div>
                  </div>
                )}

                {/* ROLE 5: PHLEBOTOMIST (Sample Barcode) */}
                {activeRoleTab === 'PHLEBOTOMIST' && (
                  <div className="space-y-4 pt-4 border-t border-[#F2F8F5]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#065F46] flex items-center gap-1.5">
                      <Syringe className="h-4 w-4" />
                      <span>Cold-Chain Specimen Tagging</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Assigned Tube Barcode</label>
                        <input
                          type="text"
                          value={specimenBarcode}
                          onChange={(e) => setSpecimenBarcode(e.target.value)}
                          className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-2.5 text-xs font-mono font-bold text-[#065F46]"
                        />
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <input
                          type="checkbox"
                          checked={coldChainConfirmed}
                          onChange={(e) => setColdChainConfirmed(e.target.checked)}
                          className="h-4 w-4 rounded text-[#065F46] focus:ring-[#065F46]"
                        />
                        <span className="text-xs font-medium text-slate-700">
                          Cold-Chain Temperature Box Verified (2°C – 8°C)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Observations & Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Follow-Up Instructions &amp; Patient Advisory
                  </label>
                  <textarea
                    rows={2}
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-3 text-xs sm:text-sm text-[#102723]"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#F2F8F5]">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="h-4 w-4 text-[#065F46]" />
                    <span>Clinician Digital Attestation</span>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-2xs transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>Sign &amp; Sync Clinical Record</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Historical Notes Feed */}
          <div className="space-y-4">
            <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-3">
              <h3 className="font-heading text-base font-extrabold text-[#15212B] tracking-tight">Recent Clinical Chart History</h3>
              <p className="text-xs text-slate-500 mb-4">Past charts recorded for this patient.</p>

              <div className="space-y-3">
                {pastNotes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No previous notes logged.</p>
                ) : (
                  pastNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-2xl border border-[#D9ECE7] bg-[#F7FBF9] hover:bg-white hover:border-[#A7F3D0] shadow-2xs transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#065F46] bg-[#ECFDF5] px-2 py-0.5 rounded">
                          {note.providerRole}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-heading text-xs font-bold text-[#15212B]">{note.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{note.summary}</p>
                      <p className="text-[10px] text-slate-400">By {note.providerName}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}

export default function ProviderClinicalRecordsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7FBF9] flex items-center justify-center text-sm font-bold text-[#065F46]">Loading...</div>}>
      <ClinicalRecordsContent />
    </Suspense>
  );
}
