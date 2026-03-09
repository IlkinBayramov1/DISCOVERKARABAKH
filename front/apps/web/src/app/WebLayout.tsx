import { useState, useRef, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, User, LogOut } from 'lucide-react';
import { getToken, removeToken } from '../shared/utils/token';

export default function WebLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const token = getToken();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };

        if (userMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userMenuOpen]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        removeToken();
        window.location.href = '/';
    };

    return (
        <div className="web-layout">
            {/* Top Navigation Bar */}
            <header className="web-navbar flex-between glassmorphism">
                <div className="nav-left flex-align-center gap-4">
                    <button className="icon-btn sidebar-trigger" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <Link to="/" className="brand-logo">
                        <span>Discover</span>Karabakh
                    </Link>
                </div>

                <div className="nav-right flex-align-center gap-4">
                    {token ? (
                        <div className="user-menu dropdown-container" ref={userMenuRef}>
                            <button className="icon-btn user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                                <User size={20} />
                            </button>
                            <div className={`dropdown-menu ${userMenuOpen ? 'show' : ''}`}>
                                <Link to="/account/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>My Profile</Link>
                                <Link to="/account/trips" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>My Trips</Link>
                                <button onClick={handleLogout} className="dropdown-item text-danger">
                                    <LogOut size={16} className="mr-2" /> Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/auth/login" className="btn-secondary outline">Log in</Link>
                            <Link to="/auth/register" className="btn-primary ml-3">Sign up</Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area with Sidebar */}
            <div className="web-body">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <main className={`web-main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
                    <Outlet />
                </main>
            </div>

            {/* Global Web Footer */}
            <footer className="web-footer mt-auto">
                <div className="footer-content max-w-7xl mx-auto px-4 py-8 flex-between">
                    <div>
                        <h3 className="font-bold text-xl mb-2">Discover Karabakh</h3>
                        <p className="text-muted">Your ultimate gateway to exploring the beauty, heritage, and future of Karabakh.</p>
                    </div>
                    <div className="footer-links flex gap-8">
                        <div>
                            <h4 className="font-bold mb-3">Explore</h4>
                            <ul>
                                <li><Link to="/hotels">Hotels</Link></li>
                                <li><Link to="/tours">Tours</Link></li>
                                <li><Link to="/events">Events</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-3">Support</h4>
                            <ul>
                                <li><Link to="/help">Help Center</Link></li>
                                <li><Link to="/contact">Contact Us</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom text-center py-4 border-t border-gray-200">
                    <p className="text-muted text-sm">&copy; {new Date().getFullYear()} Discover Karabakh. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
