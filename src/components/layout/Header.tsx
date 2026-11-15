'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/data/site-content';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/common/Icon';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  User,
  ChevronDown,
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  LifeBuoy,
  LogOut,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

export const Header: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'light' }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { currentUser, isAuthenticated, isAuthLoading, logout } = useAuth();

  const closeMenu = () => {
    setIsNavOpen(false);
  };

  const toggleMenu = () => {
    setIsNavOpen((prev) => !prev);
  };

  // Close menus on click outside and escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        closeMenu();
      }

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isNavOpen) closeMenu();
        if (isProfileOpen) setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNavOpen, isProfileOpen]);

  // Close profile dropdown whenever route changes
  useEffect(() => {
    setIsProfileOpen(false);
    setIsNavOpen(false);
  }, [pathname]);

  const headerClass = `site-header animate-hero-header ${
    theme === 'light' ? 'site-header-light' : 'site-header-dark'
  }`;

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className={headerClass} id="siteHeader">
      <Link href="/" className="brand" aria-label="Vellora Health, home">
        <span className="brand-icon" aria-hidden="true">
          <span></span>
          <span></span>
        </span>
        <span>Vellora Health</span>
      </Link>

      <nav
        ref={navRef}
        className={`site-nav ${isNavOpen ? 'nav-open' : ''}`}
        id="siteNav"
        aria-label="Main navigation"
      >
        {NAV_LINKS.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              className={isActive ? 'nav-active' : ''}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Mobile-only CTA & Account area inside drawer */}
        <div className="pt-3 border-t border-slate-200/20 mt-3 md:hidden flex flex-col gap-2.5">
          {isAuthLoading ? (
            <div className="h-10 w-full rounded-xl bg-slate-200/30 animate-pulse" />
          ) : isAuthenticated && currentUser ? (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 text-left shadow-xs">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-9 w-9 rounded-full object-cover border border-[#064E3B]/20"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#064E3B] text-white text-xs font-black">
                    {getInitials(currentUser.name)}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-extrabold text-[#102820]">
                    {currentUser.name}
                  </p>
                  <p className="truncate text-[10px] text-slate-500">
                    {currentUser.email || currentUser.phone}
                  </p>
                </div>
              </div>

              <div className="mt-2 flex flex-col gap-1 text-xs font-semibold text-[#102820]">
                <Link
                  href="/patient/dashboard"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-lg py-1.5 px-2 hover:bg-[#F2F8F5] hover:text-[#064E3B]"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-[#065F46]" />
                  <span>My Dashboard</span>
                </Link>
                <Link
                  href="/patient/bookings"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-lg py-1.5 px-2 hover:bg-[#F2F8F5] hover:text-[#064E3B]"
                >
                  <Calendar className="h-3.5 w-3.5 text-[#065F46]" />
                  <span>My Appointments</span>
                </Link>
                <Link
                  href="/patient/account"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-lg py-1.5 px-2 hover:bg-[#F2F8F5] hover:text-[#064E3B]"
                >
                  <User className="h-3.5 w-3.5 text-[#065F46]" />
                  <span>My Profile &amp; Vitals</span>
                </Link>
                <Link
                  href="/patient/family"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-lg py-1.5 px-2 hover:bg-[#F2F8F5] hover:text-[#064E3B]"
                >
                  <Users className="h-3.5 w-3.5 text-[#065F46]" />
                  <span>Family Members</span>
                </Link>
                <Link
                  href="/patient/records"
                  onClick={closeMenu}
                  className="flex items-center gap-2 rounded-lg py-1.5 px-2 hover:bg-[#F2F8F5] hover:text-[#064E3B]"
                >
                  <FileText className="h-3.5 w-3.5 text-[#065F46]" />
                  <span>Medical Records</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="flex items-center gap-2 rounded-lg py-1.5 px-2 text-rose-600 hover:bg-rose-50 text-left font-bold"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 rounded-full border border-[#064E3B] bg-[#064E3B] text-white py-2.5 px-4 text-xs font-bold hover:bg-[#065F46] shadow-xs transition-colors"
              onClick={() => {
                closeMenu();
                setIsAuthOpen(true);
              }}
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          )}
        </div>
      </nav>

      {/* Desktop Header Actions: Unauthenticated (Sign In) vs Authenticated (Profile Dropdown) */}
      <div className="header-actions flex items-center justify-self-end">
        {isAuthLoading ? (
          <div className="h-8 w-20 rounded-full bg-slate-200/40 animate-pulse" />
        ) : isAuthenticated && currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              className="group flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/95 py-1.5 pl-1.5 pr-3 text-xs font-bold text-[#102820] hover:border-[#064E3B] hover:bg-white shadow-2xs transition-all active:scale-98"
              aria-label="User profile and navigation menu"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-6 w-6 rounded-full object-cover border border-[#064E3B]/20"
                />
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#064E3B] text-white text-[10px] font-black">
                  {getInitials(currentUser.name)}
                </span>
              )}
              <span className="hidden sm:inline-block max-w-[105px] truncate text-xs font-bold text-[#102820]">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180 text-[#064E3B]' : 'group-hover:text-slate-600'
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-[#E2EBE7] bg-white p-1.5 shadow-xl z-50 animate-scale-in text-left"
                role="menu"
                aria-orientation="vertical"
              >
                {/* Account Summary Banner */}
                <div className="p-2.5 border-b border-slate-100 bg-[#F8FAF9] rounded-xl mb-1">
                  <div className="flex items-center gap-2.5">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-9 w-9 rounded-full object-cover border border-[#CBDCD5] shrink-0"
                      />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#064E3B] text-white text-xs font-black">
                        {getInitials(currentUser.name)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <p className="truncate text-xs font-extrabold text-[#102820]">
                          {currentUser.name}
                        </p>
                        {currentUser.verificationStatus === 'APPROVED' && (
                          <span title="Verified Account" className="inline-flex items-center">
                            <ShieldCheck className="h-3 w-3 text-[#065F46] shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[10.5px] text-slate-500">
                        {currentUser.email || currentUser.phone}
                      </p>
                      <span className="mt-0.5 inline-block text-[9.5px] font-bold text-[#065F46] bg-[#ECFDF5] border border-[#D1FAE5] px-1.5 py-0.5 rounded-md">
                        {currentUser.role === 'PATIENT' ? 'Patient Account' : currentUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Patient Portal Routes */}
                <div className="space-y-0.5 text-xs font-semibold text-[#102820]">
                  <Link
                    href="/patient/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    role="menuitem"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href="/patient/bookings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    role="menuitem"
                  >
                    <Calendar className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                    <span>My Appointments</span>
                  </Link>

                  <Link
                    href="/patient/account"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    role="menuitem"
                  >
                    <User className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                    <span>My Profile &amp; Vitals</span>
                  </Link>

                  <Link
                    href="/patient/family"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    role="menuitem"
                  >
                    <Users className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                    <span>Family Members</span>
                  </Link>

                  <Link
                    href="/patient/records"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    role="menuitem"
                  >
                    <FileText className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                    <span>Medical Records</span>
                  </Link>

                  <Link
                    href="/patient/support"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 hover:bg-[#F2F8F5] hover:text-[#064E3B] transition-colors"
                    role="menuitem"
                  >
                    <LifeBuoy className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                    <span>Support &amp; Help</span>
                  </Link>
                </div>

                {/* Role-Specific Portal Links for Doctor / Nurse / Admin */}
                {(currentUser.role === 'DOCTOR' || currentUser.role === 'NURSE') && (
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <Link
                      href="/provider/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors"
                      role="menuitem"
                    >
                      <Stethoscope className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                      <span>Visiting Clinician Portal</span>
                    </Link>
                  </div>
                )}

                {currentUser.role === 'ADMIN' && (
                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                      role="menuitem"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-700 shrink-0" />
                      <span>Admin Console</span>
                    </Link>
                  </div>
                )}

                {/* Divider & Log Out */}
                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
                    role="menuitem"
                  >
                    <LogOut className="h-3.5 w-3.5 shrink-0" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              closeMenu();
              setIsAuthOpen(true);
            }}
            className="header-signin-btn inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/95 px-4 py-2 text-xs font-bold text-[#102820] hover:bg-white hover:border-[#064E3B] hover:text-[#064E3B] transition-all shadow-2xs hover:shadow-xs active:scale-98"
            aria-label="Log in or create account"
          >
            <User className="h-3.5 w-3.5 text-[#065F46]" />
            <span>Sign In</span>
          </button>
        )}
      </div>

      <button
        ref={toggleRef}
        type="button"
        className="mobile-menu-button"
        id="menuToggle"
        aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isNavOpen}
        aria-controls="siteNav"
        onClick={toggleMenu}
      >
        <Icon name={isNavOpen ? 'close' : 'menu'} />
      </button>

      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </header>
  );
};
