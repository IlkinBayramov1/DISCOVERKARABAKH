import { useState } from 'react';
import { UserCheck, Search, Eye, Filter, Users, UserPlus } from 'lucide-react';
import { useDrivers, useApproveDriver } from '../../hooks/useDrivers';
import type { IDriverProfile } from '../../types';
import DriverModal from '../../components/DriverModal/DriverModal';
import DriverForm from '../../components/DriverForm/DriverForm';
import './VendorDriverPage.css';

export default function VendorDriverPage() {
    const { data: drivers = [], isLoading } = useDrivers();
    const { mutate: approveDriver, isPending: isApproving } = useApproveDriver();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [selectedDriver, setSelectedDriver] = useState<IDriverProfile | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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
        <div className="dk-vendor-page">

            {/* PAGE HEADER */}
            <div className="dk-page-header">
                <div className="header-text">
                    <h1>Sürücü Şəbəkəsi</h1>
                    <p>Sürücülərinizi idarə edin, təsdiqləyin və donanmanıza təyin edin.</p>
                </div>

                <div className="flex gap-4 items-center">
                    {pendingCount > 0 && (
                        <div className="dk-alert-pill pending-pulse">
                            <UserCheck size={18} />
                            <span><strong>{pendingCount}</strong> Təsdiq Gözləyən</span>
                        </div>
                    )}

                    <button 
                        className="v-btn-primary" 
                        style={{ height: 'fit-content' }}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <UserPlus size={18} /> Sürücü Əlavə Et
                    </button>
                </div>
            </div>

            {/* FILTERS BAR */}
            <div className="dk-filters-bar box-shadow">
                <div className="dk-search-box">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by driver name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="dk-filter-select">
                    <Filter size={18} className="filter-icon" />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Approved">Active (Approved)</option>
                        <option value="Pending">Pending Review</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* DATA TABLE */}
            {isLoading ? (
                <div className="dk-loading-state">
                    <div className="spinner"></div>
                    <p>Loading driver list...</p>
                </div>
            ) : (
                <div className="dk-table-card box-shadow">
                    <div className="table-responsive">
                        <table className="dk-data-table">
                            <thead>
                                <tr>
                                    <th>Driver Profile</th>
                                    <th>Contact & License</th>
                                    <th>Vehicle Assignment</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDrivers.map(d => (
                                    <tr key={d.id}>
                                        <td>
                                            <div className="profile-cell">
                                                <div className="avatar-box">
                                                    {d.firstName.charAt(0)}{d.lastName.charAt(0)}
                                                </div>
                                                <div className="profile-info">
                                                    <span className="profile-name">{d.firstName} {d.lastName}</span>
                                                    <span className="profile-id">ID: {d.id.split('-')[0]}***</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contact-cell">
                                                <span className="contact-phone">{d.phone}</span>
                                                <span className="license-tag">{d.licenseNumber}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {d.currentVehicleId ? (
                                                <span className="assignment-pill assigned">Assigned to Vehicle</span>
                                            ) : (
                                                <span className="assignment-pill unassigned">Unassigned</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${(d.status || 'pending').toLowerCase()}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {d.status === 'Pending' && (
                                                    <button
                                                        className="dk-btn-success-small"
                                                        onClick={() => handleStatusChange(d.id, 'Approved')}
                                                        disabled={isApproving}
                                                        title="Approve Driver"
                                                    >
                                                        <UserCheck size={16} /> Approve
                                                    </button>
                                                )}
                                                <button
                                                    className="dk-btn-outline-small"
                                                    onClick={() => setSelectedDriver(d)}
                                                >
                                                    <Eye size={16} /> Details
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredDrivers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="empty-table-row">
                                            <Users size={32} />
                                            <p>No drivers found matching your criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* DRIVER MODALS */}
            {selectedDriver && (
                <DriverModal
                    driver={selectedDriver}
                    onClose={() => setSelectedDriver(null)}
                    onStatusChange={(status) => handleStatusChange(selectedDriver.id, status)}
                />
            )}

            {isCreateModalOpen && (
                <DriverForm 
                    onClose={() => setIsCreateModalOpen(false)} 
                />
            )}
        </div>
    );
}