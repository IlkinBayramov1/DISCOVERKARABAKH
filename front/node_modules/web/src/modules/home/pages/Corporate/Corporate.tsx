export default function Corporate() {
    return (
        <main className="corp-home">

            {/* HERO */}
            <section className="hero" id="home">
                <div className="container">
                    <div className="heroCard">
                        <div className="heroMedia" aria-hidden="true">
                            <img src="https://shusha.gov.az/storage/app/media/initial/Gala.jpg" alt="Karabakh Economic Zone" />
                        </div>
                        <div className="heroOverlay" aria-hidden="true"></div>
                        <div className="heroContent">
                            <div className="corpBadge">The Karabakh Economic Zone</div>
                            <h1 className="heroTitle">The Future is<br />Built Here</h1>
                            <p className="heroDesc">
                                The central gateway for foreign direct investment, strategic bilateral partnerships, and enterprise development in one of the world's fastest-growing economic revitalization zones.
                            </p>
                            <div className="heroCtas">
                                <a className="heroBtn heroBtn--primary" href="/corporate/investments">
                                    Explore Investments <span className="heroArrow" aria-hidden="true">›</span>
                                </a>
                                <a className="heroBtn heroBtn--ghost" href="/corporate/partnerships">
                                    Partner With Us <span className="heroArrow" aria-hidden="true">›</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="corpStats">
                <div className="container">
                    <div className="statsGrid">
                        <div className="statItem"><div className="statItem__val">$450M+</div><div className="statItem__lbl">Committed FDI</div></div>
                        <div className="statItem"><div className="statItem__val">10 Yrs</div><div className="statItem__lbl">Tax Exemptions</div></div>
                        <div className="statItem"><div className="statItem__val">3</div><div className="statItem__lbl">Industrial Parks</div></div>
                        <div className="statItem"><div className="statItem__val">12+</div><div className="statItem__lbl">Smart Infrastructure Projects</div></div>
                    </div>
                </div>
            </section>

            {/* PILLARS */}
            <section className="corpPillars" id="pillars">
                <div className="container">
                    <div className="sectionHead">
                        <h2>Corporate Ecosystem</h2>
                        <a className="sectionLink" href="/about-corporate">About the authority →</a>
                    </div>
                    <div className="pillarsGrid">
                        <a className="pillarCard" href="/corporate/investments">
                            <div className="pillarCard__media"><img src="https://azertag.az/xeber/2021/05/17/1792694_1_1_2.jpg" alt="Investments" /></div>
                            <div className="pillarCard__body">
                                <div className="pillarCard__kicker">Capital & Yield</div>
                                <div className="pillarCard__title">Investment Portfolio</div>
                                <p className="pillarCard__desc">Access high-yield, state-backed opportunities in renewable energy, smart agriculture, and tech.</p>
                                <div className="pillarCard__cta">View opportunities <span aria-hidden="true">→</span></div>
                            </div>
                        </a>
                        <a className="pillarCard" href="/corporate/partnerships">
                            <div className="pillarCard__media"><img src="https://www.hieronica-limited.com/images/blog/mou7.jpg" alt="Partnerships" /></div>
                            <div className="pillarCard__body">
                                <div className="pillarCard__kicker">B2B & B2G</div>
                                <div className="pillarCard__title">Strategic Partnerships</div>
                                <p className="pillarCard__desc">Collaborate on mega-projects, supply chain integration, and regional infrastructure development.</p>
                                <div className="pillarCard__cta">Learn how <span aria-hidden="true">→</span></div>
                            </div>
                        </a>
                        <a className="pillarCard" href="/corporate/international">
                            <div className="pillarCard__media"><img src="https://azerbaijan.travel/resize3000/center/pages/9166/0af37ede-c016-4967-88d6-3ea71a019307.png" alt="International Corner" /></div>
                            <div className="pillarCard__body">
                                <div className="pillarCard__kicker">Global Relations</div>
                                <div className="pillarCard__title">International Corner</div>
                                <p className="pillarCard__desc">Dedicated hubs for foreign governments and chambers of commerce to establish regional presence.</p>
                                <div className="pillarCard__cta">Explore hubs <span aria-hidden="true">→</span></div>
                            </div>
                        </a>
                        <a className="pillarCard" href="/corporate/careers">
                            <div className="pillarCard__media"><img src="https://wmf.imgix.net/images/ca_aerial_view_of_dadivank_monastery_built_between_the_9th_and_13th_centuries._copy.jpg" alt="Jobs Hub" /></div>
                            <div className="pillarCard__body">
                                <div className="pillarCard__kicker">Talent & Operations</div>
                                <div className="pillarCard__title">Jobs Hub</div>
                                <p className="pillarCard__desc">Discover careers and source elite talent to build and operate the new Karabakh economy.</p>
                                <div className="pillarCard__cta">Browse careers <span aria-hidden="true">→</span></div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* PRIORITY PROJECTS */}
            <section className="corpInvest">
                <div className="container">
                    <div className="sectionHead">
                        <h2>Priority Projects</h2>
                        <a className="sectionLink" href="/corporate/investments">View all projects →</a>
                    </div>
                    <div className="investGrid">
                        <article className="investCard">
                            <div className="investCard__media">
                                <img src="https://shusha.gov.az/storage/app/uploads/public/662/0b9/eda/6620b9eda8f16612520717.jpg" alt="Digital Tourism" />
                                <span className="corpTag">Digital & Tech</span>
                            </div>
                            <div className="investCard__body">
                                <div className="investCard__meta">Shusha • PPP</div>
                                <h3 className="investCard__title">Regional Digital Tourism & AR Infrastructure</h3>
                                <p className="investCard__desc">Development of a unified digital ecosystem, including AR wayfinding and smart ticketing.</p>
                                <div className="investMetrics">
                                    <div><span>CapEx</span><strong>$4.5M</strong></div>
                                    <div><span>IRR</span><strong>22%</strong></div>
                                    <div><span>Term</span><strong>5 Yrs</strong></div>
                                </div>
                            </div>
                        </article>
                        <article className="investCard">
                            <div className="investCard__media">
                                <img src="https://fed.az/upload/news/358065.jpg" alt="Agriculture" />
                                <span className="corpTag corpTag--alt">Agri-Tech</span>
                            </div>
                            <div className="investCard__body">
                                <div className="investCard__meta">Zangilan • State-Backed</div>
                                <h3 className="investCard__title">Smart Dairy & Precision Farming Zone</h3>
                                <p className="investCard__desc">Turnkey development of an automated 5,000-hectare agricultural zone and processing facility.</p>
                                <div className="investMetrics">
                                    <div><span>CapEx</span><strong>$28.0M</strong></div>
                                    <div><span>IRR</span><strong>18%</strong></div>
                                    <div><span>Term</span><strong>10 Yrs</strong></div>
                                </div>
                            </div>
                        </article>
                        <article className="investCard">
                            <div className="investCard__media">
                                <img src="https://azertag.az/xeber/2021/05/17/1792694_1_1_2.jpg" alt="Energy" />
                                <span className="corpTag">Renewable Energy</span>
                            </div>
                            <div className="investCard__body">
                                <div className="investCard__meta">Fuzuli • Green Energy Zone</div>
                                <h3 className="investCard__title">Fuzuli 100MW Solar Park</h3>
                                <p className="investCard__desc">Construction and operation of a 100MW PV plant with guaranteed 15-year state PPA.</p>
                                <div className="investMetrics">
                                    <div><span>CapEx</span><strong>$85.0M</strong></div>
                                    <div><span>IRR</span><strong>14%</strong></div>
                                    <div><span>Term</span><strong>15 Yrs</strong></div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            {/* CTA SPLIT */}
            <section className="ctaSplit" id="corporate-contact">
                <div className="container">
                    <div className="ctaSplit__card">
                        <div className="ctaSplit__media" style={{ backgroundImage: "url('https://i.redd.it/bfp6j7bias841.jpg')" }} aria-hidden="true"></div>
                        <div className="ctaSplit__content">
                            <div className="ctaSplit__badge">Corporate Services</div>
                            <h3 className="ctaSplit__title">Establish Your Operations</h3>
                            <p className="ctaSplit__text">
                                Our dedicated corporate facilitation team is ready to guide you through investment frameworks, site allocation, and partnership structuring.
                            </p>
                            <div className="ctaSplit__actions">
                                <a className="ctaSplit__primary" href="/contact/corporate">Submit an Inquiry</a>
                                <a className="ctaSplit__secondary" href="/downloads/investor-guide.pdf">Download Prospectus</a>
                            </div>
                            <div className="ctaSplit__meta">
                                <span>Dedicated Account Manager</span><span className="dot">•</span><span>Fast-track Approvals</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
