import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTours } from '../../hooks/useTours';
import { TourCard } from '../../components/TourCard';
import './ToursPage.css';

export const ToursPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // UI Local State
    const [cityInput, setCityInput] = useState(searchParams.get('city') || '');
    const [searchInput, setSearchInput] = useState('');
    const [durationInput, setDurationInput] = useState<number | ''>('');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sidebar Filter States
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | undefined>(undefined);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('recommended');

    // Active Filters State
    const [activeFilters, setActiveFilters] = useState({
        city: searchParams.get('city') || '',
        q: '',
        duration: undefined as number | undefined,
        minPrice: undefined as number | undefined,
        maxPrice: undefined as number | undefined,
        difficulty: undefined as string | undefined,
        sortBy: 'recommended',
        page: 1,
        limit: 12
    });

    const { tours, loading, error, pagination } = useTours(activeFilters);

    // Listen for URL changes
    useEffect(() => {
        const urlCity = searchParams.get('city') || '';
        setCityInput(urlCity);
        setActiveFilters(prev => ({ ...prev, city: urlCity }));
    }, [searchParams]);

    // Handle Header Search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(1); // Reset to page 1 on new search
    };

    // Construct backend filter payload
    const applyFilters = (pageToFetch = activeFilters.page) => {
        let minPrice: number | undefined = undefined;
        let maxPrice: number | undefined = undefined;

        if (selectedPriceRange === 'Under $50') maxPrice = 50;
        else if (selectedPriceRange === '$50 - $100') { minPrice = 50; maxPrice = 100; }
        else if (selectedPriceRange === '$100 - $200') { minPrice = 100; maxPrice = 200; }
        else if (selectedPriceRange === '$200+') minPrice = 200;

        setActiveFilters({
            city: cityInput,
            q: searchInput,
            duration: durationInput === '' ? undefined : Number(durationInput),
            minPrice,
            maxPrice,
            difficulty: selectedDifficulty,
            sortBy,
            page: pageToFetch,
            limit: 12
        });
    };

    useEffect(() => {
        applyFilters(1); // Reset to page 1 when sidebar filters change
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDifficulty, selectedPriceRange, sortBy]);

    const handlePageChange = (newPage: number) => {
        applyFilters(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="tours-search-page">
            <main className="container">
                
                {/* HERO SECTION */}
                <section className="tour-hero">
                    <div className="tour-hero-overlay">
                        <h1>Unforgettable Experiences</h1>
                        <p>Discover the hidden gems of Karabakh with our curated tours.</p>
                    </div>
                </section>

                {/* SEARCH BAR SECTION */}
                <form onSubmit={handleSearch} className="search-bar" onClick={(e) => e.stopPropagation()}>
                    
                    {/* 0. KEYWORD SEARCH */}
                    <div className="search-item tour-name-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <div style={{ width: '100%' }}>
                            <label>TOUR NAME</label>
                            <input 
                                type="text" 
                                placeholder="Search experiences..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="search-input-naked"
                                style={{ width: '100%', fontSize: '15px' }}
                            />
                        </div>
                    </div>

                    {/* 1. LOCATION */}
                    <div className="search-item location-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div>
                            <label>LOCATION</label>
                            <div className="search-value">
                                <input 
                                    type="text" 
                                    placeholder="Karabakh"
                                    value={cityInput}
                                    onChange={(e) => setCityInput(e.target.value)}
                                    className="search-input-naked"
                                    style={{ width: '100px', fontSize: '15px' }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* 2. DURATION */}
                    <div className="search-item duration-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                            <label>DURATION (DAYS)</label>
                            <div className="search-value">
                                <input 
                                    type="number" 
                                    min="1"
                                    placeholder="Any"
                                    value={durationInput}
                                    onChange={(e) => setDurationInput(e.target.value ? Number(e.target.value) : '')}
                                    className="search-input-naked"
                                    style={{ width: '80px', fontSize: '15px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="search-btn">
                        {loading ? (
                            <span className="search-btn-icon loading-spin">⟳</span>
                        ) : (
                            <>
                                <svg className="search-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                                Search
                            </>
                        )}
                    </button>
                </form>

                {/* RESULTS SECTION */}
                <section className="results-bar">
                    <span>Showing <strong>{loading ? '...' : pagination.totalCount}</strong> tours</span>

                    <div className="actions">
                        <button className="ghost-btn" onClick={() => setSidebarOpen(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
                            Filters
                        </button>
                        
                        <div className="ghost-btn sort-wrapper">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                            Sort:
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="inline-sort-select">
                                <option value="recommended">Recommended</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="duration_asc">Duration: Short to Long</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* ERROR / EMPTY STATES */}
                {error && (
                    <div className="error-premium">
                        <span>{error}</span>
                    </div>
                )}
                {!loading && !error && tours.length === 0 && (
                    <div className="empty-state-premium">
                        <h3 className="empty-title">No tours found</h3>
                        <p className="empty-text">Try adjusting your search criteria or clear some filters.</p>
                    </div>
                )}

                {/* TOUR LIST SECTION */}
                <section className="tour-grid">
                    {loading && tours.length === 0 ? (
                        [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton-tour"></div>)
                    ) : (
                        tours.map((tour) => (
                            <TourCard
                                key={tour.id}
                                tour={tour}
                                onClick={(id) => navigate(`/tours/${id}`)}
                            />
                        ))
                    )}
                </section>

                {/* PAGINATION */}
                {!loading && pagination.totalPages > 1 && (
                    <div className="premium-pagination">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => handlePageChange(pagination.page - 1)}
                            className="pagination-btn"
                        >
                            ← Prev
                        </button>
                        <div className="pagination-info">
                            Page <span>{pagination.page}</span> of {pagination.totalPages}
                        </div>
                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => handlePageChange(pagination.page + 1)}
                            className="pagination-btn"
                        >
                            Next →
                        </button>
                    </div>
                )}

            </main>

            {/* OFF-CANVAS SIDEBAR FOR FILTERS */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
            <aside className={`tours-offcanvas-sidebar ${sidebarOpen ? 'active' : ''}`}>
                <div className="sidebar-filter">
                    <h2>Filters</h2>
                    <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>
                
                <div className="sidebar-content">

                    <div className="filter-block">
                        <h3 className="filter-heading">Difficulty Level</h3>
                        <div className="filter-list">
                            {['Easy', 'Medium', 'Hard', 'Extreme'].map((diff) => (
                                <label key={diff} className="filter-checkbox-item">
                                    <input 
                                        type="radio" 
                                        name="difficultyRating"
                                        checked={selectedDifficulty === diff}
                                        onChange={() => setSelectedDifficulty(diff)}
                                    />
                                    <span className="filter-label-text">{diff}</span>
                                </label>
                            ))}
                            {selectedDifficulty && (
                                <button onClick={() => setSelectedDifficulty(undefined)} className="clear-filter-btn">
                                    Clear Difficulty
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <div className="filter-block">
                        <h3 className="filter-heading">Price Per Person</h3>
                        <div className="filter-list">
                            {['Under $50', '$50 - $100', '$100 - $200', '$200+'].map((range) => (
                                <label key={range} className="filter-checkbox-item">
                                    <input 
                                        type="radio" 
                                        name="priceRange" 
                                        checked={selectedPriceRange === range}
                                        onChange={() => setSelectedPriceRange(range)}
                                    />
                                    <span className="filter-label-text">{range}</span>
                                </label>
                            ))}
                            {selectedPriceRange && (
                                <button onClick={() => setSelectedPriceRange(null)} className="clear-filter-btn">
                                    Clear Price Filter
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </aside>
        </div>
    );
};