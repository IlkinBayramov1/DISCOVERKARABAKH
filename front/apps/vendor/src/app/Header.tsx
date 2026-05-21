import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Building2, LogOut, ChevronDown } from 'lucide-react';
import { useHotels } from '../modules/hotel/hooks/useHotels';
import { getVendorCategory, removeToken } from '../shared/utils/token';
import './Header.css';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    
    const category = getVendorCategory();
    const isHotelVendor = category === 'hotel';
    
    const { data: hotels } = useHotels(isHotelVendor);

    // Kənar klikləri dinləyərək dropdown-ları bağlayırıq
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredHotels = hotels ? hotels.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const handleSelectProperty = (id: string) => {
        setSearchQuery('');
        setIsSearchFocused(false);
        navigate(`/hotel/edit/${id}`);
    };

    const getRoleName = () => {
        switch (category) {
            case 'hotel': return 'Hotel Partner';
            case 'transport': return 'Transport Partner';
            case 'tour': return 'Tour Partner';
            case 'attraction': return 'Attraction Partner';
            case 'restaurant': return 'Food Partner';
            default: return 'Partner Portal';
        }
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Action: Logout triggered');
        removeToken();
        window.location.replace('/vendor/login');
    };

    return (
        <header className="dk-vendor-header">
            
            {/* SEARCH AREA */}
            <div className="dk-header-search" ref={searchRef}>
                <div className={`search-input-wrap ${isSearchFocused ? 'focused' : ''}`}>
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search properties, reservations, or guests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                    />
                </div>

                {isHotelVendor && isSearchFocused && searchQuery.trim().length > 0 && (
                    <div className="dk-search-dropdown animation-slide-down">
                        <div className="dropdown-label">Search Results</div>
                        {filteredHotels.length > 0 ? (
                            filteredHotels.map(hotel => (
                                <div
                                    key={hotel.id}
                                    className="search-result-item"
                                    onClick={() => handleSelectProperty(hotel.id)}
                                >
                                    <div className="result-icon-box">
                                        <Building2 size={16} />
                                    </div>
                                    <div className="result-details">
                                        <span className="result-name">{hotel.name}</span>
                                        <span className="result-address">{hotel.address}</span>
                                    </div>
                                    <span className={`result-status ${hotel.status}`}>
                                        {hotel.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="search-empty-state">
                                No records found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ACTIONS AREA */}
            <div className="dk-header-actions">
                
                {/* Notifications */}
                <button className="dk-icon-btn notification" type="button" title="Notifications">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>

                {/* Divider */}
                <div className="dk-header-divider"></div>

                {/* Profile Area */}
                <div className="dk-profile-dropdown-wrap" ref={profileRef}>
                    <button 
                        className="dk-profile-trigger" 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="profile-avatar">
                            <span className="avatar-initial">KV</span>
                        </div>
                        <div className="profile-info">
                            <span className="profile-name">Karabakh Vendor</span>
                            <span className="profile-role">{getRoleName()}</span>
                        </div>
                        <ChevronDown size={16} className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`} />
                    </button>

                    {isProfileOpen && (
                        <div className="dk-profile-dropdown animation-slide-down">
                            <div className="dropdown-header">
                                <span className="user-email">vendor@discoverkarabakh.az</span>
                            </div>
                            <div className="dropdown-body">
                                <button className="dropdown-item" onClick={() => { setIsProfileOpen(false); navigate('/vendor/settings'); }}>
                                    <User size={16} /> Account Settings
                                </button>
                                <button className="dropdown-item logout" onClick={handleLogout}>
                                    <LogOut size={16} /> Secure Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}