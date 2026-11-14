'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Icon } from '@/components/common/Icon';

export default function ProviderLoginPage() {
  const router = useRouter();
  const { switchRole } = useAuth();
  const [phone, setPhone] = useState('+1 (555) 345-6789');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '4829' || otp === '1234' || otp.length === 4) {
      switchRole('DOCTOR');
      router.push('/provider/dashboard');
    } else {
      setError('Invalid code. Use test OTP: 4829');
    }
  };

  const handleQuickSwitch = (role: UserRole) => {
    switchRole(role);
    router.push('/provider/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-[#11191B] px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#116b70] text-white font-black text-lg">
            +
          </span>
          <span className="text-xl font-black tracking-tight text-white">
            VELLORA HEALTH
          </span>
        </Link>
        <span className="mt-2 block text-xs font-bold uppercase tracking-widest text-[#116b70]">
          Healthcare Provider Network
        </span>
        <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
          Practitioner Sign In
        </h2>
        <p className="mt-1 text-xs text-gray-400">
          Access your daily home clinical itinerary, shift dispatch, and clinical documentation.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300">
                  Registered Practitioner Phone
                </label>
                <div className="mt-1 relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="block w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#116b70] focus:ring-1 focus:ring-[#116b70]"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#116b70] py-3 text-xs font-bold text-white shadow-lg hover:bg-[#0d5559] transition-colors"
              >
                Send Secure Login Code
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-300">Enter SMS Code</label>
                  <span className="text-[11px] font-mono text-[#116b70] bg-[#116b70]/20 px-2 py-0.5 rounded">
                    Test OTP: 4829
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4829"
                  className="mt-1 block w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-center text-xl font-mono tracking-widest text-white focus:border-[#116b70] focus:ring-1 focus:ring-[#116b70]"
                />
              </div>

              {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-xl bg-[#116b70] py-3 text-xs font-bold text-white shadow-lg hover:bg-[#0d5559] transition-colors"
              >
                Verify & Enter Provider Dashboard
              </button>

              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="w-full text-center text-xs text-gray-400 hover:text-white"
              >
                Change Phone Number
              </button>
            </form>
          )}

          {/* Quick Switch Persona Buttons */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">
              1-Click Instant Persona Sign-In:
            </span>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickSwitch('DOCTOR')}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-left text-white hover:bg-white/10 transition-colors"
              >
                <div className="font-bold text-emerald-400">Dr. Maya Patel</div>
                <div className="text-[10px] text-gray-400">Doctor (MD)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('NURSE')}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-left text-white hover:bg-white/10 transition-colors"
              >
                <div className="font-bold text-blue-400">Sarah Jenkins</div>
                <div className="text-[10px] text-gray-400">Registered Nurse (RN)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('CARETAKER')}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-left text-white hover:bg-white/10 transition-colors"
              >
                <div className="font-bold text-amber-400">James Thornton</div>
                <div className="text-[10px] text-gray-400">Senior Caretaker</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('PHLEBOTOMIST')}
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-left text-white hover:bg-white/10 transition-colors"
              >
                <div className="font-bold text-purple-400">Alex Rivera</div>
                <div className="text-[10px] text-gray-400">Phlebotomist (CPT)</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            Interested in joining our medical network?{' '}
            <Link href="/provider/onboarding" className="font-bold text-[#116b70] hover:underline">
              Apply for Credentialing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
