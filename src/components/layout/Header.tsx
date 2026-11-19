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
  Settings,
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
      <Link href="/" className="brand" aria-label="Velora Healthcare, home">
        <img
          src={theme === 'dark' ? '/assets/logo-white.png' : '/assets/logo-dark.png'}
          alt="Velora Healthcare"
          className="h-[34px] sm:h-8 md:h-9 w-auto object-contain select-none"
        />
      </Link>

      <nav
        ref={navRef}
        className={`site-nav ${isNavOpen ? 'nav-open' : ''}`}
        id="siteNav"
        aria-label="Main navigation"
      >
        {NAV_LINKS.map((link, idx) => {
          const isActive =
            pathname === link.href ||
            (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              prefetch={true}
              style={{ animationDelay: `${idx * 60 + 60}ms` }}
              className={`animate-nav-rise ${isActive ? 'nav-active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          );
        })}

        {/* Mobile Navigation Footer & Auth Integration */}
        <div className="md:hidden mt-2.5 pt-2.5 border-t border-white/15 flex flex-col gap-2">
          {isAuthenticated && currentUser ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 px-2 py-1 text-white">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#064E3B] text-[10px] font-bold text-white border border-[#34D399]/40">
                  {getInitials(currentUser.name)}
                </span>
                <span className="text-xs font-bold truncate text-white">
                  {currentUser.name}
                </span>
              </div>
              <Link
                href={
                  currentUser.role === 'ADMIN'
                    ? '/admin/dashboard'
                    : currentUser.role === 'DOCTOR' || currentUser.role === 'NURSE'
                    ? '/provider/dashboard'
                    : '/patient/dashboard'
                }
                onClick={closeMenu}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-[#064E3B] px-3 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#065F46]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>My Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 text-center"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                closeMenu();
                setIsAuthOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#064E3B] border border-[#34D399]/40 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#065F46]"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          )}

          <a
            href="tel:+18005550199"
            className="flex items-center justify-center gap-1.5 py-1 text-[11px] font-semibold text-teal-300 hover:text-white"
          >
            <span>24/7 Helpline: 1-800-VELORA</span>
          </a>
        </div>
      </nav>

      {/* Desktop Header Actions: Unauthenticated (Sign In) vs Authenticated (Profile Dropdown) */}
      <div className={`header-actions flex items-center justify-self-end ${isNavOpen ? 'hidden md:flex' : ''}`}>
        {isAuthLoading ? (
          <div className="h-8 w-20 rounded-full bg-slate-200/40 animate-pulse" />
        ) : isAuthenticated && currentUser ? (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
              className="group flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-slate-300/80 bg-white/95 h-[38px] sm:h-auto py-1 pl-1.5 pr-2.5 sm:py-1.5 sm:pl-1.5 sm:pr-3 text-xs font-bold text-[#102820] hover:border-[#064E3B] hover:bg-white shadow-2xs transition-all active:scale-98"
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
              {/* On mobile: only first letter (e.g. 'D'); On desktop: full name */}
              <span className="profile-name-initial inline-block md:hidden text-xs font-bold text-[#102820]">
                {currentUser.name.trim().charAt(0).toUpperCase()}
              </span>
              <span className="profile-name-full hidden md:inline-block max-w-[105px] truncate text-xs font-bold text-[#102820]">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown
                className={`hidden sm:inline-block h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                  isProfileOpen ? 'rotate-180 text-[#064E3B]' : 'group-hover:text-slate-600'
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-[290px] origin-top-right rounded-2xl border border-[#E2EBE7] bg-white p-2 shadow-xl z-50 animate-scale-in text-left"
                role="menu"
                aria-orientation="vertical"
              >
                {/* Account Summary Banner */}
                <div className="p-3 border-b border-slate-100 bg-[#F8FAF9] rounded-xl mb-1.5">
                  <div className="flex items-center gap-3">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-10 w-10 rounded-full object-cover border border-[#CBDCD5] shrink-0"
                      />
                    ) : (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#064E3B] text-white text-xs font-black">
                        {getInitials(currentUser.name)}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-extrabold text-[#102820]">
                          {currentUser.name}
                        </p>
                        {currentUser.verificationStatus === 'APPROVED' && (
                          <span title="Verified Account" className="inline-flex items-center">
                            <ShieldCheck className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-slate-500">
                        {currentUser.email || currentUser.phone}
                      </p>
                      <span className="mt-1 inline-block text-[10px] font-bold text-[#065F46] bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 rounded-md">
                        {currentUser.role === 'PATIENT' ? 'Patient Account' : currentUser.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Patient Portal Routes: Exactly 4 focused options */}
                <div className="space-y-1 text-xs font-semibold text-[#102820]">
                  <Link
                    href="/patient/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F2F8F5] transition-colors"
                    role="menuitem"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#065F46] group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-[#102820] group-hover:text-[#064E3B]">My Dashboard</span>
                      <span className="block text-[10.5px] font-normal text-slate-500">Your healthcare overview</span>
                    </div>
                  </Link>

                  <Link
                    href="/patient/bookings"
                    onClick={() => setIsProfileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F2F8F5] transition-colors"
                    role="menuitem"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#065F46] group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-[#102820] group-hover:text-[#064E3B]">My Bookings</span>
                      <span className="block text-[10.5px] font-normal text-slate-500">Upcoming and past appointments</span>
                    </div>
                  </Link>

                  <Link
                    href="/patient/account"
                    onClick={() => setIsProfileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F2F8F5] transition-colors"
                    role="menuitem"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#065F46] group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-[#102820] group-hover:text-[#064E3B]">My Profile</span>
                      <span className="block text-[10.5px] font-normal text-slate-500">Personal information &amp; vitals</span>
                    </div>
                  </Link>

                  <Link
                    href="/patient/account?tab=settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-[#F2F8F5] transition-colors"
                    role="menuitem"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#065F46] group-hover:bg-[#064E3B] group-hover:text-white transition-colors">
                      <Settings className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block font-bold text-[#102820] group-hover:text-[#064E3B]">Account Settings</span>
                      <span className="block text-[10.5px] font-normal text-slate-500">Preferences &amp; security</span>
                    </div>
                  </Link>
                </div>

                {/* Role-Specific Portal Links for Doctor / Nurse / Admin */}
                {(currentUser.role === 'DOCTOR' || currentUser.role === 'NURSE') && (
                  <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                    <Link
                      href="/provider/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 transition-colors"
                      role="menuitem"
                    >
                      <Stethoscope className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>Visiting Clinician Portal</span>
                    </Link>
                  </div>
                )}

                {currentUser.role === 'ADMIN' && (
                  <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 bg-slate-100/80 hover:bg-slate-200/80 transition-colors"
                      role="menuitem"
                    >
                      <ShieldCheck className="h-4 w-4 text-slate-700 shrink-0" />
                      <span>Admin Console</span>
                    </Link>
                  </div>
                )}

                {/* Divider & Log Out */}
                <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
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
            className="header-signin-btn inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-slate-300/80 bg-white/95 h-[38px] sm:h-auto px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-[#102820] hover:bg-white hover:border-[#064E3B] hover:text-[#064E3B] transition-all shadow-2xs hover:shadow-xs active:scale-98"
            aria-label="Log in or create account"
          >
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#065F46]" />
            <span className="inline">Sign In</span>
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
