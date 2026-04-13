import { useState, useEffect } from 'react';
import { transportApi } from '../../api/transport.web.api';
import type { DriverRegistrationPayload } from '../../api/transport.web.api';
import './DriverTransportPage.css';

export function DriverTransportPage() {
    const [vendors, setVendors] = useState<{ id: string, companyName: string }[]>([]);
    const [formData, setFormData] = useState<DriverRegistrationPayload>({
        firstName: '',
        lastName: '',
        phone: '',
        licenseNumber: '',
        managedById: '',
        
        driverType: 'passenger',

        vehicleBrand: '',
        vehicleModel: '',
        vehicleColor: '',
        vehiclePlateNumber: '',
        
        // Passenger Defaults
        vehicleSeats: 4,
        vehicleCategory: 'Economy',
        
        // Cargo Defaults
        maxWeightKg: 0,
        maxVolumeM3: 0,
        cargoType: 'Box'
    });
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [existingProfile, setExistingProfile] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            try {
                // Check for existing profile
                const profileRes = await transportApi.getDriverProfile() as any;
                if (profileRes?.success && profileRes?.data) {
                    setExistingProfile(profileRes.data);
                }

                // Load vendors for the form
                const vendorRes = await transportApi.getTransportVendors() as any;
                if (vendorRes?.success) setVendors(vendorRes.data);
                else setVendors(vendorRes as any);
            } catch (err) {
                console.error("Failed to load initial data", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const payload = { ...formData };
            
            // Explicitly cast numbers and remove forbidden fields based on type
            if (payload.driverType === 'cargo') {
                delete payload.vehicleSeats;
                delete payload.vehicleCategory;
                // Use Number only if it exists, else 0
                payload.maxWeightKg = payload.maxWeightKg ? Number(payload.maxWeightKg) : 0;
                payload.maxVolumeM3 = payload.maxVolumeM3 ? Number(payload.maxVolumeM3) : 0;
            } else {
                delete payload.maxWeightKg;
                delete payload.maxVolumeM3;
                delete payload.cargoType;
                payload.vehicleSeats = payload.vehicleSeats ? Number(payload.vehicleSeats) : 0;
            }

            await transportApi.registerDriver(payload);
            setSuccess(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="driver-registration-container">
                <div className="loading-spinner flex-align-center justify-center p-20">
                    <span className="spinner"></span>
                </div>
            </div>
        );
    }

    if (existingProfile || success) {
        const status = existingProfile?.status || 'Pending';
        return (
            <div className="driver-registration-container">
                <div className="status-message-card glassmorphism p-10 text-center">
                    <div className={`status-icon mb-4 ${status.toLowerCase()}`}>
                        {status === 'Approved' ? '✅' : status === 'Pending' ? '⏳' : '❌'}
                    </div>
                    <h2>{status === 'Approved' ? 'Müraciətiniz Təsdiqləndi!' : success ? 'Müraciətiniz qəbul olundu!' : 'Müraciətiniz Gözləmədədir'}</h2>
                    <p className="mb-6">
                        {status === 'Approved' 
                            ? 'Təbriklər! Artıq Sürücü Portalı vasitəsilə sifarişləri qəbul edə bilərsiniz.' 
                            : 'Vendor müraciətinizi yoxladıqdan sonra sizinlə əlaqə saxlayacaq.'}
                    </p>
                    
                    {status === 'Approved' ? (
                        <a href="/driver/dashboard" className="btn-primary inline-block">
                            Driver Portala Keçid
                        </a>
                    ) : (
                        <p className="text-sm text-muted italic">Müraciət ID: {existingProfile?.id || 'Yaradılır...'}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="driver-registration-container">
            <div className="form-wrapper">
                <h1>Sürücü kimi qeydiyyatdan keçin</h1>
                <p>Nəqliyyat şirkətlərindən birinə qoşularaq fəaliyyətə başlayın.</p>

                {error && <div className="error-alert">{error}</div>}

                <form onSubmit={handleSubmit} className="driver-form">
                    <div className="form-group">
                        <label>Fəaliyyət Növü</label>
                        <div className="type-toggle-group" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <label className={`toggle-btn ${formData.driverType === 'passenger' ? 'active' : ''}`} style={{ flex: 1, padding: '10px', textAlign: 'center', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', background: formData.driverType === 'passenger' ? 'var(--primary)' : 'transparent', color: formData.driverType === 'passenger' ? 'white' : 'inherit' }}>
                                <input type="radio" name="driverType" value="passenger" checked={formData.driverType === 'passenger'} onChange={handleChange} style={{ display: 'none' }} />
                                Sərnişin Daşıma
                            </label>
                            <label className={`toggle-btn ${formData.driverType === 'cargo' ? 'active' : ''}`} style={{ flex: 1, padding: '10px', textAlign: 'center', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', background: formData.driverType === 'cargo' ? 'var(--primary)' : 'transparent', color: formData.driverType === 'cargo' ? 'white' : 'inherit' }}>
                                <input type="radio" name="driverType" value="cargo" checked={formData.driverType === 'cargo'} onChange={handleChange} style={{ display: 'none' }} />
                                Yük Daşıma (Cargo)
                            </label>
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="input-group">
                            <label>Adınız</label>
                            <input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Məs: Əli" />
                        </div>
                        <div className="input-group">
                            <label>Soyadınız</label>
                            <input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Məs: Məmmədov" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Telefon</label>
                        <input required name="phone" value={formData.phone} onChange={handleChange} placeholder="+994" />
                    </div>

                    <div className="form-group row">
                        <div className="input-group">
                            <label>Maşının Markası</label>
                            <input required name="vehicleBrand" value={formData.vehicleBrand} onChange={handleChange} placeholder="Məs: Toyota" />
                        </div>
                        <div className="input-group">
                            <label>Maşının Modeli</label>
                            <input required name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="Məs: Prius / Transit" />
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="input-group">
                            <label>Dövlət Nömrə Nişanı</label>
                            <input required name="vehiclePlateNumber" value={formData.vehiclePlateNumber} onChange={handleChange} placeholder="Məs: 99-AA-999" />
                        </div>
                        <div className="input-group">
                            <label>Maşının Rəngi</label>
                            <input required name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} placeholder="Məs: Ağ" />
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="input-group">
                            <label>Vəsiqə Nömrəsi (Sürücülük vəsiqəsi)</label>
                            <input required name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="Məs: 12345678" />
                        </div>
                        <div className="input-group">
                            <label>Şirkət (Vendor) Seçin</label>
                            <select
                                name="managedById"
                                value={formData.managedById}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Vendor Seçin --</option>
                                {vendors.map(v => (
                                    <option key={v.id} value={v.id}>{v.companyName}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {formData.driverType === 'passenger' && (
                        <div className="form-group row">
                            <div className="input-group">
                                <label>Sərnişin Tutumu (Yer sayı)</label>
                                <input
                                    required
                                    type="number"
                                    name="vehicleSeats"
                                    value={formData.vehicleSeats}
                                    onChange={handleChange}
                                    min="1"
                                    max="100"
                                />
                            </div>
                            <div className="input-group">
                                <label>Maşının Kateqoriyası</label>
                                <select
                                    name="vehicleCategory"
                                    value={formData.vehicleCategory}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Economy">Economy</option>
                                    <option value="Business">Business</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Minivan">Minivan</option>
                                    <option value="Bus">Avtobus (Bus)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {formData.driverType === 'cargo' && (
                        <>
                            <div className="form-group row">
                                <div className="input-group">
                                    <label>Yük Götürmə Qabiliyyəti (Kq)</label>
                                    <input
                                        required
                                        type="number"
                                        name="maxWeightKg"
                                        value={formData.maxWeightKg || ''}
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="Məs: 2000"
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Yük Həcmi (m3)</label>
                                    <input
                                        required
                                        type="number"
                                        name="maxVolumeM3"
                                        value={formData.maxVolumeM3 || ''}
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="Məs: 15"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Yük Maşının Tipi</label>
                                <select
                                    name="cargoType"
                                    value={formData.cargoType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Box">Qapalı Kasa (Box)</option>
                                    <option value="Refrigerated">Soyuduculu (Refrigerated)</option>
                                    <option value="Flatbed">Açıq Kasa (Flatbed)</option>
                                    <option value="Liquid">Maye Daşıyan (Liquid)</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button disabled={loading} type="submit" className="btn-primary w-full mt-4">
                        {loading ? 'Göndərilir...' : 'Müraciəti Göndər'}
                    </button>
                </form>
            </div>
        </div>
    );
}
