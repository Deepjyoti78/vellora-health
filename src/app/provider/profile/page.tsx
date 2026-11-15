'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { ProviderLayout } from '@/components/layout/ProviderLayout';
import { Icon } from '@/components/common/Icon';

export default function ProviderProfilePage() {
  const { currentUser } = useAuth();
  const [specialty, setSpecialty] = useState(currentUser?.specialty || 'General Medicine');
  const [bio, setBio] = useState(currentUser?.bio || 'Compassionate healthcare provider dedicated to mobile home health delivery.');
  const [hourlyRate, setHourlyRate] = useState(currentUser?.hourlyRate || 85);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    db.updateUser(currentUser.id, { specialty, bio, hourlyRate, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const reviews = [
    {
      author: 'Eleanor Vance',
      rating: 5,
      date: 'Nov 12, 2026',
      service: 'Home Doctor Consultation',
      comment: 'Exceptionally thorough and gentle. Took the time to explain every detail of my medication and checked on my recovery.',
    },
    {
      author: 'Arthur Pendelton',
      rating: 5,
      date: 'Nov 04, 2026',
      service: 'Geriatric Health Assessment',
      comment: 'Arrived promptly with full diagnostic kit. Highly professional and warm demeanor. Made my mother feel completely at ease.',
    },
    {
      author: 'Clara Oswald',
      rating: 5,
      date: 'Oct 28, 2026',
      service: 'Post-Op Follow Up',
      comment: 'Superb bedside manner. The in-home visit saved us an agonizing trip to urgent care.',
    },
  ];

  return (
    <ProviderLayout>
      <div className="mx-auto max-w-[1360px] px-4 py-8 sm:px-6 space-y-6">
        <div className="animate-fade-in-up">
          <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
            Professional Credentialing
          </span>
          <h1 className="font-heading text-2xl font-black text-[#15212B] sm:text-3xl tracking-tight mt-0.5">
            Clinician Profile &amp; Reputation
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Keep your clinical qualifications, bio, and hourly rates current. Patients review these details prior to booking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Form */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-1">
              <h3 className="font-heading text-base font-extrabold text-[#15212B] tracking-tight">Clinical Profile Information</h3>

              <form onSubmit={handleSave} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser?.name || ''}
                      className="mt-1 block w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-2.5 text-xs text-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Clinical Role</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser?.role || ''}
                      className="mt-1 block w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-2.5 text-xs text-slate-700 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Sub-Specialty</label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-[#D9ECE7] bg-white p-2.5 text-xs font-medium focus:border-[#065F46] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Standard Base Fee ($/hr)</label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="mt-1 block w-full rounded-xl border border-[#D9ECE7] bg-white p-2.5 text-xs font-bold font-mono focus:border-[#065F46] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">Practitioner Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-[#D9ECE7] bg-white p-2.5 text-xs focus:border-[#065F46] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700">Mobile Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-[#D9ECE7] bg-white p-2.5 text-xs focus:border-[#065F46] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || ''}
                      className="mt-1 block w-full rounded-xl border border-[#D9ECE7] bg-[#F7FBF9] p-2.5 text-xs text-slate-500"
                    />
                  </div>
                </div>

                {savedSuccess && (
                  <p className="text-xs font-bold text-emerald-700 animate-fade-in-up">Profile saved successfully!</p>
                )}

                <div className="flex justify-end pt-2 border-t border-[#F2F8F5]">
                  <button
                    type="submit"
                    className="rounded-xl bg-[#065F46] hover:bg-[#054d39] px-6 py-2.5 text-xs font-bold text-white shadow-2xs hover:shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Verified Patient Reviews */}
            <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-extrabold text-[#15212B] tracking-tight">Verified Patient Reviews</h3>
                  <p className="text-xs text-slate-500">Collected post-visit from authenticated consultations.</p>
                </div>
                <div className="text-right">
                  <span className="font-heading text-2xl font-black text-amber-500">{currentUser?.rating || 4.9} ★</span>
                  <span className="block text-[10px] text-slate-400 font-medium">100% Recommended</span>
                </div>
              </div>

              <div className="mt-6 divide-y divide-[#F2F8F5]">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="py-4 hover:bg-[#F7FBF9] px-2 rounded-xl transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#15212B]">{rev.author}</span>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="mt-0.5 text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}
                      <span className="ml-2 text-[11px] font-semibold text-[#065F46]">
                        {rev.service}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Credentials & Certifications Card */}
          <div className="space-y-6">
            <div className="rounded-[24px] border border-[#D9ECE7] bg-white p-6 shadow-2xs provider-card-lift transition-all duration-300 animate-fade-in-up animate-delay-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
                Peer Review Accreditation
              </span>
              <h3 className="mt-1 font-heading text-base font-extrabold text-[#15212B] tracking-tight">Active Medical Licensure</h3>

              <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-900 font-bold">Status:</span>
                  <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black text-white">
                    VERIFIED &amp; ACTIVE
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-900">State Board:</span>
                  <span className="font-semibold text-slate-900">Medical Board of California</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-900">License Number:</span>
                  <span className="font-mono font-bold text-slate-900">MD-CA-928104</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-900">Expiration Date:</span>
                  <span className="font-semibold text-slate-900">Dec 31, 2027</span>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-emerald-600" />
                  <span>Criminal Background Check (Clear)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-emerald-600" />
                  <span>Malpractice Insurance ($1M / $3M Umbrella)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-emerald-600" />
                  <span>BLS / ACLS Resuscitation Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
}
