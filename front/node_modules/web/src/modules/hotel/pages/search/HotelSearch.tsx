import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Star, MapPin, Filter, Search } from 'lucide-react';
import './HotelSearch.css';

// Mock Data for Phase 1 UI structure. Will be replaced by API calls.
const MOCK_HOTELS = [
    { id: '1', name: 'Shusha Grand Hotel', rating: 5, price: 150, location: 'Shusha, Karabakh', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', amenities: ['Spa', 'Pool', 'Free WiFi'] },
    { id: '2', name: 'Aghdam Heritage Lodge', rating: 4, price: 90, location: 'Aghdam, Karabakh', image: 'https://images.unsplash.com/photo-1551882547-ff40c0d5b5df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', amenities: ['Restaurant', 'Parking'] },
    { id: '3', name: 'Lachin Riverside Resort', rating: 4, price: 120, location: 'Lachin, Karabakh', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', amenities: ['Nature Trails', 'Breakfast Included'] }
];

export default function HotelSearch() {
    const [searchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [priceRange, setPriceRange] = useState(500);

    // Mock API Fetch effect
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [initialQuery]);

    return (
        <div className="hotel-search-container max-w-7xl mx-auto px-4 py-8">
            <div className="search-header mb-8">
                <h1 className="text-xl font-bold">Search Results in Karabakh</h1>
                <p className="text-muted">{MOCK_HOTELS.length} properties found matching your criteria.</p>
            </div>

            <div className="search-layout">
                {/* Left Sidebar Filters */}
                <aside className="search-filters glassmorphism">
                    <div className="filter-header">
                        <h3><Filter size={18} className="mr-2" /> Filters</h3>
                    </div>

                    <div className="filter-group">
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
                    {MOCK_HOTELS.map(hotel => (
                        <div key={hotel.id} className="hotel-card glassmorphism">
                            <div className="hotel-card-image">
                                <img src={hotel.image} alt={hotel.name} />
                            </div>
                            <div className="hotel-card-details">
                                <div className="card-header flex-between mb-2">
                                    <h3 className="font-bold">{hotel.name}</h3>
                                    <div className="rating flex-align-center gap-1">
                                        <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                        <span>{hotel.rating}.0</span>
                                    </div>
                                </div>
                                <p className="location text-muted flex-align-center gap-1 mb-3">
                                    <MapPin size={14} /> {hotel.location}
                                </p>
                                <div className="amenities mb-4">
                                    {hotel.amenities.map((amenity, idx) => (
                                        <span key={idx} className="badge">{amenity}</span>
                                    ))}
                                </div>
                                <div className="card-footer flex-between mt-auto border-t pt-4">
                                    <div className="price-info">
                                        <span className="price-val font-bold text-xl">${hotel.price}</span>
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
