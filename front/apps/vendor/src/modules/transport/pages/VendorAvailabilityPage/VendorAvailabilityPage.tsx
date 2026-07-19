import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Activity,
    Car,
    Info,
    X,
    Calendar,
    Clock
} from 'lucide-react';
import './VendorAvailabilityPage.css';
import { httpClient } from '../../../../shared/api/httpClient';
import React from 'react';
import {
    buildAvailability,
    getMonthStatus,
    getCellState,
    getDayTimeline
} from './availabilityEngine';
import type { AvailabilitySlot, SlotState } from './availabilityEngine';

// Local date format helper
const toDateStr = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

// Memoized Month Cell Content Component
const MonthCellContent = React.memo(({ 
    status, 
    slots, 
    vehicleId, 
    dateStr 
}: { 
    status: SlotState; 
    slots: AvailabilitySlot[]; 
    vehicleId: string; 
    dateStr: string; 
}) => {
    const dayStart = new Date(dateStr + 'T00:00:00');
    const dayEnd = new Date(dateStr + 'T23:59:59.999');

    // Get slots overlapping this day to show as tooltip
    const daySlots = useMemo(() => {
        return slots.filter(s => 
            s.vehicleId === vehicleId && 
            s.status !== 'cancelled' && 
            s.status !== 'rejected' &&
            (s.bufferStart < dayEnd && s.bufferEnd > dayStart)
        );
    }, [slots, vehicleId, dateStr]);

    const tooltipText = useMemo(() => {
        if (daySlots.length === 0) return '';
        return daySlots.map(s => {
            const timeStr = s.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
            return `• [${timeStr}] ${s.pickupAddress.split(',')[0]} ➔ ${s.dropoffAddress.split(',')[0]}`;
        }).join('\n');
    }, [daySlots]);

    if (status === 'active') {
        return (
            <div className="status-pill busy" title={tooltipText || 'Booked'}>
                Dolu
            </div>
        );
    }

    if (status === 'buffer') {
        return (
            <div className="status-pill buffer" title={tooltipText || 'Safety Buffer'}>
                Bufer
            </div>
        );
    }

    return (
        <div className="status-pill free">
            Sərbəst
        </div>
    );
});

// Memoized Hour Cell Content Component
const HourCellContent = React.memo(({ 
    cell 
}: { 
    cell: { state: SlotState; ride?: AvailabilitySlot }; 
}) => {
    if (cell.state === 'active' && cell.ride) {
        const timeStr = cell.ride.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const tooltip = `[Aktiv Transfer - ${timeStr}]\nPNR: ${cell.ride.bookingNumber}\nMüştəri: ${cell.ride.passengerName}\nMarşrut: ${cell.ride.pickupAddress} ➔ ${cell.ride.dropoffAddress}`;
        return (
            <div className="status-pill active-hour" title={tooltip}>
                <span className="cell-time-badge">{timeStr}</span>
            </div>
        );
    }

    if (cell.state === 'buffer' && cell.ride) {
        const timeStr = cell.ride.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        const tooltip = `[Təhlükəsizlik Buferi]\n${timeStr}-dakı transfer üçün sistem tərəfindən bloklanmış zona.`;
        return (
            <div className="status-pill buffer-hour" title={tooltip}>
                Bufer
            </div>
        );
    }

    return (
        <div className="status-pill free-hour">
            Sərbəst
        </div>
    );
});

// Memoized Vehicle Row Component for Performance Optimization
const VehicleRow = React.memo(({
    vehicle,
    viewMode,
    daysInMonth,
    hoursArray,
    selectedDate,
    availabilitySlots,
    onCellClick
}: {
    vehicle: any;
    viewMode: 'month' | 'day';
    daysInMonth: string[];
    hoursArray: number[];
    selectedDate: Date;
    availabilitySlots: AvailabilitySlot[];
    onCellClick: (vehicleId: string, date: Date) => void;
}) => {
    return (
        <tr>
            <td className="sticky-col first-col">
                <div className="matrix-vehicle-info">
                    <div className="vehicle-icon-box">
                        <Car size={18} />
                    </div>
                    <div className="vehicle-details">
                        <span className="v-name">{vehicle.brand} {vehicle.model}</span>
                        <span className="v-plate">{vehicle.plateNumber || 'No Plate'}</span>
                    </div>
                </div>
            </td>
            {viewMode === 'month' ? (
                daysInMonth.map(dateStr => {
                    const status = getMonthStatus(availabilitySlots, vehicle.id, dateStr);
                    const isToday = dateStr === toDateStr(new Date());
                    const cellDate = new Date(dateStr + 'T00:00:00');
                    const d = new Date(dateStr);
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

                    return (
                        <td
                            key={dateStr}
                            className={`matrix-cell cell-month ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}
                            onClick={() => onCellClick(vehicle.id, cellDate)}
                        >
                            <MonthCellContent 
                                status={status} 
                                slots={availabilitySlots} 
                                vehicleId={vehicle.id} 
                                dateStr={dateStr} 
                            />
                        </td>
                    );
                })
            ) : (
                hoursArray.map(hour => {
                    const cellHourDate = new Date(selectedDate);
                    cellHourDate.setHours(hour, 0, 0, 0);
                    const cell = getCellState(availabilitySlots, vehicle.id, cellHourDate);
                    const currentHour = new Date().getHours();
                    const isCurrentHour = toDateStr(selectedDate) === toDateStr(new Date()) && hour === currentHour;

                    return (
                        <td
                            key={hour}
                            className={`matrix-cell cell-hour ${isCurrentHour ? 'today' : ''}`}
                            onClick={() => onCellClick(vehicle.id, cellHourDate)}
                        >
                            <HourCellContent cell={cell} />
                        </td>
                    );
                })
            )}
        </tr>
    );
});

export default function VendorAvailabilityPage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    // New states for hourly view and collapsible drawer
    const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [expandedRides, setExpandedRides] = useState<Record<string, boolean>>({});

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [vRes, rRes] = await Promise.all([
                httpClient<any>('/transport/vehicles'),
                httpClient<any>('/bookings/vendor')
            ]);
            
            setVehicles(Array.isArray(vRes.data) ? vRes.data : []);
            setRides(Array.isArray(rRes.data) ? rRes.data : []);
        } catch (err) {
            console.error('Failed to fetch matrix data:', err);
            setVehicles([]);
            setRides([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Central availability data calculation using Availability Engine
    const availabilitySlots = useMemo(() => {
        return buildAvailability(rides);
    }, [rides]);

    const prevMonth = () => {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(d);
        setSelectedDate(new Date(d));
    };

    const nextMonth = () => {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(d);
        setSelectedDate(new Date(d));
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
    };

    const prevDay = () => {
        const prev = new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000);
        setSelectedDate(prev);
        if (prev.getMonth() !== currentDate.getMonth() || prev.getFullYear() !== currentDate.getFullYear()) {
            setCurrentDate(new Date(prev.getFullYear(), prev.getMonth(), 1));
        }
    };

    const nextDay = () => {
        const next = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
        setSelectedDate(next);
        if (next.getMonth() !== currentDate.getMonth() || next.getFullYear() !== currentDate.getFullYear()) {
            setCurrentDate(new Date(next.getFullYear(), next.getMonth(), 1));
        }
    };

    const goDayToday = () => {
        const today = new Date();
        setSelectedDate(today);
        setCurrentDate(today);
    };

    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const total = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 1; i <= total; i++) {
            days.push(toDateStr(new Date(year, month, i)));
        }
        return days;
    }, [currentDate]);

    const hoursArray = useMemo(() => {
        return Array.from({ length: 24 }, (_, i) => i);
    }, []);

    // Handle opening drawer on clicking a cell
    const handleCellClick = useCallback((vehicleId: string, date: Date) => {
        setSelectedVehicleId(vehicleId);
        setSelectedDate(date);
        setDrawerOpen(true);
    }, []);

    const toggleRideExpand = useCallback((rideId: string) => {
        setExpandedRides(prev => ({
            ...prev,
            [rideId]: !prev[rideId]
        }));
    }, []);

    const selectedVehicle = useMemo(() => {
        return vehicles.find(v => v.id === selectedVehicleId);
    }, [vehicles, selectedVehicleId]);

    // Fetch timeline blocks for selected vehicle and date
    const timelineBlocks = useMemo(() => {
        if (!selectedVehicleId) return [];
        const rawTimeline = getDayTimeline(availabilitySlots, selectedVehicleId, selectedDate);
        
        // Group consecutive hours with identical state and ride details
        const blocks: { startHour: number; endHour: number; state: SlotState; ride?: AvailabilitySlot }[] = [];
        if (rawTimeline.length === 0) return blocks;

        let currentBlock = {
            startHour: rawTimeline[0].hour,
            endHour: rawTimeline[0].hour,
            state: rawTimeline[0].state,
            ride: rawTimeline[0].ride
        };

        for (let i = 1; i < rawTimeline.length; i++) {
            const item = rawTimeline[i];
            const isSameState = item.state === currentBlock.state;
            const isSameRide = item.ride?.id === currentBlock.ride?.id;

            if (isSameState && isSameRide) {
                currentBlock.endHour = item.hour;
            } else {
                blocks.push(currentBlock);
                currentBlock = {
                    startHour: item.hour,
                    endHour: item.hour,
                    state: item.state,
                    ride: item.ride
                };
            }
        }
        blocks.push(currentBlock);
        return blocks;
    }, [availabilitySlots, selectedVehicleId, selectedDate]);

    const monthYearLabel = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    if (loading) {
        return (
            <div className="dk-ts-loading-screen">
                <RefreshCw className="spin-icon" size={48} />
                <p>Establishing Fleet Synchronization...</p>
            </div>
        );
    }

    return (
        <div className="dk-ts-layout">
            <header className="dk-ts-header">
                <div className="header-text">
                    <h1 className="dk-ts-title">Availability Matrix</h1>
                    <p className="dk-ts-subtitle">Centralized fleet management and occupancy oversight.</p>
                </div>
                
                {/* View toggle (Month / Day) */}
                <div className="dk-view-toggle-container">
                    <button 
                        className={`dk-view-toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
                        onClick={() => setViewMode('month')}
                    >
                        <Calendar size={16} />
                        <span>Month View</span>
                    </button>
                    <button 
                        className={`dk-view-toggle-btn ${viewMode === 'day' ? 'active' : ''}`}
                        onClick={() => setViewMode('day')}
                    >
                        <Clock size={16} />
                        <span>Day View</span>
                    </button>
                </div>

                <div className="month-navigator">
                    {viewMode === 'month' ? (
                        <>
                            <button className="nav-btn" onClick={prevMonth} title="Previous Month"><ChevronLeft size={20} /></button>
                            <h2>{monthYearLabel}</h2>
                            <button className="nav-btn" onClick={nextMonth} title="Next Month"><ChevronRight size={20} /></button>
                            <button className="nav-btn today-btn" onClick={goToToday}>Today</button>
                        </>
                    ) : (
                        <>
                            <button className="nav-btn" onClick={prevDay} title="Previous Day"><ChevronLeft size={20} /></button>
                            <h2>{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</h2>
                            <button className="nav-btn" onClick={nextDay} title="Next Day"><ChevronRight size={20} /></button>
                            <button className="nav-btn today-btn" onClick={goDayToday}>Today</button>
                        </>
                    )}
                </div>
            </header>

            <div className="dk-ts-calendar-card">
                <div className="calendar-toolbar">
                    <div className="dk-legend">
                        <div className="legend-item"><span className="dot dot-available"></span> Free</div>
                        <div className="legend-item"><span className="dot dot-full"></span> Active Ride</div>
                        <div className="legend-item"><span className="dot dot-buffer"></span> Safety Buffer</div>
                    </div>
                    <div className="dk-info-box">
                        <Info size={16} />
                        <span>Double-click / Click cells to view hourly details.</span>
                    </div>
                </div>

                <div className="dk-matrix-container">
                    <table className="dk-availability-table">
                        <thead>
                            <tr>
                                <th className="sticky-col first-col">
                                    <div className="fleet-header">
                                        <Activity size={16} />
                                        <span>Fleet / Vehicle</span>
                                    </div>
                                </th>
                                {viewMode === 'month' ? (
                                    daysInMonth.map(date => {
                                        const d = new Date(date);
                                        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                                        const isToday = date === toDateStr(new Date());
                                        
                                        return (
                                            <th key={date} className={`${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}>
                                                <div className="th-day-num">{d.getDate()}</div>
                                                <div className="th-day-name">{d.toLocaleString('en-US', { weekday: 'short' })}</div>
                                            </th>
                                        );
                                    })
                                ) : (
                                    hoursArray.map(hour => (
                                        <th key={hour} className="hour-th">
                                            <div className="th-hour-num">{String(hour).padStart(2, '0')}:00</div>
                                            <div className="th-day-name">{hour < 12 ? 'AM' : 'PM'}</div>
                                        </th>
                                    ))
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={(viewMode === 'month' ? daysInMonth.length : hoursArray.length) + 1} className="empty-fleet-msg">
                                        No vehicles found in your fleet. Add vehicles to see availability.
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map(vehicle => (
                                    <VehicleRow
                                        key={vehicle.id}
                                        vehicle={vehicle}
                                        viewMode={viewMode}
                                        daysInMonth={daysInMonth}
                                        hoursArray={hoursArray}
                                        selectedDate={selectedDate}
                                        availabilitySlots={availabilitySlots}
                                        onCellClick={handleCellClick}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="dk-cal-footer">
                    <div className="footer-stats">
                        <span>Total Assets: <strong>{vehicles.length}</strong></span>
                        <span className="separator">|</span>
                        <span>Active Bookings: <strong>{availabilitySlots.length}</strong></span>
                    </div>
                </footer>
            </div>

            {/* Detailed Timeline Drawer Overlay */}
            {drawerOpen && selectedVehicleId && (
                <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
                    <div className="dk-timeline-drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="drawer-header">
                            <div className="drawer-vehicle-meta">
                                <div className="drawer-car-icon-box">
                                    <Car size={22} />
                                </div>
                                <div>
                                    <h3>{selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : 'Vehicle Details'}</h3>
                                    <span>{selectedVehicle?.plateNumber || 'No Plate'}</span>
                                </div>
                            </div>
                            <button className="close-drawer-btn" onClick={() => setDrawerOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="drawer-date-navigator">
                            <button className="drawer-nav-btn" onClick={prevDay}>
                                <ChevronLeft size={16} />
                            </button>
                            <span className="drawer-date-label">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <button className="drawer-nav-btn" onClick={nextDay}>
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="drawer-timeline-container">
                            {timelineBlocks.length === 0 ? (
                                <div className="empty-timeline">No schedule data available.</div>
                            ) : (
                                <div className="timeline-list">
                                    {timelineBlocks.map((block, idx) => {
                                        if (block.state === 'free') {
                                            return (
                                                <div className="timeline-row free-row" key={idx}>
                                                    <div className="time-marker">
                                                        {String(block.startHour).padStart(2, '0')}:00 - {String(block.endHour + 1).padStart(2, '0')}:00
                                                    </div>
                                                    <div className="timeline-content">
                                                        <div className="free-status-indicator">
                                                            <span className="pulse-indicator-dot"></span>
                                                            <strong>Sərbəst Vaxt</strong>
                                                        </div>
                                                        <p className="free-status-desc">Avtomobil tam sərbəstdir və sifariş qəbul edə bilər.</p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        if (block.state === 'buffer' && block.ride) {
                                            const rideTimeStr = block.ride.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                                            return (
                                                <div className="timeline-row buffer-row" key={idx}>
                                                    <div className="time-marker">
                                                        {String(block.startHour).padStart(2, '0')}:00 - {String(block.endHour + 1).padStart(2, '0')}:00
                                                    </div>
                                                    <div className="timeline-content">
                                                        <div className="buffer-card">
                                                            <div className="buffer-card-header">
                                                                <strong>Sistem Buferi ({rideTimeStr} transferi üçün)</strong>
                                                            </div>
                                                            <p className="buffer-card-desc">TransferBookingStrategy tərəfindən növbəti sifarişlər üçün bağlanmış təhlükəsizlik zonası.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        if (block.state === 'active' && block.ride) {
                                            const isExpanded = expandedRides[block.ride.id] || false;
                                            const formattedRideStart = block.ride.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                                            const formattedRideEnd = block.ride.endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                                            return (
                                                <div className="timeline-row active-row" key={idx}>
                                                    <div className="time-marker">
                                                        {formattedRideStart} - {formattedRideEnd}
                                                    </div>
                                                    <div className="timeline-content">
                                                        <div 
                                                            className={`ride-card ${isExpanded ? 'is-expanded' : ''}`}
                                                            onClick={() => toggleRideExpand(block.ride!.id)}
                                                        >
                                                            <div className="ride-card-header-main">
                                                                <div className="ride-card-route">
                                                                    <strong>{block.ride.pickupAddress.split(',')[0]} ➔ {block.ride.dropoffAddress.split(',')[0]}</strong>
                                                                </div>
                                                                <div className="ride-card-meta-inline">
                                                                    <span className={`status-badge-tag status-${block.ride.status.toLowerCase()}`}>
                                                                        {block.ride.status}
                                                                    </span>
                                                                    <span className="expand-chevron">
                                                                        {isExpanded ? 'Gizlə ▲' : 'Ətraflı ▼'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            {isExpanded && (
                                                                <div className="ride-card-details" onClick={(e) => e.stopPropagation()}>
                                                                    <hr className="details-divider" />
                                                                    <div className="details-grid">
                                                                        <div className="detail-item">
                                                                            <span className="detail-label">Sifariş №:</span>
                                                                            <span className="detail-val">{block.ride.bookingNumber}</span>
                                                                        </div>
                                                                        <div className="detail-item">
                                                                            <span className="detail-label">Müştəri:</span>
                                                                            <span className="detail-val">{block.ride.passengerName}</span>
                                                                        </div>
                                                                        <div className="detail-item">
                                                                            <span className="detail-label">Telefon:</span>
                                                                            <span className="detail-val">{block.ride.passengerPhone}</span>
                                                                        </div>
                                                                        <div className="detail-item">
                                                                            <span className="detail-label">Email:</span>
                                                                            <span className="detail-val">{block.ride.passengerEmail}</span>
                                                                        </div>
                                                                        <div className="detail-item full-width">
                                                                            <span className="detail-label">Tam Marşrut:</span>
                                                                            <span className="detail-val">{block.ride.pickupAddress} ➔ {block.ride.dropoffAddress}</span>
                                                                        </div>
                                                                        <div className="detail-item">
                                                                            <span className="detail-label">Sərnişin:</span>
                                                                            <span className="detail-val">{block.ride.paxCount} nəfər</span>
                                                                        </div>
                                                                        <div className="detail-item">
                                                                            <span className="detail-label">Məbləğ:</span>
                                                                            <span className="detail-val highlight-price">{block.ride.price} AZN</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return null;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

