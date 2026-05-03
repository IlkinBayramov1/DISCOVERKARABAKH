import React, { useState, useEffect } from 'react';
import { 
    X, 
    Plus, 
    UploadCloud, 
    Check, 
    Info, 
    DollarSign, 
    Layers, 
    Users, 
    Maximize,
    BedDouble,
    Tv,
    Wind,
    Wifi,
    Coffee,
    Shield,
    Loader2
} from 'lucide-react';
import { useUpload } from '../../hooks/useUpload';
import type { IRoomTypePayload, IRoomType } from '../../types';
import './RoomTypeModal.css';

interface RoomTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (payload: IRoomTypePayload) => Promise<void>;
    editingRoom: IRoomType | null;
    isSaving: boolean;
}

const COMMON_ROOM_AMENITIES = [
    { name: 'Air Conditioning', icon: <Wind size={16} /> },
    { name: 'Free WiFi', icon: <Wifi size={16} /> },
    { name: 'Smart TV', icon: <Tv size={16} /> },
    { name: 'Mini Bar', icon: <Layers size={16} /> },
    { name: 'Coffee Machine', icon: <Coffee size={16} /> },
    { name: 'Private Safe', icon: <Shield size={16} /> },
    { name: 'Luxury Bath', icon: <Info size={16} /> },
    { name: 'Work Desk', icon: <Info size={16} /> }
];

const BED_TYPES = [
    '1 King Bed',
    '2 Twin Beds',
    '1 Queen Bed',
    '1 Double Bed',
    '2 Queen Beds',
    'Studio / Sofa Bed',
    'Triple Room Setup'
];

export default function RoomTypeModal({ isOpen, onClose, onSave, editingRoom, isSaving }: RoomTypeModalProps) {
    const [formData, setFormData] = useState<any>({
        name: '',
        description: '',
        maxAdults: 2,
        maxChildren: 0,
        baseOccupancy: 2,
        bedType: '1 King Bed',
        roomSizeM2: 25,
        totalInventory: 1,
        basePrice: 0,
        category: 'Standard',
        images: [],
        amenities: []
    });

    const [localFiles, setLocalFiles] = useState<File[]>([]);
    const { uploadImages, uploading, uploadError } = useUpload();
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (editingRoom) {
            setFormData({
                name: editingRoom.name,
                description: editingRoom.description || '',
                maxAdults: editingRoom.maxAdults,
                maxChildren: editingRoom.maxChildren,
                baseOccupancy: editingRoom.baseOccupancy,
                bedType: editingRoom.bedType || '',
                roomSizeM2: editingRoom.roomSizeM2 || 0,
                totalInventory: editingRoom.totalInventory,
                basePrice: editingRoom.basePrice || 0,
                category: editingRoom.category || 'Standard',
                images: editingRoom.images ? editingRoom.images.map(img => (typeof img === 'string' ? img : img.url)) : [],
                amenities: editingRoom.roomAmenities ? editingRoom.roomAmenities.map(a => a.amenityName) : []
            });
        } else {
            setFormData({
                name: '',
                description: '',
                maxAdults: 2,
                maxChildren: 0,
                baseOccupancy: 2,
                bedType: '1 King Bed',
                roomSizeM2: 25,
                totalInventory: 1,
                basePrice: 0,
                category: 'Standard',
                images: [],
                amenities: []
            });
        }
        setLocalFiles([]);
    }, [editingRoom, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numFields = ['maxAdults', 'maxChildren', 'baseOccupancy', 'roomSizeM2', 'totalInventory', 'basePrice'];
        setFormData((prev: any) => ({
            ...prev,
            [name]: numFields.includes(name) ? Number(value) : value
        }));
    };

    const handleAmenityToggle = (amenity: string) => {
        const current = formData.amenities || [];
        if (current.includes(amenity)) {
            setFormData({ ...formData, amenities: current.filter((a: string) => a !== amenity) });
        } else {
            setFormData({ ...formData, amenities: [...current, amenity] });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setLocalFiles((prev: File[]) => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeLocalFile = (idx: number) => {
        setLocalFiles((prev: File[]) => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = (urlToRemove: string) => {
        setFormData({ ...formData, images: formData.images.filter((url: string) => url !== urlToRemove) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            let uploadedUrls: string[] = [];
            if (localFiles.length > 0) {
                uploadedUrls = await uploadImages(localFiles);
            }

            const payload: IRoomTypePayload = {
                ...formData,
                amenities: formData.amenities.map((name: string) => ({ name })),
                images: [...formData.images, ...uploadedUrls]
            };

            await onSave(payload);
        } catch (err: any) {
            setFormError(err.message || 'An unexpected error occurred while saving.');
        }
    };

    return (
        <div className="dk-rt-modal-overlay" onClick={onClose}>
            <div className="dk-rt-modal-container" onClick={e => e.stopPropagation()}>
                <div className="dk-rt-modal-header">
                    <div className="dk-rt-title-group">
                        <div className="dk-rt-icon-badge">
                            <BedDouble size={24} />
                        </div>
                        <div className="dk-rt-header-text">
                            <h2>{editingRoom ? 'Edit Room Type' : 'Create New Category'}</h2>
                            <p>{editingRoom ? `Modifying properties for ${editingRoom.name}` : 'Define the DNA of your new hotel room category'}</p>
                        </div>
                    </div>
                    <button className="dk-rt-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="dk-rt-modal-body">
                    <form id="room-type-form" onSubmit={handleSubmit}>
                        
                        {/* IDENTITY SECTION */}
                        <div className="dk-rt-section">
                            <div className="dk-rt-section-title">
                                <Info size={14} />
                                Category Identity
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="dk-rt-field">
                                    <label className="dk-rt-label">Room Name / Label</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Ocean View Room"
                                        className="dk-rt-input"
                                        style={{fontSize: '16px', fontWeight: 700}}
                                        required
                                    />
                                </div>
                                <div className="dk-rt-field">
                                    <label className="dk-rt-label">Otaq Kateqoriyası</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="dk-rt-input appearance-none"
                                        style={{fontSize: '16px', fontWeight: 700}}
                                    >
                                        <option value="Standard">Standard</option>
                                        <option value="Suite">Suite</option>
                                        <option value="Family">Family</option>
                                        <option value="Deluxe">Deluxe</option>
                                    </select>
                                </div>
                            </div>
                            <div className="dk-rt-field">
                                <label className="dk-rt-label">Detailed Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the experience, views, and unique layout..."
                                    className="dk-rt-textarea"
                                    rows={3}
                                />
                            </div>
                        </div>

                        {/* CAPACITY AND PRICING */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="dk-rt-section mb-0">
                                <div className="dk-rt-section-title">
                                    <DollarSign size={14} />
                                    Economics
                                </div>
                                <div className="dk-rt-field">
                                    <label className="dk-rt-label">Base Price (AZN / Night)</label>
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleChange}
                                        className="dk-rt-input"
                                        required
                                    />
                                </div>
                                <div className="dk-rt-field mb-0">
                                    <label className="dk-rt-label">Inventory Count</label>
                                    <input
                                        type="number"
                                        name="totalInventory"
                                        value={formData.totalInventory}
                                        onChange={handleChange}
                                        className="dk-rt-input"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="dk-rt-section mb-0">
                                <div className="dk-rt-section-title">
                                    <Users size={14} />
                                    Capacity
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="dk-rt-field mb-0">
                                        <label className="dk-rt-label">Max Adults</label>
                                        <input type="number" name="maxAdults" value={formData.maxAdults} onChange={handleChange} className="dk-rt-input" />
                                    </div>
                                    <div className="dk-rt-field mb-0">
                                        <label className="dk-rt-label">Max Children</label>
                                        <input type="number" name="maxChildren" value={formData.maxChildren} onChange={handleChange} className="dk-rt-input" />
                                    </div>
                                </div>
                                <div className="dk-rt-field mt-4">
                                    <label className="dk-rt-label">Room Size (m²)</label>
                                    <div className="relative">
                                        <Maximize size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="number" name="roomSizeM2" value={formData.roomSizeM2} onChange={handleChange} className="dk-rt-input pl-12" />
                                    </div>
                                </div>
                                <div className="dk-rt-field mt-4 mb-0">
                                    <label className="dk-rt-label">Bed Configuration</label>
                                    <div className="relative">
                                        <BedDouble size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select 
                                            name="bedType" 
                                            value={formData.bedType} 
                                            onChange={handleChange} 
                                            className="dk-rt-input pl-12 appearance-none"
                                        >
                                            {BED_TYPES.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                            <option value="Other">Other / Custom</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AMENITIES SECTION */}
                        <div className="dk-rt-section">
                            <div className="dk-rt-section-title">
                                <Shield size={14} />
                                Room Features & Amenities
                            </div>
                            <div className="dk-rt-amenity-grid">
                                {COMMON_ROOM_AMENITIES.map(item => (
                                    <div 
                                        key={item.name}
                                        className={`dk-rt-amenity-card ${formData.amenities.includes(item.name) ? 'active' : ''}`}
                                        onClick={() => handleAmenityToggle(item.name)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-500">{item.icon}</span>
                                            <span>{item.name}</span>
                                        </div>
                                        <div className="dk-rt-check-indicator">
                                            {formData.amenities.includes(item.name) && <Check size={10} strokeWidth={4} />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* CUSTOM AMENITY INPUT */}
                            <div className="dk-rt-custom-amenity-box mt-4">
                                <label className="text-xs font-semibold text-slate-500 mb-2 block uppercase tracking-wider">Custom Amenities</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        id="custom-amenity-field"
                                        placeholder="Add custom feature (e.g. Garden View, Kitchenette)" 
                                        className="dk-rt-input flex-1"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const input = e.currentTarget;
                                                const val = input.value.trim();
                                                if (val && !formData.amenities.includes(val)) {
                                                    setFormData({ ...formData, amenities: [...formData.amenities, val] });
                                                    input.value = '';
                                                }
                                            }
                                        }}
                                    />
                                    <button 
                                        type="button" 
                                        className="dk-rt-add-btn bg-slate-100 p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors"
                                        onClick={() => {
                                            const input = document.getElementById('custom-amenity-field') as HTMLInputElement;
                                            const val = input.value.trim();
                                            if (val && !formData.amenities.includes(val)) {
                                                setFormData({ ...formData, amenities: [...formData.amenities, val] });
                                                input.value = '';
                                            }
                                        }}
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* SELECTED CUSTOM AMENITIES */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.amenities.filter((name: string) => !COMMON_ROOM_AMENITIES.find(a => a.name === name)).map((name: string) => (
                                    <span key={name} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100 group">
                                        {name}
                                        <button 
                                            type="button" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAmenityToggle(name);
                                            }}
                                            className="text-blue-400 hover:text-blue-600"
                                        >
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* MEDIA SECTION */}
                        <div className="dk-rt-section">
                            <div className="dk-rt-section-title">
                                <Layers size={14} />
                                Room Gallery
                            </div>
                            <div className="dk-rt-media-grid">
                                {formData.images.map((url: string, idx: number) => (
                                    <div key={idx} className="dk-rt-media-item">
                                        <img src={url} alt="room" />
                                        <button 
                                            type="button" 
                                            className="dk-rt-media-remove"
                                            onClick={() => removeExistingImage(url)}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                {localFiles.map((file, idx) => (
                                    <div key={idx} className="dk-rt-media-item" style={{opacity: 0.6}}>
                                        <img src={URL.createObjectURL(file)} alt="upload" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <UploadCloud size={20} className="text-blue-500 animate-pulse" />
                                        </div>
                                        <button 
                                            type="button" 
                                            className="dk-rt-media-remove"
                                            onClick={() => removeLocalFile(idx)}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                                <label className="dk-rt-upload-trigger">
                                    <Plus size={24} />
                                    <span className="text-[10px] font-black mt-1">UPLOAD</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                                </label>
                            </div>
                            {uploadError && <p className="text-xs text-red-500 font-bold mt-2">{uploadError}</p>}
                        </div>
                    </form>
                </div>

                {formError && (
                    <div className="dk-rt-form-error">
                        <Info size={16} />
                        <span>{formError}</span>
                    </div>
                )}

                <div className="dk-rt-modal-footer">
                    <button 
                        type="button" 
                        className="dk-rt-btn-secondary" 
                        onClick={onClose}
                        disabled={isSaving || uploading}
                    >
                        Discard Changes
                    </button>
                    <button 
                        form="room-type-form"
                        type="submit" 
                        className="dk-rt-btn-primary"
                        disabled={isSaving || uploading}
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Uploading Media...
                            </>
                        ) : (
                            isSaving ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Saving...
                                </>
                            ) : 'Finalize Room Category'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}