'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
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
  RotateCcw,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  redirectUrl?: string;
}

type AuthStep = 'form' | 'otp' | 'confirmed';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
  redirectUrl,
}) => {
  const router = useRouter();
  const { login, registerPatient, simulatedOtp } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Workflow state: form -> otp -> confirmed
  const [step, setStep] = useState<AuthStep>('form');
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);

  // Form input states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP states
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState<number>(30);
  const [confirmedUserName, setConfirmedUserName] = useState('');

  // Status & loading states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync defaultMode when modal re-opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setStep('form');
      setErrorMsg('');
      setSuccessMsg('');
      setOtpDigits(['', '', '', '']);
      setResendTimer(30);
    }
  }, [isOpen, defaultMode]);

  // Resend countdown timer
  useEffect(() => {
    if (step !== 'otp' || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  // Focus first OTP input when transitioning to OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

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

  // Step 1: Submit Form (Sign In or Sign Up) -> Transitions to OTP
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'signup') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setErrorMsg('Please enter your full name (at least 2 characters).');
        return;
      }
      if (!emailOrPhone.trim()) {
        setErrorMsg('Please enter a valid mobile number or email address.');
        return;
      }
      if (!password.trim() || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
    } else {
      if (!emailOrPhone.trim()) {
        setErrorMsg('Please enter your email, registered phone number, or name.');
        return;
      }
      if (!password.trim()) {
        setErrorMsg('Please enter your password.');
        return;
      }
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setResendTimer(30);
      setSuccessMsg(`Verification code sent to ${emailOrPhone.trim()}`);
    }, 400);
  };

  // OTP digit input handler
  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleaned;
    setOtpDigits(updated);
    setErrorMsg('');

    if (cleaned && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const updated = ['', '', '', ''];
      for (let i = 0; i < 4; i++) {
        updated[i] = pasted[i] || '';
      }
      setOtpDigits(updated);
      const nextIdx = Math.min(pasted.length, 3);
      otpInputsRef.current[nextIdx]?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtpDigits(['4', '8', '2', '9']);
    setErrorMsg('');
    setTimeout(() => {
      otpInputsRef.current[3]?.focus();
    }, 50);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setOtpDigits(['', '', '', '']);
    setErrorMsg('');
    setSuccessMsg('A new verification code has been dispatched: 4829');
    setTimeout(() => {
      otpInputsRef.current[0]?.focus();
    }, 50);
  };

  // Step 2: Verify OTP -> Transitions to Confirmed -> Redirects to Home
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter all 4 digits of the verification code.');
      return;
    }

    // Accept valid demo code 4829 or 1234
    if (enteredOtp !== simulatedOtp && enteredOtp !== '4829' && enteredOtp !== '1234') {
      setErrorMsg('Invalid verification code. Please enter demo code 4829.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      let displayName = fullName.trim();

      if (mode === 'signup') {
        const isEmail = emailOrPhone.includes('@');
        const user = registerPatient({
          name: fullName.trim(),
          email: isEmail ? emailOrPhone.trim() : '',
          phone: !isEmail ? emailOrPhone.trim() : '',
        });
        displayName = user.name;
      } else {
        // Sign In: login with entered credentials and preserve custom registered name
        login(emailOrPhone.trim(), 'PATIENT', fullName.trim() || undefined);

        // Retrieve active user record to get exact stored name
        const cleanQuery = emailOrPhone.trim().toLowerCase();
        const users = db.getUsers();
        const active = users.find(
          (u) =>
            (u.email && u.email.toLowerCase() === cleanQuery) ||
            (u.name && u.name.toLowerCase() === cleanQuery) ||
            (cleanQuery.length > 2 && u.name && u.name.toLowerCase().includes(cleanQuery))
        );

        if (active) {
          displayName = active.name;
        } else if (!displayName) {
          displayName = emailOrPhone.includes('@')
            ? emailOrPhone.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
            : emailOrPhone.trim();
        }
      }

      setConfirmedUserName(displayName);
      setIsLoading(false);
      setStep('confirmed');

      // Auto-redirect to home page after brief celebration confirmation
      setTimeout(() => {
        onClose();
        router.push('/');
      }, 1500);
    }, 450);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/65 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && step !== 'confirmed') {
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        {/* Modal Dialog Card: Modern 2-Column Split Layout */}
        <div className="relative my-auto w-full max-w-[820px] transform overflow-hidden rounded-[26px] border border-[#E2EBE7] bg-white shadow-2xl transition-all z-10 animate-scale-in text-left">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[520px]">
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

            {/* Right Side: Authentication Flow (Form -> OTP -> Confirmation) */}
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

                  {step !== 'confirmed' && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F8F5] text-slate-500 hover:bg-[#E2EBE7] hover:text-[#102820] transition-colors"
                      aria-label="Close authentication modal"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* ---------------- STEP 1: FORM DETAILS ---------------- */}
                {step === 'form' && (
                  <div className="animate-fade-in">
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
                    <form onSubmit={handleSubmitForm} className="space-y-3.5">
                      {mode === 'signup' && (
                        <div>
                          <label className="block text-xs font-semibold text-[#102820] mb-1">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                              type="text"
                              placeholder="e.g. John Doe"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2.5 pl-10 pr-3 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-[#102820] mb-1">
                          {mode === 'signup' ? 'Email or Mobile Number' : 'Email, Phone or Registered Name'}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder={mode === 'signup' ? 'name@example.com or +1 (555) 000-0000' : 'Enter email, mobile, or name'}
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
                            <span>{mode === 'signin' ? 'Sign In & Verify with OTP' : 'Create Account & Verify with OTP'}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* ---------------- STEP 2: OTP VERIFICATION ---------------- */}
                {step === 'otp' && (
                  <div className="animate-fade-in text-left">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('form');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="mt-1 mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#065F46] hover:underline transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to details</span>
                    </button>

                    <div className="mb-4">
                      <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight leading-snug">
                        Verify Your Identity
                      </h2>
                    </div>

                    {/* Feedback Messages */}
                    {errorMsg && (
                      <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs font-semibold text-rose-700 animate-fade-in">
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                        <span>{errorMsg}</span>
                      </div>
                    )}
                    {successMsg && (
                      <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] px-3.5 py-2.5 text-xs font-medium text-[#065F46] animate-fade-in">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669]" />
                        <span>Verification code sent to <strong className="font-semibold text-[#102820]">{emailOrPhone}</strong></span>
                      </div>
                    )}

                    {/* OTP 4-Digit Input Boxes */}
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="flex items-center justify-center gap-3 py-2">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              otpInputsRef.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                            onPaste={handleOtpPaste}
                            className={`h-14 w-14 text-center text-2xl font-bold rounded-2xl border-2 transition-all duration-200 outline-none shadow-2xs ${
                              digit
                                ? 'border-[#065F46] bg-[#ECFDF5]/50 text-[#064E3B] ring-2 ring-[#065F46]/10'
                                : 'border-slate-200 bg-slate-50/60 text-[#102820] focus:border-[#064E3B] focus:bg-white focus:ring-4 focus:ring-[#064E3B]/10 hover:border-slate-300'
                            }`}
                            aria-label={`Digit ${idx + 1}`}
                          />
                        ))}
                      </div>

                      {/* Demo Quick-Fill Pill */}
                      <div className="flex items-center justify-center pt-1">
                        <button
                          type="button"
                          onClick={handleFillDemoOtp}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] px-3.5 py-1.5 text-xs font-semibold text-[#065F46] transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-98"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-[#059669]" />
                          <span>Demo Code: <strong className="font-bold underline decoration-[#10B981] underline-offset-2">4829</strong> (Click to auto-fill)</span>
                        </button>
                      </div>

                      {/* Verify Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-3 flex items-center justify-center gap-2 rounded-full bg-[#064E3B] hover:bg-[#043328] py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-xs hover:shadow transition-all duration-200 disabled:opacity-50 cursor-pointer active:scale-[0.99] group/btn"
                      >
                        {isLoading ? (
                          <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Verify Code & Confirm</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                          </>
                        )}
                      </button>

                      {/* Resend OTP Row */}
                      <div className="pt-2 text-center">
                        {resendTimer > 0 ? (
                          <p className="text-xs text-slate-400 font-medium">
                            Didn&apos;t receive it? Resend code in{' '}
                            <span className="font-bold text-slate-700">0:{resendTimer.toString().padStart(2, '0')}</span>
                          </p>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#065F46] hover:text-[#043328] hover:underline cursor-pointer transition-colors"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Resend verification code</span>
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                )}

                {/* ---------------- STEP 3: CONFIRMATION & REDIRECT ---------------- */}
                {step === 'confirmed' && (
                  <div className="py-6 text-center animate-scale-in">
                    {/* Animated Check Circle */}
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#ECFDF5] border-2 border-[#10B981] shadow-lg animate-bounce-short">
                      <Check className="h-10 w-10 text-[#065F46] stroke-[2.5]" />
                    </div>

                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 text-xs font-bold text-[#065F46] mb-2">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Authentication Confirmed
                    </span>

                    <h2 className="font-heading text-2xl font-extrabold text-[#102820] tracking-tight mt-2">
                      Welcome, {confirmedUserName}!
                    </h2>

                    <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Your identity has been verified securely. You are now logged into your Velora patient account.
                    </p>

                    {/* Progress Loader Bar */}
                    <div className="mt-6 mx-auto w-48">
                      <div className="h-1.5 w-full bg-[#E2EBE7] rounded-full overflow-hidden">
                        <div className="h-full bg-[#064E3B] rounded-full animate-pulse" style={{ width: '100%' }} />
                      </div>
                      <p className="mt-2 text-[11px] font-semibold text-slate-400">
                        Redirecting to home page...
                      </p>
                    </div>
                  </div>
                )}
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
