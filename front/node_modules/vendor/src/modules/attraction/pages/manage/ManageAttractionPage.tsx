import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X, UploadCloud } from 'lucide-react';
import { vendorAttractionApi } from '../../api/attraction.api';
import { useUpload } from '../../../hotel/hooks/useUpload';
import type { AttractionCategory } from '../../types';
import './ManageAttractionPage.css';

const generateSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

const CITIES = ['Shusha', 'Lachin', 'Khankendi', 'Aghdam'];

export default function ManageAttractionPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [categories, setCategories] = useState<AttractionCategory[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        city: 'Shusha',
        address: '',
        description: '',
        categoryId: '',
        entryType: 'free',
        price: '',
        crowdLevel: 'medium',
        status: 'active',
        latitude: '39.76', // Default for Shusha
        longitude: '46.74',
        images: [] as string[]
    });

    const [newImageUrl, setNewImageUrl] = useState('');
    const [localFiles, setLocalFiles] = useState<File[]>([]);
    const { uploadImages, uploading, uploadError } = useUpload();

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const cats = await vendorAttractionApi.getCategories();
            if (cats.data) setCategories(cats.data);

            if (isEditing) {
                const res = await vendorAttractionApi.getAttractionById(id!);
                const attr = res.data;
                if (attr) {
                    setFormData({
                        name: attr.name || '',
                        city: attr.city || 'Shusha',
                        address: attr.address || '',
                        description: attr.description || '',
                        categoryId: attr.categoryId || '',
                        entryType: attr.entryType || 'free',
                        price: attr.price?.toString() || '',
                        crowdLevel: attr.crowdLevel || 'medium',
                        status: attr.status as any || 'active',
                        latitude: attr.latitude?.toString() || '39.76',
                        longitude: attr.longitude?.toString() || '46.74',
                        images: attr.images?.map(img => img.url) || []
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load data', error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setLocalFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeLocalFile = (indexToRemove: number) => {
        setLocalFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const getFullImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4004';
        return `${baseUrl}/${url.startsWith('/') ? url.slice(1) : url}`;
    };

    const addImageUrl = () => {
        if (!newImageUrl.trim()) return;
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, newImageUrl.trim()]
        }));
        setNewImageUrl('');
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const setAsCover = (index: number) => {
        setFormData(prev => {
            const newImages = [...prev.images];
            const [selected] = newImages.splice(index, 1);
            return {
                ...prev,
                images: [selected, ...newImages]
            };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.categoryId) {
            alert('Please select a category');
            return;
        }

        setIsLoading(true);
        try {
            // 1. Upload any local files first
            let uploadedUrls: string[] = [];
            if (localFiles.length > 0) {
                uploadedUrls = await uploadImages(localFiles);
            }

            // 2. Combine with existing URL images
            const finalImages = [...formData.images, ...uploadedUrls];

            // 3. Prepare payload
            const payload = {
                ...formData,
                slug: generateSlug(formData.name),
                price: formData.entryType === 'free' ? 0 : parseFloat(formData.price || '0'),
                latitude: parseFloat(formData.latitude || '0'),
                longitude: parseFloat(formData.longitude || '0'),
                images: finalImages
            };

            if (isEditing) {
                await vendorAttractionApi.updateAttraction(id!, payload as any);
            } else {
                await vendorAttractionApi.createAttraction(payload as any);
            }
            navigate('/vendor/attractions');
        } catch (error: any) {
            console.error('Save failed', error);
            alert(`Failed to save: ${error.message || 'Please check your inputs.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="manage-attraction-page">
            <div className="page-header">
                <div>
                    <h1>{isEditing ? 'Edit Attraction' : 'Add New Attraction'}</h1>
                    <p>Make sure to provide clear, accurate information for tourists.</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/vendor/attractions')} type="button">
                    Cancel
                </button>
            </div>

            <form className="attraction-form-container" onSubmit={handleSubmit}>
                <div className="form-section">
                    <h3>Basic Information</h3>
                    
                    <div className="form-group">
                        <label>Attraction Name</label>
                        <input 
                            required name="name" value={formData.name} onChange={handleChange}
                            placeholder="e.g. Shusha Castle" 
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select required name="categoryId" value={formData.categoryId} onChange={handleChange}>
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Crowd Level</label>
                            <select name="crowdLevel" value={formData.crowdLevel} onChange={handleChange}>
                                <option value="low">Low (Quiet)</option>
                                <option value="medium">Medium</option>
                                <option value="high">High (Busy)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description (Min 10 characters)</label>
                        <textarea 
                            required name="description" value={formData.description} onChange={handleChange}
                            rows={5} placeholder="Describe what tourists can expect..." 
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Location & Access</h3>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label>City / Region</label>
                            <select required name="city" value={formData.city} onChange={handleChange}>
                                {CITIES.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Specific Address</label>
                            <input required name="address" value={formData.address} onChange={handleChange} placeholder="Full address or directions" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Latitude</label>
                            <input 
                                required type="number" step="any"
                                name="latitude" value={formData.latitude} onChange={handleChange} 
                                placeholder="39.76"
                            />
                        </div>
                        <div className="form-group">
                            <label>Longitude</label>
                            <input 
                                required type="number" step="any"
                                name="longitude" value={formData.longitude} onChange={handleChange} 
                                placeholder="46.74"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Entry Type</label>
                            <select name="entryType" value={formData.entryType} onChange={handleChange}>
                                <option value="free">Free Entry</option>
                                <option value="paid">Paid Ticket</option>
                            </select>
                        </div>
                        {formData.entryType === 'paid' && (
                            <div className="form-group">
                                <label>Ticket Price (₼)</label>
                                <input 
                                    type="number" min="0" step="0.01" required 
                                    name="price" value={formData.price} onChange={handleChange} 
                                    placeholder="0.00"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-section">
                    <h3>Gallery & Images</h3>
                    <div className="image-management">
                        <div className="image-inputs">
                            <div className="form-group">
                                <label>Image URL</label>
                                <div className="input-with-button">
                                    <input 
                                        type="text" 
                                        value={newImageUrl} 
                                        onChange={(e) => setNewImageUrl(e.target.value)} 
                                        placeholder="Paste image link here..." 
                                    />
                                    <button type="button" onClick={addImageUrl}>
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="form-divider">OR</div>
                            <div className="form-group">
                                <label>Upload from Computer</label>
                                <div className="file-upload-wrapper">
                                    <label className="file-upload-btn">
                                        <UploadCloud size={18} />
                                        <span>Select Images</span>
                                        <input 
                                            type="file" 
                                            multiple 
                                            accept="image/*" 
                                            onChange={handleFileSelect} 
                                            style={{ display: 'none' }}
                                        />
                                    </label>
                                </div>
                                {uploading && <p className="field-hint">Uploading images...</p>}
                                {uploadError && <p className="error-text">{uploadError}</p>}
                            </div>
                        </div>

                        {(formData.images.length > 0 || localFiles.length > 0) && (
                            <div className="image-grid">
                                {formData.images.map((url, index) => (
                                    <div key={`saved-${index}`} className={`image-item ${index === 0 ? 'is-cover' : ''}`}>
                                        <img 
                                            src={getFullImageUrl(url)} 
                                            alt={`Gallery ${index}`} 
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Broken+Image';
                                            }}
                                        />
                                        <div className="image-overlay">
                                            {index === 0 ? (
                                                <span className="cover-badge">COVER</span>
                                            ) : (
                                                <button type="button" className="btn-cover" onClick={() => setAsCover(index)}>Set Cover</button>
                                            )}
                                            <button type="button" className="btn-remove" onClick={() => removeImage(index)}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {localFiles.map((file, index) => (
                                    <div key={`local-${index}`} className="image-item staged">
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            alt="local-preview" 
                                        />
                                        <div className="image-overlay">
                                            <span className="staged-badge">STAGED</span>
                                            <button type="button" className="btn-remove" onClick={() => removeLocalFile(index)}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        <p className="field-hint">The first image will be used as the cover photo. You can upload multiple images.</p>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Visibility Status</h3>
                    <div className="form-group">
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="active">Active (Visible)</option>
                            <option value="closed">Closed</option>
                            <option value="maintenance">Under Maintenance</option>
                        </select>
                        <p className="field-hint">Status determines if the attraction is visible to tourists.</p>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={isLoading || uploading}>
                        {uploading ? 'Uploading Media...' : (isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Attraction'))}
                    </button>
                </div>
            </form>
        </div>
    );
}
