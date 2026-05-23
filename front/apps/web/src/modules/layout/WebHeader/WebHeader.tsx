import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { User, LogOut, Briefcase, Heart, Wallet, Menu } from 'lucide-react';
import { WebHeaderWeather } from './WebHeaderWeather';
import logoImg from '../../../assets/dk-logo3.png';
import './WebHeader.css';

interface WebHeaderProps {
    onMenuClick: () => void;
}

export default function WebHeader({ onMenuClick }: WebHeaderProps) {
    const { isAuthenticated, user, logout } = useAuth();
    const userBalance = (user as any)?.balance ?? 0.00;
    const navigate = useNavigate();

    return (
        <header className="web-header">
            
            <div className="web-header__left">
                {/* NEW: 240px wide box for the logo to match the sidebar */}
                <div className="header-logo-container">
                    <button className="mobile-menu-btn" onClick={onMenuClick}>
                        <Menu size={24} /> 
                    </button>
                    
                    <div className="header-logo-link">
                        <img src={logoImg} alt="Discover Karabakh Logo" className="header-logo" />
                    </div>
                </div>

                {/* Weather widget sits outside the box, pushed into the main content area */}
                <div className="header-weather-wrapper">
                    <WebHeaderWeather />
                </div>
            </div>

            <div className="web-header__actions">
                {isAuthenticated ? (
                    <div className="user-profile-menu">
                        <div className="header-balance-card" title="Your Balance" onClick={() => navigate('/account/wallet')}>
                            <Wallet size={16} className="balance-icon" />
                            <span className="balance-amount">{userBalance.toFixed(2)} ₼</span>
                            <button className="deposit-btn" onClick={(e) => { e.stopPropagation(); navigate('/account/wallet'); }}>+</button>
                        </div>

                        <Link to="/account/favorites" className="header-link fav-link" title="Favorites">
                            <Heart size={18} />
                            <span>Favorites</span>
                        </Link>

                        <Link to="/account/profile" className="header-link">
                            <User size={18} />
                            <span>{user?.name || 'Profile'}</span>
                        </Link>

                        <Link to="/account/trips" className="header-link">
                            <Briefcase size={18} />
                            <span>My Trips</span>
                        </Link>

                        <button className="header-logout-btn" onClick={logout}>
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <>
                        <Link to="/auth/login" className="header-btn-outline">Login</Link>
                        <Link to="/auth/register" className="header-btn-primary">Register</Link>
                    </>
                )}
            </div>
        </header>
    );
}