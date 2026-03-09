import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi, type IUserRegisterPayload } from '../api/auth.api';
import { setToken } from '../../../shared/utils/token';
import { UserPlus } from 'lucide-react';
import './Auth.css';

export default function WebRegister() {

    const [formData, setFormData] = useState<IUserRegisterPayload>({
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
            if (res.success && res.data?.token) {
                setToken(res.data.token);
                // Trigger a hard reload to ensure layout state (like navbar user profile) updates
                window.location.href = '/';
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
        <div className="auth-container flex-align-center justify-center min-h-screen pb-20 mt-10">
            <div className="auth-card glassmorphism p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="auth-icon-wrapper mx-auto mb-4 bg-primary-light text-primary">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">Create Account</h2>
                    <p className="text-muted">Start planning your journey in Karabakh</p>
                </div>

                {error && <div className="auth-error-alert mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="form-group">
                        <label>I am a...</label>
                        <select
                            className="form-input"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'tourist' | 'resident' })}
                        >
                            <option value="tourist">Tourist / Visitor</option>
                            <option value="resident">Local Resident</option>
                        </select>
                    </div>

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
                        <label>Create Password</label>
                        <input
                            type="password"
                            required
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="At least 6 characters"
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="text-center mt-6 pt-4 border-t">
                    <p className="text-sm text-muted">
                        Already have an account? <Link to="/auth/login" className="text-primary font-bold">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
