import React, { useState, useRef } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { profileApi } from '../../api/profile.api';
import { User, Phone, MapPin, Globe, Calendar, Shield, Save, Loader2, Camera, Trash2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const { profile, loading, error, updating, updateProfile } = useProfile();
    const [formData, setFormData] = useState<any>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize form data when profile is loaded
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
                setSuccessMsg('Avatar uploaded! Click "Save Changes" to persist.');
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
        if (!window.confirm('Are you sure you want to remove your profile photo?')) return;
        setFormData((prev: any) => ({ ...prev, avatarUrl: '' }));
        setSuccessMsg('Photo removed! Click "Save Changes" to persist.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await updateProfile(formData);
        if (res.success) {
            setSuccessMsg('Profile updated successfully!');
            setTimeout(() => setSuccessMsg(null), 3000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                <p className="text-gray-500 font-medium">Loading your profile...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen py-20 text-center">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl inline-block max-w-md">
                    <h2 className="text-xl font-bold mb-2">Error Loading Profile</h2>
                    <p>{error || 'Access denied or session expired.'}</p>
                </div>
            </div>
        );
    }

    const isTourist = profile.role === 'tourist';
    const isResident = profile.role === 'resident';

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-500">Manage your profile information and preferences.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Hero Profile Card */}
                    <div className="bg-white rounded-3xl shadow-sm overflow-hidden p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-blue-100 overflow-hidden border-4 border-white shadow-md flex items-center justify-center relative">
                                    {uploadingAvatar && (
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                                            <Loader2 className="animate-spin text-white" size={32} />
                                        </div>
                                    )}
                                    {formData?.avatarUrl ? (
                                        <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-bold text-blue-600 uppercase">
                                            {profile.firstName?.charAt(0) || profile.email.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    style={{ display: 'none' }} 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    multiple={false}
                                />
                                {!formData?.avatarUrl && (
                                    <button 
                                        type="button" 
                                        onClick={triggerFileSelect}
                                        className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 transition z-20"
                                        title="Upload photo"
                                    >
                                        <Camera size={18} />
                                    </button>
                                )}
                                
                                {formData?.avatarUrl && (
                                    <button 
                                        type="button" 
                                        onClick={handleDeleteAvatar}
                                        className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-red-500 hover:bg-red-50 transition z-20"
                                        title="Remove photo"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="text-gray-500 mb-4">{profile.email}</p>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                                    isTourist ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {profile.role}
                                </span>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={updating}
                                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                                {updating ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {updating ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                        {successMsg && (
                            <div className="mt-6 bg-green-50 text-green-700 p-4 rounded-xl text-center font-medium animate-pulse">
                                {successMsg}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Personal Details */}
                        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <User size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">First Name</label>
                                    <input 
                                        type="text" name="firstName" value={formData?.firstName || ''} onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Last Name</label>
                                    <input 
                                        type="text" name="lastName" value={formData?.lastName || ''} onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Gender</label>
                                    <select 
                                        name="gender" value={formData?.gender || ''} onChange={handleChange}
                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Birth Date</label>
                                    <div className="relative">
                                        <input 
                                            type="date" name="birthDate" value={formData?.birthDate || ''} onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition"
                                        />
                                        <Calendar className="absolute right-4 top-3 text-gray-400" size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact & Locale */}
                        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <Phone size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Contact & Language</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Phone Number</label>
                                    <div className="relative">
                                        <input 
                                            type="tel" name="phone" value={formData?.phone || ''} onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition pl-12"
                                            placeholder="+994 -- --- -- --"
                                        />
                                        <Phone className="absolute left-4 top-3 text-gray-400" size={18} />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Preferred Language</label>
                                    <div className="relative">
                                        <select 
                                            name="language" value={formData?.language || 'AZ'} onChange={handleChange}
                                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition pl-12"
                                        >
                                            <option value="AZ">Azerbaijani (Azərbaycan)</option>
                                            <option value="EN">English</option>
                                            <option value="RU">Russian (Русский)</option>
                                        </select>
                                        <Globe className="absolute left-4 top-3 text-gray-400" size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Role Specific Info */}
                        {(isTourist || isResident) && (
                            <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 lg:col-span-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                        <Shield size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {isTourist ? 'Tourist Information' : 'Resident Information'}
                                    </h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {isTourist ? (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nationality</label>
                                                <input 
                                                    type="text" name="nationality" value={formData?.nationality || ''} onChange={handleChange}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Passport Number</label>
                                                <input 
                                                    type="text" name="passportNumber" value={formData?.passportNumber || ''} onChange={handleChange}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition"
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Permit Number</label>
                                                <input 
                                                    type="text" name="permitNumber" value={formData?.permitNumber || ''} onChange={handleChange}
                                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Local Address</label>
                                                <div className="relative">
                                                    <input 
                                                        type="text" name="localAddress" value={formData?.localAddress || ''} onChange={handleChange}
                                                        className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-100 transition pl-12"
                                                    />
                                                    <MapPin className="absolute left-4 top-3 text-gray-400" size={18} />
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
