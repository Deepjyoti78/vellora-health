// In-memory & local state repository for Vellora Health Platform
// Provides persistent-feeling typed CRUD across all 128 screens for Patient, Provider, and Admin.

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'PATIENT' | 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHYSIOTHERAPIST' | 'PHLEBOTOMIST' | 'ADMIN';
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
  licenseNumber?: string;
  registrationCouncil?: string;
  serviceLocations?: string[];
}

export interface ProviderApplicationRecord {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHYSIOTHERAPIST' | 'PHLEBOTOMIST';
  state: string;
  city: string;
  serviceLocations: string[];
  qualification: string;
  experienceYears: number;
  licenseNumber?: string;
  registrationCouncil?: string;
  specialty?: string;
  documents: {
    id: string;
    title: string;
    type: string;
    size: string;
    status: 'VALID' | 'PENDING' | 'REJECTED';
    uploadedAt: string;
  }[];
  status:
    | 'DRAFT'
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'ADDITIONAL_INFO_REQUIRED'
    | 'APPROVED'
    | 'REJECTED'
    | 'SUSPENDED';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  appliedAt: string;
}

export interface ProviderShiftRecord {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0: Sun, 1: Mon, ... 6: Sat
  dayName: string;
  startTime: string; // "08:00"
  endTime: string;   // "17:00"
  isActive: boolean;
  maxVisitsPerDay: number;
  serviceZones: string[];
}

export interface JobOfferRecord {
  id: string;
  bookingId: string;
  providerId: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  addressArea: string;
  estimatedFee: number;
  status: 'OFFERED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  offeredAt: string;
}

export interface ClinicalNoteRecord {
  id: string;
  bookingId: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  providerRole: 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHYSIOTHERAPIST' | 'PHLEBOTOMIST';
  title: string;
  summary: string;
  observations?: string;
  tasksCompleted?: string[];
  vitalsRecorded?: {
    bp?: string;
    pulse?: number;
    spo2?: number;
    temp?: number;
    glucose?: number;
  };
  specimenBarcode?: string;
  rehabExercises?: string[];
  createdAt: string;
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
  bookingType?: 'QUICK_ENQUIRY' | 'SERVICE_REQUEST' | 'DOCTOR_CONSULTATION';
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
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
    avatar: '/assets/avatar-indian-1.jpg',
  },
  {
    id: 'pat-2',
    name: 'Arthur Pendelton',
    email: 'arthur.p@example.com',
    phone: '+1 (555) 876-5432',
    role: 'PATIENT',
    avatar: '/assets/avatar-indian-2.jpg',
  },
  {
    id: 'doc-1',
    name: 'Dr. Maya Patel',
    email: 'dr.maya@vellora.com',
    phone: '+1 (555) 345-6789',
    role: 'DOCTOR',
    avatar: '/assets/chatgpt-card-3.webp',
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
    avatar: '/assets/chatgpt-card-4.webp',
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
    avatar: '/assets/chatgpt-card-4.webp',
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
    avatar: '/assets/chatgpt-card-3.webp',
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
    avatar: '/assets/chatgpt-card-4.webp',
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
    id: 'doc-6',
    name: 'Dr. Ananya Rao',
    email: 'dr.ananya@vellora.com',
    phone: '+1 (555) 890-1245',
    role: 'DOCTOR',
    avatar: '/assets/avatar-indian-9.jpg',
    specialty: 'Pediatrics & Neonatal Care',
    verificationStatus: 'APPROVED',
    isOnline: true,
    rating: 4.95,
    reviewsCount: 135,
    experienceYears: 10,
    hourlyRate: 85,
    bio: 'Specialized neonatal checkups, infant vaccinations, and developmental pediatric wellness delivered in the comfort of home.',
    qualification: 'MD (Pediatrics) - Stanford Medicine',
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
    avatar: '/assets/chatgpt-card-4.webp',
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
    avatar: '/assets/avatar-indian-3.jpg',
  },
];

const initialServices: ServiceRecord[] = [
  {
    "id": "srv-1",
    "slug": "home-doctor-visit",
    "name": "Home Visit Doctor Consultations",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Comprehensive medical assessment in the comfort and privacy of your home.",
    "description": "Avoid clinic queues and travel stress. Board-certified physicians provide unhurried physical examinations, acute illness diagnosis, chronic condition reviews, digital prescriptions, and direct specialist coordination.",
    "image": "/assets/chatgpt-card-1.webp",
    "basePrice": 95,
    "duration": "45 - 60 mins",
    "features": [
      "In-person head-to-toe physical examination",
      "Instant digital prescriptions sent to your phone",
      "Follow-up teleconsultation included within 7 days",
      "Vital signs, blood pressure & ECG rhythm check",
      "Referral coordination with top regional hospitals"
    ],
    "supportedOptions": [
      "General Physician Consultation",
      "Geriatric & Elderly Care Review",
      "Pediatric Home Visit",
      "Post-Discharge Physician Follow-up"
    ]
  },
  {
    "id": "srv-7",
    "slug": "geriatric-comprehensive-evaluation",
    "name": "Geriatric Comprehensive Senior Medical Exam",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Specialized medical assessment for seniors, polypharmacy review, and cognitive screening.",
    "description": "Elderly care evaluation conducted by experienced geriatric physicians. Includes medication reconciliation, fall risk assessment, cognitive health checks, and chronic disease optimization.",
    "image": "/assets/chatgpt-card-1.webp",
    "basePrice": 120,
    "duration": "60 mins",
    "features": [
      "Comprehensive polypharmacy and drug interaction audit",
      "Cognitive assessment & memory screening (MMSE)",
      "Mobility, balance, and fall prevention guidance",
      "Chronic hypertension & diabetes clinical evaluation",
      "Personalized preventative senior care plan"
    ],
    "supportedOptions": [
      "Comprehensive Senior Checkup",
      "Cognitive & Memory Review",
      "Polypharmacy Optimization"
    ]
  },
  {
    "id": "srv-8",
    "slug": "pediatric-home-consultation",
    "name": "Pediatric In-Home Child Care Consultation",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Gentle, compassionate pediatrician house calls for infants, toddlers, and young children.",
    "description": "Keep sick children comfortable at home. Our pediatricians evaluate fevers, respiratory issues, rashes, ear infections, and milestones in your childs familiar surroundings.",
    "image": "/assets/chatgpt-card-9.webp",
    "basePrice": 110,
    "duration": "45 mins",
    "features": [
      "Gentle pediatric ear, nose, throat, and chest exam",
      "Fever, cough, asthma, and allergy bedside diagnosis",
      "Growth and developmental milestone tracking",
      "Child-safe e-prescriptions with weight-based dosing",
      "Direct parent WhatsApp follow-up for 48 hours"
    ],
    "supportedOptions": [
      "Acute Illness Home Visit",
      "Newborn Wellness Check",
      "Pediatric Allergy & Asthma Review"
    ]
  },
  {
    "id": "srv-9",
    "slug": "cardiology-bedside-evaluation",
    "name": "In-Home Cardiology & Heart Health Assessment",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Bedside cardiac consultation, digital rhythm analysis, and hypertension management.",
    "description": "Consult a cardiologist without visiting the hospital. Includes stethoscope heart sound analysis, blood pressure mapping, digital ECG telemetry, and medication optimization.",
    "image": "/assets/chatgpt-card-1.webp",
    "basePrice": 145,
    "duration": "50 - 60 mins",
    "features": [
      "Cardiologist physical examination & murmur auscultation",
      "Digital 12-lead ECG rhythm recording & immediate report",
      "Congestive heart failure (CHF) fluid retention check",
      "Post-stent and bypass surgery follow-up care",
      "Dietary sodium and cardiovascular lifestyle counseling"
    ],
    "supportedOptions": [
      "Cardiology Consultation",
      "Hypertension & Arrhythmia Clinic",
      "Post-Op Cardiac Review"
    ]
  },
  {
    "id": "srv-10",
    "slug": "diabetic-metabolic-care-visit",
    "name": "Diabetic & Metabolic Chronic Care House Call",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Focused medical checkup for diabetes, insulin titration, and diabetic neuropathy screening.",
    "description": "Comprehensive chronic disease doctor visits designed to stabilize blood sugars, prevent diabetic foot complications, and review kidney health.",
    "image": "/assets/chatgpt-card-1.webp",
    "basePrice": 100,
    "duration": "45 mins",
    "features": [
      "Blood glucose & HbA1c review with insulin dose titration",
      "Diabetic monofilament foot sensory & vascular examination",
      "Kidney function & microalbuminuria risk audit",
      "Dietary carbohydrate management plan",
      "Continuous Glucose Monitor (CGM) sensor calibration"
    ],
    "supportedOptions": [
      "Type 2 Diabetes Review",
      "Insulin Initiation Consultation",
      "Diabetic Neuropathy & Foot Check"
    ]
  },
  {
    "id": "srv-11",
    "slug": "orthopedic-joint-pain-assessment",
    "name": "Orthopedic & Joint Pain House Call",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Expert musculoskeletal evaluation for arthritis, back pain, and joint stiffness.",
    "description": "Orthopedic doctor visits for patients with restricted mobility due to osteoarthritis, spinal pain, or recent bone fractures.",
    "image": "/assets/chatgpt-card-6.webp",
    "basePrice": 125,
    "duration": "45 - 60 mins",
    "features": [
      "Joint range of motion, spine & gait biomechanical exam",
      "Arthritis pain management & non-opioid prescribing",
      "Post-fracture healing audit & brace fitting review",
      "Targeted physiotherapy recommendations",
      "Mobility aid prescription (walker, cane, wheelchair)"
    ],
    "supportedOptions": [
      "Knee & Hip Osteoarthritis Exam",
      "Spine & Sciatica Review",
      "Post-Fracture Home Assessment"
    ]
  },
  {
    "id": "srv-12",
    "slug": "pulmonology-respiratory-house-call",
    "name": "Pulmonology & Respiratory Health Home Visit",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Doctor consultation for COPD, asthma, bronchitis, and post-viral recovery.",
    "description": "Specialized respiratory examinations at home. Auscultation of lung fields, pulse oximetry mapping, peak flow measurement, and inhaler technique optimization.",
    "image": "/assets/chatgpt-card-1.webp",
    "basePrice": 130,
    "duration": "45 mins",
    "features": [
      "Detailed lung auscultation & breath sound evaluation",
      "Oxygen saturation mapping and home oxygen prescription",
      "Nebulization and inhaler dosage optimization",
      "COPD action plan for seasonal flare-ups",
      "Chest X-ray referral and home collection lab orders"
    ],
    "supportedOptions": [
      "COPD & Emphysema Management",
      "Asthma Control Review",
      "Post-Pneumonia Lung Checkup"
    ]
  },
  {
    "id": "srv-13",
    "slug": "neurology-stroke-followup-visit",
    "name": "Neurology & Post-Stroke Recovery Consultation",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Neurological assessment for stroke survivors, Parkinsons, and tremors at home.",
    "description": "Dedicated doctor evaluation for neurological conditions. Motor tone testing, cranial nerve checks, swallowing evaluation, and medication coordination.",
    "image": "/assets/chatgpt-card-6.webp",
    "basePrice": 155,
    "duration": "60 mins",
    "features": [
      "Comprehensive bedside neurological examination",
      "Post-stroke motor power & speech clarity tracking",
      "Parkinsons tremor, rigidity, and gait evaluation",
      "Swallowing safety & aspiration pneumonia prevention",
      "Coordination with home speech & physical therapists"
    ],
    "supportedOptions": [
      "Post-Stroke Assessment",
      "Parkinsons Disease Management",
      "Neuropathy & Tremor Evaluation"
    ]
  },
  {
    "id": "srv-14",
    "slug": "post-discharge-hospital-review",
    "name": "Post-Hospital Discharge Transitional Review",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Crucial 48-hour post-discharge medical checkup to prevent hospital readmissions.",
    "description": "A critical bedside checkup within 48 to 72 hours of coming home from the hospital. The physician reviews discharge summaries, adjusts medications, and checks surgical wounds.",
    "image": "/assets/chatgpt-card-1.webp",
    "basePrice": 115,
    "duration": "60 mins",
    "features": [
      "Full review of hospital discharge summary and lab reports",
      "Reconciliation of pre-admission vs post-discharge meds",
      "Surgical incision inspection & infection surveillance",
      "Direct coordination with treating hospital surgeon",
      "Emergency escalation protocol establishing"
    ],
    "supportedOptions": [
      "General Post-Discharge Review",
      "Post-Surgical Review",
      "Cardiac Post-Discharge Check"
    ]
  },
  {
    "id": "srv-15",
    "slug": "urgent-care-acute-illness-visit",
    "name": "Same-Day Urgent Care Acute Illness Home Exam",
    "category": "DOCTOR_VISIT",
    "categoryLabel": "Doctor Consultations",
    "shortDesc": "Rapid doorstep doctor visit for sudden illness, high fevers, and acute infections.",
    "description": "Rapid dispatch physician visits for urgent medical issues that do not require an emergency room visit. Prompt diagnosis, bedside treatment, and symptom relief.",
    "image": "/assets/chatgpt-card-1.webp",
    "basePrice": 135,
    "duration": "45 mins",
    "features": [
      "Rapid doctor dispatch within 60 to 90 minutes",
      "Diagnosis of flu, strep throat, UTI, gastroenteritis",
      "Bedside point-of-care rapid testing and vitals",
      "Emergency anti-emetic or antibiotic prescription",
      "Direct clinical triage for hospital escalation if needed"
    ],
    "supportedOptions": [
      "Acute Fever & Infection Exam",
      "Gastroenteritis & Dehydration Check",
      "Urgent Elderly Checkup"
    ]
  },
  {
    "id": "srv-2",
    "slug": "home-nursing-care",
    "name": "Home Nursing Care",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "Certified nursing support for wound care, IV therapy, injections, and vitals.",
    "description": "Hospital-grade clinical nursing at home. From surgical wound dressing and suture removal to IV catheter administration, catheterization, and post-operative vitals monitoring by licensed nurses.",
    "image": "/assets/chatgpt-card-5.webp",
    "basePrice": 55,
    "duration": "Per procedure or 2-4 hours",
    "features": [
      "Sterile wound dressing and diabetic ulcer management",
      "IV fluid administration and IV antibiotic therapy",
      "Catheter insertion, care, and bladder wash",
      "Tracheostomy care and nebulization therapy",
      "Hourly vitals charting and physician notification"
    ],
    "supportedOptions": [
      "Single Procedure / Dressing Visit",
      "Short Nursing Visit (2 Hours)",
      "12-Hour Day Nursing Shift",
      "12-Hour Night Nursing Shift",
      "24-Hour Continuous Nursing Care"
    ]
  },
  {
    "id": "srv-16",
    "slug": "post-surgical-wound-dressing",
    "name": "Sterile Post-Op Wound Dressing & Suture Removal",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "Aseptic dressing changes, surgical staples removal, and wound healing monitoring.",
    "description": "Keep surgical incisions clean and infection-free. Certified registered nurses change surgical dressings using hospital-grade sterile techniques, remove sutures, and manage wound vacs.",
    "image": "/assets/chatgpt-card-5.webp",
    "basePrice": 65,
    "duration": "45 mins",
    "features": [
      "Aseptic no-touch technique dressing changes",
      "Diabetic foot ulcer and pressure sore debridement care",
      "Suture and surgical staple removal with sterile kit",
      "Infection monitoring (erythema, exudate, temperature)",
      "Digital wound progression photos sent to your surgeon"
    ],
    "supportedOptions": [
      "Single Sterile Dressing",
      "3-Visit Wound Care Pack",
      "Suture / Staple Removal Visit"
    ]
  },
  {
    "id": "srv-17",
    "slug": "12h-day-nursing-shift",
    "name": "12-Hour Day Shift Registered Nursing",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "Dedicated daytime bedside clinical nursing for high-dependency recovery.",
    "description": "A licensed registered nurse (RN/BSN) stationed at your home for 12 continuous daytime hours (8 AM to 8 PM) managing medications, infusions, catheterization, and hygiene.",
    "image": "/assets/chatgpt-card-5.webp",
    "basePrice": 220,
    "duration": "12 Hours (8 AM - 8 PM)",
    "features": [
      "Continuous hourly vitals monitoring and charting",
      "Medication administration (oral, subcutaneous, IV)",
      "Position changing and bed sore prevention protocols",
      "Enteral nutrition via feeding tube (NG / PEG)",
      "Immediate emergency liaison with treating doctors"
    ],
    "supportedOptions": [
      "Single 12H Day Shift",
      "5-Day Post-Op Nursing Package",
      "Weekly Nursing Care Package"
    ]
  },
  {
    "id": "srv-18",
    "slug": "12h-night-nursing-shift",
    "name": "12-Hour Night Shift Registered Nursing",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "Peace of mind overnight nursing care with active vitals monitoring and oxygen care.",
    "description": "Overnight nursing support from 8 PM to 8 AM. Ensures uninterrupted sleep for family members while a licensed nurse supervises oxygen, monitors IV infusions, and assists with nocturnal mobility.",
    "image": "/assets/chatgpt-card-6.webp",
    "basePrice": 240,
    "duration": "12 Hours (8 PM - 8 AM)",
    "features": [
      "Overnight continuous oxygenation & SpO2 monitoring",
      "Nocturnal medication administration and pain management",
      "Scheduled turning every 2 hours for bedridden patients",
      "Assistance with nocturnal bathroom needs or bedpan",
      "Morning vitals and clinical handoff report"
    ],
    "supportedOptions": [
      "Single Night Shift",
      "7-Night Post-Hospital Package",
      "Monthly Night Care Retainer"
    ]
  },
  {
    "id": "srv-19",
    "slug": "24h-continuous-residential-nursing",
    "name": "24-Hour Continuous Residential Nursing Care",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "24/7 dedicated round-the-clock hospital-grade nursing care in your home.",
    "description": "Round-the-clock clinical care provided by paired registered nurses on rotational 12-hour shifts. Ideal for intensive recovery, complex wounds, or advanced palliative care.",
    "image": "/assets/chatgpt-card-5.webp",
    "basePrice": 420,
    "duration": "24 Hours (Rotational)",
    "features": [
      "Two paired licensed nurses covering 24 continuous hours",
      "Comprehensive medication, IV line, and infusion management",
      "BiPAP, CPAP, oxygen concentrator, and suction maintenance",
      "Full personal hygiene, skin care, and enteral tube feeding",
      "Daily electronic medical summary to your primary doctor"
    ],
    "supportedOptions": [
      "24H Daily Nursing",
      "Weekly 24/7 Intensive Care",
      "Monthly Full-Time Nursing Package"
    ]
  },
  {
    "id": "srv-20",
    "slug": "iv-cannulation-infusion-therapy",
    "name": "IV Cannulation, Saline & Antibiotic Infusions",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "Safe in-home intravenous catheter placement, saline hydration, and antibiotic drips.",
    "description": "Avoid emergency department visits just for IV lines. A certified infusion nurse visits your home with sterile catheterization kits to start and monitor intravenous therapy.",
    "image": "/assets/chatgpt-card-5.webp",
    "basePrice": 75,
    "duration": "60 mins",
    "features": [
      "Ultrasonography-guided or sterile peripheral vein cannulation",
      "Doctor-prescribed IV antibiotic and saline infusion",
      "Phlebitis and infiltration safety surveillance",
      "Heparin/saline flush maintenance for existing lines",
      "Safe catheter removal and puncture dressing"
    ],
    "supportedOptions": [
      "Single IV Cannulation Visit",
      "Daily IV Antibiotic Course",
      "Hydration Therapy Session"
    ]
  },
  {
    "id": "srv-21",
    "slug": "urinary-catheter-care-foley",
    "name": "Urinary Catheter Care & Foley Replacement",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "Gentle, sterile Foley catheter insertion, bladder wash, and bag replacement.",
    "description": "Painless and sterile urinary catheter care at home. Licensed nurses handle Foley catheter insertion, continuous drainage bag emptying, irrigation, and hygiene.",
    "image": "/assets/chatgpt-card-5.webp",
    "basePrice": 70,
    "duration": "45 mins",
    "features": [
      "Sterile Foley catheter placement and balloon inflation",
      "Bladder wash and irrigation to clear sediment or clots",
      "Night and leg drainage bag exchange and disinfection",
      "Perineal hygiene and UTI prevention protocols",
      "Catheter removal and trial of voiding supervision"
    ],
    "supportedOptions": [
      "Catheter Change & Replacement",
      "Bladder Wash & Flush",
      "Emergency Catheter Clearance"
    ]
  },
  {
    "id": "srv-22",
    "slug": "tracheostomy-care-suctioning",
    "name": "Tracheostomy Tube Care & Airway Suctioning",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "Specialized airway suctioning, tracheostomy tie change, and stoma skin dressing.",
    "description": "Clinical nursing care for patients with tracheostomy tubes. Ensures open airway clearance, mucus suctioning, inner cannula cleaning, and stoma infection prevention.",
    "image": "/assets/chatgpt-card-5.webp",
    "basePrice": 85,
    "duration": "60 mins",
    "features": [
      "Aseptic bronchial suctioning with sterile suction catheters",
      "Tracheostomy tube tie replacement and flange stabilization",
      "Stoma site cleansing, antiseptic application, and split-gauze dressing",
      "Nebulization and humidified oxygen therapy setup",
      "Emergency tube decannulation escalation training"
    ],
    "supportedOptions": [
      "Single Tracheostomy Care Visit",
      "Twice-Daily Suctioning Service",
      "Tracheostomy Inner Cannula Change"
    ]
  },
  {
    "id": "srv-23",
    "slug": "ryles-tube-ng-feeding-care",
    "name": "Nasogastric (Ryles Tube) Feeding & Insertion",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "Sterile NG tube placement, position verification, and enteral feeding administration.",
    "description": "Safe enteral nutrition management. Registered nurses insert or replace nasogastric (NG/Ryles) tubes, verify gastric placement with pH testing, and guide family members.",
    "image": "/assets/chatgpt-card-5.webp",
    "basePrice": 80,
    "duration": "45 mins",
    "features": [
      "Sterile nasogastric tube insertion with topical anesthesia",
      "Gastric aspirate pH testing to confirm stomach placement",
      "Administration of liquid diets, pureed nutrition, and medications",
      "Flushing protocol to prevent tube clogging",
      "Tape change and nasal skin breakdown prevention"
    ],
    "supportedOptions": [
      "NG Tube Insertion Visit",
      "NG Tube Replacement & Check",
      "Enteral Feeding Protocol Guidance"
    ]
  },
  {
    "id": "srv-24",
    "slug": "central-line-picc-dressing",
    "name": "PICC Line & Central Venous Line Sterile Dressing",
    "category": "NURSING_CARE",
    "categoryLabel": "Professional Nursing",
    "shortDesc": "Hospital-standard sterile biopatch dressing changes and heparin line flushes.",
    "description": "Specialized central line maintenance. Certified nurses perform chlorhexidine skin prep, statlock replacement, biopatch application, and heparin locks to prevent bloodstream infections.",
    "image": "/assets/chatgpt-card-5.webp",
    "basePrice": 90,
    "duration": "45 mins",
    "features": [
      "Maximal sterile barrier technique with mask and sterile gloves",
      "Chlorhexidine skin antisepsis with 2-minute dry time",
      "Biopatch and transparent occlusive dressing replacement",
      "Pulsatile saline flush and heparin cap locking",
      "Inspection for catheter migration or erythema"
    ],
    "supportedOptions": [
      "Weekly PICC Line Dressing",
      "Central Line Flush & Cap Change",
      "Port-a-Cath Needle Access & Flush"
    ]
  },
  {
    "id": "srv-3",
    "slug": "patient-caretakers-medical-maids",
    "name": "Patient Caretakers & Medical Maids",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Trained attendants for daily living assistance, hygiene, mobility, and feeding.",
    "description": "Dedicated bedside caretakers who ensure your loved ones are safe, clean, nourished, and supported around the clock. Ideal for bedridden patients, stroke recovery, and seniors needing mobility support.",
    "image": "/assets/chatgpt-card-10.webp",
    "basePrice": 40,
    "duration": "12-Hour or 24-Hour Shifts",
    "features": [
      "Assistance with bathing, sponge baths, and oral hygiene",
      "Diaper change, bedpan assistance, and skin care",
      "Mobility transfer, wheelchair assistance, and light walking",
      "Timely oral medication reminder and feeding support",
      "Companionship, repositioning to prevent bedsores"
    ],
    "supportedOptions": [
      "12-Hour Day Attendant Shift",
      "12-Hour Night Attendant Shift",
      "24-Hour Live-in Caretaker",
      "Weekly Bedridden Patient Care Package"
    ]
  },
  {
    "id": "srv-25",
    "slug": "elderly-mobility-attendant-12h",
    "name": "12-Hour Day Elderly Mobility & Assistance Attendant",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Compassionate daytime support for walking, bathing, dressing, and companionship.",
    "description": "A trained personal care attendant helps your elderly parent with balance, walking, bathing, meal assistance, and medication reminders from morning to evening.",
    "image": "/assets/chatgpt-card-10.webp",
    "basePrice": 110,
    "duration": "12 Hours (8 AM - 8 PM)",
    "features": [
      "Safe transfer assistance from bed to chair to walker",
      "Full assistance with morning hygiene, bathing, and grooming",
      "Nutritious meal preparation and feeding support",
      "Timely oral medication reminders based on prescription",
      "Engaging companionship, puzzle solving, and light strolls"
    ],
    "supportedOptions": [
      "Single 12H Day Attendant",
      "5-Day Workweek Care Package",
      "Monthly Ongoing Attendant Plan"
    ]
  },
  {
    "id": "srv-26",
    "slug": "24h-resident-patient-caretaker",
    "name": "24-Hour Live-In Patient Caretaker & Attendant",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Full-time continuous 24/7 bedside attendant for non-clinical elder assistance.",
    "description": "Full-time live-in caregiver providing constant reassurance, mobility transfers, hygiene maintenance, and emergency alerting throughout both day and night.",
    "image": "/assets/chatgpt-card-10.webp",
    "basePrice": 195,
    "duration": "24 Hours (Continuous)",
    "features": [
      "24-hour round-the-clock physical presence and assistance",
      "Nighttime bathroom escort and fall prevention vigilance",
      "Assistance with meals, hydration, and light housekeeping",
      "Bed turning every 2 hours to safeguard fragile skin",
      "Real-time WhatsApp updates to family members"
    ],
    "supportedOptions": [
      "Daily 24H Attendant",
      "Weekly 7-Day Live-In Package",
      "Monthly Full-Time Resident Aide"
    ]
  },
  {
    "id": "srv-27",
    "slug": "bedridden-hygiene-sponge-bath",
    "name": "Bedridden Patient Sponge Bath & Hygiene Session",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Dignified, gentle sponge baths, hair washing, skin moisturizing, and linen change.",
    "description": "A focused 1-hour session by trained attendants to provide a refreshing sponge bath, shampoo, nail clipping, skin barrier cream application, and complete bed linen change.",
    "image": "/assets/chatgpt-card-10.webp",
    "basePrice": 50,
    "duration": "60 mins",
    "features": [
      "Warm water bed bath with gentle medical cleansing solution",
      "No-rinse hair shampoo and scalp massage",
      "Pressure point massage and zinc barrier cream application",
      "Clean adult diaper and sanitary pad change",
      "Fresh hospital-corner bed linen and sheet change"
    ],
    "supportedOptions": [
      "Single Hygiene Visit",
      "3-Visit Weekly Bathing Plan",
      "Daily Bedside Hygiene Retainer"
    ]
  },
  {
    "id": "srv-28",
    "slug": "dementia-alzheimers-companion",
    "name": "Dementia & Alzheimers Specialized Care Attendant",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Patient, trained attendants skilled in wandering prevention and memory reassurance.",
    "description": "Caregivers certified in memory care. They employ gentle redirection techniques, maintain structured routines, and safeguard seniors prone to wandering or sundowning.",
    "image": "/assets/chatgpt-card-10.webp",
    "basePrice": 130,
    "duration": "12 Hours (Day or Night)",
    "features": [
      "Specialized behavioral redirection and de-escalation skills",
      "Strict adherence to daily memory-friendly routines",
      "Wandering prevention and doorway monitoring vigilance",
      "Assistance with forgotten meals, hydration, and hygiene",
      "Cognitive engagement through music, photos, and sensory games"
    ],
    "supportedOptions": [
      "12-Hour Day Memory Support",
      "12-Hour Night Sundowning Shift",
      "Comprehensive Weekly Dementia Plan"
    ]
  },
  {
    "id": "srv-29",
    "slug": "post-stroke-mobility-aide",
    "name": "Post-Stroke Bedside Mobility & Feeding Aide",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Assistance for hemiplegic stroke survivors: transfers, feeding, and limb support.",
    "description": "Dedicated support for stroke recovery. Attendants assist with one-sided weakness, safe transfers using gait belts, aspiration-safe upright feeding, and range of motion.",
    "image": "/assets/chatgpt-card-6.webp",
    "basePrice": 120,
    "duration": "12 Hours",
    "features": [
      "Gait belt transfers protecting weak paretic limbs",
      "Upright 90-degree feeding support with swallowing vigilance",
      "Assistance with doctor-prescribed passive limb exercises",
      "Bed positioning with pillows to prevent shoulder subluxation",
      "Speech practice encouragement and communication board use"
    ],
    "supportedOptions": [
      "12-Hour Stroke Support Shift",
      "14-Day Post-Stroke Intensive Pack",
      "Monthly Stroke Aide Retainer"
    ]
  },
  {
    "id": "srv-30",
    "slug": "parkinsons-support-attendant",
    "name": "Parkinsons Movement & Fall Prevention Attendant",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Assisting with freezing episodes, steady walking, tremors, and timed meds.",
    "description": "Caregivers trained in Parkinsons disease characteristics. They help patients overcome gait freezing, steady hand tremors during dining, and ensure precise medication timing.",
    "image": "/assets/chatgpt-card-10.webp",
    "basePrice": 125,
    "duration": "12 Hours",
    "features": [
      "Assistance with gait freezing cues and auditory metronome pacing",
      "Precise on-time reminder for carbidopa-levodopa dosing",
      "Tremor-adaptive eating and drinking utensil assistance",
      "Fall prevention during bathroom and threshold navigation",
      "Gentle muscle massage for rigidity and stiffness relief"
    ],
    "supportedOptions": [
      "12-Hour Daytime Support",
      "Weekly Parkinsons Routine Plan",
      "Full-Month Dedicated Attendant"
    ]
  },
  {
    "id": "srv-31",
    "slug": "post-hospital-transition-attendant",
    "name": "Post-Surgical Discharge Transitional Attendant",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Extra help for the first critical 7 to 14 days after surgery or hospital stay.",
    "description": "Provides physical assistance during the vulnerable weeks following knee replacements, abdominal surgery, or cardiac recovery. Helps prevent accidental falls and wound strain.",
    "image": "/assets/chatgpt-card-10.webp",
    "basePrice": 115,
    "duration": "12 Hours",
    "features": [
      "Assistance with getting in and out of bed without wound strain",
      "Ice pack application and surgical limb elevation support",
      "Transportation escort to follow-up clinic appointments",
      "Preparation of light recuperative meals and herbal broths",
      "Immediate alert to family if swelling or fever develops"
    ],
    "supportedOptions": [
      "7-Day Post-Op Recovery Pack",
      "14-Day Joint Replacement Pack",
      "Individual 12-Hour Shift"
    ]
  },
  {
    "id": "srv-32",
    "slug": "palliative-comfort-care-attendant",
    "name": "Palliative & Comfort Care Bedside Attendant",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Gentle, respectful bedside presence focusing on dignity, pain relief, and comfort.",
    "description": "Compassionate attendants trained in end-of-life and palliative comfort. They provide quiet reassurance, gentle mouth care, skin relief, and support to grieving families.",
    "image": "/assets/chatgpt-card-10.webp",
    "basePrice": 140,
    "duration": "12 Hours (Day or Night)",
    "features": [
      "Frequent gentle repositioning with soft bolster pillows",
      "Mouth moistening with oral swabs and lip balm care",
      "Quiet, respectful companionship and family respite",
      "Coordination with hospice and palliative nursing teams",
      "Comfort-first personal hygiene and soothing hand massages"
    ],
    "supportedOptions": [
      "12H Day Comfort Care",
      "12H Night Comfort Vigil",
      "24H Continuous Palliative Support"
    ]
  },
  {
    "id": "srv-33",
    "slug": "respite-care-family-relief",
    "name": "Weekend Respite Care Family Relief Attendant",
    "category": "CARETAKER",
    "categoryLabel": "Caretakers & Assistants",
    "shortDesc": "Temporary weekend or evening coverage giving family caregivers a well-deserved break.",
    "description": "Give primary family caregivers time to recharge, travel, or attend events. Our vetted attendants take over full patient care responsibilities seamlessly.",
    "image": "/assets/chatgpt-card-10.webp",
    "basePrice": 135,
    "duration": "12 Hours or Weekend Block",
    "features": [
      "Full handoff briefing from family before coverage starts",
      "Complete handling of meals, hygiene, walking, and medications",
      "Hourly updates and photos sent to family via messaging",
      "Emergency contacts verified with local dispatch desk",
      "Available for weekends, holidays, and evening events"
    ],
    "supportedOptions": [
      "Single Day Respite Shift",
      "48-Hour Weekend Relief Block",
      "Holiday Coverage Plan"
    ]
  },
  {
    "id": "srv-4",
    "slug": "home-lab-investigations",
    "name": "Home Lab Investigations",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "Painless sample collection at home with digital reports within 12 to 24 hours.",
    "description": "NABL-accredited laboratory diagnostics delivered to your doorstep. Certified phlebotomists collect blood, urine, or swab samples using vacuum sterile barcoded vials with cold-chain transport.",
    "image": "/assets/chatgpt-card-7.webp",
    "basePrice": 35,
    "duration": "15 mins sample collection",
    "features": [
      "Certified phlebotomist home visit",
      "Painless vacutainer blood collection",
      "Cold-chain transport directly to accredited labs",
      "Digital PDF report delivered via app and email within 12 hours",
      "Free doctor tele-review on abnormal test results"
    ],
    "supportedOptions": [
      "Comprehensive Full Body Health Checkup",
      "Complete Blood Count (CBC) & ESR",
      "Diabetic Profile (HbA1c & Fasting Glucose)",
      "Lipid & Cardiac Risk Profile",
      "Liver & Kidney Function Panel",
      "Thyroid Hormone Panel (T3, T4, TSH)"
    ]
  },
  {
    "id": "srv-34",
    "slug": "full-body-health-checkup-panel",
    "name": "Comprehensive Full Body Platinum Health Checkup",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "78 key parameters: CBC, Liver, Kidney, Lipid, Sugar, Thyroid, and Vitamins.",
    "description": "Complete diagnostic screening at home. Tests liver enzymes, renal function, heart lipids, fasting blood sugar, thyroid hormones, vitamin D, and B12 with a single morning blood draw.",
    "image": "/assets/chatgpt-card-7.webp",
    "basePrice": 85,
    "duration": "20 mins sample collection",
    "features": [
      "Complete Hemogram (24 blood parameters)",
      "Liver Function Panel (LFT - 11 markers)",
      "Kidney Function Panel (KFT - Creatinine, Urea, Uric Acid)",
      "Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)",
      "Vitamin D3 & Vitamin B12 levels + Doctor Report Review"
    ],
    "supportedOptions": [
      "Platinum Full Body (78 Tests)",
      "Gold Wellness (60 Tests)",
      "Senior Health Panel (85 Tests)"
    ]
  },
  {
    "id": "srv-35",
    "slug": "diabetic-monitoring-hba1c-panel",
    "name": "Diabetic Health & HbA1c Quarterly Monitoring Panel",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "HbA1c 3-month sugar average, fasting glucose, urine microalbumin & kidney check.",
    "description": "Essential quarterly blood tests for diabetic patients. Measures average blood sugar over 90 days (HbA1c), fasting insulin, and checks for early kidney protein leakage.",
    "image": "/assets/chatgpt-card-7.webp",
    "basePrice": 45,
    "duration": "15 mins",
    "features": [
      "HbA1c Glycated Hemoglobin (NGSP certified)",
      "Fasting Blood Glucose & Post-Prandial Glucose",
      "Urine Microalbumin / Creatinine Ratio (UACR)",
      "Serum Creatinine & Estimated GFR calculation",
      "Comparative historical trend report on patient portal"
    ],
    "supportedOptions": [
      "Standard HbA1c Panel",
      "Comprehensive Diabetic Health Panel",
      "Diabetic Annual Kidney Audit"
    ]
  },
  {
    "id": "srv-36",
    "slug": "lipid-profile-cardiac-panel",
    "name": "Cardiac Risk Profile & Advanced Lipid Blood Panel",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "Cholesterol, Triglycerides, HDL, LDL, VLDL, and High-Sensitivity CRP.",
    "description": "Evaluate cardiovascular risk from home. Measures good vs bad cholesterol, total lipid ratios, and systemic inflammatory markers (hs-CRP) that predict arterial plaque.",
    "image": "/assets/chatgpt-card-7.webp",
    "basePrice": 55,
    "duration": "15 mins",
    "features": [
      "Total Cholesterol, Triglycerides & HDL Good Cholesterol",
      "Direct LDL Bad Cholesterol & Non-HDL calculations",
      "High-Sensitivity C-Reactive Protein (hs-CRP) inflammation test",
      "Cardiac risk ratio computation",
      "Cold-chain transport with same-day digital result"
    ],
    "supportedOptions": [
      "Standard Lipid Profile",
      "Advanced Cardiac Risk Panel (hs-CRP + Lipids)",
      "Post-Heart Attack Follow-up Panel"
    ]
  },
  {
    "id": "srv-37",
    "slug": "kidney-function-test-kft",
    "name": "Kidney Function Test (KFT / RFT) Home Collection",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "Serum Creatinine, Blood Urea Nitrogen, Uric Acid, and Electrolytes.",
    "description": "Monitors renal clearance and electrolyte balance. Essential for patients taking blood pressure medications, diuretics, or managing chronic kidney disease.",
    "image": "/assets/chatgpt-card-7.webp",
    "basePrice": 48,
    "duration": "15 mins",
    "features": [
      "Serum Creatinine & Estimated Glomerular Filtration Rate (eGFR)",
      "Blood Urea Nitrogen (BUN) & BUN/Creatinine ratio",
      "Serum Electrolytes (Sodium, Potassium, Chloride)",
      "Serum Uric Acid level (gout screening)",
      "Automated email notification when report is validated"
    ],
    "supportedOptions": [
      "Complete KFT with Electrolytes",
      "Basic Renal Panel",
      "Dialysis Pre/Post Chemistry Panel"
    ]
  },
  {
    "id": "srv-38",
    "slug": "liver-function-test-lft",
    "name": "Liver Function Panel (LFT) & Bilirubin Blood Test",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "SGOT, SGPT, Bilirubin (Total & Direct), Alkaline Phosphatase, and Proteins.",
    "description": "Evaluates liver cellular health, bile duct patency, and synthetic protein production. Ideal for medication toxicity monitoring or gastrointestinal evaluations.",
    "image": "/assets/chatgpt-card-7.webp",
    "basePrice": 48,
    "duration": "15 mins",
    "features": [
      "SGPT (ALT) & SGOT (AST) liver enzyme assays",
      "Total, Direct, and Indirect Serum Bilirubin",
      "Alkaline Phosphatase (ALP) & Gamma-GT",
      "Total Serum Protein, Albumin, and Globulin ratio",
      "Digital report with color-coded high/low reference ranges"
    ],
    "supportedOptions": [
      "Complete LFT Panel",
      "Liver Enzymes Express Panel",
      "Viral Hepatitis + LFT Screening"
    ]
  },
  {
    "id": "srv-39",
    "slug": "thyroid-profile-tsh-panel",
    "name": "Thyroid Hormone Profile (Total T3, Total T4, TSH)",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "High-sensitivity TSH, Total T3, and Total T4 for metabolism and thyroid disorders.",
    "description": "Check for hypothyroidism or hyperthyroidism from home. Measures pituitary stimulating hormone and active circulating thyroid hormones with high precision chemiluminescence.",
    "image": "/assets/chatgpt-card-7.webp",
    "basePrice": 42,
    "duration": "15 mins",
    "features": [
      "Ultrasensitive Thyroid Stimulating Hormone (TSH 3rd Gen)",
      "Total Triiodothyronine (T3) & Total Thyroxine (T4)",
      "Levothyroxine dosage monitoring guidance",
      "Sample collected in clot-activator sterile gold-top vial",
      "Results delivered within 12 hours of collection"
    ],
    "supportedOptions": [
      "Complete Thyroid Profile (T3, T4, TSH)",
      "TSH Monitoring Test Only",
      "Free T3 & Free T4 Advanced Panel"
    ]
  },
  {
    "id": "srv-40",
    "slug": "senior-vitamin-d-b12-panel",
    "name": "Vitamin D3 & Vitamin B12 Deficiency Home Panel",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "25-Hydroxy Vitamin D and Active B12 for fatigue, bone health, and neuropathy.",
    "description": "Address chronic tiredness, body aches, and numbness. Evaluates vitamin D for bone calcium absorption and B12 for nerve myelination and red blood cell production.",
    "image": "/assets/chatgpt-card-7.webp",
    "basePrice": 65,
    "duration": "15 mins",
    "features": [
      "25-Hydroxy Vitamin D total assay (D2 + D3)",
      "Serum Vitamin B12 Cyanocobalamin level",
      "Bone density risk assessment correlation",
      "Oral vs injectable supplement recommendations in report",
      "Free telephone review with medical team"
    ],
    "supportedOptions": [
      "Vitamin D + B12 Combo",
      "Vitamin D Test Only",
      "Vitamin B12 Test Only"
    ]
  },
  {
    "id": "srv-41",
    "slug": "doorstep-vaccination-service",
    "name": "Doorstep Adult & Pediatric Vaccination Service",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "In-home administration of Flu, Pneumococcal, Shingles, and Hepatitis vaccines.",
    "description": "Stay immunized without clinic exposure. Certified nurses bring cold-chain stored vaccines to your home, administer the shot safely, and observe for 15 minutes post-vaccination.",
    "image": "/assets/chatgpt-card-9.webp",
    "basePrice": 60,
    "duration": "30 mins",
    "features": [
      "Certified nurse home visit with portable vaccine cold-box (2-8°C)",
      "Pre-vaccine vitals, allergy screening, and consent verification",
      "Painless intramuscular or subcutaneous injection technique",
      "15-minute post-vaccination adverse reaction observation",
      "Digital vaccination card and state registry documentation"
    ],
    "supportedOptions": [
      "Influenza (Flu Quadrivalent) Vaccine",
      "Pneumococcal (Pneumonia) Vaccine",
      "Shingles (Herpes Zoster) Vaccine",
      "Hepatitis B Booster"
    ]
  },
  {
    "id": "srv-42",
    "slug": "home-12-lead-digital-ecg",
    "name": "12-Lead Digital ECG at Home with Cardiologist Report",
    "category": "LAB_TESTS",
    "categoryLabel": "Diagnostic Tests",
    "shortDesc": "Hospital-grade bedside resting electrocardiogram with tele-cardiologist review.",
    "description": "A trained technician brings a portable digital 12-lead electrocardiograph machine directly to your living room. The tracing is interpreted by a senior board cardiologist within 60 minutes.",
    "image": "/assets/chatgpt-card-7.webp",
    "basePrice": 70,
    "duration": "30 mins",
    "features": [
      "Full 12-lead standard resting electrocardiogram",
      "Painless limb clamp and chest bulb electrode placement",
      "Immediate digital waveform transmission to cardiology review desk",
      "Cardiologist signed formal interpretation report within 1 hour",
      "Urgent alert if signs of acute ischemia or arrhythmia are detected"
    ],
    "supportedOptions": [
      "Standard 12-Lead ECG Visit",
      "Pre-Operative Clearance ECG",
      "Serial ECG 3-Pack (for Arrhythmias)"
    ]
  },
  {
    "id": "srv-5",
    "slug": "home-physiotherapy",
    "name": "Home Physiotherapy & Rehabilitation",
    "category": "REHAB_THERAPY",
    "categoryLabel": "Physical Therapy & Rehab",
    "shortDesc": "Expert physical therapy for stroke recovery, joint replacement, and mobility restoration.",
    "description": "Certified physical therapists bring customized orthopedic, neurological, and geriatric rehabilitation directly to your living room. Accelerate recovery with guided neuromuscular stimulation and gait training.",
    "image": "/assets/chatgpt-card-6.webp",
    "basePrice": 60,
    "duration": "50 - 60 mins",
    "features": [
      "Personalized mobility assessment and joint range of motion",
      "Post-total-knee/hip-replacement protocol exercises",
      "Stroke paralysis rehabilitation & balance retraining",
      "Pain management with portable TENS & ultrasound units",
      "Digital exercise compliance chart for treating surgeon"
    ],
    "supportedOptions": [
      "Single Targeted Physiotherapy Session",
      "5-Session Mobility Rehabilitation Pack",
      "10-Session Comprehensive Post-Op Package",
      "Elderly Fall-Prevention Conditioning"
    ]
  },
  {
    "id": "srv-6",
    "slug": "critical-care-icu-setup",
    "name": "Critical Care & ICU Step-Down Setup",
    "category": "CRITICAL_CARE",
    "categoryLabel": "Critical Care & Monitoring",
    "shortDesc": "Advanced home ICU installation with multipara monitors, oxygen, and continuous critical care nursing.",
    "description": "Transition hospitalized patients safely home. Complete ICU infrastructure including hospital-grade electric beds, continuous vitals monitoring, oxygen concentrators, and 24/7 dedicated critical care nurses supervised by intensivists.",
    "image": "/assets/chatgpt-card-2.webp",
    "basePrice": 180,
    "duration": "12-Hour or 24-Hour Continuous Care",
    "features": [
      "Certified ICU trained registered nurse stationed at bedside",
      "Multipara monitor (SpO2, continuous ECG, NIBP, respiration)",
      "Medical oxygen concentrator & suction machine setup",
      "BiPAP / CPAP / tracheostomy tube management protocols",
      "24/7 tele-intensivist emergency video consultation backup"
    ],
    "supportedOptions": [
      "12-Hour ICU Step-Down Nursing Shift",
      "24-Hour Intensive Care Continuous Package",
      "Complete Home ICU Equipment Suite Rental",
      "Palliative & Comfort Care ICU Protocol"
    ]
  }
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

const initialProviderApplications: ProviderApplicationRecord[] = [
  {
    id: 'app-1',
    userId: 'doc-michael-chen',
    fullName: 'Dr. Michael Chen',
    email: 'm.chen@example.com',
    phone: '+1 (555) 789-0123',
    role: 'DOCTOR',
    state: 'California',
    city: 'San Francisco',
    serviceLocations: ['San Francisco', 'Oakland', 'Berkeley'],
    qualification: 'MD (Internal Medicine & Preventive Care)',
    experienceYears: 15,
    licenseNumber: 'MD-CA-981240',
    registrationCouncil: 'Medical Board of California',
    specialty: 'Family Medicine & Geriatrics',
    documents: [
      {
        id: 'doc-mc-1',
        title: 'California_State_Medical_Board_License.pdf',
        type: 'Medical Council License',
        size: '2.4 MB',
        status: 'VALID',
        uploadedAt: '2026-11-13T10:15:00Z',
      },
      {
        id: 'doc-mc-2',
        title: 'Medical_Malpractice_Insurance_COI.pdf',
        type: 'Malpractice Insurance',
        size: '1.8 MB',
        status: 'VALID',
        uploadedAt: '2026-11-13T10:18:00Z',
      },
      {
        id: 'doc-mc-3',
        title: 'DEA_Controlled_Substance_Reg.pdf',
        type: 'DEA Registration',
        size: '1.1 MB',
        status: 'VALID',
        uploadedAt: '2026-11-13T10:20:00Z',
      },
    ],
    status: 'UNDER_REVIEW',
    adminNotes: 'Primary source verification submitted to Medical Board of California portal. All 3 certificates valid.',
    appliedAt: '2026-11-13T10:25:00Z',
  },
  {
    id: 'app-2',
    userId: 'nurse-jessica-vance',
    fullName: 'Jessica Vance, RN',
    email: 'jessica.rn@example.com',
    phone: '+1 (555) 890-1234',
    role: 'NURSE',
    state: 'California',
    city: 'San Jose',
    serviceLocations: ['San Jose', 'Sunnyvale', 'Santa Clara'],
    qualification: 'BSN, RN (Pediatric & Infusion Therapy)',
    experienceYears: 7,
    licenseNumber: 'RN-CA-442190',
    registrationCouncil: 'California Board of Registered Nursing',
    specialty: 'Pediatric & Home Infusion Care',
    documents: [
      {
        id: 'doc-jv-1',
        title: 'RN_Board_of_Registered_Nursing_Cert.pdf',
        type: 'Nursing Council License',
        size: '1.9 MB',
        status: 'VALID',
        uploadedAt: '2026-11-12T14:00:00Z',
      },
      {
        id: 'doc-jv-2',
        title: 'AHA_BLS_ACLS_Certification.pdf',
        type: 'CPR / BLS / ACLS Certification',
        size: '940 KB',
        status: 'VALID',
        uploadedAt: '2026-11-12T14:05:00Z',
      },
    ],
    status: 'SUBMITTED',
    adminNotes: 'Awaiting secondary supervisor reference check verification.',
    appliedAt: '2026-11-12T14:10:00Z',
  },
  {
    id: 'app-3',
    userId: 'pt-rajesh',
    fullName: 'Rajesh Sharma, PT',
    email: 'rajesh.pt@example.com',
    phone: '+1 (555) 901-2345',
    role: 'PHYSIOTHERAPIST',
    state: 'California',
    city: 'San Francisco',
    serviceLocations: ['San Francisco', 'Daly City'],
    qualification: 'MPT (Neuro-Physiotherapy & Musculoskeletal)',
    experienceYears: 10,
    licenseNumber: 'PT-CA-771234',
    registrationCouncil: 'Physical Therapy Board of California',
    specialty: 'Stroke & Post-Op Joint Mobility',
    documents: [
      {
        id: 'doc-rs-1',
        title: 'PTBC_State_Physical_Therapy_License.pdf',
        type: 'PT License',
        size: '2.1 MB',
        status: 'VALID',
        uploadedAt: '2026-11-10T09:00:00Z',
      },
    ],
    status: 'APPROVED',
    adminNotes: 'License verified via DCA BreEZe portal. Full clearance granted.',
    reviewedBy: 'Dr. Sarah Lin (Chief Medical Officer)',
    reviewedAt: '2026-11-11T11:00:00Z',
    appliedAt: '2026-11-10T09:15:00Z',
  },
  {
    id: 'app-4',
    userId: 'phleb-priya',
    fullName: 'Priya Nair, CPT',
    email: 'priya.cpt@example.com',
    phone: '+1 (555) 012-3456',
    role: 'PHLEBOTOMIST',
    state: 'California',
    city: 'Oakland',
    serviceLocations: ['Oakland', 'Alameda', 'San Leandro'],
    qualification: 'Certified Phlebotomy Technician I (CPT-1)',
    experienceYears: 6,
    licenseNumber: 'CPT-CA-338901',
    registrationCouncil: 'California Department of Public Health (LFS)',
    specialty: 'Sterile Pediatric & Geriatric Venipuncture',
    documents: [
      {
        id: 'doc-pn-1',
        title: 'CDPH_LFS_Phlebotomy_Certificate.pdf',
        type: 'State Phlebotomy Certification',
        size: '1.4 MB',
        status: 'VALID',
        uploadedAt: '2026-11-14T11:30:00Z',
      },
    ],
    status: 'SUBMITTED',
    appliedAt: '2026-11-14T11:45:00Z',
  },
  {
    id: 'app-5',
    userId: 'care-ramesh',
    fullName: 'Ramesh Patel',
    email: 'ramesh.care@example.com',
    phone: '+1 (555) 123-4567',
    role: 'CARETAKER',
    state: 'California',
    city: 'San Francisco',
    serviceLocations: ['San Francisco', 'South San Francisco'],
    qualification: 'Certified Home Health Aide (CHHA) & Geriatric Care',
    experienceYears: 8,
    specialty: 'Bedside Dementia Care & Mobility Support',
    documents: [
      {
        id: 'doc-rp-1',
        title: 'CHHA_State_Certification.pdf',
        type: 'Caregiver Certification',
        size: '1.2 MB',
        status: 'VALID',
        uploadedAt: '2026-11-09T08:00:00Z',
      },
      {
        id: 'doc-rp-2',
        title: 'LiveScan_DOJ_FBI_Background_Clearance.pdf',
        type: 'Background Clearance',
        size: '980 KB',
        status: 'VALID',
        uploadedAt: '2026-11-09T08:05:00Z',
      },
    ],
    status: 'APPROVED',
    reviewedBy: 'Admin Team',
    reviewedAt: '2026-11-10T10:00:00Z',
    appliedAt: '2026-11-09T08:15:00Z',
  },
];

const initialProviderShifts: ProviderShiftRecord[] = [
  { id: 'sh-1', providerId: 'doc-1', dayOfWeek: 1, dayName: 'Monday', startTime: '08:00', endTime: '18:00', isActive: true, maxVisitsPerDay: 6, serviceZones: ['San Francisco', 'South San Francisco'] },
  { id: 'sh-2', providerId: 'doc-1', dayOfWeek: 2, dayName: 'Tuesday', startTime: '08:00', endTime: '18:00', isActive: true, maxVisitsPerDay: 6, serviceZones: ['San Francisco', 'Daly City'] },
  { id: 'sh-3', providerId: 'doc-1', dayOfWeek: 3, dayName: 'Wednesday', startTime: '08:00', endTime: '18:00', isActive: true, maxVisitsPerDay: 6, serviceZones: ['San Francisco'] },
  { id: 'sh-4', providerId: 'doc-1', dayOfWeek: 4, dayName: 'Thursday', startTime: '08:00', endTime: '18:00', isActive: true, maxVisitsPerDay: 6, serviceZones: ['San Francisco', 'Oakland'] },
  { id: 'sh-5', providerId: 'doc-1', dayOfWeek: 5, dayName: 'Friday', startTime: '08:00', endTime: '16:00', isActive: true, maxVisitsPerDay: 5, serviceZones: ['San Francisco'] },
  { id: 'sh-6', providerId: 'doc-1', dayOfWeek: 6, dayName: 'Saturday', startTime: '09:00', endTime: '14:00', isActive: false, maxVisitsPerDay: 3, serviceZones: ['San Francisco'] },
  { id: 'sh-7', providerId: 'doc-1', dayOfWeek: 0, dayName: 'Sunday', startTime: '09:00', endTime: '14:00', isActive: false, maxVisitsPerDay: 3, serviceZones: ['San Francisco'] },
];

const initialJobOffers: JobOfferRecord[] = [
  {
    id: 'off-1',
    bookingId: 'bkg-101',
    providerId: 'doc-1',
    serviceName: 'Home Visit Doctor Consultations',
    scheduledDate: '2026-11-15',
    scheduledTimeSlot: '10:00 AM – 11:00 AM',
    addressArea: '742 Evergreen Terrace, Springfield, OR',
    estimatedFee: 85,
    status: 'ACCEPTED',
    offeredAt: '2026-11-14T09:00:00Z',
  },
  {
    id: 'off-2',
    bookingId: 'bkg-102',
    providerId: 'doc-1',
    serviceName: 'Acute Illness Bedside Evaluation',
    scheduledDate: '2026-11-16',
    scheduledTimeSlot: '02:00 PM – 03:00 PM',
    addressArea: 'Mission District, San Francisco, CA',
    estimatedFee: 95,
    status: 'OFFERED',
    offeredAt: '2026-11-15T08:30:00Z',
  },
  {
    id: 'off-3',
    bookingId: 'bkg-103',
    providerId: 'doc-1',
    serviceName: 'Geriatric Comprehensive Routine Follow-up',
    scheduledDate: '2026-11-17',
    scheduledTimeSlot: '11:00 AM – 12:00 PM',
    addressArea: 'Pacific Heights, San Francisco, CA',
    estimatedFee: 110,
    status: 'OFFERED',
    offeredAt: '2026-11-15T09:00:00Z',
  },
];

const initialClinicalNotes: ClinicalNoteRecord[] = [
  {
    id: 'cn-1',
    bookingId: 'bkg-101',
    patientId: 'pat-1',
    patientName: 'Eleanor Vance',
    providerId: 'doc-1',
    providerName: 'Dr. Maya Patel',
    providerRole: 'DOCTOR',
    title: 'Comprehensive Bedside Clinical Assessment',
    summary: 'Patient evaluated bedside for routine geriatric health optimization. Blood pressure well managed on current regimen.',
    observations: 'Patient alert and oriented x4. Chest clear to auscultation bilaterally. No pedal edema noted.',
    tasksCompleted: ['Full vitals triage', 'Physical examination', 'Polypharmacy review', 'Digital prescription issued'],
    vitalsRecorded: { bp: '120/78 mmHg', pulse: 72, spo2: 98, temp: 98.4 },
    createdAt: '2026-11-15T11:15:00Z',
  },
];

// In-Memory Data Store with LocalStorage synchronization
class DataStore {
  private users: UserRecord[] = [...initialUsers];
  private services: ServiceRecord[] = initialServices;
  private bookings: BookingRecord[] = initialBookings;
  private prescriptions: PrescriptionRecord[] = initialPrescriptions;
  private vitals: VitalsRecord[] = initialVitals;
  private labReports: LabReportRecord[] = initialLabReports;
  private familyMembers: FamilyMemberRecord[] = initialFamilyMembers;
  private addresses: AddressRecord[] = initialAddresses;
  private payouts: PayoutRecord[] = initialPayouts;
  private notifications: NotificationRecord[] = initialNotifications;
  private providerApplications: ProviderApplicationRecord[] = initialProviderApplications;
  private providerShifts: ProviderShiftRecord[] = initialProviderShifts;
  private jobOffers: JobOfferRecord[] = initialJobOffers;
  private clinicalNotes: ClinicalNoteRecord[] = initialClinicalNotes;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('vellora_custom_users');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            parsed.forEach((customU: UserRecord) => {
              const existingIdx = this.users.findIndex(
                (u) => u.id === customU.id || (customU.email && u.email && u.email.toLowerCase() === customU.email.toLowerCase())
              );
              if (existingIdx !== -1) {
                this.users[existingIdx] = { ...this.users[existingIdx], ...customU };
              } else {
                this.users.unshift(customU);
              }
            });
          }
        }
      } catch {}
    }
  }

  // Users
  getUsers() { return this.users; }
  getUserById(id: string) { return this.users.find(u => u.id === id); }
  getUsersByRole(role: string) { return this.users.filter(u => u.role === role); }
  getDoctorBySlugOrId(identifier: string): UserRecord | undefined {
    if (!identifier) return undefined;
    const docs = this.getUsersByRole('DOCTOR');
    const clean = identifier.toLowerCase().replace(/^dr-?/, '').replace(/[^a-z0-9]/g, '');
    return docs.find(d => {
      if (d.id.toLowerCase() === identifier.toLowerCase()) return true;
      const docClean = d.name.toLowerCase().replace(/^dr\.?\s*/, '').replace(/[^a-z0-9]/g, '');
      return docClean === clean || d.name.toLowerCase() === identifier.toLowerCase();
    });
  }
  updateUser(id: string, updates: Partial<UserRecord>) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      if (typeof window !== 'undefined') {
        try {
          const customUsers = this.users.filter(
            (u) => u.id !== 'pat-1' && !u.id.startsWith('doc-') && !u.id.startsWith('nurse-') && u.id !== 'admin-1'
          );
          localStorage.setItem('vellora_custom_users', JSON.stringify(customUsers));
        } catch {}
      }
      return this.users[idx];
    }
    return null;
  }
  createUser(data: Partial<UserRecord>): UserRecord {
    const newUser: UserRecord = {
      id: data.id || `pat-${Date.now().toString().slice(-6)}`,
      name: data.name || 'New Patient',
      email: data.email || '',
      phone: data.phone || '',
      role: data.role || 'PATIENT',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      verificationStatus: 'APPROVED',
      rating: 5.0,
      ...data,
    };
    const idx = this.users.findIndex((u) => u.id === newUser.id);
    if (idx !== -1) {
      this.users[idx] = newUser;
    } else {
      this.users.unshift(newUser);
    }
    if (typeof window !== 'undefined') {
      try {
        const customUsers = this.users.filter(
          (u) => u.id !== 'pat-1' && !u.id.startsWith('doc-') && !u.id.startsWith('nurse-') && u.id !== 'admin-1'
        );
        localStorage.setItem('vellora_custom_users', JSON.stringify(customUsers));
      } catch {}
    }
    return newUser;
  }

  // Services
  getServices() { return this.services; }
  getServiceBySlug(slug: string) { return this.services.find(s => s.slug === slug); }
  getServiceById(id: string) { return this.services.find(s => s.id === id); }
  getServicesByCategory(category: string) { return this.services.filter(s => s.category === category); }
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
    const id = `bkg-${globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2)}`;
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
    const allowed: Record<BookingRecord['status'], BookingRecord['status'][]> = {
      REQUESTED: ['CONFIRMED', 'ASSIGNED', 'CANCELLED'], CONFIRMED: ['ASSIGNED', 'CANCELLED'],
      ASSIGNED: ['ON_THE_WAY', 'CANCELLED'], ON_THE_WAY: ['ARRIVED', 'CANCELLED'],
      ARRIVED: ['IN_PROGRESS', 'CANCELLED'], IN_PROGRESS: ['COMPLETED', 'CANCELLED'], COMPLETED: [], CANCELLED: [],
    };
    if (booking && (booking.status === status || allowed[booking.status].includes(status))) {
      booking.status = status;
      if (note) booking.notes = note;
      return booking;
    }
    return null;
  }
  assignProvider(bookingId: string, providerId: string, allowReassignment = false) {
    const booking = this.getBookingById(bookingId);
    const provider = this.getUserById(providerId);
    const eligibleRoles: Record<string, string> = { DOCTOR_VISIT: 'DOCTOR', NURSING_CARE: 'NURSE', CARETAKER: 'CARETAKER', LAB_TESTS: 'PHLEBOTOMIST', PHYSIOTHERAPY: 'PHYSIOTHERAPIST' };
    if (booking && provider && provider.verificationStatus === 'APPROVED' && (!eligibleRoles[booking.category] || eligibleRoles[booking.category] === provider.role) && !['CANCELLED', 'COMPLETED'].includes(booking.status) && (!booking.providerId || booking.providerId === providerId || allowReassignment)) {
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

  // Provider Applications & Onboarding
  getProviderApplications() {
    return this.providerApplications;
  }
  getProviderApplicationById(id: string) {
    return this.providerApplications.find(a => a.id === id);
  }
  getProviderApplicationByEmail(email: string) {
    const clean = email.trim().toLowerCase();
    return this.providerApplications.find(a => a.email.toLowerCase() === clean);
  }
  createProviderApplication(data: Omit<ProviderApplicationRecord, 'id' | 'appliedAt' | 'status'> & { status?: ProviderApplicationRecord['status'] }) {
    const newApp: ProviderApplicationRecord = {
      ...data,
      id: `app-${Date.now().toString().slice(-6)}`,
      status: data.status || 'SUBMITTED',
      appliedAt: new Date().toISOString(),
    };
    this.providerApplications.unshift(newApp);

    // Also register or sync UserRecord in PENDING verification status
    let user = this.users.find(u => u.email.toLowerCase() === newApp.email.toLowerCase());
    if (!user) {
      this.createUser({
        name: newApp.fullName,
        email: newApp.email,
        phone: newApp.phone,
        role: newApp.role,
        verificationStatus: 'PENDING',
        specialty: newApp.specialty,
        qualification: newApp.qualification,
        experienceYears: newApp.experienceYears,
        licenseNumber: newApp.licenseNumber,
        registrationCouncil: newApp.registrationCouncil,
        serviceLocations: newApp.serviceLocations,
        isOnline: false,
      });
    }

    return newApp;
  }
  updateProviderApplication(id: string, updates: Partial<ProviderApplicationRecord>) {
    const idx = this.providerApplications.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.providerApplications[idx] = { ...this.providerApplications[idx], ...updates };

      // If approved, update associated user to APPROVED status
      if (updates.status === 'APPROVED') {
        const app = this.providerApplications[idx];
        const user = this.users.find(u => u.email.toLowerCase() === app.email.toLowerCase());
        if (user) {
          user.verificationStatus = 'APPROVED';
          user.role = app.role;
          if (app.specialty) user.specialty = app.specialty;
          if (app.qualification) user.qualification = app.qualification;
        }
      }

      return this.providerApplications[idx];
    }
    return null;
  }

  // Provider Availability & Shifts
  getProviderShifts(providerId: string): ProviderShiftRecord[] {
    const existing = this.providerShifts.filter(s => s.providerId === providerId);
    if (existing.length > 0) return existing;

    // Default template for new provider (Mon-Fri 08:00 - 18:00)
    const days = [
      { dayOfWeek: 1, dayName: 'Monday', active: true },
      { dayOfWeek: 2, dayName: 'Tuesday', active: true },
      { dayOfWeek: 3, dayName: 'Wednesday', active: true },
      { dayOfWeek: 4, dayName: 'Thursday', active: true },
      { dayOfWeek: 5, dayName: 'Friday', active: true },
      { dayOfWeek: 6, dayName: 'Saturday', active: false },
      { dayOfWeek: 0, dayName: 'Sunday', active: false },
    ];
    const generated: ProviderShiftRecord[] = days.map((d, i) => ({
      id: `sh-${providerId}-${i}`,
      providerId,
      dayOfWeek: d.dayOfWeek,
      dayName: d.dayName,
      startTime: '08:00',
      endTime: '18:00',
      isActive: d.active,
      maxVisitsPerDay: 5,
      serviceZones: ['Metro Central', 'South Area'],
    }));
    this.providerShifts.push(...generated);
    return generated;
  }
  setProviderShifts(providerId: string, shifts: ProviderShiftRecord[]) {
    this.providerShifts = this.providerShifts.filter(s => s.providerId !== providerId);
    this.providerShifts.push(...shifts);
    return shifts;
  }

  // Job Offers / Dispatch Matching
  getJobOffers(providerId: string) {
    return this.jobOffers.filter(o => o.providerId === providerId);
  }
  createJobOffer(offer: Omit<JobOfferRecord, 'id' | 'offeredAt'>) {
    const newOffer: JobOfferRecord = {
      ...offer,
      id: `off-${Date.now().toString().slice(-6)}`,
      offeredAt: new Date().toISOString(),
    };
    this.jobOffers.unshift(newOffer);
    return newOffer;
  }
  respondToJobOffer(offerId: string, accept: boolean) {
    const offer = this.jobOffers.find(o => o.id === offerId);
    if (offer) {
      if (accept && !this.assignProvider(offer.bookingId, offer.providerId)) return null;
      offer.status = accept ? 'ACCEPTED' : 'DECLINED';
      return offer;
    }
    return null;
  }

  // Clinical Records / Documentation
  getClinicalNotes(filter?: { bookingId?: string; patientId?: string; providerId?: string }) {
    return this.clinicalNotes.filter(cn => {
      if (filter?.bookingId && cn.bookingId !== filter.bookingId) return false;
      if (filter?.patientId && cn.patientId !== filter.patientId) return false;
      if (filter?.providerId && cn.providerId !== filter.providerId) return false;
      return true;
    });
  }
  createClinicalNote(data: Omit<ClinicalNoteRecord, 'id' | 'createdAt'>) {
    const newNote: ClinicalNoteRecord = {
      ...data,
      id: `cn-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    this.clinicalNotes.unshift(newNote);
    return newNote;
  }
}

export const db = new DataStore();
