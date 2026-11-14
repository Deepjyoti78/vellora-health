'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';
import { ScrollAnimationProvider } from '@/components/common/ScrollAnimationProvider';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Doctor Home Consultation',
    subject: 'General Clinical Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <ScrollAnimationProvider>
      <div className="min-h-screen bg-[#fcfdfd]">
        {/* Light, Clean Header */}
        <Header theme="light" />

        {/* Premium Light Hero Section */}
        <div className="border-b border-[#e5ecec] bg-gradient-to-b from-[#f2f8f8] via-[#f7fafb] to-[#fcfdfd] py-12 md:py-16 text-center">
          <div className="container max-w-4xl">
            <p className="text-[11px] font-bold tracking-widest text-[#116b70] uppercase mb-2 animate-hero-trust">
              PATIENT SUPPORT &amp; CLINICAL COORDINATION
            </p>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#11191b] tracking-tight leading-tight animate-hero-title">
              We Are Here for You 24 Hours a Day
            </h1>
            <p className="mx-auto mt-3.5 max-w-2xl text-sm md:text-base text-[#4d5f63] leading-relaxed animate-hero-detail">
              Have questions about doorstep physician visits, continuous nursing shifts, or phlebotomy coverage? Our clinical care coordinators are on standby.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container py-10 md:py-14">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Direct Helpline & Hub Cards */}
            <div className="space-y-6 scroll-reveal-left">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
                <span className="rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 border border-teal-100">
                  Priority Care Desk
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-2">Direct Patient Helpline</h3>
                <p className="mt-1 text-xs text-gray-500">Live nursing triagers available 24/7</p>
                <p className="mt-3 text-xl font-extrabold text-teal-700">+1 (800) 555-VELLORA</p>
                <p className="text-xs text-gray-600 mt-0.5">care@vellorahealth.com</p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <Icon name="shield" size="xs" />
                  <span>EMERGENCY PROTOCOL</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-amber-900">
                  Vellora Health is an on-demand scheduled home clinical service. For acute life-threatening medical emergencies or severe trauma, please dial <strong>911 / 112</strong> immediately or visit your nearest emergency room.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900">Regional Coordination Hubs</h3>
                <div className="mt-3 space-y-3 text-xs text-gray-700">
                  <div className="border-b border-gray-100 pb-2">
                    <p className="font-bold text-gray-900">Bay Area Clinical Operations</p>
                    <p className="text-gray-500">742 Evergreen Terrace, Suite 400, San Francisco, CA</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Central Diagnostics &amp; Cold-Chain Depot</p>
                    <p className="text-gray-500">120 Ocean View Blvd, Building B, San Jose, CA</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-teal-900 p-6 text-white shadow-md">
                <h3 className="text-base font-bold text-white">Need Urgent Bedside Care?</h3>
                <p className="text-xs text-teal-200 mt-1 leading-relaxed">
                  You do not need to wait for an email reply. Book a doctor, nurse, or lab draw instantly through our self-service portal.
                </p>
                <Link href="/book" prefetch={true} className="button button-white button-sm mt-4 w-full text-center">
                  <span>Book Appointment Online</span>
                  <Icon name="arrow-right" size="xs" />
                </Link>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg lg:col-span-2 scroll-reveal-right">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Online Dispatch &amp; Support</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">Send a Care Coordination Inquiry</h2>
              <p className="mt-1 text-xs text-gray-600">
                Fill in your details below and a registered nurse or care coordinator will contact you within 15–30 minutes.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl bg-teal-50 p-8 text-center border border-teal-200 scroll-reveal-scale">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-white">
                    <Icon name="check" size="md" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-teal-950">Inquiry Received</h3>
                  <p className="mt-2 text-xs text-teal-800 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Vellora Health. Our care coordination desk has logged your request and will contact you via phone or email promptly.
                  </p>
                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="button button-dark button-sm text-xs"
                    >
                      Send Another Message
                    </button>
                    <Link href="/book" prefetch={true} className="button button-outline button-sm text-xs">
                      Book an Appointment Now
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor Vance"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Primary Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 234-5678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="patient@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Service of Interest
                      </label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      >
                        <option value="Doctor Home Consultation">Doctor Home Consultation</option>
                        <option value="Home Nursing Care">Home Nursing Care</option>
                        <option value="Patient Caretakers">Patient Caretakers &amp; Medical Maids</option>
                        <option value="Home Lab Tests">Home Lab Investigations &amp; Blood Tests</option>
                        <option value="Physiotherapy">Home Physiotherapy &amp; Rehab</option>
                        <option value="Critical Care ICU">Critical Care &amp; ICU Step-Down</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Inquiring about 24-hour post-op nursing care in San Francisco"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Clinical Requirements / Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please describe the patient's condition, current symptoms, required dates, or any special medical requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-gray-500">
                      *Strict confidentiality maintained under HIPAA medical privacy regulations.
                    </p>
                    <button type="submit" className="button button-dark">
                      <span>Submit Inquiry</span>
                      <Icon name="arrow-right" size="xs" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ScrollAnimationProvider>
  );
}
