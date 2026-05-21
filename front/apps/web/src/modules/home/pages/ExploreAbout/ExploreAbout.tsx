import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Head from '../../components/SEO/Head';
import aboutData from '../../../../data/exploreAbout'; 
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './ExploreAbout.css';

const ExploreAbout: React.FC = () => {
  const [timelineIndex, setTimelineIndex] = useState(0);
  const timelineItems = aboutData.longRead?.timeline || [];
  const activeTimeline = timelineItems[timelineIndex];

  const trackRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const step = Math.min(420, Math.max(260, trackRef.current.clientWidth * 0.45));
      trackRef.current.scrollBy({ 
        left: direction === 'left' ? -step : step, 
        behavior: 'smooth' 
      });
    }
  };

  const handleTimelineNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setTimelineIndex((prev) => (prev === 0 ? timelineItems.length - 1 : prev - 1));
    } else {
      setTimelineIndex((prev) => (prev === timelineItems.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div className="page explore--about">
      <Head pageTitle="About Karabakh - Discover Karabakh" />

      <main>
        {/* ─── HERO SECTION ────────────────────────────────────────────── */}
        <section className="aboutHero" id="top">
          <div className="container">
            <div className="aboutHero__card">
              <div className="aboutHero__media" aria-hidden="true">
                {aboutData.hero?.mediaType === "video" ? (
                  <video src={aboutData.hero.mediaSrc} autoPlay muted loop playsInline></video>
                ) : (
                  <img src={aboutData.hero?.mediaSrc} alt="About Karabakh" />
                )}
              </div>

              <div className="aboutHero__shade" aria-hidden="true"></div>

              <div className="aboutHero__content">
                <h1 className="aboutHero__title">{aboutData.hero?.title}</h1>
                <p className="aboutHero__sub">{aboutData.hero?.subtitle}</p>

                <div className="aboutHero__actions">
                  <Link className="heroBtn heroBtn--primary" to="/explore/articles">
                    Learn more <ChevronRight size={18} />
                  </Link>
                  <Link className="heroBtn heroBtn--ghost" to="/things-to-do/restaurants">
                    Explore dining options <ChevronRight size={18} />
                  </Link>
                </div>
              </div>

              <div className="aboutHero__bottom">
                {aboutData.mapCard && (
                  <Link className="mapThumb" to={aboutData.mapCard.href}>
                    <div className="mapThumb__img">
                      <img src={aboutData.mapCard.thumb} alt="Map Preview" />
                    </div>
                    <div className="mapThumb__b">
                      <div className="mapThumb__t">{aboutData.mapCard.title}</div>
                      <div className="mapThumb__d">{aboutData.mapCard.desc}</div>
                      <div className="mapThumb__cta">Open map <ChevronRight size={14} /></div>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── LONG READ & TIMELINE ────────────────────────────────────── */}
        <section className="kbAboutLong" id="about-long">
          <div className="container">
            <div className="kbIntro">
              <div className="kbIntro__media">
                <img src={aboutData.longRead?.image} alt="Heritage" />
              </div>

              <div className="kbIntro__content">
                <header className="kbAboutLong__head">
                  <h2 className="kbAboutLong__title">{aboutData.longRead?.title}</h2>
                  <p className="kbAboutLong__lead">{aboutData.longRead?.lead}</p>
                </header>
                <div className="kbAboutLong__intro">
                  {aboutData.longRead?.intro.map((p, index) => (
                    <p key={index}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="kbTimeline">
              <div className="kbTimeline__top">
                <h3 className="kbTimeline__h">{aboutData.longRead?.timelineTitle}</h3>
                <p className="kbTimeline__sub">{aboutData.longRead?.timelineSubtitle}</p>
              </div>

              {activeTimeline && (
                <div className="kbTimeline__stage">
                  <div className="kbTimeline__media">
                    <img src={activeTimeline.img} alt={activeTimeline.year} />
                  </div>
                  <div className="kbTimeline__copy">
                    <div className="kbTimeline__year">{activeTimeline.year}</div>
                    <div className="kbTimeline__text">{activeTimeline.text}</div>
                  </div>
                </div>
              )}

              <div className="kbTimeline__bar">
                <button className="kbTLBtn" onClick={() => handleTimelineNav('prev')}><ChevronLeft size={20}/></button>
                <div className="kbTLYears">
                  {timelineItems.map((t, idx) => (
                    <button 
                      key={idx} 
                      className={`kbYear ${timelineIndex === idx ? 'is-active' : ''}`}
                      onClick={() => setTimelineIndex(idx)}
                    >
                      {t.year}
                    </button>
                  ))}
                </div>
                <button className="kbTLBtn" onClick={() => handleTimelineNav('next')}><ChevronRight size={20}/></button>
              </div>
            </div>

            <div className="kbFacts">
              <h3 className="kbFacts__h">{aboutData.longRead?.moreTitle}</h3>
              <ul className="kbFacts__list">
                {aboutData.longRead?.more.map((x, index) => (
                  <li key={index}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── CATEGORIES GRID ─────────────────────────────────────────── */}
        <section className="aboutCats" id="find">
          <div className="container">
            <header className="aboutCats__head">
              <h2 className="aboutCats__title">{aboutData.categories?.title}</h2>
              <p className="aboutCats__sub">{aboutData.categories?.subtitle}</p>
            </header>

            <div className="aboutCats__grid">
              {aboutData.categories?.items.map((i, index) => (
                <Link key={index} className="aboutCat" to={i.href}>
                  <div className="aboutCat__media">
                    <img src={i.img} alt={i.title} />
                  </div>
                  <div className="aboutCat__body">
                    {i.badge && <span className="aboutCat__badge">{i.badge}</span>}
                    <h3 className="aboutCat__t">{i.title}</h3>
                    <p className="aboutCat__d">{i.desc}</p>
                    <div className="aboutCat__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CAROUSEL (SIGNATURE PLACES) ─────────────────────────────── */}
        <section className="aboutCarousel" id="signature">
          <div className="container">
            <header className="secHead">
              <h2>{aboutData.signature?.title}</h2>
              <p>{aboutData.signature?.subtitle}</p>
            </header>

            <div className="carFrame">
              <button className="carArrow carArrow--prev" onClick={() => scrollCarousel('left')}><ChevronLeft size={24}/></button>
              <div className="carTrack" ref={trackRef}>
                {aboutData.signature?.items.map((it, index) => (
                  <Link key={index} className="carCard" to={it.href}>
                    <div className="carCard__img"><img src={it.img} alt={it.title} /></div>
                    <div className="carCard__b">
                      <div className="carCard__meta">ATTRACTION</div>
                      <div className="carCard__t">{it.title}</div>
                      <div className="carCard__d">{it.desc}</div>
                      <div className="carCard__cta">Discover more <ChevronRight size={16} /></div>
                    </div>
                  </Link>
                ))}
              </div>
              <button className="carArrow carArrow--next" onClick={() => scrollCarousel('right')}><ChevronRight size={24}/></button>
            </div>
          </div>
        </section>

        {/* ─── SNAPSHOTS (CULTURE & NATURE) ────────────────────────────── */}
        {[aboutData.culture, aboutData.nature].map((section, sIdx) => (
          <section key={sIdx} className="snap">
            <div className="container">
              <header className="secHead">
                <h2>{section?.title}</h2>
                <p>{section?.subtitle}</p>
              </header>
              <div className="snapGrid">
                {section?.items.map((it, index) => (
                  <Link key={index} className="snapCard" to={it.href}>
                    <div className="snapCard__img"><img src={it.img} alt={it.title} /></div>
                    <div className="snapCard__b">
                      <div className="snapCard__t">{it.title}</div>
                      <div className="snapCard__d">{it.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ─── BOTTOM CTA ──────────────────────────────────────────────── */}
        <section className="ctaSplit">
          <div className="container">
            <div className="ctaSplit__card">
              <div className="ctaSplit__content">
                <div className="ctaSplit__badge">Karabakh City Pass</div>
                <h3 className="ctaSplit__title">Save more on the best experiences</h3>
                <p className="ctaSplit__text">
                  Bundle attractions, tours, and transport in one pass. Pick your plan, build your itinerary,
                  and unlock priority perks across Karabakh.
                </p>
                <div className="ctaSplit__actions">
                  <Link className="ctaSplit__primary" to="/card-and-passes">Get the pass</Link>
                  <Link className="ctaSplit__secondary" to="/card-and-passes">How it works</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExploreAbout;