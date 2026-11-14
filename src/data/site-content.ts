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
  HowItWorksItem,
  CareOptionItem,
} from '@/types';

export const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Facilities', href: '/facilities' },
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
    id: 'doctor-visit',
    number: '01',
    category: 'DOCTOR VISIT',
    title: 'Doctor Home Consultations',
    description: 'Thorough bedside examination, illness diagnosis, and digital prescriptions in your home.',
    image: '/assets/care.webp',
    alt: 'Physician examining an elderly patient at home',
    href: '/services/home-doctor-visit',
  },
  {
    id: 'nursing-care',
    number: '02',
    category: 'NURSING CARE',
    title: 'At-Home Nursing Care',
    description: 'Licensed nurses for wound dressing, injections, IV infusions, post-op vitals, and catheter care.',
    image: '/assets/care-alt.webp',
    alt: 'Registered nurse providing bedside clinical care',
    href: '/services/home-nursing-care',
  },
  {
    id: 'caretakers',
    number: '03',
    category: 'CARETAKERS',
    title: 'Patient Caretakers & Attendants',
    description: 'Trained attendants for daily living mobility, personal hygiene, feeding, and recovery support.',
    image: '/assets/specialists.webp',
    alt: 'Care assistant helping an elderly patient with mobility',
    href: '/services/patient-caretakers-medical-maids',
  },
  {
    id: 'lab-tests',
    number: '04',
    category: 'LAB INVESTIGATIONS',
    title: 'Home Diagnostic Blood Tests',
    description: 'Certified phlebotomists collecting samples at your doorstep with sterile barcoded vials.',
    image: '/assets/diagnostics.webp',
    alt: 'Phlebotomist collecting diagnostic blood samples at home',
    href: '/services/home-lab-investigations',
  },
];

export const HOW_IT_WORKS_DATA: HowItWorksItem[] = [
  {
    step: '01',
    title: 'Select Service & Schedule',
    description: 'Choose a doctor consultation, nursing shift, caretaker, or lab panel with your preferred doorstep time slot.',
    icon: 'calendar',
  },
  {
    step: '02',
    title: 'Certified Clinician Dispatched',
    description: 'A verified, council-registered healthcare professional is assigned and travels directly to your residence.',
    icon: 'user-check',
  },
  {
    step: '03',
    title: 'Bedside Care with PIN Security',
    description: 'Verify your clinician with a secure 4-digit PIN before the physical examination or clinical procedure begins.',
    icon: 'shield',
  },
  {
    step: '04',
    title: 'Digital E-Prescriptions & Reports',
    description: 'Receive verified digital prescriptions, vitals charts, and accredited diagnostic reports straight to your portal.',
    icon: 'file-text',
  },
];

export const VALUE_PILLARS: ValuePillar[] = [
  {
    title: 'Hospital-Standard Hygiene',
    description: 'Strict clinical protocols, sterile single-use kits, and cold-chain sample transport.',
    icon: 'shield',
  },
  {
    title: 'Verified Medical Clinicians',
    description: 'Council-registered physicians, licensed nurses, and vetted care attendants.',
    icon: 'user-check',
  },
  {
    title: 'Comfort of Your Home',
    description: 'Avoid crowded clinic waiting rooms and travel stress for sick or elderly family members.',
    icon: 'heart',
  },
  {
    title: 'Transparent Demo Rates',
    description: 'Clear demonstration pricing for single visits and 12h/24h continuous shifts.',
    icon: 'tag',
  },
];

export const CARE_OPTIONS_DATA: CareOptionItem[] = [
  {
    id: 'opt-doc',
    serviceSlug: 'home-doctor-visit',
    title: 'Doctor Home Consultation',
    subtitle: 'Comprehensive Bedside Exam',
    badge: 'Physician Visit',
    duration: '45 – 60 Minutes',
    demoPrice: '$85 / ₹1,499 (Demo)',
    features: [
      'Comprehensive physical checkup',
      'Acute illness triage & treatment',
      'Digital prescription (e-Rx) on portal',
      'Referral & diagnostic recommendation',
    ],
  },
  {
    id: 'opt-nurse-shift',
    serviceSlug: 'home-nursing-care',
    title: '12-Hour Nursing Shift',
    subtitle: 'Day or Night Dedicated Care',
    badge: 'Registered Nurse',
    duration: '12-Hour Dedicated Shift',
    demoPrice: '$45/shift / ₹1,200 (Demo)',
    features: [
      'IV therapy & medication administration',
      'Continuous vitals charting (BP, SpO2)',
      'Surgical wound dressing & catheter care',
      'Post-operative clinical recovery',
    ],
  },
  {
    id: 'opt-caretaker-24h',
    serviceSlug: 'patient-caretakers-medical-maids',
    title: '24-Hour Continuous Attendant',
    subtitle: 'Full-Time Elder & Mobility Support',
    badge: 'Trained Caretaker',
    duration: '24-Hour Stay-In Support',
    demoPrice: '$70/day / ₹1,800 (Demo)',
    features: [
      'Bed-to-wheelchair mobility assistance',
      'Personal hygiene, sponge bath & grooming',
      'Nutritious meal feeding & hydration logs',
      'Night-time monitoring and reassurance',
    ],
  },
  {
    id: 'opt-lab-panel',
    serviceSlug: 'home-lab-investigations',
    title: 'Doorstep Comprehensive Panel',
    subtitle: 'NABL-Accredited Diagnostic Tests',
    badge: 'Phlebotomist Collection',
    duration: '15 Min Sample Collection',
    demoPrice: '$65 / ₹999 (Demo)',
    features: [
      'Complete Blood Count (CBC) + ESR',
      'Lipid Profile & Liver Function Tests',
      'Fasting Blood Glucose & HbA1c',
      'Digital printable report within 24 hours',
    ],
  },
];

export const SPECIALTIES_DATA: SpecialtyItem[] = [
  { name: 'General Medicine', symbol: '🩺' },
  { name: 'Geriatric Care', symbol: '👴' },
  { name: 'Post-Surgical Nursing', symbol: '🩹' },
  { name: 'Palliative Care', symbol: '🕊️' },
  { name: 'Pediatric Care', symbol: '🧸' },
  { name: 'Diabetic Foot Care', symbol: '🩸' },
  { name: 'Critical Care Nursing', symbol: '🫀' },
  { name: 'Physiotherapy at Home', symbol: '🦿' },
];

export const DOCTORS_DATA: DoctorItem[] = [
  {
    id: 'maya-patel',
    name: 'Dr. Maya Patel',
    specialty: 'INTERNAL MEDICINE & GERIATRICS',
    quote: 'Bringing thorough, unhurried medical examinations to patients at bedside.',
    rating: '4.9',
    image: '/assets/doctor-2.webp',
    alt: 'Female physician in white coat with stethoscope',
  },
  {
    id: 'ethan-park',
    name: 'Dr. Ethan Park',
    specialty: 'FAMILY MEDICINE & PEDIATRICS',
    quote: 'Compassionate family care that keeps children and elders safe at home.',
    rating: '4.8',
    image: '/assets/doctor-1.webp',
    alt: 'Male physician in clinical coat',
  },
  {
    id: 'daniel-reed',
    name: 'Dr. Daniel Reed',
    specialty: 'CHRONIC DISEASE MANAGEMENT',
    quote: 'Dedicated to preventing hospital re-admissions through proactive home visits.',
    rating: '4.8',
    image: '/assets/doctor-3.webp',
    alt: 'Male physician reviewing medical records',
  },
  {
    id: 'sofia-morgan',
    name: 'Dr. Sofia Morgan',
    specialty: 'POST-OPERATIVE REHABILITATION',
    quote: 'Guiding surgical recovery and mobility milestones in the safety of your home.',
    rating: '4.9',
    image: '/assets/doctor-4.webp',
    alt: 'Female doctor smiling warmly',
  },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  { label: 'Doorstep Doctor Visits', icon: 'stethoscope' },
  { label: '12h & 24h Nursing Shifts', icon: 'clock' },
  { label: '4-Digit Security PIN Verification', icon: 'shield' },
  { label: 'Digital E-Prescriptions (e-Rx)', icon: 'file' },
  { label: 'Sterile Sample Phlebotomy', icon: 'thermometer' },
  { label: 'Elderly Mobility Assistance', icon: 'users' },
  { label: 'Encrypted Digital EMR', icon: 'lock' },
  { label: 'Family Proxy Bookings', icon: 'heart' },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'review-1',
    quote: '“Having Dr. Patel visit my 82-year-old father at home saved us a stressful ambulance trip. The e-prescription and follow-up were seamless.”',
    author: 'Emily R. (Daughter of Home Patient)',
    rating: '★★★★★',
    avatar: '/assets/avatar-1.webp',
    alt: 'Portrait of patient family member Emily R.',
  },
  {
    id: 'review-2',
    quote: '“The 12-hour night nurse provided exceptional post-operative wound dressing and IV care after my knee replacement surgery. Highly professional.”',
    author: 'Daniel K. (Post-Op Patient)',
    rating: '★★★★★',
    avatar: '/assets/avatar-2.webp',
    alt: 'Portrait of patient Daniel K.',
  },
  {
    id: 'review-3',
    quote: '“Our caretaker James has been a godsend for my mother’s mobility exercises and daily nutrition. It gives our whole family peace of mind.”',
    author: 'Priya M. (Family Caregiver)',
    rating: '★★★★★',
    avatar: '/assets/avatar-3.webp',
    alt: 'Portrait of patient family member Priya M.',
  },
  {
    id: 'review-4',
    quote: '“The phlebotomist arrived right at 7:30 AM with a sterile cold-chain bag. The sample was taken painlessly and full lab results were on my portal by evening.”',
    author: 'Jordan P. (Diagnostic Patient)',
    rating: '★★★★★',
    avatar: '/assets/avatar-1.webp',
    alt: 'Portrait of patient Jordan P.',
  },
];

export const FACILITIES_DATA: FacilityItem[] = [
  {
    id: 'fac-1',
    title: 'Hospital Clinical Network',
    image: '/assets/facility-1.webp',
    alt: 'Accredited partner hospital and emergency transfer ward',
  },
  {
    id: 'fac-2',
    title: 'NABL-Accredited\nDiagnostic Labs',
    isSolid: true,
  },
  {
    id: 'fac-3',
    title: 'Critical Care ICU Coordination',
    image: '/assets/facility-2.webp',
    alt: 'Clinical nurse coordinating patient transfer',
  },
  {
    id: 'fac-4',
    title: 'Cold-Chain Mobile Phlebotomy',
    image: '/assets/facility-3.webp',
    alt: 'Precision diagnostic laboratory analysis equipment',
  },
  {
    id: 'fac-5',
    title: '24/7 Care Dispatch Center',
    image: '/assets/facility-4.webp',
    alt: 'Coordinated healthcare operations command room',
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    question: 'How quickly can a doctor or nurse arrive at my home?',
    answer:
      'Scheduled visits can be booked for same-day or next-day time slots. In select coverage zones, priority dispatch aims to assign an on-duty clinician within 30 to 60 minutes based on real-time availability.',
  },
  {
    question: 'How is patient safety and clinician verification ensured at my doorstep?',
    answer:
      'Every patient booking generates a unique 4-digit security PIN (e.g., 4829). Upon arrival, the clinician must enter this PIN into their workstation to unlock the clinical encounter, guaranteeing that only your verified provider is admitted.',
  },
  {
    question: 'What clinical procedures can be performed at home?',
    answer:
      'Our registered nurses perform sterile wound dressings, suture removals, IV catheter infusions, IM/IV injections, bladder catheterizations, and continuous vital signs charting under licensed physician supervision.',
  },
  {
    question: 'How do 12-hour and 24-hour caretaker shifts work?',
    answer:
      'Caretakers provide non-clinical mobility assistance, personal hygiene (sponge baths, grooming), feeding support, and companionship for post-surgery patients, stroke survivors, and elderly loved ones.',
  },
  {
    question: 'When and how will I receive my diagnostic lab results?',
    answer:
      'Samples collected by our certified phlebotomists are transported via temperature-monitored cold-chain bags to accredited laboratory partners. Verified digital reports with clinical reference ranges are published to your Patient Portal within 12 to 24 hours.',
  },
  {
    question: 'Are fees real clinic charges or demonstration rates?',
    answer:
      'Displayed rates (e.g. $85 / ₹1,499) are demonstration rate-card values for prototype evaluation. Live clinical operations will display localized municipal rates with clear payment receipts upon checkout.',
  },
];
