import React, { useRef, useState } from 'react';
import HomeLayout from '../HomeLayout';
import type { SeoMeta } from '../../types/home.types';
import './Home.css';

// ─── Static data (backend-dən gəlsə props olacaq) ────────────────────────
const SEO: SeoMeta = {
  title:       'Discover Karabakh — Travel, Culture & City Services',
  description: 'Plan your trip to Karabakh. Explore cities, culture, nature, accommodation, transport and get the Discover Card.',
  canonical:   'https://discoverkarabakh.com',
  ogImage:     '/images/og-home.jpg',
};

const SERVICES = [
  {
    href: '/plan/visa-permissions',
    h: 'Visa & Permissions',
    p: 'Entry rules, permits, and what to prepare before you travel.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 3h7l3 3v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
        <path d="M14 3v3a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="2" />
        <path d="M8.5 11h7M8.5 14h7M8.5 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/plan/transportation#around',
    h: 'Getting around',
    p: 'Transfers, taxis, car hire, routes, and city mobility options.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M5 16V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v7" stroke="currentColor" strokeWidth="2" />
        <path d="M7 16h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 16a2 2 0 1 0 0 4M17 16a2 2 0 1 0 0 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/plan/transportation#how-to-get',
    h: 'Getting to',
    p: 'How to reach Karabakh: routes, gateways, and key travel corridors.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 21s6-5 6-10a6 6 0 1 0-12 0c0 5 6 10 6 10Z" stroke="currentColor" strokeWidth="2" />
        <path d="M12 11.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" strokeWidth="2" />
        <path d="M4 20c2-2 5-3 8-3s6 1 8 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/plan/accommodation',
    h: 'Where to stay',
    p: 'Hotels, guesthouses, and curated stays across the region.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 11v8M20 19v-6a2 2 0 0 0-2-2H7a3 3 0 0 0-3 3v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" stroke="currentColor" strokeWidth="2" />
        <path d="M8 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/events',
    h: 'What to see',
    p: 'Museums, monuments, viewpoints, and nature of Karabakh.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M7 4v3M17 4v3M5 9h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M6 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    href: '/card-and-passes',
    h: 'Discover Card',
    p: 'Rewards, discounts, and seamless access across services and partners.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8Z" stroke="currentColor" strokeWidth="2" />
        <path d="M4 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7.5 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const CITIES = [
  { slug: 'shusha',    name: 'Shusha',    desc: 'Culture, music heritage, historic streets and viewpoints.',  img: 'https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg' },
  { slug: 'khankendi', name: 'Khankendi', desc: 'Urban life, local dining and events calendar highlights.',   img: 'https://www.azernews.az/media/2023/08/03/eko7spowaaah2rq.jpg' },
  { slug: 'agdam',     name: 'Aghdam',   desc: 'Modern development, memorial sites and regional routes.',   img: 'https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg' },
  { slug: 'lachin',    name: 'Lachin',   desc: 'Mountains, nature trails and panoramic landscapes.',         img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/La%C3%A7%C4%B1n_%C5%9F%C9%99h%C9%99rinin_%C3%BCmumi_g%C3%B6r%C3%BCn%C3%BC%C5%9F%C3%BC.jpg' },
];

const ARTICLES_MINI = [
  { tag: 'GUIDES',      title: 'Where to experience seasonal highlights', min: 7,  href: '#a1', img: 'https://www.virtualkarabakh.az/sekiller/da63108bb0c61515670390.jpg' },
  { tag: 'FOOD & DRINK',title: 'Local dishes you should try first',        min: 5,  href: '#a2', img: 'https://www.azernews.az/media/2017/11/24/qarabagh_mtb.jpg' },
  { tag: 'CULTURE',     title: 'Museums & heritage sites worth a visit',   min: 6,  href: '#a3', img: 'https://cdn.iticket.az/event/gallery/wcfM5dcnWaWgPSNGPCkxiDI6OUbJwPD9Bu5vUR2R.jpg' },
  { tag: 'NATURE',      title: 'Best viewpoints for golden hour photos',   min: 4,  href: '#a4', img: 'https://azerbaijan.travel/resize3000/center/pages/9166/0af37ede-c016-4967-88d6-3ea71a019307.png' },
];

const PLAN_CARDS = [
  { kicker: 'Visa guide',      title: 'Entry rules & permits',    desc: 'What you need before you plan your trip to Karabakh.', href: '/plan/visa-permissions', img: 'https://shusha.gov.az/storage/app/media/9b663a2f-2b51-49ac-8bec-6646e783c957_20250822142737.jpg' },
  { kicker: 'Transport',       title: 'Getting around',           desc: 'Routes, transfers, and practical tips for moving between cities.', href: '/plan/transportation', img: 'https://konkret.az/cloud/uploads/2020/10/a1-16.jpg' },
  { kicker: 'Places to stay',  title: 'Hotels & guesthouses',    desc: 'Choose the best area and stay style for your itinerary.', href: '/plan/accommodation', img: 'https://qafqazinfo.az/uploads/1683742802/13.jpg' },
  { kicker: 'About Karabakh',  title: 'Know before you go',       desc: 'A quick overview of culture, seasons, and local essentials.', href: '/explore/about', img: 'https://wmf.imgix.net/images/ca_aerial_view_of_dadivank_monastery_built_between_the_9th_and_13th_centuries._copy.jpg?auto=format,compress&fit=max&w=4040' },
];

const TODO_TABS = ['All', 'Attractions', 'Food & Drink', 'Guided Tours', 'Wellness', 'Entertainment'];

const TODO_CARDS = [
  { tag: 'Attraction', title: 'Shusha Fortress',          desc: 'The 18th-century fortress walls overlooking dramatic cliffs — a symbol of Karabakh\'s cultural capital.', img: 'https://shusha.gov.az/storage/app/media/initial/Gala.jpg',           rating: 4.9, reviews: 412 },
  { tag: 'Restaurant', title: 'Karabakh Khan Sofrası',    desc: 'Authentic regional cuisine featuring piti, dolma, and tandır bread in a refined historic setting.',         img: 'https://www.shushahotel.com/storage/app/media/initial/Gallery%20Dining.jpg', rating: 4.6, reviews: 238 },
  { tag: 'Wellness',   title: 'Istisu Thermal Springs',   desc: 'Natural mineral springs in the mountains of Kalbajar — known for therapeutic relaxation and scenic views.',  img: 'https://fed.az/upload/news/358065.jpg',                               rating: 4.8, reviews: 189 },
];

// ─── Component ────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState('All');

  return (
    <HomeLayout seo={SEO} showFaq>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="hero" id="home">
        <div className="container">
          <div className="heroCard">
            <div className="heroMedia" aria-hidden="true">
              <img src="https://i.redd.it/bfp6j7bias841.jpg" alt="Karabakh hero" />
            </div>
            <div className="heroOverlay" aria-hidden="true" />
            <div className="heroContent">
              <h1 className="heroTitle">A Karabakh to<br />remember</h1>
              <p className="heroDesc">
                Immerse yourself in local culture, heritage, dining and unforgettable seasonal experiences across Karabakh.
              </p>
              <div className="heroCtas">
                <a className="heroBtn heroBtn--primary" href="#learn" id="hero-cta-learn">
                  Learn more <span className="heroArrow" aria-hidden="true">›</span>
                </a>
                <a className="heroBtn heroBtn--ghost" href="#explore" id="hero-cta-explore">
                  Explore options <span className="heroArrow" aria-hidden="true">›</span>
                </a>
              </div>
            </div>
            <div className="heroBottom" aria-hidden="true">
              <div className="heroDots">
                <span className="dot is-active" /><span className="dot" /><span className="dot" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────────────────────── */}
      <section className="svc" id="services">
        <div className="container">
          <h2 className="svc__title">Enjoy a hassle-free Karabakh trip</h2>
          <div className="svc__wrap">
            <div className="svc__track" aria-label="Services" tabIndex={0}>
              {SERVICES.map((s, i) => (
                <a key={i} className="svcCard" href={s.href} id={`service-card-${i}`}>
                  <span className="svcCard__icon" aria-hidden="true">{s.icon}</span>
                  <div className="svcCard__body">
                    <div className="svcCard__h">{s.h}</div>
                    <div className="svcCard__p">{s.p}</div>
                  </div>
                  <span className="svcCard__arrow" aria-hidden="true">›</span>
                </a>
              ))}
            </div>
            <div className="svc__controls">
              <a className="svc__cta" href="#all-services" id="services-view-all">View all <span aria-hidden="true">›</span></a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED CITIES ───────────────────────────────────────── */}
      <section className="fc" id="featured-cities">
        <div className="container">
          <div className="fc__head">
            <h2 className="fc__title">Featured cities</h2>
          </div>
          <div className="fc__track">
            {CITIES.map((c) => (
              <a key={c.slug} className="fcCard" href={`/where/${c.slug}`} id={`city-card-${c.slug}`}>
                <div className="fcCard__media">
                  <img src={c.img} alt={c.name} />
                </div>
                <div className="fcCard__info">
                  <div className="fcCard__meta">CITY</div>
                  <div className="fcCard__h">{c.name}</div>
                  <div className="fcCard__p">{c.desc}</div>
                  <div className="fcCard__cta">Discover more <span aria-hidden="true">›</span></div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTICLES ──────────────────────────────────────────────── */}
      <section className="arts" id="articles">
        <div className="container">
          <div className="arts__head">
            <h2 className="arts__title">What's happening now</h2>
          </div>
          <div className="artsGrid">
            {/* Featured */}
            <article className="artFeat">
              <a className="artFeat__media" href="#featured-1">
                <img src="https://phoenixtour.org/wp-content/uploads/2021/03/09-ARTSAKH-NATURE.jpg" alt="Featured article" />
                <span className="artFeat__shade" aria-hidden="true" />
              </a>
              <div className="artFeat__content">
                <div className="artTag">THINGS TO DO</div>
                <a className="artFeat__h" href="#featured-1">Fabulous things to do in Karabakh for free</a>
                <p className="artFeat__p">Easy places, viewpoints and cultural stops that won't cost you a lot.</p>
                <div className="artFeat__meta">
                  <span className="metaPill">8 min read</span>
                  <a className="readNow" href="#featured-1" id="article-feat-read">Read now <span aria-hidden="true">›</span></a>
                </div>
              </div>
            </article>

            {/* Mini grid */}
            <div className="artsMini">
              {ARTICLES_MINI.map((a, i) => (
                <article key={i} className="artCard">
                  <a className="artCard__media" href={a.href} id={`article-mini-img-${i}`}>
                    <img src={a.img} alt={a.title} />
                  </a>
                  <div className="artCard__body">
                    <div className="artTag">{a.tag}</div>
                    <a className="artCard__h" href={a.href} id={`article-mini-link-${i}`}>{a.title}</a>
                    <div className="artCard__meta">{a.min} min read</div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="arts__footer">
            <a className="artsBtn" href="/explore/articles" id="articles-see-more">See more articles</a>
          </div>
        </div>
      </section>

      {/* ── PLAN AHEAD ────────────────────────────────────────────── */}
      <section className="planAhead" id="plan-ahead">
        <div className="container">
          <div className="planAhead__head">
            <h2>Plan ahead</h2>
            <a className="planAhead__all" href="/explore/articles" id="plan-view-all">View all planning guides →</a>
          </div>
          <div className="planAhead__grid">
            {PLAN_CARDS.map((c, i) => (
              <a key={i} className="planCard" href={c.href} id={`plan-card-${i}`}>
                <div className="planCard__media">
                  <img src={c.img} alt={c.title} />
                </div>
                <div className="planCard__body">
                  <div className="planCard__kicker">{c.kicker}</div>
                  <div className="planCard__title">{c.title}</div>
                  <p className="planCard__desc">{c.desc}</p>
                  <div className="planCard__cta">Learn more <span aria-hidden="true">→</span></div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── THINGS TO DO ──────────────────────────────────────────── */}
      <section className="todo" id="find-things">
        <div className="container">
          <div className="todo__head">
            <h2 className="todo__title">Find things to do</h2>
            <div className="todoTabs" role="tablist" aria-label="Things to do categories">
              {TODO_TABS.map(tab => (
                <button
                  key={tab}
                  className={`todoTab${activeTab === tab ? ' is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  id={`todo-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="todoGrid" id="todoGrid">
            {TODO_CARDS.map((c, i) => (
              <article key={i} className="todoCard" id={`todo-card-${i}`}>
                <div className="todoCard__media">
                  <img src={c.img} alt={c.title} />
                  <span className="todoCard__tag">{c.tag}</span>
                </div>
                <div className="todoCard__body">
                  <h3 className="todoCard__title">{c.title}</h3>
                  <p className="todoCard__desc">{c.desc}</p>
                  <div className="todoCard__meta">
                    <div className="todoRating">
                      <span className="todoStars">{'★'.repeat(Math.floor(c.rating))}{'☆'.repeat(5 - Math.floor(c.rating))}</span>
                      <span className="todoScore">{c.rating}</span>
                    </div>
                    <div className="todoReviews">{c.reviews} reviews</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="todo__footer">
            <a className="todoBtn" href="/things-to-do/attractions" id="todo-see-more">See more</a>
          </div>
        </div>
      </section>

      {/* ── CITY PASS CTA ─────────────────────────────────────────── */}
      <section className="ctaSplit" id="city-pass">
        <div className="container">
          <div className="ctaSplit__card">
            <div className="ctaSplit__media" aria-hidden="true" />
            <div className="ctaSplit__content">
              <div className="ctaSplit__badge">Karabakh City Pass</div>
              <h2 className="ctaSplit__title">Save more on the best experiences</h2>
              <p className="ctaSplit__text">
                Bundle attractions, tours, and transport in one pass. Pick your plan, build your itinerary,
                and unlock priority perks across Karabakh.
              </p>
              <div className="ctaSplit__actions">
                <a className="ctaSplit__primary"   href="#passes"       id="cta-get-pass">Get the pass</a>
                <a className="ctaSplit__secondary" href="#how-it-works" id="cta-how-it-works">How it works</a>
              </div>
              <div className="ctaSplit__meta">
                <span>Flexible tiers</span>
                <span className="dot">•</span>
                <span>QR entry</span>
                <span className="dot">•</span>
                <span>Local discounts</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HomeLayout>
  );
}
