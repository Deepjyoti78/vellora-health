'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, HeartHandshake } from 'lucide-react';

interface CommunityReview {
  id: string;
  author: string;
  role: string;
  condition: string;
  quote: string;
  rating: number;
  image: string;
  alt: string;
}

const COMMUNITY_REVIEWS: CommunityReview[] = [
  {
    id: 'review-1',
    author: 'Ramakant & Shanti Sharma',
    role: 'Hypertension & Chronic Care Patients',
    condition: 'Chronic Care',
    quote:
      'A calmness fills my soul, like the peaceful mornings of spring. The doorstep doctor visits and routine lab monitoring have truly transformed our health and brought peaceful recovery to our living room.',
    rating: 5,
    image: '/assets/customer-review-couple.png',
    alt: 'Elderly couple smiling together happily at home on their living room sofa',
  },
  {
    id: 'review-2',
    author: 'Rajesh & Om Prakash Sharma',
    role: 'Family Caregiver & Senior Elder',
    condition: 'Geriatric Home Care',
    quote:
      'With Vellora Health, our doctor response times dropped to under two hours. We completely avoided chaotic hospital emergency rooms for my 82-year-old father. Absolute safety and total peace of mind.',
    rating: 5,
    image: '/assets/customer-review-family.png',
    alt: 'Elderly father and adult son smiling affectionately together at home',
  },
  {
    id: 'review-3',
    author: 'Ananya Deshmukh',
    role: 'Post-Surgical Knee Recovery Patient',
    condition: 'Post-Op Bedside Care',
    quote:
      'The registered home nurse was an absolute blessing during my rehabilitation. Having routine vitals, wound care, and medication handled at home allowed me to heal peacefully surrounded by family.',
    rating: 5,
    image: '/assets/avatar-indian-1.jpg',
    alt: 'Patient smiling happily during home wellness recovery',
  },
];

export const ReviewsSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handlePrev = useCallback(() => {
    setCurrentIdx((prev) => (prev === 0 ? COMMUNITY_REVIEWS.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIdx((prev) => (prev === COMMUNITY_REVIEWS.length - 1 ? 0 : prev + 1));
  }, []);

  // Automatic carousel rotation - changes testimony automatically every 5.5s
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % COMMUNITY_REVIEWS.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused]);

  const current = COMMUNITY_REVIEWS[currentIdx];

  return (
    <section className="w-full py-10 sm:py-16 lg:py-20" id="reviews" aria-labelledby="reviewsTitle">
      <div className="w-full sm:container mx-auto max-w-[1540px] px-2 sm:px-5 lg:px-6">
        {/* Section Heading - Font animates smoothly first */}
        <div className="text-left mb-5 sm:mb-8 px-1 sm:px-0 scroll-reveal" style={{ transitionDelay: '0ms' }}>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF7F2] border border-[#CBE9DC] px-3.5 py-1 text-[11px] font-bold tracking-[0.14em] uppercase text-[#065F46] mb-2.5 shadow-2xs">
            <HeartHandshake className="h-3.5 w-3.5 text-[#059669]" />
            <span>COMMUNITY TESTIMONIALS</span>
          </div>
          <h2
            id="reviewsTitle"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11191B] tracking-tight leading-tight"
          >
            Healing &amp; Peace of Mind, Right at Home
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#55696D] font-normal max-w-2xl">
            You&apos;re not alone. Authentic stories from families and patients experiencing compassionate, hospital-standard care in the comfort of their home.
          </p>
        </div>

        {/* Featured Testimonial Card - Card animates smoothly second */}
        <div
          className="relative overflow-hidden rounded-[20px] sm:rounded-[32px] bg-gradient-to-br from-[#064E3B] via-[#043D2E] to-[#022A20] text-white p-3.5 sm:p-6 lg:p-7 shadow-[0_24px_64px_rgba(2,42,32,0.25)] border border-[#10B981]/30 scroll-reveal-scale"
          style={{ transitionDelay: '280ms' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Ambient Mint Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            {/* Left Side: Real Customer / Patient Photo - Images come smoothly third */}
            <div className="lg:col-span-5 xl:col-span-5 scroll-reveal-left" style={{ transitionDelay: '520ms' }}>
              <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[380px] rounded-[18px] sm:rounded-[24px] overflow-hidden border border-white/10 shadow-xl bg-slate-900 group">
                <img
                  key={current.id}
                  src={current.image}
                  alt={current.alt}
                  className="w-full h-full object-cover object-center transition-all duration-500 ease-out animate-fade-in"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* 5-Star Rating Badge on Photo */}
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md px-3 py-1 text-xs font-bold text-amber-300 border border-white/20 shadow-md">
                  <div className="flex text-amber-400">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <span className="ml-1 text-white text-[11px] font-semibold">5.0 Verified Visit</span>
                </div>
              </div>
            </div>

            {/* Right Side: Customer Review, Author Info & Slider Navigation - Fourth */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between py-2 sm:py-3 pr-2 sm:pr-4 scroll-reveal-right" style={{ transitionDelay: '680ms' }}>
              <div>
                {/* Quotation Mark Icon */}
                <div className="mb-2 text-emerald-300/50">
                  <Quote className="h-9 w-9 sm:h-11 sm:w-11 rotate-180" />
                </div>

                {/* Main Customer Testimonial Quote */}
                <p
                  key={current.id}
                  className="text-base sm:text-lg lg:text-[21px] font-normal text-white leading-relaxed animate-fade-in pr-2"
                >
                  &ldquo;{current.quote}&rdquo;
                </p>
              </div>

              {/* Bottom Row: Customer Details + Next / Prev Arrows */}
              <div className="pt-4 sm:pt-6 lg:pt-8 mt-4 border-t border-white/15 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-heading text-base sm:text-lg font-bold text-white tracking-tight truncate">
                    {current.author}
                  </h4>
                  <p className="text-xs sm:text-[13px] text-emerald-300 font-medium mt-0.5 truncate">
                    {current.role}
                  </p>
                </div>

                {/* Slider Controls */}
                <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                  {/* Slide Indicators */}
                  <div className="flex items-center gap-1.5 mr-2 sm:mr-3" aria-hidden="true">
                    {COMMUNITY_REVIEWS.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setCurrentIdx(dotIdx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          dotIdx === currentIdx ? 'w-5 sm:w-6 bg-emerald-400' : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous review"
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white/12 hover:bg-white/20 active:scale-95 border border-white/20 flex items-center justify-center text-white transition-all duration-200 cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next review"
                    className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-[#064E3B] flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer"
                  >
                    <ChevronRight className="h-5 w-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
