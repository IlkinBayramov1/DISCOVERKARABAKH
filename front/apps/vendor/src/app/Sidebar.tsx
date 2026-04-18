import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    LayoutGrid,
    CalendarCheck,
    BedDouble,
    CalendarDays,
    MessageSquare,
    Image,
    Car,
    Users,
    DollarSign,
    Map,
    MapPin,
    Plus,
    Compass,
    Home
} from 'lucide-react';
import { getVendorCategory } from '@/shared/utils/token';
import './Sidebar.css';

type ModuleType = 'hotel' | 'transport' | 'tour' | 'attraction' | 'default';

export default function Sidebar() {
    const location = useLocation();

    // Determine current module based on URL path or stored category
    const getActiveModule = (): ModuleType => {
        const path = location.pathname;
        
        // 1. Check path-based modules first (priority)
        if (path.startsWith('/attraction')) return 'attraction';
        if (path.startsWith('/tour')) return 'tour';
        if (path.startsWith('/transport')) return 'transport';
        if (path.startsWith('/restaurant')) return 'default';
        if (path.startsWith('/hotel')) return 'hotel';
        
        // 2. Check stored category for generic paths like /dashboard
        const storedCategory = getVendorCategory()?.toLowerCase();
        if (storedCategory === 'attraction') return 'attraction';
        if (storedCategory === 'tour') return 'tour';
        if (storedCategory === 'transport') return 'transport';
        if (storedCategory === 'hotel') return 'hotel';

        // 3. Fallback for hotel properties
        const hotelOnlySubPaths = ['/reservations', '/rooms', '/availability', '/reviews', '/content'];
        if (hotelOnlySubPaths.some(sub => path === sub)) return 'hotel';

        return 'hotel'; // Ultimate fallback
    };

    const activeModule = getActiveModule();

    const moduleRoutes: Record<ModuleType, { path: string; name: string; icon: any }[]> = {
        hotel: [
            { path: '/hotel/dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { path: '/hotel/my-property', name: 'My Hotel', icon: Home },
            { path: '/reservations', name: 'Reservations', icon: CalendarCheck },
            { path: '/rooms', name: 'Room Types', icon: BedDouble },
            { path: '/rooms/inventory', name: 'Room Inventory', icon: LayoutGrid },
            { path: '/availability', name: 'Availability', icon: CalendarDays },
            { path: '/hotel/pricing', name: 'Pricing Rules', icon: DollarSign },
            { path: '/reviews', name: 'Reviews', icon: MessageSquare },
            { path: '/content', name: 'Content', icon: Image },
        ],
        transport: [
            { path: '/transport/dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { path: '/transport/fleet', name: 'Vasitə Parkı', icon: Car },
            { path: '/transport/drivers', name: 'Sürücülər', icon: Users },
            { path: '/transport/pricing', name: 'Qiymət Qaydaları', icon: DollarSign },
            { path: '/transport/locations', name: 'Məkanlar', icon: MapPin },
            { path: '/transport/orders', name: 'Sifarişlər', icon: Map },
        ],
        tour: [
            { path: '/tours', name: 'Dashboard', icon: LayoutDashboard },
            { path: '/tours/bookings', name: 'Sifarişlər', icon: CalendarCheck },
            { path: '/availability', name: 'Mövcudluq', icon: CalendarDays },
            { path: '/tours/reviews', name: 'Rəylər', icon: MessageSquare },
            { path: '/tours/create', name: 'Yeni Tur', icon: Plus },
        ],
        attraction: [
            { path: '/attractions', name: 'Dashboard', icon: LayoutDashboard },
            { path: '/attractions/reviews', name: 'Rəylər', icon: MessageSquare },
            { path: '/attractions/create', name: 'Yeni Əyləncə', icon: Compass },
        ],
        default: []
    };

    const routes = moduleRoutes[activeModule] || [];
    const moduleName = activeModule.charAt(0).toUpperCase() + activeModule.slice(1);

    return (
        <aside className="vendor-sidebar glassmorphism-sidebar">
            <div className="sidebar-brand">
                <h2>{moduleName} Portal</h2>
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
                    <p>
                        {activeModule === 'transport' ? 'Need more rides?' :
                            activeModule === 'hotel' ? 'Need more reach?' :
                                activeModule === 'tour' ? 'Want more travelers?' :
                                    activeModule === 'attraction' ? 'Want more visitors?' : 'Grow your business'}
                    </p>
                    <button className="btn-upgrade">
                        {activeModule === 'transport' ? 'Feature Fleet' :
                            activeModule === 'hotel' ? 'Feature Property' :
                                activeModule === 'tour' ? 'Feature Experience' :
                                    activeModule === 'attraction' ? 'Feature Attraction' : 'Upgrade Now'}
                    </button>
                </div>
            </div>
        </aside>
    );
}
