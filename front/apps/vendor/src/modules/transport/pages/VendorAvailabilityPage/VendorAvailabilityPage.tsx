import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Activity,
    Car,
    Info,
    Clock
} from 'lucide-react';
import './VendorAvailabilityPage.css';
import { httpClient } from '../../../../shared/api/httpClient';

export default function VendorAvailabilityPage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [rides, setRides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [vRes, rRes] = await Promise.all([
                httpClient<any>('/transport/vehicles'),
                httpClient<any>('/bookings/vendor')
            ]);
            
            console.log('Vehicles:', vRes.data);
            console.log('Rides:', rRes.data);

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

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    const toDateStr = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
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

    const isBusy = (vehicleId: string, dateStr: string) => {
        if (!Array.isArray(rides)) return false;
        
        return rides.some(ride => {
            const vId = ride.entityId || ride.vehicleId || ride.vehicle?.id;
            if (vId !== vehicleId) return false;
            if (ride.status === 'cancelled' || ride.status === 'rejected') return false;
            
            const rawDate = ride.checkIn || ride.bookingitem?.[0]?.checkIn || ride.scheduledAt || ride.createdAt;
            if (!rawDate) return false;

            try {
                const dateObj = new Date(rawDate);
                if (isNaN(dateObj.getTime())) return false;
                return toDateStr(dateObj) === dateStr;
            } catch (e) {
                return false;
            }
        });
    };

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
                
                <div className="month-navigator">
                    <button className="nav-btn" onClick={prevMonth} title="Previous Month"><ChevronLeft size={20} /></button>
                    <h2>{monthYearLabel}</h2>
                    <button className="nav-btn" onClick={nextMonth} title="Next Month"><ChevronRight size={20} /></button>
                    <button className="nav-btn today-btn" onClick={goToToday}>Today</button>
                </div>
            </header>

            <div className="dk-ts-calendar-card">
                <div className="calendar-toolbar">
                    <div className="dk-legend">
                        <div className="legend-item"><span className="dot dot-available"></span> Available</div>
                        <div className="legend-item"><span className="dot dot-full"></span> Booked</div>
                    </div>
                    <div className="dk-info-box">
                        <Info size={16} />
                        <span>Synchronized with active transport orders.</span>
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
                                {daysInMonth.map(date => {
                                    const d = new Date(date);
                                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                                    const isToday = date === toDateStr(new Date());
                                    
                                    return (
                                        <th key={date} className={`${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}>
                                            <div className="th-day-num">{d.getDate()}</div>
                                            <div className="th-day-name">{d.toLocaleString('en-US', { weekday: 'short' })}</div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.length === 0 ? (
                                <tr>
                                    <td colSpan={daysInMonth.length + 1} className="empty-fleet-msg">
                                        No vehicles found in your fleet. Add vehicles to see availability.
                                    </td>
                                </tr>
                            ) : (
                                vehicles.map(vehicle => (
                                    <tr key={vehicle.id}>
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
                                        {daysInMonth.map(date => {
                                            const busy = isBusy(vehicle.id, date);
                                            return (
                                                <td key={date} className={`matrix-cell ${busy ? 'is-busy' : 'is-free'}`}>
                                                    {busy ? (
                                                        <div className="status-pill busy">Booked</div>
                                                    ) : (
                                                        <div className="status-pill free">Free</div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <footer className="dk-cal-footer">
                    <div className="footer-stats">
                        <span>Total Assets: <strong>{vehicles.length}</strong></span>
                        <span className="separator">|</span>
                        <span>Active Orders: <strong>{rides.length}</strong></span>
                    </div>
                </footer>
            </div>
        </div>
    );
}
