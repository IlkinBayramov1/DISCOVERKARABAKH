import React, { useState, useRef } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { profileApi } from '../../api/profile.api';
import { 
    User, Phone, MapPin, Globe, Calendar, Shield, 
    Save, Loader2, Camera, Trash2, CheckCircle2, 
    Mail, RefreshCw
} from 'lucide-react';
import './ProfilePage.css'; 

export const ProfilePage: React.FC = () => {
    const { profile, loading, error, updating, updateProfile } = useProfile();
    const [formData, setFormData] = useState<any>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (profile && !formData) {
            setFormData({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phone: profile.phone || '',
                gender: profile.gender || '',
                birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split('T')[0] : '',
                language: profile.language || 'AZ',
                avatarUrl: profile.avatarUrl || '',
                // Tourist specific
                nationality: profile.touristProfile?.nationality || '',
                passportNumber: profile.touristProfile?.passportNumber || '',
                // Resident specific
                permitNumber: profile.residentProfile?.permitNumber || '',
                localAddress: profile.residentProfile?.localAddress || '',
            });
        }
    }, [profile, formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
        setSuccessMsg(null);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        setSuccessMsg(null);
        try {
            const res = await profileApi.uploadAvatar(file);
            if (res.success) {
                setFormData((prev: any) => ({ ...prev, avatarUrl: res.url }));
                setSuccessMsg('Avatar uploaded! Click "Update Profile" to persist.');
            }
        } catch (err) {
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleDeleteAvatar = () => {
        if (!window.confirm('Remove profile photo?')) return;
        setFormData((prev: any) => ({ ...prev, avatarUrl: '' }));
        setSuccessMsg('Photo removed! Click "Save Changes" to persist.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await updateProfile(formData);
        if (res.success) {
            setSuccessMsg('Profile successfully updated.');
            setTimeout(() => setSuccessMsg(null), 4000);
        }
    };

    if (loading) {
        return (
            <div className="dk-profile-loading">
                <div className="spinner"></div>
                <p>Syncing Identity Blueprint...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="dk-profile-error-layout">
                <div className="dk-alert-error">
                    <h2>Error Loading Profile</h2>
                    <p>{error || 'Access denied or session expired.'}</p>
                </div>
            </div>
        );
    }

    const isTourist = profile.role === 'tourist';
    const isResident = profile.role === 'resident';

    return (
        <div className="dk-profile-layout">
            <div className="dk-profile-container">
                
                {/* HEADER */}
                <header className="dk-profile-header">
                    <div>
                        <h1 className="dk-title">Profile Settings</h1>
                        <p className="dk-subtitle">Manage your personal details, preferences, and security parameters.</p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="dk-profile-form">
                    
                    {/* HERO CARD (Avatar & Summary) */}
                    <div className="dk-profile-hero-card premium-card">
                        <div className="hero-content">
                            
                            {/* Avatar Section */}
                            <div className="avatar-wrapper">
                                <div className="avatar-circle">
                                    {uploadingAvatar && (
                                        <div className="avatar-overlay">
                                            <div className="spinner-small"></div>
                                        </div>
                                    )}
                                    {formData?.avatarUrl ? (
                                        <img src={formData.avatarUrl} alt="Avatar" />
                                    ) : (
                                        <span className="avatar-initials">
                                            {profile.firstName?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                
                                <input 
                                    type="file" ref={fileInputRef} style={{ display: 'none' }} 
                                    accept="image/*" onChange={handleFileChange} multiple={false}
                                />
                                
                                {!formData?.avatarUrl ? (
                                    <button type="button" onClick={triggerFileSelect} className="btn-avatar-action add" title="Upload photo">
                                        <Camera size={16} />
                                    </button>
                                ) : (
                                    <button type="button" onClick={handleDeleteAvatar} className="btn-avatar-action remove" title="Remove photo">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            {/* User Info Section */}
                            <div className="user-info-section">
                                <h2>{profile.firstName} {profile.lastName}</h2>
                                <div className="user-meta-row">
                                    <span className="meta-item"> {profile.email}</span>
                                </div>
                                <span className={`role-badge ${isTourist ? 'tourist' : 'resident'}`}>
                                    {profile.role.toUpperCase()}
                                </span>
                            </div>

                            {/* Action Section */}
                            <div className="hero-action-section">
                                <button type="submit" disabled={updating} className="dk-btn-save">
                                    {updating ? <div className="spinner-small white"></div> : <Save size={18} />}
                                    {updating ? 'Saving...' : 'Update Profile'}
                                </button>
                            </div>
                        </div>

                        {successMsg && (
                            <div className="dk-alert-success mt-4">
                                <CheckCircle2 size={18} /> {successMsg}
                            </div>
                        )}
                    </div>

                    <div className="dk-profile-grid">
                        
                        {/* PERSONAL DETAILS CARD */}
                        <div className="premium-card">
                            <div className="card-header">
                                <div className="header-icon"><User size={18} /></div>
                                <h3>Personal Details</h3>
                            </div>
                            
                            <div className="dk-input-grid-2">
                                <div className="dk-input-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" className="dk-input" value={formData?.firstName || ''} onChange={handleChange} />
                                </div>
                                <div className="dk-input-group">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" className="dk-input" value={formData?.lastName || ''} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="dk-input-grid-2 mt-5">
                                <div className="dk-input-group">
                                    <label>Gender</label>
                                    <select name="gender" className="dk-input" value={formData?.gender || ''} onChange={handleChange}>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="dk-input-group">
                                    <label>Birth Date</label>
                                    <div className="dk-input-wrap">
                                        <Calendar className="input-icon" size={16} />
                                        <input type="date" name="birthDate" className="dk-input with-icon" value={formData?.birthDate || ''} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CONTACT & LOCALE CARD */}
                        <div className="premium-card">
                            <div className="card-header">
                                <div className="header-icon amber"><Globe size={18} /></div>
                                <h3>Contact & Language</h3>
                            </div>
                            
                            <div className="dk-input-group mt-2">
                                <label>Phone Number</label>
                                <div className="dk-input-wrap">
                                    <Phone className="input-icon" size={16} />
                                    <input type="tel" name="phone" className="dk-input with-icon" placeholder="+994 -- --- -- --" value={formData?.phone || ''} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="dk-input-group mt-5">
                                <label>Preferred Language</label>
                                <div className="dk-input-wrap">
                                    <Globe className="input-icon" size={16} />
                                    <select name="language" className="dk-input with-icon" value={formData?.language || 'AZ'} onChange={handleChange}>
                                        <option value="AZ">Azerbaijani (Azərbaycan)</option>
                                        <option value="EN">English</option>
                                        <option value="RU">Russian (Русский)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ROLE SPECIFIC CARD */}
                        {(isTourist || isResident) && (
                            <div className="premium-card full-width">
                                <div className="card-header">
                                    <div className="header-icon emerald"><Shield size={18} /></div>
                                    <h3>{isTourist ? 'Travel Documentation' : 'Resident Documentation'}</h3>
                                </div>
                                
                                <div className="dk-input-grid-2 mt-2">
                                    {isTourist ? (
                                        <>
                                            <div className="dk-input-group">
                                                <label>Nationality</label>
                                                <input type="text" name="nationality" className="dk-input" value={formData?.nationality || ''} onChange={handleChange} />
                                            </div>
                                            <div className="dk-input-group">
                                                <label>Passport Number</label>
                                                <input type="text" name="passportNumber" className="dk-input" value={formData?.passportNumber || ''} onChange={handleChange} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="dk-input-group">
                                                <label>Permit Number</label>
                                                <input type="text" name="permitNumber" className="dk-input" value={formData?.permitNumber || ''} onChange={handleChange} />
                                            </div>
                                            <div className="dk-input-group">
                                                <label>Local Address</label>
                                                <div className="dk-input-wrap">
                                                    <MapPin className="input-icon" size={16} />
                                                    <input type="text" name="localAddress" className="dk-input with-icon" value={formData?.localAddress || ''} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        
                    </div>
                </form>
            </div>
        </div>
    );
};