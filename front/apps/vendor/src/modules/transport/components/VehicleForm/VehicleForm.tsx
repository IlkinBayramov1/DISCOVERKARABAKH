import React, { useState, useEffect } from 'react';
import type { IVehicle, ICargoVehicle } from '../../types';
import { httpClient } from '../../../../shared/api/httpClient';
import { UploadCloud, X, Loader } from 'lucide-react';

import './VehicleForm.css';

interface VehicleFormProps {
    type: 'passenger' | 'cargo';
    vehicle: IVehicle | ICargoVehicle | null;
    onSave: (data: any) => Promise<void>;
    onClose: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ type, vehicle, onSave, onClose }) => {
    // Fill out the required payload based on Joy validation schema
    const [formData, setFormData] = useState<any>({
        brand: '',
        model: '',
        year: 2020,
        color: 'Black',
        status: 'Active',
        // Passenger specific
        plateNumber: '',
        category: 'Economy',
        seats: 4,
        luggage: 2,
        basePrice: 5.0,
        pricePerKm: 1.5,
        images: [],
        description: '',
        // Cargo specific
        licensePlate: '',
        cargoType: 'Truck', 
        maxWeightKg: 1000,
    });

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        if (vehicle) {
            setFormData({ ...vehicle });
        }
    }, [vehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type: fieldType } = e.target;
        
        let finalValue: any = value;
        if (fieldType === 'number') {
            finalValue = Number(value);
        }

        setFormData((prev: any) => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        setUploadingImage(true);
        const uploadData = new FormData();
        Array.from(e.target.files).forEach(file => {
            uploadData.append('images', file);
        });

        try {
            const res = await httpClient<{ success: boolean; urls: string[] }>('/upload', {
                method: 'POST',
                body: uploadData
            });
            if (res.success && res.urls) {
                setFormData((prev: any) => ({
                    ...prev,
                    images: [...(prev.images || []), ...res.urls]
                }));
            }
        } catch (error) {
            console.error('Failed to upload image', error);
            alert('Şəkil yüklənərkən xəta baş verdi.');
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData((prev: any) => ({
            ...prev,
            images: prev.images.filter((_: any, i: number) => i !== indexToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const rawData = { ...formData };
            const cleanPayload: any = {};
            
            // Define strictly allowed fields for Prisma/Backend validation
            const allowedPassenger = ['brand', 'model', 'year', 'color', 'plateNumber', 'category', 'seats', 'luggage', 'basePrice', 'pricePerKm', 'images', 'description', 'status'];
            const allowedCargo = ['brand', 'model', 'year', 'color', 'licensePlate', 'cargoType', 'maxWeightKg', 'images', 'description', 'status'];
            
            const allowedFields = type === 'passenger' ? allowedPassenger : allowedCargo;
            
            allowedFields.forEach(field => {
                if (rawData[field] !== undefined) {
                    cleanPayload[field] = rawData[field];
                }
            });

            // Ensure numeric types are correct
            if (type === 'passenger') {
                cleanPayload.year = Number(cleanPayload.year);
                cleanPayload.seats = Number(cleanPayload.seats);
                cleanPayload.luggage = Number(cleanPayload.luggage);
                cleanPayload.basePrice = Number(cleanPayload.basePrice);
                cleanPayload.pricePerKm = Number(cleanPayload.pricePerKm);
            } else {
                cleanPayload.year = Number(cleanPayload.year);
                cleanPayload.maxWeightKg = Number(cleanPayload.maxWeightKg);
            }

            await onSave(cleanPayload);
            onClose();
        } catch (error: any) {
            console.error('Failed to save vehicle', error);
            alert('Xəta baş verdi: ' + (error.message || 'Məlumat düzgün deyil.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glassmorphism" style={{ maxWidth: '600px' }}>
                <div className="modal-header border-b pb-3 mb-4 border-gray-100">
                    <h2 className="text-xl font-bold">{vehicle ? 'Nəqliyyat Vasitəsini Redaktə Et' : 'Yeni Nəqliyyat Vasitəsi'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form max-h-[70vh] overflow-y-auto pr-2">
                    {/* Ümumi Məlumatlar */}
                    <div className="form-row flex gap-4 mb-4">
                        <div className="form-group flex-1">
                            <label className="text-sm font-semibold mb-1 block">Marka *</label>
                            <input type="text" name="brand" className="form-input" value={formData.brand} onChange={handleChange} required placeholder="Məs: Toyota" />
                        </div>
                        <div className="form-group flex-1">
                            <label className="text-sm font-semibold mb-1 block">Model *</label>
                            <input type="text" name="model" className="form-input" value={formData.model} onChange={handleChange} required placeholder="Məs: Prius" />
                        </div>
                    </div>

                    <div className="form-row flex gap-4 mb-4">
                        <div className="form-group flex-1">
                            <label className="text-sm font-semibold mb-1 block">İl *</label>
                            <input type="number" name="year" className="form-input" value={formData.year} onChange={handleChange} required min="1990" max="2100" />
                        </div>
                        <div className="form-group flex-1">
                            <label className="text-sm font-semibold mb-1 block">Rəng *</label>
                            <input type="text" name="color" className="form-input" value={formData.color} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="text-sm font-semibold mb-1 block">{type === 'passenger' ? 'Nömrə (Plate) *' : 'Dövlət Nişanı *'}</label>
                        <input type="text" name={type === 'passenger' ? 'plateNumber' : 'licensePlate'} className="form-input" value={type === 'passenger' ? formData.plateNumber : formData.licensePlate} onChange={handleChange} required placeholder="Məs: 99-AA-000" />
                    </div>

                    {type === 'passenger' ? (
                        <>
                            <div className="form-row flex gap-4 mb-4">
                                <div className="form-group flex-1">
                                    <label className="text-sm font-semibold mb-1 block">Kateqoriya</label>
                                    <select name="category" className="form-input" value={formData.category} onChange={handleChange}>
                                        <option value="Economy">Economy</option>
                                        <option value="Business">Business</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Minivan">Minivan</option>
                                        <option value="Bus">Bus</option>
                                    </select>
                                </div>
                                <div className="form-group flex-1">
                                    <label className="text-sm font-semibold mb-1 block">Oturacaq (Sərnişin)</label>
                                    <input type="number" name="seats" className="form-input" value={formData.seats} onChange={handleChange} min={1} required />
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label className="text-sm font-semibold mb-1 block">Baqaj Tutumu</label>
                                <input type="number" name="luggage" className="form-input" value={formData.luggage} onChange={handleChange} min={0} required />
                            </div>

                            {/* QİYMƏT SİYASƏTİ EKRANI ÜÇÜN İLKİN QİYMƏTLƏR */}
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
                                <h4 className="font-semibold text-indigo-800 mb-2">Taksi / Transfer Qiymətləri</h4>
                                <div className="form-row flex gap-4">
                                    <div className="form-group flex-1">
                                        <label className="text-sm font-semibold mb-1 block">Oturuş (Baza) Qiymət (AZN)</label>
                                        <input type="number" step="0.1" name="basePrice" className="form-input" value={formData.basePrice} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group flex-1">
                                        <label className="text-sm font-semibold mb-1 block">Kilometr Başı Qiymət (AZN)</label>
                                        <input type="number" step="0.1" name="pricePerKm" className="form-input" value={formData.pricePerKm} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="form-row flex gap-4 mb-4">
                            <div className="form-group flex-1">
                                <label className="text-sm font-semibold mb-1 block">Yük Növü</label>
                                <input type="text" name="cargoType" className="form-input" value={formData.cargoType} onChange={handleChange} />
                            </div>
                            <div className="form-group flex-1">
                                <label className="text-sm font-semibold mb-1 block">Maks Çəki (kq)</label>
                                <input type="number" name="maxWeightKg" className="form-input" value={formData.maxWeightKg} onChange={handleChange} min={1} />
                            </div>
                        </div>
                    )}

                    <div className="form-group mb-4">
                        <label className="text-sm font-semibold mb-1 block">Əlavə Qeydlər / Təsvir (İstəyə bağlı)</label>
                        <textarea 
                            name="description"
                            className="form-input min-h-[80px]" 
                            value={formData.description || ''} 
                            onChange={handleChange} 
                            placeholder="Avtomobilin əlavə xüsusiyyətləri (məs: Uşaq oturacağı var, Wi-Fi var)" 
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="text-sm font-semibold mb-2 block">Avtomobilin Şəkilləri</label>
                        
                        <div className="flex flex-wrap gap-3 mb-3">
                            {formData.images?.map((url: string, idx: number) => (
                                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={url} alt="Vehicle" className="w-full h-full object-cover" />
                                    <div 
                                        className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer"
                                        onClick={() => removeImage(idx)}
                                    >
                                        <X className="text-white" size={20} />
                                    </div>
                                </div>
                            ))}
                            
                            <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors text-indigo-500 relative">
                                {uploadingImage ? (
                                    <Loader className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        <UploadCloud size={24} />
                                        <span className="text-[10px] mt-1 font-medium">Yüklə</span>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    multiple 
                                    accept="image/*" 
                                    onChange={handleFileUpload}
                                    disabled={uploadingImage}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="form-group mb-4">
                        <label className="text-sm font-semibold mb-1 block">Status</label>
                        <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                            <option value="Active">Aktiv</option>
                            <option value="Maintenance">Təmirdə</option>
                            <option value="Inactive">Deaktiv</option>
                        </select>
                    </div>

                    <div className="modal-actions flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button type="button" className="v-btn-outline px-6 py-2" onClick={onClose} disabled={loading}>Ləğv et</button>
                        <button type="submit" className="v-btn-primary px-6 py-2" disabled={loading}>
                            {loading ? 'Yadda saxlanılır...' : 'Təsdiqlə və Saxla'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleForm;
