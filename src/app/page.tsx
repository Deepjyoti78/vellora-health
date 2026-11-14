import { HeroSection } from '@/components/home/HeroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { SpecialtiesSection } from '@/components/home/SpecialtiesSection';
import { DoctorsSection } from '@/components/home/DoctorsSection';
import { ExperienceSection } from '@/components/home/ExperienceSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { FacilitiesSection } from '@/components/home/FacilitiesSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBanner } from '@/components/home/CtaBanner';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <main id="main">
        <HeroSection />
        <ServicesSection />
        <SpecialtiesSection />
        <DoctorsSection />
        <ExperienceSection />
        <ReviewsSection />
        <FacilitiesSection />
        <FaqSection />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
