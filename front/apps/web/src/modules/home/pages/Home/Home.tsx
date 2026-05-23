import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import './Home.css';

// ─── Static Data ─────────────────────────────────────────────────────────
const HERO_SLIDES = [
  { 
    id: 1, 
    tag: 'EXPLORE', 
    title: 'A Karabakh to remember', 
    desc: 'Immerse yourself in local culture, heritage, dining and unforgettable seasonal experiences across Karabakh.', 
    img: 'https://i.redd.it/bfp6j7bias841.jpg', 
    ctaText: 'Learn more', 
    ctaLink: '/explore/about' 
  },
  { 
    id: 2, 
    tag: 'REKLAM', 
    title: 'Burada Sizin Reklamınız Ola Bilər', 
    desc: '', 
    img: 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png', 
    ctaText: 'Reklam Yerləşdir', 
    ctaLink: '#' 
  },
  { 
    id: 3, 
    tag: 'REKLAM', 
    title: 'Burada Sizin Reklamınız Ola Bilər', 
    desc: '', 
    img: 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png', 
    ctaText: 'Reklam Yerləşdir', 
    ctaLink: '#' 
  },
];

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
    href: '/things-to-do',
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
  { slug: 'agdam',     name: 'Aghdam',    desc: 'Modern development, memorial sites and regional routes.',   img: 'https://www.flax.az/images/layiheler/08-agdam-mosque/001.jpg' },
  { slug: 'lachin',    name: 'Lachin',    desc: 'Mountains, nature trails and panoramic landscapes.',         img: 'https://upload.wikimedia.org/wikipedia/commons/0/08/La%C3%A7%C4%B1n_%C5%9F%C9%99h%C9%99rinin_%C3%BCmumi_g%C3%B6r%C3%BCn%C3%BC%C5%9F%C3%BC.jpg' },
];

const ARTICLES_MINI = [
  { tag: 'GUIDES',      title: 'Where to experience seasonal highlights', min: 7,  href: '/explore/articles', img: 'https://www.virtualkarabakh.az/sekiller/da63108bb0c61515670390.jpg' },
  { tag: 'FOOD & DRINK',title: 'Local dishes you should try first',       min: 5,  href: '/explore/articles', img: 'https://www.azernews.az/media/2017/11/24/qarabagh_mtb.jpg' },
  { tag: 'CULTURE',     title: 'Museums & heritage sites worth a visit',  min: 6,  href: '/explore/articles', img: 'https://cdn.iticket.az/event/gallery/wcfM5dcnWaWgPSNGPCkxiDI6OUbJwPD9Bu5vUR2R.jpg' },
  { tag: 'NATURE',      title: 'Best viewpoints for golden hour photos',  min: 4,  href: '/explore/articles', img: 'https://azerbaijan.travel/resize3000/center/pages/9166/0af37ede-c016-4967-88d6-3ea71a019307.png' },
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

  // ─── DYNAMIC BANNER LOGIC ───────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const slidesCount = HERO_SLIDES.length;
  
  // ✅ Correctly defined auto-play time
  const autoPlayTime = 6000;

  const scrollToSlide = useCallback((index: number) => {
    if (trackRef.current) {
      const slideWidth = trackRef.current.clientWidth;
      trackRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  }, []);

  const navLeft = () => {
    const newIndex = currentIndex === 0 ? slidesCount - 1 : currentIndex - 1;
    scrollToSlide(newIndex);
  };

  const navRight = useCallback(() => {
    const newIndex = currentIndex === slidesCount - 1 ? 0 : currentIndex + 1;
    scrollToSlide(newIndex);
  }, [currentIndex, slidesCount, scrollToSlide]);

  // Handle auto-play
  useEffect(() => {
    const playInterval = setInterval(() => {
      navRight();
    }, autoPlayTime);

    return () => clearInterval(playInterval);
  }, [navRight]);

  // Handle resize updates
  useEffect(() => {
    const handleResize = () => {
        if (trackRef.current) {
            const slideWidth = trackRef.current.clientWidth;
            trackRef.current.scrollLeft = slideWidth * currentIndex;
        }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);


  return (
    <div className="page explore--home">

      {/* ── 1. DYNAMIC HERO (Restored Dark Premium Design) ────────────── */}
      <section className="hero" id="home">
        <div className="container">
          <div className="heroCard">
            
            {/* Slides Track */}
            <div className="bannerTrack" ref={trackRef}>
              {HERO_SLIDES.map((slide) => (
                <div key={slide.id} className="bannerSlide">
                  <div className="heroMedia" aria-hidden="true">
                    <img src={slide.img} alt={slide.title} />
                  </div>
                  <div className="heroOverlay" aria-hidden="true" />
                  
                  <div className="heroContent">
                    <span className="heroKicker">{slide.tag}</span>
                    <h1 className="heroTitle">{slide.title}</h1>
                    <p className="heroDesc">{slide.desc}</p>
                    
                    <div className="heroCtas">
                      <Link className="heroBtn heroBtn--primary" to={slide.ctaLink}>
                        {slide.ctaText} <span className="heroArrow" aria-hidden="true">›</span>
                      </Link>
                      <Link className="heroBtn heroBtn--ghost" to="/explore/articles">
                        Explore more <span className="heroArrow" aria-hidden="true">›</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Side Navigation */}
            <button className="bannerNav bannerNav--prev" onClick={navLeft} aria-label="Previous slide">
              <ChevronLeft size={24} />
            </button>
            <button className="bannerNav bannerNav--next" onClick={navRight} aria-label="Next slide">
              <ChevronRight size={24} />
            </button>

            {/* Bottom Dots Navigation */}
            <div className="heroBottom" aria-hidden="true">
              <div className="heroDots">
                {HERO_SLIDES.map((_, index) => (
                  <button 
                    key={index} 
                    className={`dot ${index === currentIndex ? 'is-active' : ''}`} 
                    onClick={() => scrollToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. SERVICES ───────────────────────────────────────────── */}
      <section className="svc" id="services">
        <div className="container">
          <div className="svc__headWrap">
             <h2 className="svc__title">Enjoy a hassle-free trip</h2>
          </div>
          <div className="svc__wrap">
            <div className="svc__track">
              {SERVICES.map((s, i) => (
                <Link key={i} className="svcCard" to={s.href}>
                  <span className="svcCard__icon" aria-hidden="true">{s.icon}</span>
                  <div className="svcCard__body">
                    <div className="svcCard__h">{s.h}</div>
                    <div className="svcCard__p">{s.p}</div>
                  </div>
                  <span className="svcCard__arrow" aria-hidden="true"><ChevronRight size={20} /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED CITIES ────────────────────────────────────── */}
      <section className="fc" id="featured-cities">
        <div className="container">
          <div className="fc__head">
            <h2 className="fc__title">Featured destinations</h2>
          </div>
          <div className="fc__track">
            {CITIES.map((c) => (
              <Link key={c.slug} className="fcCard" to={`/where/${c.slug}`}>
                <div className="fcCard__media">
                  <img src={c.img} alt={c.name} />
                </div>
                <div className="fcCard__info">
                  <div className="fcCard__meta">CITY</div>
                  <div className="fcCard__h">{c.name}</div>
                  <div className="fcCard__p">{c.desc}</div>
                  <div className="fcCard__cta">Discover more <ChevronRight size={16} /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ARTICLES ───────────────────────────────────────────── */}
      <section className="arts" id="articles">
        <div className="container">
          <div className="arts__head">
            <h2 className="arts__title">What's happening now</h2>
          </div>
          <div className="artsGrid">
            {/* Featured */}
            <article className="artFeat">
              <Link className="artFeat__media" to="/explore/articles">
                <img src="https://phoenixtour.org/wp-content/uploads/2021/03/09-ARTSAKH-NATURE.jpg" alt="Featured article" />
                <span className="artFeat__shade" aria-hidden="true" />
              </Link>
              <div className="artFeat__content">
                <div className="artTag">THINGS TO DO</div>
                <Link className="artFeat__h" to="/explore/articles">Fabulous things to do in Karabakh for free</Link>
                <p className="artFeat__p">Easy places, viewpoints and cultural stops that won't cost you a lot.</p>
                <div className="artFeat__meta">
                  <span className="metaPill">8 min read</span>
                  <Link className="readNow" to="/explore/articles">Read now <ChevronRight size={16} /></Link>
                </div>
              </div>
            </article>

            {/* Mini grid */}
            <div className="artsMini">
              {ARTICLES_MINI.map((a, i) => (
                <article key={i} className="artCard">
                  <Link className="artCard__media" to={a.href}>
                    <img src={a.img} alt={a.title} />
                  </Link>
                  <div className="artCard__body">
                    <div className="artTag">{a.tag}</div>
                    <Link className="artCard__h" to={a.href}>{a.title}</Link>
                    <div className="artCard__meta">{a.min} min read</div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="arts__footer">
            <Link className="artsBtn" to="/explore/articles">See more articles <ChevronRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ── 5. PLAN AHEAD ─────────────────────────────────────────── */}
      <section className="planAhead" id="plan-ahead">
        <div className="container">
          <div className="planAhead__head">
            <h2>Plan ahead</h2>
            <Link className="planAhead__all" to="/explore/articles">View all guides <ChevronRight size={16} /></Link>
          </div>
          <div className="planAhead__grid">
            {PLAN_CARDS.map((c, i) => (
              <Link key={i} className="planCard" to={c.href}>
                <div className="planCard__media">
                  <img src={c.img} alt={c.title} />
                </div>
                <div className="planCard__body">
                  <div className="planCard__kicker">{c.kicker}</div>
                  <div className="planCard__title">{c.title}</div>
                  <p className="planCard__desc">{c.desc}</p>
                  <div className="planCard__cta">Learn more <ChevronRight size={16} /></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. THINGS TO DO ───────────────────────────────────────── */}
      <section className="todo" id="find-things">
        <div className="container">
          <div className="todo__head">
            <h2 className="todo__title">Find things to do</h2>
            <div className="todoTabs" role="tablist">
              {TODO_TABS.map(tab => (
                <button
                  key={tab}
                  className={`todoTab${activeTab === tab ? ' is-active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="todoGrid">
            {TODO_CARDS.map((c, i) => (
              <article key={i} className="todoCard">
                <div className="todoCard__media">
                  <img src={c.img} alt={c.title} />
                  <span className="todoCard__tag">{c.tag}</span>
                </div>
                <div className="todoCard__body">
                  <h3 className="todoCard__title">{c.title}</h3>
                  <p className="todoCard__desc">{c.desc}</p>
                  <div className="todoCard__meta">
                    <div className="todoRating">
                      <Star size={14} className="todoStar" fill="currentColor" />
                      <span className="todoScore">{c.rating}</span>
                    </div>
                    <div className="todoReviews">{c.reviews} reviews</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="todo__footer">
            <Link className="todoBtn" to="/things-to-do/attractions">See more <ChevronRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* ── 7. CITY PASS CTA ──────────────────────────────────────── */}
      <section className="home-ctaSplit" id="city-pass">
        <div className="container">
          <div className="ctaSplit__card">
            <div className="ctaSplit__content">
              <div className="ctaSplit__badge">Karabakh City Pass</div>
              <h2 className="ctaSplit__title">Save more on the best experiences</h2>
              <p className="ctaSplit__text">
                Bundle attractions, tours, and transport in one pass. Pick your plan, build your itinerary,
                and unlock priority perks across Karabakh.
              </p>
              <div className="ctaSplit__actions">
                <Link className="ctaSplit__primary" to="/card-and-passes">Get the pass</Link>
                <Link className="ctaSplit__secondary" to="/card-and-passes">How it works</Link>
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
      
    </div>
  );
}