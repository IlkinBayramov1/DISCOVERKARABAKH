 import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarCheck,
    BedDouble,
    CalendarDays,
    MessageSquare,
    Image
} from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
    const routes = [
        { path: '/vendor/dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/vendor/reservations', name: 'Reservations', icon: CalendarCheck },
        { path: '/vendor/rooms', name: 'Rooms', icon: BedDouble },
        { path: '/vendor/availability', name: 'Availability', icon: CalendarDays },
        { path: '/vendor/reviews', name: 'Reviews', icon: MessageSquare },
        { path: '/vendor/content', name: 'Content', icon: Image },
    ];

    return (
        <aside className="vendor-sidebar glassmorphism-sidebar">
            <div className="sidebar-brand">
                <h2>Vendor Portal</h2>
            </div>

            <nav className="sidebar-nav">
                {routes.map((route) => {
                    const Icon = route.icon;
                    return (
                        <NavLink
                            key={route.path}
                            to={route.path}
                            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon className="sidebar-icon" size={20} />
                            <span>{route.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <div className="upgrade-box">
                    <p>Need more reach?</p>
                    <button className="btn-upgrade">Feature Property</button>
                </div>
            </div>
        </aside>
    );
}
