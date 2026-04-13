import { useState, useEffect } from 'react';
import { X, CheckCircle, Car, Truck } from 'lucide-react';
import { transportVendorApi } from '../api/transport.api';
import type { IDriverProfile, IVehicle, ICargoVehicle } from '../types';
import './DriverModal.css';

interface DriverModalProps {
    driver: IDriverProfile;
    onClose: () => void;
    onStatusChange: (status: string) => void;
}

export default function DriverModal({ driver, onClose, onStatusChange }: DriverModalProps) {
    const [vehicles, setVehicles] = useState<IVehicle[]>([]);
    const [cargoVehicles, setCargoVehicles] = useState<ICargoVehicle[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedVehicleId, setSelectedVehicleId] = useState<string>(driver.currentVehicleId || '');
    const [selectedCargoVehicleId, setSelectedCargoVehicleId] = useState<string>(driver.currentCargoVehicleId || '');
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        if (driver.status === 'Approved') {
            fetchVehicles();
        }
    }, [driver]);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const [vRes, cvRes] = await Promise.all([
                transportVendorApi.getVehicles(),
                transportVendorApi.getCargoVehicles()
            ]);
            setVehicles((vRes as any).data || vRes);
            setCargoVehicles((cvRes as any).data || cvRes);
        } catch (error) {
            console.error('Failed to fetch vehicles', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        setAssigning(true);
        try {
            await transportVendorApi.assignDriverVehicle(
                driver.id,
                selectedVehicleId || undefined,
                selectedCargoVehicleId || undefined
            );
            alert('Vehicle assigned successfully.');
            onClose(); // Reload logic will be in parent
        } catch (error) {
            console.error('Failed to assign vehicle', error);
            alert('Error assigning vehicle.');
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="driver-modal-content glassmorphism-card">
                <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>

                <h2>Driver Profile</h2>
                <div className="driver-details">
                    <p><strong>Name:</strong> {driver.firstName} {driver.lastName}</p>
                    <p><strong>Phone:</strong> {driver.phone}</p>
                    <p><strong>License No:</strong> {driver.licenseNumber}</p>
                    <p>
                        <strong>Status:</strong>
                        <span className={`status-badge ${driver.status.toLowerCase()}`}>{driver.status}</span>
                    </p>
                </div>

                <div className="driver-actions mt-4 border-top pt-4">
                    {driver.status === 'Pending' && (
                        <div className="flex gap-2">
                            <button
                                className="btn-primary w-full flex-align-center justify-center gap-2"
                                onClick={() => onStatusChange('Approved')}
                            >
                                <CheckCircle size={16} /> Approve Driver
                            </button>
                            <button
                                className="btn-secondary w-full flex-align-center justify-center gap-2"
                                style={{ color: 'red', borderColor: 'red' }}
                                onClick={() => onStatusChange('Rejected')}
                            >
                                <X size={16} /> Reject Driver
                            </button>
                        </div>
                    )}

                    {driver.status === 'Approved' && (
                        <div className="vehicle-assignment-section">
                            <h3 className="mb-3">Assign Vehicle</h3>
                            {loading ? (
                                <p>Loading available vehicles...</p>
                            ) : (
                                <div className="assignment-forms">
                                    <div className="input-group mb-3">
                                        <label className="flex-align-center gap-2 mb-2"><Car size={16} /> Passenger Vehicle</label>
                                        <select
                                            value={selectedVehicleId}
                                            onChange={(e) => setSelectedVehicleId(e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="">None</option>
                                            {vehicles.map(v => (
                                                <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plateNumber})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group mb-4">
                                        <label className="flex-align-center gap-2 mb-2"><Truck size={16} /> Cargo Vehicle</label>
                                        <select
                                            value={selectedCargoVehicleId}
                                            onChange={(e) => setSelectedCargoVehicleId(e.target.value)}
                                            className="form-input"
                                        >
                                            <option value="">None</option>
                                            {cargoVehicles.map(v => (
                                                <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.licensePlate})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        className="btn-primary w-full"
                                        onClick={handleAssign}
                                        disabled={assigning || (!selectedVehicleId && !selectedCargoVehicleId)}
                                    >
                                        {assigning ? 'Assigning...' : 'Save Assignment'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
