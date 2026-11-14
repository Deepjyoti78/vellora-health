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
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
}) => {
  const router = useRouter();
  const { login, switchRole } = useAuth();
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
      // Map UI role to system role
      const systemRole: UserRole =
        selectedRole === 'DOCTOR' ? 'DOCTOR' : selectedRole === 'NURSE' ? 'NURSE' : 'PATIENT';

      login(emailOrPhone, systemRole);
      switchRole(systemRole);

      setSuccessMsg(`Welcome back! Logged in as ${selectedRole.toLowerCase()}.`);
      setTimeout(() => {
        onClose();
        if (selectedRole === 'PATIENT') {
          router.push('/patient/dashboard');
        } else if (selectedRole === 'DOCTOR') {
          router.push('/admin/dashboard');
        }
      }, 700);
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
        router.push('/patient/account');
      }, 700);
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
        if (role === 'PATIENT') {
          router.push('/patient/dashboard');
        } else if (role === 'DOCTOR') {
          router.push('/admin/dashboard');
        }
      }, 600);
    }, 300);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-md max-h-[92vh] overflow-y-auto rounded-[26px] border border-[#E2EBE7] bg-white shadow-2xl p-6 sm:p-8 animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F8F5] text-slate-500 hover:bg-[#E2EBE7] hover:text-[#102820] transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Branding & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#064E3B] text-white font-black text-base shadow-xs mb-2">
            +
          </div>
          <h2
            id="auth-modal-title"
            className="font-heading text-xl sm:text-2xl font-extrabold text-[#102820] tracking-tight"
          >
            {mode === 'signin' ? 'Sign In to Vellora Health' : 'Create Your Health Profile'}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {mode === 'signin'
              ? 'Access your home care appointments, prescriptions, and medical reports.'
              : 'Join thousands receiving hospital-grade clinical care at their doorstep.'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex rounded-full bg-[#F2F8F5] p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all ${
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
            className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#064E3B] shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role Selector Pills */}
        <div className="mb-5">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('PATIENT')}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-xs font-bold border transition-all ${
                selectedRole === 'PATIENT'
                  ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] shadow-2xs'
                  : 'border-[#E2EBE7] bg-white text-slate-600 hover:bg-[#F8FAF9]'
              }`}
            >
              <User className="h-4 w-4" />
              <span className="text-[11px]">Patient / Family</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('DOCTOR')}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-xs font-bold border transition-all ${
                selectedRole === 'DOCTOR'
                  ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] shadow-2xs'
                  : 'border-[#E2EBE7] bg-white text-slate-600 hover:bg-[#F8FAF9]'
              }`}
            >
              <Stethoscope className="h-4 w-4" />
              <span className="text-[11px]">Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('NURSE')}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 text-xs font-bold border transition-all ${
                selectedRole === 'NURSE'
                  ? 'border-[#064E3B] bg-[#ECFDF5] text-[#064E3B] shadow-2xs'
                  : 'border-[#E2EBE7] bg-white text-slate-600 hover:bg-[#F8FAF9]'
              }`}
            >
              <HeartPulse className="h-4 w-4" />
              <span className="text-[11px]">Nurse</span>
            </button>
          </div>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 animate-fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#ECFDF5] border border-[#D1FAE5] p-3 text-xs font-semibold text-[#065F46] animate-fade-in">
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
                  className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
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
                className="w-full rounded-xl border border-[#CBDCD5] bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-[#102820] placeholder:text-slate-400 focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
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
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-full bg-[#064E3B] py-3 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In to My Account' : 'Create Account'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="mt-5 border-t border-[#F2F8F5] pt-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
            Instant Demo Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('PATIENT', 'Eleanor Vance')}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E2EBE7] bg-[#F8FAF9] py-1.5 px-2 text-[11px] font-bold text-[#102820] hover:bg-[#ECFDF5] hover:border-[#064E3B] transition-all"
            >
              <span>Patient (Eleanor)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('DOCTOR', 'Dr. Arjun Mehta')}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E2EBE7] bg-[#F8FAF9] py-1.5 px-2 text-[11px] font-bold text-[#102820] hover:bg-[#ECFDF5] hover:border-[#064E3B] transition-all"
            >
              <span>Doctor / Admin</span>
            </button>
          </div>
        </div>

        {/* Customer Portal Direct Link */}
        <div className="mt-4 text-center">
          <Link
            href="/patient/account"
            onClick={onClose}
            className="text-xs font-bold text-[#065F46] hover:underline inline-flex items-center gap-1"
          >
            <span>View Full Customer Profile &amp; Vitals →</span>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
};
