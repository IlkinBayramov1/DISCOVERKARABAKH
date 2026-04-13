import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { setToken, setVendorCategory } from '@/shared/utils/token';
import './VendorLogin.css';

export default function VendorLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                throw new Error('Giriş qadağandır. Bu portal yalnız Vendorlar üçündür.');
            }

            if (response.data?.token) {
                setToken(response.data.token);

                // Redirect dynamically
                const user = response.data.user;
                const category = user.vendorProfile?.category;

                if (category) {
                    setVendorCategory(category);
                }

                if (category === 'transport') {
                    navigate('/transport/dashboard');
                } else if (category === 'tour') {
                    navigate('/tours');
                } else if (category === 'attraction') {
                    navigate('/attractions');
                } else if (category === 'restaurant') {
                    navigate('/restaurant/dashboard');
                } else if (category === 'event') {
                    navigate('/events');
                } else {
                    navigate('/hotel/dashboard');
                }
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Invalid credentials');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-split-container">
            <div className="auth-image-panel">
                <div className="auth-image-overlay">
                    <h1>Discover Karabakh</h1>
                    <p>Vendor Portal</p>
                    <span>Manage your hotels, tours, and services effortlessly.</span>
                </div>
            </div>
            <div className="auth-form-panel">
                <div className="auth-form-wrapper glassmorphism">
                    <h2>Welcome Back</h2>
                    <p className="auth-subtext">Sign in to your vendor account</p>

                    {error && <div className="auth-alert error">{error}</div>}

                    <form onSubmit={handleLogin} className="split-form">
                        <div className="input-group">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label>Email Address</label>
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <label>Password</label>
                        </div>

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            {loading ? <span className="spinner"></span> : 'Login'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <a href="/vendor/register">Register as Vendor</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
