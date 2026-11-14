'use client';

import React from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MetricCard } from '@/components/admin/MetricCard';
import { MetricSparkline } from '@/components/admin/MetricSparkline';
import { MiniAppointmentsBarChart } from '@/components/admin/MiniAppointmentsBarChart';
import { SegmentedMetricProgress } from '@/components/admin/SegmentedMetricProgress';
import { RevenueSparkline } from '@/components/admin/RevenueSparkline';
import { PatientVisitsChart } from '@/components/admin/PatientVisitsChart';
import { FeaturedDoctorCard } from '@/components/admin/FeaturedDoctorCard';
import { RecentAppointmentsTable } from '@/components/admin/RecentAppointmentsTable';
import { RevenueDonutChart } from '@/components/admin/RevenueDonutChart';
import {
  Users,
  Calendar,
  FileCheck2,
  DollarSign,
  Download,
  ChevronDown,
} from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-7 max-w-[1500px] mx-auto">
        {/* RULE 2: Corrected Clean Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#102820]">
              Welcome back, Dr. Arjun!
            </h1>
            <p className="mt-1 text-xs sm:text-[13px] text-slate-500">
              Here&apos;s your healthcare overview for today.
            </p>
          </div>

          {/* Right Actions: Export CSV + This Week Dropdown */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E2EBE7] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-[#F2F8F5] transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2EBE7] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-[#F2F8F5] transition-colors"
            >
              <Calendar className="h-3.5 w-3.5 text-[#07583F]" />
              <span>This Week</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* RULE 3: 4 Rebuilt Metric KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 — Total Patients */}
          <MetricCard
            title="Total Patients"
            value="3,428"
            change="+12.4%"
            isPositive={true}
            subtitle="Active home care profiles"
            icon={Users}
          >
            <MetricSparkline />
          </MetricCard>

          {/* Card 2 — Appointments Today */}
          <MetricCard
            title="Appointments Today"
            value="186"
            change="+8.1%"
            isPositive={true}
            subtitle="Doorstep visits scheduled"
            icon={Calendar}
          >
            <MiniAppointmentsBarChart highlightBadge="+8.1%" />
          </MetricCard>

          {/* Card 3 — Pending Reports */}
          <MetricCard
            title="Pending Reports"
            value="24"
            change="-18.2%"
            isPositive={false}
            subtitle="Diagnostic panels in review"
            icon={FileCheck2}
          >
            <div className="pt-2">
              <SegmentedMetricProgress
                ready={15}
                inReview={6}
                pending={3}
                height={16}
                showLegend={true}
              />
            </div>
          </MetricCard>

          {/* Card 4 — Total Revenue */}
          <MetricCard
            title="Total Revenue"
            value="$38,810"
            change="+15.4%"
            isPositive={true}
            subtitle="Gross Platform GMV (MoM)"
            icon={DollarSign}
          >
            <RevenueSparkline highlightLabel="+15.4%" />
          </MetricCard>
        </div>

        {/* Middle Row: Patient Visits Overview (65%) & Top Doctor Card (35%) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-8">
            <PatientVisitsChart />
          </div>
          <div className="lg:col-span-4">
            <FeaturedDoctorCard />
          </div>
        </div>

        {/* Bottom Row: Recent Appointments Table (65%) & Revenue by Services (35%) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
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
