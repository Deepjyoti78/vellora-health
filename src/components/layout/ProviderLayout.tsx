'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';
import { db } from '@/lib/db';
import {
  LayoutDashboard,
  Calendar,
  Bell,
  FileText,
  Clock,
  DollarSign,
  User,
  ChevronDown,
  LogOut,
  MapPin,
  Menu,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const ProviderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchRole, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Pending incoming dispatches badge count
  const pendingOffersCount = currentUser
    ? db.getJobOffers(currentUser.id).filter((o) => o.status === 'OFFERED').length +
      db.getBookings().filter((b) => !b.providerId && (b.status === 'REQUESTED' || b.status === 'CONFIRMED')).length
    : 1;

  const navLinks = [
    {
      href: '/provider/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/provider/appointments',
      label: 'Visits & Schedule',
      icon: Calendar,
    },
    {
      href: '/provider/requests',
      label: 'Job Offers',
      icon: Bell,
      badge: pendingOffersCount > 0 ? pendingOffersCount : undefined,
    },
    {
      href: '/provider/clinical-records',
      label: 'Clinical Charting',
      icon: FileText,
    },
    {
      href: '/provider/availability',
      label: 'Duty Shifts',
      icon: Clock,
    },
    {
      href: '/provider/earnings',
      label: 'Earnings',
      icon: DollarSign,
    },
  ];

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'PR';

  const roleLabel = currentUser?.role ? currentUser.role.replace(/_/g, ' ') : 'CLINICIAN';

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
    setProfileDropdownOpen(false);
    router.push('/provider/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] text-[#15212B] font-sans antialiased">
      {/* Top Navbar: Spacious, Clean & Breathable */}
      <header className="sticky top-0 z-40 border-b border-[#E5ECE9] bg-white/95 backdrop-blur-md shadow-[0_2px_14px_rgba(0,0,0,0.02)]">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Left: Vellora Brand with Clinician Portal STACKED DIRECTLY BELOW */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2 text-slate-600 hover:bg-[#F2F8F5] lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/provider/dashboard" className="flex flex-col items-start gap-1 shrink-0 group">
              <img
                src="/assets/logo-dark.png"
                alt="Velora Healthcare"
                className="h-7 sm:h-8 w-auto object-contain group-hover:opacity-90 transition-opacity"
              />
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#059669] leading-none pl-1">
                Clinician Portal
              </span>
            </Link>
          </div>

          {/* Center: Spacious, Elegant Floating Pill Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-[#F4FAF7] border border-[#E2EBE7] shadow-2xs">
            {navLinks.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/provider/dashboard' && pathname.startsWith(item.href));
              const ItemIcon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#064E3B] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#15212B] hover:bg-white'
                  }`}
                >
                  <ItemIcon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`ml-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10px] font-black ${
                        isActive ? 'bg-white text-[#064E3B]' : 'bg-[#064E3B] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Clinician Profile Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 rounded-full border border-[#E5ECE9] bg-white hover:bg-[#F4FAF7] p-1.5 pr-4 transition-all shadow-2xs group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-black text-xs shadow-2xs">
                  {initials}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <span className="block font-bold text-xs text-[#15212B] truncate max-w-[130px]">
                    {currentUser?.name || 'Practitioner'}
                  </span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#059669]">
                    {roleLabel}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    profileDropdownOpen ? 'rotate-180 text-[#064E3B]' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Popover */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-76 rounded-[24px] border border-[#E5ECE9] bg-white p-3 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Practitioner Header */}
                  <div className="p-3.5 rounded-2xl bg-[#F7FAF9] border border-[#E5ECE9] mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#064E3B] text-white font-black text-sm shadow-xs">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-heading text-xs font-bold text-[#15212B] truncate">
                          {currentUser?.name || 'Practitioner'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || 'clinician@vellora.com'}</p>
                        <span className="mt-1 inline-block rounded-md bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 text-[9px] font-bold text-[#065F46]">
                          {currentUser?.specialty || roleLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="space-y-0.5 text-xs font-medium text-slate-700">
                    <Link
                      href="/provider/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      <span>My Profile &amp; Credentials</span>
                    </Link>

                    <Link
                      href="/provider/availability"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span>Service Zones &amp; Shifts</span>
                    </Link>

                    <Link
                      href="/provider/earnings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    >
                      <DollarSign className="h-4 w-4 text-slate-500" />
                      <span>Payouts &amp; Bank Settings</span>
                    </Link>
                  </div>

                  {/* Fast Clinical Role Switcher */}
                  <div className="mt-2.5 pt-2.5 border-t border-[#F2F8F5]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                      Switch Clinician Role
                    </p>
                    <div className="grid grid-cols-2 gap-1 px-1">
                      {[
                        { r: 'DOCTOR' as UserRole, label: 'Doctor' },
                        { r: 'NURSE' as UserRole, label: 'Nurse' },
                        { r: 'CARETAKER' as UserRole, label: 'Caretaker' },
                        { r: 'PHYSIOTHERAPIST' as UserRole, label: 'Physio' },
                        { r: 'PHLEBOTOMIST' as UserRole, label: 'Phlebotomist' },
                      ].map((item) => (
                        <button
                          key={item.r}
                          type="button"
                          onClick={() => handleRoleSwitch(item.r)}
                          className={`text-left px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                            currentUser?.role === item.r
                              ? 'bg-[#064E3B] text-white font-bold'
                              : 'text-slate-600 hover:bg-[#F2F8F5] hover:text-[#15212B]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Portals & Sign out */}
                  <div className="mt-2.5 pt-2.5 border-t border-[#F2F8F5] space-y-0.5 text-xs font-medium">
                    <Link
                      href="/patient/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    >
                      <span>Switch to Patient Portal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <Link
                      href="/admin/providers"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    >
                      <span>Admin Management</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        router.push('/provider/login');
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E5ECE9] bg-white px-4 py-4 lg:hidden shadow-lg animate-in slide-in-from-top-2 duration-150">
            <div className="space-y-1 mb-4">
              {navLinks.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/provider/dashboard' && pathname.startsWith(item.href));
                const ItemIcon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[#064E3B] text-white shadow-2xs'
                        : 'text-slate-700 hover:bg-[#F2F8F5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ItemIcon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                          isActive ? 'bg-white text-[#064E3B]' : 'bg-[#064E3B] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-[#F2F8F5] flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Logged in as {currentUser?.name}</span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  router.push('/provider/login');
                }}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pb-16">{children}</main>
    </div>
  );
};
