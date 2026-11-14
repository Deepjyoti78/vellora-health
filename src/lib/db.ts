// In-memory & local state repository for Vellora Health Platform
// Provides persistent-feeling typed CRUD across all 128 screens for Patient, Provider, and Admin.

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'PATIENT' | 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHLEBOTOMIST' | 'ADMIN';
  avatar: string;
  specialty?: string;
  verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  isOnline?: boolean;
  rating?: number;
  reviewsCount?: number;
  experienceYears?: number;
  hourlyRate?: number;
  bio?: string;
  qualification?: string;
}

export interface FamilyMemberRecord {
  id: string;
  patientId: string;
  fullName: string;
  relationship: string;
  gender: string;
  dob: string;
  bloodGroup: string;
}

export interface AddressRecord {
  id: string;
  patientId: string;
  tag: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export interface ServiceRecord {
  id: string;
  slug: string;
  name: string;
  category: 'DOCTOR_VISIT' | 'NURSING_CARE' | 'CARETAKER' | 'LAB_TESTS' | 'REHAB_THERAPY' | 'CRITICAL_CARE';
  categoryLabel: string;
  shortDesc: string;
  description: string;
  image: string;
  basePrice: number;
  duration: string;
  features: string[];
  supportedOptions: string[];
}

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  beneficiaryName: string;
  beneficiaryRelation: string;
  serviceId: string;
  serviceName: string;
  category: 'DOCTOR_VISIT' | 'NURSING_CARE' | 'CARETAKER' | 'LAB_TESTS' | 'REHAB_THERAPY' | 'CRITICAL_CARE';
  providerId?: string;
  providerName?: string;
  providerRole?: string;
  addressText: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  status:
    | 'REQUESTED'
    | 'CONFIRMED'
    | 'ASSIGNED'
    | 'ON_THE_WAY'
    | 'ARRIVED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';
  shiftType?: 'STANDARD_VISIT' | 'SINGLE_VISIT' | 'SHIFT_12H' | 'SHIFT_24H';
  totalAmount: number;
  discountAmount: number;
  couponCode?: string;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED';
  paymentMethod: string;
  notes?: string;
  clinicalNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  prescriptionId?: string;
  vitalsId?: string;
  labReportId?: string;
  verificationPin?: string;
  feedbackRating?: number;
  feedbackComment?: string;
}

export interface PrescriptionRecord {
  id: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  advice: string;
  issuedAt: string;
}

export interface VitalsRecord {
  id: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  recordedBy: string;
  bloodPressure: string;
  heartRate: number;
  spo2: number;
  temperature: number;
  bloodGlucose: number;
  respiratoryRate: number;
  clinicalNotes: string;
  recordedAt: string;
}

export interface LabReportRecord {
  id: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  testName: string;
  category: string;
  specimenType: string;
  barcode: string;
  collectedAt: string;
  status: 'PENDING_COLLECTION' | 'IN_LAB' | 'COMPLETED';
  parameters: {
    parameter: string;
    value: string;
    normalRange: string;
    status: 'NORMAL' | 'HIGH' | 'LOW';
  }[];
  resultSummary: string;
  releasedAt: string;
}

export interface PayoutRecord {
  id: string;
  providerId: string;
  providerName: string;
  period: string;
  visitsCount: number;
  totalEarnings: number;
  commission: number;
  netPayout: number;
  status: 'PENDING' | 'PROCESSED' | 'PAID';
  transactionRef: string;
  date: string;
}

export interface SupportTicketRecord {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  role: string;
  subject: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED';
  createdAt: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'BOOKING' | 'CLINICAL' | 'BILLING' | 'SYSTEM';
  isRead: boolean;
  time: string;
}

// Initial Comprehensive Seed Data
const initialUsers: UserRecord[] = [
  {
    id: 'pat-1',
    name: 'Eleanor Vance',
    email: 'patient@vellora.com',
    phone: '+1 (555) 234-5678',
    role: 'PATIENT',
    avatar: '/assets/avatar-1.webp',
  },
  {
    id: 'pat-2',
    name: 'Arthur Pendelton',
    email: 'arthur.p@example.com',
    phone: '+1 (555) 876-5432',
    role: 'PATIENT',
    avatar: '/assets/avatar-2.webp',
  },
  {
    id: 'doc-1',
    name: 'Dr. Maya Patel',
    email: 'dr.maya@vellora.com',
    phone: '+1 (555) 345-6789',
    role: 'DOCTOR',
    avatar: '/assets/doctor-maya-patel.jpg',
    specialty: 'Internal Medicine & Geriatrics',
    verificationStatus: 'APPROVED',
    isOnline: true,
    rating: 4.9,
    reviewsCount: 148,
    experienceYears: 14,
    hourlyRate: 85,
    bio: 'Board-certified internist specializing in holistic home-visit consultations and chronic disease management.',
    qualification: 'MD (Internal Medicine) - Johns Hopkins University',
  },
  {
    id: 'doc-2',
    name: 'Dr. Ethan Park',
    email: 'dr.ethan@vellora.com',
    phone: '+1 (555) 456-7890',
    role: 'DOCTOR',
    avatar: '/assets/doctor-ethan-park.jpg',
    specialty: 'Pediatrics & Family Medicine',
    verificationStatus: 'APPROVED',
    isOnline: true,
    rating: 4.8,
    reviewsCount: 112,
    experienceYears: 11,
    hourlyRate: 80,
    bio: 'Dedicated pediatrician passionate about accessible family care, preventive vaccines, and pediatric developmental health.',
    qualification: 'MD (Pediatrics) - Stanford Medicine',
  },
  {
    id: 'doc-3',
    name: 'Dr. Daniel Reed',
    email: 'dr.daniel@vellora.com',
    phone: '+1 (555) 567-8912',
    role: 'DOCTOR',
    avatar: '/assets/doctor-daniel-reed.jpg',
    specialty: 'Cardiology & Chronic Disease Management',
    verificationStatus: 'APPROVED',
    isOnline: true,
    rating: 4.85,
    reviewsCount: 129,
    experienceYears: 16,
    hourlyRate: 95,
    bio: 'Dedicated to preventing hospital readmissions through proactive bedside assessments, cardiac telemetry, and hypertension management.',
    qualification: 'MD (Cardiovascular Disease) - Harvard Medical School',
  },
  {
    id: 'doc-4',
    name: 'Dr. Sofia Morgan',
    email: 'dr.sofia@vellora.com',
    phone: '+1 (555) 678-9123',
    role: 'DOCTOR',
    avatar: '/assets/doctor-4.webp',
    specialty: 'Post-Operative Rehabilitation & Orthopedics',
    verificationStatus: 'APPROVED',
    isOnline: true,
    rating: 4.9,
    reviewsCount: 104,
    experienceYears: 12,
    hourlyRate: 90,
    bio: 'Guiding surgical recovery, mobility milestones, wound integrity, and physical therapy in the safety and comfort of your home.',
    qualification: 'MD (Physical Medicine & Rehab) - Columbia University',
  },
  {
    id: 'doc-5',
    name: 'Dr. Marcus Vance',
    email: 'dr.marcus@vellora.com',
    phone: '+1 (555) 789-0134',
    role: 'DOCTOR',
    avatar: '/assets/doctor-3.webp',
    specialty: 'General Practice & Acute Illness',
    verificationStatus: 'APPROVED',
    isOnline: false,
    rating: 4.9,
    reviewsCount: 98,
    experienceYears: 15,
    hourlyRate: 85,
    bio: 'Veteran emergency clinician focused on rapid acute evaluations, respiratory ailments, and compassionate bedside care.',
    qualification: 'MD, FACEP - Yale School of Medicine',
  },
  {
    id: 'nur-1',
    name: 'Nurse Sarah Jenkins',
    email: 'nurse.sarah@vellora.com',
    phone: '+1 (555) 567-8901',
    role: 'NURSE',
    avatar: '/assets/facility-2.webp',
    specialty: 'Post-Operative & Critical Care',
    verificationStatus: 'APPROVED',
    isOnline: true,
    rating: 4.95,
    reviewsCount: 96,
    experienceYears: 9,
    hourlyRate: 45,
    bio: 'Registered nurse with extensive trauma ICU and home infusion nursing experience.',
    qualification: 'BSN, RN - Columbia School of Nursing',
  },
  {
    id: 'car-1',
    name: 'James Thornton',
    email: 'caretaker.james@vellora.com',
    phone: '+1 (555) 678-9012',
    role: 'CARETAKER',
    avatar: '/assets/doctor-3.webp',
    specialty: 'Elderly Assistance & Mobility Support',
    verificationStatus: 'APPROVED',
    isOnline: true,
    rating: 4.85,
    reviewsCount: 84,
    experienceYears: 7,
    hourlyRate: 28,
    bio: 'Certified compassionate nursing assistant assisting seniors with daily living, mobility, and companionship.',
    qualification: 'CNA - Certified Nursing Assistant',
  },
  {
    id: 'phl-1',
    name: 'Alex Rivera',
    email: 'phlebo.alex@vellora.com',
    phone: '+1 (555) 789-0123',
    role: 'PHLEBOTOMIST',
    avatar: '/assets/diagnostics.webp',
    specialty: 'Home Blood Draw & Specimen Handling',
    verificationStatus: 'APPROVED',
    isOnline: true,
    rating: 4.9,
    reviewsCount: 130,
    experienceYears: 6,
    hourlyRate: 35,
    bio: 'Gentle, skilled phlebotomist with expertise in pediatric and geriatric vein access.',
    qualification: 'CPT - Certified Phlebotomy Technician',
  },
  {
    id: 'adm-1',
    name: 'Super Admin',
    email: 'admin@vellora.com',
    phone: '+1 (555) 000-1111',
    role: 'ADMIN',
    avatar: '/assets/avatar-3.webp',
  },
];

const initialServices: ServiceRecord[] = [
  {
    id: 'srv-1',
    slug: 'home-doctor-visit',
    name: 'Home Visit Doctor Consultations',
    category: 'DOCTOR_VISIT',
    categoryLabel: 'Doctor Consultations',
    shortDesc: 'Comprehensive medical assessment in the comfort and privacy of your home.',
    description:
      'Avoid clinic queues and travel stress. Our board-certified physicians provide unhurried physical examinations, acute illness diagnosis, chronic condition reviews, digital prescriptions, and direct specialist coordination.',
    image: '/assets/doorstep-1.png',
    basePrice: 95,
    duration: '45 - 60 mins',
    features: [
      'In-person head-to-toe physical examination',
      'Instant digital prescriptions sent to your phone',
      'Follow-up teleconsultation included within 7 days',
      'Vital signs, blood pressure & ECG rhythm check',
      'Referral coordination with top regional hospitals',
    ],
    supportedOptions: [
      'General Physician Consultation',
      'Geriatric & Elderly Care Review',
      'Pediatric Home Visit',
      'Post-Discharge Physician Follow-up',
    ],
  },
  {
    id: 'srv-2',
    slug: 'home-nursing-care',
    name: 'Home Nursing Care',
    category: 'NURSING_CARE',
    categoryLabel: 'Professional Nursing',
    shortDesc: 'Certified nursing support for wound care, IV therapy, injections, and vitals.',
    description:
      'Hospital-grade clinical nursing at home. From surgical wound dressing and suture removal to IV catheter administration, catheterization, and post-operative vitals monitoring by licensed nurses.',
    image: '/assets/doorstep-3.png',
    basePrice: 55,
    duration: 'Per procedure or 2-4 hours',
    features: [
      'Sterile wound dressing and diabetic ulcer management',
      'IV fluid administration and IV antibiotic therapy',
      'Catheter insertion, care, and bladder wash',
      'Tracheostomy care and nebulization therapy',
      'Hourly vitals charting and physician notification',
    ],
    supportedOptions: [
      'Single Procedure / Dressing Visit',
      'Short Nursing Visit (2 Hours)',
      '12-Hour Day Nursing Shift',
      '12-Hour Night Nursing Shift',
      '24-Hour Continuous Nursing Care',
    ],
  },
  {
    id: 'srv-3',
    slug: 'patient-caretakers-medical-maids',
    name: 'Patient Caretakers & Medical Maids',
    category: 'CARETAKER',
    categoryLabel: 'Caretakers & Assistants',
    shortDesc: 'Trained attendants for daily living assistance, hygiene, mobility, and feeding.',
    description:
      'Dedicated bedside caretakers who ensure your loved ones are safe, clean, nourished, and supported around the clock. Ideal for bedridden patients, stroke recovery, and seniors needing mobility support.',
    image: '/assets/doorstep-4.png',
    basePrice: 40,
    duration: '12-Hour or 24-Hour Shifts',
    features: [
      'Assistance with bathing, sponge baths, and oral hygiene',
      'Diaper change, bedpan assistance, and skin care',
      'Mobility transfer, wheelchair assistance, and light walking',
      'Timely oral medication reminder and feeding support',
      'Companionship, repositioning to prevent bedsores',
    ],
    supportedOptions: [
      '12-Hour Day Attendant Shift',
      '12-Hour Night Attendant Shift',
      '24-Hour Live-in Caretaker',
      'Weekly Bedridden Patient Care Package',
    ],
  },
  {
    id: 'srv-4',
    slug: 'home-lab-investigations',
    name: 'Home Lab Investigations',
    category: 'LAB_TESTS',
    categoryLabel: 'Diagnostic Tests',
    shortDesc: 'Painless sample collection at home with digital reports within 12 to 24 hours.',
    description:
      'NABL-accredited laboratory diagnostics delivered to your doorstep. Certified phlebotomists collect blood, urine, or swab samples using vacuum sterile barcoded vials with cold-chain transport.',
    image: '/assets/doorstep-2.png',
    basePrice: 35,
    duration: '15 mins sample collection',
    features: [
      'Certified phlebotomist home visit',
      'Painless vacutainer blood collection',
      'Cold-chain transport directly to accredited labs',
      'Digital PDF report delivered via app and email within 12 hours',
      'Free doctor tele-review on abnormal test results',
    ],
    supportedOptions: [
      'Comprehensive Full Body Health Checkup',
      'Complete Blood Count (CBC) & ESR',
      'Diabetic Profile (HbA1c & Fasting Glucose)',
      'Lipid & Cardiac Risk Profile',
      'Liver & Kidney Function Panel',
      'Thyroid Hormone Panel (T3, T4, TSH)',
    ],
  },
  {
    id: 'srv-5',
    slug: 'home-physiotherapy',
    name: 'Home Physiotherapy & Rehabilitation',
    category: 'REHAB_THERAPY',
    categoryLabel: 'Physical Therapy & Rehab',
    shortDesc: 'Expert physical therapy for stroke recovery, joint replacement, and mobility restoration.',
    description:
      'Certified physical therapists bring customized orthopedic, neurological, and geriatric rehabilitation directly to your living room. Accelerate recovery with guided neuromuscular stimulation and gait training.',
    image: '/assets/wellness.webp',
    basePrice: 60,
    duration: '50 - 60 mins',
    features: [
      'Personalized mobility assessment and joint range of motion',
      'Post-total-knee/hip-replacement protocol exercises',
      'Stroke paralysis rehabilitation & balance retraining',
      'Pain management with portable TENS & ultrasound units',
      'Digital exercise compliance chart for treating surgeon',
    ],
    supportedOptions: [
      'Single Targeted Physiotherapy Session',
      '5-Session Mobility Rehabilitation Pack',
      '10-Session Comprehensive Post-Op Package',
      'Elderly Fall-Prevention Conditioning',
    ],
  },
  {
    id: 'srv-6',
    slug: 'critical-care-icu-setup',
    name: 'Critical Care & ICU Step-Down Setup',
    category: 'CRITICAL_CARE',
    categoryLabel: 'Critical Care & Monitoring',
    shortDesc: 'Advanced home ICU installation with multipara monitors, oxygen, and continuous critical care nursing.',
    description:
      'Transition hospitalized patients safely home. Complete ICU infrastructure including hospital-grade electric beds, continuous vitals monitoring, oxygen concentrators, and 24/7 dedicated critical care nurses supervised by intensivists.',
    image: '/assets/compassionate-hospital-care.png',
    basePrice: 180,
    duration: '12-Hour or 24-Hour Continuous Care',
    features: [
      'Certified ICU trained registered nurse stationed at bedside',
      'Multipara monitor (SpO2, continuous ECG, NIBP, respiration)',
      'Medical oxygen concentrator & suction machine setup',
      'BiPAP / CPAP / tracheostomy tube management protocols',
      '24/7 tele-intensivist emergency video consultation backup',
    ],
    supportedOptions: [
      '12-Hour ICU Step-Down Nursing Shift',
      '24-Hour Intensive Care Continuous Package',
      'Complete Home ICU Equipment Suite Rental',
      'Palliative & Comfort Care ICU Protocol',
    ],
  },
];

const initialBookings: BookingRecord[] = [
  {
    id: 'bkg-101',
    bookingNumber: 'VEL-2026-8941',
    patientId: 'pat-1',
    patientName: 'Eleanor Vance',
    patientPhone: '+1 (555) 234-5678',
    beneficiaryName: 'Eleanor Vance',
    beneficiaryRelation: 'Self',
    serviceId: 'srv-1',
    serviceName: 'Home Visit Doctor Consultations',
    category: 'DOCTOR_VISIT',
    providerId: 'doc-1',
    providerName: 'Dr. Maya Patel',
    providerRole: 'DOCTOR',
    addressText: '742 Evergreen Terrace, Apt 4B, Springfield, OR 97477',
    scheduledDate: '2026-11-15',
    scheduledTimeSlot: '10:00 AM - 11:00 AM',
    status: 'CONFIRMED',
    totalAmount: 95,
    discountAmount: 10,
    couponCode: 'WELCOME10',
    paymentStatus: 'PAID',
    paymentMethod: 'Credit Card',
    notes: 'Patient experiencing mild chest tightness and persistent morning cough.',
    createdAt: '2026-11-14T08:30:00Z',
  },
  {
    id: 'bkg-102',
    bookingNumber: 'VEL-2026-8942',
    patientId: 'pat-1',
    patientName: 'Eleanor Vance',
    patientPhone: '+1 (555) 234-5678',
    beneficiaryName: 'Harold Vance (Father)',
    beneficiaryRelation: 'Parent',
    serviceId: 'srv-2',
    serviceName: 'Home Nursing Care',
    category: 'NURSING_CARE',
    providerId: 'nur-1',
    providerName: 'Nurse Sarah Jenkins',
    providerRole: 'NURSE',
    addressText: '742 Evergreen Terrace, Apt 4B, Springfield, OR 97477',
    scheduledDate: '2026-11-14',
    scheduledTimeSlot: '02:00 PM - 04:00 PM',
    status: 'IN_PROGRESS',
    shiftType: 'STANDARD_VISIT',
    totalAmount: 55,
    discountAmount: 0,
    paymentStatus: 'PAID',
    paymentMethod: 'UPI',
    notes: 'Post-surgical knee dressing change and vitals charting.',
    createdAt: '2026-11-13T14:15:00Z',
    vitalsId: 'vit-1',
  },
  {
    id: 'bkg-103',
    bookingNumber: 'VEL-2026-8943',
    patientId: 'pat-1',
    patientName: 'Eleanor Vance',
    patientPhone: '+1 (555) 234-5678',
    beneficiaryName: 'Eleanor Vance',
    beneficiaryRelation: 'Self',
    serviceId: 'srv-4',
    serviceName: 'Home Lab Investigations',
    category: 'LAB_TESTS',
    providerId: 'phl-1',
    providerName: 'Alex Rivera',
    providerRole: 'PHLEBOTOMIST',
    addressText: '742 Evergreen Terrace, Apt 4B, Springfield, OR 97477',
    scheduledDate: '2026-11-12',
    scheduledTimeSlot: '07:30 AM - 08:30 AM',
    status: 'COMPLETED',
    totalAmount: 45,
    discountAmount: 0,
    paymentStatus: 'PAID',
    paymentMethod: 'Card',
    notes: 'Fasting lipid profile & HbA1c screening.',
    createdAt: '2026-11-11T19:00:00Z',
    labReportId: 'lab-1',
  },
  {
    id: 'bkg-104',
    bookingNumber: 'VEL-2026-8944',
    patientId: 'pat-2',
    patientName: 'Arthur Pendelton',
    patientPhone: '+1 (555) 876-5432',
    beneficiaryName: 'Arthur Pendelton',
    beneficiaryRelation: 'Self',
    serviceId: 'srv-3',
    serviceName: 'Patient Caretakers & Medical Maids',
    category: 'CARETAKER',
    providerId: 'car-1',
    providerName: 'James Thornton',
    providerRole: 'CARETAKER',
    addressText: '120 Ocean View Blvd, Suite 101, Springfield, OR 97478',
    scheduledDate: '2026-11-16',
    scheduledTimeSlot: '08:00 AM - 08:00 PM',
    status: 'ASSIGNED',
    shiftType: 'SHIFT_12H',
    totalAmount: 120,
    discountAmount: 0,
    paymentStatus: 'PAID',
    paymentMethod: 'NetBanking',
    notes: 'Stroke recovery patient requiring assistance with walker and lunch preparation.',
    createdAt: '2026-11-14T10:00:00Z',
  },
  {
    id: 'bkg-105',
    bookingNumber: 'VEL-2026-8945',
    patientId: 'pat-2',
    patientName: 'Arthur Pendelton',
    patientPhone: '+1 (555) 876-5432',
    beneficiaryName: 'Arthur Pendelton',
    beneficiaryRelation: 'Self',
    serviceId: 'srv-1',
    serviceName: 'Home Visit Doctor Consultations',
    category: 'DOCTOR_VISIT',
    addressText: '120 Ocean View Blvd, Suite 101, Springfield, OR 97478',
    scheduledDate: '2026-11-17',
    scheduledTimeSlot: '04:00 PM - 05:00 PM',
    status: 'REQUESTED',
    totalAmount: 95,
    discountAmount: 0,
    paymentStatus: 'PENDING',
    paymentMethod: 'Cash on Service',
    notes: 'General checkup and medication refill evaluation.',
    createdAt: '2026-11-14T11:45:00Z',
  },
];

const initialPrescriptions: PrescriptionRecord[] = [
  {
    id: 'rx-1',
    bookingId: 'bkg-101',
    patientId: 'pat-1',
    patientName: 'Eleanor Vance',
    doctorName: 'Dr. Maya Patel',
    diagnosis: 'Acute Bronchitis & Hypertension Stage 1',
    medications: [
      {
        name: 'Amoxicillin-Clavulanate 625mg',
        dosage: '1 tablet',
        frequency: 'Twice daily after food',
        duration: '5 days',
        instructions: 'Complete full course even if symptoms subside.',
      },
      {
        name: 'Amlodipine 5mg',
        dosage: '1 tablet',
        frequency: 'Once daily in morning',
        duration: '30 days',
        instructions: 'Record morning blood pressure daily.',
      },
      {
        name: 'Guaifenesin Syrup 10ml',
        dosage: '10 ml',
        frequency: 'Thrice daily',
        duration: '5 days',
        instructions: 'Drink plenty of warm water throughout the day.',
      },
    ],
    advice:
      'Maintain adequate hydration. Avoid cold beverages and air-conditioning drafts. If fever exceeds 101F, call helpline immediately.',
    issuedAt: '2026-11-14T09:45:00Z',
  },
];

const initialVitals: VitalsRecord[] = [
  {
    id: 'vit-1',
    bookingId: 'bkg-102',
    patientId: 'pat-1',
    patientName: 'Harold Vance (Father)',
    recordedBy: 'Nurse Sarah Jenkins',
    bloodPressure: '128/82 mmHg',
    heartRate: 74,
    spo2: 98,
    temperature: 98.4,
    bloodGlucose: 110,
    respiratoryRate: 16,
    clinicalNotes:
      'Surgical wound healing well without signs of erythema or discharge. Sterile dressing applied. Patient comfortable.',
    recordedAt: '2026-11-14T14:30:00Z',
  },
];

const initialLabReports: LabReportRecord[] = [
  {
    id: 'lab-1',
    bookingId: 'bkg-103',
    patientId: 'pat-1',
    patientName: 'Eleanor Vance',
    testName: 'Comprehensive Metabolic & Lipid Panel',
    category: 'Biochemistry',
    specimenType: 'Venous Blood',
    barcode: 'VEL-LAB-982103',
    collectedAt: '2026-11-12T07:45:00Z',
    status: 'COMPLETED',
    parameters: [
      { parameter: 'Total Cholesterol', value: '185 mg/dL', normalRange: '< 200 mg/dL', status: 'NORMAL' },
      { parameter: 'HDL (Good) Cholesterol', value: '54 mg/dL', normalRange: '> 50 mg/dL', status: 'NORMAL' },
      { parameter: 'LDL (Bad) Cholesterol', value: '112 mg/dL', normalRange: '< 100 mg/dL', status: 'HIGH' },
      { parameter: 'Triglycerides', value: '138 mg/dL', normalRange: '< 150 mg/dL', status: 'NORMAL' },
      { parameter: 'HbA1c (Glycated Hemoglobin)', value: '5.6 %', normalRange: '< 5.7 %', status: 'NORMAL' },
      { parameter: 'Fasting Blood Sugar', value: '92 mg/dL', normalRange: '70 - 99 mg/dL', status: 'NORMAL' },
      { parameter: 'Serum Creatinine', value: '0.8 mg/dL', normalRange: '0.6 - 1.1 mg/dL', status: 'NORMAL' },
    ],
    resultSummary:
      'All major metabolic and renal markers within normal physiological thresholds. Mild borderline LDL elevation noted; dietary fiber enrichment recommended.',
    releasedAt: '2026-11-12T19:30:00Z',
  },
];

const initialFamilyMembers: FamilyMemberRecord[] = [
  {
    id: 'fam-1',
    patientId: 'pat-1',
    fullName: 'Eleanor Vance',
    relationship: 'Self',
    gender: 'Female',
    dob: '1988-06-14',
    bloodGroup: 'O+',
  },
  {
    id: 'fam-2',
    patientId: 'pat-1',
    fullName: 'Harold Vance',
    relationship: 'Father',
    gender: 'Male',
    dob: '1954-11-20',
    bloodGroup: 'B+',
  },
  {
    id: 'fam-3',
    patientId: 'pat-1',
    fullName: 'Grace Vance',
    relationship: 'Mother',
    gender: 'Female',
    dob: '1958-03-08',
    bloodGroup: 'O+',
  },
];

const initialAddresses: AddressRecord[] = [
  {
    id: 'addr-1',
    patientId: 'pat-1',
    tag: 'Home',
    streetAddress: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    isDefault: true,
  },
  {
    id: 'addr-2',
    patientId: 'pat-1',
    tag: "Parent's House",
    streetAddress: '435 Elm Street',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97478',
    isDefault: false,
  },
];

const initialPayouts: PayoutRecord[] = [
  {
    id: 'pay-1',
    providerId: 'doc-1',
    providerName: 'Dr. Maya Patel',
    period: 'Nov 1 - Nov 7, 2026',
    visitsCount: 16,
    totalEarnings: 1360,
    commission: 204,
    netPayout: 1156,
    status: 'PAID',
    transactionRef: 'ACH-VEL-992381',
    date: '2026-11-08',
  },
  {
    id: 'pay-2',
    providerId: 'nur-1',
    providerName: 'Nurse Sarah Jenkins',
    period: 'Nov 1 - Nov 7, 2026',
    visitsCount: 22,
    totalEarnings: 990,
    commission: 148.5,
    netPayout: 841.5,
    status: 'PAID',
    transactionRef: 'ACH-VEL-992382',
    date: '2026-11-08',
  },
];

const initialNotifications: NotificationRecord[] = [
  {
    id: 'notif-1',
    userId: 'pat-1',
    title: 'Booking Confirmed',
    message: 'Dr. Maya Patel is confirmed for your Home Doctor Visit on Nov 15 at 10:00 AM.',
    category: 'BOOKING',
    isRead: false,
    time: '15 mins ago',
  },
  {
    id: 'notif-2',
    userId: 'doc-1',
    title: 'New Visit Request',
    message: 'You have a new Home Visit request from Arthur Pendelton for Nov 17.',
    category: 'BOOKING',
    isRead: false,
    time: '45 mins ago',
  },
  {
    id: 'notif-3',
    userId: 'adm-1',
    title: 'New Provider Verification',
    message: 'Dr. Michael Chen uploaded credentials awaiting administrative review.',
    category: 'SYSTEM',
    isRead: false,
    time: '2 hours ago',
  },
];

// In-Memory Data Store with LocalStorage synchronization
class DataStore {
  private users: UserRecord[] = initialUsers;
  private services: ServiceRecord[] = initialServices;
  private bookings: BookingRecord[] = initialBookings;
  private prescriptions: PrescriptionRecord[] = initialPrescriptions;
  private vitals: VitalsRecord[] = initialVitals;
  private labReports: LabReportRecord[] = initialLabReports;
  private familyMembers: FamilyMemberRecord[] = initialFamilyMembers;
  private addresses: AddressRecord[] = initialAddresses;
  private payouts: PayoutRecord[] = initialPayouts;
  private notifications: NotificationRecord[] = initialNotifications;

  // Users
  getUsers() { return this.users; }
  getUserById(id: string) { return this.users.find(u => u.id === id); }
  getUsersByRole(role: string) { return this.users.filter(u => u.role === role); }
  updateUser(id: string, updates: Partial<UserRecord>) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      return this.users[idx];
    }
    return null;
  }

  // Services
  getServices() { return this.services; }
  getServiceBySlug(slug: string) { return this.services.find(s => s.slug === slug); }
  getServiceById(id: string) { return this.services.find(s => s.id === id); }
  updateService(id: string, updates: Partial<ServiceRecord>) {
    const idx = this.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.services[idx] = { ...this.services[idx], ...updates };
      return this.services[idx];
    }
    return null;
  }

  // Bookings
  getBookings() { return this.bookings; }
  getBookingById(id: string) { return this.bookings.find(b => b.id === id); }
  getBookingsByPatient(patientId: string) { return this.bookings.filter(b => b.patientId === patientId); }
  getBookingsByProvider(providerId: string) { return this.bookings.filter(b => b.providerId === providerId); }
  createBooking(booking: Omit<BookingRecord, 'id' | 'bookingNumber' | 'createdAt' | 'discountAmount' | 'paymentMethod'> & { discountAmount?: number; paymentMethod?: string }) {
    const id = `bkg-${Date.now()}`;
    const bookingNumber = `VEL-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: BookingRecord = {
      ...booking,
      discountAmount: booking.discountAmount ?? 0,
      paymentMethod: booking.paymentMethod ?? 'CARD',
      id,
      bookingNumber,
      createdAt: new Date().toISOString(),
    };
    this.bookings.unshift(newRecord);
    return newRecord;
  }
  updateBookingStatus(id: string, status: BookingRecord['status'], note?: string) {
    const booking = this.getBookingById(id);
    if (booking) {
      booking.status = status;
      if (note) booking.notes = note;
      return booking;
    }
    return null;
  }
  assignProvider(bookingId: string, providerId: string) {
    const booking = this.getBookingById(bookingId);
    const provider = this.getUserById(providerId);
    if (booking && provider) {
      booking.providerId = provider.id;
      booking.providerName = provider.name;
      booking.providerRole = provider.role;
      booking.status = 'ASSIGNED';
      return booking;
    }
    return null;
  }

  // Clinical Records
  getPrescriptionsByPatient(patientId: string) {
    return this.prescriptions.filter(p => p.patientId === patientId);
  }
  createPrescription(data: Omit<PrescriptionRecord, 'id' | 'issuedAt'>) {
    const newPrescription: PrescriptionRecord = {
      ...data,
      id: `rx-${Date.now()}`,
      issuedAt: new Date().toISOString(),
    };
    this.prescriptions.unshift(newPrescription);
    return newPrescription;
  }
  getVitalsByPatient(patientId: string) {
    return this.vitals.filter(v => v.patientId === patientId);
  }
  createVitals(data: Omit<VitalsRecord, 'id' | 'recordedAt'>) {
    const newVitals: VitalsRecord = {
      ...data,
      id: `vit-${Date.now()}`,
      recordedAt: new Date().toISOString(),
    };
    this.vitals.unshift(newVitals);
    return newVitals;
  }
  getLabReportsByPatient(patientId: string) {
    return this.labReports.filter(l => l.patientId === patientId);
  }
  getLabReportById(id: string) {
    return this.labReports.find(l => l.id === id);
  }

  // Support Tickets
  private tickets: SupportTicketRecord[] = [
    {
      id: 'tkt-1',
      ticketNumber: 'TKT-8841',
      userId: 'pat-1',
      userName: 'Eleanor Vance',
      role: 'PATIENT',
      subject: 'Inquiry regarding 24-hour post-op nursing care coverage',
      message: 'Hello, our family is scheduling hip surgery for my mother in late November. We would like to confirm if night shifts include vital monitoring every 2 hours.',
      priority: 'MEDIUM',
      status: 'OPEN',
      createdAt: '2026-11-12T14:30:00Z',
    },
    {
      id: 'tkt-2',
      ticketNumber: 'TKT-8842',
      userId: 'doc-1',
      userName: 'Dr. Maya Patel',
      role: 'DOCTOR',
      subject: 'Diagnostic equipment kit calibration renewal',
      message: 'Requesting updated calibration seals for portable ultrasound scanner unit 4.',
      priority: 'LOW',
      status: 'IN_REVIEW',
      createdAt: '2026-11-13T09:15:00Z',
    },
  ];

  getSupportTickets(userId?: string) {
    if (userId) return this.tickets.filter(t => t.userId === userId);
    return this.tickets;
  }
  createSupportTicket(ticket: Omit<SupportTicketRecord, 'id' | 'ticketNumber' | 'createdAt' | 'status'>) {
    const newTicket: SupportTicketRecord = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };
    this.tickets.unshift(newTicket);
    return newTicket;
  }
  updateTicketStatus(id: string, status: SupportTicketRecord['status']) {
    const t = this.tickets.find(item => item.id === id);
    if (t) t.status = status;
    return t;
  }

  // Family & Addresses
  getFamilyMembers(patientId: string) {
    return this.familyMembers.filter(f => f.patientId === patientId);
  }
  addFamilyMember(member: Omit<FamilyMemberRecord, 'id'>) {
    const newMember: FamilyMemberRecord = {
      ...member,
      id: `fam-${Date.now()}`,
    };
    this.familyMembers.push(newMember);
    return newMember;
  }
  deleteFamilyMember(id: string) {
    this.familyMembers = this.familyMembers.filter(f => f.id !== id);
    return true;
  }
  getAddresses(patientId: string) {
    return this.addresses.filter(a => a.patientId === patientId);
  }
  addAddress(address: Omit<AddressRecord, 'id'>) {
    const newAddress: AddressRecord = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    this.addresses.push(newAddress);
    return newAddress;
  }
  deleteAddress(id: string) {
    this.addresses = this.addresses.filter(a => a.id !== id);
    return true;
  }

  // Financials & Payouts
  getPayouts(providerId?: string) {
    if (providerId) return this.payouts.filter(p => p.providerId === providerId);
    return this.payouts;
  }
  updatePayoutStatus(id: string, status: PayoutRecord['status']) {
    const payout = this.payouts.find(p => p.id === id);
    if (payout) payout.status = status;
    return payout;
  }

  // Notifications
  getNotifications(userId: string) {
    return this.notifications.filter(n => n.userId === userId);
  }
  markNotificationRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
  }
}

export const db = new DataStore();
