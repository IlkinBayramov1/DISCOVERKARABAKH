import React, { useState } from 'react';
import { X, UserPlus, Loader } from 'lucide-react';
import { useCreateDriver } from '../../hooks/useDrivers';
import './DriverForm.css';

interface DriverFormProps {
    onClose: () => void;
}

export default function DriverForm({ onClose }: DriverFormProps) {
    const { mutate: createDriver, isPending } = useCreateDriver();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        licenseNumber: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createDriver(formData, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glassmorphism" style={{ maxWidth: '500px' }}>
                <div className="modal-header">
                    <h2>Yeni Sürücü Əlavə Et</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <p className="text-muted mb-4">Sürücüyə dair detallar və tənzimləmələr.</p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label>Ad</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                className="form-input" 
                                value={formData.firstName} 
                                onChange={handleChange} 
                                required 
                                placeholder="ilkin"
                            />
                        </div>
                        <div className="form-group">
                            <label>Soyad</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                className="form-input" 
                                value={formData.lastName} 
                                onChange={handleChange} 
                                required 
                                placeholder="bayramov"
                            />
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="form-input" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            placeholder="driver@example.com"
                        />
                    </div>

                    <div className="form-group mt-4">
                        <label>Şifrə (Driver App girişi üçün)</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-input" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="driver123456"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="form-group">
                            <label>Əlaqə / Telefon</label>
                            <input 
                                type="text" 
                                name="phone" 
                                className="form-input" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                required 
                                placeholder="+994775553355"
                            />
                        </div>
                        <div className="form-group">
                            <label>Vəsiqə (ŞN)</label>
                            <input 
                                type="text" 
                                name="licenseNumber" 
                                className="form-input" 
                                value={formData.licenseNumber} 
                                onChange={handleChange} 
                                required 
                                placeholder="12345679"
                            />
                        </div>
                    </div>

                    <div className="modal-actions mt-6">
                        <button type="button" className="v-btn-outline" onClick={onClose}>Ləğv Et</button>
                        <button type="submit" className="v-btn-primary" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader className="animate-spin" size={18} />
                                    <span>Yaradılır...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus size={18} />
                                    <span>Sürücünü Yarat</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
