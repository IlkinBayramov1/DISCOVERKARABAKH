import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Plus,
    CheckCircle2,
    XCircle,
    UploadCloud,
    X,
    Save,
    ChevronLeft,
    Star,
    BadgeCheck,
    Clock,
    MapPin,
    Phone,
    Mail,
    Calendar,
    Users,
    DollarSign,
    Map as MapIcon,
    Image as ImageIcon,
    ListChecks,
    RefreshCw
} from 'lucide-react';
import { tourApi } from '../../api/tour.api';
import { useUpload } from '../../../hotel/hooks/useUpload';
import type { ITourPayload, ITourItineraryDay, ITour } from '../../types';
import './ManageTourPage.css';

const DEFAULT_ITINERARY_DAY: ITourItineraryDay = {
    day: 1,
    title: '',
    description: '',
    activities: [{ time: '09:00', description: '' }],
    meals: []
};

export default function ManageTourPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { uploadImages, uploading } = useUpload();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tourData, setTourData] = useState<ITour | null>(null);

    const [incInput, setIncInput] = useState('');
    const [excInput, setExcInput] = useState('');

    const [formData, setFormData] = useState<ITourPayload>({
        name: '',
        description: '',
        city: 'Shusha',
        address: '',
        meetingAddress: '',
        destinationLink: '',
        phone: '',
        email: '',
        durationDays: 1,
        durationNights: 0,
        difficulty: 'Medium',
        groupSizeMin: 1,
        groupSizeMax: 10,
        pricePerPerson: 0,
        itinerary: [{ ...DEFAULT_ITINERARY_DAY }],
        images: [],
        meetingPoint: '',
        mapLink: '',
        inclusions: [],
        exclusions: [],
        startDate: ''
    });

    const [localFiles, setLocalFiles] = useState<File[]>([]);

    useEffect(() => {
        if (id) {
            loadTour();
        }
    }, [id]);

    const loadTour = async () => {
        setLoading(true);
        try {
            const res = await tourApi.getTourById(id!);
            const tour = (res as any).data || res;
            setTourData(tour);
            setFormData({
                name: tour.name,
                description: tour.description,
                city: tour.city || 'Shusha',
                address: tour.address,
                meetingAddress: tour.meetingAddress || '',
                destinationLink: tour.destinationLink || '',
                phone: tour.phone || '',
                email: tour.email || '',
                durationDays: tour.durationDays,
                durationNights: tour.durationNights,
                difficulty: tour.difficulty || 'Medium',
                groupSizeMin: tour.groupSizeMin,
                groupSizeMax: tour.groupSizeMax,
                pricePerPerson: tour.pricePerPerson,
                itinerary: tour.itinerary?.length > 0 ? tour.itinerary : [{ ...DEFAULT_ITINERARY_DAY }],
                images: tour.images || [],
                meetingPoint: tour.meetingPoint || '',
                mapLink: tour.mapLink || '',
                inclusions: tour.inclusions || [],
                exclusions: tour.exclusions || [],
                startDate: tour.startDate ? tour.startDate.split('T')[0] : ''
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load tour details');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('Price') || name.includes('Group') || name.includes('duration') || name === 'latitude' || name === 'longitude' ? Number(value) : value
        }));
    };

    // --- ITINERARY HANDLERS ---
    const addDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [
                ...(prev.itinerary || []),
                { ...DEFAULT_ITINERARY_DAY, day: (prev.itinerary?.length || 0) + 1 }
            ]
        }));
    };

    const removeDay = (index: number) => {
        setFormData(prev => {
            const newItinerary = prev.itinerary?.filter((_, idx) => idx !== index) || [];
            return { ...prev, itinerary: newItinerary.map((day, idx) => ({ ...day, day: idx + 1 })) };
        });
    };

    const updateDay = (index: number, field: keyof ITourItineraryDay, value: any) => {
        setFormData(prev => {
            const newItinerary = [...(prev.itinerary || [])];
            newItinerary[index] = { ...newItinerary[index], [field]: value };
            return { ...prev, itinerary: newItinerary };
        });
    };

    const addActivity = (dayIndex: number) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary[dayIndex] = {
            ...newItinerary[dayIndex],
            activities: [...newItinerary[dayIndex].activities, { time: '12:00', description: '' }]
        };
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const updateActivity = (dayIndex: number, actIndex: number, field: 'time' | 'description', value: string) => {
        const newItinerary = [...(formData.itinerary || [])];
        const newActivities = [...newItinerary[dayIndex].activities];
        newActivities[actIndex] = { ...newActivities[actIndex], [field]: value };
        newItinerary[dayIndex].activities = newActivities;
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const removeActivity = (dayIndex: number, actIndex: number) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter((_, idx) => idx !== actIndex);
        setFormData({ ...formData, itinerary: newItinerary });
    };

    // --- INCLUSIONS / EXCLUSIONS ---
    const handleAddListItem = (field: 'inclusions' | 'exclusions') => {
        const value = field === 'inclusions' ? incInput : excInput;
        if (!value.trim()) return;
        
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), value.trim()]
        }));

        if (field === 'inclusions') setIncInput('');
        else setExcInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'inclusions' | 'exclusions') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddListItem(field);
        }
    };

    const removeFromList = (field: 'inclusions' | 'exclusions', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, idx) => idx !== index)
        }));
    };

    // --- IMAGES ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setLocalFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeLocalFile = (idx: number) => {
        setLocalFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== idx)
        }));
    };

    // --- SUBMIT ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            let uploadedUrls: string[] = [];
            if (localFiles.length > 0) {
                uploadedUrls = await uploadImages(localFiles);
            }

            const finalData = {
                ...formData,
                images: [...(formData.images || []), ...uploadedUrls]
            };

            if (id) {
                await tourApi.updateTour(id, finalData);
            } else {
                await tourApi.createTour(finalData);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => navigate('/vendor/tours'), 1000);
        } catch (err: any) {
            setError(err.message || 'Failed to save tour');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="dk-mt-loading">
                <RefreshCw size={48} className="spin-icon" />
                <p>Loading Experience Blueprint...</p>
            </div>
        );
    }

    return (
        <div className="dk-mt-layout">
            <div className="dk-mt-container">
                
                {/* HEADER */}
                <div className="dk-mt-header">
                    <button onClick={() => navigate('/vendor/tours')} className="dk-btn-back">
                        <ChevronLeft size={16} /> Back to Tours
                    </button>
                    
                    <div className="header-title-row">
                        <div>
                            <h1>{id ? 'Edit Experience Blueprint' : 'Architect New Experience'}</h1>
                            <p>Configure routing, pricing, and operational details for your tour.</p>
                        </div>
                        {id && (
                            <div className="dk-status-badges">
                                {tourData?.isApproved ? (
                                    <span className="badge approved"><BadgeCheck size={14} /> Verified</span>
                                ) : (
                                    <span className="badge pending"><Clock size={14} /> Reviewing</span>
                                )}
                                {tourData?.isFeatured && (
                                    <span className="badge featured"><Star size={14} fill="currentColor" /> Featured</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {error && <div className="dk-alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="dk-mt-form">
                    
                    {/* SECTION 1: IDENTITY */}
                    <div className="dk-form-card">
                        <h2 className="card-title"><MapIcon size={18} /> Experience Identity</h2>
                        
                        <div className="dk-input-group">
                            <label>Tour Commercial Name</label>
                            <input 
                                name="name" className="dk-input main-input" 
                                value={formData.name} onChange={handleInputChange} 
                                required placeholder="e.g. Majestic Shusha Historical Walk" 
                            />
                        </div>

                        <div className="dk-grid-2">
                            <div className="dk-input-group">
                                <label>Operational Region</label>
                                <div className="dk-input-wrap">
                                    <MapPin size={16} className="input-icon" />
                                    <select name="city" className="dk-input with-icon" value={formData.city} onChange={handleInputChange}>
                                        <option value="Shusha">Shusha</option>
                                        <option value="Lachin">Lachin</option>
                                        <option value="Aghdam">Aghdam</option>
                                        <option value="Khankendi">Khankendi</option>
                                    </select>
                                </div>
                            </div>
                            <div className="dk-input-group">
                                <label>Tour Destination Address</label>
                                <div className="dk-input-wrap">
                                    <MapPin size={16} className="input-icon" />
                                    <input 
                                        name="address" className="dk-input with-icon" 
                                        value={formData.address} onChange={handleInputChange} 
                                        required placeholder="Where the tour takes place (e.g. Shusha Fortress)" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="dk-input-group">
                            <label>Specific Meeting Point Address</label>
                            <div className="dk-input-wrap">
                                <MapPin size={16} className="input-icon" />
                                <input 
                                    name="meetingAddress" className="dk-input with-icon" 
                                    value={formData.meetingAddress} onChange={handleInputChange} 
                                    placeholder="Where guests should MEET (e.g. Shusha Bus Station)" 
                                />
                            </div>
                        </div>

                        <div className="dk-input-group">
                            <label>Specific Meeting Point Instructions (Visible to guests)</label>
                            <textarea 
                                name="meetingPoint" className="dk-input textarea" 
                                value={formData.meetingPoint} onChange={handleInputChange} 
                                rows={2} placeholder="e.g. Meet us at the Shusha Fortress main gate, next to the souvenir shop..." 
                            />
                        </div>

                        <div className="dk-input-group">
                            <label>Google Maps Meeting Point Link (Short Link)</label>
                            <div className="dk-input-wrap">
                                <MapIcon size={16} className="input-icon" />
                                <input 
                                    name="mapLink" className="dk-input with-icon" 
                                    value={formData.mapLink} onChange={handleInputChange} 
                                    placeholder="https://maps.app.goo.gl/..." 
                                />
                            </div>
                            <p className="dk-input-hint">Paste the short link from Google Maps where guests should MEET.</p>
                        </div>

                        <div className="dk-input-group">
                            <label>Tour Destination Google Maps Link (Optional)</label>
                            <div className="dk-input-wrap">
                                <MapIcon size={16} className="input-icon" />
                                <input 
                                    name="destinationLink" className="dk-input with-icon" 
                                    value={formData.destinationLink} onChange={handleInputChange} 
                                    placeholder="https://maps.app.goo.gl/..." 
                                />
                            </div>
                            <p className="dk-input-hint">Link to the actual destination (e.g. Shusha Fortress).</p>
                        </div>

                        <div className="dk-grid-2">
                            <div className="dk-input-group">
                                <label>Emergency Contact Phone</label>
                                <div className="dk-input-wrap">
                                    <Phone size={16} className="input-icon" />
                                    <input 
                                        name="phone" className="dk-input with-icon" 
                                        value={formData.phone} onChange={handleInputChange} 
                                        required placeholder="+994 (00) 000-00-00" 
                                    />
                                </div>
                            </div>
                            <div className="dk-input-group">
                                <label>Operations Email</label>
                                <div className="dk-input-wrap">
                                    <Mail size={16} className="input-icon" />
                                    <input 
                                        type="email" name="email" className="dk-input with-icon" 
                                        value={formData.email} onChange={handleInputChange} 
                                        required placeholder="tours@property.com" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="dk-input-group">
                            <label>Marketing Description</label>
                            <textarea 
                                name="description" className="dk-input textarea" 
                                value={formData.description} onChange={handleInputChange} 
                                required rows={4} placeholder="Describe the magic of this experience..." 
                            />
                        </div>
                    </div>

                    {/* SECTION 2: LOGISTICS & PRICING */}
                    <div className="dk-form-card">
                        <h2 className="card-title"><Calendar size={18} /> Logistics & Yield</h2>
                        
                        <div className="dk-grid-3">
                            <div className="dk-input-group">
                                <label>Duration (Days)</label>
                                <input type="number" name="durationDays" className="dk-input" value={formData.durationDays} onChange={handleInputChange} min={1} required />
                            </div>
                            <div className="dk-input-group">
                                <label>Duration (Nights)</label>
                                <input type="number" name="durationNights" className="dk-input" value={formData.durationNights} onChange={handleInputChange} min={0} required />
                            </div>
                            <div className="dk-input-group">
                                <label>Difficulty Level</label>
                                <select name="difficulty" className="dk-input" value={formData.difficulty} onChange={handleInputChange}>
                                    <option value="Easy">Easy (Leisure)</option>
                                    <option value="Medium">Medium (Moderate)</option>
                                    <option value="Hard">Hard (Challenging)</option>
                                    <option value="Extreme">Extreme (Expert)</option>
                                </select>
                            </div>
                        </div>

                        <div className="dk-grid-3">
                            <div className="dk-input-group">
                                <label>Min. Explorers</label>
                                <div className="dk-input-wrap">
                                    <Users size={16} className="input-icon" />
                                    <input type="number" name="groupSizeMin" className="dk-input with-icon" value={formData.groupSizeMin} onChange={handleInputChange} min={1} required />
                                </div>
                            </div>
                            <div className="dk-input-group">
                                <label>Max. Capacity</label>
                                <div className="dk-input-wrap">
                                    <Users size={16} className="input-icon" />
                                    <input type="number" name="groupSizeMax" className="dk-input with-icon" value={formData.groupSizeMax} onChange={handleInputChange} min={1} required />
                                </div>
                            </div>
                            <div className="dk-input-group">
                                <label>Yield Per Person (₼)</label>
                                <div className="dk-input-wrap">
                                    <DollarSign size={16} className="input-icon text-emerald-500" />
                                    <input type="number" name="pricePerPerson" className="dk-input with-icon font-black text-emerald-600" value={formData.pricePerPerson} onChange={handleInputChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="dk-input-group mt-4">
                            <label>Next Available Start Date</label>
                            <div className="dk-input-wrap max-w-sm">
                                <Calendar size={16} className="input-icon text-blue-500" />
                                <input
                                    type="date" name="startDate" className="dk-input with-icon"
                                    value={formData.startDate} onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]} required
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: ITINERARY BUILDER */}
                    <div className="dk-form-card itinerary-section">
                        <div className="card-header-flex">
                            <h2 className="card-title mb-0"><ListChecks size={18} /> Tactical Itinerary</h2>
                            <button type="button" onClick={addDay} className="dk-btn-secondary small">
                                <Plus size={16} /> Append Day
                            </button>
                        </div>

                        <div className="itinerary-timeline">
                            {formData.itinerary?.map((day, dIdx) => (
                                <div key={dIdx} className="dk-itinerary-day-box">
                                    <div className="day-header-bar">
                                        <div className="day-badge">Day {day.day}</div>
                                        <button type="button" onClick={() => removeDay(dIdx)} className="btn-remove-node" title="Remove Day">
                                            <X size={16} />
                                        </button>
                                    </div>

                                    <div className="day-content-body">
                                        <div className="dk-input-group">
                                            <label>Mission Title</label>
                                            <input 
                                                className="dk-input" value={day.title} 
                                                onChange={(e) => updateDay(dIdx, 'title', e.target.value)} 
                                                placeholder="e.g. Summit Conquest & Camp Setup" 
                                            />
                                        </div>
                                        <div className="dk-input-group">
                                            <label>Daily Briefing</label>
                                            <textarea 
                                                className="dk-input" value={day.description} 
                                                onChange={(e) => updateDay(dIdx, 'description', e.target.value)} 
                                                rows={2} placeholder="Summary of the day's events..." 
                                            />
                                        </div>

                                        <div className="activity-container">
                                            <div className="act-header">
                                                <h4>Time-Boxed Activities</h4>
                                                <button type="button" onClick={() => addActivity(dIdx)} className="dk-btn-ghost tiny">Add Activity</button>
                                            </div>
                                            
                                            {day.activities.map((act, aIdx) => (
                                                <div key={aIdx} className="activity-row">
                                                    <input 
                                                        type="time" className="dk-input small time-input" 
                                                        value={act.time} onChange={(e) => updateActivity(dIdx, aIdx, 'time', e.target.value)} 
                                                    />
                                                    <input 
                                                        type="text" className="dk-input small flex-1" 
                                                        value={act.description} onChange={(e) => updateActivity(dIdx, aIdx, 'description', e.target.value)} 
                                                        placeholder="Activity detail (e.g. Lunch at local cafe)" 
                                                    />
                                                    <button type="button" onClick={() => removeActivity(dIdx, aIdx)} className="btn-remove-node small">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 4: INCLUSIONS & EXCLUSIONS */}
                    <div className="dk-grid-2">
                        <div className="dk-form-card">
                            <h2 className="card-title text-emerald-600"><CheckCircle2 size={18} /> Inclusions</h2>
                            <div className="dk-tag-adder">
                                <input 
                                    type="text" className="dk-input" placeholder="e.g. Breakfast, Transport..."
                                    value={incInput} onChange={e => setIncInput(e.target.value)}
                                    onKeyDown={e => handleKeyDown(e, 'inclusions')}
                                />
                                <button type="button" className="dk-btn-primary" onClick={() => handleAddListItem('inclusions')}>Add</button>
                            </div>
                            <div className="dk-tags-container">
                                {formData.inclusions?.map((item, idx) => (
                                    <div key={idx} className="dk-tag-pill success">
                                        <span>{item}</span>
                                        <button type="button" onClick={() => removeFromList('inclusions', idx)}><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="dk-form-card">
                            <h2 className="card-title text-rose-600"><XCircle size={18} /> Exclusions</h2>
                            <div className="dk-tag-adder">
                                <input 
                                    type="text" className="dk-input" placeholder="e.g. Flights, Personal Expenses..."
                                    value={excInput} onChange={e => setExcInput(e.target.value)}
                                    onKeyDown={e => handleKeyDown(e, 'exclusions')}
                                />
                                <button type="button" className="dk-btn-primary" onClick={() => handleAddListItem('exclusions')}>Add</button>
                            </div>
                            <div className="dk-tags-container">
                                {formData.exclusions?.map((item, idx) => (
                                    <div key={idx} className="dk-tag-pill danger">
                                        <span>{item}</span>
                                        <button type="button" onClick={() => removeFromList('exclusions', idx)}><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: MEDIA GALLERY */}
                    <div className="dk-form-card mb-10">
                        <h2 className="card-title"><ImageIcon size={18} /> Visual Assets</h2>
                        
                        <label className="dk-media-dropzone">
                            <UploadCloud size={40} className="text-blue-500 mb-3" />
                            <h5>Upload High-Res Tour Photos</h5>
                            <p>Drag & drop or click to select local files</p>
                            <input type="file" multiple accept="image/*" onChange={handleFileSelect} disabled={uploading} hidden />
                        </label>

                        <div className="dk-media-grid mt-6">
                            {formData.images?.map((url, idx) => (
                                <div key={`exist-${idx}`} className="dk-media-item">
                                    <img src={url} alt={`Tour ${idx}`} />
                                    <button type="button" className="btn-remove-media" onClick={() => removeExistingImage(idx)}>
                                        <X size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                            {localFiles.map((file, idx) => (
                                <div key={`local-${idx}`} className="dk-media-item local">
                                    <img src={URL.createObjectURL(file)} alt="Local preview" />
                                    <div className="media-overlay"><UploadCloud size={20} className="animate-pulse text-white" /></div>
                                    <button type="button" className="btn-remove-media" onClick={() => removeLocalFile(idx)}>
                                        <X size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* STICKY FOOTER */}
                    <div className="dk-form-footer">
                        <button type="button" onClick={() => navigate('/vendor/tours')} className="dk-btn-ghost">
                            Discard Changes
                        </button>
                        <button type="submit" className="dk-btn-submit" disabled={saving || uploading}>
                            {saving || uploading ? (
                                <><RefreshCw size={20} className="spin-icon" /> Processing...</>
                            ) : (
                                <><Save size={20} /> {id ? 'Update Tour Blueprint' : 'Deploy New Tour'}</>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}