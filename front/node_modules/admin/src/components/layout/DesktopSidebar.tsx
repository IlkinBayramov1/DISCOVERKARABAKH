import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Users, UserCheck, Hotel, Landmark, 
    CreditCard, MessageSquareWarning, Briefcase, 
    Truck, Layers, BellRing, LogOut, ChevronDown, Utensils, Compass
} from 'lucide-react';

interface NavItem {
    name: string;
    path: string;
    icon: any;
    subItems?: { name: string; path: string; icon: any }[];
}

const DesktopSidebar: React.FC = () => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState<string[]>(['Satıcılar']); // Satıcılar ilkin olaraq açıq qalsın

    const navItems: NavItem[] = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'İstifadəçilər', path: '/users', icon: Users },
        { 
            name: 'Satıcılar (Vendors)', 
            path: '/vendors', 
            icon: UserCheck,
            subItems: [
                { name: 'Bütün Satıcılar', path: '/vendors', icon: UserCheck },
                { name: 'Hotellər', path: '/vendors/hotels', icon: Hotel },
                { name: 'Restoranlar', path: '/vendors/restaurants', icon: Utensils },
                { name: 'Turlar', path: '/vendors/tours', icon: Compass },
            ]
        },
        { name: 'Bizneslər', path: '/businesses', icon: Briefcase },
        { name: 'Rezervasiyalar', path: '/bookings', icon: Layers },
        { name: 'Ödənişlər', path: '/payments', icon: CreditCard },
        { name: 'Nəqliyyat', path: '/transport', icon: Truck },
        { name: 'Moderasiya', path: '/interactions', icon: MessageSquareWarning },
        { name: 'Bildirişlər', path: '/notifications', icon: BellRing },
    ];

    const toggleMenu = (name: string) => {
        setOpenMenus(prev => 
            prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
        );
    };

    return (
        <aside className="w-[280px] h-screen bg-[#FDFDFD] border-r border-gray-200/60 flex flex-col fixed left-0 top-0 z-30 shadow-sm">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-100 shadow-lg">
                        <Landmark className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-800 block leading-tight">KARABAKH</span>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Admin Portal</span>
                    </div>
                </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isSubOpen = openMenus.includes(item.name);
                    const hasSub = item.subItems && item.subItems.length > 0;
                    const isActiveBase = location.pathname.startsWith(item.path);

                    return (
                        <div key={item.name} className="space-y-1">
                            {hasSub ? (
                                <button
                                    onClick={() => toggleMenu(item.name)}
                                    className={`w-full flex items-center justify-between gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 ${
                                        isActiveBase && !isSubOpen
                                        ? 'bg-indigo-50/50 text-indigo-600' 
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5">
                                        <item.icon className="w-[18px] h-[18px]" />
                                        {item.name}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isSubOpen ? 'rotate-180' : ''}`} />
                                </button>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-300 ${
                                            isActive 
                                            ? 'bg-indigo-50/50 text-indigo-600 shadow-sm' 
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                        }`
                                    }
                                >
                                    <item.icon className="w-[18px] h-[18px]" />
                                    {item.name}
                                </NavLink>
                            )}

                            {/* Sub Items */}
                            {hasSub && isSubOpen && (
                                <div className="space-y-1 ml-4 border-l border-gray-100 pl-2 animate-in slide-in-from-top-2 duration-300">
                                    {item.subItems?.map((sub) => (
                                        <NavLink
                                            key={sub.path}
                                            to={sub.path}
                                            end={sub.path === item.path}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                                                    isActive 
                                                    ? 'text-indigo-600 bg-indigo-50/30' 
                                                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50/50'
                                                }`
                                            }
                                        >
                                            <sub.icon className="w-[14px] h-[14px]" />
                                            {sub.name}
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-100 bg-[#FAFAFA]/50 mt-auto">
                <div className="flex items-center justify-between gap-3 px-3 py-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xs border border-indigo-200">
                            AD
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-bold text-slate-800 truncate">Super Admin</span>
                            <span className="text-[11px] font-medium text-slate-400">Yaradıcı</span>
                        </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default DesktopSidebar;
