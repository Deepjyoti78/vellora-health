'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  redirectUrl?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
  redirectUrl,
}) => {
  const router = useRouter();
  const { login, switchRole, validateInternalRedirect } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scroll and support Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email or registered phone number.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(emailOrPhone, 'PATIENT');
      switchRole('PATIENT');

      setSuccessMsg('Welcome back! Signed in to your patient account.');
      setTimeout(() => {
        onClose();
        if (redirectUrl) {
          router.push(validateInternalRedirect(redirectUrl, '/patient/dashboard'));
        }
      }, 500);
    }, 450);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter a valid mobile number or email.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(emailOrPhone, 'PATIENT');
      switchRole('PATIENT');
      setSuccessMsg('Account created successfully! Welcome to Vellora Health.');
      setTimeout(() => {
        onClose();
        if (redirectUrl) {
          router.push(validateInternalRedirect(redirectUrl, '/patient/dashboard'));
        }
      }, 500);
    }, 500);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/65 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        {/* Modal Dialog Card: Modern 2-Column Split Layout */}
        <div className="relative my-auto w-full max-w-[820px] transform overflow-hidden rounded-[26px] border border-[#E2EBE7] bg-white shadow-2xl transition-all z-10 animate-scale-in text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            {/* Left Side: Healthcare Consultation Image & Brand Atmosphere (Hidden on small mobile for sleek responsiveness) */}
            <div className="hidden md:flex md:col-span-5 relative flex-col justify-between overflow-hidden p-7 text-white select-none">
              {/* Background Consultation Image */}
              <img
                src="/assets/Warm%20Doctor-Patient%20Consultation.png"
                alt="Warm doctor patient consultation"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              {/* Rich Emerald Gradient Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#06241C]/95 via-[#0A3327]/60 to-[#0A3327]/35"
                aria-hidden="true"
              />

              {/* Top Pill Accent */}
              <div className="relative z-10 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 px-3 py-1 text-[11px] font-bold text-white shadow-xs">
                  <Sparkles className="h-3 w-3 text-[#A7F3D0]" />
                  <span>Compassionate Care</span>
                </span>
              </div>

              {/* Bottom Testimonial & Value Statement */}
              <div className="relative z-10">
                <div className="flex items-center gap-1 mb-2 text-[#A7F3D0]">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xs">★</span>
                  ))}
                  <span className="text-[11px] text-white/90 font-semibold ml-1.5">4.9 / 5 Rating</span>
                </div>
                <h3 className="font-heading text-lg font-bold leading-snug text-white">
                  Healthcare That Comes to You
                </h3>
                <p className="mt-1.5 text-xs text-white/80 leading-relaxed">
                  Unhurried examinations, comprehensive bedside diagnostics, and verified specialist doctors in the comfort of your living room.
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2 text-[11px] text-white/75 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#34D399]" />
                  <span>100% Council-Licensed Physicians</span>
                </div>
              </div>
            </div>

            {/* Right Side: Clean, Focused Authentication Form */}
            <div className="md:col-span-7 flex flex-col justify-between p-6 sm:p-7 bg-white">
              <div>
                {/* Header Row: Brand badge & Close button */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F2]">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/assets/logo-dark.png"
                      alt="Velora Healthcare"
                      className="h-6 w-auto object-contain"
                    />
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                      <ShieldCheck className="h-3 w-3" />
                      Secure Portal
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F8F5] text-slate-500 hover:bg-[#E2EBE7] hover:text-[#102820] transition-colors"
                    aria-label="Close authentication modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Heading & Subtitle */}
                <div className="mt-4 mb-4 text-left">
                  <h2
                    id="auth-modal-title"
                    className="font-heading text-xl font-extrabold text-[#102820] tracking-tight leading-snug"
                  >
                    {mode === 'signin' ? 'Sign In to Your Account' : 'Create Patient Account'}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {mode === 'signin'
                      ? 'Access your doorstep medical records, upcoming appointments, and personal health metrics.'
                      : 'Join thousands of families receiving licensed, unhurried healthcare right at home.'}
                  </p>
                </div>

                {/* Segmented Mode Toggle: Sign In vs Create Account */}
                <div className="flex rounded-xl bg-[#F2F8F5] p-1 mb-4 border border-[#E2EBE7]">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                      mode === 'signin'
                        ? 'bg-white text-[#064E3B] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${
                      mode === 'signup'
                        ? 'bg-white text-[#064E3B] shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {/* Feedback Messages */}
                {errorMsg && (
                  <div className="mb-3.5 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs font-semibold text-rose-700 animate-fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {successMsg && (
                  <div className="mb-3.5 flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] p-2.5 text-xs font-semibold text-[#065F46] animate-fade-in">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#065F46]" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Form Body */}
                <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3.5">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-xs font-semibold text-[#102820] mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Eleanor Vance"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2.5 pl-10 pr-3 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#102820] mb-1">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="name@example.com or +1 (555) 000-0000"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2.5 pl-10 pr-3 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#102820]">
                        Password
                      </label>
                      {mode === 'signin' && (
                        <button
                          type="button"
                          onClick={() => alert('Password reset instructions will be sent to your registered email or phone.')}
                          className="text-[11px] font-semibold text-[#065F46] hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2.5 pl-10 pr-10 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-[#064E3B] py-3 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{mode === 'signin' ? 'Sign In to My Account' : 'Create Free Patient Account'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Security & Compliance Trust Badges */}
              <div className="mt-6 pt-4 border-t border-[#F0F5F2] flex items-center justify-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-slate-400" />
                  256-bit Encryption
                </span>
                <span>•</span>
                <span>HIPAA Compliant</span>
                <span>•</span>
                <span>Verified Clinicians</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
