import { useState, useEffect, useMemo } from 'react';
import { useHotels } from '../../../hooks/useHotels';
import { useRooms } from '../../../hooks/useRooms';
import { useCalendar } from '../../../hooks/useCalendar';
import BulkUpdateModal from '../BulkUpdateModal';
import {
    Calendar as CalendarIcon,
    RefreshCw,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Users,
    Activity,
    Edit3,
    Layers,
    MapPin
} from 'lucide-react';
import './Availability.css';

export default function Availability() {
    const { data: hotels, loading: hotelsLoading } = useHotels(true);
    const [selectedHotelId, setSelectedHotelId] = useState<string>('');
    const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
    const [isBulkOpen, setIsBulkOpen] = useState(false);

    // Current Month State
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (hotels && hotels.length > 0 && !selectedHotelId) {
            setSelectedHotelId(hotels[0].id);
        }
    }, [hotels, selectedHotelId]);

    const { rooms } = useRooms(selectedHotelId || undefined);
    const { calendarData, loading, error, fetchCalendar, bulkUpdate } = useCalendar(selectedHotelId);

    // Get First and Last day of the current selected month
    const { startDate, endDate } = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        // Bir ayın 1-i
        const firstDay = new Date(Date.UTC(year, month, 1));
        // Gələn ayın 1-indən 1 gün çıxırıq ki, bu ayın son gününü tapaq
        const lastDay = new Date(Date.UTC(year, month + 1, 0));
        
        return {
            startDate: firstDay.toISOString().split('T')[0],
            endDate: lastDay.toISOString().split('T')[0]
        };
    }, [currentDate]);

    // Initial Fetch for the month
    useEffect(() => {
        if (selectedHotelId && startDate && endDate) {
            fetchCalendar(startDate, endDate);
        }
    }, [selectedHotelId, startDate, endDate, fetchCalendar]);

    // Statistics Calculation
    const stats = useMemo(() => {
        if (!calendarData || calendarData.length === 0) return null;

        let totalAvailable = 0;
        let totalInventory = 0;
        let lowInventoryDays = 0;
        let avgPrice = 0;
        let priceCount = 0;

        // Eger otaq secilibse ancaq onu hesablasin
        const dataToProcess = selectedRoomId === 'all' 
            ? calendarData 
            : calendarData.filter(r => r.roomTypeId === selectedRoomId);

        dataToProcess.forEach(room => {
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
    }, [calendarData, selectedRoomId]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
    };

    const resetToToday = () => {
        setCurrentDate(new Date());
    };

    const handleBulkUpdate = async (payload: any) => {
        const success = await bulkUpdate(payload);
        if (success) {
            alert('Calendar updated successfully!');
            fetchCalendar(startDate, endDate);
            return true;
        }
        return false;
    };

    // Calendar Generation Logic
    const generateCalendarGrid = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Adjust for Monday start (Optional, but common in Europe/Azerbaijan)
        // 0=Sun, 1=Mon ... 6=Sat. We want 0=Mon, 6=Sun.
        const startingEmptyCells = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        for (let i = 0; i < startingEmptyCells; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            // ISO format qorumaq üçün UTC ilə yığırıq ki vaxt zonası problemi olmasın
            const d = new Date(Date.UTC(year, month, i));
            days.push(d.toISOString().split('T')[0]);
        }
        return days;
    };

    const calendarGrid = useMemo(() => generateCalendarGrid(), [currentDate]);
    const monthYearLabel = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    // Sechilmish otagin datasi (teqvimde gostermek ucun)
    const activeRoomData = useMemo(() => {
        if (!calendarData || calendarData.length === 0) return null;
        if (selectedRoomId === 'all') return calendarData[0]; // Eger "All" secilibse birincini goster
        return calendarData.find(r => r.roomTypeId === selectedRoomId) || calendarData[0];
    }, [calendarData, selectedRoomId]);

    if (hotelsLoading) {
        return (
            <div className="dk-av-loading-screen">
                <RefreshCw className="spin-icon" size={48} />
                <p>Loading Property Data...</p>
            </div>
        );
    }

    if (!hotels || hotels.length === 0) {
        return (
            <div className="dk-av-layout">
                <div className="dk-av-empty-state">
                    <AlertCircle size={48} className="text-slate-400 mb-4" />
                    <h3>No Hotels Found</h3>
                    <p>You must create a property first to manage its inventory.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dk-av-layout">
            
            {/* HEADER & SELECTORS */}
            <div className="dk-av-header">
                <div>
                    <h1 className="dk-av-title">
                        <CalendarIcon size={28} className="text-blue-600" /> Inventory Architecture
                    </h1>
                    <p className="dk-av-subtitle">Real-time room allocation and dynamic rate management</p>
                </div>

                <div className="dk-av-selectors">
                    <div className="selector-group">
                        <MapPin size={16} className="selector-icon" />
                        <select value={selectedHotelId} onChange={(e) => setSelectedHotelId(e.target.value)}>
                            {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                        </select>
                    </div>
                    <div className="selector-group">
                        <Layers size={16} className="selector-icon" />
                        <select value={selectedRoomId} onChange={(e) => setSelectedRoomId(e.target.value)}>
                            <option value="all">View All (Aggregated Stats)</option>
                            {rooms?.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <button className="dk-btn-refresh" onClick={() => fetchCalendar(startDate, endDate)} disabled={loading}>
                        <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            {/* DASHBOARD STATS */}
            <div className="dk-av-stats-grid">
                <div className="dk-av-stat-card">
                    <div className="stat-icon blue"><Activity size={20} /></div>
                    <div className="stat-info">
                        <span className="label">Monthly Yield</span>
                        <span className="value">{stats?.occupancy || 0}%</span>
                    </div>
                </div>
                <div className="dk-av-stat-card">
                    <div className="stat-icon orange"><AlertCircle size={20} /></div>
                    <div className="stat-info">
                        <span className="label">Critical Supply</span>
                        <span className="value">{stats?.lowInventoryDays || 0} Days</span>
                    </div>
                </div>
                <div className="dk-av-stat-card">
                    <div className="stat-icon purple"><DollarSign size={20} /></div>
                    <div className="stat-info">
                        <span className="label">Forecasted ADR</span>
                        <span className="value">₼{stats?.avgPrice || 0}</span>
                    </div>
                </div>
                <div className="dk-av-stat-card">
                    <div className="stat-icon green"><Users size={20} /></div>
                    <div className="stat-info">
                        <span className="label">Revenue Projection</span>
                        <span className="value">₼{stats?.revenueProjection.toLocaleString() || 0}</span>
                    </div>
                </div>
            </div>

            {error && <div className="dk-alert-error mb-6">{error}</div>}

            {/* MONTHLY CALENDAR VIEW */}
            <div className="dk-calendar-card">
                
                {/* Calendar Toolbar */}
                <div className="dk-calendar-toolbar">
                    <div className="month-navigator">
                        <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
                        <h2 className="current-month">{monthYearLabel}</h2>
                        <button className="nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
                    </div>
                    <div className="calendar-actions">
                        <button className="dk-btn-ghost" onClick={resetToToday}>Today</button>
                        <button className="dk-btn-primary" onClick={() => setIsBulkOpen(true)}>
                            <Edit3 size={16} /> Deploy Strategy
                        </button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="dk-calendar-grid">
                    {/* Day Names Header */}
                    <div className="week-days-header">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span className="weekend">Sat</span><span className="weekend">Sun</span>
                    </div>

                    <div className="days-grid relative">
                        {loading && (
                            <div className="calendar-loader-overlay">
                                <RefreshCw size={40} className="spin text-blue-500 mb-2" />
                                <span>Syncing Data...</span>
                            </div>
                        )}

                        {calendarGrid.map((dateStr, idx) => {
                            if (!dateStr) return <div key={`empty-${idx}`} className="day-cell empty"></div>;

                            // Find data for this specific day
                            const dayData = activeRoomData?.days.find(d => d.date === dateStr);
                            const dayNumber = parseInt(dateStr.split('-')[2], 10);
                            
                            // Tarix yoxlamaları
                            const cellDateObj = new Date(dateStr);
                            const todayObj = new Date();
                            todayObj.setHours(0, 0, 0, 0); // Bu günü saat 00:00-a sıfırlayırıq
                            
                            const isToday = dateStr === new Date().toISOString().split('T')[0];
                            const isPast = cellDateObj < todayObj; // Keçmiş tarixdirmi?

                            // Logic for UI
                            const isSS = dayData?.isStopped;
                            const isCTA = dayData?.closedToArrival;
                            const isCTD = dayData?.closedToDeparture;
                            const inv = dayData?.availableRooms ?? 0;
                            const totalInv = activeRoomData?.totalInventory ?? 0;
                            
                            let invStatus = 'normal';
                            if (inv === 0) invStatus = 'sold-out';
                            else if (inv <= 2) invStatus = 'low';

                            return (
                                // Yeni "past-date" klası əlavə edildi
                                <div key={dateStr} className={`day-cell ${isToday ? 'today' : ''} ${isSS ? 'stopped' : ''} ${isPast && !isToday ? 'past-date' : ''}`}>
                                    <div className="day-header">
                                        <span className="day-num">{dayNumber}</span>
                                        {isSS && <span className="badge badge-ss" title="Stop Sell">SS</span>}
                                        {isCTA && <span className="badge badge-cta" title="Closed to Arrival">CTA</span>}
                                        {isCTD && <span className="badge badge-ctd" title="Closed to Departure">CTD</span>}
                                    </div>
                                    
                                    <div className="day-data">
                                        <div className={`data-row inventory ${invStatus}`}>
                                            <Layers size={12} />
                                            <span>{inv}/{totalInv} Available</span>
                                        </div>
                                        <div className="data-row price">
                                            <DollarSign size={12} />
                                            <span>{dayData?.basePrice ? `₼${dayData.basePrice}` : '--'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <BulkUpdateModal
                isOpen={isBulkOpen}
                onClose={() => setIsBulkOpen(false)}
                rooms={rooms || []}
                onUpdate={handleBulkUpdate}
                loading={loading}
            />
        </div>
    );
}