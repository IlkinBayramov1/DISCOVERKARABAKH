import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTours } from '../../hooks/useTours';
import { tourApi } from '../../api/tour.api';
import type { ITourAvailabilityResponse } from '../../types';
import TourBulkUpdateModal from '@/modules/tour/pages/Schedule/TourBulkUpdateModal';
import {
    Calendar as CalendarIcon,
    RefreshCw,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Users,
    Activity,
    Edit3,
    MapPin,
    Info,
    Clock,
    DollarSign
} from 'lucide-react';
import './TourSchedule.css';

export default function TourSchedule() {
    const { data: tours, loading: toursLoading } = useTours();
    const [selectedTourId, setSelectedTourId] = useState<string>('');
    const [calendarData, setCalendarData] = useState<ITourAvailabilityResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBulkOpen, setIsBulkOpen] = useState(false);

    // Current Month State
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (tours && tours.length > 0 && !selectedTourId) {
            setSelectedTourId(tours[0].id);
        }
    }, [tours, selectedTourId]);

    const activeTour = useMemo(() => tours.find(t => t.id === selectedTourId), [tours, selectedTourId]);

    // Get First and Last day of the current selected month
    const { startDate, endDate } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(Date.UTC(year, month, 1));
        const lastDay = new Date(Date.UTC(year, month + 1, 0));
        
        return {
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0]
        };
    }, [currentDate]);

    const fetchSchedule = useCallback(async () => {
        if (!selectedTourId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await tourApi.getMonthlyAvailability(selectedTourId, startDate, endDate);
            setCalendarData(response.data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch schedule');
        } finally {
            setLoading(false);
        }
    }, [selectedTourId, startDate, endDate]);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    // Statistics Calculation
    const stats = useMemo(() => {
        if (!calendarData || calendarData.length === 0) return null;

        let totalBooked = 0;
        let totalCapacity = 0;
        let activeDays = 0;

        calendarData.forEach(day => {
            if (!day.isStopped) {
                totalBooked += day.bookedCount;
                totalCapacity += day.maxSeats;
                activeDays++;
            }
        });

        const utilization = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

        return {
            utilization,
            totalBooked,
            activeDays,
            avgGroupSize: activeDays > 0 ? (totalBooked / activeDays).toFixed(1) : 0
        };
    }, [calendarData]);

    const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    const resetToToday = () => setCurrentDate(new Date());

    const handleBulkUpdate = async (payload: any) => {
        if (!selectedTourId) return false;
        try {
            setLoading(true);
            await tourApi.bulkUpdateAvailability(selectedTourId, payload);
            await fetchSchedule();
            setIsBulkOpen(false);
            return true;
        } catch (err: any) {
            alert(err.message || 'Failed to update schedule');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Calendar Grid Construction
    const calendarGrid = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Convert Sunday (0) to 6 for standard Mon-Sun week, otherwise shift -1
        const startingEmptyCells = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        for (let i = 0; i < startingEmptyCells; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(Date.UTC(year, month, i));
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    }, [currentDate]);

    const monthYearLabel = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    if (toursLoading && tours.length === 0) {
        return (
            <div className="dk-ts-loading-screen">
                <RefreshCw className="spin-icon" size={48} />
                <p>Establishing Secure Connection...</p>
            </div>
        );
    }

    if (!tours || tours.length === 0) {
        return (
            <div className="dk-ts-layout">
                <div className="dk-ts-empty-state">
                    <div className="empty-icon-circle">
                        <AlertCircle size={40} />
                    </div>
                    <h3>No Active Tours</h3>
                    <p>Launch an experience first to begin scheduling operations.</p>
                    <button className="dk-btn-primary mt-6" onClick={() => window.location.href = '/vendor/tours/create'}>
                        Architect Experience
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="dk-ts-layout">
            
            {/* HEADER */}
            <div className="dk-ts-header">
                <div className="header-text">
                    <h1 className="dk-ts-title">
                        Operational Schedule
                    </h1>
                    <p className="dk-ts-subtitle">Synchronized inventory and participant management for your experiences.</p>
                </div>

                <div className="dk-ts-selectors">
                    {activeTour && (
                        <div className="active-tour-meta">
                            <span className="meta-badge"><Clock size={14} /> {activeTour.durationDays}D/{activeTour.durationNights}N</span>
                            <span className={`meta-badge diff-${activeTour.difficulty.toLowerCase()}`}>
                                <Activity size={14} /> {activeTour.difficulty}
                            </span>
                        </div>
                    )}
                    <div className="tour-selector-wrapper">
                        <MapPin size={18} className="sel-icon" />
                        <select value={selectedTourId} onChange={(e) => setSelectedTourId(e.target.value)} className="dk-tour-select">
                            {tours.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
                <div className="dk-alert-error">
                    <AlertCircle size={20} className="error-icon" />
                    <div className="error-content">
                        <h4>Sync Error</h4>
                        <p>{error}</p>
                    </div>
                    <button className="dk-btn-ghost small" onClick={fetchSchedule}>Retry Connection</button>
                </div>
            )}

            {/* KPI STATS */}
            <div className="dk-ts-stats-grid">
                <div className="dk-stat-card">
                    <div className="stat-icon-wrap bg-emerald-50 text-emerald-600"><Activity size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Utilization Rate</span>
                        <span className="stat-value">{stats?.utilization || 0}%</span>
                    </div>
                </div>
                <div className="dk-stat-card">
                    <div className="stat-icon-wrap bg-blue-50 text-blue-600"><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Participants</span>
                        <span className="stat-value">{stats?.totalBooked || 0}</span>
                    </div>
                </div>
                <div className="dk-stat-card">
                    <div className="stat-icon-wrap bg-amber-50 text-amber-600"><CalendarIcon size={20} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Active Deployments</span>
                        <span className="stat-value">{stats?.activeDays || 0} Days</span>
                    </div>
                </div>
            </div>

            {/* CALENDAR INTERFACE */}
            <div className="dk-ts-calendar-card">
                
                <div className="calendar-toolbar">
                    <div className="month-navigator">
                        <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
                        <h2>{monthYearLabel}</h2>
                        <button className="nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
                    </div>
                    <div className="calendar-actions">
                        <button className="dk-btn-secondary" onClick={resetToToday}>Go to Today</button>
                        <button className="dk-btn-primary" onClick={() => setIsBulkOpen(true)}>
                            <Edit3 size={16} /> Bulk Update
                        </button>
                    </div>
                </div>

                <div className="dk-cal-wrapper">
                    <div className="dk-cal-week-header">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span className="weekend">Sat</span><span className="weekend">Sun</span>
                    </div>

                    <div className="dk-cal-grid">
                        {loading && (
                            <div className="dk-cal-loader-overlay">
                                <RefreshCw className="spin-icon" size={40} />
                            </div>
                        )}
                        
                        {calendarGrid.map((dateStr, idx) => {
                            if (!dateStr) return <div key={`empty-${idx}`} className="dk-day-cell empty"></div>;

                            const dayData = calendarData.find(d => d.date === dateStr);
                            const dayNum = parseInt(dateStr.split('-')[2], 10);
                            
                            // Date logic for past/today
                            const cellDateObj = new Date(dateStr);
                            const todayObj = new Date();
                            todayObj.setHours(0, 0, 0, 0);
                            
                            const isToday = dateStr === new Date().toISOString().split('T')[0];
                            const isPast = cellDateObj < todayObj;
                            const isStopped = dayData?.isStopped;

                            // Determine classes
                            let statusClass = 'available';
                            if (!dayData) statusClass = 'off-schedule';
                            else if (isStopped) statusClass = 'stopped';
                            else if (dayData.remainingSeats === 0) statusClass = 'full';
                            else if (dayData.remainingSeats <= 3) statusClass = 'low';

                            return (
                                <div key={dateStr} className={`dk-day-cell ${statusClass} ${isToday ? 'today' : ''} ${isPast && !isToday ? 'past-date' : ''}`}>
                                    
                                    <div className="day-header">
                                        <span className="day-number">{dayNum}</span>
                                        {isStopped && <span className="badge-ss">SS</span>}
                                    </div>
                                    
                                    {dayData ? (
                                        <div className="day-body">
                                            <div className={`data-row ${statusClass}`}>
                                                <Users size={12} />
                                                <span>{dayData.bookedCount}/{dayData.maxSeats} Pax</span>
                                            </div>
                                            <div className="data-row price">
                                                <DollarSign size={12} />
                                                <span>{dayData.price}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="day-body empty-body">
                                            <span className="off-text">No Departure</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* LEGEND / FOOTER */}
                <div className="dk-cal-footer">
                    <div className="dk-legend">
                        <div className="legend-item"><span className="dot dot-available"></span> Open (Available)</div>
                        <div className="legend-item"><span className="dot dot-low"></span> Low Capacity</div>
                        <div className="legend-item"><span className="dot dot-full"></span> Fully Booked</div>
                        <div className="legend-item"><span className="dot dot-stopped"></span> Stop Sell (SS)</div>
                        <div className="legend-item"><span className="dot dot-off"></span> Not Scheduled</div>
                    </div>
                    <div className="dk-info-box">
                        <Info size={16} className="text-blue-500" />
                        <p>Only dates marked as <strong>Open/Available</strong> are visible to adventurers for booking.</p>
                    </div>
                </div>
            </div>

            {/* BULK UPDATE MODAL */}
            <TourBulkUpdateModal 
                isOpen={isBulkOpen}
                onClose={() => setIsBulkOpen(false)}
                tours={tours}
                selectedTourId={selectedTourId}
                onUpdate={handleBulkUpdate}
                loading={loading}
            />
        </div>
    );
}