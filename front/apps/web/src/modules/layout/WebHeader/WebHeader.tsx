// Removed unused React import
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { User, LogOut, Briefcase } from 'lucide-react';
import { WebHeaderWeather } from './WebHeaderWeather';
import './WebHeader.css';

export default function WebHeader() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="web-header">
            <WebHeaderWeather />
            <div className="web-header__actions">
                {isAuthenticated ? (
                    <div className="user-profile-menu">
                        <Link to="/account/profile" className="header-link">
                            <User size={18} />
                            <span>{user?.name || 'Profile'}</span>
                        </Link>
                        <Link to="/account/trips" className="header-link">
                            <Briefcase size={18} />
                            <span>My Trips</span>
                        </Link>
                        <button className="logout-btn" onClick={logout}>
                            <LogOut size={18} />
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
