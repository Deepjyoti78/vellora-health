'use client';

import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Tooltip,
} from 'recharts';

interface SparklineDataPoint {
  day: string;
  value: number;
  highlight?: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  chartType?: 'line' | 'bar' | 'progress' | 'area';
  chartData?: SparklineDataPoint[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle = 'vs last month',
  icon: Icon,
  chartType = 'line',
  chartData,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#E2EBE7] bg-white p-5 shadow-xs hover:border-[#CBDCD5] hover:shadow-sm transition-all duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{title}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#065F46]">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Main KPI & Trend Badge */}
      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="font-heading text-2xl sm:text-[28px] font-black tracking-tight text-[#102820]">
          {value}
        </h3>
        <span
          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
            isPositive
              ? 'bg-[#ECFDF5] text-[#065F46]'
              : 'bg-rose-50 text-rose-700'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-3 w-3 stroke-[2.5]" />
          ) : (
            <ArrowDownRight className="h-3 w-3 stroke-[2.5]" />
          )}
          {change}
        </span>
      </div>

      {/* Subtitle / Context */}
      <p className="mt-0.5 text-[11px] text-slate-400 font-medium">{subtitle}</p>

      {/* Mini Visual Chart Container */}
      <div className="mt-4 pt-2 border-t border-[#F2F8F5]">
        {chartType === 'line' && chartData && (
          <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#065F46"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'bar' && chartData && (
          <div className="flex h-12 w-full items-end gap-1.5 justify-between px-1">
            {chartData.map((item, idx) => {
              const maxVal = Math.max(...chartData.map((d) => d.value));
              const heightPercent = Math.round((item.value / maxVal) * 100);
              const isHighlight = item.highlight;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-sm transition-all duration-300 ${
                      isHighlight
                        ? 'bg-[#064E3B] shadow-xs'
                        : 'bg-[#D1FAE5] group-hover:bg-[#A7F3D0]'
                    }`}
                  />
                  <span className="mt-1 text-[9px] font-medium text-slate-400">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {chartType === 'area' && chartData && (
          <div className="h-12 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="metricAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#065F46" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#065F46" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#065F46"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#metricAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {chartType === 'progress' && (
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#E2EBE7]">
              <div
                style={{ width: '62%' }}
                className="bg-[#064E3B] transition-all"
                title="Verified (62%)"
              />
              <div
                style={{ width: '26%' }}
                className="bg-amber-500 transition-all"
                title="In Review (26%)"
              />
              <div
                style={{ width: '12%' }}
                className="bg-rose-500 transition-all"
                title="Critical (12%)"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#064E3B]" /> Ready (15)
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Pending (6)
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Urgent (3)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
