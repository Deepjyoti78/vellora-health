'use client';

import React from 'react';
import { LucideIcon, MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  actionMenu?: boolean;
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  actionMenu = true,
  children,
}) => {
  return (
    <div className="flex min-h-[230px] flex-col justify-between rounded-[18px] border border-[#E2EBE7] bg-white p-5 shadow-xs transition-all duration-200 hover:border-[#CBDCD5] hover:shadow-sm">
      {/* Top Header: Icon + Title on left, More options on right */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#07583F]">
              <Icon className="h-4 w-4 stroke-[2.2]" />
            </div>
            <span className="text-[13px] font-semibold text-slate-600">{title}</span>
          </div>
          {actionMenu && (
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-[#F2F8F5] hover:text-slate-600 transition-colors"
              aria-label={`Options for ${title}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Value + Growth Indicator */}
        <div className="mt-4 flex items-baseline justify-between">
          <h3 className="font-heading text-[28px] sm:text-3xl font-extrabold tracking-tight text-[#102820]">
            {value}
          </h3>
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ${
              isPositive
                ? 'bg-[#ECFDF5] text-[#07583F]'
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

        {subtitle && (
          <p className="mt-0.5 text-[11px] font-medium text-slate-400">{subtitle}</p>
        )}
      </div>

      {/* Bottom Visualization Container */}
      <div className="mt-2 w-full">{children}</div>
    </div>
  );
};
