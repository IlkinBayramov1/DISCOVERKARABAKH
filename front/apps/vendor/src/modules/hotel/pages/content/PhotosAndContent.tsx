import React, { useState, useEffect } from 'react';
import { useUpload } from '../../hooks/useUpload';
import { useHotels } from '../../hooks/useHotels';
import { hotelApi } from '../../api/hotel.api';
import { Upload, X, Save, Image as ImageIcon } from 'lucide-react';
import './PhotosAndContent.css';

export default function PhotosAndContent() {
    const { data: hotels, loading: hotelsLoading } = useHotels(true);
    const { uploadImages, uploading } = useUpload();

    const [selectedHotelId, setSelectedHotelId] = useState<string>('');
    const [images, setImages] = useState<any[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Auto-select first hotel if available
    useEffect(() => {
        if (hotels.length > 0 && !selectedHotelId) {
            setSelectedHotelId(hotels[0].id);
        }
    }, [hotels, selectedHotelId]);

    // Load images when hotel changes
    useEffect(() => {
        if (selectedHotelId) {
            const hotel = hotels.find(h => h.id === selectedHotelId);
            if (hotel) {
                setImages(hotel.images || []);
            }
        }
    }, [selectedHotelId, hotels]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewFiles(Array.from(e.target.files));
        }
    };

    const handleRemoveExistingImage = (idToRemove: string) => {
        setImages(images.filter(img => img.id !== idToRemove));
    };

    const handleRemoveNewFile = (indexToRemove: number) => {
        setNewFiles(newFiles.filter((_, i) => i !== indexToRemove));
    };

    const handleSaveGallery = async () => {
        if (!selectedHotelId) return;
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            let uploadedUrls: string[] = [];

            // Upload new files to static storage if any exist
            if (newFiles.length > 0) {
                uploadedUrls = await uploadImages(newFiles);
            }

            // Gather all URLs (combining already saved URLs with newly uploaded ones)
            const existingUrls = images.map(img => img.url);
            const finalImageSet = [...existingUrls, ...uploadedUrls];

            // Patch the Hotel Model
            await hotelApi.updateHotel(selectedHotelId, { images: finalImageSet });

            setMessage({ type: 'success', text: 'Gallery successfully updated!' });
            setNewFiles([]); // Clear pending files

            // Re-map images state to mock new DB entries
            setImages(finalImageSet.map((url, idx) => ({ id: `temp-${idx}`, url, order: idx })));

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update gallery' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1><ImageIcon size={24} className="heading-icon" /> Photos & Content</h1>
                    <p>Upload high-quality images to attract more guests.</p>
                </div>

                {hotels.length > 0 && (
                    <div className="hotel-selector">
                        <select
                            value={selectedHotelId}
                            onChange={(e) => setSelectedHotelId(e.target.value)}
                            className="glass-select"
                        >
                            <option value="" disabled>Select Property</option>
                            {hotels.map(h => (
                                <option key={h.id} value={h.id}>{h.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {message.text && (
                <div className={`alert ${message.type === 'error' ? 'error' : 'success'}`}>
                    {message.text}
                </div>
            )}

            <div className="dashboard-content media-manager">
                {hotelsLoading ? (
                    <div className="loading-state"><div className="spinner"></div></div>
                ) : hotels.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Properties Found</h3>
                        <p>You need to create a Hotel/Property first before managing its photo gallery.</p>
                    </div>
                ) : (
                    <div className="gallery-workspace glassmorphism-card">

                        <div className="upload-zone">
                            <input
                                type="file"
                                id="file-upload"
                                multiple
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handleFileSelect}
                                className="hidden-input"
                            />
                            <label htmlFor="file-upload" className="upload-label">
                                <Upload size={32} />
                                <span>Click to select images from your device</span>
                                <small>Supported formats: JPG, PNG, WEBP</small>
                            </label>
                        </div>

                        {(newFiles.length > 0 || images.length > 0) && (
                            <div className="gallery-preview">
                                <h3>Property Gallery Preview</h3>
                                <div className="image-grid">
                                    {/* Existing Images */}
                                    {images.map(img => (
                                        <div key={img.id} className="image-thumbnail">
                                            <img src={img.url} alt="Hotel" />
                                            <button className="remove-btn" onClick={() => handleRemoveExistingImage(img.id)} title="Remove">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Pending Upload Preview */}
                                    {newFiles.map((file, idx) => (
                                        <div key={idx} className="image-thumbnail new-file">
                                            <div className="overlay-badge">Pending Upload</div>
                                            <img src={URL.createObjectURL(file)} alt="Pending" />
                                            <button className="remove-btn" onClick={() => handleRemoveNewFile(idx)} title="Cancel">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="gallery-actions">
                                    <button
                                        className="btn-primary"
                                        onClick={handleSaveGallery}
                                        disabled={uploading || saving}
                                    >
                                        {(uploading || saving) ? 'Saving...' : <><Save size={18} /> Save Complete Gallery</>}
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}
