import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Layers, 
  TrendingUp, 
  ChevronRight, 
  DollarSign, 
  Calendar 
} from 'lucide-react';
import Head from '../../components/SEO/Head';
import './Investments.css';

const Investments: React.FC = () => {
  return (
    <div className="page explore--investments">
      <Head pageTitle="Investment Opportunities - Discover Karabakh" />

      <main>
        {/* ─── HERO SECTION ────────────────────────────────────────────── */}
        <section className="investment-hero" id="top">
          <div className="container">
            <div className="investment-heroCard">
              <div className="investment-heroMedia" aria-hidden="true">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2200&q=80" 
                  alt="Investment Opportunities in Karabakh" 
                />
              </div>

              {/* Premium purple bloom + plum fade overlay */}
              <div className="investment-heroShade" aria-hidden="true"></div>

              <div className="investment-heroContent">
                <div className="investment-heroKicker">Foreign Direct Investment</div>
                <h1 className="investment-heroTitle">Invest in the future</h1>
                <p className="investment-heroSub">
                  Explore state-backed mega-projects, green energy initiatives, and smart city developments. Discover high-yield opportunities in the Karabakh Economic Zone.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TOOLBAR / FILTERS (Non-Sticky SaaS Style) ───────────────── */}
        <div className="invToolbarWrapper">
          <div className="container">
            <div className="invToolbar">
              <div className="invFilterGroup">
                <Search size={18} className="invFilterIcon" />
                <input type="text" placeholder="Keyword or project ID" className="invInput" />
              </div>
              
              <div className="invFilterGroup">
                <MapPin size={18} className="invFilterIcon" />
                <select className="invSelect">
                  <option value="">All Regions</option>
                  <option value="aghdam">Aghdam</option>
                  <option value="shusha">Shusha</option>
                  <option value="fuzuli">Fuzuli</option>
                  <option value="zangilan">Zangilan</option>
                </select>
              </div>

              <div className="invFilterGroup">
                <Layers size={18} className="invFilterIcon" />
                <select className="invSelect">
                  <option value="">All Sectors</option>
                  <option value="tech">Smart Infrastructure</option>
                  <option value="tourism">Tourism & Hospitality</option>
                  <option value="energy">Green Energy</option>
                  <option value="agriculture">Agriculture & Industry</option>
                </select>
              </div>

              <div className="invFilterGroup">
                <TrendingUp size={18} className="invFilterIcon" />
                <select className="invSelect">
                  <option value="">All Stages</option>
                  <option value="planning">Planning & Design</option>
                  <option value="tender">Tender Open</option>
                  <option value="construction">Under Construction</option>
                </select>
              </div>

              <button className="btn btn--primary invSearchBtn">
                Find Projects
              </button>
            </div>
          </div>
        </div>

        {/* ─── INVESTMENTS LISTING ─────────────────────────────────────── */}
        <section className="invListing">
          <div className="container">
            <header className="invHeader">
              <h2 className="invTitle">Featured Investment Projects</h2>
              <div className="invCatTags">
                <button className="invCatTag is-active">All</button>
                <button className="invCatTag">Infrastructure</button>
                <button className="invCatTag">Hospitality</button>
                <button className="invCatTag">Energy</button>
                <button className="invCatTag">Manufacturing</button>
              </div>
            </header>

            <div className="invGrid">
              {/* Project Card 1 */}
              <article className="invCard">
                <div className="invCard__top">
                  <div className="invCard__meta">
                    <span className="invCard__location"><MapPin size={14}/> Aghdam</span>
                  </div>
                  <div className="invCard__stage">Tender Open</div>
                </div>
                <div className="invCard__body">
                  <h3 className="invCard__t">Smart City Infrastructure Fund</h3>
                  <p className="invCard__d">
                    A comprehensive public-private partnership to deploy 5G networks, smart grids, and automated utility management across the new Aghdam residential sectors.
                  </p>
                  <div className="invMetrics">
                    <div className="invMetric">
                      <span className="invMetric__l"><DollarSign size={12} style={{display:'inline', marginBottom:'-2px'}}/> CapEx Req.</span>
                      <span className="invMetric__v highlight">$120.5M</span>
                    </div>
                    <div className="invMetric">
                      <span className="invMetric__l"><TrendingUp size={12} style={{display:'inline', marginBottom:'-2px'}}/> Proj. IRR</span>
                      <span className="invMetric__v">16.5%</span>
                    </div>
                    <div className="invMetric">
                      <span className="invMetric__l"><Calendar size={12} style={{display:'inline', marginBottom:'-2px'}}/> Term</span>
                      <span className="invMetric__v">15 Yrs</span>
                    </div>
                  </div>
                  <Link to="/contact" className="invCard__cta">
                    Review Prospectus <ChevronRight size={16} />
                  </Link>
                </div>
              </article>

              {/* Project Card 2 */}
              <article className="invCard">
                <div className="invCard__top">
                  <div className="invCard__meta">
                    <span className="invCard__location"><MapPin size={14}/> Shusha</span>
                  </div>
                  <div className="invCard__stage">Planning</div>
                </div>
                <div className="invCard__body">
                  <h3 className="invCard__t">Shusha Eco-Resort & Wellness Center</h3>
                  <p className="invCard__d">
                    Development of a 5-star eco-resort integrated with natural mineral springs. The project includes tax exemptions and a 10-year state-backed land lease.
                  </p>
                  <div className="invMetrics">
                    <div className="invMetric">
                      <span className="invMetric__l"><DollarSign size={12} style={{display:'inline', marginBottom:'-2px'}}/> CapEx Req.</span>
                      <span className="invMetric__v highlight">$45.0M</span>
                    </div>
                    <div className="invMetric">
                      <span className="invMetric__l"><TrendingUp size={12} style={{display:'inline', marginBottom:'-2px'}}/> Proj. IRR</span>
                      <span className="invMetric__v">18.2%</span>
                    </div>
                    <div className="invMetric">
                      <span className="invMetric__l"><Calendar size={12} style={{display:'inline', marginBottom:'-2px'}}/> Term</span>
                      <span className="invMetric__v">20 Yrs</span>
                    </div>
                  </div>
                  <Link to="/contact" className="invCard__cta">
                    Review Prospectus <ChevronRight size={16} />
                  </Link>
                </div>
              </article>

              {/* Project Card 3 */}
              <article className="invCard">
                <div className="invCard__top">
                  <div className="invCard__meta">
                    <span className="invCard__location"><MapPin size={14}/> Aghdam</span>
                  </div>
                  <div className="invCard__stage">Under Construction</div>
                </div>
                <div className="invCard__body">
                  <h3 className="invCard__t">Aghdam Textile & Garment Cluster</h3>
                  <p className="invCard__d">
                    Vertically integrated textile manufacturing hub within the tax-free Aghdam Industrial Zone. Focuses on export-grade cotton processing and sustainable practices.
                  </p>
                  <div className="invMetrics">
                    <div className="invMetric">
                      <span className="invMetric__l"><DollarSign size={12} style={{display:'inline', marginBottom:'-2px'}}/> CapEx Req.</span>
                      <span className="invMetric__v highlight">$35.0M</span>
                    </div>
                    <div className="invMetric">
                      <span className="invMetric__l"><TrendingUp size={12} style={{display:'inline', marginBottom:'-2px'}}/> Proj. IRR</span>
                      <span className="invMetric__v">24.0%</span>
                    </div>
                    <div className="invMetric">
                      <span className="invMetric__l"><Calendar size={12} style={{display:'inline', marginBottom:'-2px'}}/> Term</span>
                      <span className="invMetric__v">7 Yrs</span>
                    </div>
                  </div>
                  <Link to="/contact" className="invCard__cta">
                    Review Prospectus <ChevronRight size={16} />
                  </Link>
                </div>
              </article>
            </div>
            
            <div className="invPagination">
              <button className="btn btn--ghost invLoadBtn">
                Load More Opportunities
              </button>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
};

export default Investments;