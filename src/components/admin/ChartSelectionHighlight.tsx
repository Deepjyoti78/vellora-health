'use client';

import React from 'react';

interface ChartSelectionHighlightProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rx?: number;
  className?: string;
}

export const ChartSelectionHighlight: React.FC<ChartSelectionHighlightProps> = ({
  x = 0,
  y = 0,
  width = 36,
  height = 200,
  rx = 16,
  className = '',
}) => {
  return (
    <g className={`pointer-events-none ${className}`}>
      <defs>
        <linearGradient id="selectionHighlightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#07583F" stopOpacity={0.85} />
          <stop offset="100%" stopColor="#064E3B" stopOpacity={0.95} />
        </linearGradient>
        <filter id="selectionGlow" x="-20%" y="-10%" width="140%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#064E3B" floodOpacity="0.25" />
        </filter>
      </defs>
      <rect
        x={x - width / 2}
        y={y}
        width={width}
        height={height}
        rx={rx}
        ry={rx}
        fill="url(#selectionHighlightGrad)"
        filter="url(#selectionGlow)"
        className="transition-all duration-300"
      />
    </g>
  );
};
