'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/common/Icon';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#11191b] text-white">
        <Header />
        <div className="container py-14 text-center">
          <p className="eyebrow text-teal-300">WE ARE HERE FOR YOU</p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Contact Vellora Health Support
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-300">
            Have questions about home clinical care, custom attendant shifts, or corporate wellness? Our dedicated patient coordinators are available daily.
          </p>
        </div>
      </div>

      <div className="container py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Direct Patient Helpline</h3>
              <p className="mt-1 text-xs text-gray-500">Available 7:00 AM – 10:00 PM EST daily</p>
              <p className="mt-3 text-lg font-extrabold text-teal-700">+1 (800) 555-VELLORA</p>
              <p className="mt-1 text-xs text-gray-600">support@vellorahealth.com</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Emergency Protocol Notice</h3>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                Vellora Health is an on-demand scheduled home clinical care service. For acute, life-threatening medical emergencies or severe trauma, please dial your local emergency services immediately (such as 112 / 108 / local ambulance) or visit the nearest hospital emergency ICU.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Regional Coordination Centers</h3>
              <div className="mt-3 space-y-3 text-xs text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900">Springfield Clinical Hub</p>
                  <p className="text-gray-500">742 Medical Center Way, Suite 400</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Metro Logistics &amp; Lab Hub</p>
                  <p className="text-gray-500">120 Ocean View Blvd, Building B</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900">Send an Inquiry</h2>
            <p className="mt-2 text-xs text-gray-600">
              Fill in your details below and a clinical coordinator will contact you within 2 hours.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-2xl bg-teal-50 p-8 text-center border border-teal-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white">
                  <Icon name="check" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-teal-900">Inquiry Received</h3>
                <p className="mt-2 text-xs text-teal-800">
                  Thank you for reaching out to Vellora Health. Our care team has received your message and will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="button button-dark button-sm mt-6"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-bold text-gray-700">
                    Full Name
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
                    />
                  </label>

                  <label className="block text-xs font-bold text-gray-700">
                    Phone Number
                    <input
                      type="tel"
                      required
                      placeholder="Your contact number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-bold text-gray-700">
                    Email Address
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
                    />
                  </label>

                  <label className="block text-xs font-bold text-gray-700">
                    Subject / Concern
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
                    >
                      <option>General Inquiry</option>
                      <option>Doctor Home Visits</option>
                      <option>Nursing Care Coordination</option>
                      <option>Long-Term Bedside Attendant</option>
                      <option>Lab Diagnostic Questions</option>
                      <option>Corporate Partnership</option>
                    </select>
                  </label>
                </div>

                <label className="block text-xs font-bold text-gray-700">
                  Message Details
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your medical requirement, patient condition, or questions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
                  ></textarea>
                </label>

                <button type="submit" className="button button-dark mt-2">
                  Submit Inquiry <Icon name="arrow-right" size="xs" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
