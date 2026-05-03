import { useState, useEffect } from 'react';
import { transportVendorApi } from '../api/transport.api';
import type { IVehicle, ICargoVehicle } from '../types';
import { Plus, Car, Truck, Edit2, Trash2 } from 'lucide-react';
import VehicleForm from '../components/VehicleForm';
import './VendorFleetPage.css';

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
                else setVehicles(res);
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
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            if (activeTab === 'passenger') {
                await transportVendorApi.deleteVehicle(id);
            } else {
                await transportVendorApi.deleteCargoVehicle(id);
            }
            loadFleet();
        } catch (error) {
            console.error('Delete failed', error);
            alert('Xəta baş verdi. Silinmə uğursuz oldu.');
        }
    };

    const handleSave = async (data: any) => {
        try {
            const id = selectedVehicle?.id || selectedVehicle?._id;
            if (activeTab === 'passenger') {
                if (id) await transportVendorApi.updateVehicle(id, data);
                else await transportVendorApi.createVehicle(data);
            } else {
                if (id) await transportVendorApi.updateCargoVehicle(id, data);
                else await transportVendorApi.createCargoVehicle(data);
            }
            loadFleet();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Save failed', error);
            throw error;
        }
    };

    const isListEmpty = activeTab === 'passenger' ? vehicles.length === 0 : cargoVehicles.length === 0;

    return (
        <div className="dk-vendor-page">

            {/* PAGE HEADER */}
            <div className="dk-page-header">
                <div className="header-text">
                    <h1>Vehicle Fleet</h1>
                    <p>Manage your passenger cars, buses, and cargo trucks.</p>
                </div>
                <button className="dk-btn-primary" onClick={handleAddClick}>
                    <Plus size={18} />
                    <span>Add Vehicle</span>
                </button>
            </div>

            {/* SEGMENTED TABS */}
            <div className="dk-tabs-wrapper">
                <div className="dk-segmented-control">
                    <button
                        className={`segment-btn ${activeTab === 'passenger' ? 'active' : ''}`}
                        onClick={() => setActiveTab('passenger')}
                    >
                        <Car size={18} /> Passenger Fleet
                    </button>
                    <button
                        className={`segment-btn ${activeTab === 'cargo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('cargo')}
                    >
                        <Truck size={18} /> Cargo Fleet
                    </button>
                </div>
            </div>

            {/* CONTENT AREA */}
            {loading ? (
                <div className="dk-loading-state">
                    <div className="spinner"></div>
                    <p>Loading your fleet...</p>
                </div>
            ) : isListEmpty ? (
                <div className="dk-empty-state">
                    <div className="empty-icon-wrapper">
                        {activeTab === 'passenger' ? <Car size={48} /> : <Truck size={48} />}
                    </div>
                    <h2>No {activeTab === 'passenger' ? 'Passenger Vehicles' : 'Cargo Trucks'} Found</h2>
                    <p>You haven't added any vehicles to this category yet. Start building your fleet to accept bookings.</p>
                    <button className="dk-btn-outline mt-4" onClick={handleAddClick}>
                        <Plus size={18} /> Add Your First Vehicle
                    </button>
                </div>
            ) : (
                <div className="dk-table-card box-shadow">
                    <div className="table-responsive">
                        <table className="dk-data-table">
                            <thead>
                                <tr>
                                    <th>Vehicle Details</th>
                                    <th>License Plate</th>
                                    <th>{activeTab === 'passenger' ? 'Category' : 'Type'}</th>
                                    <th>{activeTab === 'passenger' ? 'Capacity' : 'Max Weight'}</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'passenger' ? (
                                    vehicles.map(v => (
                                        <tr key={v.id || (v as any)._id}>
                                            <td>
                                                <div className="vehicle-cell">
                                                    <div className="v-icon-box"><Car size={18} /></div>
                                                    <div className="v-info">
                                                        <span className="v-name">{v.brand} {v.model}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><div className="license-plate">{v.plateNumber}</div></td>
                                            <td><span className="info-pill">{v.category}</span></td>
                                            <td><span className="info-text"><strong>{v.seats}</strong> Seats</span></td>
                                            <td>
                                                <span className={`status-badge ${(v.status || 'active').toLowerCase()}`}>
                                                    {v.status || 'Active'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="icon-action-btn edit" onClick={() => handleEditClick(v)} title="Edit">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="icon-action-btn delete" onClick={() => handleDeleteClick(v.id || (v as any)._id)} title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    cargoVehicles.map(c => (
                                        <tr key={c.id || (c as any)._id}>
                                            <td>
                                                <div className="vehicle-cell">
                                                    <div className="v-icon-box cargo"><Truck size={18} /></div>
                                                    <div className="v-info">
                                                        <span className="v-name">{c.brand} {c.model}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><div className="license-plate">{c.licensePlate}</div></td>
                                            <td><span className="info-pill">{c.type}</span></td>
                                            <td><span className="info-text"><strong>{c.maxWeightKg}</strong> kg</span></td>
                                            <td>
                                                <span className={`status-badge ${(c.status || 'active').toLowerCase()}`}>
                                                    {c.status || 'Active'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="icon-action-btn edit" onClick={() => handleEditClick(c)} title="Edit">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="icon-action-btn delete" onClick={() => handleDeleteClick(c.id || (c as any)._id)} title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL WRAPPER */}
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