'use client';

import React from 'react';
import { Icon } from './Icon';

interface SliderArrowsProps {
  trackRef: React.RefObject<HTMLDivElement | null>;
  prevLabel: string;
  nextLabel: string;
}

export const SliderArrows: React.FC<SliderArrowsProps> = ({
  trackRef,
  prevLabel,
  nextLabel,
}) => {
  const scroll = (direction: 'prev' | 'next') => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    if (!card) return;

    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const amount = card.getBoundingClientRect().width + gap;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    track.scrollBy({
      left: amount * (direction === 'next' ? 1 : -1),
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  };

  return (
    <div className="slider-arrows">
      <button
        type="button"
        className="circle-arrow"
        aria-label={prevLabel}
        onClick={() => scroll('prev')}
      >
        <Icon name="arrow-left" />
      </button>
      <button
        type="button"
        className="circle-arrow"
        aria-label={nextLabel}
        onClick={() => scroll('next')}
      >
        <Icon name="arrow-right" />
      </button>
    </div>
  );
};
