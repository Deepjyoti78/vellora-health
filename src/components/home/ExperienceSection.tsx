import React from 'react';
import { EXPERIENCE_ITEMS } from '@/data/site-content';
import { Icon, IconName } from '@/components/common/Icon';

export const ExperienceSection: React.FC = () => {
  return (
    <section className="section section-experience" aria-labelledby="experienceTitle">
      <div className="container">
        <div className="section-heading-row experience-header">
          <div>
            <p className="eyebrow">CARE, WITHOUT THE COMPLEXITY</p>
            <h2 id="experienceTitle">
              Healthcare that<br />respects your time.
            </h2>
          </div>
          <p className="experience-intro">
            We believe great care should feel simple, considered, and human from your first visit onward.
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
