import React from 'react';
import { Link } from 'react-router-dom';
import Head from '../../components/SEO/Head';
import './International.css';

const International: React.FC = () => {
  return (
    <div className="page part">
      <Head pageTitle="International Corner - Discover Karabakh" />

      <main className="intl-main">
        
        {/* HERO SECTION */}
        <section className="hero" id="home">
          <div className="container">
            <div className="heroCard">
              
              <div className="heroMedia" aria-hidden="true">
                <img src="https://www.hieronica-limited.com/images/differentiator.webp" alt="Global Partnerships" />
              </div>

              <div className="heroOverlay" aria-hidden="true"></div>

              <div className="heroContent">
                <h1 className="heroTitle">International<br />Corner</h1>

                <p className="heroDesc">
                  The central gateway for cross-border investments, bilateral economic relations, and joint regional development initiatives in Karabakh. Explore our dedicated country partnerships.
                </p>

                <div className="heroCtas">
                  <a className="heroBtn heroBtn--primary" href="#country-hubs">
                    Explore Country Hubs <span className="heroArrow" aria-hidden="true">›</span>
                  </a>

                  <Link className="heroBtn heroBtn--ghost" to="/contact">
                    Establish a Partnership <span className="heroArrow" aria-hidden="true">›</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="intl-stats-section">
          <div className="container">
            <div className="statsGrid">
              <div className="statCard">
                <div className="statCard__val">12+</div>
                <div className="statCard__label">Active FDI Projects</div>
              </div>
              <div className="statCard">
                <div className="statCard__val">$450M</div>
                <div className="statCard__label">Committed Foreign Capital</div>
              </div>
              <div className="statCard">
                <div className="statCard__val">3</div>
                <div className="statCard__label">Dedicated Country Hubs</div>
              </div>
              <div className="statCard">
                <div className="statCard__val">5+</div>
                <div className="statCard__label">Smart Villages in Dev.</div>
              </div>
            </div>
          </div>
        </section>

        {/* HUBS SECTION */}
        <section className="hubs" id="country-hubs">
          <div className="container">
            
            <div className="hubs__head">
              <h2 className="hubs__title">Strategic Bilateral Hubs</h2>
              <p className="hubs__subtitle">Discover Karabakh facilitates direct pathways for foreign governments and private enterprises to participate in the region's technological and infrastructural renaissance.</p>
            </div>

            <div className="hubs__wrapper">

              {/* HUNGARY HUB */}
              <article className="hubCard">
                <div className="hubCard__media" aria-hidden="true">
                  <img src="https://budapest.com/storage/685/conversions/DJI_0880-heroImage.jpg" alt="Hungary Partnership Projects" />
                  <div className="hubCard__shade"></div>
                </div>

                <div className="hubCard__content">
                  <div className="hubCard__header">
                    <img className="hubCard__flag" src="https://flagcdn.com/w80/hu.png" alt="Flag of Hungary" />
                    <h3 className="hubCard__title">Hungary Corner</h3>
                  </div>

                  <p className="hubCard__desc">
                    Operating in strategic partnership with HEPA (Hungarian Export Promotion Agency), the Hungary Corner drives the expansion of Hungary-Karabakh business relations. Focuses heavily on urban planning, smart village reconstruction, and advanced water management solutions.
                  </p>
                  
                  <div className="hubCard__tags">
                    <span>Smart City Planning</span>
                    <span>Water Management</span>
                    <span>Agri-Tech</span>
                  </div>

                  <div className="hubCard__projects">
                    <h4>Featured Joint Projects</h4>
                    <ul>
                      <li><strong>Soltanli Smart Village:</strong> Master planning and turnkey construction of a fully sustainable residential and agricultural ecosystem.</li>
                      <li><strong>HEPA B2B Matching Program:</strong> A continuous pipeline connecting Hungarian technology vendors with local contractors.</li>
                    </ul>
                  </div>

                  <div className="hubCard__actions">
                    <Link to="/corporate/investments?filter=hungary" className="btn-corp-primary">View Hungarian Opportunities</Link>
                  </div>
                </div>
              </article>

              {/* UZBEKISTAN HUB */}
              <article className="hubCard hubCard--reverse">
                <div className="hubCard__media" aria-hidden="true">
                  <img src="https://trvlland.com/wp-content/uploads/2022/09/uzbekistan_tashkent-3.jpg" alt="Uzbekistan Partnership Projects" />
                  <div className="hubCard__shade"></div>
                </div>

                <div className="hubCard__content">
                  <div className="hubCard__header">
                    <img className="hubCard__flag" src="https://flagcdn.com/w80/uz.png" alt="Flag of Uzbekistan" />
                    <h3 className="hubCard__title">Uzbekistan Corner</h3>
                  </div>

                  <p className="hubCard__desc">
                    The Uzbekistan Corner represents a deep brotherly and economic alliance, focusing on light industry, textile manufacturing, and educational infrastructure. Serves as the bridge for Uzbek investors looking to establish operational bases in the newly formed industrial zones.
                  </p>
                  
                  <div className="hubCard__tags">
                    <span>Light Industry</span>
                    <span>Textiles & Garments</span>
                    <span>Educational Infrastructure</span>
                  </div>

                  <div className="hubCard__projects">
                    <h4>Featured Joint Projects</h4>
                    <ul>
                      <li><strong>Mirzo Ulugbek School (Fuzuli):</strong> A state-of-the-art educational facility accommodating 960 students, fully funded and constructed by Uzbekistan.</li>
                      <li><strong>Aghdam Textile Cluster:</strong> A joint venture establishing a massive cotton processing and garment manufacturing hub.</li>
                    </ul>
                  </div>

                  <div className="hubCard__actions">
                    <Link to="/corporate/investments?filter=uzbekistan" className="btn-corp-primary">View Uzbek Opportunities</Link>
                  </div>
                </div>
              </article>

              {/* ISRAEL HUB */}
              <article className="hubCard">
                <div className="hubCard__media" aria-hidden="true">
                  <img src="https://static-cdn.toi-media.com/www/uploads/2022/02/Courtesy-of-Avison-Young-Tel-Aviv.jpg" alt="Israel Partnership Projects" />
                  <div className="hubCard__shade"></div>
                </div>

                <div className="hubCard__content">
                  <div className="hubCard__header">
                    <img className="hubCard__flag" src="https://flagcdn.com/w80/il.png" alt="Flag of Israel" />
                    <h3 className="hubCard__title">Israel Corner</h3>
                  </div>

                  <p className="hubCard__desc">
                    Leveraging world-class expertise in precision agriculture and arid-climate technologies, the Israel Corner focuses on transforming Karabakh's agricultural landscape. The center for B2B tech transfers, specialized farming, and modern dairy production.
                  </p>
                  
                  <div className="hubCard__tags">
                    <span>Precision Agriculture</span>
                    <span>Drip Irrigation</span>
                    <span>Cybersecurity & IT</span>
                  </div>

                  <div className="hubCard__projects">
                    <h4>Featured Joint Projects</h4>
                    <ul>
                      <li><strong>Zangilan Smart Dairy Farm:</strong> An advanced, fully automated dairy production facility utilizing Israeli herd management software.</li>
                      <li><strong>Regional Drip Irrigation Network:</strong> Implementation of high-efficiency systems across 5,000 hectares of newly cultivated fields.</li>
                    </ul>
                  </div>

                  <div className="hubCard__actions">
                    <Link to="/corporate/investments?filter=israel" className="btn-corp-primary">View Israeli Opportunities</Link>
                  </div>
                </div>
              </article>

            </div>
          </div>
        </section>

        {/* CTA SPLIT SECTION */}
        <section className="ctaSplit" id="establish-hub">
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
                <div className="ctaSplit__badge">Global Relations</div>
                <h3 className="ctaSplit__title">Establish Your Country's Presence</h3>
                <p className="ctaSplit__text">
                  Are you representing a foreign government, chamber of commerce, or export promotion agency? Discover Karabakh provides dedicated digital infrastructure and local facilitation to establish your official business hub in the region.
                </p>
                <div className="ctaSplit__actions">
                  <Link className="ctaSplit__primary" to="/contact">Contact Global Relations Team</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default International;