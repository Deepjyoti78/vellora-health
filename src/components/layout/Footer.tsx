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
          <Link className="footer-brand" href="#home">
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
            <a href="#home">Home</a>
            <a href="#services">Our Services</a>
            <a href="#specialties">Specialties</a>
            <a href="#doctors">Our Doctors</a>
            <a href="#facilities">Facilities</a>
          </div>

          <div className="footer-col">
            <h3>Patient Care</h3>
            <a href="#faq">FAQs</a>
            <a href="#about">How We Care</a>
            <a href="#contact">Patient Support</a>
            <button type="button" onClick={() => openBooking()}>
              Book Appointment
            </button>
          </div>

          <div className="footer-col">
            <h3>Popular Specialties</h3>
            <a href="#specialties">Internal Medicine</a>
            <a href="#specialties">Cardiology</a>
            <a href="#specialties">Orthopedics</a>
            <a href="#specialties">Pediatrics</a>
            <a href="#specialties">Diagnostics</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© <span id="footerYear">{currentYear}</span> Vellora Health. Design prototype.</span>
          <a href="#home" className="back-to-top">
            Back to top ↑
          </a>
          <span>Built around better care.</span>
        </div>
      </div>
    </footer>
  );
};
