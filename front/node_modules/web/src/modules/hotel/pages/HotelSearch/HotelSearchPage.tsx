import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHotelSearch } from '../../hooks/useHotelSearch';
import { HotelCard } from '../../components/HotelCard';
import './HotelSearchPage.css';

export const HotelSearchPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    // UI Local State
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

    // Sidebar Filter States
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
    const [selectedMinRating, setSelectedMinRating] = useState<number | undefined>(undefined);
    const [sortBy, setSortBy] = useState<string>('recommended');

    // Active Filters State
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

    // Handle Header Search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    // Construct backend filter payload
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
            <main className="container">
                
                {/* HERO SECTION */}
                <section className="hero">
                    <div className="hero-overlay">
                        <h1>Hotels & Accommodations</h1>
                        <p>Find the perfect place to stay in Karabakh.</p>
                    </div>
                </section>

                {/* SEARCH BAR SECTION */}
                <form onSubmit={handleSearch} className="search-bar" onClick={(e) => e.stopPropagation()}>
                    
                    {/* 0. KEYWORD SEARCH */}
                    <div className="search-item hotel-name-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <div style={{ width: '100%' }}>
                            <label>HOTEL NAME</label>
                            <input 
                                type="text" 
                                placeholder="Search by hotel name..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="search-input-naked"
                                style={{ width: '100%', fontSize: '15px' }}
                            />
                        </div>
                    </div>

                    {/* 1. LOCATION */}
                    <div className="search-item location-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <div>
                            <label>LOCATION</label>
                            <div className="search-value">
                                {cityInput ? `${cityInput}` : 'Karabakh'}
                            </div>
                        </div>
                    </div>
                    
                    {/* 2. CHECK-IN / OUT */}
                    <div className="search-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <div>
                            <label>CHECK-IN / OUT</label>
                            <div className="date-inputs search-value">
                                <input type="date" value={checkInInput} onChange={(e) => setCheckInInput(e.target.value)} className="search-input-naked" />
                                <span>-</span>
                                <input type="date" value={checkOutInput} onChange={(e) => setCheckOutInput(e.target.value)} className="search-input-naked" />
                            </div>
                        </div>
                    </div>

                    {/* 3. GUESTS */}
                    <div className="search-item guest-item" onClick={() => setGuestDropdownOpen(!guestDropdownOpen)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        <div>
                            <label>GUESTS</label>
                            <div className="search-value">
                                {adultsInput + childrenInput} Guests, {roomsInput} Room
                            </div>
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
                    <span>Showing <strong>{loading ? '...' : hotels.length}</strong> results</span>

                    <div className="actions">
                        <button className="ghost-btn" onClick={() => setSidebarOpen(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line></svg>
                            Filters
                        </button>
                        
                        <div className="ghost-btn sort-wrapper">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                            Sort by:
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="inline-sort-select">
                                <option value="recommended">Recommended</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating_desc">Guest Rating</option>
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
                {!loading && !error && hotels.length === 0 && (
                    <div className="empty-state-premium">
                        <h3 className="empty-title">No hotels found</h3>
                        <p className="empty-text">Try adjusting your search criteria or explore other destinations.</p>
                    </div>
                )}

                {/* HOTEL LIST SECTION */}
                <section className="hotel-grid">
                    {loading && hotels.length === 0 ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map((i) => <div key={i} className="skeleton-hotel"></div>)
                    ) : (
                        hotels.map((hotel) => (
                            <HotelCard
                                key={hotel.id}
                                hotel={hotel}
                                onClick={(id) => navigate(`/hotels/${id}`)}
                            />
                        ))
                    )}
                </section>

            </main>

            {/* OFF-CANVAS SIDEBAR FOR FILTERS */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
            <aside className={`hotel-offcanvas-sidebar ${sidebarOpen ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <h2>Filters</h2>
                    <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>
                
                <div className="sidebar-content">

                    <div className="filter-block">
                        <h3 className="filter-heading">Hotel Class</h3>
                        <div className="filter-list">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <label key={star} className="filter-checkbox-item">
                                    <input 
                                        type="radio" 
                                        name="starRating"
                                        checked={starRatingInput === star}
                                        onChange={() => setStarRatingInput(star)}
                                    />
                                    <span className="filter-label-text">
                                        {star} Stars
                                        <span style={{ color: '#ffb400', marginLeft: '8px' }}>
                                            {'★'.repeat(star)}{'☆'.repeat(5 - star)}
                                        </span>
                                    </span>
                                </label>
                            ))}
                            {starRatingInput && (
                                <button onClick={() => setStarRatingInput(undefined)} className="clear-filter-btn">
                                    Clear Stars
                                </button>
                            )}
                        </div>
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
                                <button onClick={() => setSelectedPriceRange(null)} className="clear-filter-btn">
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
                                <button onClick={() => setSelectedMinRating(undefined)} className="clear-filter-btn">
                                    Clear Rating Filter
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};