'use client';

import React, { useState } from 'react';
import { FAQ_DATA } from '@/data/site-content';
import { Icon } from '@/components/common/Icon';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="section section-faq container" id="faq" aria-labelledby="faqTitle">
      <div className="faq-intro">
        <p className="eyebrow">GOOD TO KNOW</p>
        <h2 id="faqTitle">
          Frequently asked<br />questions.
        </h2>
        <p className="section-lead">Answers to the questions we hear most often.</p>
        <a className="text-link" href="#contact">
          Still have questions? <Icon name="arrow-right" size="sm" />
        </a>
      </div>

      <div className="faq-list">
        {FAQ_DATA.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <details
              key={index}
              open={isOpen}
              onClick={(e) => {
                e.preventDefault();
                handleToggle(index);
              }}
            >
              <summary>
                {faq.question}
                <Icon name="chevron-down" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          );
        })}
      </div>
    </section>
  );
};
