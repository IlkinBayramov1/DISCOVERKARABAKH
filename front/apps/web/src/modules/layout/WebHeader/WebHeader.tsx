import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { User, LogOut, Briefcase, Heart, Wallet } from 'lucide-react';
import { WebHeaderWeather } from './WebHeaderWeather';
import './WebHeader.css';

export default function WebHeader() {
    const { isAuthenticated, user, logout } = useAuth();

    // Mock balance until backend field is added
    const userBalance = (user as any)?.balance ?? 0.00;

    return (
        <header className="web-header">

            <div className="web-header__left">
                <WebHeaderWeather />
            </div>

            <div className="web-header__actions">
                {isAuthenticated ? (
                    <div className="user-profile-menu">
                        {/* Wallet / Balance */}
                        <div className="header-balance-card" title="Your Balance">
                            <Wallet size={16} className="balance-icon" />
                            <span className="balance-amount">{userBalance.toFixed(2)} ₼</span>
                            <button className="deposit-btn">+</button>
                        </div>

                        {/* Favorites */}
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
                        <Link to="/auth/login" className="header-btn-outline">
                            Login
                        </Link>
                        <Link to="/auth/register" className="header-btn-primary">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}