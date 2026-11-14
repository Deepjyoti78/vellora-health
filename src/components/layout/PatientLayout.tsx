'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/common/Icon';
import { db } from '@/lib/db';

export const PatientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const user = currentUser || {
    id: 'pat-1',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '+1 (555) 234-5678',
    role: 'PATIENT' as const,
    avatar: '/assets/avatar-1.webp',
  };
  const notifications = db.getNotifications(user.id);
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
              href="/patient/support"
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700 hover:bg-red-100"
            >
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
              Emergency 911
            </Link>

            <Link
              href="/patient/book"
              className="button button-dark button-sm text-xs"
            >
              <Icon name="plus" size="xs" /> Book a Visit
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <img
                src={user.avatar || '/assets/avatar-1.webp'}
                alt={user.name}
                className="h-8 w-8 rounded-full border border-gray-200 object-cover"
              />
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-gray-900 leading-tight">{user.name}</p>
                <p className="text-[10px] text-teal-700 font-medium">Patient</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav aria-label="Mobile patient navigation" className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-gray-200 bg-white md:hidden">
        {navLinks.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                isActive ? 'text-[#116b70]' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon name={item.icon} size="xs" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
