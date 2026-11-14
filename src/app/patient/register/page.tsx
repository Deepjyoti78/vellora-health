'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/common/Icon';

export default function PatientRegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Female',
    bloodGroup: 'O+',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData.email || formData.phone, 'PATIENT');
    router.push('/patient/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8faf9] p-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-black text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#116b70] text-white">
              +
            </span>
            <span>Vellora Health</span>
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-gray-900">Patient Registration</h1>
          <p className="mt-2 text-xs text-gray-500">
            Create your personal medical profile for on-demand home healthcare and diagnostics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-xs font-bold text-gray-700">
            Full Name
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold text-gray-700">
              Email Address
              <input
                type="email"
                required
                placeholder="eleanor@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </label>

            <label className="block text-xs font-bold text-gray-700">
              Mobile Phone
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block text-xs font-bold text-gray-700">
              Date of Birth
              <input
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
              />
            </label>

            <label className="block text-xs font-bold text-gray-700">
              Biological Gender
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other / Prefer not to say</option>
              </select>
            </label>

            <label className="block text-xs font-bold text-gray-700">
              Blood Group
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-300 bg-[#fbfcfc] px-3.5 py-2.5 text-xs text-gray-900 focus:border-teal-500 focus:outline-none"
              >
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
                <option>Unknown</option>
              </select>
            </label>
          </div>

          <button type="submit" className="button button-dark w-full justify-center mt-2">
            Complete Registration <Icon name="arrow-right" size="xs" />
          </button>
        </form>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
          <span>Already registered? </span>
          <Link href="/patient/login" className="font-bold text-teal-700 hover:underline">
            Login via OTP
          </Link>
        </div>
      </div>
    </div>
  );
}
