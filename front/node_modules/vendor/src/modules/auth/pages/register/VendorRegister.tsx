import { useState } from 'react';
import { authApi } from '../../api/auth.api';
import type { VendorCategory } from '@/shared/types/auth.types';
import './VendorRegister.css'; // Will reuse heavily from Login

export default function VendorRegister() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        companyName: '',
        category: 'hotel' as VendorCategory
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authApi.registerVendor({
                ...formData,
                role: 'vendor'
            });
            setSuccess(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (success) {
        return (
            <div className="auth-split-container">
                <div className="auth-image-panel"></div>
                <div className="auth-form-panel">
                    <div className="auth-form-wrapper glassmorphism success-view">
                        <h2>Application Received</h2>
                        <p className="auth-subtext">Thank you for registering as a vendor!</p>
                        <div className="success-icon">✓</div>
                        <p className="success-message">
                            Your application is currently pending admin approval. We will notify you via email once reviewed.
                        </p>
                        <a href="/vendor/login" className="back-to-login">Back to Login</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-split-container">
            <div className="auth-image-panel register-bg">
                <div className="auth-image-overlay">
                    <h1>Partner With Us</h1>
                    <p>Grow your business</p>
                    <span>Join the exclusive network of Karabakh travel vendors.</span>
                </div>
            </div>
            <div className="auth-form-panel">
                <div className="auth-form-wrapper glassmorphism">
                    <h2>Register Vendor</h2>
                    <p className="auth-subtext">Create your business profile today</p>

                    {error && <div className="auth-alert error">{error}</div>}

                    <form onSubmit={handleSubmit} className="split-form">
                        <div className="input-group">
                            <input
                                type="text"
                                name="companyName"
                                required
                                value={formData.companyName}
                                onChange={handleChange}
                            />
                            <label>Company/Business Name</label>
                        </div>

                        <div className="input-group">
                            <select
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="hotel">Hotel / Stays</option>
                                <option value="tour">Tours & Guide</option>
                                <option value="transport">Transportation</option>
                                <option value="restaurant">Restaurant & Food</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                            />
                            <label>Administrator Email</label>
                        </div>

                        <div className="input-group">
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <label>Secure Password</label>
                        </div>

                        <button type="submit" disabled={loading} className="auth-submit-btn">
                            {loading ? <span className="spinner"></span> : 'Submit Application'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already a partner? <a href="/vendor/login">Sign In</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
