import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    Hotel,
    Map as MapIcon,
    FerrisWheel,
    Car,
    Package,
    Users,
    BadgeCheck,
    ChevronDown,
    ChevronRight,
    MapPin,
    Shield
} from 'lucide-react';
import { getUserRole } from '../../../shared/utils/token';
import logoImg from '../../../assets/dk-logo3.png';
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

    const userRole = getUserRole();

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
    };

    const buildLink = (path: string) => {
        const params = new URLSearchParams(location.search);
        // We keep the existing city if it's there, but the buildLink might be called 
        // for paths that should inherit all current search params
        return `${path}?${params.toString()}`;
    };

    const toggleTransport = (e: React.MouseEvent) => {
        e.preventDefault();
        setTransportOpen(!transportOpen);
    };

    const toggleCity = (e: React.MouseEvent) => {
        e.preventDefault();
        setCityOpen(!cityOpen);
    };

    return (
        <>
            {/* Mobile/Desktop Overlay */}
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>

            <aside className={`web-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src={logoImg} alt="Discover Karabakh Logo" style={{ height: '70px', objectFit: 'contain' }} />
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        {/* City Global Filter */}
                        <li className="nav-group city-filter-group">
                            <button className="nav-link expandable" onClick={toggleCity}>
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
                            <NavLink to={buildLink("/hotels")} className={({ isActive }) => 
                                isActive && location.pathname.includes('/hotels') ? 'nav-link active' : 'nav-link'
                            }>
                                <Hotel size={20} />
                                <span>Hotels</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={buildLink("/tours")} className={({ isActive }) => 
                                isActive && location.pathname.includes('/tours') ? 'nav-link active' : 'nav-link'
                            }>
                                <MapIcon size={20} />
                                <span>Tours</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={buildLink("/attractions")} className={({ isActive }) => 
                                isActive && location.pathname.includes('/attractions') ? 'nav-link active' : 'nav-link'
                            }>
                                <FerrisWheel size={20} />
                                <span>Attractions</span>
                            </NavLink>
                        </li>

                        {/* Nested Transport Category */}
                        <li className="nav-group">
                            <button className="nav-link expandable" onClick={toggleTransport}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Car size={20} />
                                    <span>Transport</span>
                                </div>
                                {transportOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            <ul className={`sub-nav ${transportOpen ? 'open' : ''}`}>
                                {userRole !== 'tourist' && (
                                    <li>
                                        <NavLink to={buildLink("/transport/cargo")} className={({ isActive }) => 
                                            isActive && location.pathname.includes('/transport/cargo') ? 'sub-nav-link active' : 'sub-nav-link'
                                        }>
                                            <Package size={18} />
                                            <span>Yükdaşıma (Cargo)</span>
                                        </NavLink>
                                    </li>
                                )}
                                <li>
                                    <NavLink to={buildLink("/transport/passenger")} className={({ isActive }) => 
                                        isActive && location.pathname.includes('/transport/passenger') ? 'sub-nav-link active' : 'sub-nav-link'
                                    }>
                                        <Users size={18} />
                                        <span>VIP Transfer</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to={buildLink("/transport/driver")} className={({ isActive }) => 
                                        isActive && location.pathname.includes('/transport/driver') ? 'sub-nav-link active' : 'sub-nav-link'
                                    }>
                                        <BadgeCheck size={18} />
                                        <span>Sürücü (Driver) Onboarding</span>
                                    </NavLink>
                                </li>
                                {userRole === 'driver' && (
                                    <li>
                                        <NavLink to="/driver/dashboard" className={({ isActive }) => 
                                            isActive ? 'sub-nav-link active' : 'sub-nav-link'
                                        }>
                                            <Shield size={18} />
                                            <span>Sürücü Portalı (Portal)</span>
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}