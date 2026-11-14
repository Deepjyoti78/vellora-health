'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Icon } from '@/components/common/Icon';

export default function PatientFamilyPage() {
  const { currentUser } = useAuth();
  const [familyMembers, setFamilyMembers] = useState(db.getFamilyMembers(currentUser.id));
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('Parent');
  const [gender, setGender] = useState('Female');
  const [dob, setDob] = useState('1960-04-12');
  const [bloodGroup, setBloodGroup] = useState('O+');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newMember = db.addFamilyMember({
      patientId: currentUser.id,
      fullName: fullName.trim(),
      relationship,
      gender,
      dob,
      bloodGroup,
    });

    setFamilyMembers([...familyMembers, newMember]);
    setFullName('');
    setShowAddModal(false);
  };

  const handleDeleteMember = (id: string) => {
    db.deleteFamilyMember(id);
    setFamilyMembers(familyMembers.filter((f) => f.id !== id));
  };

  return (
    <PatientLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Family Care Circles
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Family & Dependents
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Manage profiles for parents, children, and elderly relatives to book home visits on their behalf.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#116b70] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#0d5559] transition-colors self-start sm:self-center"
          >
            + Add Family Member
          </button>
        </div>

        {/* Family Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {familyMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between transition-shadow hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#116b70]/10 text-[#116b70] font-black text-base">
                    {member.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    {member.relationship}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-bold text-gray-900">{member.fullName}</h3>
                <div className="mt-2 space-y-1 text-xs text-gray-600">
                  <p>
                    <span className="text-gray-400">Gender:</span> {member.gender}
                  </p>
                  <p>
                    <span className="text-gray-400">Date of Birth:</span> {member.dob}
                  </p>
                  <p>
                    <span className="text-gray-400">Blood Group:</span>{' '}
                    <strong className="text-red-700">{member.bloodGroup}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-[11px] text-gray-400">Profile Verified</span>
                <button
                  onClick={() => handleDeleteMember(member.id)}
                  className="text-xs font-bold text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Add Dependent Profile</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddMember} className="mt-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Martha Vance"
                    className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Relationship</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Elderly Relative">Elderly Relative</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-Binary">Non-Binary</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-gray-300 p-2.5 text-xs"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#116b70] px-5 py-2 text-xs font-bold text-white hover:bg-[#0d5559]"
                  >
                    Save Dependent
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
