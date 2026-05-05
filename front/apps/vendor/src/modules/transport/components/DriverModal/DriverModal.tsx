import { useState } from 'react';
import { X, CheckCircle, Car } from 'lucide-react';
import { useAssignDriverVehicle, useDrivers } from '../../hooks/useDrivers';
import { useVehicles } from '../../hooks/useVehicles';
import type { IDriverProfile } from '../../types';
import './DriverModal.css';

interface DriverModalProps {
    driver: IDriverProfile;
    onClose: () => void;
    onStatusChange: (status: string) => void;
}

export default function DriverModal({ driver, onClose, onStatusChange }: DriverModalProps) {
    const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles();
    const { data: allDrivers = [] } = useDrivers();
    const { mutate: assignVehicle, isPending: isAssigning } = useAssignDriverVehicle();

    const [selectedVehicleId, setSelectedVehicleId] = useState<string>(driver.currentVehicleId || '');

    // Find which vehicle IDs are already taken by other drivers
    const takenVehicleIds = (allDrivers || [])
        .filter(d => d.id !== driver.id && d.currentVehicleId)
        .map(d => d.currentVehicleId);

    const handleAssign = () => {
        assignVehicle({
            id: driver.id,
            vehicleId: selectedVehicleId || null
        }, {
            onSuccess: () => {
                onClose(); 
            }
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glassmorphism" style={{ maxWidth: '500px' }}>
                <button className="close-btn" style={{ position: 'absolute', top: '16px', right: '16px' }} onClick={onClose}><X size={20} /></button>

                <div className="modal-header">
                    <h2>Sürücü Profili</h2>
                </div>

                <div className="modal-form">
                    <p className="text-muted mb-4">Sürücüyə dair detallar və tənzimləmələr.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Ad Soyad</span>
                            <div className="font-semibold text-gray-800 text-sm">{driver.firstName} {driver.lastName}</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Əlaqə / Telefon</span>
                            <div className="font-semibold text-gray-800 text-sm">{driver.phone}</div>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Cari Status</span>
                            <span className={`status-badge ${driver.status.toLowerCase()} mt-1 block w-max`}>{driver.status}</span>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">Vəsiqə (ŞN)</span>
                            <div className="font-semibold font-mono text-indigo-600 text-sm">{driver.licenseNumber}</div>
                        </div>
                    </div>

                    {driver.status === 'Pending' && (
                        <div className="flex gap-3 mb-6">
                            <button
                                className="v-btn-primary w-full"
                                style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                                onClick={() => onStatusChange('Approved')}
                            >
                                <CheckCircle size={18} /> İcazə Ver
                            </button>
                            <button
                                className="v-btn-outline w-full"
                                style={{ color: '#ef4444', borderColor: '#fecaca' }}
                                onClick={() => onStatusChange('Rejected')}
                            >
                                <X size={18} /> İmtina Et
                            </button>
                        </div>
                    )}

                    {driver.status === 'Approved' && (
                        <div className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
                            <h3 className="mb-4 font-bold flex items-center gap-2 text-indigo-800 text-sm">
                                <Car size={18} /> Nəqliyyat Təyinatı
                            </h3>
                            
                            {isLoadingVehicles ? (
                                <div className="text-sm text-indigo-500 animate-pulse">Maşın bazası yüklənir...</div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <select
                                        value={selectedVehicleId}
                                        onChange={(e) => setSelectedVehicleId(e.target.value)}
                                        className="form-input w-full"
                                    >
                                        <option value="">-- Maşın seçilməyib / Boşdadır --</option>
                                        {vehicles.map(v => {
                                            const isTaken = takenVehicleIds.includes(v.id);
                                            return (
                                                <option 
                                                    key={v.id} 
                                                    value={v.id}
                                                    style={isTaken ? { color: '#ef4444' } : {}}
                                                >
                                                    {v.brand} {v.model} • [{v.plateNumber}] {isTaken ? '(MƏŞĞULDUR)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>

                                    <button
                                        className="v-btn-primary w-full"
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
