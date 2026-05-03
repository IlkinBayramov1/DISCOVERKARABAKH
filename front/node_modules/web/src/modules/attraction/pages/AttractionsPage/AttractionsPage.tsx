import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAttractions } from '../../hooks/useAttractions';
import { AttractionList } from '../../components/AttractionList/AttractionList';
import { AttractionFilters } from '../../components/AttractionFilters/AttractionFilters';
import './AttractionsPage.css';

export const AttractionsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    // UI States
    const [keywordInput, setKeywordInput] = useState(searchParams.get('q') || '');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const {
        attractions,
        categories,
        isLoading,
        error,
        params,
        updateFilters,
        handleSearch
    } = useAttractions({ 
        initialParams: { 
            city: searchParams.get('city') || undefined,
            q: searchParams.get('q') || undefined
        } 
    });

    // Handle Header Search
    const onSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(keywordInput);
        
        const newParams = new URLSearchParams(searchParams);
        if (keywordInput) newParams.set('q', keywordInput);
        else newParams.delete('q');
        
        setSearchParams(newParams);
    };

    useEffect(() => {
        const urlQ = searchParams.get('q') || '';
        if (urlQ !== params.q) setKeywordInput(urlQ);
    }, [searchParams, params.q]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateFilters({ sort: e.target.value });
    };

    return (
        <div className="attractions-search-page">
            <main className="container">
                
                {/* HERO SECTION */}
                <section className="attractions-hero">
                    <div className="attractions-hero-overlay">
                        <h1>Explore Karabakh's Heritage</h1>
                        <p>Discover historical sites, natural wonders, and cultural landmarks.</p>
                    </div>
                </section>

                {/* SEARCH BAR SECTION */}
                <form onSubmit={onSearchSubmit} className="search-bar" onClick={(e) => e.stopPropagation()}>
                    
                    {/* KEYWORD SEARCH */}
                    <div className="search-item tour-name-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <div style={{ width: '100%' }}>
                            <label>ATTRACTION NAME</label>
                            <input 
                                type="text" 
                                placeholder="Search by name, description or keywords..."
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                className="search-input-naked"
                                style={{ width: '100%', fontSize: '15px' }}
                            />
                        </div>
                    </div>
                    {/* LOCATION (Read-only display of sidebar selection) */}
                    <div className="search-item location-item" style={{ cursor: 'pointer' }} onClick={() => setSidebarOpen(true)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <div>
                            <label>LOCATION</label>
                            <div className="search-value" style={{ fontSize: '15px', color: params.city ? 'var(--dk-primary)' : '#666', fontWeight: params.city ? '600' : '400' }}>
                                {params.city || 'Any City'}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="search-btn">
                        {isLoading ? (
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
                    <span>Showing <strong>{isLoading ? '...' : attractions.length}</strong> attractions</span>

                    <div className="actions">
                        <button className="ghost-btn" onClick={() => setSidebarOpen(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
                            Filters
                        </button>
                        
                        <div className="ghost-btn sort-wrapper">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                            Sort by:
                            <select value={params.sort || 'popular'} onChange={handleSortChange} className="inline-sort-select">
                                <option value="popular">Most Popular</option>
                                <option value="rating_desc">Highest Rated</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="newest">Newest Additions</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* LIST SECTION */}
                <AttractionList
                    attractions={attractions}
                    isLoading={isLoading}
                    error={error}
                />

            </main>

            {/* OFF-CANVAS SIDEBAR */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
            <aside className={`tours-offcanvas-sidebar ${sidebarOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <h2>Filters</h2>
                    <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>
                
                <div className="sidebar-content">
                    <AttractionFilters
                        categories={categories}
                        currentFilters={params}
                        onFilterChange={updateFilters}
                    />
                </div>
            </aside>
        </div>
    );
};