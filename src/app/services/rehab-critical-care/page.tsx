'use client';

import React from 'react';
import { db } from '@/lib/db';
import { CategoryServiceDirectory, CategoryPageConfig } from '@/components/services/CategoryServiceDirectory';

export default function RehabCriticalCarePage() {
  const caretakerServices = db
    .getServices()
    .filter((s) => s.category === 'CARETAKER' || s.category === 'REHAB_THERAPY' || s.category === 'CRITICAL_CARE');

  const config: CategoryPageConfig = {
    number: '04',
    slug: 'rehab-critical-care',
    title: 'Rehab & Critical Care',
    tagline: 'Elderly companionship, bedridden patient assistance, mobility support, hygiene care, and 12-hour or 24-hour shift support.',
    scopeOfCare: [
      'Elderly companionship & dementia care',
      'Bedridden patient assistance & transfer',
      'Mobility support & physiotherapy',
      'Personal hygiene & bathing care',
      '12-hour or 24-hour continuous shifts'
    ],
    clinicianType: 'Trained Caretakers & Physical Therapists',
    clinicianRoleBadge: 'Verified Patient Attendants / Caretakers & Licensed Therapists',
    services: caretakerServices,
  };

  return <CategoryServiceDirectory config={config} />;
}
