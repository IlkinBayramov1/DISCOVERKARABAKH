import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ExternalLink, CheckCircle2, Info, AlertTriangle, ShieldCheck } from 'lucide-react';
import Head from '../../components/SEO/Head';
import './VisaPermissions.css';

const VisaPermissions: React.FC = () => {
  return (
    <div className="page visaPerm">
      <Head pageTitle="Visa & Permissions - Discover Karabakh" />

      <main>
        {/* ─── HERO SECTION (Premium Purple Bloom) ───────────────────── */}
        <section className="vpHero" id="top">
          <div className="container">
            <div className="vpHero__card">
              <div className="vpHero__media" aria-hidden="true">
                <img src="https://www.azernews.az/media/2024/08/21/liberated_areas4-08-21_115302.png" alt="Visa and Permissions" />
              </div>
              
              {/* Premium purple bloom + plum fade overlay */}
              <div className="vpHero__shade" aria-hidden="true"></div>

              <div className="vpHero__content">
                <div className="vpHero__k">Visa & Permissions</div>
                <h1 className="vpHero__t">Entry to Azerbaijan and access to Karabakh</h1>
                <p className="vpHero__s">
                  Clear steps for travelers: Azerbaijan e-Visa basics (ASAN Visa), migration registration rules, and the “Yolumuz Qarabağa”
                  travel permission for visiting liberated territories by private car.
                </p>

                <div className="vpHero__actions">
                  <a className="vpBtn vpBtn--primary" href="#checklist">Start checklist <ChevronRight size={18} /></a>
                  <a className="vpBtn vpBtn--ghost" href="#visa">Azerbaijan e-Visa <ChevronRight size={18} /></a>
                  <a className="vpBtn vpBtn--ghost" href="#yolumuz">Yolumuz Qarabağa portal <ChevronRight size={18} /></a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── YOLUMUZ QARABAGA PORTAL INFO ─────────────────────────────── */}
        <section className="vpSection" id="yolumuz">
          <div className="container">
            <header className="vpHead">
              <h2 className="vpHead__t">“Yolumuz Qarabağa” travel permission (Karabakh)</h2>
              <p className="vpHead__s">
                Travel to liberated territories by private passenger car is managed via the “Yolumuz Qarabağa” portal. Rules focus on controlled access and mine safety.
              </p>
            </header>

            <div className="vpGrid vpGrid--3">
              <article className="vpCard">
                <h3 className="vpCard__t">What it is</h3>
                <p className="vpCard__p">
                  A digital permission system for organizing trips to liberated territories. You apply on the portal, pass verification,
                  and receive a time-bounded permission tied to your chosen destination.
                </p>
                <div className="vpHint">
                  <Info size={16} /> 
                  <span>Plan this step before you travel to the region—especially if you’re driving.</span>
                </div>
              </article>

              <article className="vpCard">
                <h3 className="vpCard__t">Vehicle limits & validity</h3>
                <ul className="vpCheck">
                  <li><CheckCircle2 size={16} /> Private passenger cars only (B category), with Azerbaijan state plate.</li>
                  <li><CheckCircle2 size={16} /> Maximum <strong>9 people</strong> per car including the driver.</li>
                  <li><CheckCircle2 size={16} /> Permit validity: <strong>5 days</strong>.</li>
                </ul>
                <div className="vpMini">
                  <div className="vpMini__k">Key point</div>
                  <div className="vpMini__v">Your permission is linked to the route—don’t improvise detours.</div>
                </div>
              </article>

              <article className="vpCard">
                <h3 className="vpCard__t">What you need to apply</h3>
                <ul className="vpCheck">
                  <li><CheckCircle2 size={16} /> Login (Citizens use <strong>mygovID</strong>)</li>
                  <li><CheckCircle2 size={16} /> Vehicle details</li>
                  <li><CheckCircle2 size={16} /> Email + mobile number</li>
                  <li><CheckCircle2 size={16} /> ID/passport details</li>
                  <li><CheckCircle2 size={16} /> Destination + trip timing</li>
                </ul>
              </article>
            </div>

            <div className="vpGrid vpGrid--2" style={{ marginTop: '24px' }}>
              <article className="vpCard">
                <div className="vpCard__icon"><AlertTriangle size={24} color="#ef4444" /></div>
                <h3 className="vpCard__t">Mine safety & travel rules</h3>
                <p className="vpCard__p">
                  Before traveling, drivers should read the portal’s guidance on mine safety. Avoid leaving the route and be especially careful at road junctions.
                </p>
                <ul className="vpList">
                  <li>Read mine-safety materials</li>
                  <li>Brief all passengers</li>
                  <li>Do not exit the approved route</li>
                  <li>Follow instructions at checkpoints</li>
                </ul>
              </article>

              <article className="vpCard">
                <div className="vpCard__icon"><ShieldCheck size={24} color="#6a28c7" /></div>
                <h3 className="vpCard__t">Planning utilities</h3>
                <p className="vpCard__p">
                  The portal also publishes information about hotels and restaurants
                  so travelers can contact venues in advance.
                </p>
                <a className="vpLink" href="https://yolumuzqarabaga.az/" target="_blank" rel="noreferrer">
                  Open Yolumuz Qarabağa <ExternalLink size={16} />
                </a>
              </article>
            </div>

            <div className="vpCallout">
              <div className="vpCallout__b">
                <div className="vpCallout__k">Fast next step</div>
                <div className="vpCallout__t">Need help preparing your e-Visa + permission details?</div>
                <p className="vpCallout__p">
                  We can structure your route and document fields so you submit correctly.
                </p>
              </div>
              <div className="vpCallout__actions">
                <Link className="vpBtn vpBtn--primary" to="/contact">Get assistance <ChevronRight size={18} /></Link>
                <a className="vpBtn vpBtn--outline" href="#faq">Read FAQ <ChevronRight size={18} /></a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRE-TRAVEL CHECKLIST ─────────────────────────────────────── */}
        <section className="vpSection" id="checklist">
          <div className="container">
            <header className="vpHead">
              <h2 className="vpHead__t">Pre-travel checklist</h2>
              <p className="vpHead__s">Use this to avoid the most common travel blockers.</p>
            </header>

            <div className="vpGrid vpGrid--3">
              <article className="vpCard">
                <div className="vpCard__top">
                  <div className="vpBadge">1</div>
                  <h3 className="vpCard__t">Passport validity</h3>
                </div>
                <p className="vpCard__p">
                  Your passport should be valid at least <strong>3 months beyond the e-Visa expiry date</strong>.
                </p>
              </article>

              <article className="vpCard">
                <div className="vpCard__top">
                  <div className="vpBadge">2</div>
                  <h3 className="vpCard__t">Visa path</h3>
                </div>
                <p className="vpCard__p">
                  Most travelers use <strong>ASAN Visa (e-Visa)</strong>. Confirm your eligibility before booking.
                </p>
              </article>

              <article className="vpCard">
                <div className="vpCard__top">
                  <div className="vpBadge">3</div>
                  <h3 className="vpCard__t">Migration registration</h3>
                </div>
                <p className="vpCard__p">
                  Staying <strong>15+ days</strong>? You must register at your place of stay. Hotels often help.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ─── ASAN VISA DETAILS ────────────────────────────────────────── */}
        <section className="vpSection" id="visa">
          <div className="container">
            <header className="vpHead">
              <h2 className="vpHead__t">Azerbaijan e-Visa (ASAN Visa)</h2>
              <p className="vpHead__s">Official requirements and processing times.</p>
            </header>

            <div className="vpSplit">
              <div className="vpSplit__main">
                <div className="vpInfo">
                  <h3 className="vpInfo__t">Processing time</h3>
                  <div className="vpInfoRow">
                    <div className="vpInfoRow__k">Standard e-Visa</div>
                    <div className="vpInfoRow__v">Issued within <strong>3 working days</strong>.</div>
                  </div>
                  <div className="vpInfoRow">
                    <div className="vpInfoRow__k">Urgent e-Visa</div>
                    <div className="vpInfoRow__v">Issued within <strong>3 hours</strong>.</div>
                  </div>
                </div>

                <div className="vpInfo">
                  <h3 className="vpInfo__t">Fees & Payment</h3>
                  <ul className="vpCheck">
                    <li><CheckCircle2 size={16} /> <strong>State fee:</strong> 20 USD</li>
                    <li><CheckCircle2 size={16} /> <strong>Service fee:</strong> 9 USD</li>
                    <li><CheckCircle2 size={16} /> <strong>Cards:</strong> Visa, Mastercard, UnionPay, JCB</li>
                  </ul>
                </div>

                <div className="vpInfo">
                  <h3 className="vpInfo__t">Eligible Countries</h3>
                  <details className="vpMiniDetails">
                    <summary className="vpMini__k">Show common eligible-country list</summary>
                    <div className="vpMini__v" style={{ marginTop: '12px' }}>
                      Algeria, Andorra, Argentina, Australia, Austria, Belgium, Brazil, Canada, China, 
                      France, Germany, India, Israel, Italy, Japan, Turkey, UK, USA, etc.
                    </div>
                  </details>
                </div>
              </div>

              <aside className="vpSplit__side">
                <div className="vpSideCard">
                  <div className="vpSideCard__k">Official portal</div>
                  <div className="vpSideCard__t">ASAN Visa</div>
                  <p className="vpSideCard__p">Apply directly through the government portal for the fastest processing times.</p>
                  <a className="vpLink" href="https://evisa.gov.az/en/" target="_blank" rel="noreferrer">
                    Open e-Visa portal <ExternalLink size={16} />
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ─── FAQ SECTION ──────────────────────────────────────────────── */}
        <section className="vpSection" id="faq">
          <div className="container">
            <header className="vpHead">
              <h2 className="vpHead__t">FAQ</h2>
              <p className="vpHead__s">Common questions travelers ask before booking.</p>
            </header>

            <div className="vpFaq">
              <article className="vpFaq__item">
                <h3 className="vpFaq__q">How fast is the e-Visa?</h3>
                <p className="vpFaq__a">Standard takes 3 days; Urgent takes 3 hours.</p>
              </article>
              <article className="vpFaq__item">
                <h3 className="vpFaq__q">Do I need migration registration?</h3>
                <p className="vpFaq__a">Only if your stay exceeds 15 days.</p>
              </article>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA (Vibrant Purple Banner) ───────────────────────── */}
        <section className="vpEnd">
          <div className="container">
            <div className="vpEnd__card">
              <div className="vpEnd__text">
                <h3>Ready to plan your Karabakh trip?</h3>
                <p>Use our planning tools to build routes and keep confirmations in one place.</p>
              </div>
              <div className="vpEnd__actions">
                <Link className="vpBtn vpBtn--primary" to="/contact">
                  Open trip planner <ChevronRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VisaPermissions;