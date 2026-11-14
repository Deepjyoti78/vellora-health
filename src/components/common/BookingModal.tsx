'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useBooking } from '@/context/BookingContext';
import { Icon } from './Icon';

const SPECIALTY_OPTIONS = [
  'General consultation',
  'Internal Medicine',
  'Family Medicine',
  'Cardiology',
  'Orthopedics',
  'Neurology',
  'Dermatology',
  'Pediatrics',
  'Gynecology',
  'Physiotherapy',
  'Ophthalmology',
  'General Surgery',
  'Psychiatry',
  'Endocrinology',
  'Pulmonology',
  'Urology',
  'Gastroenterology',
  'Diagnostics',
  'Teleconsultation',
];

export const BookingModal: React.FC = () => {
  const { isOpen, specialty, doctor, closeBooking } = useBooking();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    specialty: 'General consultation',
    date: '',
    doctor: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Get current local date for min date attribute
  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      returnFocusRef.current = document.activeElement as HTMLElement;
      setIsSubmitted(false);

      const matchedSpecialty = SPECIALTY_OPTIONS.includes(specialty)
        ? specialty
        : 'General consultation';

      setFormData({
        name: '',
        phone: '',
        specialty: matchedSpecialty,
        date: '',
        doctor: doctor || '',
      });

      document.body.style.overflow = 'hidden';

      // Autofocus first input
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      returnFocusRef.current?.focus();
    }
  }, [isOpen, specialty, doctor]);

  // Focus trap and Escape listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeBooking();
        return;
      }

      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]):not([hidden]), input:not([disabled]):not([hidden]), select:not([disabled]):not([hidden]), a[href]'
        )
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeBooking]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      doneButtonRef.current?.focus();
    }, 50);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop is-visible"
      id="bookingModal"
      aria-hidden={!isOpen}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          closeBooking();
        }
      }}
    >
      <div
        className="booking-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookingTitle"
        tabIndex={-1}
      >
        <div className="modal-heading">
          <div>
            <p className="eyebrow">START YOUR CARE JOURNEY</p>
            <h2 id="bookingTitle">Request an appointment</h2>
          </div>
          <button
            type="button"
            id="modalClose"
            className="modal-close"
            aria-label="Close booking form"
            onClick={closeBooking}
          >
            <Icon name="close" />
          </button>
        </div>

        <p className="modal-copy">
          This is a UI demonstration. No appointment is created or information sent to a clinic.
        </p>

        {!isSubmitted ? (
          <form id="bookingForm" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Full name
                <input
                  ref={nameInputRef}
                  id="patientName"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </label>

              <label>
                Phone number
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Your contact number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </label>

              <label>
                Service / Specialty
                <select
                  id="bookingSpecialty"
                  name="specialty"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                >
                  {SPECIALTY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Preferred date
                <input
                  id="bookingDate"
                  name="date"
                  type="date"
                  min={minDate}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </label>
            </div>

            <label className="full-label">
              Preferred doctor (optional)
              <input
                id="bookingDoctor"
                name="doctor"
                type="text"
                placeholder="Doctor name (optional)"
                value={formData.doctor}
                onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              />
            </label>

            <button type="submit" className="button button-dark form-submit">
              Preview request <Icon name="arrow-right" size="sm" />
            </button>
          </form>
        ) : (
          <div className="booking-success" id="bookingSuccess" role="status">
            <div className="success-icon">
              <Icon name="check" />
            </div>
            <h3>Request preview complete</h3>
            <p>
              Your form was filled out successfully, but no appointment was booked and no data was
              transmitted.
            </p>
            <button
              ref={doneButtonRef}
              className="button button-dark"
              id="bookingDone"
              type="button"
              onClick={closeBooking}
            >
              Close preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
