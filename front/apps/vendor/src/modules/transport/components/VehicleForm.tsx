import React, { useState, useEffect } from 'react';
import type { IVehicle, ICargoVehicle } from '../types';

interface VehicleFormProps {
    type: 'passenger' | 'cargo';
    vehicle: IVehicle | ICargoVehicle | null;
    onSave: (data: any) => Promise<void>;
    onClose: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ type, vehicle, onSave, onClose }) => {
    const [formData, setFormData] = useState<any>({
        brand: '',
        model: '',
        status: type === 'passenger' ? 'Active' : 'Available',
        // Passenger specific
        plateNumber: '',
        category: 'Economy',
        capacity: 4,
        // Cargo specific
        licensePlate: '',
        type: 'Truck',
        maxWeightKg: 1000,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (vehicle) {
            setFormData({ ...vehicle });
        }
    }, [vehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type: fieldType } = e.target;
        setFormData((prev: any) => ({
            ...prev,
            [name]: fieldType === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Failed to save vehicle', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glassmorphism" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h2>{vehicle ? 'Redaktə et' : 'Yeni Vasitə'}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-row flex gap-4">
                        <div className="form-group flex-1">
                            <label>Marka *</label>
                            <input
                                type="text"
                                name="brand"
                                className="form-input"
                                value={formData.brand}
                                onChange={handleChange}
                                required
                                placeholder="Məs: Toyota"
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>Model *</label>
                            <input
                                type="text"
                                name="model"
                                className="form-input"
                                value={formData.model}
                                onChange={handleChange}
                                required
                                placeholder="Məs: Prius"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>{type === 'passenger' ? 'Nömrə (Plate)' : 'Dövlət Qeydiyyat Nişanı'} *</label>
                        <input
                            type="text"
                            name={type === 'passenger' ? 'plateNumber' : 'licensePlate'}
                            className="form-input"
                            value={type === 'passenger' ? formData.plateNumber : formData.licensePlate}
                            onChange={handleChange}
                            required
                            placeholder="Məs: 99-AA-000"
                        />
                    </div>

                    {type === 'passenger' ? (
                        <div className="form-row flex gap-4">
                            <div className="form-group flex-1">
                                <label>Kateqoriya</label>
                                <select
                                    name="category"
                                    className="form-input"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="Economy">Economy</option>
                                    <option value="Business">Business</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Minivan">Minivan</option>
                                    <option value="Bus">Bus</option>
                                </select>
                            </div>
                            <div className="form-group flex-1">
                                <label>Tutum (Nəfər)</label>
                                <input
                                    type="number"
                                    name="capacity"
                                    className="form-input"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    min={1}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="form-row flex gap-4">
                            <div className="form-group flex-1">
                                <label>Yük Növü</label>
                                <input
                                    type="text"
                                    name="type"
                                    className="form-input"
                                    value={formData.type}
                                    onChange={handleChange}
                                    placeholder="Məs: Soyuduculu"
                                />
                            </div>
                            <div className="form-group flex-1">
                                <label>Maks Çəki (kq)</label>
                                <input
                                    type="number"
                                    name="maxWeightKg"
                                    className="form-input"
                                    value={formData.maxWeightKg}
                                    onChange={handleChange}
                                    min={1}
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="status"
                            className="form-input"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            {type === 'passenger' ? (
                                <>
                                    <option value="Active">Aktiv</option>
                                    <option value="UnderMaintenance">Təmirdə</option>
                                    <option value="Inactive">Deaktiv</option>
                                </>
                            ) : (
                                <>
                                    <option value="Available">Mövcuddur</option>
                                    <option value="OnTrip">Yoldadır</option>
                                    <option value="Maintenance">Təmirdə</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div className="modal-actions flex justify-end gap-3 mt-6">
                        <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                            Ləğv et
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Yadda saxlanılır...' : 'Yadda saxla'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleForm;
