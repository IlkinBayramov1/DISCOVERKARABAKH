import React, { useState, useEffect } from 'react';
import { useHotels } from '../../hooks/useHotels';
import { useRooms } from '../../hooks/useRooms';
import { useCalendar } from '../../hooks/useCalendar';
import { Calendar as CalendarIcon, Edit3, Settings, TrendingUp, RefreshCw } from 'lucide-react';
import './Availability.css';

export default function Availability() {
    const { data: hotels, loading: hotelsLoading } = useHotels(true);

    const [selectedHotelId, setSelectedHotelId] = useState<string>('');

    // When hotels load, auto-select the first one if not already set
    useEffect(() => {
        if (hotels.length > 0 && !selectedHotelId) {
            setSelectedHotelId(hotels[0].id);
        }
    }, [hotels, selectedHotelId]);

    const { rooms } = useRooms(selectedHotelId || undefined);

    const { calendarData, loading, error, fetchCalendar, bulkUpdate } = useCalendar(selectedHotelId);

    const [selectedRoomId, setSelectedRoomId] = useState<string>('');
    const [viewStartDate, setViewStartDate] = useState(() => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    });

    const [viewEndDate, setViewEndDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30); // Default 30 days view
        return d.toISOString().split('T')[0];
    });

    // Bulk Update Form State
    const [updateForm, setUpdateForm] = useState({
        startDate: '',
        endDate: '',
        basePrice: '',
        availableRooms: '',
        minStay: '',
        closedToArrival: false,
        closedToDeparture: false
    });

    useEffect(() => {
        if (selectedHotelId) {
            fetchCalendar(viewStartDate, viewEndDate);
        }
    }, [selectedHotelId, viewStartDate, viewEndDate, fetchCalendar]);

    useEffect(() => {
        if (rooms.length > 0 && !selectedRoomId) {
            setSelectedRoomId(rooms[0].id);
        }
    }, [rooms, selectedRoomId]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setUpdateForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBulkUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRoomId) return alert('Select a room type first');

        const success = await bulkUpdate({
            roomTypeId: selectedRoomId,
            startDate: updateForm.startDate,
            endDate: updateForm.endDate,
            basePrice: updateForm.basePrice ? Number(updateForm.basePrice) : undefined,
            availableRooms: updateForm.availableRooms ? Number(updateForm.availableRooms) : undefined,
            minStay: updateForm.minStay ? Number(updateForm.minStay) : undefined,
            closedToArrival: !!updateForm.closedToArrival,
            closedToDeparture: !!updateForm.closedToDeparture
        });

        if (success) {
            alert('Calendar updated successfully!');
            // Refresh the grid
            fetchCalendar(viewStartDate, viewEndDate);
        }
    };

    if (hotelsLoading) {
        return <div className="dashboard-content"><span className="spinner"></span></div>;
    }

    if (hotels.length === 0) {
        return (
            <div className="dashboard-content">
                <div className="empty-state">
                    <h3>No Properties Found</h3>
                    <p>You need to create a Hotel/Property first before managing availability.</p>
                </div>
            </div>
        );
    }

    const activeRoomCalendar = calendarData.find(c => c.roomTypeId === selectedRoomId);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header split-header">
                <div>
                    <h1><CalendarIcon size={24} className="heading-icon" /> Calendar & Pricing</h1>
                    <p>Adjust nightly rates, manage inventory, and block out dates</p>
                </div>

                <div className="calendar-controls">
                    <div className="input-group-inline">
                        <label>View From:</label>
                        <input type="date" value={viewStartDate} onChange={e => setViewStartDate(e.target.value)} />
                    </div>
                    <div className="input-group-inline">
                        <label>To:</label>
                        <input type="date" value={viewEndDate} onChange={e => setViewEndDate(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="calendar-layout">
                {/* Visual Calendar Grid Area */}
                <div className="calendar-grid-area glassmorphism-card">
                    <div className="grid-header-tools" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <select
                            className="room-selector"
                            value={selectedHotelId}
                            onChange={(e) => {
                                setSelectedHotelId(e.target.value);
                                setSelectedRoomId(''); // Reset room when hotel changes
                            }}
                        >
                            <option value="">-- Switch Property --</option>
                            {hotels.map(h => (
                                <option key={h.id} value={h.id}>🏨 {h.name}</option>
                            ))}
                        </select>
                        <select
                            className="room-selector"
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                            disabled={!selectedHotelId || rooms.length === 0}
                        >
                            <option value="">-- Select Room Type --</option>
                            {rooms.map(r => (
                                <option key={r.id} value={r.id}>{r.name} (Max: {r.totalInventory} units)</option>
                            ))}
                        </select>
                        <button className="btn-secondary outline" onClick={() => fetchCalendar(viewStartDate, viewEndDate)} disabled={!selectedRoomId}>
                            <RefreshCw size={16} /> Sync
                        </button>
                    </div>

                    {loading ? (
                        <div className="empty-state"><span className="spinner"></span></div>
                    ) : error ? (
                        <div className="alert error">{error}</div>
                    ) : !activeRoomCalendar ? (
                        <div className="empty-state">
                            <p>No calendar data available for this room type. Select a room and adjust the dates.</p>
                        </div>
                    ) : (
                        <div className="pricing-grid-container">
                            <table className="pricing-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Price (AZN)</th>
                                        <th>Available</th>
                                        <th>Reserved</th>
                                        <th>Min Stay</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeRoomCalendar.days.map((day, idx) => {
                                        const d = new Date(day.date);
                                        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                                        const isBlocked = day.closedToArrival && day.closedToDeparture;

                                        return (
                                            <tr key={idx} className={`${isWeekend ? 'weekend-row' : ''} ${isBlocked ? 'blocked-row' : ''} ${day.availableRooms <= 0 ? 'soldout-row' : ''}`}>
                                                <td className="date-cell">
                                                    <strong>{d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
                                                    {isBlocked && <span className="badge danger">Blocked</span>}
                                                </td>
                                                <td>
                                                    {day.basePrice !== null ? `₼${day.basePrice}` : <span className="text-muted">Dynamic</span>}
                                                </td>
                                                <td>
                                                    <span className={`inventory-badge ${day.availableRooms > 0 ? 'success' : 'danger'}`}>
                                                        {day.availableRooms}
                                                    </span>
                                                </td>
                                                <td>{day.reservedRooms}</td>
                                                <td>{day.minStay} night(s)</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Bulk Update Sidebar */}
                <div className="calendar-sidebar glassmorphism-card">
                    <div className="card-header">
                        <h3><Edit3 size={18} /> Bulk Update</h3>
                        <p>Apply changes to a date range</p>
                    </div>

                    <form onSubmit={handleBulkUpdate} className="bulk-update-form">
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Start Date</label>
                                <input type="date" required name="startDate" value={updateForm.startDate} onChange={handleFormChange} />
                            </div>
                            <div className="input-group">
                                <label>End Date</label>
                                <input type="date" required name="endDate" value={updateForm.endDate} onChange={handleFormChange} />
                            </div>
                        </div>

                        <hr />

                        <div className="input-group">
                            <label><TrendingUp size={14} /> Nightly Rate (AZN)</label>
                            <input type="number" name="basePrice" placeholder="Leave empty to keep current" value={updateForm.basePrice} onChange={handleFormChange} />
                        </div>

                        <div className="input-group">
                            <label><Settings size={14} /> Inventory to Sell</label>
                            <input type="number" name="availableRooms" placeholder="e.g. 5" value={updateForm.availableRooms} onChange={handleFormChange} />
                            <small>Max physical units: {activeRoomCalendar?.totalInventory || 'N/A'}</small>
                        </div>

                        <div className="input-group">
                            <label>Minimum Stay (Nights)</label>
                            <input type="number" name="minStay" placeholder="e.g. 2" value={updateForm.minStay} onChange={handleFormChange} />
                        </div>

                        <div className="restriction-toggles">
                            <label className="toggle-label">
                                <input type="checkbox" name="closedToArrival" checked={updateForm.closedToArrival} onChange={handleFormChange} />
                                Closed to Arrival (CTA)
                            </label>
                            <label className="toggle-label">
                                <input type="checkbox" name="closedToDeparture" checked={updateForm.closedToDeparture} onChange={handleFormChange} />
                                Closed to Departure (CTD)
                            </label>
                        </div>

                        <button type="submit" className="btn-primary w-100" disabled={loading}>
                            {loading ? 'Applying...' : 'Apply Bulk Changes'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
