'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

function PatientRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerPatient, isAuthenticated, isAuthLoading, validateInternalRedirect } = useAuth();

  const redirectParam = searchParams.get('redirect');
  const safeDestination = validateInternalRedirect(redirectParam, '/patient/dashboard');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If visitor is already authenticated, redirect immediately
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace(safeDestination);
    }
  }, [isAuthLoading, isAuthenticated, safeDestination, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter a mobile phone number for visit coordination.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('Please accept the Terms of Service to register your account.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      registerPatient({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      });
      setIsSubmitting(false);
      router.push(safeDestination);
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAF9] p-4 py-12">
      <div className="w-full max-w-lg rounded-[24px] border border-[#E2EBE7] bg-white p-7 sm:p-9 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-block group mb-2" aria-label="Velora Healthcare Home">
            <img
              src="/assets/logo-dark.png"
              alt="Velora Healthcare"
              className="h-9 w-auto mx-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>
          <h1 className="mt-5 font-heading text-2xl font-bold text-[#102820]">
            Create Patient Account
          </h1>
          <p className="mt-1.5 text-xs text-[#5E7171] leading-relaxed">
            Register your profile to book verified home doctor visits, clinical nursing, and doorstep lab diagnostics.
          </p>
        </div>

        {/* Intent Preservation Notice */}
        {redirectParam && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] p-2.5 text-xs text-[#065F46] font-medium">
            <Sparkles className="h-4 w-4 shrink-0 text-[#065F46]" />
            <span className="truncate">
              Your pending care request will resume right after registration.
            </span>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Streamlined Registration Form (Clinical fields decoupled from initial signup) */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700">
              Full Legal Name
            </label>
            <div className="relative mt-1 flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-slate-400 stroke-[2] pointer-events-none" />
              <input
                type="text"
                required
                placeholder="e.g. Clara Oswald"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full rounded-xl border border-[#D1DCD6] bg-[#FAFCFB] py-2.5 pl-10 pr-3.5 text-xs text-gray-900 placeholder:text-slate-400 focus:border-[#064E3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1 flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 stroke-[2] pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-[#D1DCD6] bg-[#FAFCFB] py-2.5 pl-10 pr-3.5 text-xs text-gray-900 placeholder:text-slate-400 focus:border-[#064E3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700">
                Mobile Phone
              </label>
              <div className="relative mt-1 flex items-center">
                <Phone className="absolute left-3.5 h-4 w-4 text-slate-400 stroke-[2] pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-[#D1DCD6] bg-[#FAFCFB] py-2.5 pl-10 pr-3.5 text-xs text-gray-900 placeholder:text-slate-400 focus:border-[#064E3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700">
              Create Password
            </label>
            <div className="relative mt-1 flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-slate-400 stroke-[2] pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full rounded-xl border border-[#D1DCD6] bg-[#FAFCFB] py-2.5 pl-10 pr-10 text-xs text-gray-900 placeholder:text-slate-400 focus:border-[#064E3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#064E3B]/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-start gap-2 pt-1 text-xs text-slate-600">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#064E3B] focus:ring-[#064E3B]"
            />
            <label htmlFor="terms" className="cursor-pointer">
              I agree to the{' '}
              <span className="font-bold text-[#064E3B] hover:underline">Terms of Healthcare Service</span> and{' '}
              <span className="font-bold text-[#064E3B] hover:underline">Privacy Policy</span>. Clinical details can be completed inside your profile anytime.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors mt-2"
          >
            <span>Complete Registration &amp; Continue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 border-t border-[#E2EBE7] pt-5 text-center text-xs text-[#5E7171]">
          <span>Already registered with Vellora? </span>
          <Link
            href={`/patient/login${redirectParam ? `?redirect=${encodeURIComponent(safeDestination)}` : ''}`}
            className="font-bold text-[#064E3B] hover:underline"
          >
            Sign In with OTP
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PatientRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F8FAF9]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#064E3B] border-t-transparent" />
        </div>
      }
    >
      <PatientRegisterContent />
    </Suspense>
  );
}
