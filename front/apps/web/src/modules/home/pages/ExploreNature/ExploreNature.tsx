import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Head from '../../components/SEO/Head';
import './ExploreNature.css';

const ExploreNature: React.FC = () => {
  return (
    <div className="page explore--nature">
      <Head pageTitle="Nature & Landscapes — Discover Karabakh" />

      <main>
        {/* ─── HERO SECTION ────────────────────────────────────────────── */}
        <section className="nature-hero" id="top">
          <div className="container">
            <div className="nature-heroCard">
              <div className="nature-heroMedia" aria-hidden="true">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/05/Mount_Kirs.jpg"
                  alt="Mount Kirs Karabakh"
                />
              </div>

              {/* The premium purple bloom + plum fade overlay */}
              <div className="nature-heroShade" aria-hidden="true"></div>

              <div className="nature-heroContent">
                <div className="nature-heroKicker">Nature & landscapes</div>
                <h1 className="nature-heroTitle">Mountains, Forests & Wild Valleys</h1>

                <p className="nature-heroSub">
                  From alpine ridges and forest trails to river valleys and mineral springs, Karabakh’s nature is shaped by
                  dramatic elevation, seasonal contrast, and wide open routes between regions.
                </p>

              </div>
            </div>
          </div>
        </section>

        {/* ─── ARTICLE BODY ────────────────────────────────────────────── */}
        <section className="article" id="types">
          <div className="container">
            
            {/* Intro */}
            <header className="articleHead">
              <h2 className="articleTitle">Start with the landscape type</h2>
              <p className="articleLead">
                Choose a nature category to match your travel style—easy viewpoints, forest walks, alpine routes, rivers,
                or wellness landscapes around mineral springs.
              </p>
            </header>

            {/* 1. NATURE BY TYPE */}
            <section className="cards">
              <header className="cardsHead">
                <h3 className="cardsTitle">Nature by type</h3>
                <p className="cardsSub">Browse by landscape to plan your next stop.</p>
              </header>

              <div className="cardGrid cardGrid--types">
                <Link className="placeCard placeCard--type" to="/things-to-do/attractions?category=mountains">
                  <div className="placeCard__img">
                    <img src="https://footontheroad.com/wp-content/uploads/2025/08/nagorno-karabakh.webp" alt="Mountains" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Popular</div>
                    <div className="placeCard__t">Mountains & ridges</div>
                    <div className="placeCard__d">Alpine views, high passes, and dramatic elevation routes.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard placeCard--type" to="/things-to-do/attractions?category=forests">
                  <div className="placeCard__img">
                    <img src="https://files.modern.az/articles/2022/12/24/1671869642_1567507823_meseler.jpg" alt="Forests" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Popular</div>
                    <div className="placeCard__t">Forests & trails</div>
                    <div className="placeCard__d">Shaded walks, calm routes, and fresh air stops.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard placeCard--type" to="/things-to-do/attractions?category=rivers">
                  <div className="placeCard__img">
                    <img src="https://eu2.contabostorage.com/71933ea89b5a4d0ca528a15679956e5d:azerbaijannews/uploads/img/posts/2022/08/07/hekeri-cayijpg-1659818660.jpg" alt="Rivers" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Popular</div>
                    <div className="placeCard__t">Rivers & valleys</div>
                    <div className="placeCard__d">Riverbanks, valley panoramas, and scenic drive pull-offs.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard placeCard--type" to="/things-to-do/wellness?category=springs">
                  <div className="placeCard__img">
                    <img src="https://fed.az/upload/news/358065.jpg" alt="Springs" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Popular</div>
                    <div className="placeCard__t">Mineral springs</div>
                    <div className="placeCard__d">Wellness landscapes and highland spring traditions.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard placeCard--type" to="/things-to-do/attractions?category=viewpoints">
                  <div className="placeCard__img">
                    <img src="https://sevinclidunya.wordpress.com/wp-content/uploads/2015/04/95517747.jpg" alt="Viewpoints" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Popular</div>
                    <div className="placeCard__t">Viewpoints</div>
                    <div className="placeCard__d">Quick stops for panoramas—ideal for short itineraries.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard placeCard--type" to="/things-to-do/tours?category=nature">
                  <div className="placeCard__img">
                    <img src="https://www.virtualkarabakh.az/sekiller/da63108bb0c61515670390.jpg" alt="Nature Tours" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Popular</div>
                    <div className="placeCard__t">Guided nature trips</div>
                    <div className="placeCard__d">Local guides, curated routes, and photo-ready stops.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>
              </div>
            </section>

            {/* 2. TOP NATURE SPOTS */}
            <section className="cards" id="spots">
              <header className="cardsHead">
                <h3 className="cardsTitle">Top nature spots</h3>
                <p className="cardsSub">Iconic landscapes and easy starting points for your visit.</p>
              </header>

              <div className="cardGrid">
                <Link className="placeCard" to="/where/kalbajar">
                  <div className="placeCard__img">
                    <img src="https://www.qanunla.az/public/storage/2023/11/media-16046-1606287750-oe178xyu90brgnwzihm4.jpg" alt="Kalbajar" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Highlands</div>
                    <div className="placeCard__t">Kalbajar alpine landscapes</div>
                    <div className="placeCard__d">Wide ridges, open valleys, and dramatic high-altitude routes.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard" to="/where/lachin">
                  <div className="placeCard__img">
                    <img src="https://qafqazinfo.az/uploads/1606827858/lacinsss.jpg" alt="Lachin" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Trails</div>
                    <div className="placeCard__t">Lachin mountain routes</div>
                    <div className="placeCard__d">Scenic roads, ridgelines, and mountain village viewpoints.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard" to="/where/aghdere">
                  <div className="placeCard__img">
                    <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80" alt="Aghdere" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Forests</div>
                    <div className="placeCard__t">Aghdere forest scenery</div>
                    <div className="placeCard__d">Green corridors, calm routes, and slower nature exploration.</div>
                    <div className="placeCard__cta">Explore <ChevronRight size={16} /></div>
                  </div>
                </Link>
              </div>

              <div className="cardsFoot">
                <Link className="linkBtn" to="/things-to-do/attractions?category=nature">Browse all nature spots <ChevronRight size={16} /></Link>
                <Link className="linkBtn linkBtn--primary" to="/things-to-do/tours?category=nature">Book a nature tour <ChevronRight size={16} /></Link>
              </div>
            </section>

            {/* 3. BEST SEASONS (Stripe & Badge Cards) */}
            <section className="cards" id="seasons">
              <header className="cardsHead">
                <h3 className="cardsTitle">Best seasons</h3>
                <p className="cardsSub">Pick the right time for the landscape you want to see.</p>
              </header>

              <div className="seasonGrid">
                <div className="seasonTile">
                  <div className="seasonTile__k">Spring</div>
                  <div className="seasonTile__t">Fresh valleys & wild greens</div>
                  <div className="seasonTile__d">Best for soft weather, easy walks, and scenic drives.</div>
                </div>
                <div className="seasonTile">
                  <div className="seasonTile__k">Summer</div>
                  <div className="seasonTile__t">Highlands & cooler altitude</div>
                  <div className="seasonTile__d">Ideal for mountains, ridge viewpoints, and longer hikes.</div>
                </div>
                <div className="seasonTile">
                  <div className="seasonTile__k">Autumn</div>
                  <div className="seasonTile__t">Color, contrast, and calm routes</div>
                  <div className="seasonTile__d">Great for photography, forests, and golden-hour panoramas.</div>
                </div>
                <div className="seasonTile">
                  <div className="seasonTile__k">Winter</div>
                  <div className="seasonTile__t">Quiet landscapes & selective routes</div>
                  <div className="seasonTile__d">Best for low-crowd travel—plan carefully for road conditions.</div>
                </div>
              </div>
            </section>

            {/* 4. NATURE ROUTES */}
            <section className="cards" id="routes">
              <header className="cardsHead">
                <h3 className="cardsTitle">Nature routes</h3>
                <p className="cardsSub">Ready-to-use itineraries for half-day and full-day exploration.</p>
              </header>

              <div className="routeGrid">
                <Link className="placeCard" to="/explore/articles/kalbajar-loop">
                  <div className="placeCard__img">
                    <img src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1400&q=80" alt="Kalbajar Route" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Full day</div>
                    <div className="placeCard__t">Highland loop (Kalbajar focus)</div>
                    <div className="placeCard__d">Alpine roads, wide views, and spring-style landscape stops.</div>
                    <div className="placeCard__cta">Read route <ChevronRight size={16} /></div>
                  </div>
                </Link>

                <Link className="placeCard" to="/explore/articles/lachin-viewpoints">
                  <div className="placeCard__img">
                    <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80" alt="Lachin Route" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Half day</div>
                    <div className="placeCard__t">Lachin ridge viewpoints</div>
                    <div className="placeCard__d">Quick panoramas, scenic pull-offs, and short walks.</div>
                    <div className="placeCard__cta">Read route <ChevronRight size={16} /></div>
                  </div>
                </Link>
              </div>
            </section>

            {/* ─── END CTA (Vibrant Purple Banner) ───────────────────────── */}
            <section className="endCta" id="map">
              <div className="endCta__card">
                <div className="endCta__text">
                  <h3>Explore Karabakh nature on the map</h3>
                  <p>
                    Filter by landscape type, find viewpoints, and plan routes between regions. Use the map view to build your day.
                  </p>
                </div>
                <div className="endCta__actions">
                  <Link className="btn btn--ghost" style={{borderColor: 'rgba(255,255,255,0.4)'}} to="/map?layer=nature">
                    Explore on map <ChevronRight size={16} />
                  </Link>
                  <Link className="btn" style={{background: '#fff', color: '#6a28c7'}} to="/things-to-do/attractions?category=nature">
                    Browse all spots <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </section>
      </main>
    </div>
  );
};

export default ExploreNature;