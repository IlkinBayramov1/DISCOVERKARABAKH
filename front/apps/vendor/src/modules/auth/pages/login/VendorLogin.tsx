import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth.api';
import { setToken } from '@/shared/utils/token';
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
            if (response.data?.token) {
                setToken(response.data.token);
                navigate('/vendor/dashboard');
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
