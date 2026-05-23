import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    Hotel, Map as MapIcon, FerrisWheel, Car, Package, Users,
    BadgeCheck, ChevronDown, ChevronRight, MapPin, Shield,
    Heart, Briefcase, Wallet, LogOut, User as UserIcon, Flame
} from 'lucide-react';
import { getUserRole } from '../../../shared/utils/token';
import { useAuth } from '../../../shared/context/AuthContext';
import { WebHeaderWeather } from '../WebHeader/WebHeaderWeather'; // Import your weather widget
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [transportOpen, setTransportOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();
    
    // Auth and User data
    const userRole = getUserRole();
    const { isAuthenticated, user, logout } = useAuth();
    const userBalance = (user as any)?.balance ?? 0.00;

    const searchParams = new URLSearchParams(location.search);
    const currentCity = searchParams.get('city') || '';

    const handleCitySelect = (cityName: string) => {
        const newParams = new URLSearchParams(location.search);
        if (cityName) {
            newParams.set('city', cityName);
        } else {
            newParams.delete('city');
        }
        navigate(`${location.pathname}?${newParams.toString()}`);
        
        // Removed onClose() here! 
        // Now the sidebar will stay open when swapping cities, 
        // but will still close when clicking Hotels, Tours, etc.
    };

    const buildLink = (path: string) => {
        const params = new URLSearchParams(location.search);
        return `${path}?${params.toString()}`;
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>

            <aside className={`web-sidebar ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar-nav">
                    <ul>
                        
                        {/* MOBILE ONLY: WEATHER WIDGET */}
                        <li className="mobile-only-section weather-mobile-wrapper">
                            <WebHeaderWeather />
                        </li>

                        <li className="nav-group city-filter-group">
                            <button className="nav-link expandable" onClick={() => setCityOpen(!cityOpen)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <MapPin size={20} />
                                    <span>Location</span>
                                </div>
                                {cityOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            <ul className={`sub-nav ${cityOpen ? 'open' : ''}`}>
                                {['Shusha', 'Lachin', 'Khankendi', 'Aghdam'].map((city) => (
                                    <li key={city}>
                                        <button
                                            className={`sub-nav-link ${currentCity === city ? 'active' : ''}`}
                                            onClick={() => handleCitySelect(city)}
                                        >
                                            {city}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        className={`sub-nav-link ${!currentCity ? 'active' : ''}`}
                                        onClick={() => handleCitySelect('')}
                                    >
                                        All Karabakh
                                    </button>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-divider"></li>

                        <li>
                            <NavLink to={buildLink("/hotels")} onClick={onClose} className={({ isActive }) => 
                                isActive && location.pathname.includes('/hotels') ? 'nav-link active' : 'nav-link'
                            }>
                                <Hotel size={20} />
                                <span>Hotels</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={buildLink("/tours")} onClick={onClose} className={({ isActive }) => 
                                isActive && location.pathname.includes('/tours') ? 'nav-link active' : 'nav-link'
                            }>
                                <MapIcon size={20} />
                                <span>Tours</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={buildLink("/attractions")} onClick={onClose} className={({ isActive }) => 
                                isActive && location.pathname.includes('/attractions') ? 'nav-link active' : 'nav-link'
                            }>
                                <FerrisWheel size={20} />
                                <span>Attractions</span>
                            </NavLink>
                        </li>
                        {(!isAuthenticated || userRole !== 'tourist') && (
                            <li>
                                <NavLink to={buildLink("/utility")} onClick={onClose} className={({ isActive }) => 
                                    isActive && location.pathname.includes('/utility') ? 'nav-link active' : 'nav-link'
                                }>
                                    <Flame size={20} />
                                    <span>Utility Bills</span>
                                </NavLink>
                            </li>
                        )}

                        <li className="nav-group">
                            <button className="nav-link expandable" onClick={() => setTransportOpen(!transportOpen)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Car size={20} />
                                    <span>Transport</span>
                                </div>
                                {transportOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            <ul className={`sub-nav ${transportOpen ? 'open' : ''}`}>
                                <li>
                                    <NavLink to={buildLink("/transport/passenger")} onClick={onClose} className={({ isActive }) => 
                                        isActive && location.pathname.includes('/transport/passenger') ? 'sub-nav-link active' : 'sub-nav-link'
                                    }>
                                        <Users size={18} />
                                        <span>VIP Transfer</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </li>

                        {/* ==============================================
                            MOBILE ONLY: USER ACCOUNT ACTIONS 
                            ============================================== */}
                        <li className="nav-divider mobile-only-section"></li>
                        
                        <div className="mobile-only-section">
                            {isAuthenticated ? (
                                <>
                                    <li>
                                        <div 
                                            className="mobile-balance-card" 
                                            onClick={() => { navigate('/account/wallet'); onClose(); }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Wallet size={20} className="balance-icon" />
                                            <div className="balance-info">
                                                <span className="balance-label">Wallet Balance</span>
                                                <span className="balance-amount">{userBalance.toFixed(2)} ₼</span>
                                            </div>
                                            <button className="mobile-deposit-btn">+</button>
                                        </div>
                                    </li>
                                    <li>
                                        <NavLink to="/account/profile" onClick={onClose} className="nav-link">
                                            <UserIcon size={20} />
                                            <span>My Profile</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/account/favorites" onClick={onClose} className="nav-link">
                                            <Heart size={20} />
                                            <span>Favorites</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/account/trips" onClick={onClose} className="nav-link">
                                            <Briefcase size={20} />
                                            <span>My Trips</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <button onClick={() => { logout(); onClose(); }} className="nav-link text-red">
                                            <LogOut size={20} />
                                            <span>Logout</span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <NavLink to="/auth/login" onClick={onClose} className="nav-link">
                                            <UserIcon size={20} />
                                            <span>Login</span>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/auth/register" onClick={onClose} className="nav-link">
                                            <Shield size={20} />
                                            <span>Register</span>
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </div>

                    </ul>
                </nav>
            </aside>
        </>
    );
}