import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHotels } from '../../hooks/useHotels';
import { useUpload } from '../../hooks/useUpload';
import { hotelApi } from '../../api/hotel.api';
import { parseCoordinate } from '../../utils/coordinates';
import type { IHotelPayload } from '../../types';
import { UploadCloud, X } from 'lucide-react';
import './CreateHotel.css';

const AVAILABLE_FACILITIES = [
    'Wifi', 'Pool', 'Parking', 'Restaurant', 'Gym',
    'Bar', 'Spa', 'Conference Room', 'Room Service', 'Airport Shuttle'
];

export default function CreateHotel() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { createHotel, error: hookError } = useHotels(false);
    const { uploadImages, uploading, uploadError } = useUpload();

    const [formData, setFormData] = useState<IHotelPayload>({
        name: '',
        description: '',
        address: '',
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

    useEffect(() => {
        if (id) {
            loadHotelDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const loadHotelDetails = async () => {
        setLoading(true);
        try {
            const res = await hotelApi.getHotelById(id!);
            const hotel = (res as any).data || res;

            setFormData({
                name: hotel.name || '',
                description: hotel.description || '',
                address: hotel.address || '',
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
            setError(err.message || 'Failed to load hotel details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        let parsedValue: any = value;
        if (name === 'starRating') {
            parsedValue = Number(value);
        } else if (name === 'latitude' || name === 'longitude') {
            parsedValue = parseCoordinate(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    const handleFacilityToggle = (facility: string) => {
        setFormData(prev => {
            const current = prev.amenities || [];
            if (current.includes(facility)) {
                return { ...prev, amenities: current.filter(f => f !== facility) };
            } else {
                return { ...prev, amenities: [...current, facility] };
            }
        });
    };

    const handleAddImage = () => {
        if (imageUrlInput.trim() !== '') {
            setFormData(prev => ({
                ...prev,
                images: [...(prev.images || []), imageUrlInput.trim()]
            }));
            setImageUrlInput('');
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setLocalFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeLocalFile = (indexToRemove: number) => {
        setLocalFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
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
                await hotelApi.updateHotel(id, finalData);
                setSuccessMsg('Property updated successfully!');
            } else {
                await createHotel(finalData);
                setSuccessMsg('Hotel application submitted successfully! Pending admin approval.');
            }
            setTimeout(() => {
                navigate('/vendor/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'An error occurred while saving the property.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hotel-create-container">
            <div className="hotel-create-card glassmorphism-card">
                <div className="card-header">
                    <h2>{id ? 'Update Property' : 'Register New Property'}</h2>
                    <p>{id ? 'Edit the details and settings of your listing.' : 'Add your hotel, resort, or villa to Discover Karabakh'}</p>
                </div>

                {(error || hookError) && <div className="alert error">{error || hookError}</div>}
                {successMsg && <div className="alert success">{successMsg}</div>}

                <form onSubmit={handleSubmit} className="hotel-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} placeholder=" " />
                            <label htmlFor="name">Property Name</label>
                        </div>

                        <div className="input-group">
                            <select name="propertyType" id="propertyType" value={formData.propertyType} onChange={handleChange}>
                                <option value="hotel">Hotel</option>
                                <option value="resort">Resort</option>
                                <option value="villa">Villa</option>
                                <option value="apartment">Apartment</option>
                            </select>
                            <label htmlFor="propertyType">Property Type</label>
                        </div>
                    </div>

                    <div className="input-group">
                        <input type="text" name="address" id="address" required value={formData.address} onChange={handleChange} placeholder=" " />
                        <label htmlFor="address">Full Address (City, Street)</label>
                    </div>

                    <div className="input-group">
                        <textarea name="description" id="description" required rows={4} value={formData.description} onChange={handleChange} placeholder=" "></textarea>
                        <label htmlFor="description">Property Description</label>
                    </div>

                    <div className="form-grid info-grid">
                        <div className="input-group">
                            <input type="text" name="latitude" id="latitude" value={formData.latitude || ''} onChange={handleChange} placeholder=" " />
                            <label htmlFor="latitude">Latitude (e.g. 39°45'41.6"N)</label>
                        </div>

                        <div className="input-group">
                            <input type="text" name="longitude" id="longitude" value={formData.longitude || ''} onChange={handleChange} placeholder=" " />
                            <label htmlFor="longitude">Longitude (e.g. 46°44'32.0"E)</label>
                        </div>
                    </div>

                    <div className="form-grid info-grid">
                        <div className="input-group">
                            <input type="number" name="starRating" id="starRating" min="1" max="5" required value={formData.starRating} onChange={handleChange} placeholder=" " />
                            <label htmlFor="starRating">Star Rating (1-5)</label>
                        </div>

                        <div className="input-group">
                            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} placeholder=" " />
                            <label htmlFor="phone">Contact Phone</label>
                        </div>

                        <div className="input-group">
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} placeholder=" " />
                            <label htmlFor="email">Contact Email</label>
                        </div>
                    </div>

                    <div className="form-grid time-grid">
                        <div className="input-group">
                            <input type="time" name="checkInTime" id="checkInTime" value={formData.checkInTime} onChange={handleChange} placeholder=" " />
                            <label htmlFor="checkInTime">Default Check-in</label>
                        </div>

                        <div className="input-group">
                            <input type="time" name="checkOutTime" id="checkOutTime" value={formData.checkOutTime} onChange={handleChange} placeholder=" " />
                            <label htmlFor="checkOutTime">Default Check-out</label>
                        </div>
                    </div>

                    <div className="facilities-section">
                        <h3>Hotel Facilities</h3>
                        <div className="facilities-grid">
                            {AVAILABLE_FACILITIES.map(facility => (
                                <label key={facility} className="facility-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={(formData.amenities || []).includes(facility)}
                                        onChange={() => handleFacilityToggle(facility)}
                                    />
                                    <span>{facility}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="images-section">
                        <h3>Property Images</h3>
                        <div className="image-input-row">
                            <div className="input-group image-input">
                                <input
                                    type="url"
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    placeholder="Paste image URL here"
                                />
                            </div>
                            <button type="button" onClick={handleAddImage} className="btn-secondary add-img-btn">Add Image URL</button>
                        </div>
                        <div className="image-preview-list">
                            {(formData.images || []).map((url, idx) => (
                                <div key={idx} className="image-preview-item">
                                    <img src={url} alt={`Preview ${idx}`} />
                                    <button type="button" onClick={() => handleRemoveImage(idx)} className="remove-img-btn">&times;</button>
                                </div>
                            ))}
                        </div>

                        <div className="local-files-section mt-2 border-top pt-2">
                            <h4>Or Upload Images from Device</h4>
                            <div className="file-upload-wrapper">
                                <label className="file-upload-btn btn-secondary outline">
                                    <UploadCloud size={16} /> Select Device Images
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            {localFiles.length > 0 && (
                                <div className="local-files-preview mt-2">
                                    {localFiles.map((file, idx) => (
                                        <div key={idx} className="image-input-row" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '8px' }}>
                                            <div className="img-preview-mini" style={{ width: '48px', height: '48px', overflow: 'hidden', borderRadius: '6px' }}>
                                                <img src={URL.createObjectURL(file)} alt="local-preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <span style={{ fontSize: '0.85rem', color: '#166534', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {file.name}
                                            </span>
                                            <button type="button" className="btn-remove-url" onClick={() => removeLocalFile(idx)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {uploadError && <p className="text-danger mt-1" style={{ fontSize: '0.8rem' }}>{uploadError}</p>}
                        </div>


                    </div>

                    <div className="form-actions">
                        <button type="submit" disabled={loading || uploading} className="btn-primary" style={{ marginTop: '20px' }}>
                            {uploading ? <span className="spinner">Uploading Media...</span> : (loading ? <span className="spinner"></span> : (id ? 'Save Updates' : 'Submit Property Application'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
