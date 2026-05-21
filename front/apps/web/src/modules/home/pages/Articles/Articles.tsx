import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronRight, Search, XCircle } from 'lucide-react';
import Head from '../../components/SEO/Head';
import { getAllArticles } from '../../../../data/articles'; 
import './Articles.css';

const Articles: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const cityQuery = searchParams.get('city') || 'all';
  const categoryQuery = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const filteredItems = useMemo(() => {
    let items = getAllArticles();

    if (cityQuery !== 'all') {
      items = items.filter(a => (a.city || "").toLowerCase() === cityQuery.toLowerCase());
    }
    if (categoryQuery !== 'all') {
      items = items.filter(a => (a.category || "").toLowerCase() === categoryQuery.toLowerCase());
    }
    if (searchQuery) {
      items = items.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return items;
  }, [cityQuery, categoryQuery, searchQuery]);

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="page explore--articles">
      <Head pageTitle="Articles & Stories - Discover Karabakh" />

      {/* ─── HERO SECTION ────────────────────────────────────────────── */}
      <section className="aHero">
        <div className="container">
          <div className="aHero__card">
            <div className="aHero__media" aria-hidden="true">
              <img src="https://azerbaijan.travel/resize3000/center/pages/9266/cea6de31-5e8c-49a9-b06b-12e1e4977fd8.png" alt="Articles Banner" />
            </div>
            
            {/* The premium purple bloom + plum fade overlay */}
            <div className="aHero__shade" aria-hidden="true"></div>
            
            <div className="aHero__content">
              <div className="aHero__k">Discover</div>
              <h1 className="aHero__t">Articles & Stories</h1>
              <p className="aHero__s">
                Guides, inspiration and practical travel insights across Karabakh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FILTER CONTROLS ─────────────────────────────────────────── */}
      <section className="aControls">
        <div className="container">
          <div className="aBar">
            <div className="aBar__group">
              <label className="aLabel">City</label>
              <select 
                className="aSelect" 
                value={cityQuery} 
                onChange={(e) => handleFilterChange('city', e.target.value)}
              >
                <option value="all">All cities</option>
                <option value="shusha">Shusha</option>
                <option value="khankendi">Khankendi</option>
                <option value="kalbajar">Kalbajar</option>
                <option value="lachin">Lachin</option>
                <option value="agdam">Aghdam</option>
                <option value="fuzuli">Fuzuli</option>
              </select>
            </div>

            <div className="aBar__group">
              <label className="aLabel">Category</label>
              <select 
                className="aSelect" 
                value={categoryQuery} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All categories</option>
                <option value="culture">Culture</option>
                <option value="nature">Nature</option>
                <option value="routes">Routes</option>
                <option value="food">Food</option>
                <option value="travel tips">Travel Tips</option>
              </select>
            </div>

            <div className="aBar__group aBar__group--grow">
              <label className="aLabel">Search</label>
              <div className="aSearchWrapper">
                <Search size={18} className="aSearchIcon" />
                <input 
                  className="aSearch" 
                  type="search" 
                  placeholder="Search articles…" 
                  value={searchQuery}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <div className="aBar__group">
              <label className="aLabel">Sort</label>
              <select className="aSelect" defaultValue="newest">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ARTICLES GRID ───────────────────────────────────────────── */}
      <section className="aGrid">
        <div className="container">
          <div className="ttdMeta">
            <div className="ttdCount"><strong>{filteredItems.length}</strong> results found</div>
          </div>

          <div className="aCards">
            {filteredItems.map((a, index) => (
              <Link key={index} className="aCard" to={`/explore/articles/${a.slug}`}>
                <div className="aCard__img">
                  <img src={a.coverImg} alt={a.title} />
                </div>

                <div className="aCard__b">
                  <div className="aCard__top">
                    <span className="pill pill--soft">{a.category}</span>
                    <span className="pill pill--rate">{a.readTime}</span>
                  </div>

                  <h3 className="aCard__t">{a.title}</h3>
                  <p className="aCard__d">{a.excerpt}</p>

                  <div className="aCard__meta">
                    <span>{a.published}</span>
                  </div>

                  <div className="aCard__cta">Read article <ChevronRight size={16} /></div>
                </div>
              </Link>
            ))}
          </div>

          {/* ─── EMPTY STATE ─────────────────────────────────────────────── */}
          {filteredItems.length === 0 && (
            <div className="aEmptyState">
              <div className="aEmptyState__icon">
                <Search size={48} />
              </div>
              <h3>No articles found</h3>
              <p>We couldn't find any stories matching your current filters.</p>
              <button className="aEmptyState__btn" onClick={clearFilters}>
                <XCircle size={18} />
                Clear all filters
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default Articles;