import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ChevronRight, 
  Clock, 
  Building2 
} from 'lucide-react';
import Head from '../../components/SEO/Head';
import './Jobs.css';

const Jobs: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);

  // Scroll listener for sticky toolbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="page explore--jobs">
      <Head pageTitle="Career Opportunities - Discover Karabakh" />

      <main>
        {/* ─── HERO SECTION ────────────────────────────────────────────── */}
        <section className="jobs-hero" id="top">
          <div className="container">
            <div className="jobs-heroCard">
              <div className="jobs-heroMedia" aria-hidden="true">
                <img 
                  src="https://wmf.imgix.net/images/ca_aerial_view_of_dadivank_monastery_built_between_the_9th_and_13th_centuries._copy.jpg" 
                  alt="Careers in Karabakh" 
                />
              </div>

              {/* Premium purple bloom + plum fade overlay */}
              <div className="jobs-heroShade" aria-hidden="true"></div>

              <div className="jobs-heroContent">
                <div className="jobs-heroKicker">Careers & Opportunities</div>
                <h1 className="jobs-heroTitle">Help us build the future</h1>
                <p className="jobs-heroSub">
                  Discover Karabakh is expanding. We are looking for passionate professionals, engineers, and visionaries to join our mega-projects across the region.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TOOLBAR / FILTERS ───────────────────────────────────────── */}
        <div className={`jobsToolbarWrapper ${isSticky ? 'is-sticky' : ''}`}>
          <div className="container">
            <div className="jobsToolbar">
              <div className="jobsFilterGroup">
                <Search size={18} className="jobsFilterIcon" />
                <input type="text" placeholder="Job title or keyword" className="jobsInput" />
              </div>
              
              <div className="jobsFilterGroup">
                <MapPin size={18} className="jobsFilterIcon" />
                <select className="jobsSelect">
                  <option value="">All Locations</option>
                  <option value="shusha">Shusha</option>
                  <option value="aghdam">Aghdam</option>
                  <option value="fuzuli">Fuzuli</option>
                  <option value="baku">Baku (HQ)</option>
                </select>
              </div>

              <div className="jobsFilterGroup">
                <Briefcase size={18} className="jobsFilterIcon" />
                <select className="jobsSelect">
                  <option value="">All Departments</option>
                  <option value="tech">Technology & IT</option>
                  <option value="tourism">Tourism & Hospitality</option>
                  <option value="construction">Urban Planning & Infrastructure</option>
                  <option value="admin">Operations & Admin</option>
                </select>
              </div>

              <button className="btn btn--primary jobsSearchBtn">
                Search Jobs
              </button>
            </div>
          </div>
        </div>

        {/* ─── JOBS LISTING ────────────────────────────────────────────── */}
        <section className="jobsListing">
          <div className="container">
            <header className="jobsHeader">
              <h2 className="jobsTitle">Open Positions</h2>
              <div className="jobsCatTags">
                <button className="jobsCatTag is-active">All</button>
                <button className="jobsCatTag">Tourism</button>
                <button className="jobsCatTag">Infrastructure</button>
                <button className="jobsCatTag">Technology</button>
                <button className="jobsCatTag">Administration</button>
              </div>
            </header>

            <div className="jobsGrid">
              {/* Job Card 1 */}
              <article className="jobCard">
                <div className="jobCard__top">
                  <div className="jobCard__meta">
                    <span className="jobCard__location"><MapPin size={14}/> Shusha</span>
                  </div>
                  <div className="jobCard__type"><Clock size={14}/> Full-Time</div>
                </div>
                <div className="jobCard__body">
                  <h3 className="jobCard__t">Hospitality Operations Manager</h3>
                  <p className="jobCard__d">
                    Oversee daily operations across our premium partner hotels in Shusha, ensuring international service standards and seamless integration with the City Pass ecosystem.
                  </p>
                  <div className="jobMetrics">
                    <div className="jobMetric">
                      <span className="jobMetric__l">Experience</span>
                      <span className="jobMetric__v">5+ Yrs</span>
                    </div>
                    <div className="jobMetric">
                      <span className="jobMetric__l">Salary (AZN)</span>
                      <span className="jobMetric__v highlight">Competitive</span>
                    </div>
                    <div className="jobMetric">
                      <span className="jobMetric__l">Model</span>
                      <span className="jobMetric__v"><Building2 size={14} style={{marginRight: '4px', display: 'inline'}}/> On-site</span>
                    </div>
                  </div>
                  <Link to="/contact" className="jobCard__cta">
                    View & Apply <ChevronRight size={16} />
                  </Link>
                </div>
              </article>

              {/* Job Card 2 */}
              <article className="jobCard">
                <div className="jobCard__top">
                  <div className="jobCard__meta">
                    <span className="jobCard__location"><MapPin size={14}/> Aghdam</span>
                  </div>
                  <div className="jobCard__type"><Clock size={14}/> Full-Time</div>
                </div>
                <div className="jobCard__body">
                  <h3 className="jobCard__t">Smart City IoT Engineer</h3>
                  <p className="jobCard__d">
                    Design and implement IoT sensor networks for the Aghdam Smart City project, focusing on automated utilities, smart grids, and data analytics.
                  </p>
                  <div className="jobMetrics">
                    <div className="jobMetric">
                      <span className="jobMetric__l">Experience</span>
                      <span className="jobMetric__v">3+ Yrs</span>
                    </div>
                    <div className="jobMetric">
                      <span className="jobMetric__l">Salary (AZN)</span>
                      <span className="jobMetric__v highlight">Competitive</span>
                    </div>
                    <div className="jobMetric">
                      <span className="jobMetric__l">Model</span>
                      <span className="jobMetric__v">Hybrid</span>
                    </div>
                  </div>
                  <Link to="/contact" className="jobCard__cta">
                    View & Apply <ChevronRight size={16} />
                  </Link>
                </div>
              </article>

              {/* Job Card 3 */}
              <article className="jobCard">
                <div className="jobCard__top">
                  <div className="jobCard__meta">
                    <span className="jobCard__location"><MapPin size={14}/> Aghdam</span>
                  </div>
                  <div className="jobCard__type"><Clock size={14}/> Contract</div>
                </div>
                <div className="jobCard__body">
                  <h3 className="jobCard__t">Lead Urban Project Architect</h3>
                  <p className="jobCard__d">
                    Spearhead the architectural design and structural planning for the Aghdam central residential zone, ensuring compliance with sustainable building codes.
                  </p>
                  <div className="jobMetrics">
                    <div className="jobMetric">
                      <span className="jobMetric__l">Experience</span>
                      <span className="jobMetric__v">7+ Yrs</span>
                    </div>
                    <div className="jobMetric">
                      <span className="jobMetric__l">Salary (AZN)</span>
                      <span className="jobMetric__v highlight">Competitive</span>
                    </div>
                    <div className="jobMetric">
                      <span className="jobMetric__l">Model</span>
                      <span className="jobMetric__v">Hybrid</span>
                    </div>
                  </div>
                  <Link to="/contact" className="jobCard__cta">
                    View & Apply <ChevronRight size={16} />
                  </Link>
                </div>
              </article>
            </div>
            
            <div className="jobsPagination" style={{ marginBottom: "40px", marginTop: '40px', textAlign: 'center' }}>
              <button className="btn btn--ghost" style={{ color: '#0f172a', borderColor: '#e2e8f0', background: '#ffffff' }}>
                Load More Jobs
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default Jobs;