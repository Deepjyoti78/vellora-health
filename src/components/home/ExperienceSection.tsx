import React from 'react';
import { EXPERIENCE_ITEMS } from '@/data/site-content';
import { Icon, IconName } from '@/components/common/Icon';

export const ExperienceSection: React.FC = () => {
  return (
    <section className="section section-experience" aria-labelledby="experienceTitle">
      <div className="container">
        <div className="section-heading-row experience-header">
          <div>
            <p className="eyebrow">WHY CHOOSE VELLORA HEALTH</p>
            <h2 id="experienceTitle">
              Hospital-Standard Safety.<br />Doorstep Convenience.
            </h2>
          </div>
          <p className="experience-intro">
            We bring verified medical excellence directly to your residence, prioritizing patient dignity, family peace of mind, and transparent care standards.
          </p>
        </div>

        <div className="experience-grid">
          {EXPERIENCE_ITEMS.map((item, idx) => (
            <div key={idx} className="experience-pill">
              <Icon name={item.icon as IconName} /> {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
