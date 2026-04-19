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
    AlertCircle,
    Link as LinkIcon
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
    const { createHotel, data: hotels, loading: hotelsLoading, error: hookError } = useHotels(true);

    useEffect(() => {
        // Guard: If not editing and already has a property, redirect
        const isEdit = id && id !== 'create';
        if (!isEdit && !hotelsLoading && hotels.length > 0) {
            navigate('/vendor/hotel/dashboard');
        }
    }, [hotels, hotelsLoading, id, navigate]);

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
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };

    const validateForm = () => {
        const required = ['name', 'description', 'address', 'city', 'phone', 'email'];
        for (const field of required) {
            if (!formData[field as keyof IHotelPayload] || String(formData[field as keyof IHotelPayload]).trim() === '') {
                setError(`Please complete the ${field.charAt(0).toUpperCase() + field.slice(1)} field.`);
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
        
        if (currentStep !== 4) return;
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMsg(null);
        
        try {
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
                setSuccessMsg('Success! Your property is now live. Redirecting to dashboard...');
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => navigate('/vendor/hotel/dashboard'), 2000);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderStepNav = () => (
        <div className="dk-wizard-nav">
            {[
                { n: 1, label: 'Identity', icon: Home },
                { n: 2, label: 'Property DNA', icon: Dna },
                { n: 3, label: 'Amenities', icon: Sparkles },
                { n: 4, label: 'Media Lab', icon: ImageIcon },
            ].map((s, index, array) => (
                <React.Fragment key={s.n}>
                    <div 
                        className={`dk-step-item ${currentStep === s.n ? 'active' : ''} ${currentStep > s.n ? 'completed' : ''}`}
                        onClick={() => currentStep > s.n && setCurrentStep(s.n)}
                    >
                        <div className="dk-step-icon">
                            {currentStep > s.n ? <CheckCircle2 size={18} /> : <s.icon size={18} />}
                        </div>
                        <span className="dk-step-label">{s.label}</span>
                    </div>
                    {index < array.length - 1 && <div className={`dk-step-line ${currentStep > s.n ? 'completed' : ''}`} />}
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className="dk-create-layout">
            <div className="dk-wizard-container">
                
                {/* WIZARD NAVIGATION */}
                {renderStepNav()}

                <div className="dk-wizard-body">
                    
                    {/* ALERTS */}
                    {(error || hookError) && (
                        <div className="dk-alert-box error mb-6">
                            <AlertCircle size={20} /> {error || hookError}
                        </div>
                    )}
                    {successMsg && (
                        <div className="dk-alert-box success mb-6">
                            <CheckCircle2 size={20} /> {successMsg}
                        </div>
                    )}

                    {/* STEP 1: IDENTITY */}
                    {currentStep === 1 && (
                        <div className="dk-step-content animation-fade-in">
                            <div className="dk-step-header">
                                <h2>Property Identity</h2>
                                <p>Establish the foundation of your listing in Karabakh</p>
                            </div>
                            
                            <div className="dk-form-grid">
                                <div className="dk-form-group col-span-2 md:col-span-1">
                                    <label>Commercial Name</label>
                                    <input 
                                        type="text" name="name" 
                                        className="dk-input main-input" 
                                        value={formData.name} onChange={handleChange} 
                                        placeholder="e.g. Shusha Palace Resort" required 
                                    />
                                </div>
                                <div className="dk-form-group col-span-2 md:col-span-1">
                                    <label>City Tier</label>
                                    <select name="city" className="dk-input" value={formData.city} onChange={handleChange}>
                                        <option value="Shusha">Shusha (Şuşa)</option>
                                        <option value="Lachin">Lachin (Laçın)</option>
                                        <option value="Khankendi">Khankendi (Xankəndi)</option>
                                        <option value="Aghdam">Aghdam (Ağdam)</option>
                                    </select>
                                </div>
                                <div className="dk-form-group col-span-2">
                                    <label>Global Address</label>
                                    <div className="dk-input-wrap">
                                        <MapPin size={18} className="dk-input-icon text-slate-400" />
                                        <input 
                                            type="text" name="address" 
                                            className="dk-input with-icon" 
                                            value={formData.address} onChange={handleChange} 
                                            placeholder="District, Street, Building No." required 
                                        />
                                    </div>
                                </div>
                                <div className="dk-form-group col-span-2">
                                    <label>Official Description (Blueprint)</label>
                                    <textarea 
                                        name="description" 
                                        className="dk-input textarea" 
                                        value={formData.description} onChange={handleChange} 
                                        placeholder="Narrate the unique experience your property offers..." 
                                        rows={4} required 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DNA */}
                    {currentStep === 2 && (
                        <div className="dk-step-content animation-fade-in">
                            <div className="dk-step-header">
                                <h2>Property DNA</h2>
                                <p>Technical specifications and contact protocols</p>
                            </div>
                            
                            <div className="dk-form-grid">
                                <div className="dk-form-group">
                                    <label>Star Rating</label>
                                    <div className="dk-rating-input">
                                        <input 
                                            type="number" name="starRating" 
                                            className="dk-input text-center" 
                                            min="1" max="5" 
                                            value={formData.starRating} onChange={handleChange} 
                                        />
                                        <Star size={24} className="text-amber-400 fill-amber-400" />
                                    </div>
                                </div>
                                <div className="dk-form-group">
                                    <label>Check-In Time</label>
                                    <div className="dk-input-wrap">
                                        <Clock size={18} className="dk-input-icon text-blue-500" />
                                        <input type="time" name="checkInTime" className="dk-input with-icon" value={formData.checkInTime} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="dk-form-group">
                                    <label>Check-Out Time</label>
                                    <div className="dk-input-wrap">
                                        <Clock size={18} className="dk-input-icon text-emerald-500" />
                                        <input type="time" name="checkOutTime" className="dk-input with-icon" value={formData.checkOutTime} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="col-span-2 my-4"><hr className="dk-divider"/></div>

                                <div className="dk-form-group col-span-2 md:col-span-1">
                                    <label>Verified Phone</label>
                                    <div className="dk-input-wrap">
                                        <Phone size={18} className="dk-input-icon text-slate-400" />
                                        <input type="tel" name="phone" className="dk-input with-icon" value={formData.phone} onChange={handleChange} placeholder="+994 (00) 000-00-00" required />
                                    </div>
                                </div>
                                <div className="dk-form-group col-span-2 md:col-span-1">
                                    <label>Official Email</label>
                                    <div className="dk-input-wrap">
                                        <Mail size={18} className="dk-input-icon text-slate-400" />
                                        <input type="email" name="email" className="dk-input with-icon" value={formData.email} onChange={handleChange} placeholder="management@property.com" required />
                                    </div>
                                </div>

                                <div className="col-span-2 my-4"><hr className="dk-divider"/></div>

                                <div className="dk-form-group col-span-2 md:col-span-1">
                                    <label>Latitude (Strategic Coord)</label>
                                    <div className="dk-input-wrap">
                                        <MapPin size={18} className="dk-input-icon text-blue-500" />
                                        <input type="text" name="latitude" className="dk-input with-icon" value={formData.latitude || ''} onChange={handleChange} placeholder="e.g. 39.758" />
                                    </div>
                                </div>
                                <div className="dk-form-group col-span-2 md:col-span-1">
                                    <label>Longitude (Strategic Coord)</label>
                                    <div className="dk-input-wrap">
                                        <MapPin size={18} className="dk-input-icon text-emerald-500" />
                                        <input type="text" name="longitude" className="dk-input with-icon" value={formData.longitude || ''} onChange={handleChange} placeholder="e.g. 46.742" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: AMENITIES */}
                    {currentStep === 3 && (
                        <div className="dk-step-content animation-fade-in">
                            <div className="dk-step-header">
                                <h2>Amenity Selection</h2>
                                <p>Select the exclusive facilities available at your property</p>
                            </div>
                            <div className="dk-amenities-grid">
                                {AMENITY_DEFS.map(({ name, icon: Icon }) => {
                                    const isActive = formData.amenities?.includes(name);
                                    return (
                                        <div 
                                            key={name}
                                            className={`dk-amenity-card ${isActive ? 'active' : ''}`}
                                            onClick={() => handleFacilityToggle(name)}
                                        >
                                            <div className="am-icon"><Icon size={24} /></div>
                                            <span className="am-name">{name}</span>
                                            <div className="am-check">
                                                {isActive && <CheckCircle2 size={16} strokeWidth={3} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: MEDIA */}
                    {currentStep === 4 && (
                        <div className="dk-step-content animation-fade-in">
                            <div className="dk-step-header">
                                <h2>Media Laboratory</h2>
                                <p>Manage the visual representation of your blueprint</p>
                            </div>
                            
                            <label className="dk-media-dropzone">
                                <UploadCloud size={48} className="text-blue-500 mx-auto mb-4" />
                                <h4>Upload High-Res Assets</h4>
                                <p>Select local files or drop them here</p>
                                <input 
                                    type="file" multiple accept="image/*" className="hidden" 
                                    onChange={(e) => e.target.files && setLocalFiles(prev => [...prev, ...Array.from(e.target.files!)])} 
                                />
                            </label>

                            {uploadError && (
                                <div className="dk-alert-box error mt-4">
                                    <Frown size={18} /> Upload Error: {uploadError}
                                </div>
                            )}

                            <div className="dk-form-group mt-8">
                                <label>External Asset URL (Optional)</label>
                                <div className="flex gap-4">
                                    <div className="dk-input-wrap flex-1">
                                        <LinkIcon size={18} className="dk-input-icon text-slate-400" />
                                        <input type="url" className="dk-input with-icon" value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} placeholder="https://external-storage.com/image.jpg" />
                                    </div>
                                    <button type="button" onClick={handleAddImage} className="dk-btn-secondary w-32">Integrate</button>
                                </div>
                            </div>

                            <div className="dk-section-title mt-10">
                                Gallery Preview ({(formData.images?.length || 0) + localFiles.length} / 20)
                            </div>
                            
                            <div className="dk-media-preview-grid">
                                {formData.images?.map((url, idx) => (
                                    <div key={idx} className="media-preview-card">
                                        <img src={url} alt="Hotel" />
                                        <button type="button" className="btn-remove" onClick={() => setFormData(p => ({ ...p, images: p.images?.filter((_, i) => i !== idx) }))}>
                                            <X size={14} strokeWidth={3}/>
                                        </button>
                                    </div>
                                ))}
                                {localFiles.map((file, idx) => (
                                    <div key={`local-${idx}`} className="media-preview-card local">
                                        <img src={URL.createObjectURL(file)} alt="Local" />
                                        <div className="local-overlay"><UploadCloud size={20} className="animate-pulse text-white" /></div>
                                        <button type="button" className="btn-remove" onClick={() => setLocalFiles(p => p.filter((_, i) => i !== idx))}>
                                            <X size={14} strokeWidth={3}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* WIZARD FOOTER */}
                <div className="dk-wizard-footer">
                    <button 
                        type="button" 
                        className={`dk-btn-ghost ${currentStep === 1 ? 'invisible' : ''}`} 
                        onClick={prevStep}
                    >
                        <ChevronLeft size={20} /> Go Back
                    </button>

                    <div className="footer-right">
                        {currentStep < 4 ? (
                            <button type="button" className="dk-btn-primary" onClick={nextStep}>
                                Continue <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="dk-btn-submit" 
                                disabled={loading || uploading || !submitReady}
                                onClick={() => handleSubmit()}
                            >
                                {loading || uploading ? (
                                    <><RefreshCw size={20} className="spin-icon" /> Processing...</>
                                ) : (
                                    <><Save size={20} /> Deploy Property</>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}