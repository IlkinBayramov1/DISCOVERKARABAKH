import React, { useState, useEffect } from 'react';
import { useUpload } from '../../hooks/useUpload';
import { useHotels } from '../../hooks/useHotels';
import { hotelApi } from '../../api/hotel.api';
import { 
    Upload, 
    X, 
    Save, 
    Image as ImageIcon, 
    FileText, 
    Wifi, 
    RefreshCw, 
    MapPin, 
    Phone, 
    Mail,
    CheckCircle2
} from 'lucide-react';
import { HOTEL_AMENITIES, PROPERTY_TYPES } from '../../constants';
import './PhotosAndContent.css';

type TabType = 'gallery' | 'info' | 'amenities';

export default function PhotosAndContent() {
    const { data: hotels, loading: hotelsLoading, refetch: refetchHotels } = useHotels(true);
    const { uploadImages, uploading } = useUpload();

    const [activeTab, setActiveTab] = useState<TabType>('gallery');
    const [selectedHotelId, setSelectedHotelId] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Local State for Editing
    const [images, setImages] = useState<{ id?: string; url: string; order: number }[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [hotelData, setHotelData] = useState<any>(null);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    useEffect(() => {
        if (hotels.length > 0 && !selectedHotelId) {
            setSelectedHotelId(hotels[0].id);
        }
    }, [hotels, selectedHotelId]);

    useEffect(() => {
        if (selectedHotelId) {
            const hotel = hotels.find(h => h.id === selectedHotelId);
            if (hotel) {
                setHotelData(hotel);
                setImages(hotel.images || []);
                setSelectedAmenities(hotel.amenities?.map((a: any) => a.amenity.name) || []);
            }
        }
    }, [selectedHotelId, hotels]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleRemoveExistingImage = (idToRemove?: string) => {
        if (!idToRemove) return;
        setImages(images.filter(img => img.id !== idToRemove));
    };

    const handleSetMainImage = (index: number) => {
        const newImages = [...images];
        const [target] = newImages.splice(index, 1);
        newImages.unshift(target);
        setImages(newImages.map((img, i) => ({ ...img, order: i })));
    };

    const toggleAmenity = (name: string) => {
        setSelectedAmenities(prev => 
            prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
        );
    };

    const handleSave = async () => {
        if (!selectedHotelId) return;
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            let uploadedUrls: string[] = [];
            if (newFiles.length > 0) {
                uploadedUrls = await uploadImages(newFiles);
            }

            const currentUrls = images.map(img => img.url);
            const finalImages = [...currentUrls, ...uploadedUrls];

            const payload = {
                ...hotelData,
                images: finalImages,
                amenities: selectedAmenities,
                // Ensure ID and other non-payload fields are removed if necessary, 
                // but updateHotel usually takes Partial<IHotelPayload>
            };

            await hotelApi.updateHotel(selectedHotelId, payload);
            
            setMessage({ type: 'success', text: 'Property updated successfully!' });
            setNewFiles([]);
            refetchHotels(); // Refresh data to get permanent IDs for new images
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update property' });
        } finally {
            setSaving(false);
        }
    };

    if (hotelsLoading) return <div className="loading-state centered p-5"><RefreshCw className="spin" /></div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header mb-4">
                <div>
                    <h1><ImageIcon size={28} className="heading-icon" /> Property Content</h1>
                    <p>Manage how your property appears to potential guests.</p>
                </div>

                {hotels.length > 0 && (
                    <div className="hotel-selector">
                        <select
                            value={selectedHotelId}
                            onChange={(e) => setSelectedHotelId(e.target.value)}
                            className="styled-select"
                        >
                            {hotels.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {message.text && (
                <div className={`alert ${message.type === 'error' ? 'error' : 'success'} mb-3`}>
                    {message.text}
                </div>
            )}

            <div className="content-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    <ImageIcon size={18} /> Gallery
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    <FileText size={18} /> General Info
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'amenities' ? 'active' : ''}`}
                    onClick={() => setActiveTab('amenities')}
                >
                    <Wifi size={18} /> Amenities
                </button>
            </div>

            <div className="gallery-workspace glassmorphism-card">
                {activeTab === 'gallery' && (
                    <div className="tab-content">
                        <div className="upload-zone" onClick={() => document.getElementById('file-upload')?.click()}>
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept="image/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                            <div className="upload-label">
                                <Upload size={48} className="text-muted" />
                                <span>Upload High-Resolution Photos</span>
                                <small>Drag & drop or click to select. First image will be the cover photo.</small>
                            </div>
                        </div>

                        <div className="image-grid">
                            {images.map((img, idx) => (
                                <div key={img.id || idx} className="image-thumbnail">
                                    {idx === 0 && <div className="main-badge">Cover</div>}
                                    <img src={img.url} alt="Hotel" />
                                    <button className="remove-btn" onClick={() => handleRemoveExistingImage(img.id)}>
                                        <X size={16} />
                                    </button>
                                    {idx !== 0 && (
                                        <button className="set-main-btn" onClick={() => handleSetMainImage(idx)}>
                                            Set as Cover
                                        </button>
                                    )}
                                </div>
                            ))}

                            {newFiles.map((file, idx) => (
                                <div key={idx} className="image-thumbnail pending">
                                    <div className="main-badge" style={{ background: '#3b82f6', color: 'white' }}>Pending</div>
                                    <img src={URL.createObjectURL(file)} alt="Pending" />
                                    <button className="remove-btn" onClick={() => setNewFiles(newFiles.filter((_, i) => i !== idx))}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'info' && hotelData && (
                    <div className="tab-content">
                        <div className="info-section-grid">
                            <div className="left-col">
                                <div className="section-title mb-3"><FileText size={14} /> Descriptions & Policies</div>
                                <div className="info-item">
                                    <label>Property Name</label>
                                    <input 
                                        type="text" 
                                        className="styled-input" 
                                        value={hotelData.name}
                                        onChange={e => setHotelData({...hotelData, name: e.target.value})}
                                    />
                                </div>
                                <div className="info-item">
                                    <label>About the Property</label>
                                    <textarea 
                                        className="styled-textarea"
                                        placeholder="Describe your property to the world..."
                                        value={hotelData.description}
                                        onChange={e => setHotelData({...hotelData, description: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="info-grid dual">
                                    <div className="info-item">
                                        <label>Cancellation Policy</label>
                                        <textarea 
                                            className="styled-textarea small" 
                                            value={hotelData.cancellationPolicy || ''}
                                            onChange={e => setHotelData({...hotelData, cancellationPolicy: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <div className="info-item">
                                        <label>Pet Policy</label>
                                        <textarea 
                                            className="styled-textarea small"
                                            value={hotelData.petPolicy || ''}
                                            onChange={e => setHotelData({...hotelData, petPolicy: e.target.value})}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="right-col">
                                <div className="section-title mb-3"><MapPin size={14} /> Location & Contact</div>
                                <div className="info-item">
                                    <label>Address</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            className="styled-input flex-grow" 
                                            value={hotelData.address}
                                            onChange={e => setHotelData({...hotelData, address: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="info-grid dual">
                                    <div className="info-item">
                                        <label><Phone size={12} /> Phone Number</label>
                                        <input 
                                            type="text" 
                                            className="styled-input" 
                                            value={hotelData.phone || ''}
                                            onChange={e => setHotelData({...hotelData, phone: e.target.value})}
                                        />
                                    </div>
                                    <div className="info-item">
                                        <label><Mail size={12} /> Official Email</label>
                                        <input 
                                            type="email" 
                                            className="styled-input" 
                                            value={hotelData.email || ''}
                                            onChange={e => setHotelData({...hotelData, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="info-grid dual">
                                    <div className="info-item">
                                        <label>Property Type</label>
                                        <select 
                                            className="styled-select"
                                            value={hotelData.propertyType}
                                            onChange={e => setHotelData({...hotelData, propertyType: e.target.value})}
                                        >
                                            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                    <div className="info-item">
                                        <label>Official Stars</label>
                                        <select 
                                            className="styled-select"
                                            value={hotelData.starRating || 0}
                                            onChange={e => setHotelData({...hotelData, starRating: Number(e.target.value)})}
                                        >
                                            {[0,1,2,3,4,5].map(s => <option key={s} value={s}>{s} Stars</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'amenities' && (
                    <div className="tab-content">
                        <div className="section-title mb-4"><Wifi size={14} /> Select Shared Amenities</div>
                        <div className="amenities-selector-grid">
                            {Object.entries(HOTEL_AMENITIES).map(([name, def]) => {
                                const isActive = selectedAmenities.includes(name);
                                return (
                                    <div 
                                        key={name} 
                                        className={`amenity-toggle ${isActive ? 'active' : ''}`}
                                        onClick={() => toggleAmenity(name)}
                                    >
                                        <div className="amenity-icon-wrap">
                                            <CheckCircle2 size={16} className={isActive ? 'visible' : 'hidden'} />
                                            {!isActive && <Wifi size={18} opacity={0.3} />}
                                        </div>
                                        <div className="flex-col items-center">
                                            <span className="amenity-name">{name}</span>
                                            <span className="amenity-category">{def.category}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="bottom-actions">
                    <button 
                        className="btn-primary px-5 py-3" 
                        onClick={handleSave}
                        disabled={saving || uploading}
                    >
                        {saving || uploading ? <RefreshCw className="spin" size={18} /> : <><Save size={20} /> Save Changes</>}
                    </button>
                </div>
            </div>

            <style>{`
                .centered { display: flex; align-items: center; justify-content: center; min-height: 400px; }
                .mb-3 { margin-bottom: 1rem; }
                .mb-4 { margin-bottom: 2rem; }
                .dual { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                .px-5 { padding-left: 2rem; padding-right: 2rem; }
                .py-3 { padding-top: 1rem; padding-bottom: 1rem; }
                .flex-grow { flex-grow: 1; }
                .hidden { display: none; }
                .visible { display: block; }
                .styled-textarea.small { min-height: 80px; }
                .hotel-tag { background: #3b82f6; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7rem; }
            `}</style>
        </div>
    );
}
