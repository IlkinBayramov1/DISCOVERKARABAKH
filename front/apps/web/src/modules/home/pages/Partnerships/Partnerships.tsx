import React from 'react';
import { Link } from 'react-router-dom';
import Head from '../../components/SEO/Head';
import './Partnerships.css';

const Partnerships: React.FC = () => {
  return (
    <div className="page part">
      <Head pageTitle="Strategic Partnerships - Discover Karabakh" />

      <main>
        {/* HERO SECTION */}
        <section className="partHero">
          <div className="container">
            <div className="partHero__card">
              <div className="partHero__img" aria-hidden="true">
                <img src="https://www.hieronica-limited.com/images/blog/mou7.jpg" alt="Business Partnerships in Karabakh" />
              </div>
              <div className="partHero__shade" aria-hidden="true"></div>

              <div className="partHero__content text-center mx-auto">
                <div className="partHero__k">B2B & B2G Ecosystem</div>
                <h1 className="partHero__t">Strategic Partnerships</h1>
                <p className="partHero__s mx-auto">
                  Join a dynamic network of global enterprises, investors, and local innovators. Together, we are building the future of sustainable infrastructure, green energy, and digital tourism in the Karabakh economic zone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="partBenefits">
          <div className="container">
            <div className="partHeader text-center">
              <h2>Why Partner With Us?</h2>
              <p>Discover Karabakh serves as your centralized facilitator, bridging the gap between international expertise and local mega-projects.</p>
            </div>

            <div className="partBenefits__grid">
              <div className="pCard">
                <div className="pCard__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="pCard__t">Government Backing & Security</h3>
                <p className="pCard__d">Operate with confidence through state-guaranteed investment frameworks, priority processing, and secure land-lease agreements within designated economic zones.</p>
              </div>

              <div className="pCard">
                <div className="pCard__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3 className="pCard__t">Tax Exemptions & Incentives</h3>
                <p className="pCard__d">Benefit from 10-year exemptions on profit, property, land, and simplified taxes for residents of the Aghdam and Araz Valley Industrial Parks.</p>
              </div>

              <div className="pCard">
                <div className="pCard__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3 className="pCard__t">Market Entry</h3>
                <p className="pCard__d">Leverage our "International Corner" network for streamlined B2B matching, localized operational setup, and rapid integration into the regional supply chain.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTORS (BENTO GRID) */}
        <section className="partSectors">
          <div className="container">
            <div className="partHeader">
              <h2>Areas of Collaboration</h2>
              <p>We are actively seeking strategic alliances across four core pillars of regional development.</p>
            </div>

            <div className="bentoGrid">
              <Link to="/corporate/investments" className="bentoItem bentoItem--large">
                <div className="bentoItem__img" aria-hidden="true">
                  <img src="https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg" alt="Smart City Tech" />
                </div>
                <div className="bentoItem__shade"></div>
                <div className="bentoItem__content">
                  <div className="pill pill--tech">Smart Infrastructure</div>
                  <h3>Technology & Urban Innovation</h3>
                  <p>Joint ventures in 5G deployment, IoT-enabled utilities, smart grid management, and sustainable urban planning.</p>
                </div>
              </Link>

              <Link to="/things-to-do/attractions" className="bentoItem">
                <div className="bentoItem__img" aria-hidden="true">
                  <img src="https://azerbaijan.travel/resize3000/center/pages/9166/0af37ede-c016-4967-88d6-3ea71a019307.png" alt="Tourism" />
                </div>
                <div className="bentoItem__shade"></div>
                <div className="bentoItem__content">
                  <div className="pill pill--tour">Hospitality</div>
                  <h3>Tourism Ecosystem</h3>
                  <p>Co-development of eco-resorts, digital heritage platforms, and premium hospitality networks.</p>
                </div>
              </Link>

              <Link to="/corporate/investments" className="bentoItem">
                <div className="bentoItem__img" aria-hidden="true">
                  <img src="https://azertag.az/xeber/2021/05/17/1792694_1_1_2.jpg" alt="Energy" />
                </div>
                <div className="bentoItem__shade"></div>
                <div className="bentoItem__content">
                  <div className="pill pill--energy">Green Energy</div>
                  <h3>Renewables</h3>
                  <p>Partnerships in solar, hydro, and wind energy generation to power the region's Net-Zero targets.</p>
                </div>
              </Link>

              <Link to="/corporate/investments" className="bentoItem bentoItem--wide">
                <div className="bentoItem__img" aria-hidden="true">
                  <img src="https://fed.az/upload/news/358065.jpg" alt="Agriculture" />
                </div>
                <div className="bentoItem__shade"></div>
                <div className="bentoItem__content">
                  <div className="pill pill--agri">Agri-Tech</div>
                  <h3>Precision Agriculture & Light Industry</h3>
                  <p>Establishing advanced agro-industrial parks, automated irrigation networks, and textile manufacturing facilities.</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* PROCESS TIMELINE */}
        <section className="partProcess">
          <div className="container">
            <div className="partHeader text-center">
              <h2>How We Work Together</h2>
              <p>A streamlined, transparent four-step process to transform your proposal into an operational reality.</p>
            </div>

            <div className="processTimeline">
              {[
                { n: "01", t: "Inquiry & Discovery", d: "Submit your initial proposal. Our sector specialists will review your capabilities." },
                { n: "02", t: "Strategic Alignment", d: "Engage in facilitated dialogues with relevant state agencies and municipalities." },
                { n: "03", t: "Structuring & Approvals", d: "Formalize the partnership framework and secure tax-exempt residency status." },
                { n: "04", t: "Execution & Scale", d: "Launch operations with dedicated on-the-ground support from our team." }
              ].map((step, idx) => (
                <div key={idx} className="processStep">
                  <div className="stepNum">{step.n}</div>
                  <h4 className="stepTitle">{step.t}</h4>
                  <p className="stepDesc">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="ctaSplit" id="partner-cta">
          <div className="container">
            <div className="ctaSplit__card">
              <div 
                className="ctaSplit__media" 
                style={{ 
                  backgroundImage: "url('https://wmf.imgix.net/images/ca_aerial_view_of_dadivank_monastery_built_between_the_9th_and_13th_centuries._copy.jpg')", 
                  backgroundSize: 'cover' 
                }} 
                aria-hidden="true"
              ></div>

              <div className="ctaSplit__content">
                <div className="ctaSplit__badge">Get Involved</div>
                <h3 className="ctaSplit__title">Ready to build the future?</h3>
                <p className="ctaSplit__text">
                  Whether you are an institutional investor, a technology provider, or an academic institution, we want to hear from you. Reach out to our Partnerships Desk to initiate the dialogue.
                </p>
                <div className="ctaSplit__actions">
                  <Link className="ctaSplit__primary" to="/contact">Submit Partnership Inquiry</Link>
                  <a className="ctaSplit__secondary" href="/downloads/partnership-deck.pdf" download>Download Pitch Deck</a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Partnerships;