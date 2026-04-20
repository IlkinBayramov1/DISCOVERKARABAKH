import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { useAttractions } from '../../hooks/useAttractions';
import { AttractionList } from '../../components/AttractionList/AttractionList';
import { AttractionFilters } from '../../components/AttractionFilters/AttractionFilters';
import './AttractionsPage.css';

export const AttractionsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const city = searchParams.get('city') || '';
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

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
            city: city || undefined,
            q: searchParams.get('q') || undefined
        } 
    });

    const onSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchTerm);
        
        const newParams = new URLSearchParams(searchParams);
        if (searchTerm) newParams.set('q', searchTerm);
        else newParams.delete('q');
        setSearchParams(newParams);
    };

    React.useEffect(() => {
        const urlCity = searchParams.get('city') || undefined;
        if (urlCity !== params.city) {
            updateFilters({ city: urlCity });
        }
    }, [searchParams, params.city, updateFilters]);

    return (
        <div className="attractions-page">
            <section className="attractions-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1>Explore Karabakh's Heritage</h1>
                    <p>Discover historical sites, natural wonders, and cultural landmarks across the region.</p>
                    
                    <form className="search-container" onSubmit={onSearchSubmit}>
                        <div className="search-input-wrapper glass">
                            <Search className="search-icon" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search by name or keyword..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="search-btn">Search</button>
                        </div>
                    </form>
                </div>
            </section>

            <div className="attractions-container">
                <aside className="attractions-sidebar glass">
                    <div className="sidebar-header">
                        <SlidersHorizontal size={18} />
                        <h3>Filters</h3>
                    </div>
                    <AttractionFilters
                        categories={categories}
                        currentFilters={params}
                        onFilterChange={updateFilters}
                    />
                </aside>

                <main className="attractions-main">
                    <div className="attractions-header">
                        <div className="header-info">
                            <h2>{attractions.length} Attractions</h2>
                            {params.city && (
                                <span className="active-filter glass">
                                    <MapPin size={14} /> {params.city}
                                </span>
                            )}
                        </div>
                    </div>

                    <AttractionList
                        attractions={attractions}
                        isLoading={isLoading}
                        error={error}
                    />
                </main>
            </div>
        </div>
    );
};
