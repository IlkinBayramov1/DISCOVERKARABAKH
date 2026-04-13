import { useMemo, useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { 
    CheckCircle, 
    Clock, 
    Search, 
    DollarSign, 
    Users,
    ArrowRight,
    SearchX,
    RefreshCw
} from 'lucide-react';
import { HotelReservationDetails } from './HotelReservationDetails';
import type { IBooking } from '../../types';
import './Reservations.css';

export default function Reservations() {
    const { bookings, loading, error, updateStatus } = useBookings(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [dateRange, setDateRange] = useState<'30days' | 'all'>('30days');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

    // Filter Logic
    const filteredBookings = useMemo(() => {
        let result = [...bookings];

        // Status Filter
        if (filterStatus !== 'all') {
            result = result.filter(b => b.status === filterStatus);
        }

        // Search Filter (Booking # or Email)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(b => 
                b.bookingNumber.toLowerCase().includes(term) || 
                (b.user?.email || '').toLowerCase().includes(term)
            );
        }

        // Date Range Filter (Default 30 days)
        if (dateRange === '30days') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            result = result.filter(b => new Date(b.createdAt) >= thirtyDaysAgo);
        }

        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [bookings, filterStatus, searchTerm, dateRange]);

    // Statistics Calculation
    const stats = useMemo(() => {
        const totalRev = bookings.reduce((acc, b) => b.status !== 'cancelled' ? acc + b.totalPrice : acc, 0);
        const pending = bookings.filter(b => b.status === 'pending' || b.status === 'draft').length;
        const confirmed = bookings.filter(b => b.status === 'confirmed').length;
        
        return {
            totalRevenue: totalRev,
            pendingCount: pending,
            confirmedCount: confirmed,
            totalCount: bookings.length
        };
    }, [bookings]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <span className="status-badge success">Confirmed</span>;
            case 'pending':
            case 'pending_payment':
            case 'draft': return <span className="status-badge warning">Action Needed</span>;
            case 'cancelled': return <span className="status-badge danger">Cancelled</span>;
            case 'completed': return <span className="status-badge info">Checked Out</span>;
            default: return <span className="status-badge neutral">{status}</span>;
        }
    };

    return (
        <div className="reservations-dashboard">
            {/* STATS OVERVIEW */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper rev"><DollarSign size={28} /></div>
                    <div className="stat-details">
                        <span className="stat-label">Projected Revenue</span>
                        <h2 className="stat-value">{stats.totalRevenue.toLocaleString()} {bookings[0]?.currency || 'AZN'}</h2>
                    </div>
                    <div className="stat-trend positive">Live Yield</div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper pending"><Clock size={28} /></div>
                    <div className="stat-details">
                        <span className="stat-label">Pending Approval</span>
                        <h2 className="stat-value">{stats.pendingCount}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper active"><CheckCircle size={28} /></div>
                    <div className="stat-details">
                        <span className="stat-label">Confirmed Stays</span>
                        <h2 className="stat-value">{stats.confirmedCount}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper guests"><Users size={28} /></div>
                    <div className="stat-details">
                        <span className="stat-label">Active Network</span>
                        <h2 className="stat-value">{stats.totalCount}</h2>
                    </div>
                </div>
            </div>

            {/* INTELLIGENCE BAR */}
            <div className="inventory-tools">
                <div className="search-box">
                    <Search size={20} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search Guest ID or Email Address..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <div className="filter-item">
                        <label>Status Intelligence</label>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending Approval</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="filter-item">
                        <label>Timeframe</label>
                        <select value={dateRange} onChange={e => setDateRange(e.target.value as any)}>
                            <option value="30days">Last 30 Days</option>
                            <option value="all">Full History</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <div className="alert-box error mb-6 p-4 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 font-bold">{error}</div>}

            {/* CONTENT */}
            <div className="bookings-list-container">
                {loading && bookings.length === 0 ? (
                    <div className="loading-state centered p-20 glassmorphism-card">
                        <RefreshCw size={48} className="spin text-blue-500 mb-4" />
                        <p className="font-bold text-slate-400">Syncing Reservation Data...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="empty-state centered p-20">
                        <SearchX size={80} className="text-slate-100 mb-6" />
                        <h3 className="text-2xl font-black text-slate-800">No Reservations Found</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mt-2">Adjust your filters or try a different search term to find what you're looking for.</p>
                        {searchTerm && (
                            <button className="btn-secondary mt-6" onClick={() => setSearchTerm('')}>Reset Intelligence Bar</button>
                        )}
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="pms-table">
                            <thead>
                                <tr>
                                    <th>Guest & Identification</th>
                                    <th>Stay Timeline</th>
                                    <th>Capacity</th>
                                    <th>Yield Action</th>
                                    <th>Booking Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(b => {
                                    const firstItem = b.items?.[0];
                                    const checkIn = firstItem?.checkIn ? new Date(firstItem.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A';
                                    const checkOut = firstItem?.checkOut ? new Date(firstItem.checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A';
                                    const guestInitial = b.user?.email?.[0].toUpperCase() || 'G';

                                    return (
                                        <tr key={b.id} onClick={() => setSelectedBooking(b)} className="clickable-row">
                                            <td>
                                                <div className="guest-info-cell">
                                                    <div className="guest-avatar">{guestInitial}</div>
                                                    <div className="guest-meta">
                                                        <span className="booking-ref">#{b.bookingNumber}</span>
                                                        <span className="guest-email">{b.user?.email || 'Guest Protocol'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dates-cell">
                                                    <span className="date-val">{checkIn}</span>
                                                    <ArrowRight size={14} className="text-slate-300" />
                                                    <span className="date-val">{checkOut}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-[13px] font-bold text-slate-600">
                                                    {firstItem?.adults} Adults
                                                    {firstItem?.children ? ` / ${firstItem.children} Child` : ''}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="price-tag">{b.totalPrice.toLocaleString()} {b.currency}</span>
                                            </td>
                                            <td>
                                                {getStatusBadge(b.status)}
                                            </td>
                                            <td className="actions-cell">
                                                <button className="btn-view-details">Review</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* DETAIL DRAWER */}
            {selectedBooking && (
                <div className="drawer-overlay" onClick={() => setSelectedBooking(null)}>
                    <HotelReservationDetails 
                        booking={selectedBooking} 
                        onClose={() => setSelectedBooking(null)}
                        onStatusUpdate={async (id, action) => {
                            const success = await updateStatus(id, action);
                            if (success) {
                                setSelectedBooking(null);
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}
