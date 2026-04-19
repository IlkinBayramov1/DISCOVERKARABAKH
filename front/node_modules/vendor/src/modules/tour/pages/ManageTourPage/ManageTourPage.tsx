import { useState, useEffect } from 'react';
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
    Clock
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

    const [formData, setFormData] = useState<ITourPayload>({
        name: '',
        description: '',
        city: 'Shusha',
        address: '',
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
        inclusions: [],
        exclusions: [],
        startDate: ''
    });

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
                phone: tour.phone || '',
                email: tour.email || '',
                durationDays: tour.durationDays,
                durationNights: tour.durationNights,
                difficulty: tour.difficulty,
                groupSizeMin: tour.groupSizeMin,
                groupSizeMax: tour.groupSizeMax,
                pricePerPerson: tour.pricePerPerson,
                itinerary: tour.itinerary || [{ ...DEFAULT_ITINERARY_DAY }],
                images: tour.images || [],
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
            [name]: name.includes('Price') || name.includes('Group') || name.includes('duration') ? Number(value) : value
        }));
    };



    // Itinerary Handlers
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
            // Re-index days
            return {
                ...prev,
                itinerary: newItinerary.map((day, idx) => ({ ...day, day: idx + 1 }))
            };
        });
    };

    const updateDay = (index: number, field: keyof ITourItineraryDay, value: string | ITourItineraryDay['activities'] | string[]) => {
        setFormData(prev => {
            const newItinerary = [...(prev.itinerary || [])];
            newItinerary[index] = { ...newItinerary[index], [field]: value } as ITourItineraryDay;
            return { ...prev, itinerary: newItinerary };
        });
    };

    // Activity Handlers within a day
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
        newItinerary[dayIndex] = { ...newItinerary[dayIndex], activities: newActivities };
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const removeActivity = (dayIndex: number, actIndex: number) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary[dayIndex] = {
            ...newItinerary[dayIndex],
            activities: newItinerary[dayIndex].activities.filter((_, idx) => idx !== actIndex)
        };
        setFormData({ ...formData, itinerary: newItinerary });
    };

    // Inclusion/Exclusion Handlers
    const handleListChange = (field: 'inclusions' | 'exclusions', value: string) => {
        if (!value.trim()) return;
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), value.trim()]
        }));
    };

    const removeFromList = (field: 'inclusions' | 'exclusions', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] || []).filter((_, idx) => idx !== index)
        }));
    };

    // Image Upload
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            try {
                const urls = await uploadImages(Array.from(e.target.files));
                setFormData(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...urls]
                }));
            } catch (err: any) {
                setError('Failed to upload images');
            }
        }
    };

    const removeImage = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, i) => i !== idx)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (id) {
                await tourApi.updateTour(id, formData);
            } else {
                await tourApi.createTour(formData);
            }
            navigate('/vendor/tours');
        } catch (err: any) {
            setError(err.message || 'Failed to save tour');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="manage-page-loading">Loading experience details...</div>;

    return (
        <div className="manage-tour-container">
            <div className="manage-header">
                <div className="header-top">
                    <button onClick={() => navigate('/vendor/tours')} className="btn-back">
                        <ChevronLeft size={20} /> Back to Dashboard
                    </button>
                    <div className="status-badges">
                        {tourData?.isApproved ? (
                            <span className="badge-status approved">
                                <BadgeCheck size={14} /> Approved
                            </span>
                        ) : (
                            <span className="badge-status pending">
                                <Clock size={14} /> Pending Approval
                            </span>
                        )}
                        {tourData?.isFeatured && (
                            <span className="badge-status featured">
                                <Star size={14} /> Featured
                            </span>
                        )}
                    </div>
                </div>
                <h1>{id ? 'Edit Your Tour' : 'Create New Experience'}</h1>
                <p>Provide detailed information about the tour and its itinerary.</p>
            </div>

            {error && <div className="alert error">{error}</div>}

            <form onSubmit={handleSubmit} className="tour-manage-form">
                {/* Section 1: Basic Info */}
                <div className="form-section glassmorphism-card">
                    <h2>General Information</h2>
                    <div className="input-group">
                        <label>Tour Name</label>
                        <input name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Shusha Historical Walk" />
                    </div>
                    <div className="input-row">
                        <div className="input-group">
                            <label>City</label>
                            <select name="city" value={formData.city} onChange={handleInputChange}>
                                <option value="Shusha">Shusha</option>
                                <option value="Lachin">Lachin</option>
                                <option value="Aghdam">Aghdam</option>
                                <option value="Khankendi">Khankendi</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Address / Starting Point</label>
                            <input name="address" value={formData.address} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-group">
                            <label>Contact Phone</label>
                            <input name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+994 (__) ___-__-__" />
                        </div>
                        <div className="input-group">
                            <label>Contact Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="tour@example.com" />
                        </div>
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={5} />
                    </div>
                </div>

                {/* Section 2: Details & Pricing */}
                <div className="form-section glassmorphism-card">
                    <h2>Tour Specifics</h2>
                    <div className="input-row">
                        <div className="input-group">
                            <label>Duration (Days)</label>
                            <input type="number" name="durationDays" value={formData.durationDays} onChange={handleInputChange} min={1} />
                        </div>
                        <div className="input-group">
                            <label>Duration (Nights)</label>
                            <input type="number" name="durationNights" value={formData.durationNights} onChange={handleInputChange} min={0} />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-group">
                            <label>Min Group Size</label>
                            <input type="number" name="groupSizeMin" value={formData.groupSizeMin} onChange={handleInputChange} min={1} />
                        </div>
                        <div className="input-group">
                            <label>Max Group Size</label>
                            <input type="number" name="groupSizeMax" value={formData.groupSizeMax} onChange={handleInputChange} min={1} />
                        </div>
                        <div className="input-group highlight-input">
                            <label>Price (₼ per person)</label>
                            <input type="number" name="pricePerPerson" value={formData.pricePerPerson} onChange={handleInputChange} required />
                        </div>
                    </div>
                </div>

                {/* Section: Scheduling & Start Date */}
                <div className="form-section glassmorphism-card">
                    <h2>Scheduling</h2>
                    <div className="input-group">
                        <label>Tour Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                </div>

                {/* Section 3: Itinerary Builder */}
                <div className="form-section glassmorphism-card">
                    <div className="section-header">
                        <h2>Daily Itinerary</h2>
                        <button type="button" onClick={addDay} className="btn-add-day">
                            <Plus size={16} /> Add Day
                        </button>
                    </div>

                    <div className="itinerary-list">
                        {formData.itinerary?.map((day, dIdx) => (
                            <div key={dIdx} className="itinerary-day-card">
                                <div className="day-header">
                                    <h3>Day {day.day}</h3>
                                    <button type="button" onClick={() => removeDay(dIdx)} className="btn-remove-day">
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="input-group">
                                    <label>Title for the Day</label>
                                    <input value={day.title} onChange={(e) => updateDay(dIdx, 'title', e.target.value)} placeholder="e.g. Arrival & Evening Tour" />
                                </div>
                                <div className="input-group">
                                    <label>Day Overview</label>
                                    <textarea value={day.description} onChange={(e) => updateDay(dIdx, 'description', e.target.value)} rows={2} />
                                </div>

                                <div className="activities-builder">
                                    <div className="builder-header">
                                        <h4>Activities</h4>
                                        <button type="button" onClick={() => addActivity(dIdx)} className="btn-mini">Add Activity</button>
                                    </div>
                                    {day.activities.map((act, aIdx) => (
                                        <div key={aIdx} className="activity-row">
                                            <input type="time" value={act.time} onChange={(e) => updateActivity(dIdx, aIdx, 'time', e.target.value)} />
                                            <input type="text" value={act.description} onChange={(e) => updateActivity(dIdx, aIdx, 'description', e.target.value)} placeholder="Activity description" />
                                            <button type="button" onClick={() => removeActivity(dIdx, aIdx)} className="btn-icon"><X size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 4: Inclusions/Exclusions */}
                <div className="form-grid-2">
                    <div className="form-section glassmorphism-card">
                        <h2>Inclusions</h2>
                        <div className="list-builder">
                            <div className="builder-input">
                                <input id="inc-input" placeholder="Add included item..." onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleListChange('inclusions', (e.target as HTMLInputElement).value);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }} />
                            </div>
                            <div className="built-list">
                                {formData.inclusions?.map((item, idx) => (
                                    <div key={idx} className="list-item">
                                        <CheckCircle2 size={14} className="text-green" />
                                        <span>{item}</span>
                                        <button type="button" onClick={() => removeFromList('inclusions', idx)}><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="form-section glassmorphism-card">
                        <h2>Exclusions</h2>
                        <div className="list-builder">
                            <div className="builder-input">
                                <input id="exc-input" placeholder="Add excluded item..." onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleListChange('exclusions', (e.target as HTMLInputElement).value);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }} />
                            </div>
                            <div className="built-list">
                                {formData.exclusions?.map((item, idx) => (
                                    <div key={idx} className="list-item">
                                        <XCircle size={14} className="text-red" />
                                        <span>{item}</span>
                                        <button type="button" onClick={() => removeFromList('exclusions', idx)}><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 5: Photos */}
                <div className="form-section glassmorphism-card">
                    <h2>Experience Gallery</h2>
                    <div className="photo-upload-zone">
                        <label className="upload-btn">
                            <UploadCloud size={24} />
                            <span>{uploading ? 'Uploading...' : 'Click to Upload Tour Photos'}</span>
                            <input type="file" multiple accept="image/*" onChange={handleFileSelect} disabled={uploading} hidden />
                        </label>
                        <div className="photo-previews">
                            {formData.images?.map((url, idx) => (
                                <div key={idx} className="photo-preview">
                                    <img src={url} alt={`Tour ${idx}`} />
                                    <button type="button" onClick={() => removeImage(idx)}><X size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-submit-actions">
                    <button type="submit" className="btn-submit-main" disabled={saving || uploading}>
                        <Save size={20} />
                        {saving ? 'Saving...' : (id ? 'Update Experience' : 'Publish Tour')}
                    </button>
                    <button type="button" onClick={() => navigate('/vendor/tours')} className="btn-cancel">Cancel</button>
                </div>
            </form>
        </div>
    );
}
