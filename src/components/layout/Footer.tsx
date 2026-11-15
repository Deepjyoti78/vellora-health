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
        <div className="footer-top flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6">
          <Link className="inline-block group" href="/" aria-label="Velora Healthcare, home">
            <img
              src="/assets/logo-white.png"
              alt="Velora Healthcare"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>
          <p className="text-slate-400 text-sm">Exceptional healthcare, always.</p>
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
            <Link href="/about">About Us</Link>
          </div>

          <div className="footer-col">
            <h3>Core Services</h3>
            <Link href="/services/home-doctor-visit">Home Doctor Visit</Link>
            <Link href="/services/home-nursing-care">At-Home Nursing Care</Link>
            <Link href="/services/patient-caretakers-medical-maids">Patient Caretakers</Link>
            <Link href="/services/home-lab-investigations">Home Lab Tests</Link>
            <Link href="/services">View All Services</Link>
          </div>

          <div className="footer-col">
            <h3>Portals &amp; Access</h3>
            <Link href="/patient/login">Patient Portal</Link>
            <Link href="/provider/login">Clinician Workstation</Link>
            <Link href="/admin/dashboard">Admin Command Desk</Link>
            <Link href="/join-as-provider" className="text-emerald-400 font-semibold hover:underline">
              Join Our Care Team &rarr;
            </Link>
            <Link href="/contact">24/7 Care Helpline</Link>
            <Link href="/book" prefetch={true} className="text-left font-semibold text-teal-400 hover:text-teal-300 hover:underline">
              Book Home Appointment &rarr;
            </Link>
          </div>

          <div className="footer-col">
            <h3>Specialties &amp; Doctors</h3>
            <Link href="/doctors">General Medicine</Link>
            <Link href="/doctors">Geriatric Care</Link>
            <Link href="/doctors">Post-Surgical Nursing</Link>
            <Link href="/services/diagnostics-labs">Accredited Labs</Link>
            <Link href="/about">Clinical Governance</Link>
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
