'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import {
  Stethoscope,
  Activity,
  HeartHandshake,
  UserCheck,
  Syringe,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export default function ProviderLoginPage() {
  const router = useRouter();
  const { switchRole } = useAuth();
  const [phone, setPhone] = useState('+1 (555) 345-6789');
  const [selectedRole, setSelectedRole] = useState<UserRole>('DOCTOR');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      role: 'DOCTOR' as UserRole,
      name: 'Dr. Maya Patel',
      title: 'Visiting Physician (Internal Med)',
      phone: '+1 (555) 234-5678',
      icon: Stethoscope,
      status: 'APPROVED',
    },
    {
      role: 'NURSE' as UserRole,
      name: 'Nurse Sarah Jenkins',
      title: 'Registered Nurse (BSN)',
      phone: '+1 (555) 345-6789',
      icon: Activity,
      status: 'APPROVED',
    },
    {
      role: 'CARETAKER' as UserRole,
      name: 'Priya Sharma',
      title: 'Senior Care Attendant',
      phone: '+1 (555) 456-7890',
      icon: HeartHandshake,
      status: 'APPROVED',
    },
    {
      role: 'PHYSIOTHERAPIST' as UserRole,
      name: 'David Kim',
      title: 'Licensed Physical Therapist (BPT)',
      phone: '+1 (555) 567-8901',
      icon: UserCheck,
      status: 'APPROVED',
    },
    {
      role: 'PHLEBOTOMIST' as UserRole,
      name: 'Alex Rivera',
      title: 'Mobile Phlebotomy Specialist',
      phone: '+1 (555) 678-9012',
      icon: Syringe,
      status: 'APPROVED',
    },
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter a valid practitioner phone number');
      return;
    }
    setError('');
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '4829' || otp === '1234' || otp.length === 4) {
      switchRole(selectedRole);
      router.push('/provider/dashboard');
    } else {
      setError('Invalid verification code. Please enter demo code: 4829');
    }
  };

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    router.push('/provider/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7FBF9] text-[#102723] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-4 group" aria-label="Velora Healthcare Home">
          <img
            src="/assets/logo-dark.png"
            alt="Velora Healthcare"
            className="h-10 w-auto mx-auto object-contain group-hover:opacity-90 transition-opacity"
          />
        </Link>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-3 py-0.5 text-xs font-bold text-[#065F46] mb-2">
          <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
          <span>CLINICAL WORKSTATION SIGN IN</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#102723]">
          Provider Portal Access
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500">
          Access your daily home visit itinerary, patient vitals telemetry, and weekly settlements.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* OTP Sign-In Card */}
        <div className="rounded-[26px] border border-[#D9ECE7] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(6,95,70,0.06)]">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Provider Specialty
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                >
                  <option value="DOCTOR">Doctor / Visiting Physician</option>
                  <option value="NURSE">Registered Nurse (RN)</option>
                  <option value="CARETAKER">Patient Caretaker / Attendant</option>
                  <option value="PHYSIOTHERAPIST">Licensed Physiotherapist</option>
                  <option value="PHLEBOTOMIST">Mobile Phlebotomist</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-3.5 py-2.5 text-xs sm:text-sm text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition-colors"
              >
                <span>Send Secure Access Code</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Enter Verification Code
                  </label>
                  <span className="text-[11px] font-mono text-[#065F46] bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 rounded-md font-bold">
                    Demo PIN: 4829
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="4829"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] px-4 py-2.5 text-[#102723] focus:border-[#065F46] focus:bg-white focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#065F46] hover:bg-[#054d39] py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-900/10 transition-colors"
              >
                <span>Verify &amp; Enter Workstation</span>
                <CheckCircle2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 transition-colors mt-2"
              >
                ← Change Phone Number
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-[#D9ECE7] text-center">
            <p className="text-xs text-slate-500">
              Not yet registered with Vellora?{' '}
              <Link href="/provider/register" className="font-bold text-[#065F46] hover:underline">
                Apply as a Healthcare Provider
              </Link>
            </p>
          </div>
        </div>

        {/* 1-Click Fast Clinician Demo Switcher */}
        <div className="rounded-[22px] border border-[#D9ECE7] bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-[#065F46]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#102723]">
              Instant Demo Workstation Login
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            Click any active practitioner below to immediately enter their dedicated workstation dashboard:
          </p>
          <div className="space-y-2">
            {demoAccounts.map((acc) => {
              const AccIcon = acc.icon;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickLogin(acc.role)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] hover:bg-[#ECFDF5] hover:border-[#A7F3D0] transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-[#D9ECE7] text-[#065F46] group-hover:scale-105 transition-transform">
                      <AccIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#102723] leading-tight">{acc.name}</p>
                      <p className="text-[10px] text-slate-500">{acc.title}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#065F46] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Enter <ChevronRight className="h-3 w-3" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
