import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi, type ILoginCredentials } from '../api/auth.api';
import { setToken } from '../../../shared/utils/token';
import { LogIn } from 'lucide-react';
import './Auth.css';

export default function WebLogin() {
    const [formData, setFormData] = useState<ILoginCredentials>({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await authApi.login(formData);
            if (res.success && res.data?.token) {
                setToken(res.data.token);
                // Trigger a hard reload to ensure layout state (like navbar user profile) updates
                window.location.href = '/';
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
        <div className="auth-container flex-align-center justify-center min-h-screen pb-20">
            <div className="auth-card glassmorphism p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="auth-icon-wrapper mx-auto mb-4 bg-primary-light text-primary">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                    <p className="text-muted">Sign in to manage your trips and reviews</p>
                </div>

                {error && <div className="auth-error-alert mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-6 pt-4 border-t">
                    <p className="text-sm text-muted">
                        Don't have an account? <Link to="/auth/register" className="text-primary font-bold">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
