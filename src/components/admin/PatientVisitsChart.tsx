'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Calendar, ChevronDown } from 'lucide-react';
import { ChartSelectionHighlight } from './ChartSelectionHighlight';

interface VisitDataPoint {
  day: string;
  fullDate: string;
  visits: number;
  highlight?: boolean;
  change?: string;
}

const WEEKLY_VISITS: VisitDataPoint[] = [
  { day: 'Mon', fullDate: 'Mon, Nov 10', visits: 110, change: '+5.2%' },
  { day: 'Tue', fullDate: 'Tue, Nov 11', visits: 135, change: '+12.4%' },
  { day: 'Wed', fullDate: 'Wed, Nov 12', visits: 180, change: '+14.1%' },
  { day: 'Thu', fullDate: 'Thu, Nov 13', visits: 165, change: '+8.3%' },
  { day: 'Fri', fullDate: 'Fri, Nov 14', visits: 248, highlight: true, change: '+18.4%' }, // Active peak
  { day: 'Sat', fullDate: 'Sat, Nov 15', visits: 175, change: '+6.5%' },
  { day: 'Sun', fullDate: 'Sun, Nov 16', visits: 130, change: '+3.8%' },
];

const MONTHLY_VISITS: VisitDataPoint[] = [
  { day: 'Week 1', fullDate: 'Oct 20 - Oct 26', visits: 890, change: '+9.4%' },
  { day: 'Week 2', fullDate: 'Oct 27 - Nov 02', visits: 1040, change: '+11.8%' },
  { day: 'Week 3', fullDate: 'Nov 03 - Nov 09', visits: 1250, change: '+15.2%' },
  { day: 'Week 4', fullDate: 'Nov 10 - Nov 16', visits: 1420, highlight: true, change: '+18.4%' },
];

export const PatientVisitsChart: React.FC = () => {
  const [period, setPeriod] = useState<'Weekly' | 'Monthly'>('Weekly');
  const data = period === 'Weekly' ? WEEKLY_VISITS : MONTHLY_VISITS;

  return (
    <div className="rounded-[18px] border border-[#E2EBE7] bg-white p-6 shadow-xs transition-all hover:border-[#CBDCD5]">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="font-heading text-lg font-bold tracking-tight text-[#102820]">
              Patient Visits Overview
            </h3>
            <span className="rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[11px] font-bold text-[#07583F]">
              +18.4% WoW
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Real-time telemetry of completed doorstep doctor consultations and nursing shifts.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex rounded-xl bg-[#F2F8F5] p-1 border border-[#E2EBE7]">
            <button
              type="button"
              onClick={() => setPeriod('Weekly')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                period === 'Weekly'
                  ? 'bg-white text-[#07583F] shadow-2xs'
                  : 'text-slate-500 hover:text-[#102820]'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setPeriod('Monthly')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                period === 'Monthly'
                  ? 'bg-white text-[#07583F] shadow-2xs'
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

      {/* Main Chart Canvas */}
      <div className="mt-6 h-72 sm:h-80 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 15, left: -15, bottom: 0 }}
          >
            <defs>
              {/* Mint gradient under line */}
              <linearGradient id="visitsAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#07583F" stopOpacity={0.25} />
                <stop offset="65%" stopColor="#7DC6A2" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.0} />
              </linearGradient>

              {/* Diagonal hatch pattern */}
              <pattern
                id="diagonalHatch"
                width="8"
                height="8"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="#07583F"
                  strokeWidth="1"
                  strokeOpacity="0.08"
                />
              </pattern>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2EBE7"
              opacity={0.7}
            />

            <XAxis
              dataKey="day"
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E2EBE7' }}
              dy={6}
            />

            <YAxis
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />

            {/* Custom Tooltip */}
            <Tooltip
              cursor={{
                stroke: '#07583F',
                strokeWidth: 1.5,
                strokeDasharray: '4 4',
              }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as VisitDataPoint;
                  return (
                    <div className="rounded-2xl border border-[#E2EBE7] bg-white p-3.5 shadow-xl min-w-[140px] animate-in fade-in zoom-in-95">
                      <p className="text-[11px] font-semibold text-slate-400">
                        {pt.fullDate}
                      </p>
                      <div className="mt-1 flex items-baseline justify-between gap-3">
                        <span className="font-heading text-lg font-black text-[#102820]">
                          {pt.visits}
                        </span>
                        <span className="rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold text-[#07583F]">
                          {pt.change}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Completed visits
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Gradient Area Fill */}
            <Area
              type="monotone"
              dataKey="visits"
              stroke="none"
              fill="url(#visitsAreaGrad)"
            />

            {/* Diagonal Hatch Overlay Fill */}
            <Area
              type="monotone"
              dataKey="visits"
              stroke="none"
              fill="url(#diagonalHatch)"
            />

            {/* Prominent Smooth Dark-Green Line */}
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#07583F"
              strokeWidth={2.8}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isHighlight = payload?.highlight;

                if (isHighlight) {
                  return (
                    <g key={`highlight-${cx}-${cy}`}>
                      {/* Vertical highlight bar under the active point */}
                      <rect
                        x={cx - 18}
                        y={cy + 6}
                        width={36}
                        height={260 - cy}
                        rx={16}
                        ry={16}
                        fill="url(#selectionHighlightGrad)"
                        opacity={0.12}
                        className="pointer-events-none"
                      />
                      {/* Circular active dot */}
                      <circle cx={cx} cy={cy} r={8} fill="#D1FAE5" />
                      <circle
                        cx={cx}
                        cy={cy}
                        r={4.5}
                        fill="#07583F"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      />
                    </g>
                  );
                }

                return (
                  <circle
                    key={`dot-${cx}-${cy}`}
                    cx={cx}
                    cy={cy}
                    r={3.5}
                    fill="#FFFFFF"
                    stroke="#07583F"
                    strokeWidth={1.8}
                  />
                );
              }}
              activeDot={{
                r: 6,
                fill: '#07583F',
                stroke: '#FFFFFF',
                strokeWidth: 2,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
