'use client';

import React, { useState } from 'react';
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
  FileText,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Week');
  const [showTimeframeDropdown, setShowTimeframeDropdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,Value,Trend,Timeframe\n' +
      'Total Patients,3428,+12.4%,This Week\n' +
      'Appointments Today,186,+8.1%,Today\n' +
      'Pending Reports,24,-18.2%,Active\n' +
      'Total Revenue,₹1254600,+15.4%,This Month\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vellora_healthcare_admin_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Exported clinical metrics ledger to CSV successfully!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateReport = () => {
    setToastMessage('Generating executive clinical operations report...');
    setTimeout(() => {
      setToastMessage('Executive report ready! Sent to admin inbox.');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-7 max-w-[1500px] mx-auto">
        {/* Header matching Image 2 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
          <div>
            <h1 className="font-heading text-2xl sm:text-[30px] font-extrabold tracking-tight text-[#102820]">
              Welcome back, Dr. Mehta!
            </h1>
            <p className="mt-1 text-xs sm:text-[13px] text-slate-500">
              Here&apos;s your healthcare overview for today.
            </p>
          </div>

          {/* Right Actions: Export to CSV + Generate Report + This Week Dropdown */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Button 1: Export to CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl border border-[#E2EBE7] bg-white px-4 py-2.5 text-xs font-semibold text-[#102820] shadow-2xs hover:bg-[#F2F8F5] hover:border-[#CBDCD5] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download className="h-4 w-4 text-slate-600" />
              <span>Export to CSV</span>
            </button>

            {/* Button 2: Generate Report */}
            <button
              type="button"
              onClick={handleGenerateReport}
              className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl border border-[#E2EBE7] bg-white px-4 py-2.5 text-xs font-semibold text-[#102820] shadow-2xs hover:bg-[#F2F8F5] hover:border-[#CBDCD5] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="h-4 w-4 text-slate-600" />
              <span>Generate Report</span>
            </button>

            {/* Button 3: Solid Green This Week Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
                className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl bg-[#065F46] hover:bg-[#054d39] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{selectedTimeframe}</span>
                <ChevronDown className="h-3.5 w-3.5 text-white" />
              </button>

              {showTimeframeDropdown && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[#E2EBE7] bg-white p-1.5 shadow-xl z-30 animate-in fade-in slide-in-from-top-2">
                  {['Today', 'This Week', 'Last Week', 'This Month', 'This Quarter'].map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      onClick={() => {
                        setSelectedTimeframe(tf);
                        setShowTimeframeDropdown(false);
                      }}
                      className={`w-full text-left rounded-xl px-3 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedTimeframe === tf
                          ? 'bg-[#ECFDF5] text-[#065F46]'
                          : 'text-slate-700 hover:bg-[#F2F8F5]'
                      }`}
                    >
                      <span>{tf}</span>
                      {selectedTimeframe === tf && <span className="text-[10px] text-[#065F46]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        {toastMessage && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-2xs animate-fade-in-up">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-bounce" />
            <span>{toastMessage}</span>
          </div>
        )}

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
