'use client';

import React, { useRef } from 'react';
import { TESTIMONIALS_DATA } from '@/data/site-content';
import { SliderArrows } from '@/components/common/SliderArrows';

export const ReviewsSection: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="section section-reviews" aria-labelledby="reviewsTitle">
      <div className="container">
        <div className="section-heading-row scroll-reveal">
          <div>
            <p className="eyebrow">PATIENT &amp; FAMILY EXPERIENCES</p>
            <h2 id="reviewsTitle">
              Compassionate Care<br />Right in the Living Room
            </h2>
          </div>
          <SliderArrows
            trackRef={trackRef}
            prevLabel="Previous testimonial"
            nextLabel="Next testimonial"
          />
        </div>

        <div
          className="review-track scroll-track stagger-container"
          id="reviewSlider"
          ref={trackRef}
        >
          {TESTIMONIALS_DATA.map((review) => (
            <article key={review.id} className="review-card scroll-reveal-card">
              <div className="review-upper">
                <img
                  src={review.avatar}
                  alt={review.alt}
                  loading="eager"
                />
                <blockquote>{review.quote}</blockquote>
              </div>
              <div className="review-footer">
                <span className="review-stars" aria-label="Five stars">
                  {review.rating}
                </span>
                <span>{review.author}</span>
              </div>
            </article>
          ))}
        </div>

        <p className="demo-note">
          Sample testimonials for layout demonstration; replace with verified patient feedback.
        </p>
      </div>
    </section>
  );
};
