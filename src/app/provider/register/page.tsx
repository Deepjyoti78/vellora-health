'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import {
  Stethoscope,
  Activity,
  HeartHandshake,
  UserCheck,
  Syringe,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

type ProviderRole = 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHYSIOTHERAPIST' | 'PHLEBOTOMIST';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerProvider } = useAuth();

  const initialRoleParam = searchParams.get('role')?.toUpperCase();
  const validRoles: ProviderRole[] = ['DOCTOR', 'NURSE', 'CARETAKER', 'PHYSIOTHERAPIST', 'PHLEBOTOMIST'];
  const defaultRole: ProviderRole = validRoles.includes(initialRoleParam as ProviderRole)
    ? (initialRoleParam as ProviderRole)
    : 'DOCTOR';

  const [role, setRole] = useState<ProviderRole>(defaultRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [registrationCouncil, setRegistrationCouncil] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [serviceLocation, setServiceLocation] = useState('Springfield Metro');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    { id: 'DOCTOR' as ProviderRole, label: 'Doctor / Physician', icon: Stethoscope, tag: 'MBBS/MD' },
    { id: 'NURSE' as ProviderRole, label: 'Registered Nurse', icon: Activity, tag: 'BSN/RN' },
    { id: 'CARETAKER' as ProviderRole, label: 'Patient Caretaker', icon: HeartHandshake, tag: 'CNA/Care' },
    { id: 'PHYSIOTHERAPIST' as ProviderRole, label: 'Physiotherapist', icon: UserCheck, tag: 'BPT/MPT' },
    { id: 'PHLEBOTOMIST' as ProviderRole, label: 'Phlebotomist', icon: Syringe, tag: 'DMLT/MLT' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Register provider in auth context and local DB
      const user = registerProvider({
        name,
        email,
        phone,
        role,
        specialty: role === 'DOCTOR' ? 'Internal Medicine & Geriatrics' : 'General Bedside Care',
        qualification: role === 'DOCTOR' ? 'MBBS, MD' : role === 'NURSE' ? 'B.Sc Nursing' : role === 'PHYSIOTHERAPIST' ? 'BPT' : role === 'PHLEBOTOMIST' ? 'DMLT' : 'Certified Geriatric Care Assistant',
      });

      // Also create an application record for admin tracking
      const existingApps = db.getProviderApplications().filter((a) => a.email.toLowerCase() === email.toLowerCase());
      if (existingApps.length === 0) {
        db.createProviderApplication({
          userId: user.id,
          fullName: name,
          email,
          phone,
          role,
          state: 'Oregon',
          city: 'Springfield',
          licenseNumber: licenseNumber || `LIC-${Math.floor(100000 + Math.random() * 900000)}`,
          registrationCouncil: registrationCouncil || 'State Healthcare Licensing Board',
          experienceYears: Number(experienceYears) || 5,
          qualification: role === 'DOCTOR' ? 'MBBS, MD (Internal Medicine)' : role === 'NURSE' ? 'B.Sc Nursing' : role === 'PHYSIOTHERAPIST' ? 'Bachelor of Physiotherapy (BPT)' : role === 'PHLEBOTOMIST' ? 'Diploma in Medical Laboratory Technology' : 'Certified Geriatric Care Assistant',
          specialty: role === 'DOCTOR' ? 'Internal Medicine & Geriatrics' : 'General Bedside Care',
          serviceLocations: [serviceLocation],
          documents: [
            {
              id: 'doc-id-card',
              title: 'Government Photo ID Card',
              type: 'GOVT_ID',
              size: '1.8 MB',
              status: 'PENDING',
              uploadedAt: new Date().toISOString(),
            },
            {
              id: 'doc-council-license',
              title: 'Medical Council Registration Certificate',
              type: 'COUNCIL_CERTIFICATE',
              size: '2.4 MB',
              status: 'PENDING',
              uploadedAt: new Date().toISOString(),
            },
          ],
          adminNotes: 'New practitioner application submitted via public portal.',
        });
      }

      // Route to multi-step onboarding wizard
      router.push('/provider/onboarding');
    } catch (err: unknown) {
      console.error(err);
      setError('An error occurred during registration. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FBF9] text-[#102723] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#065F46] text-white font-black text-xl shadow-sm">
            +
          </span>
          <span className="text-2xl font-black tracking-tight text-[#102723]">
            VELLORA HEALTH
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-0.5 text-xs font-bold text-[#065F46] mb-2">
          <Sparkles className="h-3.5 w-3.5 text-[#10B981]" />
          <span>PRACTITIONER ENROLLMENT</span>
        </div>
        <h1 className="text-3xl font-heading font-bold text-[#102723]">Apply as a Healthcare Provider</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Start your credential verification to deliver verified bedside care across our home care network.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="rounded-[26px] border border-[#D9ECE7] bg-white p-6 sm:p-10 shadow-[0_4px_24px_rgba(6,95,70,0.06)]">
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Select Your Clinical Profession
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {roles.map((r) => {
                  const RoleIcon = r.icon;
                  const isSelected = role === r.id;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#065F46] bg-[#ECFDF5] text-[#065F46] ring-2 ring-[#065F46]/20'
                          : 'border-[#D9ECE7] bg-[#F7FBF9] text-slate-700 hover:border-[#A7F3D0]'
                      }`}
                    >
                      <RoleIcon className={`h-5 w-5 mb-1.5 ${isSelected ? 'text-[#065F46]' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold leading-tight">{r.label}</span>
                      <span className="text-[10px] text-slate-500 font-medium mt-0.5">{r.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Maya Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. maya.patel@vellora.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Years of Experience</label>
                <select
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                >
                  <option value="1">1 - 2 Years</option>
                  <option value="3">3 - 5 Years</option>
                  <option value="7">6 - 10 Years</option>
                  <option value="12">10+ Years</option>
                </select>
              </div>
            </div>

            {/* License & Council Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {role === 'DOCTOR'
                    ? 'Medical License Number'
                    : role === 'NURSE'
                    ? 'Nursing Registration Number'
                    : role === 'PHYSIOTHERAPIST'
                    ? 'PT License Number'
                    : role === 'PHLEBOTOMIST'
                    ? 'Phlebotomy Certification ID'
                    : 'Aadhaar / ID Card Number'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. MED-894120"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {role === 'CARETAKER' ? 'Certification Authority' : 'Registration Council'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. State Medical Council"
                  value={registrationCouncil}
                  onChange={(e) => setRegistrationCouncil(e.target.value)}
                  className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Practice Service Area</label>
              <input
                type="text"
                placeholder="e.g. Springfield Metro, North Suburbs, Downtown"
                value={serviceLocation}
                onChange={(e) => setServiceLocation(e.target.value)}
                className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
              />
              <p className="mt-1 text-[11px] text-slate-500">
                You will only receive home appointment dispatches within your chosen region.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition-colors disabled:opacity-50"
              >
                <span>{isLoading ? 'Creating Application...' : 'Continue to Onboarding & Verification'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#D9ECE7] text-center">
            <p className="text-xs text-slate-500">
              Already have an active provider profile?{' '}
              <Link href="/provider/login" className="font-bold text-[#065F46] hover:underline">
                Sign in to Provider Portal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProviderRegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7FBF9] flex items-center justify-center text-sm font-bold text-[#065F46]">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
