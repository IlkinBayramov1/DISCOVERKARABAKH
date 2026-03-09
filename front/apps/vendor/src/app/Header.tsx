import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Building2 } from 'lucide-react';
import { useHotels } from '../modules/hotel/hooks/useHotels';
import './Header.css';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const { data: hotels } = useHotels(true); // Fetches all vendor properties
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredHotels = hotels.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectProperty = (id: string, name: string) => {
        setSearchQuery(name);
        setIsSearchFocused(false);
        // Navigate explicitly to the edit/details page of that property
        navigate(`/vendor/hotel/edit/${id}`);
    };
    return (
        <header className="vendor-header">
            <div className="header-search" ref={searchRef}>
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Search your properties, locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                />

                {isSearchFocused && searchQuery.trim().length > 0 && (
                    <div className="search-dropdown">
                        {filteredHotels.length > 0 ? (
                            filteredHotels.map(hotel => (
                                <div
                                    key={hotel.id}
                                    className="search-result-item"
                                    onClick={() => handleSelectProperty(hotel.id, hotel.name)}
                                >
                                    <Building2 size={16} className="result-icon" />
                                    <div className="result-details">
                                        <span className="result-name">{hotel.name}</span>
                                        <span className="result-address">{hotel.address}</span>
                                    </div>
                                    <span className={`status-badge ${hotel.status} small`}>
                                        {hotel.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="search-no-results">
                                No properties found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="header-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="badge">3</span>
                </button>
                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <span className="name">Karabakh Vendor</span>
                        <span className="role">Premium Partner</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
