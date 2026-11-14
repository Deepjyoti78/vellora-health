'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/admin/MetricCard';
import { PatientVisitsChart } from '@/components/admin/PatientVisitsChart';
import { TopDoctorCard } from '@/components/admin/TopDoctorCard';
import { RecentAppointmentsTable } from '@/components/admin/RecentAppointmentsTable';
import { RevenueDonutChart } from '@/components/admin/RevenueDonutChart';
import {
  Users,
  Calendar,
  FileCheck2,
  DollarSign,
  Download,
  Plus,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  // Sparkline data for KPI Cards
  const patientTrend = [
    { day: 'Mon', value: 420 },
    { day: 'Tue', value: 460 },
    { day: 'Wed', value: 490 },
    { day: 'Thu', value: 540 },
    { day: 'Fri', value: 680 },
    { day: 'Sat', value: 620 },
    { day: 'Sun', value: 710 },
  ];

  const appointmentBars = [
    { day: 'M', value: 24 },
    { day: 'T', value: 32 },
    { day: 'W', value: 28 },
    { day: 'T', value: 48, highlight: true }, // Thursday peak highlighted
    { day: 'F', value: 36 },
    { day: 'S', value: 30 },
    { day: 'S', value: 18 },
  ];

  const revenueTrend = [
    { day: 'Mon', value: 4200 },
    { day: 'Tue', value: 5100 },
    { day: 'Wed', value: 4800 },
    { day: 'Thu', value: 6700 },
    { day: 'Fri', value: 7800 },
    { day: 'Sat', value: 6900 },
    { day: 'Sun', value: 7400 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Banner / Overview Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102820]">
                Welcome back, Dr. Arjun!
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#065F46]">
                <Sparkles className="h-3 w-3" />
                <span>Live Telemetry</span>
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Here is what is happening with your doorstep clinical visits, practitioner fleets, and platform revenue today.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EBE7] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-[#F2F8F5] transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>
            <Link
              href="/admin/dispatch"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#064E3B] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#065F46] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Dispatch</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Patients"
            value="3,428"
            change="+12.4%"
            isPositive={true}
            subtitle="Active home care profiles"
            icon={Users}
            chartType="line"
            chartData={patientTrend}
          />
          <MetricCard
            title="Appointments Today"
            value="186"
            change="+8.1%"
            isPositive={true}
            subtitle="Doorstep visits scheduled"
            icon={Calendar}
            chartType="bar"
            chartData={appointmentBars}
          />
          <MetricCard
            title="Pending Reports"
            value="24"
            change="-18.2%"
            isPositive={true}
            subtitle="Diagnostic panels in review"
            icon={FileCheck2}
            chartType="progress"
          />
          <MetricCard
            title="Total Revenue"
            value="$38,810"
            change="+15.4%"
            isPositive={true}
            subtitle="Gross Platform GMV (MoM)"
            icon={DollarSign}
            chartType="area"
            chartData={revenueTrend}
          />
        </div>

        {/* Middle Row: Patient Visits Overview (65%) & Top Doctor Card (35%) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <PatientVisitsChart />
          </div>
          <div className="lg:col-span-4">
            <TopDoctorCard />
          </div>
        </div>

        {/* Bottom Row: Recent Appointments Table (65%) & Revenue Donut Chart (35%) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RecentAppointmentsTable />
          </div>
          <div className="lg:col-span-4">
            <RevenueDonutChart />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
