'use client';

import React from 'react';
import Link from 'next/link';
import { useBooking } from '@/context/BookingContext';

export const Footer: React.FC = () => {
  const { openBooking } = useBooking();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <Link className="footer-brand" href="/">
            VELLORA<span className="footer-cross">+</span>
          </Link>
          <p>Exceptional healthcare, always.</p>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-links-grid">
          <div className="footer-about">
            <p>
              Thoughtful healthcare, modern services and a people-first approach — brought together
              in one place.
            </p>
            <span className="footer-demo">Website concept · Sample content</span>
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <Link href="/">Home</Link>
            <Link href="/services">Our Services</Link>
            <Link href="/doctors">Our Doctors</Link>
            <Link href="/facilities">Facilities</Link>
            <Link href="/about">About Us</Link>
          </div>

          <div className="footer-col">
            <h3>Patient Care</h3>
            <Link href="/services">Specialties & Care</Link>
            <Link href="/contact">Patient Support</Link>
            <Link href="/patient/login">Patient Portal</Link>
            <button type="button" onClick={() => openBooking()}>
              Book Appointment
            </button>
          </div>

          <div className="footer-col">
            <h3>Popular Specialties</h3>
            <Link href="/services">Internal Medicine</Link>
            <Link href="/services">Home Nursing Care</Link>
            <Link href="/services">Patient Caretakers</Link>
            <Link href="/services">Lab Investigations</Link>
            <Link href="/doctors">Meet Our Specialists</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© <span id="footerYear">{currentYear}</span> Vellora Health. Design prototype.</span>
          <Link href="/" className="back-to-top">
            Back to top ↑
          </Link>
          <span>Built around better care.</span>
        </div>
      </div>
    </footer>
  );
};
