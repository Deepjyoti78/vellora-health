'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

export interface RevenueSparklinePoint {
  day?: string;
  value: number;
  highlight?: boolean;
}

interface RevenueSparklineProps {
  data?: RevenueSparklinePoint[];
  height?: number;
  showDays?: boolean;
  highlightLabel?: string;
}

const DEFAULT_REVENUE_DATA: RevenueSparklinePoint[] = [
  { day: 'M', value: 4100 },
  { day: 'T', value: 5200 },
  { day: 'W', value: 4600 },
  { day: 'T', value: 6800 },
  { day: 'F', value: 5900 },
  { day: 'S', value: 8400, highlight: true }, // Highlighted Saturday
  { day: 'S', value: 7200 },
];

export const RevenueSparkline: React.FC<RevenueSparklineProps> = ({
  data = DEFAULT_REVENUE_DATA,
  height = 68,
  showDays = true,
  highlightLabel = '+15.4%',
}) => {
  return (
    <div className="w-full relative flex flex-col justify-end pt-2">
      <div style={{ height: `${height}px` }} className="w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#07583F" stopOpacity={0.28} />
                <stop offset="85%" stopColor="#7DC6A2" stopOpacity={0.06} />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#07583F"
              strokeWidth={2.2}
              fill="url(#revenueSparklineGrad)"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (!payload?.highlight) return null;
                return (
                  <g key={`rev-dot-${cx}-${cy}`}>
                    {/* Floating pill badge */}
                    <g transform={`translate(${cx - 20}, ${cy - 22})`}>
                      <rect
                        width="40"
                        height="16"
                        rx="8"
                        fill="#07583F"
                        className="shadow-sm"
                      />
                      <text
                        x="20"
                        y="11.5"
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {highlightLabel}
                      </text>
                    </g>
                    {/* Circular marker */}
                    <circle cx={cx} cy={cy} r={5} fill="#D1FAE5" />
                    <circle cx={cx} cy={cy} r={3} fill="#07583F" stroke="#FFFFFF" strokeWidth={1.5} />
                  </g>
                );
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {showDays && (
        <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] font-semibold text-slate-400">
          {data.map((item, idx) => (
            <span
              key={idx}
              className={`transition-colors ${
                item.highlight ? 'text-[#07583F] font-bold' : 'text-slate-400'
              }`}
            >
              {item.day || `D${idx + 1}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
