'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/common/Icon';
import { db } from '@/lib/db';
import { AuthModal } from '@/components/auth/AuthModal';
import { Lock, LogIn, ArrowLeft } from 'lucide-react';

export const PatientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, isAuthenticated, isAuthLoading, logout } = useAuth();
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
        <div className="w-full max-w-md rounded-3xl border border-[#E2EBE7] bg-white p-8 shadow-xl">
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

  // 3. Authenticated Patient Experience
  const notifications = db.getNotifications(currentUser.id);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navLinks = [
    { label: 'Dashboard', href: '/patient/dashboard', icon: 'building' as const },
    { label: 'Book Care', href: '/patient/book', icon: 'calendar' as const },
    { label: 'My Bookings', href: '/patient/bookings', icon: 'clock' as const },
    { label: 'Medical Records', href: '/patient/records', icon: 'file' as const },
    { label: 'Family Profiles', href: '/patient/family', icon: 'users' as const },
    { label: 'Account', href: '/patient/account', icon: 'shield' as const },
    { label: 'Support & Help', href: '/patient/support', icon: 'message' as const },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9] pb-16 md:pb-0">
      {/* Top Patient Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-gray-900">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#116b70] text-sm text-white">
                +
              </span>
              <span className="text-base font-extrabold tracking-tight">Vellora Patient</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.slice(0, 5).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      isActive
                        ? 'bg-teal-50 text-[#116b70]'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#064E3B] transition-colors pr-2 border-r border-slate-200"
            >
              <span>← Main Website</span>
            </Link>

            <Link
              href="tel:911"
              className="hidden sm:inline-flex rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700"
            >
              Emergency 911
            </Link>

            <Link
              href="/patient/book"
              className="button button-dark button-sm text-xs"
            >
              <Icon name="plus" size="xs" /> Book a Visit
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full border border-gray-200 object-cover"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#064E3B] text-white text-xs font-bold">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-gray-900 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-teal-700 font-medium">
                  {currentUser.role === 'PATIENT' ? 'Patient' : currentUser.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1">{children}</main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Patient portal mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-gray-200 bg-white px-2 md:hidden"
      >
        {navLinks.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-semibold transition ${
                isActive ? 'text-[#116b70]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon name={item.icon} size="sm" />
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
