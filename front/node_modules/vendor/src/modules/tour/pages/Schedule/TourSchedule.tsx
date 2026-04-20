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
    Clock
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
        const startingEmptyCells = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        for (let i = 0; i < startingEmptyCells; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(Date.UTC(year, month, i));
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    }, [currentDate]);

    const monthYearLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

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
                <div className="dk-av-empty-state">
                    <AlertCircle size={48} className="text-slate-400 mb-4" />
                    <h3>No Active Tours</h3>
                    <p>Launch an experience first to begin scheduling operations.</p>
                    <button className="dk-btn-primary mt-4" onClick={() => window.location.href = '/vendor/tours/create'}>Create Experience</button>
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
                        <CalendarIcon size={32} className="title-icon" /> Operational Schedule
                    </h1>
                    <p className="dk-ts-subtitle">Synchronized inventory and participant management for your experiences</p>
                </div>

                <div className="dk-ts-selectors">
                    {activeTour && (
                        <div className="active-tour-meta glass animate-in">
                            <span className="meta-badge"><Clock size={12} /> {activeTour.durationDays}D/{activeTour.durationNights}N</span>
                            <span className={`meta-badge difficulty ${activeTour.difficulty.toLowerCase()}`}>
                                <Activity size={12} /> {activeTour.difficulty}
                            </span>
                        </div>
                    )}
                    <div className="tour-selector-wrapper">
                        <MapPin size={18} className="sel-icon" />
                        <select value={selectedTourId} onChange={(e) => setSelectedTourId(e.target.value)}>
                            {tours.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
                <div className="dk-ts-error-banner glass animate-in">
                    <AlertCircle size={20} className="text-rose-500" />
                    <p>{error}</p>
                    <button className="retry-btn" onClick={fetchSchedule}>Retry Connection</button>
                </div>
            )}

            {/* KPI STATS */}
            <div className="dk-ts-stats">
                <div className="stat-pill glass">
                    <Activity size={18} className="text-emerald-500" />
                    <div className="stat-content">
                        <span className="s-label">Utilization Rate</span>
                        <span className="s-value">{stats?.utilization}%</span>
                    </div>
                </div>
                <div className="stat-pill glass">
                    <Users size={18} className="text-blue-500" />
                    <div className="stat-content">
                        <span className="s-label">Total Participants</span>
                        <span className="s-value">{stats?.totalBooked}</span>
                    </div>
                </div>
                <div className="stat-pill glass">
                    <CalendarIcon size={18} className="text-amber-500" />
                    <div className="stat-content">
                        <span className="s-label">Active Deployments</span>
                        <span className="s-value">{stats?.activeDays} Days</span>
                    </div>
                </div>
            </div>

            {/* CALENDAR INTERFACE */}
            <div className="dk-ts-calendar-card glass">
                <div className="calendar-toolbar">
                    <div className="month-nav">
                        <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
                        <h2>{monthYearLabel}</h2>
                        <button className="nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
                    </div>
                    <div className="actions">
                        <button className="btn-today" onClick={resetToToday}>Today</button>
                        <button className="btn-bulk" onClick={() => setIsBulkOpen(true)}>
                            <Edit3 size={16} /> Update Schedule
                        </button>
                    </div>
                </div>

                <div className="calendar-grid">
                    <div className="week-header">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span className="weekend">Sat</span><span className="weekend">Sun</span>
                    </div>

                    <div className="days-container">
                        {loading && <div className="loader-overlay"><RefreshCw className="spin" size={32} /></div>}
                        
                        {calendarGrid.map((dateStr, idx) => {
                            if (!dateStr) return <div key={`empty-${idx}`} className="day-box empty"></div>;

                            const dayData = calendarData.find(d => d.date === dateStr);
                            const dayNum = parseInt(dateStr.split('-')[2], 10);
                            const isToday = dateStr === new Date().toISOString().split('T')[0];
                            const isStopped = dayData?.isStopped;

                            let statusClass = '';
                            if (dayData) {
                                if (isStopped) statusClass = 'stopped';
                                else if (dayData.remainingSeats === 0) statusClass = 'full';
                                else if (dayData.remainingSeats <= 3) statusClass = 'low';
                            } else {
                                statusClass = 'off-schedule';
                            }

                            return (
                                <div key={dateStr} className={`day-box ${statusClass} ${isToday ? 'is-today' : ''}`}>
                                    <div className="day-top">
                                        <span className="number">{dayNum}</span>
                                        {isStopped && <span className="ss-badge">SS</span>}
                                    </div>
                                    
                                    {dayData ? (
                                        <div className="day-info">
                                            <div className="info-item participants">
                                                <Users size={12} />
                                                <span>{dayData.bookedCount}/{dayData.maxSeats}</span>
                                            </div>
                                            <div className="info-item price">
                                                <span>₼{dayData.price}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="day-off-label">Off-Schedule</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* LEGEND/TIPS */}
            <div className="ts-footer-info">
                <div className="legend">
                    <div className="leg-item"><span className="puck stopped"></span> Stop Sell (SS)</div>
                    <div className="leg-item"><span className="puck full"></span> Fully Booked</div>
                    <div className="leg-item"><span className="puck low"></span> Critical Supply</div>
                    <div className="leg-item"><span className="puck off"></span> Not in Schedule</div>
                </div>
                <div className="tip-box">
                    <Info size={16} />
                    <p>Only dates marked as <strong>Open</strong> in the schedule are visible to customers for booking.</p>
                </div>
            </div>

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
