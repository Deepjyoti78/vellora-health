'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { Icon } from '@/components/common/Icon';

export default function PatientDashboardPage() {
  const { currentUser } = useAuth();
  const userId = currentUser?.id || '';
  const bookings = db.getBookingsByPatient(userId);
  const activeBookings = bookings.filter((b) =>
    ['REQUESTED', 'CONFIRMED', 'ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(b.status)
  );
  const prescriptions = db.getPrescriptionsByPatient(userId);
  const labReports = db.getLabReportsByPatient(userId);
  const familyMembers = db.getFamilyMembers(userId);

  const quickServices = [
    { name: 'Doctor Visit', slug: 'home-doctor-visit', icon: 'stethoscope' as const, bg: 'bg-emerald-50 text-emerald-800' },
    { name: 'Home Nursing', slug: 'home-nursing-care', icon: 'heartbeat' as const, bg: 'bg-blue-50 text-blue-800' },
    { name: 'Caretaker Shift', slug: 'patient-caretakers-medical-maids', icon: 'bed' as const, bg: 'bg-amber-50 text-amber-800' },
    { name: 'Lab Blood Draw', slug: 'home-lab-investigations', icon: 'flask' as const, bg: 'bg-purple-50 text-purple-800' },
  ];

  return (
    <PatientLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#116b70]">
              Patient Portal
            </span>
            <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Patient'}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              Manage your upcoming visits, family profiles, prescriptions, and diagnostic lab reports.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/patient/book"
              className="button button-dark button-sm text-xs"
            >
              <Icon name="calendar" size="xs" /> Book New Service
            </Link>
          </div>
        </div>

        {/* Quick Service Launchers */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickServices.map((qs) => (
            <Link
              key={qs.slug}
              href={`/services/${qs.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-teal-500 hover:shadow-md"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${qs.bg}`}>
                <Icon name={qs.icon} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{qs.name}</p>
                <p className="text-[10px] text-gray-500">Book visit →</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main 2-column area */}
          <div className="space-y-8 lg:col-span-2">
            {/* Active / Upcoming Bookings */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">Active &amp; Upcoming Visits</h2>
                  <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800">
                    {activeBookings.length} Active
                  </span>
                </div>
                <Link href="/patient/bookings" className="text-xs font-bold text-[#116b70] hover:underline">
                  View All ({bookings.length}) →
                </Link>
              </div>

              {activeBookings.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {activeBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-gray-200 bg-[#fbfdfc] p-4 sm:p-5 transition hover:shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                        <span className="text-xs font-bold text-gray-900">
                          {booking.bookingNumber}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                            booking.status === 'CONFIRMED'
                              ? 'bg-blue-100 text-blue-800'
                              : booking.status === 'IN_PROGRESS'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          ● {booking.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">{booking.serviceName}</h3>
                          <p className="text-xs text-gray-600">
                            For: <strong className="text-gray-900">{booking.beneficiaryName}</strong> ({booking.beneficiaryRelation})
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            📅 {booking.scheduledDate} &bull; ⏰ {booking.scheduledTimeSlot}
                          </p>
                          {booking.providerName && (
                            <p className="mt-1 text-xs font-semibold text-teal-800">
                              Assigned Professional: {booking.providerName}
                            </p>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-end gap-2">
                          <Link
                            href={`/patient/bookings/${booking.id}`}
                            className="button button-dark button-sm text-xs"
                          >
                            Live Status <Icon name="arrow-right" size="xs" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-xs text-gray-500">No active visits scheduled at this moment.</p>
                  <Link href="/patient/book" className="button button-dark button-sm mt-3">
                    Schedule Your First Visit
                  </Link>
                </div>
              )}
            </div>

            {/* Medical Records Summary */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Recent Prescriptions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900">Latest Prescriptions</h3>
                  <Link href="/patient/records" className="text-[11px] font-bold text-[#116b70]">
                    All →
                  </Link>
                </div>
                <div className="mt-3 space-y-3">
                  {prescriptions.length > 0 ? (
                    prescriptions.map((rx) => (
                      <div key={rx.id} className="rounded-xl border border-gray-100 bg-[#fbfcfc] p-3">
                        <p className="text-xs font-bold text-gray-900">{rx.diagnosis}</p>
                        <p className="text-[11px] text-teal-700 font-semibold">{rx.doctorName}</p>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {rx.medications.length} medication(s) prescribed
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 py-3">No prescriptions recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Recent Lab Reports */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900">Diagnostic Reports</h3>
                  <Link href="/patient/records" className="text-[11px] font-bold text-[#116b70]">
                    All →
                  </Link>
                </div>
                <div className="mt-3 space-y-3">
                  {labReports.length > 0 ? (
                    labReports.map((lab) => (
                      <div key={lab.id} className="rounded-xl border border-gray-100 bg-[#fbfcfc] p-3">
                        <p className="text-xs font-bold text-gray-900">{lab.testName}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            ✓ {lab.status}
                          </span>
                          <Link
                            href={`/patient/records/${lab.id}`}
                            className="text-[11px] font-bold text-teal-700 hover:underline"
                          >
                            View PDF →
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 py-3">No lab reports available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Family Members Widget */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-900">Family Members</h3>
                <Link href="/patient/family" className="text-xs font-bold text-[#116b70]">
                  Manage +
                </Link>
              </div>
              <div className="mt-4 space-y-2.5">
                {familyMembers.map((fam) => (
                  <div
                    key={fam.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#fbfcfc] p-3"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">{fam.fullName}</p>
                      <p className="text-[10px] text-gray-500">
                        {fam.relationship} &bull; Blood: {fam.bloodGroup}
                      </p>
                    </div>
                    <Link
                      href={`/patient/book?beneficiary=${fam.id}`}
                      className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-[#116b70] hover:bg-teal-100"
                    >
                      Book Visit
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Hotline Banner */}
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs font-bold">
                  !
                </span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-900">
                  Emergency Support
                </h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-red-800">
                For acute chest pain, major trauma, or emergency medical dispatch:
              </p>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-base font-extrabold text-red-900">Dial 911</p>
                <Link
                  href="/patient/support"
                  className="rounded-full bg-red-700 px-3 py-1 text-[11px] font-bold text-white hover:bg-red-800"
                >
                  Assistance Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
