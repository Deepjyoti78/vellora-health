/**
 * Domain Type Definitions for Vellora Health Mobile Platform
 * Aligned with web schema to ensure zero-cost API migration.
 */

export type UserRole = 'PATIENT' | 'DOCTOR' | 'NURSE' | 'CARETAKER' | 'PHLEBOTOMIST' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  dob?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  address?: {
    street: string;
    city: string;
    postalCode: string;
    landmark?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export type ServiceId = 'doctor-visit' | 'nursing-care' | 'caretakers' | 'lab-tests';

export interface CoreServiceItem {
  id: ServiceId;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  priceStartingAt: number;
  priceUnit: string;
  durationOptions?: string[];
  features: string[];
  image: any; // ImageSourcePropType or local require
  iconName: string;
  clinicalTag: string;
}

export type BookingStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface AssignedClinician {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  phone: string;
  avatar: any;
  hospitalAffiliation: string;
  yearsExperience: number;
}

export interface PatientBooking {
  id: string;
  serviceId: ServiceId;
  serviceTitle: string;
  patientName: string;
  patientRelationship: string;
  patientAge: number;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTimeSlot: string;
  urgency: 'STANDARD' | 'EMERGENCY_DISPATCH';
  totalPrice: number;
  securityPin: string; // 4-digit physical encounter unlock PIN (e.g. "4829")
  address: string;
  symptoms: string;
  assignedClinician?: AssignedClinician;
  etaMinutes?: number;
  createdAt: string;
  shiftDuration?: string;
}

export interface LabResultItem {
  parameter: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
}

export interface MedicalRecordItem {
  id: string;
  bookingId: string;
  serviceTitle: string;
  clinicianName: string;
  date: string;
  recordType: 'PRESCRIPTION' | 'VITALS_LOG' | 'LAB_REPORT' | 'CARE_SUMMARY';
  summary: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: string;
    oxygenSaturation?: string;
    bloodGlucose?: string;
    temperature?: string;
  };
  labResults?: LabResultItem[];
  medications?: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
}
