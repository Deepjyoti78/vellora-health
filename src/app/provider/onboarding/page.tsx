'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import {
  Stethoscope,
  Activity,
  HeartHandshake,
  UserCheck,
  Syringe,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';

type ProviderRole = 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHYSIOTHERAPIST' | 'PHLEBOTOMIST';

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const { currentUser, switchRole } = useAuth();

  const [step, setStep] = useState<number>(1);
  const initialRole: ProviderRole =
    currentUser?.role && ['DOCTOR', 'NURSE', 'CARETAKER', 'PHYSIOTHERAPIST', 'PHLEBOTOMIST'].includes(currentUser.role)
      ? (currentUser.role as ProviderRole)
      : 'DOCTOR';

  const [role, setRole] = useState<ProviderRole>(initialRole);
  const [fullName, setFullName] = useState(currentUser?.name || 'Dr. Maya Patel');
  const [email, setEmail] = useState(currentUser?.email || 'maya.patel@vellora.com');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 234-5678');
  
  // Professional details
  const [qualifications, setQualifications] = useState(
    role === 'DOCTOR'
      ? 'MBBS, MD (Internal Medicine)'
      : role === 'NURSE'
      ? 'B.Sc Nursing (Registered Nurse)'
      : role === 'PHYSIOTHERAPIST'
      ? 'Bachelor of Physiotherapy (BPT)'
      : role === 'PHLEBOTOMIST'
      ? 'Diploma in Medical Laboratory Technology (DMLT)'
      : 'Certified Geriatric Care Assistant'
  );
  const [specialty, setSpecialty] = useState(
    role === 'DOCTOR' ? 'Internal Medicine & Geriatrics' : 'General Bedside Care'
  );
  const [experienceYears, setExperienceYears] = useState('8');
  const [licenseNumber, setLicenseNumber] = useState('MED-CA-928104');
  const [registrationCouncil, setRegistrationCouncil] = useState('State Medical Licensing Council');
  
  // Service zones & shifts
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    'Springfield Metro',
    'North Suburbs',
  ]);
  const [selectedShifts, setSelectedShifts] = useState<string[]>([
    'Morning (08:00 AM - 12:00 PM)',
    'Afternoon (01:00 PM - 05:00 PM)',
  ]);

  // Documents
  const [documents] = useState([
    { id: 'doc-1', title: 'Government Photo ID Card', type: 'GOVT_ID', fileName: 'Govt_National_ID.pdf', size: '1.8 MB', uploaded: true },
    { id: 'doc-2', title: 'Medical / Nursing Council License', type: 'COUNCIL_CERTIFICATE', fileName: 'Medical_Council_License_2026.pdf', size: '2.4 MB', uploaded: true },
    { id: 'doc-3', title: 'Degree & Graduation Certificate', type: 'DEGREE_CERTIFICATE', fileName: 'Degree_Certification.pdf', size: '3.1 MB', uploaded: true },
    { id: 'doc-4', title: 'Criminal Background Check Clearance', type: 'BACKGROUND_CHECK', fileName: 'Police_Clearance_Record.pdf', size: '1.2 MB', uploaded: true },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    );
  };

  const toggleShift = (shift: string) => {
    setSelectedShifts((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create or update application in DataStore
      const existingApps = db.getProviderApplications();
      const existing = existingApps.find((a) => a.email.toLowerCase() === email.toLowerCase());

      const appData = {
        userId: currentUser?.id || `user-prov-${Date.now()}`,
        fullName,
        email,
        phone,
        role,
        state: 'Oregon',
        city: 'Springfield',
        licenseNumber,
        registrationCouncil,
        experienceYears: Number(experienceYears) || 5,
        qualification: qualifications,
        specialty,
        serviceLocations: selectedLocations.length > 0 ? selectedLocations : ['Springfield Metro'],
        documents: documents.map((d) => ({
          id: d.id,
          title: d.title,
          type: d.type,
          size: d.size,
          status: 'PENDING' as const,
          uploadedAt: new Date().toISOString(),
        })),
        adminNotes: 'Submitted via multi-step onboarding wizard. Ready for CMO review.',
      };

      if (existing) {
        db.updateProviderApplication(existing.id, {
          ...appData,
          status: 'UNDER_REVIEW',
        });
      } else {
        db.createProviderApplication({
          ...appData,
        });
      }

      // Ensure provider role is active in session
      switchRole(role);

      // Redirect to live application status tracker
      setTimeout(() => {
        router.push('/provider/application-status');
      }, 500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const allLocations = [
    'Springfield Metro',
    'North Suburbs',
    'South Suburbs',
    'East Greenfield',
    'West Hills & Uptown',
  ];

  const allShifts = [
    'Morning (08:00 AM - 12:00 PM)',
    'Afternoon (01:00 PM - 05:00 PM)',
    'Evening (05:00 PM - 09:00 PM)',
    'Full Day Dedicated Shift (8 Hours)',
  ];

  return (
    <div className="min-h-screen bg-[#F7FBF9] text-[#102723] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Top Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#065F46] text-white font-black text-lg shadow-sm">
              +
            </span>
            <span className="text-xl font-black tracking-tight text-[#102723]">
              VELLORA HEALTH
            </span>
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-0.5 text-xs font-bold text-[#065F46]">
            <Sparkles className="h-3.5 w-3.5 text-[#10B981]" />
            <span>PRACTITIONER CREDENTIALING</span>
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-heading font-bold text-[#102723]">
            Practitioner Verification Wizard
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Complete your clinical qualifications, practice regions, and council documents to unlock home dispatch requests.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 grid grid-cols-5 gap-2">
          {[
            { num: 1, label: 'Profile' },
            { num: 2, label: 'Credentials' },
            { num: 3, label: 'Licensing' },
            { num: 4, label: 'Zones & Shifts' },
            { num: 5, label: 'Verification' },
          ].map((st) => (
            <button
              key={st.num}
              type="button"
              onClick={() => st.num < step && setStep(st.num)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl text-center transition-all ${
                step === st.num
                  ? 'bg-[#065F46] text-white shadow-xs'
                  : step > st.num
                  ? 'bg-[#ECFDF5] text-[#065F46] border border-[#D1FAE5]'
                  : 'bg-white text-slate-400 border border-[#D9ECE7]'
              }`}
            >
              <span className="text-[11px] font-bold">Step 0{st.num}</span>
              <span className="text-[10px] font-medium hidden sm:inline">{st.label}</span>
            </button>
          ))}
        </div>

        {/* Wizard Main Card */}
        <div className="rounded-[26px] border border-[#D9ECE7] bg-white p-6 sm:p-10 shadow-[0_4px_24px_rgba(6,95,70,0.06)]">
          <form onSubmit={handleSubmit}>
            {/* STEP 1: Personal & Role Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-heading font-bold text-[#102723]">Personal &amp; Contact Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Please confirm your legal identity as registered with your health licensing council.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Clinical Designation
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'DOCTOR' as ProviderRole, label: 'Doctor / Physician' },
                      { id: 'NURSE' as ProviderRole, label: 'Registered Nurse' },
                      { id: 'CARETAKER' as ProviderRole, label: 'Patient Caretaker' },
                      { id: 'PHYSIOTHERAPIST' as ProviderRole, label: 'Physiotherapist' },
                      { id: 'PHLEBOTOMIST' as ProviderRole, label: 'Phlebotomist' },
                    ].map((r) => (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                          role === r.id
                            ? 'border-[#065F46] bg-[#ECFDF5] text-[#065F46] ring-1 ring-[#065F46]'
                            : 'border-[#D9ECE7] text-slate-600 hover:border-[#A7F3D0]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Professional Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Direct Phone (For Dispatch Alerts)</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Specialty / Field</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-[#D9ECE7]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors"
                  >
                    <span>Next: Qualifications</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Qualifications & Experience */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-heading font-bold text-[#102723]">Qualifications &amp; Clinical Experience</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Detail your medical degrees, certifications, and years in active practice.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Degrees &amp; Formal Qualifications</label>
                  <input
                    type="text"
                    required
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="e.g. MBBS, MD (Internal Medicine) or B.Sc Nursing"
                    className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Years of Clinical Experience</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={45}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Primary Hospital / Clinic Affiliation</label>
                    <input
                      type="text"
                      placeholder="e.g. Springfield Memorial Hospital (Optional)"
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-[#D9ECE7]">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#D9ECE7] px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-[#F2F8F5]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors"
                  >
                    <span>Next: Council Registration</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Council Registration & License */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-heading font-bold text-[#102723]">Medical Council &amp; Licensing Information</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Primary source verification will be checked directly with this governing board.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Registration / License Number *</label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. MED-CA-928104"
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm font-mono text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Licensing Board / Council Name *</label>
                    <input
                      type="text"
                      required
                      value={registrationCouncil}
                      onChange={(e) => setRegistrationCouncil(e.target.value)}
                      placeholder="e.g. Medical Board of California"
                      className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-[#ECFDF5] border border-[#D1FAE5] p-4 flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#065F46] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#065F46]">
                    <strong className="font-bold">Automated Council Verification:</strong> Vellora securely queries the official state health registry. Please ensure the license number matches your legal identification exactly.
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-[#D9ECE7]">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#D9ECE7] px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-[#F2F8F5]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors"
                  >
                    <span>Next: Practice Zones &amp; Shifts</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Service Zones & Shift Preferences */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-heading font-bold text-[#102723]">Service Zones &amp; Shift Preferences</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Select the geographical areas you are willing to travel to and your preferred shift slots.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#065F46]" />
                    <span>Eligible Service Locations (Select all that apply)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {allLocations.map((loc) => {
                      const isSelected = selectedLocations.includes(loc);
                      return (
                        <button
                          type="button"
                          key={loc}
                          onClick={() => toggleLocation(loc)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-[#065F46] bg-[#ECFDF5] text-[#065F46] font-bold'
                              : 'border-[#D9ECE7] bg-[#F7FBF9] text-slate-600 hover:border-[#A7F3D0]'
                          }`}
                        >
                          <span>{loc}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-[#065F46]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#065F46]" />
                    <span>Preferred Shift Windows</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {allShifts.map((shift) => {
                      const isSelected = selectedShifts.includes(shift);
                      return (
                        <button
                          type="button"
                          key={shift}
                          onClick={() => toggleShift(shift)}
                          className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-[#065F46] bg-[#ECFDF5] text-[#065F46] font-bold'
                              : 'border-[#D9ECE7] bg-[#F7FBF9] text-slate-600 hover:border-[#A7F3D0]'
                          }`}
                        >
                          <span>{shift}</span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-[#065F46]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-[#D9ECE7]">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#D9ECE7] px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-[#F2F8F5]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(5)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-colors"
                  >
                    <span>Next: Document Verification</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Document Uploads & Submit */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-heading font-bold text-[#102723]">Credential Documents &amp; Attestation</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Please review your uploaded credential documents before submitting for CMO peer review.</p>
                </div>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-[#D9ECE7] bg-[#F7FBF9]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-[#D9ECE7] text-[#065F46]">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#102723]">{doc.title}</p>
                          <p className="text-[10px] text-slate-500">{doc.fileName} • {doc.size}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[10px] font-bold text-[#065F46]">
                        <CheckCircle2 className="h-3 w-3" />
                        Ready
                      </span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-4 text-xs text-slate-600 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-[#065F46] focus:ring-[#065F46]" />
                    <p className="leading-snug">
                      <strong className="text-[#102723]">Clinical Attestation:</strong> I hereby certify that the medical licenses and degrees provided are authentic, unencumbered, and in good standing.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <input type="checkbox" required defaultChecked className="mt-0.5 rounded text-[#065F46] focus:ring-[#065F46]" />
                    <p className="leading-snug">
                      <strong className="text-[#102723]">Dispatch Commitment:</strong> I agree to adhere to Vellora bedside hygiene, 4-digit security PIN verification, and digital charting standards.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-[#D9ECE7]">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#D9ECE7] px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-[#F2F8F5]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition-colors disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Submitting Application...' : 'Submit Credentialing Dossier'}</span>
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
