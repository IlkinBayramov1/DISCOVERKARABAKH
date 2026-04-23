import { useState, useEffect } from 'react';
import { transportVendorApi } from '../api/transport.api';
import type { IVehicle, ICargoVehicle } from '../types';
import { Plus, Car, Truck, Edit, Trash2 } from 'lucide-react';
import VehicleForm from '../components/VehicleForm';
import './VendorTransport.css';

export default function VendorFleetPage() {
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [cargoVehicles, setCargoVehicles] = useState<ICargoVehicle[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'passenger' | 'cargo'>('passenger');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

    useEffect(() => {
        loadFleet();
    }, [activeTab]);

    const loadFleet = async () => {
        setLoading(true);
        try {
            if (activeTab === 'passenger') {
                const res = await transportVendorApi.getVehicles() as any;
                if (res.success) setVehicles(res.data);
                else setVehicles(res); // Handle array response
            } else {
                const res = await transportVendorApi.getCargoVehicles() as any;
                if (res.success) setCargoVehicles(res.data);
                else setCargoVehicles(res);
            }
        } catch (error) {
            console.error('Failed to load fleet', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setSelectedVehicle(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (vehicle: any) => {
        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id: string) => {
        if (!window.confirm('Bu vasitəni silmək istədiyinizə əminsiniz?')) return;
        try {
            if (activeTab === 'passenger') {
                await transportVendorApi.deleteVehicle(id);
            } else {
                await transportVendorApi.deleteCargoVehicle(id);
            }
            loadFleet();
        } catch (error) {
            console.error('Delete failed', error);
            alert('Silinmə zamanı xəta baş verdi.');
        }
    };

    const handleSave = async (data: any) => {
        try {
            const id = selectedVehicle?.id || selectedVehicle?._id;
            if (activeTab === 'passenger') {
                if (id) {
                    await transportVendorApi.updateVehicle(id, data);
                } else {
                    await transportVendorApi.createVehicle(data);
                }
            } else {
                if (id) {
                    await transportVendorApi.updateCargoVehicle(id, data);
                } else {
                    await transportVendorApi.createCargoVehicle(data);
                }
            }
            loadFleet();
        } catch (error) {
            console.error('Save failed', error);
            throw error;
        }
    };

    return (
        <div className="vendor-page-container">
            <div className="page-header flex-between">
                <div>
                    <h1>Vasitə Parkı (Fleet)</h1>
                    <p className="text-muted">Nəqliyyat və yük maşınlarınızı idarə edin.</p>
                </div>
                <button
                    className="btn-primary flex-align-center gap-2"
                    onClick={handleAddClick}
                >
                    <Plus size={18} /> Yeni Vasitə
                </button>
            </div>

            <div className="tabs-container my-4">
                <button
                    className={`tab-button ${activeTab === 'passenger' ? 'active' : ''}`}
                    onClick={() => setActiveTab('passenger')}
                >
                    <Car size={16} /> Sərnişin Vasitələri
                </button>
                <button
                    className={`tab-button ${activeTab === 'cargo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cargo')}
                >
                    <Truck size={16} /> Yük Maşınları (Cargo)
                </button>
            </div>

            {loading ? (
                <div className="flex-align-center gap-2">Yüklənir...</div>
            ) : (
                <div className="table-wrapper box-shadow bg-white rounded-lg">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Marka/Model</th>
                                <th>Nömrə</th>
                                {activeTab === 'passenger' ? (
                                    <>
                                        <th>Kateqoriya</th>
                                        <th>Tutum</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Növ</th>
                                        <th>Maks Çəki (kq)</th>
                                    </>
                                )}
                                <th>Status</th>
                                <th>Əməliyyatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeTab === 'passenger' ? (
                                vehicles.map(v => (
                                    <tr key={v.id || (v as any)._id}>
                                        <td>{v.brand} {v.model}</td>
                                        <td><strong>{v.plateNumber}</strong></td>
                                        <td>{v.category}</td>
                                        <td>{v.seats} nəfər</td>
                                        <td><span className={`status-badge active`}>{v.status}</span></td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn-icon-text" onClick={() => handleEditClick(v)}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="btn-icon-text text-danger" onClick={() => handleDeleteClick(v.id || (v as any)._id)}>
                                                    <Trash2 size={16} color="red" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                cargoVehicles.map(c => (
                                    <tr key={c.id || (c as any)._id}>
                                        <td>{c.brand} {c.model}</td>
                                        <td><strong>{c.licensePlate}</strong></td>
                                        <td>{c.type}</td>
                                        <td>{c.maxWeightKg} kq</td>
                                        <td><span className={`status-badge active`}>{c.status}</span></td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn-icon-text" onClick={() => handleEditClick(c)}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="btn-icon-text text-danger" onClick={() => handleDeleteClick(c.id || (c as any)._id)}>
                                                    <Trash2 size={16} color="red" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {((activeTab === 'passenger' && vehicles.length === 0) || (activeTab === 'cargo' && cargoVehicles.length === 0)) && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-muted">Heç bir vasitə tapılmadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <VehicleForm
                    type={activeTab}
                    vehicle={selectedVehicle}
                    onSave={handleSave}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
