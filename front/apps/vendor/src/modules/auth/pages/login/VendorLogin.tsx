import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Building2, ChevronRight, AlertCircle } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { setToken, setVendorCategory } from '@/shared/utils/token';
import { useNavigate, Link } from 'react-router-dom';

// Loqonu import edirik (Fayl strukturunuza əsasən)
import dkLogo from '../../../../assets/dk-logo3.png';
import './VendorLogin.css';

export default function VendorLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authApi.login({ email, password });

            const role = response.data?.user?.role;
            if (role !== 'vendor' && role !== 'admin') {
                throw new Error('Access denied. This portal is strictly for Vendors.');
            }

            if (response.data?.token) {
                setToken(response.data.token);

                // Redirect dynamically
                const user = response.data.user;
                const category = user.vendorprofile?.category;

                if (category) {
                    setVendorCategory(category);
                }

                if (category === 'transport') navigate('/transport/dashboard');
                else if (category === 'tour') navigate('/tours');
                else if (category === 'attraction') navigate('/attractions');
                else if (category === 'restaurant') navigate('/restaurant/dashboard');
                else if (category === 'event') navigate('/events');
                else navigate('/hotel/dashboard');
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid credentials or network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="vendor-auth-layout">

            {/* LEFT PANEL: HERO IMAGE */}
            <div className="auth-hero-panel">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-logo">
                        <Building2 size={32} color="#ffffff" />
                        <span>Vendor Admin Portal</span>
                    </div>
                    <div className="hero-text-wrapper">
                        <h1>Partner with<br />Discover Karabakh</h1>
                        <p>Join the premier digital tourism ecosystem. Manage your bookings, grow your audience, and showcase your services to the world.</p>
                    </div>
                    <div className="hero-footer">
                        <span>©️ {new Date().getFullYear()} Discover Karabakh. All rights reserved.</span>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: FORM */}
            <div className="auth-form-panel">
                <div className="form-container">

                    {/* YENİLƏNMİŞ BRAND LOGO */}
                    <div className="brand-header">
                        <div className="brand-logo">
                            <img src={dkLogo} alt="Discover Karabakh Logo" className="dk-main-logo" />
                        </div>
                        <span className="portal-badge">Business Portal</span>
                    </div>

                    <div className="form-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to your vendor dashboard to continue.</p>
                    </div>

                    {error && (
                        <div className="auth-alert error pulse-anim">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="premium-auth-form">

                        <div className="input-group">
                            <div className="input-icon">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                id="email"
                                required
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="email">Email Address</label>
                        </div>

                        <div className="input-group">
                            <div className="input-icon">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                required
                                placeholder=" "
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="password">Password</label>
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="form-actions-row">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span className="checkmark"></span>
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
                        </div>

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            {loading ? (
                                <span className="spinner"></span>
                            ) : (
                                <>
                                    Sign In <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>Don't have a vendor account yet? <Link to="/register">Apply Now</Link></p>
                    </div>
                </div>
            </div>

        </div>
    );
}