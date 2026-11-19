'use client';

import React, { useEffect } from 'react';

export const ScrollAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // If user prefers reduced motion or browser has no IntersectionObserver, reveal all
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.scroll-reveal, .scroll-reveal-card, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px', // Pre-reveal before fully in view
      }
    );

    // Initial scan
    const scanAndObserve = () => {
      const elements = document.querySelectorAll(
        '.scroll-reveal:not(.is-revealed), .scroll-reveal-card:not(.is-revealed), .scroll-reveal-left:not(.is-revealed), .scroll-reveal-right:not(.is-revealed), .scroll-reveal-scale:not(.is-revealed)'
      );
      elements.forEach((el) => observer.observe(el));
    };

    scanAndObserve();

    // Debounced mutation observer to avoid CPU spikes during React re-renders
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const mutationObserver = new MutationObserver(() => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        scanAndObserve();
        timeoutId = null;
      }, 150);
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return <>{children}</>;
};
