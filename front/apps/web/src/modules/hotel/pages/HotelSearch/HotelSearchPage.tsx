import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHotelSearch } from '../../hooks/useHotelSearch';
import { HotelCard } from '../../components/HotelCard';
import './HotelSearchPage.css';

export const HotelSearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // UI Local State (What user is typing/selecting right now before confirm)
    const [cityInput, setCityInput] = useState(searchParams.get('city') || '');
    const [searchInput, setSearchInput] = useState('');
    const [starRatingInput, setStarRatingInput] = useState<number | undefined>(undefined);
    
    // Premium Search Bar States
    const [checkInInput, setCheckInInput] = useState(searchParams.get('checkIn') || '');
    const [checkOutInput, setCheckOutInput] = useState(searchParams.get('checkOut') || '');
    const [adultsInput, setAdultsInput] = useState(searchParams.get('adults') ? Number(searchParams.get('adults')) : 2);
    const [childrenInput, setChildrenInput] = useState(searchParams.get('children') ? Number(searchParams.get('children')) : 0);
    const [roomsInput, setRoomsInput] = useState(searchParams.get('rooms') ? Number(searchParams.get('rooms')) : 1);
    const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Sidebar Filter States (Auto-apply or applied on close, but let's make them reactive to "activeFilters" on change)
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
    const [selectedMinRating, setSelectedMinRating] = useState<number | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string>('recommended');

    // Active Filters State (What is actually sent to the backend)
    const [activeFilters, setActiveFilters] = useState({
        city: searchParams.get('city') || '',
        q: '',
        starRating: undefined as number | undefined,
        amenityNames: [] as string[],
        minPrice: undefined as number | undefined,
        maxPrice: undefined as number | undefined,
        minRating: undefined as number | undefined,
        sortBy: 'recommended',
        checkIn: searchParams.get('checkIn') || undefined as string | undefined,
        checkOut: searchParams.get('checkOut') || undefined as string | undefined,
        adults: searchParams.get('adults') ? Number(searchParams.get('adults')) : undefined as number | undefined,
        children: searchParams.get('children') ? Number(searchParams.get('children')) : undefined as number | undefined,
        rooms: searchParams.get('rooms') ? Number(searchParams.get('rooms')) : undefined as number | undefined
    });

    const { hotels, loading, error } = useHotelSearch(activeFilters);

    // Listen for URL changes 
    React.useEffect(() => {
        const urlCity = searchParams.get('city') || '';
        setCityInput(urlCity);
        setActiveFilters(prev => ({ ...prev, city: urlCity }));
    }, [searchParams]);

    // Handle Header Search (Explicit submit)
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    // Construct backend filter payload from UI controls
    const applyFilters = () => {
        let minPrice: number | undefined = undefined;
        let maxPrice: number | undefined = undefined;

        if (selectedPriceRange === 'Under $50') maxPrice = 50;
        else if (selectedPriceRange === '$50 - $100') { minPrice = 50; maxPrice = 100; }
        else if (selectedPriceRange === '$100 - $200') { minPrice = 100; maxPrice = 200; }
        else if (selectedPriceRange === '$200+') minPrice = 200;

        setActiveFilters({
            city: cityInput,
            q: searchInput,
            starRating: starRatingInput,
            amenityNames: selectedAmenities,
            minPrice,
            maxPrice,
            minRating: selectedMinRating,
            sortBy,
            checkIn: checkInInput || undefined,
            checkOut: checkOutInput || undefined,
            adults: adultsInput,
            children: childrenInput,
            rooms: roomsInput
        });
    };

    // Sidebar Handlers (trigger refetch immediately when a sidebar filter changes for UX, or we can tie it to a button)
    // Let's make them reactive: whenever a filter changes, we just call applyFilters, but wait state is async! 
    // Best way: useEffect to watch the sidebar states and apply them automatically when they change.
    React.useEffect(() => {
        applyFilters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAmenities, selectedPriceRange, selectedMinRating, sortBy]);

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenities(prev => 
            prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
        );
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setGuestDropdownOpen(false);
        if (guestDropdownOpen) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [guestDropdownOpen]);

    return (
        <div className="hotel-search-page">
            <div className="hotel-search-container">

                {/* Search Hero - City Style */}
                <section className="search-hero">
                    <div className="search-hero-content">
                        <h1 className="search-hero-title">Find your perfect stay</h1>
                        <p className="search-hero-subtitle">
                            Discover premium hotels across Karabakh with exclusive deals and instant booking.
                        </p>
                        
                        <form onSubmit={handleSearch} className="premium-search-bar" onClick={(e) => e.stopPropagation()}>
                            <div className="search-chunk">
                                <label>Location</label>
                                <div className="guest-display">
                                    {cityInput ? `${cityInput}, Karabakh` : 'All Karabakh'}
                                </div>
                            </div>
                            <div className="search-divider"></div>
                            
                            <div className="search-chunk">
                                <label>Check in</label>
                                <input
                                    type="date"
                                    value={checkInInput}
                                    onChange={(e) => setCheckInInput(e.target.value)}
                                    className="search-input-naked"
                                />
                            </div>
                            <div className="search-divider"></div>
                            
                            <div className="search-chunk">
                                <label>Check out</label>
                                <input
                                    type="date"
                                    value={checkOutInput}
                                    onChange={(e) => setCheckOutInput(e.target.value)}
                                    className="search-input-naked"
                                />
                            </div>
                            <div className="search-divider"></div>
                            
                            <div className="search-chunk guest-chunk" onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}>
                                <label>Guests</label>
                                <div className="guest-display">
                                    {adultsInput + childrenInput} Guests, {roomsInput} Room
                                </div>
                                
                                {guestDropdownOpen && (
                                    <div className="guest-dropdown" onClick={(e) => e.stopPropagation()}>
                                        <div className="guest-row">
                                            <div className="guest-info">
                                                <div className="guest-title">Adults</div>
                                                <div className="guest-desc">Ages 13 or above</div>
                                            </div>
                                            <div className="guest-controls">
                                                <button type="button" onClick={() => setAdultsInput(Math.max(1, adultsInput - 1))}>-</button>
                                                <span>{adultsInput}</span>
                                                <button type="button" onClick={() => setAdultsInput(adultsInput + 1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="guest-row">
                                            <div className="guest-info">
                                                <div className="guest-title">Children</div>
                                                <div className="guest-desc">Ages 2-12</div>
                                            </div>
                                            <div className="guest-controls">
                                                <button type="button" onClick={() => setChildrenInput(Math.max(0, childrenInput - 1))}>-</button>
                                                <span>{childrenInput}</span>
                                                <button type="button" onClick={() => setChildrenInput(childrenInput + 1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="guest-row">
                                            <div className="guest-info">
                                                <div className="guest-title">Rooms</div>
                                            </div>
                                            <div className="guest-controls">
                                                <button type="button" onClick={() => setRoomsInput(Math.max(1, roomsInput - 1))}>-</button>
                                                <span>{roomsInput}</span>
                                                <button type="button" onClick={() => setRoomsInput(roomsInput + 1)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="premium-submit-btn"
                            >
                                {loading ? (
                                    <span className="search-btn-icon loading-spin">⟳</span>
                                ) : (
                                    <>
                                        <svg className="search-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <span>Search</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </section>

                {/* Mobile Filter Toggle */}
                <button 
                    className="mobile-filter-toggle"
                    onClick={() => setSidebarOpen(true)}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="4" y1="6" x2="20" y2="6"></line>
                        <line x1="4" y1="12" x2="20" y2="12"></line>
                        <line x1="4" y1="18" x2="20" y2="18"></line>
                    </svg>
                    Filters & Amenities
                </button>

                {/* Main Content */}
                <div className="content-grid-hotel">

                    {/* Sidebar Filters */}
                    <aside className={`hotel-sidebar ${sidebarOpen ? 'active' : ''}`}>
                        {sidebarOpen && (
                            <button 
                                className="sidebar-close"
                                onClick={() => setSidebarOpen(false)}
                            >×</button>
                        )}
                        
                        <div className="sidebar-glass">
                            <h2 className="sidebar-title">Filters</h2>
                            
                            <div className="filter-block">
                                <h3 className="filter-heading">Location</h3>
                                <select
                                    value={cityInput}
                                    onChange={(e) => setCityInput(e.target.value)}
                                    className="form-input-hotel mb-2"
                                    style={{ padding: '10px 14px', fontSize: '14px', width: '100%', cursor: 'pointer' }}
                                >
                                    <option value="">All Karabakh</option>
                                    <option value="Shusha">Shusha, Karabakh</option>
                                    <option value="Lachin">Lachin, Karabakh</option>
                                    <option value="Khankendi">Khankendi, Karabakh</option>
                                    <option value="Aghdam">Aghdam, Karabakh</option>
                                    <option value="Fuzuli">Fuzuli, Karabakh</option>
                                </select>
                            </div>
                            
                            <div className="filter-block">
                                <h3 className="filter-heading">Popular Amenities</h3>
                                <div className="filter-list">
                                    {[
                                        'Free WiFi', 'Swimming Pool', 'Free Parking', 'Spa & Wellness', 'Restaurant', 
                                        'Gym', 'Bar', 'Conference Room', 'Room Service', 'Airport Shuttle'
                                    ].map((amenity) => (
                                        <label key={amenity} className="filter-checkbox-item">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedAmenities.includes(amenity)}
                                                onChange={() => toggleAmenity(amenity)}
                                            />
                                            <span className="filter-label-text">{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="filter-block">
                                <h3 className="filter-heading">Price Range</h3>
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
                                        <button onClick={() => setSelectedPriceRange(null)} className="text-xs text-blue-500 mt-2 hover:underline">
                                            Clear Price Filter
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            <div className="filter-block">
                                <h3 className="filter-heading">Guest Rating</h3>
                                <div className="filter-list">
                                    {[
                                        { label: 'Excellent 9+', val: 9 }, 
                                        { label: 'Very Good 8+', val: 8 }, 
                                        { label: 'Good 7+', val: 7 }
                                    ].map((rating) => (
                                        <label key={rating.label} className="filter-checkbox-item">
                                            <input 
                                                type="radio"
                                                name="guestRating"
                                                checked={selectedMinRating === rating.val}
                                                onChange={() => setSelectedMinRating(rating.val)}
                                            />
                                            <span className="filter-label-text">{rating.label}</span>
                                        </label>
                                    ))}
                                    {selectedMinRating && (
                                        <button onClick={() => setSelectedMinRating(undefined)} className="text-xs text-blue-500 mt-2 hover:underline">
                                            Clear Rating Filter
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Area */}
                    <div className="results-area">
                        
                        {/* Results Header */}
                        <div className="results-header">
                            <span className="results-count">
                                {loading ? 'Searching...' : (
                                    <><strong>{hotels.length}</strong> properties found</>
                                )}
                            </span>
                            <select 
                                className="sort-dropdown"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="recommended">Recommended</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating_desc">Guest Rating</option>
                            </select>
                        </div>

                        {/* Error State */}
                        {error && (
                            <div className="error-premium">
                                <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !error && hotels.length === 0 && (
                            <div className="empty-state-premium">
                                <div className="empty-icon">🏨</div>
                                <h3 className="empty-title">No hotels found</h3>
                                <p className="empty-text">
                                    Try adjusting your search criteria or explore other destinations in Karabakh.
                                </p>
                            </div>
                        )}

                        {/* Loading Skeleton */}
                        {loading && hotels.length === 0 && (
                            <div className="hotels-grid-premium">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="skeleton-hotel"></div>
                                ))}
                            </div>
                        )}

                        {/* Hotels Grid */}
                        {!error && (hotels.length > 0 || !loading) && (
                            <div className="hotels-grid-premium">
                                {hotels.map((hotel) => (
                                    <HotelCard
                                        key={hotel.id}
                                        hotel={hotel}
                                        onClick={(id) => navigate(`/hotels/${id}`)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {hotels.length > 0 && !loading && (
                            <div className="pagination-premium">
                                <button className="page-btn" disabled>← Prev</button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">2</button>
                                <button className="page-btn">Next →</button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};