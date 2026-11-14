'use client';

import React from 'react';
import { db } from '@/lib/db';
import { CategoryServiceDirectory, CategoryPageConfig } from '@/components/services/CategoryServiceDirectory';

export default function NursingCarePage() {
  const nursingServices = db.getServices().filter((s) => s.category === 'NURSING_CARE');

  const config: CategoryPageConfig = {
    number: '02',
    slug: 'nursing-care',
    title: 'Nursing & Care Support',
    tagline: 'Intramuscular/IV injections, IV fluid infusions, surgical wound dressing, catheterization, and post-operative care by registered nurses.',
    scopeOfCare: [
      'Intramuscular/IV injections',
      'IV fluid & antibiotic infusions',
      'Surgical wound dressing & sterile care',
      'Catheterization & Foley maintenance',
      'Post-operative & 12h/24h nursing shifts'
    ],
    clinicianType: 'Licensed Clinical Nurses',
    clinicianRoleBadge: 'Registered & Trained Nurses (BSN / RN)',
    services: nursingServices,
  };

  return <CategoryServiceDirectory config={config} />;
}
