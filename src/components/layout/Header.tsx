'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/data/site-content';
import { useBooking } from '@/context/BookingContext';
import { Icon } from '@/components/common/Icon';

export const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { openBooking } = useBooking();

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

  return (
    <header className="site-header animate-hero-header" id="siteHeader">
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
      </nav>

      <Link
        href="/book"
        prefetch={true}
        className="header-book button button-white"
        onClick={closeMenu}
      >
        <span>Book Appointment</span>
        <Icon name="arrow-right" size="sm" />
      </Link>

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
    </header>
  );
};
