import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi, type IUserRegisterPayload } from '../api/auth.api';
import { useAuth } from '../../../shared/context/AuthContext';
import { UserPlus } from 'lucide-react';
import './Auth.css';

export default function WebRegister() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<IUserRegisterPayload>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'tourist'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await authApi.registerUser(formData);
            if (res.success && res.data?.token && res.data?.user) {
                login(res.data.token, res.data.user);
                navigate('/hotels', { replace: true });
            } else {
                setError(res.message || 'Registration failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
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
                            <UserPlus size={28} />
                        </div>
                        <h2 className="auth-title">Create Account</h2>
                        <p className="auth-subtitle">Join the ecosystem and plan your journey.</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="auth-group">
                            <label className="auth-label">I am a...</label>
                            <div className="auth-role-pills">
                                <button
                                    type="button"
                                    className={`auth-role-pill ${formData.role === 'tourist' ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, role: 'tourist' })}
                                >
                                    Tourist / Visitor
                                </button>
                                <button
                                    type="button"
                                    className={`auth-role-pill ${formData.role === 'resident' ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, role: 'resident' })}
                                >
                                    Local Resident
                                </button>
                            </div>
                        </div>

                        <div className="auth-row">
                            <div className="auth-group">
                                <label className="auth-label">First Name</label>
                                <input
                                    type="text"
                                    required
                                    className="auth-input"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="John"
                                />
                            </div>
                            <div className="auth-group">
                                <label className="auth-label">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    className="auth-input"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

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
                            <label className="auth-label">Create Password</label>
                            <input
                                type="password"
                                required
                                className="auth-input"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="At least 6 characters"
                                minLength={6}
                            />
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? <span className="auth-spinner"></span> : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Already have an account? <Link to="/auth/login" className="auth-link">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}