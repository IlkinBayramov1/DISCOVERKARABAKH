import { useState } from 'react';
import { UserCheck, Search, Eye, Filter } from 'lucide-react';
import { useDrivers, useApproveDriver } from '../hooks/useDrivers';
import type { IDriverProfile } from '../types';
import DriverModal from '../components/DriverModal';
import './VendorTransport.css';

export default function VendorDriverPage() {
    const { data: drivers = [], isLoading } = useDrivers();
    const { mutate: approveDriver, isPending: isApproving } = useApproveDriver();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [selectedDriver, setSelectedDriver] = useState<IDriverProfile | null>(null);

    const handleStatusChange = (id: string, status: string) => {
        approveDriver({ id, status });
        if (selectedDriver?.id === id) {
            setSelectedDriver({ ...selectedDriver, status: status as any });
        }
    };

    // Filter Logic
    const filteredDrivers = drivers.filter(d => {
        const matchesSearch = `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedStatus === 'All' || d.status === selectedStatus;
        return matchesSearch && matchesFilter;
    });

    const pendingCount = drivers.filter(d => d.status === 'Pending').length;

    return (
        <div className="v-transport-page">
            <div className="v-header-glass mb-6 p-6 rounded-2xl flex-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Sürücü Filosu
                    </h1>
                    <p className="text-muted mt-2 text-sm max-w-md">
                        Müəssisənizi təmsil edən sürücülərin statusunu və maşın təyinatlarını buradan idarə edin.
                    </p>
                </div>
                
                {pendingCount > 0 && (
                    <div className="flex-align-center gap-2 bg-amber-50 text-amber-700 px-4 py-3 rounded-lg border border-amber-200 shadow-sm animate-pulse">
                        <UserCheck size={20} />
                        <span className="font-semibold">{pendingCount} Təsdiq Gözləyən Sürücü</span>
                    </div>
                )}
            </div>

            <div className="v-filters flex gap-4 mb-6">
                <div className="search-pill flex-1">
                    <Search size={18} className="text-muted" />
                    <input
                        type="text"
                        placeholder="Sürücü adı və ya nömrəsi axtar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-select">
                    <Filter size={18} className="text-muted absolute left-3" style={{ top: '50%', transform: 'translateY(-50%)' }} />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">Bütün Statuslar</option>
                        <option value="Approved">Aktiv (Approved)</option>
                        <option value="Pending">Gözləyir (Pending)</option>
                        <option value="Rejected">İmtina Etdi (Rejected)</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <div className="modern-spinner"></div>
                </div>
            ) : (
                <div className="v-table-container">
                    <table className="v-table">
                        <thead>
                            <tr>
                                <th>Ad Soyad</th>
                                <th>Əlaqə & Lisenziya</th>
                                <th>Nəqliyyat Vositəsi</th>
                                <th>Status</th>
                                <th>Əməliyyatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDrivers.map(d => (
                                <tr key={d.id} className="v-table-row">
                                    <td>
                                        <div className="font-semibold text-gray-800">{d.firstName} {d.lastName}</div>
                                        <div className="text-xs text-gray-500 mt-1">UUID: {d.id.split('-')[0]}***</div>
                                    </td>
                                    <td>
                                        <div>{d.phone}</div>
                                        <div className="text-xs text-indigo-500 mt-1 uppercase tracking-wider">{d.licenseNumber}</div>
                                    </td>
                                    <td>
                                        {d.currentVehicleId ? (
                                            <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium border border-emerald-100">
                                                Təhkim Olunub
                                            </span>
                                        ) : (
                                            <span className="text-rose-600 bg-rose-50 px-2 py-1 rounded text-xs font-medium border border-rose-100">
                                                Açıqda
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`v-badge status-${d.status.toLowerCase()}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {d.status === 'Pending' && (
                                                <button
                                                    className="v-btn-success flex-align-center gap-1"
                                                    onClick={() => handleStatusChange(d.id, 'Approved')}
                                                    disabled={isApproving}
                                                >
                                                    <UserCheck size={14} /> Təsdiq
                                                </button>
                                            )}
                                            <button
                                                className="v-btn-outline flex-align-center gap-1"
                                                onClick={() => setSelectedDriver(d)}
                                            >
                                                <Eye size={14} /> Detallar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredDrivers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-400">
                                        Məlumat tapılmadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedDriver && (
                <DriverModal
                    driver={selectedDriver}
                    onClose={() => setSelectedDriver(null)}
                    onStatusChange={(status) => handleStatusChange(selectedDriver.id, status)}
                />
            )}
        </div>
    );
}
