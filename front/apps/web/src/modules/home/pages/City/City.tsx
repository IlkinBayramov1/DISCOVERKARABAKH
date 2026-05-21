import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Plus, Minus } from 'lucide-react';
import Head from '../../components/SEO/Head';
import cities from '../../../../data/cities';
import './City.css';

const City: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = cities[slug as keyof typeof cities];

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [activeTabSlug, setActiveTabSlug] = useState<string | null>(null);

  if (!city) {
    return (
      <div className="cityNotFound">
        <h2>Destination not found</h2>
        <Link className="btn btn--primary" to="/">Return to home</Link>
      </div>
    );
  }

  const aboutLong = city.aboutLong || [];
  const cats = city.things?.categories || [];
  const faq = city.faq || [];
  const activeTab = cats.find((c: any) => c.slug === activeTabSlug);

  return (
    <div className="page page--city">
      <Head pageTitle={`${city.name} - Discover Karabakh`} />

      <main className="city">
        {/* ─── HERO SECTION ────────────────────────────────────────────── */}
        <section className="cityHero">
          <div className="container">
            <div className="cityHero__card">
              <div className="cityHero__media">
                <img src={city.heroImg} alt={city.name} />
              </div>
              
              {/* Premium purple bloom + plum fade overlay */}
              <div className="cityHero__shade"></div>

              <div className="cityHero__content">
                <div className="cityHero__kicker">WHERE TO GO</div>
                <h1 className="cityHero__title">{city.name}</h1>
                <p className="cityHero__desc">{city.subtitle}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── ABOUT SECTION (Stacked Images) ──────────────────────────── */}
        <section className="aboutStack" id="about">
          <div className="container aboutStack__grid">
            <div className="aboutStack__left">
              <h2 className="aboutStack__title">
                {city.aboutHeroTitle || `Your ${city.name} journey starts here`}
              </h2>
              <div className="aboutStack__text">
                {aboutLong.map((par: string, index: number) => (
                  <p key={index}>{par}</p>
                ))}
              </div>
              {city.aboutCtaHref && (
                <Link className="aboutStack__cta" to={city.aboutCtaHref}>
                  {city.aboutCtaText || "Discover more"} <ChevronRight size={18} />
                </Link>
              )}
            </div>

            <div className="aboutStack__right" aria-hidden="true">
              <div className="aboutStack__img aboutStack__img--back">
                <img src={city.aboutImages?.[0] || city.heroImg} alt="" />
              </div>
              <div className="aboutStack__img aboutStack__img--front">
                <img src={city.aboutImages?.[1] || city.heroImg} alt="" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── ATTRACTIONS GRID (White Cards) ──────────────────────────── */}
        <section className="cityAttractions" id="highlights">
          <div className="container">
            <header className="cityAttractions__head">
              <h2 className="cityAttractions__title">What to see in {city.name}</h2>
              <p className="cityAttractions__lead">
                {city.attractionsIntro || "A curated list of landmarks and places worth visiting."}
              </p>
            </header>

            <div className="cityAttractions__grid">
              {(city.attractions || []).map((a: any, index: number) => (
                <article key={index} className="attrCard">
                  {a.img && (
                    <div className="attrCard__media">
                      <img src={a.img} alt={a.title} />
                    </div>
                  )}
                  <div className="attrCard__body">
                    <h3 className="attrCard__title">{a.title}</h3>
                    <p className="attrCard__desc">{a.desc}</p>
                    {a.href && (
                      <Link className="attrCard__cta" to={a.href}>
                        Discover more <ChevronRight size={16} />
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── THINGS TO DO TABS (Interactive) ─────────────────────────── */}
        <section className="thingsX" id="things">
          <div className="container">
            <header className="thingsX__head">
              <h2 className="thingsX__title">{city.things?.title || `Discover the many sides of ${city.name}`}</h2>
              <p className="thingsX__sub">{city.things?.subtitle || "Explore experiences for different travel styles."}</p>
            </header>

            <div className="thingsX__grid">
              {cats.map((c: any, index: number) => (
                <button 
                  key={index} 
                  className={`thxCard ${activeTabSlug === c.slug ? 'is-active' : ''}`}
                  onClick={() => setActiveTabSlug(activeTabSlug === c.slug ? null : c.slug)}
                >
                  <span className="thxCard__img" style={{ backgroundImage: `url('${c.img}')` } as any}>
                    <span className="thxCard__shade"></span>
                  </span>
                  <span className="thxCard__text">
                    <span className="thxCard__h">{c.title}</span>
                    <span className="thxCard__p">{c.teaser}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Dynamic Panel */}
            {activeTab && (
              <div className="thxPanel is-open">
                <div className="thxPanel__inner">
                  <div className="thxPanel__left">
                    <div className="thxPanel__kicker">Selected experience</div>
                    <h3 className="thxPanel__h">{activeTab.panel.headline}</h3>
                    <p className="thxPanel__p">{activeTab.panel.body}</p>
                    <Link className="thxPanel__cta" to={activeTab.panel.ctaHref}>
                      {activeTab.panel.ctaText} <ChevronRight size={16} />
                    </Link>
                  </div>
                  <div className="thxPanel__right">
                    {activeTab.panel.tiles.map((t: any, i: number) => (
                      <Link key={i} className="thxTile" to={t.href}>
                        <span className="thxTile__img"><img src={t.img} alt="" /></span>
                        <span className="thxTile__bar">
                          <span className="thxTile__title">{t.title}</span>
                          <span className="thxTile__arrow"><ChevronRight size={16} /></span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ─── FAQ SECTION ─────────────────────────────────────────────── */}
        <section className="cityFaq" id="faq">
          <div className="container">
            <h2 className="cityFaq__title">Frequently asked questions</h2>
            <div className="cityFaq__grid">
              {faq.map((item: any, index: number) => (
                <div key={index} className={`faqItem ${openFaqIndex === index ? 'is-open' : ''}`}>
                  <button className="faqQ" onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}>
                    <span>{item.q}</span>
                    <span className="faqIcon">
                      {openFaqIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                    </span>
                  </button>
                  <div className="faqA">
                    <p>{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── KEEP EXPLORING (Related Cities) ─────────────────────────── */}
        <section className="keepExplore">
          <div className="container">
            <h2 className="keepExplore__title">Keep exploring</h2>
            <div className="keepExplore__grid">
              {(city.related || []).map((c: any, index: number) => (
                <Link key={index} className="kxCard" to={`/where/${c.slug}`}>
                  <div className="kxCard__media"><img src={c.img} alt={c.name} /></div>
                  <div className="kxCard__body">
                    <h3 className="kxCard__title">{c.name}</h3>
                    <p className="kxCard__desc">{c.desc}</p>
                    <div className="kxCard__cta">
                      Explore <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default City;