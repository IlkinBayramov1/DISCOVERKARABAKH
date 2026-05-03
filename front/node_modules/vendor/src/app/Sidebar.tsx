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
    Home,
    ShieldCheck,
    BarChart3
} from 'lucide-react';
import { getVendorCategory } from '../shared/utils/token';
import logoImg from '../assets/dk-logo3.png';
import './Sidebar.css';

interface RouteItem {
    path: string;
    name: string;
    icon: React.ElementType;
}

interface NavSection {
    title: string;
    items: RouteItem[];
}

type ModuleType = 'hotel' | 'transport' | 'tour' | 'attraction' | 'default';

export default function Sidebar() {
    const location = useLocation();

    const getActiveModule = (): ModuleType => {
        const path = location.pathname;
        
        if (path.startsWith('/attractions')) return 'attraction';
        if (path.startsWith('/tours')) return 'tour';
        if (path.startsWith('/transport')) return 'transport';
        if (path.startsWith('/hotel')) return 'hotel';
        
        const storedCategory = getVendorCategory()?.toLowerCase();
        if (storedCategory === 'attraction') return 'attraction';
        if (storedCategory === 'tour') return 'tour';
        if (storedCategory === 'transport') return 'transport';
        if (storedCategory === 'hotel') return 'hotel';

        return 'hotel'; 
    };

    const activeModule = getActiveModule();

    const moduleRoutes: Record<ModuleType, NavSection[]> = {
        hotel: [
            {
                title: 'Ümumi Baxış',
                items: [
                    { path: '/hotel/dashboard', name: 'Dashboard', icon: LayoutDashboard },
                    { path: '/hotel/my-property', name: 'Məkanım (Property)', icon: Home },
                ]
            },
            {
                title: 'İdarəetmə',
                items: [
                    { path: '/reservations', name: 'Rezervasiyalar', icon: CalendarCheck },
                    { path: '/rooms', name: 'Otaq Növləri', icon: BedDouble },
                    { path: '/availability', name: 'Əlyetərlilik Matrisi', icon: CalendarDays },
                    { path: '/hotel/pricing', name: 'Qiymət Qaydaları', icon: DollarSign },
                ]
            },
            {
                title: 'Əlaqə və Feedback',
                items: [
                    { path: '/reviews', name: 'Müştəri Rəyləri', icon: MessageSquare },
                ]
            }
        ],
        transport: [
            {
                title: 'Əməliyyatlar',
                items: [
                    { path: '/transport/dashboard', name: 'Dashboard', icon: LayoutDashboard },
                    { path: '/transport/orders', name: 'Aktiv Sifarişlər', icon: Map },
                ]
            },
            {
                title: 'Resurslar',
                items: [
                    { path: '/transport/fleet', name: 'Nəqliyyat Parkı', icon: Car },
                    { path: '/transport/drivers', name: 'Sürücü Şəbəkəsi', icon: Users },
                    { path: '/transport/locations', name: 'Xidmət Sahələri', icon: MapPin },
                ]
            },
            {
                title: 'Maliyyə',
                items: [
                    { path: '/transport/pricing', name: 'Qiymət Mühərriki', icon: DollarSign },
                ]
            }
        ],
        tour: [
            {
                title: 'Planlaşdırma',
                items: [
                    { path: '/tours', name: 'Dashboard', icon: LayoutDashboard },
                    { path: '/tours/schedule', name: 'Cədvəl', icon: CalendarDays },
                ]
            },
            {
                title: 'Satış',
                items: [
                    { path: '/tours/bookings', name: 'Tur Rezervləri', icon: CalendarCheck },
                    { path: '/tours/create', name: 'Yeni Təcrübə Yarat', icon: Plus },
                ]
            },
            {
                title: 'Feedback',
                items: [
                    { path: '/tours/reviews', name: 'Səyahətçi Rəyləri', icon: MessageSquare },
                ]
            }
        ],
        attraction: [
            {
                title: 'Ümumi Baxış',
                items: [
                    { path: '/attractions', name: 'Dashboard', icon: LayoutDashboard },
                    { path: '/attractions/analytics', name: 'Analitika', icon: BarChart3 },
                ]
            },
            {
                title: 'İdarəetmə',
                items: [
                    { path: '/attractions/create', name: 'Yeni Məkan', icon: Plus },
                ]
            },
            {
                title: 'Feedback',
                items: [
                    { path: '/attractions/reviews', name: 'Ziyarətçi Rəyləri', icon: MessageSquare },
                ]
            }
        ],
        default: []
    };

    const sections = moduleRoutes[activeModule] || [];
    const moduleName = activeModule.charAt(0).toUpperCase() + activeModule.slice(1);

    return (
        <aside className="dk-vendor-sidebar">
            <div className="dk-sidebar-brand">
                <img src={logoImg} alt="Discover Karabakh" className="dk-sidebar-logo" />
                <div className="dk-vendor-badge">
                    <ShieldCheck size={14} /> {moduleName} Partner
                </div>
            </div>

            <nav className="dk-sidebar-nav">
                <ul className="dk-sidebar-sections-list">
                    {sections.map((section, sIdx) => (
                        <li key={sIdx} className="dk-sidebar-section">
                            <div className="dk-sidebar-section-label">{section.title}</div>
                            <ul className="dk-sidebar-items-list">
                                {section.items.map((route) => {
                                    const Icon = route.icon;
                                    return (
                                        <li key={route.path}>
                                            <NavLink
                                                to={route.path}
                                                className={({ isActive }) => 
                                                    isActive || (route.path !== '/attractions' && location.pathname.includes(route.path))
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
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}