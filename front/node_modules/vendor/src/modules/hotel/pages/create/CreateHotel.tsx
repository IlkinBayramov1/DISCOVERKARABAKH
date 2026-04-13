import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHotels } from '../../hooks/useHotels';
import { useUpload } from '../../hooks/useUpload';
import { hotelApi } from '../../api/hotel.api';
import { parseCoordinate } from '../../utils/coordinates';
import type { IHotelPayload } from '../../types';
import { 
    UploadCloud, 
    X, 
    ChevronRight, 
    ChevronLeft, 
    Save, 
    Home, 
    Dna, 
    Sparkles, 
    Image as ImageIcon,
    MapPin,
    Wifi,
    Waves,
    Car,
    Flower2,
    Utensils,
    Dumbbell,
    Wine,
    Users,
    Bus,
    Clock,
    Star,
    Phone,
    Mail,
    RefreshCw,
    CheckCircle2,
    Frown,
    AlertCircle
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './CreateHotel.css';

interface AmenityDef {
    name: string;
    icon: LucideIcon;
}

const AMENITY_DEFS: AmenityDef[] = [
    { name: 'Free WiFi', icon: Wifi },
    { name: 'Swimming Pool', icon: Waves },
    { name: 'Free Parking', icon: Car },
    { name: 'Spa & Wellness', icon: Flower2 },
    { name: 'Restaurant', icon: Utensils },
    { name: 'Gym', icon: Dumbbell },
    { name: 'Bar', icon: Wine },
    { name: 'Conference Room', icon: Users },
    { name: 'Room Service', icon: Clock },
    { name: 'Airport Shuttle', icon: Bus }
];

export default function CreateHotel() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { createHotel, error: hookError } = useHotels(false);
    const { uploadImages, uploading, uploadError } = useUpload();

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<IHotelPayload>({
        name: '',
        description: '',
        address: '',
        city: 'Shusha',
        propertyType: 'hotel',
        starRating: 3,
        phone: '',
        email: '',
        checkInTime: '14:00',
        checkOutTime: '12:00',
        amenities: [],
        images: []
    });

    const [imageUrlInput, setImageUrlInput] = useState('');
    const [localFiles, setLocalFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [submitReady, setSubmitReady] = useState(true);

    useEffect(() => {
        if (id) {
            loadHotelDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadHotelDetails = async () => {
        if (!id || id === 'create') return;
        setLoading(true);
        try {
            const res = await hotelApi.getHotelById(id!);
            const hotel = (res as any).data || res;

            setFormData({
                name: hotel.name || '',
                description: hotel.description || '',
                address: hotel.address || '',
                city: hotel.city || 'Shusha',
                propertyType: hotel.propertyType || 'hotel',
                starRating: hotel.starRating || 3,
                phone: hotel.phone || '',
                email: hotel.email || '',
                checkInTime: hotel.checkInTime || '14:00',
                checkOutTime: hotel.checkOutTime || '12:00',
                latitude: hotel.latitude || undefined,
                longitude: hotel.longitude || undefined,
                amenities: hotel.amenities?.map((a: any) => a.amenity.name) || [],
                images: hotel.images?.map((img: any) => img.url) || []
            });
        } catch (err: any) {
            console.error('Load Error:', err);
            setError(err.message || 'Failed to load property details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let parsedValue: any = value;
        if (name === 'starRating') parsedValue = Number(value);
        // Coordinates will be parsed on submit to avoid input jumping
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const validateForm = () => {
        const required = ['name', 'description', 'address', 'city', 'phone', 'email'];
        for (const field of required) {
            if (!formData[field as keyof IHotelPayload] || String(formData[field as keyof IHotelPayload]).trim() === '') {
                setError(`Please complete the ${field} field.`);
                return false;
            }
        }
        return true;
    };

    const handleFacilityToggle = (facility: string) => {
        setFormData(prev => {
            const current = prev.amenities || [];
            return {
                ...prev,
                amenities: current.includes(facility) 
                    ? current.filter(f => f !== facility) 
                    : [...current, facility]
            };
        });
    };

    const handleAddImage = () => {
        if (imageUrlInput.trim()) {
            setFormData(prev => ({ ...prev, images: [...(prev.images || []), imageUrlInput.trim()] }));
            setImageUrlInput('');
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // Safety Guard: Only allow submission if we are on the final step
        if (currentStep !== 4) return;

        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        
        try {
            // Final Coordinate Synthesis
            const finalPayload: IHotelPayload = {
                ...formData,
                latitude: typeof formData.latitude === 'string' ? parseCoordinate(formData.latitude) : formData.latitude,
                longitude: typeof formData.longitude === 'string' ? parseCoordinate(formData.longitude) : formData.longitude,
            };

            let uploadedUrls: string[] = [];
            if (localFiles.length > 0) uploadedUrls = await uploadImages(localFiles);
            const finalData = { ...finalPayload, images: [...(finalPayload.images || []), ...uploadedUrls] };

            const isEdit = id && id !== 'create';
            
            if (isEdit) {
                await hotelApi.updateHotel(id, finalData);
                setSuccessMsg('Property blueprint updated successfully!');
            } else {
                await createHotel(finalData);
                setSuccessMsg('Property blueprint deployed! Redirecting to dashboard...');
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => navigate('/vendor/dashboard'), 2000);
        } catch (err: any) {
            console.error('Deployment Error:', err);
            setError(err.message || 'Deployment failed. Please check your connection and inputs.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        const next = Math.min(currentStep + 1, 4);
        if (next === 4) {
            setSubmitReady(false);
            setTimeout(() => setSubmitReady(true), 500);
        }
        setCurrentStep(next);
    };
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const renderStepNav = () => (
        <div className="wizard-nav">
            {[
                { n: 1, label: 'Identity', icon: Home },
                { n: 2, label: 'DNA', icon: Dna },
                { n: 3, label: 'Amenities', icon: Sparkles },
                { n: 4, label: 'Media', icon: ImageIcon },
            ].map(s => (
                <div 
                    key={s.n} 
                    className={`nav-step ${currentStep === s.n ? 'active' : ''} ${currentStep > s.n ? 'completed' : ''}`}
                    onClick={() => currentStep > s.n && setCurrentStep(s.n)}
                >
                    <div className="step-num">{currentStep > s.n ? <CheckCircle2 size={18} /> : s.n}</div>
                    <span className="step-label">{s.label}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="hotel-create-container">
            <div className="wizard-card">
                {renderStepNav()}

                <div className="wizard-body">
                    {(error || hookError) && <div className="alert-box error"><AlertCircle size={20} /> {error || hookError}</div>}
                    {successMsg && <div className="alert-box success"><CheckCircle2 size={20} /> {successMsg}</div>}

                    {currentStep === 1 && (
                        <div className="step-content">
                            <div className="step-header">
                                <h2>Property Identity</h2>
                                <p>Establish the foundation of your listing in Karabakh</p>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="input-premium-group">
                                    <label className="label-premium">Commercial Name</label>
                                    <input type="text" name="name" className="input-premium" value={formData.name} onChange={handleChange} placeholder="e.g. Shusha Palace" required />
                                </div>
                                <div className="input-premium-group">
                                    <label className="label-premium">City Tier</label>
                                    <select name="city" className="select-premium" value={formData.city} onChange={handleChange}>
                                        <option value="Shusha">Shusha (Şuşa)</option>
                                        <option value="Lachin">Lachin (Laçın)</option>
                                        <option value="Khankendi">Khankendi (Xankəndi)</option>
                                        <option value="Aghdam">Aghdam (Ağdam)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="input-premium-group">
                                <label className="label-premium">Global Address</label>
                                <input type="text" name="address" className="input-premium" value={formData.address} onChange={handleChange} placeholder="District, Street, Building No." required />
                            </div>
                            <div className="input-premium-group">
                                <label className="label-premium">Official Description (Blueprint)</label>
                                <textarea name="description" className="textarea-premium" value={formData.description} onChange={handleChange} placeholder="Narrate the unique experience your property offers..." required />
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="step-content">
                            <div className="step-header">
                                <h2>Property DNA</h2>
                                <p>Technical specifications and contact protocols</p>
                            </div>
                            <div className="grid grid-cols-3 gap-8">
                                <div className="input-premium-group">
                                    <label className="label-premium">Star Rating</label>
                                    <div className="flex items-center gap-2">
                                        <input type="number" name="starRating" className="input-premium" min="1" max="5" value={formData.starRating} onChange={handleChange} />
                                        <Star size={24} className="text-amber-400 fill-amber-400" />
                                    </div>
                                </div>
                                <div className="input-premium-group">
                                    <label className="label-premium">Check-In</label>
                                    <div className="relative">
                                        <input type="time" name="checkInTime" className="input-premium" value={formData.checkInTime} onChange={handleChange} required />
                                        <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                                <div className="input-premium-group">
                                    <label className="label-premium">Check-Out</label>
                                    <div className="relative">
                                        <input type="time" name="checkOutTime" className="input-premium" value={formData.checkOutTime} onChange={handleChange} required />
                                        <Clock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="input-premium-group">
                                    <label className="label-premium">Verified Phone</label>
                                    <div className="relative">
                                        <input type="tel" name="phone" className="input-premium pl-12" value={formData.phone} onChange={handleChange} placeholder="+994 (00) 000-00-00" required />
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                                <div className="input-premium-group">
                                    <label className="label-premium">Official Email</label>
                                    <div className="relative">
                                        <input type="email" name="email" className="input-premium pl-12" value={formData.email} onChange={handleChange} placeholder="management@property.com" required />
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="input-premium-group">
                                    <label className="label-premium">Latitude (Strategic)</label>
                                    <div className="relative">
                                        <input type="text" name="latitude" className="input-premium pl-12" value={formData.latitude || ''} onChange={handleChange} placeholder="e.g. 39.758" />
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
                                    </div>
                                </div>
                                <div className="input-premium-group">
                                    <label className="label-premium">Longitude (Strategic)</label>
                                    <div className="relative">
                                        <input type="text" name="longitude" className="input-premium pl-12" value={formData.longitude || ''} onChange={handleChange} placeholder="e.g. 46.742" />
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="step-content">
                            <div className="step-header">
                                <h2>Amenity Selection</h2>
                                <p>Select the exclusive facilities available at your property</p>
                            </div>
                            <div className="amenities-blueprint-grid">
                                {AMENITY_DEFS.map(({ name, icon: Icon }) => (
                                    <div 
                                        key={name}
                                        className={`amenity-card ${formData.amenities?.includes(name) ? 'active' : ''}`}
                                        onClick={() => handleFacilityToggle(name)}
                                    >
                                        <div className="icon-wrapper"><Icon size={24} /></div>
                                        <span>{name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="step-content">
                            <div className="step-header">
                                <h2>Media Laboratory</h2>
                                <p>Manage the visual representation of your blueprint</p>
                            </div>
                            
                            <label className="media-blueprint-header">
                                <UploadCloud size={48} className="text-blue-500 mx-auto mb-4" />
                                <h4 className="text-xl font-black text-slate-800">Upload High-Res Assets</h4>
                                <p className="text-slate-400 font-bold mt-1">Select local files or drop them here</p>
                                <input type="file" multiple accept="image/*" onChange={(e) => e.target.files && setLocalFiles(prev => [...prev, ...Array.from(e.target.files!)])} className="hidden" />
                            </label>

                            {uploadError && <div className="p-4 mb-6 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-bold text-sm italic flex items-center gap-2"><Frown size={16} /> Upload Error: {uploadError}</div>}

                            <div className="input-premium-group mt-8">
                                <label className="label-premium">External Asset URL</label>
                                <div className="flex gap-4">
                                    <input type="url" className="input-premium" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} placeholder="https://external-storage.com/image.jpg" />
                                    <button type="button" onClick={handleAddImage} className="btn-approve-full !w-40 !rounded-2xl">Integrate</button>
                                </div>
                            </div>

                            <div className="section-title-premium mt-12">Gallery Preview ({ (formData.images?.length || 0) + localFiles.length } / 20)</div>
                            <div className="media-grid">
                                {formData.images?.map((url, idx) => (
                                    <div key={idx} className="media-card">
                                        <img src={url} alt="Hotel" />
                                        <button type="button" className="btn-remove-media" onClick={() => setFormData(p => ({ ...p, images: p.images?.filter((_, i) => i !== idx) }))}><X size={16} /></button>
                                    </div>
                                ))}
                                {localFiles.map((file, idx) => (
                                    <div key={`local-${idx}`} className="media-card grayscale hover:grayscale-0">
                                        <img src={URL.createObjectURL(file)} alt="Local" />
                                        <button type="button" className="btn-remove-media" onClick={() => setLocalFiles(p => p.filter((_, i) => i !== idx))}><X size={16} /></button>
                                        <div className="absolute inset-0 bg-blue-600/20 pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="wizard-footer">
                    <button type="button" className="btn-wizard-prev" onClick={prevStep} style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}>
                        <ChevronLeft size={20} /> Back
                    </button>

                    <div className="flex gap-4">
                        {currentStep < 4 ? (
                            <button type="button" className="btn-wizard-next" onClick={nextStep}>
                                Continue <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="btn-wizard-next !bg-emerald-600" 
                                disabled={loading || uploading || !submitReady}
                                onClick={() => handleSubmit()}
                            >
                                {loading || uploading ? <RefreshCw size={20} className="spin" /> : <><Save size={20} /> Deploy Property</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
