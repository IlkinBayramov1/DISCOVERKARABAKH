import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, Info, MapPin } from 'lucide-react';
import Head from '../../components/SEO/Head';
import './Accommodation.css';

const Accommodation: React.FC = () => {
  return (
    <div className="page explore--accommodation">
      <Head pageTitle="Accommodation - Discover Karabakh" />

      <main>
        {/* ─── HERO SECTION ────────────────────────────────────────────── */}
        <section className="accommodation-hero" id="top">
          <div className="container">
            <div className="accommodation-heroCard">
              <div className="accommodation-heroMedia" aria-hidden="true">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=80" 
                  alt="Accommodation in Karabakh" 
                />
              </div>

              {/* Premium purple bloom + plum fade overlay */}
              <div className="accommodation-heroShade" aria-hidden="true"></div>

              <div className="accommodation-heroContent">
                <div className="accommodation-heroKicker">Accommodation</div>
                <h1 className="accommodation-heroTitle">Where to stay in Karabakh</h1>
                <p className="accommodation-heroSub">
                  From premium hotels and boutique stays to apartment rentals and family lodgings — 
                  choose the right base for your journey across Karabakh.
                </p>
              </div>

              {/* Glassmorphism Quick Action Button */}
              <a className="accommodation-heroPlay" href="#map" aria-label="View on map">
                <div className="playIconWrapper">
                    <MapPin size={16} className="playIconSvg" />
                </div>
                <span className="playText">Explore map</span>
              </a>
            </div>
          </div>
        </section>

        {/* ─── ARTICLE SECTION ─────────────────────────────────────────── */}
        <section className="accommodation-article">
          <div className="container">
            {/* INTRO */}
            <header className="articleHead">
              <h2 className="articleTitle">Choose your base wisely</h2>
              <p className="articleLead">
                Your accommodation defines your daily rhythm — access to attractions, sunrise views,
                dining options, and transport convenience. Below is a structured guide to staying in Karabakh.
              </p>
            </header>

            {/* ─── HOTELS ──────────────────────────────────────────────────── */}
            <section className="block" id="hotels">
              <div className="blockRow">
                <div className="blockText">
                  <h3 className="blockH">Hotels: comfort & full service</h3>
                  <p className="blockP">
                    Hotels are ideal for visitors who want structured comfort — reception support,
                    restaurant access, housekeeping, and concierge assistance.
                  </p>

                  <div className="featureList">
                    <article className="feat">
                      <h4 className="feat__t">Best for</h4>
                      <ul className="feat__ul">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Short city stays</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Business travel</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> First-time visitors</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Premium experience seekers</li>
                      </ul>
                    </article>

                    <article className="feat">
                      <h4 className="feat__t">Advantages</h4>
                      <ul className="feat__ul">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Daily housekeeping</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> On-site dining</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Security & reception</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Central locations</li>
                      </ul>
                    </article>
                  </div>

                  <div className="note">
                    <Info size={16} />
                    <span><strong>Tip:</strong> In Shusha and central hubs, book early during peak seasons or major events.</span>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://arsigroup.az/wp-content/uploads/2023/06/20230623_203051-1024x527.jpg" alt="City-center hotel" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Recommended</div>
                    <div className="asideCallout__t">City-center hotel</div>
                    <p className="asideCallout__p">
                      Ideal if your itinerary focuses on cultural landmarks and dining.
                    </p>
                    <Link className="asideLink" to="/hotels">Browse hotels <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* ─── APARTMENTS ──────────────────────────────────────────────── */}
            <section className="block" id="apartments">
              <div className="blockRow blockRow--reverse">
                <div className="blockText">
                  <h3 className="blockH">Apartments & rentals: flexibility & privacy</h3>
                  <p className="blockP">
                    Apartment rentals are perfect for longer stays, families, or travelers who prefer
                    independence and home-style living.
                  </p>

                  <div className="featureList">
                    <article className="feat">
                      <h4 className="feat__t">Best for</h4>
                      <ul className="feat__ul">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Families & groups</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Longer stays</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Remote workers</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Budget-conscious travelers</li>
                      </ul>
                    </article>

                    <article className="feat">
                      <h4 className="feat__t">Advantages</h4>
                      <ul className="feat__ul">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Kitchen access</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> More space</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Flexible check-in</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Local neighborhood experience</li>
                      </ul>
                    </article>
                  </div>

                  <div className="note">
                    <Info size={16} />
                    <span><strong>Consider:</strong> Check transport access if the rental is outside the city center.</span>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1400&q=80" alt="Apartment living" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Flexible stay</div>
                    <div className="asideCallout__t">Apartment living</div>
                    <p className="asideCallout__p">
                      Great balance between cost, comfort and independence.
                    </p>
                    <Link className="asideLink" to="/hotels?type=apartment">View apartments <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* ─── FINAL CTA (Vibrant Purple Banner) ───────────────────────── */}
            <section className="endCta" id="map">
              <div className="endCta__card">
                <div className="endCta__text">
                  <h3>Ready to find your perfect stay?</h3>
                  <p>
                    Browse available hotels, apartments, and boutique lodges. Filter by amenities, location, and price.
                  </p>
                </div>

                <div className="endCta__actions">
                  <Link className="linkBtn linkBtn--primary" to="/hotels">
                    Browse all stays <ChevronRight size={16} />
                  </Link>
                  <Link className="linkBtn" to="/map?layer=hotels">
                    View on map <MapPin size={16} />
                  </Link>
                </div>
              </div>
            </section>

          </div>
        </section>
      </main>
    </div>
  );
}

export default Accommodation;