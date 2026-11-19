import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { WhyTrustSection } from '@/components/home/WhyTrustSection';
import { ExperienceSection } from '@/components/home/ExperienceSection';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { CareOptionsSection } from '@/components/home/CareOptionsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBanner } from '@/components/home/CtaBanner';
import { Footer } from '@/components/layout/Footer';
import { ScrollAnimationProvider } from '@/components/common/ScrollAnimationProvider';

export default function HomePage() {
  return (
    <ScrollAnimationProvider>
      <main id="main">
        {/* 1. Hero with dark hospital aesthetic & bold headline */}
        <HeroSection />

        {/* Subtle, delicate mint-tinted background with constant effect from Treatment We Offers through FAQ */}
        <div className="landing-subtle-mint relative overflow-hidden text-[#11191B]">

          {/* 2. Core Doorstep Services ("Treatment We Offers") */}
          <ServicesSection />

          {/* 3. Why Thousands Trust Vellora Healthcare (Prominent Dark Emerald Card with Single Group Photo) */}
          <WhyTrustSection />

          {/* 4. Hospital Standard Safety (Cards show deep emerald greenish gradient on hover) */}
          <ExperienceSection />

          {/* 5. Healthcare Professionals & Visiting Doctors ("Meet Our Medical Specialists & Physicians") */}
          <DoctorsSection />

          {/* 6. Community Testimonials ("Healing & Peace of Mind, Right at Home" Dark Emerald Card with Customer Photo) */}
          <ReviewsSection />

          {/* 7. Doctors Who Listen & Experts You Can Trust */}
          <HowItWorksSection />

          {/* 8. Care Options & Shift Packages */}
          <CareOptionsSection />

          {/* 9. Frequently Asked Questions */}
          <FaqSection />

          {/* 10. Final Booking CTA */}
          <CtaBanner />
        </div>

        {/* 11. Footer */}
        <Footer />
      </main>
    </ScrollAnimationProvider>
  );
}
