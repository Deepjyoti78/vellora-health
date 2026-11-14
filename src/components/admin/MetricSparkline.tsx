'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

export interface MetricSparklinePoint {
  day: string;
  value: number;
  highlight?: boolean;
}

interface MetricSparklineProps {
  data?: MetricSparklinePoint[];
  height?: number;
  showDays?: boolean;
}

const DEFAULT_PATIENT_DATA: MetricSparklinePoint[] = [
  { day: 'M', value: 38 },
  { day: 'T', value: 52 },
  { day: 'W', value: 44 },
  { day: 'T', value: 68, highlight: true }, // Highlighted peak
  { day: 'F', value: 58 },
  { day: 'S', value: 74 },
  { day: 'S', value: 62 },
];

export const MetricSparkline: React.FC<MetricSparklineProps> = ({
  data = DEFAULT_PATIENT_DATA,
  height = 68,
  showDays = true,
}) => {
  return (
    <div className="w-full relative flex flex-col justify-end pt-2">
      <div style={{ height: `${height}px` }} className="w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="patientSparklineGrad" x1="0" y1="0" x2="0" y2="1">
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
              fill="url(#patientSparklineGrad)"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (!payload?.highlight) return null;
                return (
                  <g key={`dot-${cx}-${cy}`}>
                    {/* Floating badge above highlight */}
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
                        +12.4%
                      </text>
                    </g>
                    {/* Pulsing ring + Solid circular dot */}
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
              {item.day}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
