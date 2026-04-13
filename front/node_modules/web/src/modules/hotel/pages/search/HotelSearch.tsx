import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, MapPin, Filter, Search } from 'lucide-react';
import './HotelSearch.css';

import { useHotelSearch } from '../../hooks/useHotelSearch';
import type { IHotel } from '../../types';

export default function HotelSearch() {
    const [searchParams] = useSearchParams();
    const initialCity = searchParams.get('city') || '';
    const initialQuery = searchParams.get('q') || '';

    const [city, setCity] = useState(initialCity);
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [priceRange, setPriceRange] = useState(500);

    const { hotels, loading, error } = useHotelSearch({
        city: city || undefined,
        q: searchQuery || undefined,
        priceRange: priceRange
    });

    useEffect(() => {
        setCity(searchParams.get('city') || '');
        setSearchQuery(searchParams.get('q') || '');
    }, [searchParams]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [initialQuery, initialCity]);

    return (
        <div className="hotel-search-container max-w-7xl mx-auto px-4 py-8">
            <div className="search-header mb-8">
                <h1 className="text-xl font-bold">Search Results in Karabakh</h1>
                <p className="text-muted">{!loading ? `${hotels.length} properties found matching your criteria.` : 'Searching properties...'}</p>
            </div>

            <div className="search-layout">
                {/* Left Sidebar Filters */}
                <aside className="search-filters glassmorphism">
                    <div className="filter-header">
                        <h3><Filter size={18} className="mr-2" /> Filters</h3>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">City</label>
                        <select
                            className="search-input-wrapper"
                            style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '10px', borderRadius: '8px', color: 'inherit' }}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                            <option value="" style={{ color: '#333' }}>All Karabakh</option>
                            <option value="Shusha" style={{ color: '#333' }}>Shusha (Şuşa)</option>
                            <option value="Lachin" style={{ color: '#333' }}>Lachin (Laçın)</option>
                            <option value="Khankendi" style={{ color: '#333' }}>Khankendi (Xankəndi)</option>
                            <option value="Aghdam" style={{ color: '#333' }}>Aghdam (Ağdam)</option>
                        </select>
                    </div>

                    <div className="filter-group border-t pt-4">
                        <label className="filter-label">Search Location/Name</label>
                        <div className="search-input-wrapper">
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="e.g. Shusha"
                            />
                        </div>
                    </div>

                    <div className="filter-group border-t pt-4">
                        <label className="filter-label flex-between">
                            <span>Max Price (Per Night)</span>
                            <span>${priceRange}</span>
                        </label>
                        <input
                            type="range"
                            min="50"
                            max="1000"
                            step="50"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="price-slider"
                        />
                    </div>

                    <div className="filter-group border-t pt-4">
                        <label className="filter-label">Star Rating</label>
                        <div className="checkbox-group">
                            {[5, 4, 3, 2, 1].map(star => (
                                <label key={star} className="checkbox-label">
                                    <input type="checkbox" />
                                    <div className="stars flex-align-center">
                                        {Array(star).fill(0).map((_, i) => (
                                            <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                                        ))}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Right Results Grid */}
                <main className="search-results">
                    {loading && <div className="loading-state p-8 text-center"><div className="spinner mx-auto mb-4"></div><p>Loading hotels...</p></div>}
                    {error && <div className="alert error">{error}</div>}

                    {!loading && hotels.length === 0 && !error && (
                        <div className="empty-state p-8 text-center glassmorphism">
                            <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
                            <p className="text-muted">Try adjusting your filters or selecting a different city.</p>
                        </div>
                    )}

                    {!loading && hotels.map((hotel: IHotel) => (
                        <div key={hotel.id} className="hotel-card glassmorphism">
                            <div className="hotel-card-image">
                                <img src={typeof hotel.images?.[0] === 'string' ? hotel.images[0] : (hotel.images?.[0] as any)?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'} alt={hotel.name} />
                            </div>
                            <div className="hotel-card-details">
                                <div className="card-header flex-between mb-2">
                                    <h3 className="font-bold">{hotel.name}</h3>
                                    <div className="rating flex-align-center gap-1">
                                        <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                        <span>{hotel.rating ? hotel.rating.toFixed(1) : 'New'}</span>
                                        <span className="text-xs text-muted">({hotel.reviewCount || 0})</span>
                                    </div>
                                </div>
                                <p className="location text-muted flex-align-center gap-1 mb-3">
                                    <MapPin size={14} /> {hotel.city ? `${hotel.city}, ` : ''}{hotel.address}
                                </p>
                                <div className="amenities mb-4">
                                    {hotel.policies?.amenities ? (hotel.policies.amenities as any[]).slice(0, 3).map((amenity: string, idx: number) => (
                                        <span key={idx} className="badge">{amenity}</span>
                                    )) : (
                                        <span className="badge">{hotel.propertyType}</span>
                                    )}
                                </div>
                                <div className="card-footer flex-between mt-auto border-t pt-4">
                                    <div className="price-info">
                                        <span className="price-val font-bold text-xl">From $50</span>
                                        <span className="text-muted text-sm"> / night</span>
                                    </div>
                                    <Link to={`/hotels/${hotel.id}`} className="btn-primary">View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}
