import { useState, useEffect } from 'react';
import { transportVendorApi } from '../api/transport.api';
import type { IDriverProfile } from '../types';
import { UserCheck, Search, Eye } from 'lucide-react';
import DriverModal from '../components/DriverModal';
import './VendorTransport.css';

export default function VendorDriverPage() {
    const [drivers, setDrivers] = useState<IDriverProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'passenger' | 'cargo'>('passenger');
    const [selectedDriver, setSelectedDriver] = useState<IDriverProfile | null>(null);

    useEffect(() => {
        loadDrivers();
    }, []);

    const loadDrivers = async () => {
        setLoading(true);
        try {
            const res = await transportVendorApi.getDrivers() as any;
            if (res.success) setDrivers(res.data);
            else if (Array.isArray(res)) setDrivers(res);
        } catch (error) {
            console.error('Failed to load drivers', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            await transportVendorApi.approveDriver(id, status);
            loadDrivers();
            if (selectedDriver && selectedDriver.id === id) {
                setSelectedDriver(prev => prev ? { ...prev, status: status as any } : null);
            }
        } catch (error) {
            console.error('Failed to change driver status', error);
            alert('Status change failed.');
        }
    };

    const filteredDrivers = drivers.filter(d => {
        const matchesSearch = d.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || d.lastName.toLowerCase().includes(searchTerm.toLowerCase());
        const isCargo = !!d.currentCargoVehicleId;
        const matchesTab = activeTab === 'cargo' ? isCargo : !isCargo;
        return matchesSearch && matchesTab;
    });

    return (
        <div className="vendor-page-container">
            <div className="page-header flex-between mb-6">
                <div>
                    <h1>Sürücü İdarəetməsi (Drivers)</h1>
                    <p className="text-muted">Sizi təmsil edən sürücülərin siyahısı və təsdiqlənməsi.</p>
                </div>
                <div className="flex-align-center gap-3">
                    <div className="search-input-wrapper relative">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" style={{ top: '10px' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '35px' }}
                            placeholder="Sürücü axtar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="tabs-container my-4">
                <button
                    className={`tab-button ${activeTab === 'passenger' ? 'active' : ''}`}
                    onClick={() => setActiveTab('passenger')}
                >
                    <UserCheck size={16} /> Sərnişin Sürücüləri
                </button>
                <button
                    className={`tab-button ${activeTab === 'cargo' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cargo')}
                >
                    <UserCheck size={16} /> Yük Sürücüləri (Cargo)
                </button>
            </div>

            {loading ? (
                <div className="flex-align-center gap-2">
                    <span className="spinner"></span> Yüklənir...
                </div>
            ) : (
                <div className="table-responsive bg-white rounded-lg shadow-sm border border-gray-100">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Ad Soyad</th>
                                <th>Əlaqə</th>
                                <th>Vəsiqə Nömrəsi</th>
                                <th>Status</th>
                                <th>Əməliyyatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDrivers.map(d => (
                                <tr key={d.id}>
                                    <td><strong>{d.firstName} {d.lastName}</strong></td>
                                    <td>{d.phone}</td>
                                    <td>{d.licenseNumber}</td>
                                    <td>
                                        <span className={`status-badge ${d.status.toLowerCase()}`}>{d.status}</span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            {d.status === 'Pending' && (
                                                <button
                                                    className="btn-primary flex-align-center gap-1 text-sm outline"
                                                    onClick={() => handleStatusChange(d.id, 'Approved')}
                                                >
                                                    <UserCheck size={14} /> Təsdiq Et
                                                </button>
                                            )}
                                            <button
                                                className="btn-secondary flex-align-center gap-1 text-sm outline"
                                                onClick={() => setSelectedDriver(d)}
                                            >
                                                <Eye size={14} /> Profil & Təyinat
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredDrivers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-muted">Sürücü tapılmadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedDriver && (
                <DriverModal
                    driver={selectedDriver}
                    onClose={() => {
                        setSelectedDriver(null);
                        loadDrivers(); // Reload in case vehicles were assigned
                    }}
                    onStatusChange={(status) => handleStatusChange(selectedDriver.id, status)}
                />
            )}
        </div>
    );
}
