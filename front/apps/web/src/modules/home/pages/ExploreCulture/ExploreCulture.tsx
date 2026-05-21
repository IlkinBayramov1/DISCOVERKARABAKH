import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Play } from 'lucide-react';
import Head from '../../components/SEO/Head';
import './ExploreCulture.css';

const ExploreCulture: React.FC = () => {
  return (
    <div className="page explore--culture">
      <Head pageTitle="Local Culture & Heritage — Discover Karabakh" />

      <main>
        {/* ─── HERO SECTION ────────────────────────────────────────────── */}
        <section className="culture-hero" id="top">
          <div className="container">
            <div className="culture-heroCard">
              <div className="culture-heroMedia" aria-hidden="true">
                <img
                  src="https://azerbaijan.travel/fit1600x900/center/pages/256/d445c6d6-a000-428e-801c-397b0138d52a.jpg"
                  alt="Karabakh Culture Hero"
                />
              </div>

              {/* The premium purple bloom + plum fade overlay */}
              <div className="culture-heroShade" aria-hidden="true"></div>

              <div className="culture-heroContent">
                <div className="culture-heroKicker">Local culture & heritage</div>
                <h1 className="culture-heroTitle">Karabakh: Land of Living Traditions</h1>

                <p className="culture-heroSub">
                  Karabakh is a historical cultural region—more than one city—known for music, poetry, carpets,
                  craftsmanship, cuisine, and mountain-to-steppe hospitality traditions.
                </p>

              </div>
            </div>
          </div>
        </section>

        {/* ─── ARTICLE BODY ────────────────────────────────────────────── */}
        <section className="article" id="traditions">
          <div className="container">
            
            {/* Intro */}
            <header className="articleHead">
              <h2 className="articleTitle">What makes Karabakh culturally unique?</h2>
              <p className="articleLead">
                From Shusha’s music and poetry traditions to mountain villages known for storytelling and craft,
                Karabakh’s heritage is shaped by art, landscape, and everyday social rituals.
              </p>
            </header>

            {/* 1. STORY BLOCK — Music & Poetry */}
            <section className="block" id="stories">
              <div className="blockRow">
                <div className="blockText">
                  <h3 className="blockH">Birthplace of Azerbaijani Music & Poetry</h3>
                  <p className="blockP">
                    Shusha is historically associated with Azerbaijan’s classical music and literary culture. It is known as the birthplace
                    of Uzeyir Hajibeyov (founder of Azerbaijani classical music) and as a home of prominent cultural figures
                    such as Bulbul, Khan Shushinski, and Natavan.
                  </p>
                  <p className="blockP">
                    Karabakh’s Mugham tradition has long been influential, while ashug storytelling traditions remain strong in
                    mountain areas such as Lachin and Kalbajar. Poetry salons and musical gatherings shaped the region’s identity.
                  </p>

                  <div className="miniGrid">
                    <article className="miniCard">
                      <div className="miniCard__k">Mugham heritage</div>
                      <div className="miniCard__t">A dominant school</div>
                      <p className="miniCard__p">Karabakh Mugham traditions influenced performance styles across Azerbaijan.</p>
                    </article>

                    <article className="miniCard">
                      <div className="miniCard__k">Ashug storytelling</div>
                      <div className="miniCard__t">Mountain tradition</div>
                      <p className="miniCard__p">Narrative songs and saz culture remain tied to village life and gatherings.</p>
                    </article>

                    <article className="miniCard">
                      <div className="miniCard__k">Poetry salons</div>
                      <div className="miniCard__t">Shusha literary circles</div>
                      <p className="miniCard__p">Poetry, music, and social salons shaped cultural memory and identity.</p>
                    </article>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://www.virtualkarabakh.az/sekiller/c6aacf12846594e1512676702.jpg" alt="Heritage scenery" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Quick context</div>
                    <div className="asideCallout__t">The cultural capital</div>
                    <p className="asideCallout__p">
                      A hub of music, poetry, and heritage routes—ideal for slow exploration and meaningful stops.
                    </p>
                    <Link className="asideLink" to="/where/shusha">Explore Shusha <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* 2. CRAFTS SECTION — Carpets */}
            <section className="block" id="crafts">
              <div className="blockRow blockRow--reverse">
                <div className="blockText">
                  <h3 className="blockH">Carpet Weaving & Artisan Traditions</h3>
                  <p className="blockP">
                    The Karabakh Carpet School is one of Azerbaijan’s major carpet traditions, known for distinctive compositions and
                    recognizable patterns. Historic styles are often associated with named local designs such as Dragon carpets,
                    Bakhchadagullari, and Shusha carpets.
                  </p>
                  <p className="blockP">
                    Traditional weaving draws on mountain sheep wool and natural dyes made from plants and minerals. Knowledge is
                    passed through generations, with motifs reflecting local taste, symbolism, and regional identity.
                  </p>

                  <div className="bulletCols">
                    <div className="bulletCol">
                      <h4 className="bulletH">Notable patterns</h4>
                      <ul className="bulletList">
                        <li>Dragon carpets</li>
                        <li>Bakhchadagullari</li>
                        <li>Malibayli & Shusha carpets</li>
                      </ul>
                    </div>

                    <div className="bulletCol">
                      <h4 className="bulletH">Materials & methods</h4>
                      <ul className="bulletList">
                        <li>Wool from mountain sheep</li>
                        <li>Natural dyes (plants & minerals)</li>
                        <li>Motifs tied to place and story</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://www.virtualkarabakh.az/sekiller/2c5a5a318c2da231521985363.jpg" alt="Craft tradition" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Modern revival</div>
                    <div className="asideCallout__t">Workshops & exhibitions</div>
                    <p className="asideCallout__p">
                      Reconstructed cultural spaces and craft exhibitions aim to reintroduce the Karabakh craft tradition.
                    </p>
                    <Link className="asideLink" to="/explore/about">Browse categories <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* 3. FOOD TRADITIONS */}
            <section className="block" id="food">
              <div className="blockRow">
                <div className="blockText">
                  <h3 className="blockH">Cuisine of the Mountains & Valleys</h3>
                  <p className="blockP">
                    Karabakh cuisine reflects pastoral life, seasonal produce, and hospitality culture. Food is often built around
                    gatherings—family tables, celebrations, and welcoming guests.
                  </p>

                  <div className="featureList">
                    <article className="feat">
                      <h4 className="feat__t">Traditional dishes</h4>
                      <ul className="feat__ul">
                        <li>Karabakh plov variations</li>
                        <li>Herb qutab from mountain villages</li>
                        <li>Tandir bread traditions</li>
                        <li>Dovga soup from pastoral lifestyle</li>
                      </ul>
                    </article>

                    <article className="feat">
                      <h4 className="feat__t">Cultural meaning</h4>
                      <ul className="feat__ul">
                        <li>Hospitality table culture</li>
                        <li>Wedding food rituals</li>
                        <li>Seasonal cooking traditions</li>
                        <li>Shared meals as social time</li>
                      </ul>
                    </article>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://www.azernews.az/media/2017/11/24/qarabagh_mtb.jpg" alt="Karabakh cuisine" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Taste & place</div>
                    <div className="asideCallout__t">Hospitality starts at the table</div>
                    <p className="asideCallout__p">
                      Meals are often the first step of hosting—tea, conversation, then shared dishes.
                    </p>
                    <Link className="asideLink" to="/things-to-do/restaurants">Explore food & dining <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* ─── HERITAGE SITES DISCOVERY CARDS ──────────────────────── */}
            <section className="cards" id="heritage-cards">
              <header className="cardsHead">
                <h3 className="cardsTitle">Heritage sites discovery cards</h3>
                <p className="cardsSub">Start with these cultural highlights and routes across Karabakh.</p>
              </header>

              <div className="cardGrid">
                <Link className="placeCard" to="/where/shusha">
                  <div className="placeCard__img">
                    <img src="https://idsb.tmgrup.com.tr/ly/uploads/images/2023/11/15/301158.jpg" alt="Shusha" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Heritage</div>
                    <div className="placeCard__t">Shusha historical quarter</div>
                    <div className="placeCard__d">Historic streets, cultural venues, and heritage routes.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard" to="/things-to-do/attractions">
                  <div className="placeCard__img">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3d/A%C5%9Fa%C4%9F%C4%B1_G%C3%B6vh%C9%99r_a%C4%9Fa_m%C9%99scidi_restavrasiya_i%C5%9Fl%C9%99rind%C9%99n_sonra%2C_2024-c%C3%BC_ild%C9%99.jpg" alt="Govhar Agha" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Landmark</div>
                    <div className="placeCard__t">Govhar Agha Mosque</div>
                    <div className="placeCard__d">A cultural landmark connected to Shusha’s historic fabric.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard" to="/things-to-do/attractions">
                  <div className="placeCard__img">
                    <img src="https://shusha.gov.az/storage/app/uploads/public/659/c04/400/659c044004d55024880413.jpg" alt="Natavan House" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Culture</div>
                    <div className="placeCard__t">Natavan House</div>
                    <div className="placeCard__d">A stop tied to Karabakh’s poetry and cultural memory.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>
              </div>
            </section>

          </div>
        </section>
      </main>
    </div>
  );
};

export default ExploreCulture;