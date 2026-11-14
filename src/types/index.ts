export interface ServiceItem {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
  icon?: string;
  isBookingLink?: boolean;
}

export interface ValuePillar {
  title: string;
  description: string;
  icon: string;
}

export interface SpecialtyItem {
  name: string;
  symbol: string;
}

export interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  quote: string;
  rating: string;
  image: string;
  alt: string;
}

export interface ExperienceItem {
  label: string;
  icon: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  rating: string;
  avatar: string;
  alt: string;
}

export interface FacilityItem {
  id: string;
  title: string;
  image?: string;
  alt?: string;
  isSolid?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HowItWorksItem {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export interface CareOptionItem {
  id: string;
  serviceSlug: string;
  title: string;
  subtitle: string;
  badge: string;
  features: string[];
  duration: string;
  demoPrice: string;
}

export interface NavLink {
  label: string;
  href: string;
}
