import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, Ticket, CheckCircle2, ShieldCheck, Percent, Navigation, Plus, Minus } from 'lucide-react';
import Head from '../../components/SEO/Head';
import './DiscoverCard.css';

const DiscoverCard: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "What is the difference between the Card and the Pass?",
      a: "The Co-Brand Card is a physical/virtual payment card (Mastercard/Visa) that you use for everyday purchases, earning you cashback and loyalty points. The City Pass is a pre-paid digital ticket that grants you entry to specific museums, transport, and tours for a set number of days."
    },
    {
      q: "Can I use the Discover Karabakh Card outside the region?",
      a: "Yes. It functions as a standard international payment card. However, the exclusive cashback rates and premium VIP perks are specifically tied to our partner network within Karabakh and Azerbaijan."
    },
    {
      q: "How do I activate the City Pass?",
      a: "Once purchased via the app or web portal, the pass activates upon your first use at any supported attraction or transport terminal. It remains valid for the consecutive hours/days you purchased (e.g., 48 hours)."
    },
    {
      q: "Can I buy for a family or group?",
      a: "Yes—recommended. Group travel benefits from one consistent access method, but each traveler should have their own valid pass/card identity assigned in the app for transport gates."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="page explore--discovercard">
      <Head pageTitle="Co-Brand Card & City Pass - Discover Karabakh" />

      <main>
        {/* ─── HERO SECTION ────────────────────────────────────────────── */}
        <section className="discover-card-hero" id="top">
          <div className="container">
            <div className="discover-card-heroCard">
              <div className="discover-card-heroMedia" aria-hidden="true">
                {/* Fallback to a high-quality premium card/payment image if the local asset is missing */}
                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2200&q=80" 
                  alt="Discover Karabakh Card" 
                />
              </div>

              {/* Premium purple bloom + plum fade overlay */}
              <div className="discover-card-heroShade" aria-hidden="true"></div>

              <div className="discover-card-heroContent">
                <div className="discover-card-heroKicker">Discover Karabakh</div>
                <h1 className="discover-card-heroTitle">Co-Brand Card & City Pass</h1>
                <p className="discover-card-heroSub">
                  One unified payment and access solution across Karabakh — 
                  transportation, hotels, restaurants, attractions and more — 
                  with exclusive discounts and seamless experiences.
                </p>

                <div className="discover-card-heroCtas">
                  <a className="btn btn--primary" href="#card">Explore Card <ChevronRight size={18} /></a>
                  <a className="btn btn--ghost" href="#pass">City Pass <ChevronRight size={18} /></a>
                </div>
              </div>

              {/* Glassmorphism Quick Action Button */}
              <a className="discover-card-heroPlay" href="#benefits" aria-label="View benefits">
                <div className="playIconWrapper">
                    <CreditCard size={16} className="playIconSvg" />
                </div>
                <span className="playText">View benefits</span>
              </a>
            </div>
          </div>
        </section>

        {/* ─── ARTICLE SECTION ─────────────────────────────────────────── */}
        <section className="discover-card-article">
          <div className="container">
            {/* INTRO */}
            <header className="articleHead">
              <h2 className="articleTitle">Your master key to the region</h2>
              <p className="articleLead">
                Whether you want a long-term banking solution with loyalty perks or a short-term 
                pass for a weekend trip, our digital ecosystem makes traveling cash-free and effortless.
              </p>
            </header>

            {/* ─── THE CARD ──────────────────────────────────────────────── */}
            <section className="block" id="card">
              <div className="blockRow">
                <div className="blockText">
                  <div className="blockTag">For frequent travelers</div>
                  <h3 className="blockH">The Co-Brand Payment Card</h3>
                  <p className="blockP">
                    A fully-fledged international payment card integrated directly into the Discover Karabakh app. 
                    Use it anywhere, but unlock massive value when using it within our regional partner network.
                  </p>

                  <div className="featureList">
                    <article className="feat">
                      <h4 className="feat__t">Core Benefits</h4>
                      <ul className="feat__ul">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Up to 15% cashback at partner hotels</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Priority restaurant reservations</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Zero fees on local ATM withdrawals</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Apple Pay & Google Pay ready</li>
                      </ul>
                    </article>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80" alt="Payment Card" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Banking Partner</div>
                    <div className="asideCallout__t">Secure & Regulated</div>
                    <p className="asideCallout__p">
                      Issued in partnership with top national banks, ensuring your funds are protected by state guarantees.
                    </p>
                    <Link className="asideLink" to="/contact">Order your card <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* ─── THE PASS ──────────────────────────────────────────────── */}
            <section className="block" id="pass">
              <div className="blockRow blockRow--reverse">
                <div className="blockText">
                  <div className="blockTag blockTag--alt">For tourists & weekenders</div>
                  <h3 className="blockH">The Karabakh City Pass</h3>
                  <p className="blockP">
                    A digital, time-based QR pass that bundles your entire itinerary into one upfront price. 
                    Stop buying individual tickets and skip the queues at major landmarks.
                  </p>

                  <div className="featureList">
                    <article className="feat">
                      <h4 className="feat__t">What's included</h4>
                      <ul className="feat__ul">
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Free entry to 20+ museums & sites</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Unlimited local public transport</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Free guided walking tours in Shusha</li>
                        <li><CheckCircle2 size={16} className="bulletIcon" /> Fast-track entry at busy locations</li>
                      </ul>
                    </article>
                  </div>
                </div>

                <aside className="blockAside">
                  <div className="asideMedia">
                    <img src="https://images.unsplash.com/photo-1514580426463-fd77dc4d0672?auto=format&fit=crop&w=800&q=80" alt="City Pass App" />
                  </div>
                  <div className="asideCallout">
                    <div className="asideCallout__k">Instant Access</div>
                    <div className="asideCallout__t">100% Digital</div>
                    <p className="asideCallout__p">
                      Purchase in the app, get a dynamic QR code, and start exploring immediately. No physical pickup required.
                    </p>
                    <Link className="asideLink" to="/contact">Buy a City Pass <ChevronRight size={16} /></Link>
                  </div>
                </aside>
              </div>
            </section>

            {/* ─── VALUE PILLARS (Grid) ──────────────────────────────────── */}
            <section className="cards" id="benefits">
              <header className="cardsHead">
                <h3 className="cardsTitle">Why join the ecosystem?</h3>
                <p className="cardsSub">Designed to remove friction from your travel experience.</p>
              </header>

              <div className="infoGrid">
                <div className="infoCard">
                  <div className="infoCard__icon"><Percent size={28} /></div>
                  <div className="infoCard__t">Deep Discounts</div>
                  <div className="infoCard__d">
                    Our direct partnerships mean you pay less for hotels, dining, and transport than if you booked independently.
                  </div>
                </div>

                <div className="infoCard">
                  <div className="infoCard__icon"><Navigation size={28} /></div>
                  <div className="infoCard__t">Unified Transport</div>
                  <div className="infoCard__d">
                    Tap your card or scan your pass on intercity buses, local shuttles, and participating taxi services.
                  </div>
                </div>

                <div className="infoCard">
                  <div className="infoCard__icon"><ShieldCheck size={28} /></div>
                  <div className="infoCard__t">Secure & Cashless</div>
                  <div className="infoCard__d">
                    Travel with peace of mind. Leave the cash behind and track all your trip expenses neatly inside the app.
                  </div>
                </div>
              </div>
            </section>

            {/* ─── FAQ ─────────────────────────────────────────────────────── */}
            <section className="faqSection" id="faq">
              <header className="cardsHead">
                <h3 className="cardsTitle">Common questions</h3>
                <p className="cardsSub">Everything you need to know about the Card and Pass.</p>
              </header>

              <div className="faqGrid">
                {faqs.map((faq, index) => (
                  <div key={index} className={`faqItem ${openFaqIndex === index ? 'is-open' : ''}`}>
                    <button className="faqQ" onClick={() => toggleFaq(index)}>
                      <span>{faq.q}</span>
                      <span className="faqIcon">
                        {openFaqIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                      </span>
                    </button>
                    <div className="faqA">
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── FINAL CTA (Vibrant Purple Banner) ───────────────────────── */}
            <section className="endCta">
              <div className="endCta__card">
                <div className="endCta__text">
                  <h3>Ready to upgrade your Karabakh experience?</h3>
                  <p>
                    Join the Discover ecosystem, unlock exclusive value, and make your entire journey seamless from start to finish.
                  </p>
                </div>

                <div className="endCta__actions">
                  <Link className="linkBtn linkBtn--primary" to="/contact">
                    Apply for Card <ChevronRight size={16} />
                  </Link>
                  <Link className="linkBtn" to="/contact">
                    Get City Pass <Ticket size={16} style={{marginLeft: '4px'}} />
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

export default DiscoverCard;