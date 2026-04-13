import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, User, PackageSearch, LogOut } from 'lucide-react';
import { removeToken, getUserRole } from '../../../shared/utils/token';
import './DriverLayout.css';

export default function DriverLayout() {
    const location = useLocation();
    const role = getUserRole();

    const handleLogout = () => {
        removeToken();
        window.location.href = '/';
    };

    const navItems = [
        { path: '/driver/dashboard', icon: <Home size={20} />, label: 'Panel (Dashboard)' },
        { path: '/driver/orders', icon: <PackageSearch size={20} />, label: 'Sifarişlər (Orders)' },
        { path: '/driver/profile', icon: <User size={20} />, label: 'Hesabım (Profile)' },
    ];

    return (
        <div className="driver-layout">
            {/* Sidebar */}
            <aside className="driver-sidebar">
                <div className="driver-sidebar-logo">
                    <Link to="/" className="text-xl font-bold text-primary">
                        Sürücü Portalı
                    </Link>
                </div>
                
                <nav className="driver-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`driver-nav-link ${
                                location.pathname.startsWith(item.path) ? 'active' : ''
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        Çıxış
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="driver-main">
                <div className="driver-content-container">
                    {role !== 'driver' ? (
                        <div className="glassmorphism p-10 text-center mt-10">
                            <h2 className="text-xl font-bold mb-4">Sessiya Yenilənməlidir</h2>
                            <p className="mb-6">Sizin profiliniz təsdiqlənib, lakin giriş məlumatlarınız hələ də köhnə rolunuzu göstərir. Sürücü Portalına tam giriş üçün zəhmət olmasa sistemdən çıxış edib yenidən daxil olun.</p>
                            <button onClick={handleLogout} className="btn-primary">Çıxış Et və Yenidən Daxil Ol</button>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </div>
            </main>
        </div>
    );
}
