'use client';

import React from 'react';
import { db } from '@/lib/db';
import { CategoryServiceDirectory, CategoryPageConfig } from '@/components/services/CategoryServiceDirectory';

export default function DoctorConsultationsPage() {
  const doctorServices = db.getServices().filter((s) => s.category === 'DOCTOR_VISIT');

  const config: CategoryPageConfig = {
    number: '01',
    slug: 'doctor-consultations',
    title: 'Doctor Home Consultations',
    tagline: 'General physician checkups, acute illness management, elderly routine visits, and specialist consultations delivered directly to your home.',
    scopeOfCare: [
      'General physician checkups',
      'Acute illness management',
      'Elderly routine visits',
      'Specialist consultations at home',
      'Instant digital e-prescriptions'
    ],
    clinicianType: 'Board-Certified Doctors',
    clinicianRoleBadge: 'Verified Doctors (MBBS / MD / Specialists)',
    services: doctorServices,
  };

  return <CategoryServiceDirectory config={config} />;
}
