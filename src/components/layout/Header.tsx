'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/data/site-content';
import { useBooking } from '@/context/BookingContext';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/common/Icon';
import { AuthModal } from '@/components/auth/AuthModal';
import { User } from 'lucide-react';

export const Header: React.FC<{ theme?: 'dark' | 'light' }> = ({ theme = 'light' }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { openBooking } = useBooking();
  const { currentUser } = useAuth();

  const closeMenu = () => {
    setIsNavOpen(false);
  };

  const toggleMenu = () => {
    setIsNavOpen((prev) => !prev);
  };

  // Close on click outside and escape
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
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNavOpen) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNavOpen]);

  const headerClass = `site-header animate-hero-header ${
    theme === 'light' ? 'site-header-light' : 'site-header-dark'
  }`;

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

        {/* Mobile-only CTA inside drawer */}
        <div className="pt-2 border-t border-slate-200/20 mt-2 md:hidden flex flex-col gap-2">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-full border border-[#064E3B] bg-white text-[#064E3B] py-2 px-4 text-xs font-bold hover:bg-[#F2F8F5] transition-colors"
            onClick={() => {
              closeMenu();
              setIsAuthOpen(true);
            }}
          >
            <User className="h-3.5 w-3.5" />
            <span>Log In / Sign Up</span>
          </button>

          <Link
            href="/patient/account"
            onClick={closeMenu}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#ECFDF5] text-[#064E3B] border border-[#D1FAE5] py-2 px-4 text-xs font-bold hover:bg-[#D1FAE5] transition-colors text-center"
          >
            <span>Customer Portal &amp; Details</span>
          </Link>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#064E3B] text-white py-2.5 px-4 text-xs font-bold shadow-xs hover:bg-[#065F46] transition-colors"
            onClick={() => {
              closeMenu();
              openBooking();
            }}
          >
            <span>Book Appointment</span>
            <Icon name="arrow-right" size="sm" />
          </button>
        </div>
      </nav>

      {/* Desktop Header Actions: Log In & Book Appointment */}
      <div className="header-actions flex items-center gap-2.5 justify-self-end">
        <button
          type="button"
          onClick={() => {
            closeMenu();
            setIsAuthOpen(true);
          }}
          className="header-login-btn inline-flex items-center gap-1.5 rounded-full border border-slate-300/80 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#102820] hover:bg-white hover:border-[#064E3B] transition-all shadow-2xs hover:shadow-xs active:scale-98"
          aria-label="Log in or create account"
        >
          <User className="h-3.5 w-3.5 text-[#065F46]" />
          <span className="hidden lg:inline">Sign In</span>
          <span className="lg:hidden">Login</span>
        </button>

        <button
          type="button"
          className="header-book button button-white"
          onClick={() => {
            closeMenu();
            openBooking();
          }}
        >
          <span className="hidden sm:inline">Book Appointment</span>
          <span className="sm:hidden font-bold">Book</span>
          <Icon name="arrow-right" size="sm" />
        </button>
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
