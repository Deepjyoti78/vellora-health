'use client';

import React from 'react';
import { TESTIMONIALS_DATA } from '@/data/site-content';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="section bg-[#fbfdfd] py-20 border-b border-[#e5e9e9]" id="reviews" aria-labelledby="reviewsTitle">
      <div className="container">
        {/* Section Heading - Matching Image 1 */}
        <div className="text-center max-w-3xl mx-auto mb-14 scroll-reveal">
          <p className="eyebrow text-[#116b70]">PATIENT &amp; FAMILY EXPERIENCES</p>
          <h2 id="reviewsTitle" className="font-heading text-3xl font-extrabold text-[#11191b] md:text-5xl tracking-tight leading-tight">
            You're Not Alone, Hear From<br className="hidden sm:inline" /> Our Community
          </h2>
          <p className="mt-3.5 text-sm md:text-base text-[#55696d] leading-relaxed">
            Real stories from patients, daughters, sons, and family caregivers who experienced verified hospital-grade care right in their living room.
          </p>
        </div>

        {/* 8-Card Testimonials Grid - Matching Image 1 (4 columns x 2 rows) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-container">
          {TESTIMONIALS_DATA.map((review) => (
            <article
              key={review.id}
              className="flex flex-col justify-between rounded-2xl bg-white p-6 border border-[#e5e9ea] shadow-xs hover:border-[#b8dcde] hover:shadow-md transition-all duration-300 scroll-reveal-card"
            >
              <div>
                {/* User Header */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={review.avatar}
                    alt={review.alt}
                    className="h-10 w-10 rounded-full object-cover border border-[#d8e7e8] shadow-xs"
                    loading="lazy"
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-heading text-sm font-bold text-[#11191b] leading-snug truncate">
                      {review.author}
                    </h3>
                    <p className="text-[11px] text-[#55696d] truncate">
                      {review.role || 'Verified Patient'}
                    </p>
                  </div>
                </div>

                {/* Review Quote Body */}
                <p className="text-xs leading-relaxed text-[#4a5e62]">
                  {review.quote}
                </p>
              </div>

              {/* 5-Star Rating Footer */}
              <div className="mt-5 pt-3 border-t border-[#f0f4f4] flex items-center justify-between">
                <span className="text-amber-400 text-sm tracking-widest" aria-label="5 stars">
                  ★★★★★
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Verified Visit
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
