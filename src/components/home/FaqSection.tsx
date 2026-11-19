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
    <section className="section section-faq !bg-transparent py-14 sm:py-18" id="faq" aria-labelledby="faqTitle">
      <div className="container faq-container">
        <div className="faq-intro scroll-reveal-left">
          <p className="eyebrow text-[#065F46] font-bold tracking-wider uppercase">GOOD TO KNOW</p>
          <h2 id="faqTitle" className="font-heading text-3xl font-extrabold text-[#11191B] md:text-5xl tracking-tight leading-tight">
            Frequently asked<br />questions.
          </h2>
          <p className="section-lead text-[#55696D] mt-2">Answers to the questions we hear most often.</p>
          <a className="text-link text-[#065F46] border-[#065F46]/30 hover:text-[#043D2E] mt-6" href="/contact">
            Still have questions? <Icon name="arrow-right" size="sm" />
          </a>
        </div>

        <div className="faq-list stagger-container" role="region" aria-label="Frequently Asked Questions list">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item border-b border-[#E5EAE7] ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-button text-[#11191B] hover:text-[#065F46] transition-colors py-4 flex items-center justify-between w-full text-left"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  onClick={() => handleToggle(index)}
                >
                  <span className="font-semibold text-base sm:text-lg">{faq.question}</span>
                  <span className={`faq-chevron text-[#065F46] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true">
                    <Icon name="chevron-down" />
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className={`faq-collapse transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0 overflow-hidden'}`}
                >
                  <div className="faq-collapse-inner text-[#55696D] text-sm leading-relaxed">
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
