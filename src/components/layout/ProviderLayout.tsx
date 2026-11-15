'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { Icon } from '@/components/common/Icon';

export const ProviderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [isOnline, setIsOnline] = useState<boolean>(currentUser?.isOnline ?? true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDutyStatus = () => {
    if (!currentUser) return;
    const nextStatus = !isOnline;
    setIsOnline(nextStatus);
    db.updateUser(currentUser.id, { isOnline: nextStatus });
  };

  const navLinks = [
    { href: '/provider/dashboard', label: 'Dashboard', icon: 'layers' as const },
    { href: '/provider/appointments', label: 'Visits & Schedule', icon: 'calendar' as const },
    { href: '/provider/requests', label: 'Job Offers', icon: 'clock' as const },
    { href: '/provider/clinical-records', label: 'Clinical Charting', icon: 'file-text' as const },
    { href: '/provider/availability', label: 'Duty Shifts', icon: 'clock' as const },
    { href: '/provider/earnings', label: 'Earnings & Payouts', icon: 'shield' as const },
    { href: '/provider/profile', label: 'Profile & Zones', icon: 'user' as const },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F7] text-gray-900 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>

            <Link href="/provider/dashboard" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#116b70] text-white font-black text-sm">
                +
              </span>
              <div className="leading-tight">
                <span className="text-sm font-black tracking-tight text-gray-900">
                  VELLORA
                </span>
                <span className="ml-1 text-[11px] font-bold uppercase tracking-wider text-[#116b70]">
                  Provider Portal
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-6">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/provider/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[#116b70] text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon name={item.icon} className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Duty Status & Provider Profile Badge */}
          <div className="flex items-center gap-3">
            {/* Online / Offline Toggle */}
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 shadow-2xs">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                }`}
              />
              <span className="text-xs font-bold text-gray-700">
                {isOnline ? 'On Duty (Accepting)' : 'Off Duty'}
              </span>
              <button
                type="button"
                onClick={toggleDutyStatus}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isOnline ? 'bg-[#116b70]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isOnline ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Provider Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#116b70]/10 text-[#116b70] font-bold text-xs">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                  : 'PR'}
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <span className="block font-bold text-gray-900 truncate max-w-[120px]">
                  {currentUser?.name || 'Staff Clinician'}
                </span>
                <span className="block text-[10px] font-semibold text-[#116b70]">
                  {currentUser?.role || 'PROVIDER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 bg-white px-4 py-3 lg:hidden">
            <div className="space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${
                    pathname === item.href
                      ? 'bg-[#116b70] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pb-16">{children}</main>
    </div>
  );
};
