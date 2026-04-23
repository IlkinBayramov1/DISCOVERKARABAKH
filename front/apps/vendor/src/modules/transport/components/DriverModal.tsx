import { useState } from 'react';
import { X, CheckCircle, Car } from 'lucide-react';
import { useAssignDriverVehicle } from '../hooks/useDrivers';
import { useVehicles } from '../hooks/useVehicles';
import type { IDriverProfile } from '../types';
import './DriverModal.css';

interface DriverModalProps {
    driver: IDriverProfile;
    onClose: () => void;
    onStatusChange: (status: string) => void;
}

export default function DriverModal({ driver, onClose, onStatusChange }: DriverModalProps) {
    const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles();
    const { mutate: assignVehicle, isPending: isAssigning } = useAssignDriverVehicle();

    const [selectedVehicleId, setSelectedVehicleId] = useState<string>(driver.currentVehicleId || '');

    const handleAssign = () => {
        assignVehicle({
            id: driver.id,
            vehicleId: selectedVehicleId || null
        }, {
            onSuccess: () => {
                onClose(); // Automatically closes after success via callback
            }
        });
    };

    return (
        <div className="v-modal-overlay">
            <div className="v-modal-glassmorphism slide-up-animation">
                <button className="v-modal-close" onClick={onClose}><X size={24} /></button>

                <div className="v-modal-header mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Sürücü Profili</h2>
                    <p className="text-sm text-gray-500 mt-1">Sürücüyə dair detallar və tənzimləmələr.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="v-info-card">
                        <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Ad Soyad</span>
                        <div className="font-semibold text-gray-800">{driver.firstName} {driver.lastName}</div>
                    </div>
                    <div className="v-info-card">
                        <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Əlaqə / Telefon</span>
                        <div className="font-semibold text-gray-800">{driver.phone}</div>
                    </div>
                    <div className="v-info-card">
                        <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Cari Status</span>
                        <span className={`v-badge status-${driver.status.toLowerCase()} mt-1 block w-max`}>{driver.status}</span>
                    </div>
                    <div className="v-info-card">
                        <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Vəsiqə (ŞN)</span>
                        <div className="font-semibold font-mono text-indigo-600">{driver.licenseNumber}</div>
                    </div>
                </div>

                <div className="v-modal-actions mt-4 pt-6 border-t border-gray-100">
                    {driver.status === 'Pending' && (
                        <div className="flex gap-3 mb-6">
                            <button
                                className="v-btn-success w-full flex-align-center justify-center gap-2 py-3"
                                onClick={() => onStatusChange('Approved')}
                            >
                                <CheckCircle size={18} /> İcazə Ver (Onayla)
                            </button>
                            <button
                                className="v-btn-danger w-full flex-align-center justify-center gap-2 py-3"
                                onClick={() => onStatusChange('Rejected')}
                            >
                                <X size={18} /> İmtina Et
                            </button>
                        </div>
                    )}

                    {driver.status === 'Approved' && (
                        <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                            <h3 className="mb-4 font-semibold flex-align-center gap-2 text-indigo-800">
                                <Car size={18} /> Nəqliyyat Təyinatı
                            </h3>
                            
                            {isLoadingVehicles ? (
                                <div className="text-sm text-indigo-500 animate-pulse">Maşın bazası yüklənir...</div>
                            ) : (
                                <div className="v-assignment-form flex flex-col gap-4">
                                    <select
                                        value={selectedVehicleId}
                                        onChange={(e) => setSelectedVehicleId(e.target.value)}
                                        className="v-premium-select w-full"
                                    >
                                        <option value="">-- Maşın seçilməyib / Boşdadır --</option>
                                        {vehicles.map(v => (
                                            <option key={v.id} value={v.id}>
                                                {v.brand} {v.model} • [{v.plateNumber}]
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className={`v-btn-primary w-full py-3 shadow-md ${isAssigning ? 'opacity-70' : ''}`}
                                        onClick={handleAssign}
                                        disabled={isAssigning}
                                    >
                                        {isAssigning ? 'Yadda Saxlanılır...' : 'Təyinatı Təsdiqlə'}
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
