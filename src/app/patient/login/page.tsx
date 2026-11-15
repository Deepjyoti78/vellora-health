'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

function PatientLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isAuthLoading, validateInternalRedirect, simulatedOtp } = useAuth();

  const redirectParam = searchParams.get('redirect');
  const safeDestination = validateInternalRedirect(redirectParam, '/patient/dashboard');

  const [contactInput, setContactInput] = useState('+1 (555) 234-5678');
  const [step, setStep] = useState<'CONTACT' | 'OTP'>('CONTACT');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If visitor is already authenticated, redirect immediately to intended destination
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(safeDestination);
    }
  }, [isAuthLoading, isAuthenticated, safeDestination, router]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) {
      setError('Please enter a valid mobile number or email address.');
      return;
    }
    setError('');
    setStep('OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp !== simulatedOtp && otp !== '1234') {
      setError(`Invalid verification code. (Simulator code: ${simulatedOtp})`);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      login(contactInput, 'PATIENT');
      setIsSubmitting(false);
      router.push(safeDestination);
    }, 350);
  };

  const handleDemoLogin = (email: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      login(email, 'PATIENT');
      setIsSubmitting(false);
      router.push(safeDestination);
    }, 300);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAF9] p-4 py-12">
      <div className="w-full max-w-md rounded-[24px] border border-[#E2EBE7] bg-white p-7 sm:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {/* Brand Logo & Header */}
        <div className="text-center">
          <Link href="/" className="inline-block group mb-2" aria-label="Velora Healthcare Home">
            <img
              src="/assets/logo-dark.png"
              alt="Velora Healthcare"
              className="h-9 w-auto mx-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>

          <h1 className="mt-5 font-heading text-2xl font-bold text-[#102820]">
            {step === 'CONTACT' ? 'Patient Portal Login' : 'Enter Verification Code'}
          </h1>

          <p className="mt-1.5 text-xs text-[#5E7171] leading-relaxed">
            {step === 'CONTACT'
              ? 'Access in-home medical visits, active consultations, and personal health records.'
              : `A 4-digit code was sent to ${contactInput}`}
          </p>
        </div>

        {/* Destination Intent Notice if redirected from booking or service */}
        {redirectParam && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] p-2.5 text-xs text-[#065F46] font-medium">
            <Sparkles className="h-4 w-4 shrink-0 text-[#065F46]" />
            <span className="truncate">
              After logging in, you will return to your pending request.
            </span>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {step === 'CONTACT' ? (
          <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700">
                Mobile Phone or Email
              </label>
              <div className="relative mt-1.5 flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 stroke-[2] pointer-events-none" />
                <input
                  type="text"
                  required
                  value={contactInput}
                  onChange={(e) => setContactInput(e.target.value)}
                  placeholder="+1 (555) 000-0000 or name@example.com"
                  className="w-full rounded-xl border border-[#D1DCD6] bg-[#FAFCFB] py-2.5 pl-10 pr-3.5 text-xs text-gray-900 placeholder:text-slate-400 focus:border-[#064E3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
            >
              <span>Send Verification Code</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>

            {/* Quick Demo Login Preset */}
            <div className="mt-5 rounded-2xl bg-[#F4F9F6] border border-[#E2EBE7] p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#102820] text-[11px] uppercase tracking-wider">
                  Test Sandbox Profile
                </span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold">
                  Verified Patient
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#5E7171]">
                <strong>Eleanor Vance</strong> (eleanor.vance@example.com)
              </p>
              <button
                type="button"
                onClick={() => handleDemoLogin('eleanor.vance@example.com')}
                disabled={isSubmitting}
                className="mt-2.5 w-full rounded-lg bg-white border border-[#D1DCD6] py-1.5 text-[11px] font-bold text-[#065F46] hover:bg-[#ECFDF5] transition-colors text-center shadow-2xs"
              >
                Instant 1-Click Patient Sign In
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-center text-xs font-bold text-gray-700">
                Enter 4-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="4829"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2 w-full rounded-xl border border-[#D1DCD6] bg-[#FAFCFB] py-3 text-center text-xl font-bold tracking-widest text-[#102820] focus:border-[#064E3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/10"
              />
            </div>

            <p className="text-center text-[11px] text-slate-500">
              Developer simulator passcode: <strong className="text-[#065F46]">{simulatedOtp}</strong>
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
            >
              <span>Verify &amp; Continue</span>
              <CheckCircle2 className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
              <button
                type="button"
                onClick={() => setStep('CONTACT')}
                className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Change Contact</span>
              </button>
              <button
                type="button"
                onClick={() => setOtp(simulatedOtp)}
                className="font-bold text-[#065F46] hover:underline"
              >
                Auto-fill Code
              </button>
            </div>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 border-t border-[#E2EBE7] pt-5 text-center text-xs text-[#5E7171]">
          <span>New to Vellora Health? </span>
          <Link
            href={`/patient/register${redirectParam ? `?redirect=${encodeURIComponent(safeDestination)}` : ''}`}
            className="font-bold text-[#064E3B] hover:underline"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PatientLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAF9]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#064E3B] border-t-transparent" />
        </div>
      }
    >
      <PatientLoginContent />
    </Suspense>
  );
}
