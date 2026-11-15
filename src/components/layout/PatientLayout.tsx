'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';
import { Header } from '@/components/layout/Header';
import { Lock, LogIn, ArrowLeft } from 'lucide-react';

export const PatientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { currentUser, isAuthenticated, isAuthLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 1. Initial Auth Loading State: prevents flashing incorrect content
  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8faf9]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-3 border-[#064E3B] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Verifying patient credentials...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated Gate: No Eleanor Vance or other patient data is ever shown to guest
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8faf9] p-4 text-center">
        <div className="w-full max-w-md rounded-3xl border border-[#E2EBE7] bg-white p-8 shadow-xl animate-scale-in">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#064E3B] mb-4">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-[#102820]">Authentication Required</h1>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Please sign in to access your personal health records, upcoming doorstep visits, and family profiles.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#064E3B] py-3 px-4 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to Access Portal</span>
            </button>

            <Link
              href={`/patient/login?redirect=${encodeURIComponent(pathname)}`}
              className="text-[11px] text-[#064E3B] font-semibold hover:underline"
            >
              Or open full login page
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white py-2.5 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Public Homepage</span>
            </Link>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          redirectUrl={pathname}
        />
      </div>
    );
  }

  // Helper to format page title for breadcrumb
  const formatPageTitle = (path: string) => {
    const segment = path.split('/').filter(Boolean).pop() || '';
    switch (segment) {
      case 'bookings':
        return 'My Care Bookings';
      case 'records':
        return 'Medical Records';
      case 'family':
        return 'Family Members';
      case 'account':
        return 'Profile & Account Settings';
      case 'support':
        return 'Support & Help';
      case 'book':
        return 'Book a Visit';
      default:
        return segment.replace(/-/g, ' ');
    }
  };

  const isSubPage = pathname !== '/patient/dashboard';

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      {/* 1. Main Website Navbar (Brought back to patient dashboard & portal) */}
      <Header theme="light" />

      {/* 2. Secondary Navigation Sub-bar for sub-pages: provides back button & breadcrumbs */}
      {isSubPage && (
        <div className="sticky top-[73px] z-30 border-b border-[#E2EBE7] bg-white/95 backdrop-blur-md py-2.5 px-4 sm:px-6 shadow-2xs transition-all animate-fade-in-down">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <Link
              href="/patient/dashboard"
              className="group inline-flex items-center gap-1.5 rounded-full border border-[#CBDCD5] bg-[#F8FAF9] px-3.5 py-1 text-xs font-bold text-[#102820] hover:border-[#064E3B] hover:bg-[#ECFDF5] hover:text-[#064E3B] transition-all shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/patient/dashboard" className="hover:text-[#064E3B] transition-colors">
                Dashboard
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-[#064E3B] font-bold capitalize">
                {formatPageTitle(pathname)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Page Area */}
      <main className="flex-1 pb-16">{children}</main>
    </div>
  );
};
