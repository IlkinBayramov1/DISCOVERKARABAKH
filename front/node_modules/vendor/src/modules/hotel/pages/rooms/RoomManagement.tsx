import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRooms } from '../../hooks/useRooms';
import { useHotels } from '../../hooks/useHotels';
import { useUpload } from '../../hooks/useUpload';
import { BedDouble, Plus, PencilLine, Trash2, Users, Maximize, ArrowLeft, Image as ImageIcon, X, ChevronLeft, ChevronRight, UploadCloud } from 'lucide-react';
import type { IRoomTypePayload, IRoomType } from '../../types';
import './RoomManagement.css';

const COMMON_ROOM_AMENITIES = [
    'Air Conditioning', 'Free WiFi', 'Flat-screen TV', 'Mini Bar',
    'Balcony', 'Sea View', 'City View', 'Private Bathroom',
    'Bathtub', 'Coffee Machine', 'Safe', 'Desk'
];

// Reusable Image Slider for Room Cards
const ImageSlider = ({ images, name }: { images: any[], name: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="no-image-placeholder room-placeholder">
                <ImageIcon size={32} />
            </div>
        );
    }

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
    };

    const currentImage = images[currentIndex].url || images[currentIndex];

    return (
        <div className="hotel-image-slider">
            <img src={currentImage} alt={`${name} - ${currentIndex + 1}`} />
            {images.length > 1 && (
                <>
                    <button className="slider-btn prev" onClick={handlePrevious}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="slider-btn next" onClick={handleNext}>
                        <ChevronRight size={20} />
                    </button>
                    <div className="slider-dots">
                        {images.map((_, idx) => (
                            <span key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default function RoomManagement() {
    const [searchParams] = useSearchParams();
    const hotelId = searchParams.get('hotelId');
    const navigate = useNavigate();

    // Fetch hotels to get the hotel name
    const { data: hotels } = useHotels();
    const currentHotel = hotels.find(h => h.id === hotelId);

    const { rooms, loading, error, addRoomType, editRoomType, removeRoomType } = useRooms(hotelId || undefined);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
    const [localFiles, setLocalFiles] = useState<File[]>([]);
    const { uploadImages, uploading, uploadError } = useUpload();

    const [formData, setFormData] = useState<IRoomTypePayload>({
        name: '',
        description: '',

        maxAdults: 2,
        maxChildren: 0,
        baseOccupancy: 2,
        bedType: '1 Queen Bed',
        roomSizeM2: 25,
        totalInventory: 1,
        images: [],
        amenities: []
    });

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            maxAdults: 2,
            maxChildren: 0,
            baseOccupancy: 2,
            bedType: '1 Queen Bed',
            roomSizeM2: 25,
            totalInventory: 1,
            images: [],
            amenities: []
        });
        setLocalFiles([]);
        setEditingRoomId(null);
        setIsFormOpen(false);
    };

    const handleOpenEdit = (room: IRoomType) => {
        setFormData({
            name: room.name,
            description: room.description || '',
            maxAdults: room.maxAdults,
            maxChildren: room.maxChildren,
            baseOccupancy: room.baseOccupancy,
            bedType: room.bedType || '',
            roomSizeM2: room.roomSizeM2 || 0,
            totalInventory: room.totalInventory,
            images: room.images ? room.images.map(img => img.url || img) : [],
            amenities: room.roomAmenities ? room.roomAmenities.map(a => a.amenityName) : []
        });
        setEditingRoomId(room.id);
        setIsFormOpen(true);
    };

    const handleDelete = async (roomId: string, name: string) => {
        if (window.confirm(`Delete room class "${name}"? This removes all associated inventory.`)) {
            try {
                await removeRoomType(roomId);
            } catch (err) {
                alert('Failed to delete room.');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let uploadedUrls: string[] = [];

            if (localFiles.length > 0) {
                uploadedUrls = await uploadImages(localFiles);
            }

            const finalData = {
                ...formData,
                images: [...(formData.images || []), ...uploadedUrls]
            };

            if (editingRoomId) {
                await editRoomType(editingRoomId, finalData);
            } else {
                await addRoomType(finalData);
            }
            resetForm();
        } catch (err) {
            alert('Failed to save room type. Check your images connection.');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Parse numbers for specific number fields
        const numFields = ['maxAdults', 'maxChildren', 'baseOccupancy', 'roomSizeM2', 'totalInventory'];
        setFormData((prev: IRoomTypePayload) => ({
            ...prev,
            [name]: numFields.includes(name) ? Number(value) : value
        }));
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData((prev: IRoomTypePayload) => {
            const current = prev.amenities || [];
            if (current.includes(amenity)) {
                return { ...prev, amenities: current.filter(a => a !== amenity) };
            } else {
                return { ...prev, amenities: [...current, amenity] };
            }
        });
    };

    const addImageUrl = () => {
        setFormData((prev: IRoomTypePayload) => ({
            ...prev,
            images: [...(prev.images || []), '']
        }));
    };

    const handleImageUrlChange = (index: number, value: string) => {
        setFormData((prev: IRoomTypePayload) => {
            const newImages = [...(prev.images || [])];
            newImages[index] = value;
            return { ...prev, images: newImages };
        });
    };

    const removeImageUrl = (indexToRemove: number) => {
        setFormData((prev: IRoomTypePayload) => ({
            ...prev,
            images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setLocalFiles((prev: File[]) => [...prev, ...newFiles]);
        }
    };

    const removeLocalFile = (indexToRemove: number) => {
        setLocalFiles((prev: File[]) => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const isGlobalView = !hotelId;

    if (isGlobalView && rooms.length === 0 && !loading) {
        return (
            <div className="dashboard-container">
                <div className="empty-state">
                    <h3>No Rooms Found</h3>
                    <p>You haven't created any rooms yet. Select a property from the Dashboard to add rooms.</p>
                    <button className="btn-primary" onClick={() => navigate('/vendor/dashboard')}>
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="room-management-container">
            <div className="dashboard-header mb-2">
                <div>
                    <button className="btn-back" onClick={() => navigate('/vendor')}>
                        <ArrowLeft size={16} /> Back to Properties
                    </button>
                    <h1>{isGlobalView ? 'All My Rooms' : 'Room Management'}</h1>
                    <p>{isGlobalView ? 'Showing all rooms across your properties' : `Configuring rooms for `}
                        {!isGlobalView && <strong>{currentHotel?.name || 'Loading...'}</strong>}
                    </p>
                </div>
                {!isFormOpen && !isGlobalView && (
                    <button className="btn-primary" onClick={() => setIsFormOpen(true)}>
                        <Plus size={18} /> Add Room Type
                    </button>
                )}
            </div>

            {error && <div className="alert error">{error}</div>}

            {isFormOpen ? (
                <div className="room-form-card glassmorphism-card">
                    <h2>{editingRoomId ? 'Edit Room Type' : 'Create New Room Type'}</h2>
                    <form onSubmit={handleSubmit} className="room-form">
                        <div className="form-group full-width">
                            <label>Room Class Name (e.g. Deluxe Double)</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter room name"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Description (Optional)</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the room features and view..."
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Base Occupancy</label>
                                <input type="number" min="1" name="baseOccupancy" value={formData.baseOccupancy} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Max Adults</label>
                                <input type="number" min="1" name="maxAdults" value={formData.maxAdults} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Max Children</label>
                                <input type="number" min="0" name="maxChildren" value={formData.maxChildren} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Bed Type</label>
                                <input type="text" name="bedType" value={formData.bedType} onChange={handleChange} placeholder="e.g. 1 King Bed" />
                            </div>
                            <div className="form-group">
                                <label>Room Size (m²)</label>
                                <input type="number" min="0" name="roomSizeM2" value={formData.roomSizeM2} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Total Physical Inventory</label>
                                <input type="number" min="1" name="totalInventory" value={formData.totalInventory} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="facilities-section">
                            <h3>Room Facilities</h3>
                            <div className="facilities-grid">
                                {COMMON_ROOM_AMENITIES.map(facility => (
                                    <label key={facility} className="facility-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={(formData.amenities || []).includes(facility)}
                                            onChange={() => handleAmenityToggle(facility)}
                                        />
                                        <span>{facility}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="images-section">
                            <div className="section-header">
                                <h3>Room Photos (URLs)</h3>
                                <button type="button" className="btn-secondary outline btn-sm" onClick={addImageUrl}>
                                    <Plus size={14} /> Add Photo
                                </button>
                            </div>
                            <div className="image-inputs">
                                {(formData.images || []).length === 0 ? (
                                    <p className="no-images-text">No images added. Click "Add Photo" above.</p>
                                ) : (
                                    (formData.images || []).map((url, idx) => (
                                        <div key={idx} className="image-input-row">
                                            <input
                                                type="url"
                                                value={url}
                                                onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                                                placeholder="https://example.com/room-view.jpg"
                                                required
                                            />
                                            {url && (
                                                <div className="img-preview-mini">
                                                    <img src={url} alt="preview" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                                </div>
                                            )}
                                            <button type="button" className="btn-remove-url" onClick={() => removeImageUrl(idx)}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="local-files-section mt-2 border-top pt-2">
                                <h4>Or Upload Images from Device</h4>
                                <div className="file-upload-wrapper">
                                    <label className="file-upload-btn btn-secondary outline">
                                        <UploadCloud size={16} /> Select Images
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
                                            <div key={idx} className="image-input-row" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                                <div className="img-preview-mini">
                                                    <img src={URL.createObjectURL(file)} alt="local-preview" />
                                                </div>
                                                <span style={{ fontSize: '0.85rem', color: '#166534', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {file.name}
                                                </span>
                                                <button type="button" className="btn-remove-url" onClick={() => removeLocalFile(idx)}>
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
                            <button type="button" className="btn-secondary" onClick={resetForm} disabled={loading || uploading}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={loading || uploading}>
                                {uploading ? 'Uploading Media...' : (loading ? 'Saving...' : 'Save Room Type')}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="room-list-section">
                    {loading ? (
                        <div className="loading-state"><div className="spinner"></div><p>Loading rooms...</p></div>
                    ) : rooms.length === 0 ? (
                        <div className="empty-state">
                            <BedDouble size={48} className="empty-icon" />
                            <h3>No Rooms Configured</h3>
                            <p>You haven't added any room types for this property yet.</p>
                            <button className="btn-secondary" onClick={() => setIsFormOpen(true)}>Add Your First Room</button>
                        </div>
                    ) : (
                        <div className="room-grid">
                            {rooms.map((room: IRoomType) => (
                                <div key={room.id} className="room-card">
                                    <ImageSlider images={room.images || []} name={room.name} />

                                    <div className="room-card-content">
                                        <div className="room-card-header" style={{ alignItems: 'flex-start' }}>
                                            <div>
                                                <h3 style={{ margin: 0, marginBottom: '0.2rem' }}>{room.name}</h3>
                                                {isGlobalView && (room as any).hotel && (
                                                    <span className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        📍 {(room as any).hotel.name}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="inventory-badge" style={{ marginTop: '0.2rem' }}>{room.totalInventory} Units</span>
                                        </div>
                                        <p className="room-desc mt-2">{room.description || 'No description provided.'}</p>

                                        <div className="room-features">
                                            <div className="feature"><Users size={14} /> Up to {room.maxAdults} Adults, {room.maxChildren} Children</div>
                                            {room.bedType && <div className="feature"><BedDouble size={14} /> {room.bedType}</div>}
                                            {room.roomSizeM2 ? <div className="feature"><Maximize size={14} /> {room.roomSizeM2} m²</div> : null}
                                        </div>

                                        {(room.roomAmenities && room.roomAmenities.length > 0) && (
                                            <div className="room-features mt-2">
                                                {room.roomAmenities.map(am => (
                                                    <div key={am.id || am.amenityName} className="feature amenity-pill">
                                                        {am.amenityName}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="room-card-actions">
                                            {isGlobalView ? (
                                                <button className="btn-outline w-100" style={{ justifyContent: 'center' }} onClick={() => navigate(`/vendor/rooms?hotelId=${(room as any).hotel?.id}`)}>
                                                    <PencilLine size={14} /> Manage in {(room as any).hotel?.name}
                                                </button>
                                            ) : (
                                                <>
                                                    <button className="btn-outline" onClick={() => handleOpenEdit(room)}>
                                                        <PencilLine size={14} /> Edit
                                                    </button>
                                                    <button className="btn-outline text-danger" onClick={() => handleDelete(room.id, room.name)}>
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
