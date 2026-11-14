'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Calendar, ChevronDown, Download } from 'lucide-react';

const weeklyData = [
  { day: 'Mon', visits: 120, prevVisits: 95 },
  { day: 'Tue', visits: 145, prevVisits: 110 },
  { day: 'Wed', visits: 190, prevVisits: 140 },
  { day: 'Thu', visits: 175, prevVisits: 160 },
  { day: 'Fri', visits: 248, prevVisits: 185 }, // Peak day
  { day: 'Sat', visits: 180, prevVisits: 155 },
  { day: 'Sun', visits: 135, prevVisits: 110 },
];

const monthlyData = [
  { day: 'Week 1', visits: 890, prevVisits: 720 },
  { day: 'Week 2', visits: 1040, prevVisits: 880 },
  { day: 'Week 3', visits: 1250, prevVisits: 990 },
  { day: 'Week 4', visits: 1380, prevVisits: 1150 },
];

export const PatientVisitsChart: React.FC = () => {
  const [period, setPeriod] = useState<'Weekly' | 'Monthly'>('Weekly');
  const data = period === 'Weekly' ? weeklyData : monthlyData;

  return (
    <div className="rounded-2xl border border-[#E2EBE7] bg-white p-6 shadow-xs">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-[#102820]">
              Patient Visits Overview
            </h3>
            <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#065F46]">
              +18.4% WoW
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-400">
            Real-time telemetry of completed doorstep doctor consultations and nursing shifts.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-[#F2F8F5] p-1 border border-[#E2EBE7]">
            <button
              type="button"
              onClick={() => setPeriod('Weekly')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                period === 'Weekly'
                  ? 'bg-white text-[#064E3B] shadow-2xs'
                  : 'text-slate-500 hover:text-[#102820]'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setPeriod('Monthly')}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                period === 'Monthly'
                  ? 'bg-white text-[#064E3B] shadow-2xs'
                  : 'text-slate-500 hover:text-[#102820]'
              }`}
            >
              Monthly
            </button>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-xl border border-[#E2EBE7] bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#F2F8F5] transition-colors"
          >
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span>Filter</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Chart Graphic */}
      <div className="mt-6 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="patientVisitsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#065F46" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#065F46" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="prevVisitsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="day"
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E2EBE7' }}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-[#E2EBE7] bg-white p-3 shadow-lg">
                      <p className="text-xs font-bold text-[#102820]">{label}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#065F46]" />
                        <span className="text-xs text-slate-500">Current:</span>
                        <span className="text-xs font-bold text-[#065F46]">
                          {payload[0].value} visits
                        </span>
                      </div>
                      {payload[1] && (
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-slate-400" />
                          <span className="text-xs text-slate-500">Previous:</span>
                          <span className="text-xs font-bold text-slate-600">
                            {payload[1].value} visits
                          </span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="prevVisits"
              stroke="#94A3B8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#prevVisitsGrad)"
            />
            <Area
              type="monotone"
              dataKey="visits"
              stroke="#065F46"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#patientVisitsGrad)"
              activeDot={{ r: 6, fill: '#064E3B', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="mt-4 flex items-center justify-between border-t border-[#F2F8F5] pt-3 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#065F46]" />
            <span className="font-medium text-slate-700">Current Period</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
            <span className="font-medium text-slate-500">Prior Week Benchmark</span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400">
          Peak dispatch: <strong className="text-[#102820]">Friday (248 visits)</strong>
        </span>
      </div>
    </div>
  );
};
