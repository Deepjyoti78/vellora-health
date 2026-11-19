'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Icon } from '@/components/common/Icon';
import { BackButton } from '@/components/common/BackButton';

export default function PatientSupportPage() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState(() =>
    currentUser ? db.getSupportTickets(currentUser.id) : []
  );
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  React.useEffect(() => {
    if (currentUser) {
      setTickets(db.getSupportTickets(currentUser.id));
    }
  }, [currentUser]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !currentUser) return;

    const newTicket = db.createSupportTicket({
      userId: currentUser.id,
      userName: currentUser.name,
      role: currentUser.role,
      subject: subject.trim(),
      message: message.trim(),
      priority,
    });

    setTickets([newTicket, ...tickets]);
    setSubject('');
    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const faqs = [
    {
      q: 'How does doorstep clinician verification work?',
      a: 'Every assigned Vellora Health practitioner has undergone a 7-point background check, state medical license verification, and continuous quality audits. Before entering, verify the 4-digit security PIN displayed on your booking tracking screen with the clinician.',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Bookings can be cancelled free of charge up to 2 hours before the scheduled arrival window. Refunds are automatically issued to your original payment method and settle within 24 hours.',
    },
    {
      q: 'How are blood samples and lab specimens handled?',
      a: 'Our certified phlebotomists use temperature-controlled cold chain transport containers and scan the sample barcode at your doorstep. Samples are transferred directly to our CAP-accredited central pathology lab.',
    },
    {
      q: 'Can I book 12-hour or 24-hour continuous nursing for elderly parents?',
      a: 'Yes. Our Home Nursing and Patient Caretaker services provide dedicated 12-hour day/night shifts as well as 24-hour rotating live-in shifts with full vitals monitoring, medication administration, and mobility assistance.',
    },
  ];

  return (
    <PatientLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 animate-fade-in-up">
        {/* Back to Dashboard Navigation Button */}
        <div className="mb-4">
          <BackButton href="/patient/dashboard" label="Back to Dashboard" />
        </div>

        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
            Help & Concierge
          </span>
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            Patient Support & Emergency Assistance
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Have questions about a visit, insurance claims, or require urgent clinical coordination? We are available 24/7.
          </p>
        </div>

        {/* Emergency SOS Banner */}
        <div className="mt-8 rounded-3xl border border-red-200 bg-linear-to-r from-red-600 to-rose-700 p-6 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-white animate-ping" />
                <span className="text-xs font-black uppercase tracking-widest text-red-100">
                  24/7 Medical Emergency Hotline
                </span>
              </div>
              <h2 className="text-xl font-black">Experiencing an acute medical crisis?</h2>
              <p className="text-xs text-red-100 max-w-xl">
                For life-threatening emergencies, immediate cardiac symptoms, or severe respiratory distress, dial 911 or call our direct clinical command desk.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:911"
                className="rounded-xl bg-white px-5 py-3 text-xs font-black text-red-700 shadow-md hover:bg-red-50"
              >
                Dial Emergency (911)
              </a>
              <a
                href="tel:+18005550199"
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/20"
              >
                Call Vellora Command Desk
              </a>
            </div>
          </div>
        </div>

        {/* Two Columns: Support Tickets & FAQs */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Submit & Track Tickets */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900">Create Support Inquiry</h3>
              <p className="mt-1 text-xs text-gray-500">
                Submit an inquiry regarding appointments, billing invoices, or clinical summaries.
              </p>

              <form onSubmit={handleSubmitTicket} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Question regarding Lab Report #LAB-7721"
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs"
                  >
                    <option value="LOW">Low (General question)</option>
                    <option value="MEDIUM">Medium (Scheduling or billing)</option>
                    <option value="HIGH">High (Visit today)</option>
                    <option value="URGENT">Urgent (Immediate clinician feedback)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry with relevant booking IDs..."
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                  />
                </div>

                {submitted && (
                  <p className="text-xs font-bold text-emerald-700">
                    Demo ticket saved for this session. No coordinator notification was sent.
                  </p>
                )}

                <button
                  type="submit"
                  className="rounded-xl bg-[#116b70] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>

            {/* Existing Tickets */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900">Your Recent Tickets</h3>
              <div className="mt-4 space-y-3">
                {tickets.length === 0 ? (
                  <p className="text-xs text-gray-500">No support tickets opened.</p>
                ) : (
                  tickets.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-gray-600">{t.ticketNumber}</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            t.status === 'RESOLVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <h4 className="mt-1 text-xs font-bold text-gray-900">{t.subject}</h4>
                      <p className="mt-1 text-gray-600 text-[11px] line-clamp-2">{t.message}</p>
                      <span className="mt-2 block text-[10px] text-gray-400">
                        Opened on {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs self-start">
            <h3 className="text-base font-bold text-gray-900">Frequently Asked Questions</h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Clear answers regarding home consultations, nursing shifts, and pathology tests.
            </p>

            <div className="mt-6 divide-y divide-gray-100">
              {faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div key={idx} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between text-left text-xs font-bold text-gray-900 hover:text-[#116b70]"
                    >
                      <span>{faq.q}</span>
                      <span className="ml-2 text-base font-normal text-gray-400">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs leading-relaxed text-gray-600">{faq.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
