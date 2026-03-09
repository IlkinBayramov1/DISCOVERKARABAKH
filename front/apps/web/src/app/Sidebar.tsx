import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Hotel,
    Map as MapIcon,
    CalendarDays,
    Utensils,
    FerrisWheel,
    Car,
    Package,
    Users,
    ChevronDown,
    ChevronRight,
    X
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [transportOpen, setTransportOpen] = useState(false);

    const toggleTransport = (e: React.MouseEvent) => {
        e.preventDefault();
        setTransportOpen(!transportOpen);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

            <aside className={`web-sidebar glassmorphism ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header mobile-only">
                    <h2>Menu</h2>
                    <button className="icon-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <NavLink to="/hotels" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                <Hotel size={20} />
                                <span>Hotels</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/tours" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                <MapIcon size={20} />
                                <span>Tours</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/events" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                <CalendarDays size={20} />
                                <span>Events</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/restaurants" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                <Utensils size={20} />
                                <span>Restaurants</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/attractions" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                                <FerrisWheel size={20} />
                                <span>Attractions</span>
                            </NavLink>
                        </li>

                        {/* Nested Transport Category */}
                        <li className="nav-group">
                            <button className="nav-link expandable" onClick={toggleTransport}>
                                <div className="flex-align-center gap-3">
                                    <Car size={20} />
                                    <span>Transport</span>
                                </div>
                                {transportOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </button>

                            <ul className={`sub-nav ${transportOpen ? 'open' : ''}`}>
                                <li>
                                    <NavLink to="/transport/cargo" className={({ isActive }) => isActive ? 'sub-nav-link active' : 'sub-nav-link'}>
                                        <Package size={18} />
                                        <span>Yükdaşıma (Cargo)</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/transport/passenger" className={({ isActive }) => isActive ? 'sub-nav-link active' : 'sub-nav-link'}>
                                        <Users size={18} />
                                        <span>Sərnişin (Passenger)</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}
