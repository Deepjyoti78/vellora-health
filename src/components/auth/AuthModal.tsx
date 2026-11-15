'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
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
  Stethoscope,
  HeartPulse,
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
  const [selectedRole, setSelectedRole] = useState<'PATIENT' | 'DOCTOR' | 'NURSE'>('PATIENT');
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
      const systemRole: UserRole =
        selectedRole === 'DOCTOR' ? 'DOCTOR' : selectedRole === 'NURSE' ? 'NURSE' : 'PATIENT';

      login(emailOrPhone, systemRole);
      switchRole(systemRole);

      setSuccessMsg(`Welcome back! Logged in as ${selectedRole.toLowerCase()}.`);
      setTimeout(() => {
        onClose();
        if (redirectUrl) {
          router.push(validateInternalRedirect(redirectUrl, '/'));
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
      switchRole('PATIENT');
      setSuccessMsg('Account created successfully! Welcome to Vellora Health.');
      setTimeout(() => {
        onClose();
        if (redirectUrl) {
          router.push(validateInternalRedirect(redirectUrl, '/'));
        }
      }, 500);
    }, 500);
  };

  const handleQuickDemoLogin = (role: 'PATIENT' | 'DOCTOR' | 'NURSE', name: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const systemRole: UserRole =
        role === 'DOCTOR' ? 'DOCTOR' : role === 'NURSE' ? 'NURSE' : 'PATIENT';
      switchRole(systemRole);
      setSuccessMsg(`Logged in as ${name} (${role.toLowerCase()})`);
      setTimeout(() => {
        onClose();
        if (redirectUrl) {
          router.push(validateInternalRedirect(redirectUrl, '/'));
        }
      }, 400);
    }, 300);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/65 backdrop-blur-sm p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onMouseDown={(e) => {
        // Close when clicking overlay backdrop directly
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="flex min-h-full items-center justify-center">
        {/* Modal Dialog Card */}
        <div className="relative my-auto w-full max-w-md transform rounded-[24px] border border-[#E2EBE7] bg-white p-5 sm:p-6 shadow-2xl transition-all z-10 animate-scale-in text-left">
          {/* Header Row: Brand badge & Close button */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F5F2]">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#064E3B] text-sm font-black text-white shadow-xs">
                +
              </span>
              <span className="text-sm font-extrabold text-[#102820] tracking-tight">
                Vellora Health
              </span>
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
          <div className="mt-3.5 mb-3.5 text-left">
            <h2
              id="auth-modal-title"
              className="font-heading text-lg sm:text-xl font-extrabold text-[#102820] tracking-tight leading-snug"
            >
              {mode === 'signin' ? 'Sign In to Your Account' : 'Create Your Patient Account'}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {mode === 'signin'
                ? 'Access your doorstep appointments, medical records, and physician visits.'
                : 'Join thousands receiving hospital-grade clinical care in their homes.'}
            </p>
          </div>

          {/* Segmented Mode Toggle: Sign In vs Sign Up */}
          <div className="flex rounded-xl bg-[#F2F8F5] p-1 mb-3.5 border border-[#E2EBE7]">
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

          {/* Role Selector Chips */}
          <div className="mb-3.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('PATIENT')}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold border transition-all ${
                  selectedRole === 'PATIENT'
                    ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] ring-1 ring-[#064E3B] shadow-2xs'
                    : 'border-[#E2EBE7] bg-white text-slate-600 hover:bg-[#F8FAF9]'
                }`}
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[11px] truncate">Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('DOCTOR')}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold border transition-all ${
                  selectedRole === 'DOCTOR'
                    ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] ring-1 ring-[#064E3B] shadow-2xs'
                    : 'border-[#E2EBE7] bg-white text-slate-600 hover:bg-[#F8FAF9]'
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[11px] truncate">Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('NURSE')}
                className={`flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold border transition-all ${
                  selectedRole === 'NURSE'
                    ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] ring-1 ring-[#064E3B] shadow-2xs'
                    : 'border-[#E2EBE7] bg-white text-slate-600 hover:bg-[#F8FAF9]'
                }`}
              >
                <HeartPulse className="h-3.5 w-3.5 shrink-0" />
                <span className="text-[11px] truncate">Nurse</span>
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs font-semibold text-rose-700 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] p-2.5 text-xs font-semibold text-[#065F46] animate-fade-in">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#065F46]" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Body */}
          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#102820] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-9 pr-3 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="name@example.com or +1 (555) 000-0000"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-9 pr-3 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
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
                    onClick={() => alert('Demo Mode: You can sign in with any password or use the Quick Demo buttons below.')}
                    className="text-[11px] font-semibold text-[#065F46] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2 pl-9 pr-9 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
              className="w-full mt-1.5 flex items-center justify-center gap-2 rounded-full bg-[#064E3B] py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to My Account' : 'Create Free Account'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="mt-4 border-t border-[#F0F5F2] pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-600" />
                Quick Demo Access
              </span>
              <span className="text-[10px] text-slate-400">Instant One-Click Login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('PATIENT', 'Eleanor Vance')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E2EBE7] bg-[#F8FAF9] py-1.5 px-2 text-[11px] font-bold text-[#102820] hover:bg-[#ECFDF5] hover:border-[#064E3B] transition-all"
              >
                <span>👤 Patient (Eleanor)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('DOCTOR', 'Dr. Arjun Mehta')}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E2EBE7] bg-[#F8FAF9] py-1.5 px-2 text-[11px] font-bold text-[#102820] hover:bg-[#ECFDF5] hover:border-[#064E3B] transition-all"
              >
                <span>🩺 Doctor (Dr. Arjun)</span>
              </button>
            </div>
          </div>

          {/* Customer Portal Direct Link */}
          <div className="mt-3 text-center">
            <Link
              href="/patient/account"
              onClick={onClose}
              className="text-xs font-bold text-[#065F46] hover:underline inline-flex items-center gap-1"
            >
              <span>Explore Patient Portal &amp; Health Records →</span>
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
