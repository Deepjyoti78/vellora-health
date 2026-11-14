'use client';

import React from 'react';

export interface ProgressSegment {
  value: number;
  label: string;
  color?: string;
}

interface SegmentedMetricProgressProps {
  segments?: ProgressSegment[];
  ready?: number;
  inReview?: number;
  pending?: number;
  height?: number;
  className?: string;
  showLegend?: boolean;
}

const DEFAULT_COLORS = ['#07583F', '#7DC6A2', '#D6EEE3'];

export const SegmentedMetricProgress: React.FC<SegmentedMetricProgressProps> = ({
  segments,
  ready = 15,
  inReview = 6,
  pending = 3,
  height = 16,
  className = '',
  showLegend = false,
}) => {
  // Normalize segments
  const resolvedSegments: ProgressSegment[] = segments || [
    { value: ready, label: 'Ready', color: '#07583F' },
    { value: inReview, label: 'In Review', color: '#7DC6A2' },
    { value: pending, label: 'Pending', color: '#D6EEE3' },
  ];

  const total = resolvedSegments.reduce((sum, s) => sum + Math.max(0, s.value), 0) || 1;

  const accessibleText = resolvedSegments
    .map((s) => `${s.label}: ${s.value} (${Math.round((s.value / total) * 100)}%)`)
    .join(', ');

  return (
    <div className={`w-full flex flex-col justify-center ${className}`}>
      {/* Segmented Track */}
      <div
        role="progressbar"
        aria-label={`Progress breakdown: ${accessibleText}`}
        aria-valuenow={Math.round((resolvedSegments[0]?.value / total) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ height: `${height}px` }}
        className="w-full flex overflow-hidden rounded-full bg-[#E2EBE7] p-0 shadow-inner relative"
      >
        {resolvedSegments.map((seg, idx) => {
          const pct = Math.max(0, (seg.value / total) * 100);
          const color = seg.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
          return (
            <div
              key={idx}
              style={{
                width: `${pct}%`,
                backgroundColor: color,
              }}
              title={`${seg.label}: ${seg.value} (${Math.round(pct)}%)`}
              className="h-full transition-all duration-500 ease-out relative group/segment"
            />
          );
        })}
      </div>

      {/* Optional minimal legend underneath with breathing room */}
      {showLegend && (
        <div className="mt-3 flex items-center justify-between text-[11px] font-medium text-slate-500 px-0.5">
          {resolvedSegments.map((seg, idx) => {
            const color = seg.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="text-slate-600 font-semibold">{seg.label}</span>
                <span className="text-slate-400">({seg.value})</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
