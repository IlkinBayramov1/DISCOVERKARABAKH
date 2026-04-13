import React, { useState, useEffect, useMemo } from 'react';
import { useHotels } from '../../../hooks/useHotels';
import { useRooms } from '../../../hooks/useRooms';
import { useCalendar } from '../../../hooks/useCalendar';
import BulkUpdateDrawer from '../BulkUpdateDrawer';
import {
    Calendar as CalendarIcon,
    RefreshCw,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Users,
    Activity,
    Lock,
    Edit3,
    Layers
} from 'lucide-react';
import './Availability.css';

export default function Availability() {
    const { data: hotels, loading: hotelsLoading } = useHotels(true);
    const [selectedHotelId, setSelectedHotelId] = useState<string>('');
    const [isBulkOpen, setIsBulkOpen] = useState(false);

    // Default 14-day window
    const [viewStartDate, setViewStartDate] = useState(() => {
        const d = new Date();
        return d.toISOString().split('T')[0];
    });

    const timelineDates = useMemo(() => {
        const dates = [];
        const start = new Date(viewStartDate);
        for (let i = 0; i < 14; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }, [viewStartDate]);

    const viewEndDate = timelineDates[13];

    useEffect(() => {
        if (hotels && hotels.length > 0 && !selectedHotelId) {
            setSelectedHotelId(hotels[0].id);
        }
    }, [hotels, selectedHotelId]);

    const { rooms } = useRooms(selectedHotelId || undefined);
    const { calendarData, loading, error, fetchCalendar, bulkUpdate } = useCalendar(selectedHotelId);

    // Initial Fetch
    useEffect(() => {
        if (selectedHotelId && viewStartDate && viewEndDate) {
            fetchCalendar(viewStartDate, viewEndDate);
        }
    }, [selectedHotelId, viewStartDate, viewEndDate, fetchCalendar]);

    // Statistics Calculation
    const stats = useMemo(() => {
        if (!calendarData || calendarData.length === 0) return null;

        let totalAvailable = 0;
        let totalInventory = 0;
        let lowInventoryDays = 0;
        let avgPrice = 0;
        let priceCount = 0;

        calendarData.forEach(room => {
            room.days.forEach(day => {
                totalAvailable += day.availableRooms;
                totalInventory += room.totalInventory;
                if (day.availableRooms <= 2 && day.availableRooms > 0) lowInventoryDays++;
                if (day.basePrice) {
                    avgPrice += day.basePrice;
                    priceCount++;
                }
            });
        });

        const soldNights = Math.max(0, totalInventory - totalAvailable);
        const occupancy = totalInventory > 0 ? Math.round((soldNights / totalInventory) * 100) : 0;

        return {
            occupancy,
            lowInventoryDays,
            avgPrice: priceCount > 0 ? Math.round(avgPrice / priceCount) : 0,
            revenueProjection: soldNights * (priceCount > 0 ? avgPrice / priceCount : 0)
        };
    }, [calendarData]);

    const handleDateNav = (offset: number) => {
        const d = new Date(viewStartDate);
        d.setDate(d.getDate() + offset);
        setViewStartDate(d.toISOString().split('T')[0]);
    };

    const handleBulkUpdate = async (payload: any) => {
        const success = await bulkUpdate(payload);
        if (success) {
            alert('Calendar updated successfully!');
            fetchCalendar(viewStartDate, viewEndDate);
            return true;
        }
        return false;
    };

    if (hotelsLoading) {
        return (
            <div className="availability-dashboard centered" style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p>Loading Property Data...</p>
            </div>
        );
    }

    if (!hotels || hotels.length === 0) {
        return (
            <div className="availability-dashboard" style={{ padding: '2rem' }}>
                <div className="empty-state glassmorphism-card centered">
                    <AlertCircle size={48} className="empty-icon text-muted" />
                    <h3>No Hotels Found</h3>
                    <p>You must create a property first to manage its inventory.</p>
                    <button className="btn-primary mt-2">Create Property</button>
                </div>
            </div>
        );
    }

    return (
        <div className="availability-dashboard">
            <div className="dashboard-header mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <CalendarIcon size={32} className="text-blue-600" /> Inventory Architecture
                    </h1>
                    <p className="text-slate-400 font-bold mt-1">Real-time room allocation and dynamic rate management</p>
                </div>

                <div className="header-actions flex gap-4">
                    <select
                        className="input-premium !py-3 !px-6 min-w-[200px]"
                        value={selectedHotelId}
                        onChange={(e) => setSelectedHotelId(e.target.value)}
                    >
                        {hotels.map(h => (
                            <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                    </select>
                    <button className="btn-icon-text refresh-btn bg-slate-100 hover:bg-slate-200 p-3 rounded-2xl transition-all" onClick={() => fetchCalendar(viewStartDate, viewEndDate)} disabled={loading}>
                        <RefreshCw size={18} className={loading ? 'spin text-blue-600' : 'text-slate-600'} />
                    </button>
                </div>
            </div>

            {/* DASHBOARD STATS */}
            <div className="availability-stats mb-8">
                <div className="stat-card compact glassmorphism-card border border-white/50">
                    <div className="icon-box blue"><Activity size={20} /></div>
                    <div className="stat-content">
                        <span className="label">Monthly Yield</span>
                        <span className="value">{stats?.occupancy || 0}%</span>
                    </div>
                </div>
                <div className="stat-card compact glassmorphism-card border border-white/50">
                    <div className="icon-box orange"><AlertCircle size={20} /></div>
                    <div className="stat-content">
                        <span className="label">Critical Supply</span>
                        <span className="value">{stats?.lowInventoryDays || 0} Days</span>
                    </div>
                </div>
                <div className="stat-card compact glassmorphism-card border border-white/50">
                    <div className="icon-box purple"><DollarSign size={20} /></div>
                    <div className="stat-content">
                        <span className="label">Forecasted ADR</span>
                        <span className="value">₼{stats?.avgPrice || 0}</span>
                    </div>
                </div>
                <div className="stat-card compact glassmorphism-card border border-white/50">
                    <div className="icon-box green"><Users size={20} /></div>
                    <div className="stat-content">
                        <span className="label">Revenue Projection</span>
                        <span className="value">₼{stats?.revenueProjection.toLocaleString() || 0}</span>
                    </div>
                </div>
            </div>

            {/* ERROR ALERT */}
            {error && <div className="alert-box error mb-6 p-4 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 font-bold">{error}</div>}

            {/* HORIZONTAL PMS MATRIX */}
            <div className="pms-matrix-container glassmorphism-card">
                <div className="matrix-toolbar">
                    <div className="date-navigator">
                        <button className="btn-nav-date hover:bg-slate-200 transition-all" onClick={() => handleDateNav(-7)} title="Prev Week"><ChevronLeft size={18} /></button>
                        <span className="current-range-label font-black text-slate-800">
                            {new Date(viewStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(viewEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <button className="btn-nav-date hover:bg-slate-200 transition-all" onClick={() => handleDateNav(7)} title="Next Week"><ChevronRight size={18} /></button>
                    </div>

                    <div className="view-actions">
                        <button className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-black text-xs uppercase tracking-widest hover:bg-blue-100 transition-all" onClick={() => setViewStartDate(new Date().toISOString().split('T')[0])}>Reset to Today</button>
                    </div>
                </div>

                <div className="matrix-scroll-wrapper">
                    {loading && calendarData.length === 0 ? (
                        <div className="matrix-loader-overlay p-20 text-center">
                            <RefreshCw size={48} className="spin text-blue-500 mx-auto mb-4" />
                            <p className="font-bold text-slate-400">Syncing Matrix Grid...</p>
                        </div>
                    ) : (
                        <div className="pms-grid">
                            {/* GRID HEADER: DATES */}
                            <div className="grid-header-cell sticky-col !bg-slate-50 !border-b-2 !border-slate-200 uppercase tracking-widest text-[10px] items-center flex">Strategy Matrix</div>
                            {timelineDates.map(date => {
                                const d = new Date(date);
                                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                                return (
                                    <div key={date} className={`grid-header-cell date-header ${isWeekend ? 'weekend !bg-blue-50/30' : ''}`}>
                                        <span className="day">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <span className="num">{d.getDate()}</span>
                                    </div>
                                );
                            })}

                            {/* ROOM TYPE ROWS */}
                            {calendarData.map(room => (
                                <React.Fragment key={room.roomTypeId}>
                                    <div className="room-group-header flex items-center gap-2">
                                        <Layers size={14} /> {room.roomTypeName}
                                    </div>

                                    {/* INVENTORY ROW */}
                                    <div className="attr-label-cell"><Activity size={12} className="text-blue-500" /> Inventory</div>
                                    {timelineDates.map(date => {
                                        const dayData = room.days.find(d => d.date === date);
                                        const isLow = (dayData?.availableRooms || 0) <= 2;
                                        const isNone = (dayData?.availableRooms || 0) === 0;
                                        return (
                                            <div key={date} className={`data-cell val-inv ${isNone ? 'empty' : isLow ? 'low' : ''}`}>
                                                {dayData?.availableRooms ?? '0'}
                                            </div>
                                        );
                                    })}

                                    {/* PRICE ROW */}
                                    <div className="attr-label-cell"><DollarSign size={12} className="text-emerald-500" /> Daily Rate</div>
                                    {timelineDates.map(date => {
                                        const dayData = room.days.find(d => d.date === date);
                                        return (
                                            <div key={date} className="data-cell val-price">
                                                {dayData?.basePrice ? `₼${dayData.basePrice}` : '--'}
                                            </div>
                                        );
                                    })}

                                    {/* RESTRICTIONS ROW */}
                                    <div className="attr-label-cell"><Lock size={12} className="text-amber-500" /> Strategy</div>
                                    {timelineDates.map(date => {
                                        const dayData = room.days.find(d => d.date === date);
                                        const isSS = dayData?.isStopped;
                                        const isCTA = dayData?.closedToArrival;
                                        const isCTD = dayData?.closedToDeparture;

                                        return (
                                            <div key={date} className="data-cell">
                                                <div className="flex gap-1">
                                                    {isSS ? <span className="restriction-indicator res-ss" title="Full Stop Sell">STOP</span> : (
                                                        <>
                                                            {isCTA && <span className="restriction-indicator res-cta" title="Closed to Arrival">CTA</span>}
                                                            {isCTD && <span className="restriction-indicator res-ctd" title="Closed to Departure">CTD</span>}
                                                            {!isCTA && !isCTD && <span className="text-slate-300 font-black text-[10px]">ACTIVE</span>}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="mt-8 flex justify-end">
                <button 
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:translate-y-[-2px] transition-all hover:shadow-xl"
                    onClick={() => setIsBulkOpen(true)}
                >
                    <Edit3 size={18} /> Deploy Bulk Strategy
                </button>
            </div>

            <BulkUpdateDrawer
                isOpen={isBulkOpen}
                onClose={() => setIsBulkOpen(false)}
                rooms={rooms || []}
                onUpdate={handleBulkUpdate}
                loading={loading}
            />
        </div>
    );
}
