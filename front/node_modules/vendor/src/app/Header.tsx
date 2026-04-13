import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Building2, LogOut } from 'lucide-react';
import { useHotels } from '../modules/hotel/hooks/useHotels';
import { getVendorCategory, removeToken } from '../shared/utils/token';
import './Header.css';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    
    const category = getVendorCategory();
    const isHotelVendor = category === 'hotel';
    
    // Only call the hook if we are actually a hotel vendor
    // We use a local variable to avoid calling useHotels conditionally (hook rule)
    // but we ensure the hook itself handles the 'enabled' state inside it (it already does via autoFetch param)
    const { data: hotels } = useHotels(isHotelVendor);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredHotels = hotels ? hotels.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const handleSelectProperty = (id: string, name: string) => {
        setSearchQuery(name);
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
        
        // Use window.location.replace for the most definitive session termination
        window.location.replace('/vendor/login');
    };

    return (
        <header className="vendor-header">
            <div className="header-search" ref={searchRef}>
                <Search className="search-icon" size={18} />
                <input
                    type="text"
                    placeholder="Search dashboard..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                />

                {isHotelVendor && isSearchFocused && searchQuery.trim().length > 0 && (
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
                                No records found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="header-actions">
                <button className="icon-btn" type="button">
                    <Bell size={20} />
                    <span className="badge">1</span>
                </button>
                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <span className="name">Karabakh Vendor</span>
                        <span className="role">{getRoleName()}</span>
                    </div>
                </div>
                <button 
                    className="logout-btn" 
                    onClick={handleLogout} 
                    title="Çıxış"
                    type="button"
                    style={{ cursor: 'pointer', zIndex: 100 }}
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}
