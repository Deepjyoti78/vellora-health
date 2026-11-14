import {
  ServiceItem,
  ValuePillar,
  SpecialtyItem,
  DoctorItem,
  ExperienceItem,
  TestimonialItem,
  FacilityItem,
  FaqItem,
  NavLink,
} from '@/types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Facilities', href: '/facilities' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const TRUST_DATA = {
  count: '135k+',
  label: 'people',
  avatars: [
    '/assets/avatar-1.webp',
    '/assets/avatar-2.webp',
    '/assets/avatar-3.webp',
    '/assets/doctor-2.webp',
  ],
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'care',
    number: '01',
    category: 'CARE',
    title: 'Comprehensive Care',
    description: 'Thoughtful support at every step.',
    image: '/assets/care.webp',
    alt: 'Doctor providing personal care to a smiling patient',
    href: '#specialties',
  },
  {
    id: 'people',
    number: '02',
    category: 'PEOPLE',
    title: 'Collaborative Doctors',
    description: 'Experts working better together.',
    image: '/assets/specialists.webp',
    alt: 'Specialist performing an advanced medical procedure',
    href: '#doctors',
  },
  {
    id: 'science',
    number: '03',
    category: 'SCIENCE',
    title: 'Modern Diagnostics',
    description: 'Answers with precision and care.',
    image: '/assets/diagnostics.webp',
    alt: 'Scientist carrying out diagnostic laboratory work',
    href: '#specialties',
  },
  {
    id: 'access',
    number: '04',
    category: 'ACCESS',
    title: 'Convenient Scheduling',
    description: 'Care that fits your day.',
    image: '/assets/telehealth.webp',
    alt: 'Doctor appearing during an online consultation',
    href: '#booking',
    isBookingLink: true,
  },
  {
    id: 'support',
    number: '05',
    category: 'SUPPORT',
    title: 'Personal Care Teams',
    description: 'Real people. Individual attention.',
    image: '/assets/care-alt.webp',
    alt: 'Smiling physician welcoming patients',
    href: '#contact',
  },
];

export const VALUE_PILLARS: ValuePillar[] = [
  {
    title: 'Patient-First Care',
    description: 'Your health, our priority.',
    icon: 'shield',
  },
  {
    title: 'Integrated Services',
    description: 'Coordinated, seamless care.',
    icon: 'layers',
  },
  {
    title: 'Trusted & Experienced',
    description: 'Care delivered with compassion.',
    icon: 'leaf',
  },
];

export const SPECIALTIES_DATA: SpecialtyItem[] = [
  { name: 'Internal Medicine', symbol: '🩺' },
  { name: 'Family Medicine', symbol: '👨‍👩‍👧' },
  { name: 'Cardiology', symbol: '🫀' },
  { name: 'Orthopedics', symbol: '🦴' },
  { name: 'Neurology', symbol: '🧠' },
  { name: 'Dermatology', symbol: '🧴' },
  { name: 'Pediatrics', symbol: '🧸' },
  { name: 'Gynecology', symbol: '🌸' },
  { name: 'Physiotherapy', symbol: '🦿' },
  { name: 'Ophthalmology', symbol: '👁️' },
  { name: 'General Surgery', symbol: '⚕️' },
  { name: 'Psychiatry', symbol: '💬' },
  { name: 'Endocrinology', symbol: '🧬' },
  { name: 'Pulmonology', symbol: '🫁' },
  { name: 'Urology', symbol: '💧' },
  { name: 'Gastroenterology', symbol: '🧫' },
];

export const DOCTORS_DATA: DoctorItem[] = [
  {
    id: 'ethan-park',
    name: 'Dr. Ethan Park',
    specialty: 'PEDIATRICS & NEUROLOGY',
    quote: 'Compassionate care for growing families.',
    rating: '4.8',
    image: '/assets/doctor-1.webp',
    alt: 'Example doctor profile, male physician in white coat',
  },
  {
    id: 'maya-patel',
    name: 'Dr. Maya Patel',
    specialty: 'ENDOCRINOLOGY',
    quote: 'Putting people at the center of every visit.',
    rating: '4.9',
    image: '/assets/doctor-2.webp',
    alt: 'Example doctor profile, female physician in white coat',
  },
  {
    id: 'daniel-reed',
    name: 'Dr. Daniel Reed',
    specialty: 'GASTROENTEROLOGY',
    quote: 'Clear answers and thoughtful treatment.',
    rating: '4.8',
    image: '/assets/doctor-3.webp',
    alt: 'Example doctor profile, male physician with stethoscope',
  },
  {
    id: 'sofia-morgan',
    name: 'Dr. Sofia Morgan',
    specialty: 'ORTHOPEDICS',
    quote: 'Helping you get back to what you love.',
    rating: '4.9',
    image: '/assets/doctor-4.webp',
    alt: 'Example doctor profile, female physician in white coat',
  },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  { label: 'Minimal Waiting Time', icon: 'clock' },
  { label: 'Online Registration', icon: 'file' },
  { label: 'Digital Prescriptions', icon: 'file' },
  { label: 'Private Consultation Rooms', icon: 'building' },
  { label: 'Insurance Assistance', icon: 'shield' },
  { label: 'Comfortable Patient Lounge', icon: 'users' },
  { label: 'Secure Medical Records', icon: 'lock' },
  { label: 'Appointment Reminders', icon: 'calendar' },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'review-1',
    quote: '“The whole experience felt personal, thoughtful and reassuring from start to finish.”',
    author: 'Emily R.',
    rating: '★★★★★',
    avatar: '/assets/avatar-1.webp',
    alt: 'Sample testimonial portrait',
  },
  {
    id: 'review-2',
    quote: '“I appreciated having clear guidance and support at every step of my visit.”',
    author: 'Daniel K.',
    rating: '★★★★★',
    avatar: '/assets/avatar-2.webp',
    alt: 'Sample testimonial portrait',
  },
  {
    id: 'review-3',
    quote: '“A calm space, a kind team and an experience that made me feel heard.”',
    author: 'Priya M.',
    rating: '★★★★★',
    avatar: '/assets/avatar-3.webp',
    alt: 'Sample testimonial portrait',
  },
  {
    id: 'review-4',
    quote: '“Simple appointments and helpful people made taking care of my health easier.”',
    author: 'Jordan P.',
    rating: '★★★★★',
    avatar: '/assets/avatar-1.webp',
    alt: 'Sample testimonial portrait',
  },
];

export const FACILITIES_DATA: FacilityItem[] = [
  {
    id: 'fac-1',
    title: 'Welcoming Spaces',
    image: '/assets/facility-1.webp',
    alt: 'Bright clinic lounge with plants and comfortable chairs',
  },
  {
    id: 'fac-2',
    title: 'State-of-the-art\nequipment',
    isSolid: true,
  },
  {
    id: 'fac-3',
    title: 'Personalized Support',
    image: '/assets/facility-2.webp',
    alt: 'Nurse speaking with a patient',
  },
  {
    id: 'fac-4',
    title: 'Advanced Technology',
    image: '/assets/facility-3.webp',
    alt: 'Modern diagnostic scanner in a clinic',
  },
  {
    id: 'fac-5',
    title: 'Peaceful Rooms',
    image: '/assets/facility-4.webp',
    alt: 'Private room with soft warm lighting',
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    question: 'How do I schedule an appointment?',
    answer:
      'Use any “Book Appointment” button to open the request form. This prototype demonstrates the flow; a live clinic scheduling system is not connected yet.',
  },
  {
    question: 'Do you accept insurance?',
    answer:
      'Insurance coverage depends on the clinic and your policy. Your care team can confirm accepted plans once those details are configured.',
  },
  {
    question: 'Can I choose my doctor?',
    answer:
      'Yes, you can indicate a preferred specialist when requesting an appointment. Displayed doctor profiles are illustrative placeholders.',
  },
  {
    question: 'Are walk-ins accepted?',
    answer:
      'Walk-in availability varies by location, specialty and day. Check with the clinic before traveling.',
  },
  {
    question: 'Do specialists coordinate with each other?',
    answer:
      'A coordinated-care experience is the intended service model. Actual clinical workflows should be confirmed with your healthcare organization.',
  },
];
