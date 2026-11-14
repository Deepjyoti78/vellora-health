'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Icon } from '@/components/common/Icon';

export default function PatientAccountPage() {
  const { currentUser } = useAuth();
  const [addresses, setAddresses] = useState(db.getAddresses(currentUser.id));
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
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('Marcus Vance');
  const [emergencyRelation, setEmergencyRelation] = useState('Brother');
  const [emergencyPhone, setEmergencyPhone] = useState('+1 (555) 998-1122');

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress.trim()) return;

    const newAddr = db.addAddress({
      patientId: currentUser.id,
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
    db.updateUser(currentUser.id, { name, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PatientLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
            Personal Preferences
          </span>
          <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
            Account & Delivery Addresses
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Manage your personal contact info, saved residences for home medical dispatch, and emergency contacts.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Personal info & Emergency Contact */}
          <div className="space-y-6 lg:col-span-1">
            {/* User Profile Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#116b70] text-2xl font-black text-white">
                  {currentUser.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{currentUser.name}</h3>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    Verified Patient Account
                  </span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="mt-6 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-xs text-gray-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700">Mobile Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs font-medium"
                  />
                </div>

                {savedSuccess && (
                  <p className="text-xs font-bold text-emerald-700">Profile saved successfully!</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#116b70] py-2.5 text-xs font-bold text-white hover:bg-[#0d5559] transition-colors"
                >
                  Save Profile
                </button>
              </form>
            </div>

            {/* Emergency SOS Contact */}
            <div className="rounded-3xl border border-red-200 bg-red-50/40 p-6 shadow-xs">
              <div className="flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 text-red-600" />
                <h3 className="text-sm font-bold text-red-950">Emergency SOS Contact</h3>
              </div>
              <p className="mt-1 text-[11px] text-red-700">
                Contacted automatically if a visiting clinician marks an in-home vital emergency.
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div>
                  <label className="text-gray-600">Contact Name:</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-red-200 bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Relation:</label>
                  <input
                    type="text"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-red-200 bg-white p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-gray-600">Emergency Phone:</label>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-red-200 bg-white p-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Addresses */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Saved Care Locations</h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Clinicians use these addresses and gate instructions when dispatched.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="rounded-xl bg-[#116b70] px-4 py-2 text-xs font-bold text-white hover:bg-[#0d5559] transition-colors"
                >
                  + Add Address
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 p-4 transition-all hover:border-gray-300 sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-700">
                          {addr.tag}
                        </span>
                        {addr.isDefault && (
                          <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            Default Address
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm font-bold text-gray-900">{addr.streetAddress}</p>
                      {addr.apartment && (
                        <p className="text-xs text-gray-500">Suite/Apt: {addr.apartment}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification & Communication Toggles */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs">
              <h3 className="text-base font-bold text-gray-900">Communication Preferences</h3>
              <div className="mt-4 divide-y divide-gray-100 text-xs">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-bold text-gray-900 block">SMS Dispatch Alerts</span>
                    <span className="text-gray-500">Receive real-time driver ETA and doorstep security PIN via SMS.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-[#116b70] rounded focus:ring-[#116b70]" />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-bold text-gray-900 block">Diagnostic Lab Release Notifications</span>
                    <span className="text-gray-500">Instant email & in-app alert when certified lab results are published.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-[#116b70] rounded focus:ring-[#116b70]" />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <span className="font-bold text-gray-900 block">Prescription Refill Reminders</span>
                    <span className="text-gray-500">Helpful automated reminders for ongoing chronic therapy dosages.</span>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-[#116b70] rounded focus:ring-[#116b70]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Add New Care Address</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Address Label</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs"
                  >
                    <option value="Home">Home</option>
                    <option value="Parent's House">Parent&apos;s House</option>
                    <option value="Work / Office">Work / Office</option>
                    <option value="Temporary Stay">Temporary Stay</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Street Address</label>
                  <input
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace"
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700">Apartment / Suite (Optional)</label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Apt 4B"
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Zip Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 text-[#116b70] rounded"
                  />
                  <label htmlFor="isDefault" className="text-xs font-medium text-gray-700">
                    Set as default delivery address
                  </label>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#116b70] px-5 py-2 text-xs font-bold text-white hover:bg-[#0d5559]"
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
