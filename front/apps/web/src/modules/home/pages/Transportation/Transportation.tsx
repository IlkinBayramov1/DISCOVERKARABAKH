import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Navigation, ExternalLink, CheckCircle2 } from 'lucide-react';
import Head from '../../components/SEO/Head';
import './Transportation.css';

const Transportation: React.FC = () => {
  return (
    <div className="page explore--transportation">
      <Head pageTitle="Getting to & Getting Around - Discover Karabakh" />

      <main>
        {/* ─── HERO SECTION ────────────────────────────────────────────── */}
        <section className="transportation-hero" id="top">
          <div className="container">
            <div className="transportation-heroCard">
              <div className="transportation-heroMedia" aria-hidden="true">
                <img
                  src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=2200&q=80"
                  alt="Transportation in Karabakh"
                />
              </div>

              {/* Premium purple bloom + plum fade overlay */}
              <div className="transportation-heroShade" aria-hidden="true"></div>

              <div className="transportation-heroContent">
                <div className="transportation-heroKicker">Transportation</div>
                <h1 className="transportation-heroTitle">Getting to & getting around Karabakh</h1>

                <p className="transportation-heroSub">
                  Plan your arrival and daily mobility with clear options: flights, VIP transfers, taxis, intercity buses,
                  car rental, and rail routes. Choose what matches your itinerary and comfort level.
                </p>

              </div>

              {/* Glassmorphism Quick Action Button */}
              <a className="transportation-heroPlay" href="#how-to-get" aria-label="Jump to getting there">
                <div className="playIconWrapper">
                    <Navigation size={16} className="playIconSvg" />
                </div>
                <span className="playText">Build a route</span>
              </a>
            </div>
          </div>
        </section>

        {/* ─── ARTICLE SECTION ─────────────────────────────────────────── */}
        <section className="transportation-article" id="how-to-get">
          <div className="container">
            {/* INTRO */}
            <header className="articleHead">
              <h2 className="articleTitle">Start with your arrival plan</h2>
              <p className="articleLead">
                Karabakh trips usually combine one arrival method (flight or road) with a local mobility plan (VIP transfer,
                taxi, rental car, or intercity transport). Below is a structured overview.
              </p>
            </header>

            {/* ─── ARRIVAL OPTIONS GRID ────────────────────────────────────── */}
            <section className="cards" id="arrivals">
              <header className="cardsHead">
                <h3 className="cardsTitle">Getting to Karabakh</h3>
                <p className="cardsSub">Choose your arrival method based on time, comfort, and itinerary.</p>
              </header>

              <div className="cardGrid">
                {/* Flight Card */}
                <div className="placeCard">
                  <div className="placeCard__img">
                    <img src="https://www.azal.az/_next/static/media/1_8dccc315b5.jpg" alt="AZAL Flights" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Flights</div>
                    <div className="placeCard__t">AZAL flights (regional access)</div>
                    <div className="placeCard__d">Fastest way to reach the region—then connect by transfer or taxi.</div>
                    <a href="https://www.azal.az" target="_blank" rel="noreferrer" className="placeCard__cta">
                      Learn more <ExternalLink size={16} />
                    </a>
                  </div>
                </div>

                {/* VIP Transfer Card */}
                <div className="placeCard">
                  <div className="placeCard__img">
                    <img src="https://ecs-serbia.com/wp-content/webp-express/doc-root/wp-content/uploads/2025/09/Mercedes-v-klasa-2024-1-832x460.jpg.webp" alt="VIP Transfer" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Premium</div>
                    <div className="placeCard__t">VIP transfer / private driver</div>
                    <div className="placeCard__d">Door-to-door routes, scheduled pickups, and comfort-first travel.</div>
                    <Link to="/contact" className="placeCard__cta">
                      Explore options <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Intercity Road Card */}
                <div className="placeCard">
                  <div className="placeCard__img">
                    <img src="https://konkret.az/cloud/uploads/2020/10/a1-16.jpg" alt="Road Routes" />
                  </div>
                  <div className="placeCard__b">
                    <div className="placeCard__k">Road</div>
                    <div className="placeCard__t">Intercity road routes</div>
                    <div className="placeCard__d">Flexible for multi-stop itineraries—best with a clear plan and timing.</div>
                    <Link to="/explore/articles" className="placeCard__cta">
                      See guidance <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── FLIGHTS DETAIL ──────────────────────────────────────────── */}
            <section className="block" id="flights">
              <div className="blockRow">
                <div className="blockText">
                  <h3 className="blockH">Flights: AZAL and airport connections</h3>
                  <p className="blockP">
                    If you arrive by flight, treat the airport as your “entry point” and plan your onward transport ahead of time.
                    The best approach is to pre-book a transfer or know your taxi plan before landing.
                  </p>

                  <div className="miniGrid">
                    <article className="miniCard">
                      <div className="miniCard__k">Best for</div>
                      <div className="miniCard__t">Short trips & tight schedules</div>
                      <p className="miniCard__p">Arrive quickly, then move by transfer/taxi to your destination city.</p>
                    </article>
                    <article className="miniCard">
                      <div className="miniCard__k">Plan ahead</div>
                      <div className="miniCard__t">Pickup time & luggage</div>
                      <p className="miniCard__p">Confirm arrival time, baggage needs, and vehicle size (especially groups).</p>
                    </article>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/58/Fuzuli_International_Airport_Entrance.jpg" alt="Fuzuli Airport" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Recommended</div>
                    <div className="asideCallout__t">Pre-book your airport pickup</div>
                    <p className="asideCallout__p">It reduces uncertainty and helps you connect directly to your hotel or first stop.</p>
                    <Link className="asideLink" to="/contact">Book VIP transfer <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* ─── VIP TRANSFERS DETAIL ────────────────────────────────────── */}
            <section className="block" id="vip">
              <div className="blockRow blockRow--reverse">
                <div className="blockText">
                  <h3 className="blockH">VIP transfers: private driver & premium vehicles</h3>
                  <p className="blockP">
                    VIP transport is the most reliable option for multi-city routes (e.g., Shusha + Lachin + Kalbajar),
                    family travel, business visitors, or anyone who wants a predictable schedule.
                  </p>

                  <div className="bulletCols">
                    <div className="bulletCol">
                      <h4 className="bulletH">What you get</h4>
                      <ul className="bulletList">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Door-to-door pick up</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Fixed route or hourly rental</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Professional driver</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Comfort stops on request</li>
                      </ul>
                    </div>
                    <div className="bulletCol">
                      <h4 className="bulletH">Best for</h4>
                      <ul className="bulletList">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Families & groups</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Business travel</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Multi-stop itineraries</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/40/be/eb/private-driver.jpg?w=1200&h=900&s=1" alt="Private Driver" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Service</div>
                    <div className="asideCallout__t">VIP Transfer module</div>
                    <p className="asideCallout__p">Compare categories, luggage capacity, and pricing models.</p>
                    <Link className="asideLink" to="/contact">Open VIP transfers <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* ─── RENTAL DETAIL ───────────────────────────────────────────── */}
            <section className="block" id="rental">
              <div className="blockRow blockRow--reverse">
                <div className="blockText">
                  <h3 className="blockH">Car rental: freedom for routes</h3>
                  <p className="blockP">
                    Rental cars work best if you want full control: sunrise stops, flexible photography pull-offs,
                    and day routes between regions. It’s ideal for confident drivers.
                  </p>

                  <div className="twoUp">
                    <article className="twoUp__card">
                      <h4 className="twoUp__t">Pros</h4>
                      <ul className="twoUp__ul">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Maximum flexibility</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Easy multi-stop routes</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Great for nature drives</li>
                      </ul>
                    </article>
                    <article className="twoUp__card">
                      <h4 className="twoUp__t">Considerations</h4>
                      <ul className="twoUp__ul">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Know your route timing</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Be weather-aware</li>
                      </ul>
                    </article>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://owltourism.az/wp-content/uploads/2024/06/Transaction-Tracking-and-Analytics-Steering-Car-Rental-banner.webp" alt="Car Rental" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Alternative</div>
                    <div className="asideCallout__t">Driver + car package</div>
                    <p className="asideCallout__p">Get flexibility without driving fatigue—best for long scenic routes.</p>
                    <Link className="asideLink" to="/contact">See packages <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* ─── TIPS SECTION ────────────────────────────────────────────── */}
            <section className="cards" id="tips">
              <header className="cardsHead">
                <h3 className="cardsTitle">Prep & smart travel tips</h3>
                <p className="cardsSub">Small checks that make transport days smoother.</p>
              </header>

              <div className="infoGrid">
                <Link className="infoCard" to="/explore/articles">
                  <div className="infoCard__t">Weather & altitude</div>
                  <div className="infoCard__d">Mountain conditions can change quickly—plan by elevation.</div>
                  <div className="infoCard__cta">Read guide <ChevronRight size={16} /></div>
                </Link>
                <Link className="infoCard" to="/explore/articles">
                  <div className="infoCard__t">Route planning</div>
                  <div className="infoCard__d">Build a day plan with buffers and clear stop priorities.</div>
                  <div className="infoCard__cta">Read guide <ChevronRight size={16} /></div>
                </Link>
              </div>
            </section>

            {/* ─── FINAL CTA (Vibrant Purple Banner) ───────────────────────── */}
            <section className="endCta" id="map">
              <div className="endCta__card">
                <div className="endCta__text">
                  <h3>Explore transport options on the map</h3>
                  <p>
                    See transfer routes, key hubs, and destination clusters. Build a practical plan from arrival to daily movement.
                  </p>
                </div>

                <div className="endCta__actions">
                  <Link className="linkBtn linkBtn--primary" to="/map">
                    Explore on map <ChevronRight size={16} />
                  </Link>
                  <Link className="linkBtn" to="/contact">
                    Book VIP transfer <ChevronRight size={16} />
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

export default Transportation;