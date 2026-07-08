import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePhysicalRooms } from '../../../hooks/usePhysicalRooms';
import { useRooms } from '../../../hooks/useRooms';
import { useHotels } from '../../../hooks/useHotels';
import { 
    LayoutGrid, 
    Trash2, 
    CheckCircle2, 
    AlertCircle, 
    Clock, 
    ShieldAlert,
    ChevronDown,
    Building2,
    Layers,
    ArrowLeft,
    RefreshCw,
    PlusCircle
} from 'lucide-react';
import './PhysicalRooms.css';
import type { PhysicalRoomStatus } from '../../../types';

export default function PhysicalRooms() {
    const [searchParams] = useSearchParams();
    const hotelId = searchParams.get('hotelId');
    const navigate = useNavigate();

    // Data Hooks
    const { data: hotels } = useHotels();
    const { rooms: roomTypes } = useRooms(hotelId || undefined);
    const { 
        physicalRooms, 
        loading, 
        error,
        fetchPhysicalRooms, 
        bulkAddRooms, 
        addPhysicalRoom, 
        updateRoomStatus, 
        deleteRoom 
    } = usePhysicalRooms(hotelId || undefined);

    // Filter State
    const [filters, setFilters] = useState({
        status: '',
        roomTypeId: '',
        floor: ''
    });

    // Modal State
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isSingleModalOpen, setIsSingleModalOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);
    const [bulkStatusLoading, setBulkStatusLoading] = useState(false);

    // Form State for Bulk
    const [bulkForm, setBulkForm] = useState({
        roomTypeId: '',
        floor: '',
        startNumber: 101,
        endNumber: 110,
        prefix: ''
    });

    // Form State for Single
    const [singleForm, setSingleForm] = useState({
        roomNumber: '',
        floor: '',
        roomTypeId: '',
        status: 'AVAILABLE' as PhysicalRoomStatus,
        housekeepingNote: ''
    });

    useEffect(() => {
        if (hotelId) {
            fetchPhysicalRooms(filters);
        }
    }, [hotelId, fetchPhysicalRooms, filters]);

    const currentHotel = hotels.find(h => h.id === hotelId);

    const handleStatusUpdate = async (roomId: string, status: PhysicalRoomStatus) => {
        const success = await updateRoomStatus(roomId, { status });
        if (success) setSelectedRoomId(null);
    };

    const handleBulkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await bulkAddRooms(bulkForm);
        if (success) {
            setIsBulkModalOpen(false);
        } else {
            alert('Failed to generate rooms. A room with this number might already exist.');
        }
    };

    const handleSingleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await addPhysicalRoom(singleForm);
        if (success) {
            setIsSingleModalOpen(false);
        } else {
            alert('Failed to add room. Please verify room number is unique.');
        }
    };

    const handleDelete = async (roomId: string, num: string) => {
        if (window.confirm(`Permanently delete Room ${num}?`)) {
            await deleteRoom(roomId);
        }
    };

    const handleBulkStatusUpdate = async (status: PhysicalRoomStatus) => {
        if (selectedRoomIds.length === 0) return;
        setBulkStatusLoading(true);
        try {
            // Sequential updates to avoid race conditions and provide feedback
            for (const id of selectedRoomIds) {
                await updateRoomStatus(id, { status });
            }
            setSelectedRoomIds([]);
            fetchPhysicalRooms(filters);
        } finally {
            setBulkStatusLoading(false);
        }
    };

    const toggleRoomSelection = (roomId: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setSelectedRoomIds(prev => 
            prev.includes(roomId) ? prev.filter(id => id !== roomId) : [...prev, roomId]
        );
    };

    const selectAllFromView = () => {
        if (selectedRoomIds.length === physicalRooms.length) {
            setSelectedRoomIds([]);
        } else {
            setSelectedRoomIds(physicalRooms.map(r => r.id));
        }
    };

    const floors = useMemo(() => {
        const uniqueFloors = Array.from(new Set(physicalRooms.map(r => r.floor).filter(Boolean)));
        return uniqueFloors.sort((a, b) => parseInt(a!) - parseInt(b!));
    }, [physicalRooms]);

    const getStatusInfo = (status: PhysicalRoomStatus) => {
        switch (status) {
            case 'AVAILABLE': return { icon: <CheckCircle2 size={16} />, label: 'Clean & Ready', class: 'available' };
            case 'DIRTY': return { icon: <AlertCircle size={16} />, label: 'Needs Cleaning', class: 'dirty' };
            case 'CLEANING': return { icon: <Clock size={16} />, label: 'In Progress', class: 'cleaning' };
            case 'OUT_OF_ORDER': return { icon: <ShieldAlert size={16} />, label: 'Maintenance', class: 'ooo' };
            default: return { icon: null, label: status, class: '' };
        }
    };

    // Grouping rooms for summary
    const stats = useMemo(() => {
        return {
            total: physicalRooms.length,
            available: physicalRooms.filter(r => r.status === 'AVAILABLE').length,
            dirty: physicalRooms.filter(r => r.status === 'DIRTY').length,
            cleaning: physicalRooms.filter(r => r.status === 'CLEANING').length
        };
    }, [physicalRooms]);

    if (!hotelId) {
        return (
            <div className="dashboard-container centered">
                <Building2 size={48} className="text-muted mb-2" />
                <h3>No Property Selected</h3>
                <p>Please select a hotel from the dashboard to manage inventory.</p>
                <button className="btn-primary mt-2" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="room-inventory-container">
            {/* ERROR DISPLAY */}
            {error && (
                <div className="dk-alert-error mb-6 flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* HEADER */}
            <div className="dashboard-header mb-8 overflow-visible">
                <div>
                    <button className="btn-back mb-4" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> Back
                    </button>
                    <h1><LayoutGrid size={32} className="heading-icon" /> Room Inventory</h1>
                    <p className="text-slate-500 font-medium">Real-time management for: <strong>{currentHotel?.name || 'Loading properties...'}</strong></p>
                </div>
                <div className="header-actions">
                    <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-500 transition-all mr-2">
                        <RefreshCw size={24} className={loading ? 'spin' : ''} onClick={() => fetchPhysicalRooms(filters)} />
                    </button>
                    <button className="btn-edit-main !bg-slate-100 !text-slate-600 !border-slate-200" onClick={() => setIsBulkModalOpen(true)}>
                        <Layers size={18} /> Bulk Generate
                    </button>
                    <button className="btn-primary" onClick={() => setIsSingleModalOpen(true)}>
                        <PlusCircle size={20} /> Add New Room
                    </button>
                </div>
            </div>

            {/* QUICK STATS - KPI ROW */}
            <div className="inventory-stats-row">
                <div 
                    className={`stat-card clickable ${filters.status === '' ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, status: '' })}
                >
                    <div className="stat-icon all"><LayoutGrid size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-val">{stats.total}</span>
                        <span className="stat-label">Total Rooms</span>
                    </div>
                </div>
                <div 
                    className={`stat-card clickable ${filters.status === 'AVAILABLE' ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, status: filters.status === 'AVAILABLE' ? '' : 'AVAILABLE' })}
                >
                    <div className="stat-icon clean"><CheckCircle2 size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-val">{stats.available}</span>
                        <span className="stat-label">Clean & Ready</span>
                    </div>
                </div>
                <div 
                    className={`stat-card clickable ${filters.status === 'DIRTY' ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, status: filters.status === 'DIRTY' ? '' : 'DIRTY' })}
                >
                    <div className="stat-icon dirty"><AlertCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-val">{stats.dirty}</span>
                        <span className="stat-label">Need Cleaning</span>
                    </div>
                </div>
                <div 
                    className={`stat-card clickable ${filters.status === 'CLEANING' ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, status: filters.status === 'CLEANING' ? '' : 'CLEANING' })}
                >
                    <div className="stat-icon incharge"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-val">{stats.cleaning}</span>
                        <span className="stat-label">In-Progress</span>
                    </div>
                </div>
            </div>

            {/* FLOOR SELECTOR */}
            {floors.length > 0 && (
                <div className="floor-navigator mb-8">
                    <button 
                        className={`floor-tab ${filters.floor === '' ? 'active' : ''}`}
                        onClick={() => setFilters({...filters, floor: ''})}
                    >
                        All Floors
                    </button>
                    {floors.map(floor => (
                        <button 
                            key={floor}
                            className={`floor-tab ${filters.floor === floor ? 'active' : ''}`}
                            onClick={() => setFilters({...filters, floor: filters.floor === floor ? '' : floor!})}
                        >
                            Floor {floor}
                        </button>
                    ))}
                </div>
            )}

            {/* FILTER TOOLS */}
            <div className="inventory-tools mb-8">
                <div className="filter-group">
                    <div className="filter-item">
                        <label>Housekeeping Status</label>
                        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
                            <option value="">All Statuses</option>
                            <option value="AVAILABLE">Clean / Ready</option>
                            <option value="DIRTY">Dirty / Needs Service</option>
                            <option value="CLEANING">Cleaning In Progress</option>
                            <option value="OUT_OF_ORDER">Maintenance / OOO</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Room Category</label>
                        <select value={filters.roomTypeId} onChange={e => setFilters({...filters, roomTypeId: e.target.value})}>
                            <option value="">All Room Types</option>
                            {roomTypes.map(rt => (
                                <option key={rt.id} value={rt.id}>{rt.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Floor Filter</label>
                        <input 
                            type="text" 
                            placeholder="e.g. 1" 
                            value={filters.floor} 
                            onChange={e => setFilters({...filters, floor: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        className={`btn-select-all ${selectedRoomIds.length > 0 ? 'active' : ''}`}
                        onClick={selectAllFromView}
                    >
                        {selectedRoomIds.length === physicalRooms.length ? 'Deselect All' : 'Select All In View'}
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Auto-Refreshed</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* GRID DISPLAY */}
            {loading && physicalRooms.length === 0 ? (
                <div className="loading-state centered">
                    <RefreshCw className="spin text-blue-500 mb-4" size={48} />
                    <p className="font-bold text-slate-400">Fetching property inventory...</p>
                </div>
            ) : physicalRooms.length === 0 ? (
                <div className="empty-state glassmorphism-card centered">
                    <Building2 size={64} className="text-slate-100 mb-4" />
                    <h3 className="text-xl font-black text-slate-400">No Individual Rooms Found</h3>
                    <p className="text-slate-400 max-w-sm mb-6">Use the bulk generation tool to quickly populate your property inventory based on your room categories.</p>
                    <button className="btn-primary" onClick={() => setIsBulkModalOpen(true)}>Initialize Inventory</button>
                </div>
            ) : (
                <div className="physical-rooms-grid">
                    {physicalRooms.map(room => {
                        const status = getStatusInfo(room.status);
                        const rtName = roomTypes.find(t => t.id === room.roomTypeId)?.name || 'Standard Room';
                        
                        return (
                            <div 
                                key={room.id} 
                                className={`physical-room-card ${status.class} ${selectedRoomId === room.id ? 'active' : ''} ${selectedRoomIds.includes(room.id) ? 'selected' : ''}`}
                                onClick={() => setSelectedRoomId(selectedRoomId === room.id ? null : room.id)}
                            >
                                <div className="room-card-top">
                                    <div className="flex items-center gap-3">
                                        <input 
                                            type="checkbox" 
                                            className="room-checkbox"
                                            checked={selectedRoomIds.includes(room.id)}
                                            onChange={() => toggleRoomSelection(room.id)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <div className="room-number">{room.roomNumber}</div>
                                    </div>
                                    <div className={`status-dot ${status.class}`}></div>
                                </div>
                                
                                <div className="room-card-meta">
                                    <span className="type-badge">{rtName}</span>
                                    {room.floor && <span className="floor-badge">Level {room.floor}</span>}
                                </div>

                                <div className={`status-indicator ${status.class}`}>
                                    {status.icon} <span>{status.label}</span>
                                </div>

                                {room.housekeepingNote && (
                                    <div className="room-note-preview">
                                        {room.housekeepingNote}
                                    </div>
                                )}

                                {selectedRoomId === room.id && (
                                    <div className="room-card-overlay" onClick={e => e.stopPropagation()}>
                                        <div className="quick-actions">
                                            <button 
                                                className="action-btn available" 
                                                onClick={() => handleStatusUpdate(room.id, 'AVAILABLE')}
                                            >
                                                <CheckCircle2 size={16} /> READY
                                            </button>
                                            <button 
                                                className="action-btn dirty" 
                                                onClick={() => handleStatusUpdate(room.id, 'DIRTY')}
                                            >
                                                <AlertCircle size={16} /> DIRTY
                                            </button>
                                            <button 
                                                className="action-btn cleaning" 
                                                onClick={() => handleStatusUpdate(room.id, 'CLEANING')}
                                            >
                                                <Clock size={16} /> CLEAN
                                            </button>
                                            <button 
                                                className="action-btn ooo" 
                                                onClick={() => handleStatusUpdate(room.id, 'OUT_OF_ORDER')}
                                            >
                                                <ShieldAlert size={16} /> OOO
                                            </button>
                                            <button 
                                                className="action-btn delete" 
                                                onClick={() => handleDelete(room.id, room.roomNumber)}
                                            >
                                                <Trash2 size={16} /> REMOVE ROOM
                                            </button>
                                        </div>
                                        <button className="btn-close-overlay mt-4" onClick={() => setSelectedRoomId(null)}>
                                            <ChevronDown size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* BULK GENERATION MODAL */}
            {isBulkModalOpen && (
                <div className="pms-modal-backdrop" onClick={() => setIsBulkModalOpen(false)}>
                    <div className="pms-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Bulk Inventory Generation</h2>
                        </div>
                        <form onSubmit={handleBulkSubmit}>
                            <div className="modal-form-body">
                                <div className="form-group mb-6">
                                    <label className="form-label-premium">Target Room Category</label>
                                    <select 
                                        className="input-premium w-full"
                                        required 
                                        value={bulkForm.roomTypeId} 
                                        onChange={e => setBulkForm({...bulkForm, roomTypeId: e.target.value})}
                                    >
                                        <option value="">-- Select Category --</option>
                                        {roomTypes.map(rt => (
                                            <option key={rt.id} value={rt.id}>{rt.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="form-group">
                                        <label className="form-label-premium">Start ID</label>
                                        <input 
                                            type="number" 
                                            className="input-premium w-full"
                                            required 
                                            value={isNaN(bulkForm.startNumber) ? '' : bulkForm.startNumber} 
                                            onChange={e => {
                                                const val = parseInt(e.target.value);
                                                setBulkForm({...bulkForm, startNumber: isNaN(val) ? 0 : val});
                                            }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-premium">End ID</label>
                                        <input 
                                            type="number" 
                                            className="input-premium w-full"
                                            required 
                                            value={isNaN(bulkForm.endNumber) ? '' : bulkForm.endNumber} 
                                            onChange={e => {
                                                const val = parseInt(e.target.value);
                                                setBulkForm({...bulkForm, endNumber: isNaN(val) ? 0 : val});
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label-premium">Floor / Level</label>
                                        <input 
                                            type="text" 
                                            className="input-premium w-full"
                                            placeholder="e.g. 1" 
                                            value={bulkForm.floor} 
                                            onChange={e => setBulkForm({...bulkForm, floor: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-premium">Prefix</label>
                                        <input 
                                            type="text" 
                                            className="input-premium w-full"
                                            placeholder="e.g. R-" 
                                            value={bulkForm.prefix} 
                                            onChange={e => setBulkForm({...bulkForm, prefix: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions flex justify-end gap-3">
                                <button type="button" className="btn-back" onClick={() => setIsBulkModalOpen(false)}>Dismiss</button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Processing...' : 'Generate Inventory'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* SINGLE ADD MODAL */}
            {isSingleModalOpen && (
                <div className="pms-modal-backdrop" onClick={() => setIsSingleModalOpen(false)}>
                    <div className="pms-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Single Physical Room</h2>
                        </div>
                        <form onSubmit={handleSingleSubmit}>
                            <div className="modal-form-body">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="form-group">
                                        <label className="form-label-premium">Room Number</label>
                                        <input 
                                            type="text" 
                                            className="input-premium w-full"
                                            required 
                                            placeholder="e.g. 101"
                                            value={singleForm.roomNumber} 
                                            onChange={e => setSingleForm({...singleForm, roomNumber: e.target.value})}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-premium">Floor</label>
                                        <input 
                                            type="text" 
                                            className="input-premium w-full"
                                            placeholder="e.g. 1" 
                                            value={singleForm.floor} 
                                            onChange={e => setSingleForm({...singleForm, floor: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="form-group mb-6">
                                    <label className="form-label-premium">Room Type Category</label>
                                    <select 
                                        className="input-premium w-full"
                                        required 
                                        value={singleForm.roomTypeId} 
                                        onChange={e => setSingleForm({...singleForm, roomTypeId: e.target.value})}
                                    >
                                        <option value="">-- Choose Category --</option>
                                        {roomTypes.map(rt => (
                                            <option key={rt.id} value={rt.id}>{rt.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label-premium">Maintenance / Housekeeping Notes</label>
                                    <textarea 
                                        className="input-premium w-full"
                                        rows={3} 
                                        placeholder="Any special instructions for housekeeping team..."
                                        value={singleForm.housekeepingNote}
                                        onChange={e => setSingleForm({...singleForm, housekeepingNote: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions flex justify-end gap-3">
                                <button type="button" className="btn-back" onClick={() => setIsSingleModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Creating...' : 'Confirm Room Addition'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* BULK ACTION BAR */}
            {selectedRoomIds.length > 0 && (
                <div className="bulk-action-bar animate-in slide-in-from-bottom-8">
                    <div className="bar-info flex items-center gap-3">
                        <span className="count-badge">{selectedRoomIds.length}</span>
                        <span className="text-white font-bold">Selected Rooms</span>
                    </div>
                    <div className="bar-actions flex items-center gap-2">
                        <button className="action-pill clean" onClick={() => handleBulkStatusUpdate('AVAILABLE')} disabled={bulkStatusLoading}>
                            {bulkStatusLoading ? <RefreshCw className="spin" size={16} /> : <CheckCircle2 size={16} />} READY
                        </button>
                        <button className="action-pill dirty" onClick={() => handleBulkStatusUpdate('DIRTY')} disabled={bulkStatusLoading}>
                            <AlertCircle size={16} /> DIRTY
                        </button>
                        <button className="action-pill cleaning" onClick={() => handleBulkStatusUpdate('CLEANING')} disabled={bulkStatusLoading}>
                            <Clock size={16} /> CLEAN
                        </button>
                        <button className="action-pill ooo" onClick={() => handleBulkStatusUpdate('OUT_OF_ORDER')} disabled={bulkStatusLoading}>
                            <ShieldAlert size={16} /> OOO
                        </button>
                        <div className="w-[1px] h-6 bg-white/20 mx-2"></div>
                        <button className="btn-close-bar text-white/60 hover:text-white transition-all font-bold px-4" onClick={() => setSelectedRoomIds([])}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
