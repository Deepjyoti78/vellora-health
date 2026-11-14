import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { ExperienceSection } from '@/components/home/ExperienceSection';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { CareOptionsSection } from '@/components/home/CareOptionsSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBanner } from '@/components/home/CtaBanner';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <main id="main">
        {/* 1. Hero with approved dark hospital aesthetic & 3-line heading */}
        <HeroSection />

        {/* 2. Four Core Doorstep Services */}
        <ServicesSection />

        {/* 3. How Home Healthcare Works (4-step clinical flow) */}
        <HowItWorksSection />

        {/* 4. Why Choose Vellora Health (Hospital-Standard Safety at Home) */}
        <ExperienceSection />

        {/* 5. Healthcare Professionals & Visiting Doctors */}
        <DoctorsSection />

        {/* 6. Care Options & Shift Packages (Doctor visit, 12h/24h nursing, caretakers, labs) */}
        <CareOptionsSection />

        {/* 7. Patient & Family Care Experiences */}
        <ReviewsSection />

        {/* 8. Clinical Partner Facilities & Diagnostic Centers */}
        <FacilitiesSection />

        {/* 9. Frequently Asked Questions */}
        <FaqSection />

        {/* 10. Final Booking CTA */}
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
