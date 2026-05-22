import React, { useState } from 'react';
import { User, Building2, Briefcase, Mail, Lock, Eye, EyeOff, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import type { VendorCategory } from '@/shared/types/auth.types';
import { Link } from 'react-router-dom';
// Loqonu import edirik (Fayl strukturunuza əsasən)
import dkLogo from '../../../../assets/dk-logo3.png';
import './VendorRegister.css'; 

export default function VendorRegister() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        companyName: '',
        category: 'hotel' as VendorCategory
    });
    
    const [showPassword, setShowPassword] = useState(false);
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
                setError('Registration failed. Please try again.');
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

    return (
        <div className="vendor-auth-layout">
            
            {/* LEFT PANEL: HERO IMAGE */}
            <div className="auth-hero-panel register-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <div className="hero-logo">
                        <Building2 size={32} color="#ffffff" />
                        <span>Vendor Admin Portal</span>
                    </div>
                    <div className="hero-text-wrapper">
                        <h1>Partner With Us<br/>Grow Your Business</h1>
                        <p>Join the exclusive network of Karabakh travel vendors. Showcase your unique services to a global audience of travelers.</p>
                    </div>
                    <div className="hero-footer">
                        <span>© {new Date().getFullYear()} Discover Karabakh. All rights reserved.</span>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL: FORM OR SUCCESS VIEW */}
            <div className="auth-form-panel">
                <div className="form-container">
                    
                    {/* BRAND HEADER */}
                    <div className="brand-header">
                        <div className="brand-logo">
                            <img src={dkLogo} alt="Discover Karabakh Logo" className="dk-main-logo" />
                        </div>
                        <span className="portal-badge">Business Portal</span>
                    </div>

                    {success ? (
                        /* SUCCESS VIEW */
                        <div className="success-view-container fade-in-up">
                            <div className="success-icon-wrapper">
                                <CheckCircle2 size={64} className="success-check" />
                            </div>
                            <h2>Application Received!</h2>
                            <p className="success-subtext">Thank you for registering as a vendor with Discover Karabakh.</p>
                            
                            <div className="success-info-box">
                                <p>Your application for <strong>{formData.companyName}</strong> is currently pending admin approval. We will review your details and notify you via email (<strong>{formData.email}</strong>) shortly.</p>
                            </div>

                            <Link to="/login" className="auth-submit-btn text-center">
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        /* REGISTRATION FORM */
                        <div className="fade-in">
                            <div className="form-header">
                                <h2>Apply as Vendor</h2>
                                <p>Create your business profile to get started.</p>
                            </div>

                            {error && (
                                <div className="auth-alert error pulse-anim">
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="premium-auth-form">
                                
                                <div className="form-row">
                                    <div className="input-group">
                                        <div className="input-icon"><User size={20} /></div>
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            required
                                            placeholder=" "
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="firstName">First Name</label>
                                    </div>
                                    <div className="input-group">
                                        <div className="input-icon"><User size={20} /></div>
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            required
                                            placeholder=" "
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="lastName">Last Name</label>
                                    </div>
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><Building2 size={20} /></div>
                                    <input
                                        type="text"
                                        name="companyName"
                                        id="companyName"
                                        required
                                        placeholder=" "
                                        value={formData.companyName}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="companyName">Company / Business Name</label>
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><Briefcase size={20} /></div>
                                    <select
                                        name="category"
                                        id="category"
                                        required
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="has-value"
                                    >
                                        <option value="hotel">Hotel / Stays</option>
                                        <option value="tour">Tours & Guide</option>
                                        <option value="transport">Transportation</option>
                                        <option value="restaurant">Restaurant & Food</option>
                                        <option value="attraction">Attractions & Fun</option>
                                        <option value="event">Events & Festivals</option>
                                        <option value="gas">Utility - Gas (Azəriqaz)</option>
                                        <option value="electricity">Utility - Electricity (Azərişıq)</option>
                                        <option value="water">Utility - Water (Azərsu)</option>
                                    </select>
                                    <label htmlFor="category" className="select-label">Business Category</label>
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><Mail size={20} /></div>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        placeholder=" "
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="email">Administrator Email</label>
                                </div>

                                <div className="input-group">
                                    <div className="input-icon"><Lock size={20} /></div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        id="password"
                                        required
                                        placeholder=" "
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="password">Secure Password</label>
                                    <button 
                                        type="button" 
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <button type="submit" disabled={loading} className="auth-submit-btn mt-2">
                                    {loading ? (
                                        <span className="spinner"></span>
                                    ) : (
                                        <>
                                            Submit Application <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="auth-footer">
                                <p>Already a partner? <Link to="/login">Sign In</Link></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
    );
}