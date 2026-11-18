import { CoreServiceItem, UserProfile, PatientBooking, MedicalRecordItem, AssignedClinician, BookingStatus } from '../types';

export const REGIONAL_CONFIG = {
  countryCode: 'IN',
  currencySymbol: '₹',
  currencyCode: 'INR',
  locale: 'en-IN',
  defaultCity: 'Bengaluru',
  taxLabel: 'Healthcare GST (5%)',
  taxRate: 0.05,
  supportPhone: '+91 80 4910 8800',
  emergencyPhone: '112',
};

export const formatCurrency = (amount: number, symbol: string = REGIONAL_CONFIG.currencySymbol): string => {
  return `${symbol}${amount.toLocaleString('en-IN')}`;
};

export const DOCTOR_ROHAN: AssignedClinician = {
  id: 'doc-rohan',
  name: 'Dr. Rohan Mehta',
  title: 'Consultant Physician, MBBS, MD',
  specialty: 'Internal & Preventive Bedside Medicine',
  rating: 4.9,
  reviewCount: 1324,
  phone: '+91 98450 12345',
  avatar: require('../../assets/images/doctor-rohan.png'),
  hospitalAffiliation: 'Vellora Clinical Network, Koramangala',
  yearsExperience: 12,
};

// Aliased for backwards-compatibility with existing screens
export const DOCTOR_MAYA: AssignedClinician = DOCTOR_ROHAN;

export const CORE_SERVICES: CoreServiceItem[] = [
  {
    id: 'doctor-visit',
    number: '01',
    category: 'DOCTOR VISIT',
    title: 'Doctor Home Consultations',
    subtitle: 'Bedside diagnosis & digital e-prescriptions',
    description: 'Thorough bedside examination, illness diagnosis, and digital prescriptions in your home with zero waiting rooms.',
    priceStartingAt: 850,
    priceUnit: 'per consultation',
    features: [
      'Board-certified internal medicine physician',
      'Bedside physical examination & vitals check',
      'Immediate digital electronic prescription (e-Rx)',
      'Clinical referral & diagnostic triage',
    ],
    image: require('../../assets/images/doorstep-1.png'),
    iconName: 'medkit',
    clinicalTag: 'Clinician Dispatch',
  },
  {
    id: 'nursing-care',
    number: '02',
    category: 'NURSING CARE',
    title: 'At-Home Nursing Care',
    subtitle: 'Post-op recovery, IV infusions & vitals monitoring',
    description: 'Licensed nurses for wound dressing, injections, IV infusions, post-op vitals, and catheter care in the comfort of your room.',
    priceStartingAt: 1200,
    priceUnit: 'per 12h shift',
    durationOptions: ['12-Hour Day Shift', '12-Hour Night Shift', '24-Hour Continuous Care'],
    features: [
      'Registered nurse bedside administration',
      'Wound care, dressing & suture removal',
      'Continuous SpO2, BP & glucose tracking',
      'IV cannula, drip & catheter management',
    ],
    image: require('../../assets/images/doorstep-2.png'),
    iconName: 'heart',
    clinicalTag: 'Registered Nurse',
  },
  {
    id: 'caretakers',
    number: '03',
    category: 'CARETAKERS',
    title: 'Patient Caretakers & Attendants',
    subtitle: 'Compassionate elderly mobility & personal daily care',
    description: 'Trained attendants for daily living mobility, personal hygiene, feeding, and recovery support around the clock.',
    priceStartingAt: 800,
    priceUnit: 'per 12h shift',
    durationOptions: ['12-Hour Day Shift', '12-Hour Night Shift', '24-Hour Attendant'],
    features: [
      'Trained geriatric & post-surgery caregiver',
      'Bed-to-wheelchair transfers & gentle mobility',
      'Assistance with personal hygiene & bathing',
      'Meal assistance & timely medication reminder',
    ],
    image: require('../../assets/images/doorstep-3.png'),
    iconName: 'people',
    clinicalTag: 'Attendant Care',
  },
  {
    id: 'lab-tests',
    number: '04',
    category: 'LAB INVESTIGATIONS',
    title: 'Home Diagnostic Blood Tests',
    subtitle: 'Sterile doorstep collection & digital results in 12h',
    description: 'Certified phlebotomists collecting samples at your doorstep with sterile vacuum-sealed barcoded vials and cold-chain transport.',
    priceStartingAt: 650,
    priceUnit: 'per panel',
    features: [
      'Certified phlebotomist doorstep blood draw',
      'Sterile vacuum tubes with barcode tracking',
      'Temperature-monitored cold-chain transit',
      'Digital lab report with reference ranges in 12h',
    ],
    image: require('../../assets/images/doorstep-4.png'),
    iconName: 'flask',
    clinicalTag: 'Diagnostic Panel',
  },
];

export const CURRENT_PATIENT: UserProfile = {
  id: 'pat-1',
  name: 'Arjun Sharma',
  phone: '+91 98765 43210',
  email: 'arjun.sharma@example.in',
  role: 'PATIENT',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  dob: '1992-06-15',
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Sulfa Antibiotics'],
  chronicConditions: ['None Reported'],
  address: {
    street: '#502, Orchid Residency',
    city: 'Koramangala, Bengaluru',
    postalCode: '560034',
    landmark: 'Near Wipro Park',
  },
  emergencyContact: {
    name: 'Pooja Sharma',
    relationship: 'Spouse',
    phone: '+91 98765 43211',
  },
};

export const ACTIVE_IN_TRANSIT_BOOKING: PatientBooking = {
  id: 'bkg-8492',
  serviceId: 'doctor-visit',
  serviceTitle: 'Doctor Home Consultations',
  patientName: 'Arjun Sharma',
  patientRelationship: 'Self',
  patientAge: 34,
  status: 'IN_TRANSIT',
  scheduledDate: 'Today, 18 Nov',
  scheduledTimeSlot: '10:00 AM – 10:30 AM',
  urgency: 'STANDARD',
  totalPrice: 1043,
  securityPin: '4829', // Demonstration PIN from RFP benchmark
  address: '#502, Orchid Residency, Koramangala, Bengaluru – 560034',
  symptoms: 'Persistent dry cough, mild bronchial wheezing, blood pressure check',
  assignedClinician: DOCTOR_ROHAN,
  etaMinutes: 12,
  createdAt: '2026-11-18T09:30:00Z',
};

export const RECENT_BOOKINGS: PatientBooking[] = [
  ACTIVE_IN_TRANSIT_BOOKING,
  {
    id: 'bkg-8890',
    serviceId: 'nursing-care',
    serviceTitle: 'At-Home Nursing Care',
    patientName: 'Kavita Sharma',
    patientRelationship: 'Mother',
    patientAge: 68,
    status: 'CONFIRMED',
    scheduledDate: 'Tomorrow, 19 Nov',
    scheduledTimeSlot: '11:00 AM – 11:30 AM',
    urgency: 'STANDARD',
    totalPrice: 1418,
    securityPin: '7392',
    address: '#502, Orchid Residency, Koramangala, Bengaluru – 560034',
    symptoms: 'Post-op knee dressing & vitals check',
    createdAt: '2026-11-18T10:00:00Z',
  },
  {
    id: 'bkg-8104',
    serviceId: 'lab-tests',
    serviceTitle: 'Comprehensive Metabolic & CBC Panel',
    patientName: 'Arjun Sharma',
    patientRelationship: 'Self',
    patientAge: 34,
    status: 'COMPLETED',
    scheduledDate: '10 Nov 2026',
    scheduledTimeSlot: '8:00 AM – 9:00 AM',
    urgency: 'STANDARD',
    totalPrice: 650,
    securityPin: '3192',
    address: '#502, Orchid Residency, Koramangala, Bengaluru – 560034',
    symptoms: 'Routine annual diabetic & lipid profile monitoring',
    createdAt: '2026-11-09T18:00:00Z',
  },
  {
    id: 'bkg-7922',
    serviceId: 'nursing-care',
    serviceTitle: 'At-Home Nursing Care (12h Day Shift)',
    patientName: 'Kavita Sharma',
    patientRelationship: 'Mother',
    patientAge: 68,
    status: 'COMPLETED',
    scheduledDate: '02 Nov 2026',
    scheduledTimeSlot: '7:00 AM – 7:00 PM',
    urgency: 'STANDARD',
    totalPrice: 1200,
    securityPin: '7721',
    address: '#502, Orchid Residency, Koramangala, Bengaluru – 560034',
    symptoms: 'Post-op knee wound dressing & mobility vitals',
    shiftDuration: '12-Hour Day Shift',
    createdAt: '2026-11-01T20:00:00Z',
  },
  {
    id: 'bkg-7550',
    serviceId: 'caretakers',
    serviceTitle: 'Patient Caretakers & Attendants',
    patientName: 'Ramesh Sharma',
    patientRelationship: 'Father',
    patientAge: 72,
    status: 'CANCELLED',
    scheduledDate: '25 Oct 2026',
    scheduledTimeSlot: '9:00 AM – 5:00 PM',
    urgency: 'STANDARD',
    totalPrice: 800,
    securityPin: '5519',
    address: '#502, Orchid Residency, Koramangala, Bengaluru – 560034',
    symptoms: 'Elderly post-op mobility assistance',
    cancellationReason: 'Family schedule conflict; care rescheduled with local caregiver',
    createdAt: '2026-10-24T14:00:00Z',
  },
];

export const generateSecurePin = (): string => {
  // Demonstration PIN only. Real encounter verification requires a server.
  const pin = Math.floor(1000 + Math.random() * 9000);
  return pin.toString();
};

let bookingRevision = 0;
const bookingListeners = new Set<() => void>();
export const subscribeBookings = (listener: () => void) => {
  bookingListeners.add(listener);
  return () => { bookingListeners.delete(listener); };
};
export const getBookingRevision = () => bookingRevision;
const notifyBookings = () => {
  bookingRevision += 1;
  bookingListeners.forEach(listener => listener());
};

export const addBooking = (newBooking: PatientBooking): void => {
  RECENT_BOOKINGS.unshift(newBooking);
  notifyBookings();
};

export const getActiveBooking = (): PatientBooking | null => {
  return RECENT_BOOKINGS.find((b) => b.status !== 'COMPLETED' && b.status !== 'CANCELLED') || null;
};

export const getBookingById = (id: string): PatientBooking | undefined => {
  return RECENT_BOOKINGS.find((b) => b.id === id);
};

export const cancelBooking = (id: string, reason: string): boolean => {
  const bk = RECENT_BOOKINGS.find((b) => b.id === id);
  if (bk && !['CANCELLED', 'COMPLETED'].includes(bk.status) && reason.trim()) {
    bk.status = 'CANCELLED';
    bk.cancellationReason = reason;
    notifyBookings();
    return true;
  }
  return false;
};

export const rescheduleBooking = (id: string, newDate: string, newSlot: string): boolean => {
  const bk = RECENT_BOOKINGS.find((b) => b.id === id);
  if (bk && !['CANCELLED', 'COMPLETED'].includes(bk.status)) {
    bk.scheduledDate = newDate;
    bk.scheduledTimeSlot = newSlot;
    bk.rescheduledCount = (bk.rescheduledCount || 0) + 1;
    notifyBookings();
    return true;
  }
  return false;
};

export const updateBookingStatus = (id: string, status: BookingStatus): boolean => {
  const bk = RECENT_BOOKINGS.find((b) => b.id === id);
  if (bk) {
    bk.status = status;
    if (status === 'COMPLETED') {
      bk.completedAt = new Date().toLocaleTimeString();
    }
    notifyBookings();
    return true;
  }
  return false;
};

export interface PatientProfileSummary {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
}

export const PATIENT_PROFILES: PatientProfileSummary[] = [
  {
    id: 'pat-1',
    name: 'Arjun Sharma',
    relationship: 'Self',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
  },
  {
    id: 'fam-1',
    name: 'Kavita Sharma',
    relationship: 'Mother',
    age: 68,
    gender: 'Female',
    bloodGroup: 'B+',
  },
  {
    id: 'fam-2',
    name: 'Ramesh Sharma',
    relationship: 'Father',
    age: 72,
    gender: 'Male',
    bloodGroup: 'A+',
  },
  {
    id: 'fam-3',
    name: 'Pooja Sharma',
    relationship: 'Spouse',
    age: 34,
    gender: 'Female',
    bloodGroup: 'O+',
  },
];

export const MEDICAL_RECORDS: MedicalRecordItem[] = [
  {
    id: 'rec-lab-1',
    bookingId: 'bkg-8104',
    serviceTitle: 'Complete Blood Count (CBC) with Differential & Metabolic Panel',
    clinicianName: 'Dr. Marcus Vance, MD (Pathology)',
    clinicianRole: 'Senior Consultant Pathologist',
    registrationNumber: 'KMC-PATH-49210',
    facilityName: 'Metropolitan Central Diagnostics (NABL Accredited)',
    date: '10 Nov 2026',
    sampleCollectionTime: '10 Nov 2026, 07:30 AM (Bedside Phlebotomy)',
    verifiedAt: '10 Nov 2026, 02:15 PM',
    recordType: 'LAB_REPORT',
    patientId: 'pat-1',
    patientName: 'Arjun Sharma',
    patientRelationship: 'Self',
    summary: 'Hemoglobin and platelets within normal reference ranges. HbA1c shows borderline elevation indicative of pre-diabetes risk. Recommended dietary lifestyle modifications.',
    status: 'VERIFIED',
    vitals: {
      bloodPressure: '128/82 mmHg',
      heartRate: '72 bpm',
      oxygenSaturation: '98%',
      bloodGlucose: '96 mg/dL (Fasting)',
      temperature: '98.4 °F',
      notes: 'Rested 5 mins before venipuncture. Vitals baseline stable.',
    },
    labResults: [
      { parameter: 'Hemoglobin (Hb)', result: '14.2', unit: 'g/dL', referenceRange: '12.0 - 15.5', status: 'NORMAL', category: 'Hematology' },
      { parameter: 'White Blood Cell (WBC)', result: '6,800', unit: '/mcL', referenceRange: '4,500 - 11,000', status: 'NORMAL', category: 'Hematology' },
      { parameter: 'Platelet Count', result: '245,000', unit: '/mcL', referenceRange: '150,000 - 450,000', status: 'NORMAL', category: 'Hematology' },
      { parameter: 'Fasting Blood Glucose', result: '96', unit: 'mg/dL', referenceRange: '70 - 99', status: 'NORMAL', category: 'Biochemistry' },
      { parameter: 'HbA1c Glycated', result: '5.8', unit: '%', referenceRange: '< 5.7 (Normal)', status: 'HIGH', category: 'Biochemistry', interpretation: 'Borderline elevated (5.7 - 6.4% indicates pre-diabetes risk)' },
      { parameter: 'Serum Creatinine', result: '0.9', unit: 'mg/dL', referenceRange: '0.7 - 1.2', status: 'NORMAL', category: 'Renal Function' },
      { parameter: 'Total Cholesterol', result: '188', unit: 'mg/dL', referenceRange: '< 200', status: 'NORMAL', category: 'Lipid Profile' },
      { parameter: 'Serum Potassium (K+)', result: '3.3', unit: 'mEq/L', referenceRange: '3.5 - 5.1', status: 'LOW', category: 'Electrolytes', interpretation: 'Mild hypokalemia. Increase dietary potassium intake.' },
    ],
  },
  {
    id: 'rec-rx-1',
    bookingId: 'bkg-8492',
    serviceTitle: 'Physician Bedside Encounter & Digital e-Prescription',
    clinicianName: 'Dr. Rohan Mehta, MD',
    clinicianRole: 'Consultant General Physician',
    registrationNumber: 'KMC Reg # 84920',
    facilityName: 'Vellora Health Clinical Network',
    date: '28 Oct 2026',
    verifiedAt: '28 Oct 2026, 11:20 AM',
    recordType: 'PRESCRIPTION',
    patientId: 'pat-1',
    patientName: 'Arjun Sharma',
    patientRelationship: 'Self',
    chiefComplaint: 'Dry persistent cough for 4 days with nocturnal wheezing and throat irritation.',
    diagnosis: 'Acute Seasonal Bronchitis (ICD-10: J20.9)',
    summary: 'Seasonal acute bronchitis managed with bronchodilator inhaler and antitussive therapy. Clear lungs upon physical exam.',
    clinicalNotes: 'Chest auscultation reveals mild bilateral expiratory wheezes, no focal consolidation. Heart sounds normal. Prescribed bronchodilator and symptomatic cough suppressant.',
    followUp: 'Review in 7 days if symptoms do not improve or if fever develops.',
    status: 'ACTIVE',
    medications: [
      {
        name: 'Albuterol Inhaler (Ventolin HFA)',
        form: 'Inhalation Aerosol',
        strength: '90 mcg/actuation',
        dosage: '2 Puffs',
        route: 'Inhalation',
        frequency: 'Every 4–6 hours PRN for wheezing',
        duration: '14 Days',
        instructions: 'Shake well before inhalation. Rinse mouth with lukewarm water after each use.',
        warnings: 'Do not exceed 8 puffs in a 24-hour window. Seek immediate care if dyspnea worsens.',
      },
      {
        name: 'Benzonatate (Tessalon Perles)',
        form: 'Softgel Capsule',
        strength: '100 mg',
        dosage: '1 Capsule',
        route: 'Oral',
        frequency: 'Three times daily (TDS)',
        duration: '7 Days',
        instructions: 'Swallow whole with plenty of water. Do not chew, dissolve, or crush capsule.',
        warnings: 'May cause mild drowsiness. Avoid operating heavy machinery if feeling dizzy.',
      },
      {
        name: 'Amoxicillin + Clavulanate (Augmentin)',
        form: 'Film-coated Tablet',
        strength: '625 mg',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Twice daily after food (BD)',
        duration: '5 Days',
        instructions: 'Take immediately after food with water. Complete full course.',
        warnings: 'Do not discontinue early. Report any severe rash or gastrointestinal distress.',
      },
    ],
  },
  {
    id: 'rec-vit-1',
    bookingId: 'bkg-7922',
    serviceTitle: 'Skilled Nursing Routine Hemodynamic & Vitals Assessment',
    clinicianName: 'Nurse Sarah Jenkins, RN',
    clinicianRole: 'Senior Critical Care & Home Nurse',
    registrationNumber: 'KNC-RN-58914',
    facilityName: 'Vellora Health Nursing Services',
    date: '12 Nov 2026',
    sampleCollectionTime: '12 Nov 2026, 09:15 AM',
    recordType: 'VITALS_LOG',
    patientId: 'fam-1',
    patientName: 'Kavita Sharma',
    patientRelationship: 'Mother',
    summary: 'Post-operative recovery monitoring. Blood pressure stabilized at 130/84 mmHg with good peripheral perfusion.',
    status: 'VERIFIED',
    vitals: {
      bloodPressure: '130/84 mmHg',
      heartRate: '74 bpm',
      oxygenSaturation: '97%',
      bloodGlucose: '114 mg/dL (Random)',
      temperature: '98.4 °F',
      respiratoryRate: '16 breaths/min',
      measuredAt: '09:15 AM (Sitting, Left Arm)',
      trendNote: 'BP decreased from 138/88 mmHg recorded last week. Pulse regular, rhythm sinus.',
      notes: 'Patient was rested in comfortable seated position for 10 minutes prior to blood pressure recording. Bilateral pedal pulses intact. Capillary refill < 2 seconds. Skin warm and dry. Patient administered morning antihypertensive medication on schedule.',
    },
  },
  {
    id: 'rec-sum-1',
    bookingId: 'bkg-8492',
    serviceTitle: 'Comprehensive Clinical Bedside Visit Summary',
    clinicianName: 'Dr. Rohan Mehta, MD',
    clinicianRole: 'Consultant General Physician',
    registrationNumber: 'KMC Reg # 84920',
    facilityName: 'Vellora Health In-Home Care',
    date: '28 Oct 2026',
    verifiedAt: '28 Oct 2026, 11:45 AM',
    recordType: 'CARE_SUMMARY',
    patientId: 'pat-1',
    patientName: 'Arjun Sharma',
    patientRelationship: 'Self',
    chiefComplaint: 'Acute onset of unproductive cough and mild chest tightness on exertion.',
    diagnosis: 'Seasonal Acute Bronchitis without Hypoxia',
    summary: 'Thorough bedside physical examination conducted. Patient responded well to initial bronchodilator trial. Home care instructions provided.',
    clinicalNotes: 'HEENT: Normocephalic, oropharynx clear without exudates. Neck supple. Chest: Bilateral breath sounds present with mild expiratory rhonchi; no crackles or consolidation. Cardiovascular: S1/S2 present, regular rate and rhythm without murmurs. Abdomen: Soft, non-tender. Extremities: No edema.',
    followUp: 'Follow-up consult scheduled in 7 days or sooner if breathing difficulty increases.',
    status: 'COMPLETED',
    vitals: {
      bloodPressure: '124/80 mmHg',
      heartRate: '76 bpm',
      oxygenSaturation: '98%',
      bloodGlucose: '98 mg/dL',
      temperature: '98.6 °F',
      respiratoryRate: '15 breaths/min',
      measuredAt: '10:45 AM',
    },
  },
  {
    id: 'rec-rx-2',
    bookingId: 'bkg-6210',
    serviceTitle: 'Geriatric Maintenance e-Prescription',
    clinicianName: 'Dr. Priya Patel, MD (Geriatrics)',
    clinicianRole: 'Consultant Geriatrician',
    registrationNumber: 'KMC Reg # 91044',
    facilityName: 'Vellora ElderCare Network',
    date: '04 Nov 2026',
    recordType: 'PRESCRIPTION',
    patientId: 'fam-2',
    patientName: 'Ramesh Sharma',
    patientRelationship: 'Father',
    chiefComplaint: 'Routine blood pressure review & mild osteoarthritis knee discomfort.',
    diagnosis: 'Essential Hypertension (I10) & Knee Osteoarthritis (M17.0)',
    summary: 'Monthly medication renewal for blood pressure control and supplementary joint mobility support.',
    status: 'ACTIVE',
    medications: [
      {
        name: 'Amlodipine Besylate',
        form: 'Tablet',
        strength: '5 mg',
        dosage: '1 Tablet',
        route: 'Oral',
        frequency: 'Once daily in morning (OD)',
        duration: '30 Days',
        instructions: 'Take every morning with or without food. Monitor blood pressure weekly.',
        warnings: 'Do not stop abruptly. Report any swelling in feet or ankles.',
      },
      {
        name: 'Glucosamine + Chondroitin Complex',
        form: 'Capsule',
        strength: '500/400 mg',
        dosage: '1 Capsule',
        route: 'Oral',
        frequency: 'Twice daily with meals (BD)',
        duration: '60 Days',
        instructions: 'Take after meals for joint cartilage maintenance.',
      },
    ],
  },
  {
    id: 'rec-lab-2',
    bookingId: 'bkg-7922',
    serviceTitle: 'Fasting Lipid & Renal Function Panel',
    clinicianName: 'Dr. Marcus Vance, MD (Pathology)',
    clinicianRole: 'Chief Clinical Pathologist',
    registrationNumber: 'KMC-PATH-49210',
    facilityName: 'Metropolitan Central Diagnostics',
    date: '05 Nov 2026',
    recordType: 'LAB_REPORT',
    patientId: 'fam-1',
    patientName: 'Kavita Sharma',
    patientRelationship: 'Mother',
    summary: 'Lipid panel demonstrates well-controlled LDL and total cholesterol. Renal function biomarkers stable.',
    status: 'VERIFIED',
    vitals: {
      bloodPressure: '138/88 mmHg',
      heartRate: '78 bpm',
      oxygenSaturation: '97%',
      bloodGlucose: '112 mg/dL',
      temperature: '98.2 °F',
    },
    labResults: [
      { parameter: 'Total Cholesterol', result: '172', unit: 'mg/dL', referenceRange: '< 200', status: 'NORMAL', category: 'Lipid Profile' },
      { parameter: 'HDL Cholesterol', result: '54', unit: 'mg/dL', referenceRange: '> 50 (Desirable)', status: 'NORMAL', category: 'Lipid Profile' },
      { parameter: 'LDL Cholesterol', result: '98', unit: 'mg/dL', referenceRange: '< 100 (Optimal)', status: 'NORMAL', category: 'Lipid Profile' },
      { parameter: 'Triglycerides', result: '145', unit: 'mg/dL', referenceRange: '< 150', status: 'NORMAL', category: 'Lipid Profile' },
      { parameter: 'Blood Urea Nitrogen (BUN)', result: '14', unit: 'mg/dL', referenceRange: '7 - 20', status: 'NORMAL', category: 'Renal Function' },
      { parameter: 'Serum Creatinine', result: '0.85', unit: 'mg/dL', referenceRange: '0.5 - 1.1', status: 'NORMAL', category: 'Renal Function' },
    ],
  },
];

export const getRecordById = (id: string): MedicalRecordItem | undefined => {
  return MEDICAL_RECORDS.find((r) => r.id === id);
};

export const getRecordByBookingId = (bookingId: string): MedicalRecordItem | undefined => {
  return MEDICAL_RECORDS.find((r) => r.bookingId === bookingId) || MEDICAL_RECORDS[0];
};
