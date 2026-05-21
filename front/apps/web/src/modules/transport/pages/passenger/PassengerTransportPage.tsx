import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LocationData, TaxiSearchResult } from '../../api/transport.web.api';
import { useSearchTaxis } from '../../hooks/useSearchTaxis';
import { LocationAutocomplete } from '../../components/LocationAutocomplete';
import { TransferCard } from './TransferCard';
import { MapPin, Navigation, Users, Calendar, SlidersHorizontal } from 'lucide-react';
import './PassengerTransportPage.css';

export const PassengerTransportPage = () => {
    const navigate = useNavigate();

    const [pickupLocation, setPickupLocation] = useState<LocationData>({ lat: 0, lng: 0, address: '' });
    const [dropoffLocation, setDropoffLocation] = useState<LocationData>({ lat: 0, lng: 0, address: '' });
    const [waypoints] = useState<LocationData[]>([]);
    const [paxCount, setPaxCount] = useState<number>(1);
    const [bookingDate, setBookingDate] = useState<string>(() => {
        const now = new Date();
        now.setHours(now.getHours() + 2);
        const tzOffset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
    });

    // UI States
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sortBy, setSortBy] = useState<string>('recommended');
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [error, setError] = useState('');

    const [isSearched, setIsSearched] = useState(false);
    const { mutate: searchTaxis, isPending: isSearching, data: searchResult } = useSearchTaxis();

    // Load active taxis automatically on component mount
    useEffect(() => {
        searchTaxis({ paxCount: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pickupLocation.address || !dropoffLocation.address) {
            setError('Please specify both the pickup and drop-off locations.');
            return;
        }
        setError('');
        setIsSearched(true);
        searchTaxis({
            pickupLocation,
            dropoffLocation,
            waypoints,
            paxCount,
            scheduledAt: new Date(bookingDate).toISOString()
        });
    };

    const handleBookVehicle = (taxi: TaxiSearchResult) => {
        const targetUrl = `/transport/details/${taxi.vehicle.id}`;
        navigate(targetUrl, {
            state: {
                pickupLocation: isSearched ? pickupLocation : { address: '' },
                dropoffLocation: isSearched ? dropoffLocation : { address: '' },
                waypoints: isSearched ? waypoints : [],
                paxCount,
                bookingDate,
                totalPrice: isSearched ? taxi.pricing.totalPrice : taxi.pricing.basePrice,
                distanceKm: isSearched ? taxi.pricing.distanceKm : 0,
                isSearched
            }
        });
    };

    return (
        <div className="pt-search-page">
            <main className="container">
                
                {/* HERO SECTION */}
                <section className="pt-hero">
                    <div className="pt-hero-overlay-content">
                        <h1>Karabakh Inner-City Transfers</h1>
                        <p>Start your journey safely from any location with our standard and luxury fleet.</p>
                    </div>
                </section>

                {/* ERROR STATE */}
                {error && (
                    <div className="error-premium" style={{ marginTop: '24px', marginBottom: '0' }}>
                        <span>{error}</span>
                    </div>
                )}

                {/* SEARCH BAR SECTION */}
                <div className="search-bar-wrapper">
                    <form onSubmit={handleSearch} className="search-bar" onClick={(e) => e.stopPropagation()}>
                        
                        {/* 1. PICKUP */}
                        <div className="search-item flex-1">
                            <MapPin size={22} />
                            <div style={{ width: '100%' }}>
                                <label>PICKUP LOCATION</label>
                                <div className="autocomplete-wrapper">
                                    <LocationAutocomplete
                                        value={pickupLocation}
                                        onChange={setPickupLocation}
                                        placeholder="E.g. Fuzuli Airport"
                                        className="search-input-naked"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. DROPOFF */}
                        <div className="search-item flex-1 border-left-divider">
                            <Navigation size={22} />
                            <div style={{ width: '100%' }}>
                                <label>DROP-OFF LOCATION</label>
                                <div className="autocomplete-wrapper">
                                    <LocationAutocomplete
                                        value={dropoffLocation}
                                        onChange={setDropoffLocation}
                                        placeholder="E.g. Shusha Castle"
                                        className="search-input-naked"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. DATE */}
                        <div className="search-item border-left-divider" style={{ minWidth: '180px' }}>
                            <Calendar size={22} />
                            <div>
                                <label>DATE & TIME</label>
                                <div className="search-value">
                                    <input 
                                        type="datetime-local" 
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        /* 👇 Add this onClick handler */
                                        onClick={(e) => {
                                            // Type assertion for TypeScript, safely calls the browser's native picker
                                            if ('showPicker' in HTMLInputElement.prototype) {
                                                (e.target as HTMLInputElement).showPicker();
                                            }
                                        }}
                                        className="transfer-search-input-naked"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 4. PASSENGERS */}
                        <div className="search-item border-left-divider" style={{ minWidth: '130px' }}>
                            <Users size={22} />
                            <div>
                                <label>PASSENGERS</label>
                                <div className="search-value">
                                    <select 
                                        value={paxCount}
                                        onChange={(e) => setPaxCount(Number(e.target.value))}
                                        className="search-input-naked"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                            <option key={num} value={num}>{num} Pax</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>


                        <button type="submit" disabled={isSearching} className="search-btn">
                            {isSearching ? (
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


                </div>

                {/* RESULTS SECTION */}
                <section className="results-bar">
                    <span>Showing <strong>{isSearching ? '...' : (searchResult?.data?.length || 0)}</strong> transport options</span>

                    <div className="actions">
                        <button className="ghost-btn" onClick={() => setSidebarOpen(true)}>
                            <SlidersHorizontal size={16} />
                            Filters
                        </button>
                        
                        <div className="ghost-btn sort-wrapper">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                            Sort:
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="inline-sort-select">
                                <option value="recommended">Recommended</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* EMPTY STATES */}
                {!isSearching && (!searchResult?.data || searchResult.data.length === 0) && (
                    <div className="empty-state-premium">
                        <h3 className="empty-title">No transport options found</h3>
                        <p className="empty-text">Unfortunately, there are no vehicles matching your search criteria right now. You can try adjusting the passenger count or checking a different address.</p>
                    </div>
                )}

                {/* TRANSFER LIST SECTION */}
                <section className="pt-grid">
                    {isSearching ? (
                        [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton-card"></div>)
                    ) : (
                        searchResult?.data?.map((taxi, idx) => (
                            <TransferCard
                                key={taxi.vehicle.id || idx}
                                taxi={taxi}
                                onClick={() => handleBookVehicle(taxi)}
                                hasRoute={!!pickupLocation.address && !!dropoffLocation.address}
                            />
                        ))
                    )}
                </section>

            </main>

            {/* OFF-CANVAS SIDEBAR FOR FILTERS */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
            <aside className={`offcanvas-sidebar ${sidebarOpen ? 'active' : ''}`}>
                <div className="sidebar-filter">
                    <h2>Filters</h2>
                    <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>
                
                <div className="sidebar-content">
                    <div className="filter-block">
                        <h3 className="filter-heading">Vehicle Category</h3>
                        <div className="filter-list">
                            {['Economy', 'Business', 'Premium', 'Minivan', 'Bus'].map((cat) => (
                                <label key={cat} className="filter-checkbox-item">
                                    <input 
                                        type="radio" 
                                        name="vehicleCategory"
                                        checked={selectedCategory === cat}
                                        onChange={() => setSelectedCategory(cat)}
                                    />
                                    <span className="filter-label-text">{cat}</span>
                                </label>
                            ))}
                            {selectedCategory && (
                                <button onClick={() => setSelectedCategory(undefined)} className="clear-filter-btn">
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};