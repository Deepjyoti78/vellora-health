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
    <section className="section section-faq" id="faq" aria-labelledby="faqTitle">
      <div className="container faq-container">
        <div className="faq-intro scroll-reveal-left">
          <p className="eyebrow">GOOD TO KNOW</p>
          <h2 id="faqTitle">
            Frequently asked<br />questions.
          </h2>
          <p className="section-lead">Answers to the questions we hear most often.</p>
          <a className="text-link" href="/contact">
            Still have questions? <Icon name="arrow-right" size="sm" />
          </a>
        </div>

        <div className="faq-list stagger-container" role="region" aria-label="Frequently Asked Questions list">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  onClick={() => handleToggle(index)}
                >
                  <span>{faq.question}</span>
                  <span className="faq-chevron" aria-hidden="true">
                    <Icon name="chevron-down" />
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="faq-collapse"
                >
                  <div className="faq-collapse-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
