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
    Shield
} from 'lucide-react';
import { useUpload } from '../../hooks/useUpload';
import type { IRoomTypePayload, IRoomType } from '../../types';

interface RoomTypeDrawerProps {
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
    { name: '1 King Bed', icon: <BedDouble size={16} /> },
    { name: '2 Twin Beds', icon: <BedDouble size={16} /> },
    { name: 'Luxury Bath', icon: <Info size={16} /> },
    { name: 'Work Desk', icon: <Info size={16} /> }
];

export default function RoomTypeDrawer({ isOpen, onClose, onSave, editingRoom, isSaving }: RoomTypeDrawerProps) {
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
        images: [],
        amenities: []
    });

    const [localFiles, setLocalFiles] = useState<File[]>([]);
    const { uploadImages, uploading, uploadError } = useUpload();

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
            setLocalFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeLocalFile = (idx: number) => {
        setLocalFiles(prev => prev.filter((_, i) => i !== idx));
    };

    const removeExistingImage = (urlToRemove: string) => {
        setFormData({ ...formData, images: formData.images.filter((url: string) => url !== urlToRemove) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="drawer-overlay" onClick={onClose}>
            <div className="drawer-content" onClick={e => e.stopPropagation()}>
                <div className="drawer-header">
                    <h2>{editingRoom ? 'Edit Room Type' : 'New Room Category'}</h2>
                    <button className="btn-close-drawer" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="drawer-body">
                    <form id="room-type-form" onSubmit={handleSubmit}>
                        {/* SECTION: BASICS */}
                        <div className="form-group mb-6">
                            <label className="form-label-premium">
                                Room Identity
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Deluxe Ocean View Suite"
                                className="input-premium font-bold text-lg"
                                required
                            />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the ambiance, view, and unique features..."
                                className="input-premium mt-3 text-sm font-medium"
                                rows={3}
                            />
                        </div>

                        {/* SECTION: CAPACITY & PRICING */}
                        <div className="grid grid-cols-2 gap-5 mb-6">
                            <div className="form-group">
                                <label className="form-label-premium">Base Price (AZN)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                                    <input
                                        type="number"
                                        name="basePrice"
                                        value={formData.basePrice}
                                        onChange={handleChange}
                                        className="input-premium pl-12"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label-premium">Inventory (Units)</label>
                                <div className="relative">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                                    <input
                                        type="number"
                                        name="totalInventory"
                                        value={formData.totalInventory}
                                        onChange={handleChange}
                                        className="input-premium pl-12"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="form-group text-center p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                                <Users size={20} className="mx-auto text-blue-500 mb-2" />
                                <span className="form-label-premium mb-1">Adults</span>
                                <input type="number" name="maxAdults" value={formData.maxAdults} onChange={handleChange} className="w-full bg-transparent text-center font-black text-lg" />
                            </div>
                            <div className="form-group text-center p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                                <Users size={20} className="mx-auto text-blue-500 mb-2" />
                                <span className="form-label-premium mb-1">Children</span>
                                <input type="number" name="maxChildren" value={formData.maxChildren} onChange={handleChange} className="w-full bg-transparent text-center font-black text-lg" />
                            </div>
                            <div className="form-group text-center p-4 bg-slate-50 rounded-[24px] border border-slate-100">
                                <Maximize size={20} className="mx-auto text-blue-500 mb-2" />
                                <span className="form-label-premium mb-1">Size (m²)</span>
                                <input type="number" name="roomSizeM2" value={formData.roomSizeM2} onChange={handleChange} className="w-full bg-transparent text-center font-black text-lg" />
                            </div>
                        </div>

                        {/* SECTION: AMENITIES */}
                        <div className="amenities-section mb-8">
                            <label className="form-label-premium">Room Facilities</label>
                            <div className="amenity-toggle-grid">
                                {COMMON_ROOM_AMENITIES.map(item => (
                                    <div 
                                        key={item.name}
                                        className={`amenity-toggle-card ${formData.amenities.includes(item.name) ? 'active' : ''}`}
                                        onClick={() => handleAmenityToggle(item.name)}
                                    >
                                        <div className="flex justify-between items-center w-full mb-1">
                                            {item.icon}
                                            <div className="amenity-checkbox">
                                                {formData.amenities.includes(item.name) && <Check size={12} strokeWidth={4} />}
                                            </div>
                                        </div>
                                        <span>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SECTION: MEDIA */}
                        <div className="media-section">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Room Gallery</label>
                            
                            <div className="grid grid-cols-4 gap-2 mb-3">
                                {formData.images.map((url: string, idx: number) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                                        <img src={url} alt="room" className="w-full h-full object-cover" />
                                        <button 
                                            type="button" 
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                            onClick={() => removeExistingImage(url)}
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                                {localFiles.map((file, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-blue-400">
                                        <img src={URL.createObjectURL(file)} alt="upload" className="w-full h-full object-cover opacity-50" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <UploadCloud size={16} className="text-blue-500 animate-pulse" />
                                        </div>
                                        <button 
                                            type="button" 
                                            className="absolute top-1 right-1 bg-slate-500 text-white rounded-full p-1"
                                            onClick={() => removeLocalFile(idx)}
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300 cursor-pointer hover:border-blue-400 hover:text-blue-400 transition-all">
                                    <Plus size={20} />
                                    <span className="text-[10px] font-bold mt-1">UPLOAD</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileSelect} />
                                </label>
                            </div>
                            
                            {uploadError && <p className="text-xs text-red-500 font-medium">{uploadError}</p>}
                        </div>
                    </form>
                </div>

                <div className="drawer-footer">
                    <button 
                        type="button" 
                        className="btn-secondary flex-1" 
                        onClick={onClose}
                        disabled={isSaving || uploading}
                    >
                        Cancel
                    </button>
                    <button 
                        form="room-type-form"
                        type="submit" 
                        className="btn-primary flex-1"
                        disabled={isSaving || uploading}
                    >
                        {uploading ? 'Processing Media...' : (isSaving ? 'Saving Room...' : 'Confirm Details')}
                    </button>
                </div>
            </div>
        </div>
    );
}
