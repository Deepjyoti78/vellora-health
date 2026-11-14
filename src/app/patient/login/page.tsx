'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/common/Icon';

export default function PatientLoginPage() {
  const router = useRouter();
  const { login, simulatedOtp } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState('+1 (555) 234-5678');
  const [step, setStep] = useState<'CONTACT' | 'OTP'>('CONTACT');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setError('Please enter a valid phone number or email address.');
      return;
    }
    setError('');
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== simulatedOtp && otp !== '1234') {
      setError(`Invalid verification code. (Development Simulator Code: ${simulatedOtp})`);
      return;
    }
    login(phoneOrEmail, 'PATIENT');
    router.push('/patient/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] p-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-black text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#116b70] text-white">
              +
            </span>
            <span>Vellora Health</span>
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
            {step === 'CONTACT' ? 'Patient Portal Login' : 'Enter 4-Digit Code'}
          </h1>
          <p className="mt-2 text-xs text-gray-500">
            {step === 'CONTACT'
              ? 'Access in-home visits, doctor consultations, and health records.'
              : `We sent a security verification code to ${phoneOrEmail}`}
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-center text-xs font-semibold text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {step === 'CONTACT' ? (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <label className="block text-xs font-bold text-gray-700">
              Mobile Phone or Email
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="+1 (555) 000-0000 or name@example.com"
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </label>

            <button type="submit" className="button button-dark w-full justify-center">
              Send OTP Code <Icon name="arrow-right" size="xs" />
            </button>

            <div className="mt-4 rounded-xl bg-teal-50 p-3 text-xs text-teal-900 border border-teal-100">
              <span className="font-bold">Test Sandbox:</span> Pre-loaded demo user is <strong>Eleanor Vance</strong> (+1 555-234-5678). Click Send to continue.
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <label className="block text-center text-xs font-bold text-gray-700">
              Verification Code
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="4829"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2 w-full rounded-xl border border-gray-300 bg-[#fbfcfc] py-3 text-center text-xl font-bold tracking-widest text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </label>

            <p className="text-center text-[11px] text-gray-500">
              Dev OTP Code: <strong className="text-teal-700">{simulatedOtp}</strong>
            </p>

            <button type="submit" className="button button-dark w-full justify-center">
              Verify &amp; Continue <Icon name="check" size="xs" />
            </button>

            <div className="flex justify-between text-xs text-gray-500 pt-2">
              <button
                type="button"
                onClick={() => setStep('CONTACT')}
                className="text-gray-600 hover:underline"
              >
                ← Change Number
              </button>
              <button
                type="button"
                onClick={() => alert(`OTP re-sent: ${simulatedOtp}`)}
                className="font-semibold text-teal-700 hover:underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
          <span>New to Vellora Health? </span>
          <Link href="/patient/register" className="font-bold text-teal-700 hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
