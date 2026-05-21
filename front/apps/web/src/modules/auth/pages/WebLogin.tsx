import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi, type ILoginCredentials } from '../api/auth.api';
import { useAuth } from '../../../shared/context/AuthContext';
import { LogIn } from 'lucide-react';
import './Auth.css';

export default function WebLogin() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = (location.state as any)?.from?.pathname;
    const dest = from && from !== '/' ? from : '/hotels';

    const [formData, setFormData] = useState<ILoginCredentials>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await authApi.login(formData);
            if (res.success && res.data?.token && res.data?.user) {
                login(res.data.token, res.data.user);
                navigate(dest, { replace: true });
            } else {
                setError(res.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            {/* Signature Purple Bloom Background */}
            <div className="auth-bloom" aria-hidden="true"></div>

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-icon">
                            <LogIn size={28} />
                        </div>
                        <h2 className="auth-title">Welcome Back</h2>
                        <p className="auth-subtitle">Sign in to manage your trips and reservations.</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-group">
                            <label className="auth-label">Email Address</label>
                            <input
                                type="email"
                                required
                                className="auth-input"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@example.com"
                            />
                        </div>
                        
                        <div className="auth-group">
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                required
                                className="auth-input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? <span className="auth-spinner"></span> : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Don't have an account? <Link to="/auth/register" className="auth-link">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}