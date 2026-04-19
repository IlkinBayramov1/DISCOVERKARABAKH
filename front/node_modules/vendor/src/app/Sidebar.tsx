import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CalendarCheck,
    BedDouble,
    CalendarDays,
    MessageSquare,
    Image as ImageIcon,
    Car,
    Users,
    DollarSign,
    Map,
    MapPin,
    Plus,
    Compass,
    Home,
    ShieldCheck
} from 'lucide-react';
import { getVendorCategory } from '@/shared/utils/token';
import logoImg from '../assets/dk-logo3.png'; // Logonu öz layihənizə uyğun tənzimləyin
import './Sidebar.css';

type ModuleType = 'hotel' | 'transport' | 'tour' | 'attraction' | 'default';

export default function Sidebar() {
    const location = useLocation();

    // URL və ya token əsasında cari modulu (hotel, tour, vs.) təyin edirik
    const getActiveModule = (): ModuleType => {
        const path = location.pathname;
        
        // 1. URL əsasında yoxlama
        if (path.startsWith('/attraction')) return 'attraction';
        if (path.startsWith('/tour')) return 'tour';
        if (path.startsWith('/transport')) return 'transport';
        if (path.startsWith('/restaurant')) return 'default';
        if (path.startsWith('/hotel')) return 'hotel';
        
        // 2. Token daxilindəki kateqoriyaya əsasən yoxlama
        const storedCategory = getVendorCategory()?.toLowerCase();
        if (storedCategory === 'attraction') return 'attraction';
        if (storedCategory === 'tour') return 'tour';
        if (storedCategory === 'transport') return 'transport';
        if (storedCategory === 'hotel') return 'hotel';

        // 3. Hotel modulu üçün xüsusi alt yollar
        const hotelOnlySubPaths = ['/reservations', '/rooms', '/availability', '/reviews', '/content'];
        if (hotelOnlySubPaths.some(sub => path === sub || path.startsWith(sub))) return 'hotel';

        return 'hotel'; // Heç biri tapılmazsa default olaraq hotel
    };

    const activeModule = getActiveModule();

    // Hər modul üçün fərqli menyu strukturu
    const moduleRoutes: Record<ModuleType, { path: string; name: string; icon: React.ElementType }[]> = {
        hotel: [
            { path: '/hotel/dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { path: '/hotel/my-property', name: 'My Property', icon: Home },
            { path: '/reservations', name: 'Reservations', icon: CalendarCheck },
            { path: '/rooms', name: 'Room Types', icon: BedDouble },
            { path: '/availability', name: 'Availability Matrix', icon: CalendarDays },
            { path: '/hotel/pricing', name: 'Pricing Rules', icon: DollarSign },
            { path: '/reviews', name: 'Guest Reviews', icon: MessageSquare },
            { path: '/content', name: 'Media Center', icon: ImageIcon },
        ],
        transport: [
            { path: '/transport/dashboard', name: 'Dashboard', icon: LayoutDashboard },
            { path: '/transport/fleet', name: 'Vehicle Fleet', icon: Car },
            { path: '/transport/drivers', name: 'Drivers Network', icon: Users },
            { path: '/transport/pricing', name: 'Pricing Engine', icon: DollarSign },
            { path: '/transport/locations', name: 'Service Areas', icon: MapPin },
            { path: '/transport/orders', name: 'Active Orders', icon: Map },
        ],
        tour: [
            { path: '/tours', name: 'Dashboard', icon: LayoutDashboard },
            { path: '/tours/bookings', name: 'Tour Bookings', icon: CalendarCheck },
            { path: '/availability', name: 'Schedule', icon: CalendarDays },
            { path: '/tours/reviews', name: 'Traveler Reviews', icon: MessageSquare },
            { path: '/tours/create', name: 'Create Experience', icon: Plus },
        ],
        attraction: [
            { path: '/attractions', name: 'Dashboard', icon: LayoutDashboard },
            { path: '/attractions/reviews', name: 'Visitor Reviews', icon: MessageSquare },
            { path: '/attractions/create', name: 'Add Attraction', icon: Compass },
        ],
        default: []
    };

    const routes = moduleRoutes[activeModule] || [];
    const moduleName = activeModule.charAt(0).toUpperCase() + activeModule.slice(1);

    return (
        <aside className="dk-vendor-sidebar">
            
            {/* BRANDING / LOGO AREA */}
            <div className="dk-sidebar-brand">
                <img src={logoImg} alt="Discover Karabakh" className="dk-sidebar-logo" />
                <div className="dk-vendor-badge">
                    <ShieldCheck size={14} /> {moduleName} Partner
                </div>
            </div>

            {/* NAVIGATION LINKS */}
            <nav className="dk-sidebar-nav">
                <ul>
                    {routes.map((route) => {
                        const Icon = route.icon;
                        return (
                            <li key={route.path}>
                                <NavLink
                                    to={route.path}
                                    className={({ isActive }) => 
                                        isActive || location.pathname.includes(route.path) 
                                            ? 'dk-sidebar-link active' 
                                            : 'dk-sidebar-link'
                                    }
                                >
                                    <Icon className="dk-sidebar-icon" size={20} strokeWidth={2.5} />
                                    <span>{route.name}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>


            
        </aside>
    );
}