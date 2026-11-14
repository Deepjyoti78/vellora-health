'use client';

import React from 'react';
import { db } from '@/lib/db';
import { CategoryServiceDirectory, CategoryPageConfig } from '@/components/services/CategoryServiceDirectory';

export default function DiagnosticsLabsPage() {
  const labServices = db.getServices().filter((s) => s.category === 'LAB_TESTS');

  const config: CategoryPageConfig = {
    number: '03',
    slug: 'diagnostics-labs',
    title: 'Diagnostics & Lab Services',
    tagline: 'Doorstep blood and urine sample collection, home ECG/vitals screening, and accredited digital diagnostic report delivery.',
    scopeOfCare: [
      'Doorstep blood & urine sample collection',
      'Home 12-lead ECG & vitals screening',
      'Full blood counts & metabolic panels',
      'Cold-chain sample preservation',
      'Digital diagnostic reports within 12-24 hours'
    ],
    clinicianType: 'Certified Medical Phlebotomists',
    clinicianRoleBadge: 'Certified Phlebotomists & Technicians (CPT / MLT)',
    services: labServices,
  };

  return <CategoryServiceDirectory config={config} />;
}
