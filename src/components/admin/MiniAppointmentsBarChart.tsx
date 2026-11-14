'use client';

import React from 'react';

export interface AppointmentBarPoint {
  day?: string;
  value: number;
  highlight?: boolean;
}

interface MiniAppointmentsBarChartProps {
  data?: AppointmentBarPoint[];
  height?: number;
  highlightIndex?: number;
  highlightBadge?: string;
}

const DEFAULT_BARS: AppointmentBarPoint[] = [
  { day: 'M', value: 42 },
  { day: 'T', value: 58 },
  { day: 'W', value: 48 },
  { day: 'T', value: 92, highlight: true }, // Thursday highlighted
  { day: 'F', value: 65 },
  { day: 'S', value: 50 },
  { day: 'S', value: 36 },
  { day: 'M', value: 54 },
];

export const MiniAppointmentsBarChart: React.FC<MiniAppointmentsBarChartProps> = ({
  data = DEFAULT_BARS,
  height = 68,
  highlightBadge = '+8.1%',
}) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full flex flex-col justify-end pt-2">
      {/* Bar container */}
      <div
        style={{ height: `${height}px` }}
        className="w-full flex items-end justify-between px-2.5 relative"
      >
        {data.map((item, idx) => {
          const heightPercent = Math.max(16, Math.round((item.value / maxVal) * 80));
          const isHighlight = item.highlight;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full relative group"
            >
              {/* Floating indicator above the highlighted column */}
              {isHighlight && (
                <div className="absolute -top-6 flex flex-col items-center z-10 animate-in fade-in">
                  <span className="rounded-full bg-[#07583F] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-2xs whitespace-nowrap">
                    {highlightBadge}
                  </span>
                  <div className="w-1.5 h-1 border-x-[3px] border-x-transparent border-t-[4px] border-t-[#07583F]" />
                </div>
              )}

              {/* Column Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-2.5 sm:w-3 rounded-full transition-all duration-300 ${
                  isHighlight
                    ? 'bg-[#07583F] shadow-sm'
                    : 'bg-[#D6EEE3] hover:bg-[#7DC6A2]'
                }`}
                title={`Day: ${item.day || idx + 1}, Visits: ${item.value}`}
              />
            </div>
          );
        })}
      </div>

      {/* Weekday indicators */}
      <div className="flex items-center justify-between px-2.5 pt-1.5 text-[10px] font-semibold text-slate-400">
        {data.map((item, idx) => (
          <span
            key={idx}
            className={`flex-1 text-center ${
              item.highlight ? 'text-[#07583F] font-bold' : 'text-slate-400'
            }`}
          >
            {item.day || `D${idx + 1}`}
          </span>
        ))}
      </div>
    </div>
  );
};
