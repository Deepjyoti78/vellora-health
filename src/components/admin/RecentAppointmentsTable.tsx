'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, ArrowRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AppointmentRow {
  id: string;
  patientName: string;
  patientAvatar: string;
  patientAge: string;
  doctorName: string;
  doctorSpecialty: string;
  service: string;
  time: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'PENDING';
}

const mockAppointments: AppointmentRow[] = [
  {
    id: 'VEL-8941',
    patientName: 'Eleanor Vance',
    patientAvatar: '/assets/ChatGPT Image Nov 14, 2026, 07_31_41 PM-3.png',
    patientAge: '68 yrs • Female',
    doctorName: 'Dr. Maya Patel',
    doctorSpecialty: 'Cardiologist',
    service: 'Doorstep Doctor Consultation',
    time: '10:30 AM (Today)',
    status: 'IN_PROGRESS',
  },
  {
    id: 'VEL-8942',
    patientName: 'Harold Vance',
    patientAvatar: '/assets/ChatGPT Image Nov 14, 2026, 07_31_42 PM-4.png',
    patientAge: '74 yrs • Male',
    doctorName: 'Nurse Sarah Jenkins',
    doctorSpecialty: 'Critical Care RN',
    service: '12h Post-Op Nursing Shift',
    time: '12:00 PM (Today)',
    status: 'CONFIRMED',
  },
  {
    id: 'VEL-8943',
    patientName: 'Ananya Sharma',
    patientAvatar: '/assets/ChatGPT Image Nov 14, 2026, 07_31_43 PM-5.png',
    patientAge: '34 yrs • Female',
    doctorName: 'Alex Rivera',
    doctorSpecialty: 'Phlebotomist',
    service: 'Home Diagnostic Blood Panel',
    time: '02:15 PM (Today)',
    status: 'COMPLETED',
  },
  {
    id: 'VEL-8944',
    patientName: 'Arthur Pendelton',
    patientAvatar: '/assets/ChatGPT Image Nov 14, 2026, 07_31_44 PM-6.png',
    patientAge: '82 yrs • Male',
    doctorName: 'James Thornton',
    doctorSpecialty: 'Elderly Mobility Aide',
    service: 'Patient Caretaker & Attendant',
    time: '04:00 PM (Today)',
    status: 'CONFIRMED',
  },
  {
    id: 'VEL-8945',
    patientName: 'Vikram Malhotra',
    patientAvatar: '/assets/ChatGPT Image Nov 14, 2026, 07_31_46 PM-8.png',
    patientAge: '52 yrs • Male',
    doctorName: 'Dr. Ethan Park',
    doctorSpecialty: 'Internal Medicine',
    service: 'Doorstep Doctor Consultation',
    time: '05:30 PM (Today)',
    status: 'PENDING',
  },
];

export const RecentAppointmentsTable: React.FC = () => {
  const getStatusBadge = (status: AppointmentRow['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-bold text-[#065F46]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            In Progress
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Confirmed
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Unassigned
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-[#E2EBE7] bg-white p-6 shadow-xs">
      {/* Table Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-base font-bold text-[#102820]">
            Recent Appointments
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Real-time live medical booking stream and clinician arrival status.
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#065F46] hover:text-[#064E3B] transition-colors"
        >
          <span>View All (186)</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Table Content */}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E2EBE7] text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              <th className="pb-3 pl-1">Patient</th>
              <th className="pb-3">Clinician</th>
              <th className="pb-3 hidden md:table-cell">Service</th>
              <th className="pb-3">Scheduled Time</th>
              <th className="pb-3 text-center">Status</th>
              <th className="pb-3 text-right pr-1">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2F8F5] text-xs">
            {mockAppointments.map((apt) => (
              <tr key={apt.id} className="group hover:bg-[#F9FCFA] transition-colors">
                {/* Patient */}
                <td className="py-3.5 pl-1">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#E2EBE7] bg-slate-100">
                      <Image
                        src={apt.patientAvatar}
                        alt={apt.patientName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="block font-semibold text-[#102820]">
                        {apt.patientName}
                      </span>
                      <span className="block text-[11px] text-slate-400">
                        {apt.patientAge}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Clinician */}
                <td className="py-3.5">
                  <div>
                    <span className="block font-medium text-[#102820]">
                      {apt.doctorName}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {apt.doctorSpecialty}
                    </span>
                  </div>
                </td>

                {/* Service */}
                <td className="py-3.5 hidden md:table-cell">
                  <span className="font-medium text-slate-600">{apt.service}</span>
                </td>

                {/* Scheduled Time */}
                <td className="py-3.5">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{apt.time}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3.5 text-center">{getStatusBadge(apt.status)}</td>

                {/* Action */}
                <td className="py-3.5 text-right pr-1">
                  <Link
                    href={`/admin/bookings?id=${apt.id}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-[#E2EBE7] hover:text-[#102820] transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
