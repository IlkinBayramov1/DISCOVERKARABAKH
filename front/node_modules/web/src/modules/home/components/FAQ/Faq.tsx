// src/modules/home/components/FAQ/FAQ.tsx

import React, { useState } from 'react';
import type { FaqItem } from '../../types/home.types';
import './FAQ.css';

// ─── Default data (props ilə override oluna bilər) ────────────────────────
const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I get to Karabakh?',
    answer:
      'You can reach Karabakh by road from Baku via the Aghdam or Fuzuli corridors. Direct shuttle services and organized transfers are also available from Baku International Airport. Check the Transportation page for up-to-date routes and timetables.',
  },
  {
    id: 'faq-2',
    question: 'Do I need a special permit to visit?',
    answer:
      'Currently, visitors traveling through Azerbaijan do not need a separate permit. However, registration with local authorities may be required for extended stays in certain areas. Visit our Visa & Permissions page for the latest entry requirements.',
  },
  {
    id: 'faq-3',
    question: 'What is the best time of year to visit Karabakh?',
    answer:
      'Spring (April–June) and autumn (September–October) offer the most pleasant weather for sightseeing and outdoor activities. Summers can be warm and winters cold in the mountainous regions, but each season offers its own unique experience.',
  },
  {
    id: 'faq-4',
    question: 'What accommodation options are available?',
    answer:
      'There is a growing selection of hotels, boutique guesthouses, and serviced apartments — particularly in Shusha and Khankendi. The Accommodation page lists all verified stays with location, amenities, and booking details.',
  },
  {
    id: 'faq-5',
    question: 'What is the Discover Card and how does it work?',
    answer:
      'The Discover Card is a city-pass that bundles attractions, tours, transport and partner discounts into one QR-enabled card. Choose from flexible tiers (1-day, 3-day, 7-day) and unlock priority access at participating venues across the region.',
  },
  {
    id: 'faq-6',
    question: 'Is it safe to travel to Karabakh?',
    answer:
      'Karabakh is actively being developed for tourism under Azerbaijani authority. Designated tourist routes are open and safe. We recommend staying on marked roads and following guidance from local authorities when visiting reconstruction areas.',
  },
];

interface FAQProps {
  items?: FaqItem[];
  title?: string;
}

export default function FAQ({ items = DEFAULT_FAQS, title = 'Frequently asked questions' }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="container">

        <div className="faq__head">
          <h2 className="faq__title" id="faq-title">{title}</h2>
          <p className="faq__sub">
            Everything you need to know before planning your trip to Karabakh.
          </p>
        </div>

        <div className="faq__list" role="list">
          {items.map(item => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`faq__item${isOpen ? ' faq__item--open' : ''}`}
                role="listitem"
                id={item.id}
              >
                <button
                  className="faq__q"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${item.id}-panel`}
                  id={`${item.id}-btn`}
                  onClick={() => toggle(item.id)}
                >
                  <span className="faq__qText">{item.question}</span>
                  <span className="faq__icon" aria-hidden="true">
                    <span className="faq__iconBar faq__iconBar--h" />
                    <span className="faq__iconBar faq__iconBar--v" />
                  </span>
                </button>

                <div
                  className="faq__aWrap"
                  id={`${item.id}-panel`}
                  role="region"
                  aria-labelledby={`${item.id}-btn`}
                >
                  <div className="faq__aInner">
                    <p className="faq__a">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="faq__cta">
          <p className="faq__ctaText">Still have questions?</p>
          <a className="faq__ctaBtn" href="/contact" id="faq-contact-link">
            Contact us <span aria-hidden="true">→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
