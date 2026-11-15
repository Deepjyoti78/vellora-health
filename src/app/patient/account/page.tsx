'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { BackButton } from '@/components/common/BackButton';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Activity,
  CreditCard,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Stethoscope,
  Settings,
  Bell,
  Lock,
  KeyRound,
  Smartphone,
  Eye,
  FileDown,
  Shield,
  Check,
} from 'lucide-react';

function PatientAccountContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'settings' ? 'settings' : 'profile';
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>(initialTab);

  useEffect(() => {
    if (searchParams.get('tab') === 'settings') {
      setActiveTab('settings');
    }
  }, [searchParams]);

  const { currentUser } = useAuth();
  const user = currentUser || {
    id: '',
    name: 'Patient User',
    email: 'patient@vellora.com',
    phone: '+1 (555) 234-5678',
    role: 'PATIENT' as const,
    avatar: '/assets/avatar-1.webp',
  };

  const [addresses, setAddresses] = useState(() => db.getAddresses(user.id));
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Address form
  const [tag, setTag] = useState('Home');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [postalCode, setPostalCode] = useState('94107');
  const [isDefault, setIsDefault] = useState(false);

  // Profile Form
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Settings State
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailSummaries, setEmailSummaries] = useState(true);
  const [pinVerification, setPinVerification] = useState(true);
  const [ehrSharing, setEhrSharing] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setAddresses(db.getAddresses(currentUser.id));
    }
  }, [currentUser]);

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('Marcus Vance');
  const [emergencyRelation, setEmergencyRelation] = useState('Brother');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 998-1122');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress.trim()) return;

    const newAddr = db.addAddress({
      patientId: user.id,
      tag,
      streetAddress: streetAddress.trim(),
      apartment: apartment.trim() || undefined,
      city,
      state,
      postalCode,
      isDefault,
    });

    setAddresses([...addresses, newAddr]);
    setStreetAddress('');
    setApartment('');
    setShowAddressModal(false);
  };

  const handleDeleteAddress = (id: string) => {
    db.deleteAddress(id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateUser(user.id, { name, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  return (
    <PatientLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 animate-fade-in-up">
        {/* Back to Dashboard Navigation Button */}
        <div className="mb-4">
          <BackButton href="/patient/dashboard" label="Back to Dashboard" />
        </div>

        {/* Customer Profile Header Banner */}
        <div className="overflow-hidden rounded-3xl border border-[#E2EBE7] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#064E3B] text-2xl font-black text-white shadow-xs">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#102820]">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
                    <ShieldCheck className="h-3 w-3" />
                    Verified Customer Account
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Customer ID: <strong className="font-mono text-slate-700">VEL-PAT-2026-89</strong> • Enrolled since Jan 2025
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-[#065F46]" />
                    {user.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-[#065F46]" />
                    {user.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:self-start">
              <Link
                href="/book"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#065F46] transition-colors"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Book Home Visit</span>
              </Link>
              <Link
                href="/patient/dashboard"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#CBDCD5] bg-white px-4 py-2 text-xs font-bold text-[#102820] hover:bg-[#F2F8F5] transition-colors"
              >
                <span>Dashboard Overview</span>
              </Link>
            </div>
          </div>

          {/* Quick Clinical Team Overview Strip */}
          <div className="mt-6 pt-5 border-t border-[#F2F8F5] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF9] p-3 border border-[#E2EBE7]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#CBDCD5] text-[#065F46]">
                <Stethoscope className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Visiting Doctor</p>
                <p className="text-xs font-bold text-[#102820]">Dr. Maya Patel, MD</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF9] p-3 border border-[#E2EBE7]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#CBDCD5] text-[#065F46]">
                <HeartPulse className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Care Coordinator</p>
                <p className="text-xs font-bold text-[#102820]">Nurse Sarah Jenkins, RN</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-[#F8FAF9] p-3 border border-[#E2EBE7]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#CBDCD5] text-[#065F46]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan Status</p>
                <p className="text-xs font-bold text-[#065F46]">Active Premium Care • 24/7 Priority</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Profile & Vitals vs Account Settings */}
        <div className="mt-8 flex items-center gap-2 border-b border-[#CBDCD5]/70 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Profile &amp; Vitals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#064E3B] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Account Settings &amp; Security</span>
          </button>
        </div>

        {activeTab === 'profile' ? (
          <>
            {/* Customer Vitals & Clinical Metrics Strip */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Recorded Clinical Vitals (Latest Home Visit)
                </h2>
                <span className="text-[11px] font-medium text-slate-400">Verified by Visiting Clinician</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-[#E2EBE7] bg-white p-4 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Blood Pressure</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#102820]">120/80</span>
                    <span className="text-[10px] font-bold text-slate-400">mmHg</span>
                  </div>
                  <span className="mt-1 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Optimal
                  </span>
                </div>

                <div className="rounded-2xl border border-[#E2EBE7] bg-white p-4 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Heart Rate</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#102820]">72</span>
                    <span className="text-[10px] font-bold text-slate-400">bpm</span>
                  </div>
                  <span className="mt-1 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Normal Resting
                  </span>
                </div>

                <div className="rounded-2xl border border-[#E2EBE7] bg-white p-4 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Blood Oxygen</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#102820]">99%</span>
                    <span className="text-[10px] font-bold text-slate-400">SpO2</span>
                  </div>
                  <span className="mt-1 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Excellent
                  </span>
                </div>

                <div className="rounded-2xl border border-[#E2EBE7] bg-white p-4 shadow-2xs">
                  <span className="text-[11px] font-semibold text-slate-500 block">Blood Type &amp; Allergy</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-[#102820]">O+</span>
                    <span className="text-[10px] font-bold text-slate-400">Positive</span>
                  </div>
                  <span className="mt-1 inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Penicillin Allergy
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Column Detailed Information Grid */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column: Personal Information & Emergency Contact */}
              <div className="space-y-6 lg:col-span-1">
                {/* User Edit Form */}
                <div className="rounded-3xl border border-[#E2EBE7] bg-white p-6 shadow-xs">
                  <h3 className="text-base font-bold text-[#102820]">Personal Information</h3>
                  <p className="text-xs text-slate-500 mt-0.5 mb-4">
                    Update your contact details for bedside appointment confirmations.
                  </p>

                  <form onSubmit={handleSaveProfile} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-[#CBDCD5] bg-white p-2.5 text-xs font-medium text-[#102820] focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Mobile Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-[#CBDCD5] bg-white p-2.5 text-xs font-medium text-[#102820] focus:border-[#064E3B] focus:outline-none focus:ring-1 focus:ring-[#064E3B]"
                      />
                    </div>

                    {savedSuccess && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-[#D1FAE5] p-2 rounded-lg">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Profile saved successfully!</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full rounded-full bg-[#064E3B] py-2.5 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-xs"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>

                {/* Emergency SOS Contact */}
                <div className="rounded-3xl border border-red-200 bg-red-50/40 p-6 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-red-600" />
                    <h3 className="text-sm font-bold text-red-950">Emergency SOS Contact</h3>
                  </div>
                  <p className="mt-1 text-[11px] text-red-700 leading-relaxed">
                    Contacted immediately if a visiting clinician triggers bedside vital triage.
                  </p>

                  <div className="mt-4 space-y-2.5 text-xs">
                    <div>
                      <label className="text-slate-600">Contact Name</label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-red-200 bg-white p-2 text-xs text-[#102820]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600">Relationship</label>
                      <input
                        type="text"
                        value={emergencyRelation}
                        onChange={(e) => setEmergencyRelation(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-red-200 bg-white p-2 text-xs text-[#102820]"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600">Emergency Phone</label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-red-200 bg-white p-2 text-xs font-mono text-[#102820]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 2 Columns: Saved Addresses & Insurance */}
              <div className="space-y-6 lg:col-span-2">
                {/* Saved Residences */}
                <div className="rounded-3xl border border-[#E2EBE7] bg-white p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#102820]">Saved Care Residences</h3>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Clinicians dispatch to these addresses with gate codes and entry instructions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#064E3B] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#065F46] transition-colors shadow-2xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Address</span>
                    </button>
                  </div>

                  <div className="mt-5 space-y-3.5">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2EBE7] p-4 transition-all hover:border-[#CBDCD5] hover:shadow-2xs sm:flex-row sm:items-center bg-[#FDFEFE]"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                              {addr.tag}
                            </span>
                            {addr.isDefault && (
                              <span className="rounded-md bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                                Primary Residence
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm font-bold text-[#102820] flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-[#065F46] shrink-0" />
                            {addr.streetAddress}
                          </p>
                          {addr.apartment && (
                            <p className="text-xs text-slate-500 ml-5">Apt / Flat: {addr.apartment}</p>
                          )}
                          <p className="text-xs text-slate-500 ml-5">
                            {addr.city}, {addr.state} {addr.postalCode}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Health Insurance & Coverage */}
                <div className="rounded-3xl border border-[#E2EBE7] bg-white p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="h-4 w-4 text-[#065F46]" />
                      <h3 className="text-base font-bold text-[#102820]">Health Insurance &amp; Coverage</h3>
                    </div>
                    <span className="rounded-full bg-[#ECFDF5] border border-[#D1FAE5] px-2.5 py-0.5 text-[10px] font-bold text-[#065F46]">
                      Verified In-Network
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50/50">
                      <span className="text-[11px] font-semibold text-slate-500 block">Insurance Carrier</span>
                      <span className="text-sm font-bold text-[#102820] block mt-0.5">Blue Cross Blue Shield Premier (PPO)</span>
                      <span className="text-[11px] text-slate-500 block mt-1">Policy ID: <strong className="font-mono text-slate-700">BCBS-8829-4410</strong></span>
                    </div>

                    <div className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50/50">
                      <span className="text-[11px] font-semibold text-slate-500 block">Home Visit Copay</span>
                      <span className="text-sm font-bold text-[#065F46] block mt-0.5">$15 Standard In-Network</span>
                      <span className="text-[11px] text-slate-500 block mt-1">Group ID: <strong className="font-mono text-slate-700">GRP-99201</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Account Settings View */
          <div className="mt-6 space-y-6 animate-fade-in">
            {/* Notification Preferences */}
            <div className="rounded-3xl border border-[#E2EBE7] bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#065F46]">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#102820]">Visit Notifications &amp; Alerts</h3>
                  <p className="text-xs text-slate-500">
                    Control how you receive status updates when clinicians are dispatched to your home.
                  </p>
                </div>
              </div>

              <div className="mt-6 divide-y divide-slate-100">
                <div className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-xs font-bold text-[#102820]">SMS Dispatch Countdown</p>
                    <p className="text-[11px] text-slate-500">
                      Receive text alerts when clinician departs and arrives at your gate.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmsAlerts(!smsAlerts)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      smsAlerts ? 'bg-[#064E3B]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        smsAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-xs font-bold text-[#102820]">WhatsApp Visit Summaries &amp; Rx</p>
                    <p className="text-[11px] text-slate-500">
                      Receive immediate PDF prescriptions and visit notes after clinician checkup.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      whatsappAlerts ? 'bg-[#064E3B]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        whatsappAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-xs font-bold text-[#102820]">Email Invoices &amp; Care Records</p>
                    <p className="text-[11px] text-slate-500">
                      Receive itemized billing receipts and monthly clinical overview reports.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailSummaries(!emailSummaries)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      emailSummaries ? 'bg-[#064E3B]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        emailSummaries ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Bedside Safety & Security */}
            <div className="rounded-3xl border border-[#E2EBE7] bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#065F46]">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#102820]">Bedside Safety &amp; Doorstep Verification</h3>
                  <p className="text-xs text-slate-500">
                    Patient safety features enforced during home clinician visits.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-[#E2EBE7] p-4 bg-[#F8FAF9]">
                  <div className="pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#102820]">4-Digit Bedside Security PIN</span>
                      <span className="rounded-md bg-[#ECFDF5] border border-[#D1FAE5] px-2 py-0.5 text-[10px] font-bold text-[#065F46]">
                        Recommended
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Before entering your residence, the visiting doctor or nurse must match the dynamic security PIN displayed on your booking card.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPinVerification(!pinVerification)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      pinVerification ? 'bg-[#064E3B]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        pinVerification ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[#E2EBE7] p-4 bg-[#F8FAF9]">
                  <div className="pr-4">
                    <span className="text-xs font-bold text-[#102820]">Visiting Clinician EHR Sharing</span>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Permit assigned visiting physicians to review past vitals, allergies, and lab results for diagnostic accuracy.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEhrSharing(!ehrSharing)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      ehrSharing ? 'bg-[#064E3B]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        ehrSharing ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Password & Credential Security */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Change Password Form */}
              <div className="rounded-3xl border border-[#E2EBE7] bg-white p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="h-4 w-4 text-[#065F46]" />
                  <h3 className="text-sm font-bold text-[#102820]">Update Account Password</h3>
                </div>
                <form onSubmit={handlePasswordChange} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-[#CBDCD5] bg-white p-2.5 text-xs text-[#102820] focus:border-[#064E3B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">New Password</label>
                    <input
                      type="password"
                      placeholder="Min 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-[#CBDCD5] bg-white p-2.5 text-xs text-[#102820] focus:border-[#064E3B] focus:outline-none"
                    />
                  </div>

                  {passwordSuccess && (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46] bg-[#ECFDF5] border border-[#D1FAE5] p-2 rounded-lg">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Password updated successfully!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#064E3B] py-2 text-xs font-bold text-white hover:bg-[#065F46] transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              {/* Data & Privacy Actions */}
              <div className="rounded-3xl border border-[#E2EBE7] bg-white p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileDown className="h-4 w-4 text-[#065F46]" />
                    <h3 className="text-sm font-bold text-[#102820]">Medical Data Portability</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Download an encrypted archive containing all consultation summaries, blood test pathology records, and vitals logs.
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => alert('Your comprehensive clinical record (PDF/EHR) has been generated and downloaded.')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#064E3B] bg-white py-2 px-4 text-xs font-bold text-[#064E3B] hover:bg-[#F2F8F5] transition-colors"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    <span>Download Comprehensive Health Record (PDF)</span>
                  </button>
                  <span className="text-[10px] text-center text-slate-400">
                    Compliant with HIPAA / ABDM patient data privacy standards.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl animate-scale-in">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#102820]">Add New Care Address</h3>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Address Label</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 p-2 text-xs"
                  >
                    <option value="Home">Home</option>
                    <option value="Parent's House">Parent&apos;s House</option>
                    <option value="Work / Office">Work / Office</option>
                    <option value="Temporary Stay">Temporary Stay</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 120 Ocean View Blvd"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Apartment / Suite (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Apt 4B, Gate Code #1234"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-slate-300 p-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded text-[#064E3B] focus:ring-[#064E3B]"
                  />
                  <label htmlFor="isDefault" className="text-xs text-slate-700 font-medium">
                    Set as default visit address
                  </label>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#064E3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#065F46]"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

export default function PatientAccountPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-semibold text-slate-400">Loading profile &amp; settings...</div>}>
      <PatientAccountContent />
    </Suspense>
  );
}
