'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface ServiceSlice {
  name: string;
  value: number;
  percentage: number;
  amount: string;
  color: string;
}

const serviceData: ServiceSlice[] = [
  {
    name: 'Doctor Home Visits',
    value: 45,
    percentage: 45,
    amount: '$17,465',
    color: '#07583F', // Dark emerald
  },
  {
    name: 'Nursing Shifts (12h/24h)',
    value: 30,
    percentage: 30,
    amount: '$11,643',
    color: '#10B981', // Forest emerald
  },
  {
    name: 'Home Diagnostic Labs',
    value: 15,
    percentage: 15,
    amount: '$5,821',
    color: '#7DC6A2', // Medium mint
  },
  {
    name: 'Elderly Caretakers',
    value: 10,
    percentage: 10,
    amount: '$3,881',
    color: '#D6EEE3', // Pale mint
  },
];

export const RevenueDonutChart: React.FC = () => {
  return (
    <div className="flex h-full flex-col justify-between rounded-[18px] border border-[#E2EBE7] bg-white p-6 shadow-xs transition-all hover:border-[#CBDCD5]">
      {/* Header with Mint Icon Container */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#07583F]">
          <PieIcon className="h-4 w-4 stroke-[2.2]" />
        </div>
        <div>
          <h3 className="font-heading text-base font-bold text-[#102820]">
            Revenue by Services
          </h3>
          <p className="text-[11px] text-slate-400">
            Monthly gross revenue breakdown
          </p>
        </div>
      </div>

      {/* Donut Chart with Centered Total */}
      <div className="relative my-3 flex h-48 sm:h-52 w-full items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ServiceSlice;
                  return (
                    <div className="rounded-xl border border-[#E2EBE7] bg-white p-2.5 shadow-lg">
                      <p className="text-xs font-bold text-[#102820]">{data.name}</p>
                      <p className="text-xs font-semibold text-[#07583F]">
                        {data.amount} ({data.percentage}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={serviceData}
              innerRadius={62}
              outerRadius={84}
              paddingAngle={3}
              dataKey="value"
            >
              {serviceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text in Donut */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Total GMV
          </span>
          <span className="font-heading text-xl font-black text-[#102820]">
            $38,810
          </span>
          <span className="text-[10px] font-bold text-[#07583F]">+15.4%</span>
        </div>
      </div>

      {/* Clean Legend */}
      <div className="space-y-2 border-t border-[#F2F8F5] pt-3 text-xs">
        {serviceData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                style={{ backgroundColor: item.color }}
                className="h-2.5 w-2.5 rounded-full shrink-0"
              />
              <span className="font-medium text-slate-600 truncate max-w-[150px]">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#102820]">{item.amount}</span>
              <span className="text-[11px] text-slate-400 font-medium">
                {item.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
