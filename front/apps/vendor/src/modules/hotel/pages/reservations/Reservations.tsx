import { useMemo, useState, useEffect } from 'react'; // useEffect əlavə edildi
import { useBookings } from '../../hooks/useBookings';
import { 
    CheckCircle, 
    Clock, 
    Search, 
    DollarSign, 
    Users,
    ArrowRight,
    SearchX,
    RefreshCw,
    Filter
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

    useEffect(() => {
        if (selectedBooking) {
            document.body.style.overflow = 'hidden'; // Modal açılanda arxa fon donur
        } else {
            document.body.style.overflow = 'auto'; // Modal bağlananda scroll bərpa olunur
        }
        
        return () => {
            document.body.style.overflow = 'auto'; // Komponent silinəndə təhlükəsizlik üçün
        };
    }, [selectedBooking]);

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
            case 'confirmed': return <span className="dk-res-badge success">Confirmed</span>;
            case 'pending':
            case 'pending_payment':
            case 'draft': return <span className="dk-res-badge warning">Action Needed</span>;
            case 'cancelled': return <span className="dk-res-badge danger">Cancelled</span>;
            case 'completed': return <span className="dk-res-badge info">Checked Out</span>;
            default: return <span className="dk-res-badge neutral">{status}</span>;
        }
    };

    return (
        <div className="dk-res-layout">
            
            {/* HEADER */}
            <header className="dk-res-header">
                <div>
                    <h1 className="dk-res-title">Reservations Hub</h1>
                    <p className="dk-res-subtitle">Manage guest bookings, track revenue, and monitor availability.</p>
                </div>
            </header>

            {/* STATS OVERVIEW */}
            <div className="dk-res-stats-grid">
                <div className="dk-res-stat-card">
                    <div className="stat-icon-wrap purple"><DollarSign size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Projected Revenue</span>
                        <h2 className="stat-value">
                            <span className="currency">{bookings[0]?.currency || '₼'}</span>
                            {stats.totalRevenue.toLocaleString()}
                        </h2>
                    </div>
                </div>
                <div className="dk-res-stat-card">
                    <div className="stat-icon-wrap orange"><Clock size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Pending Approval</span>
                        <h2 className="stat-value">{stats.pendingCount}</h2>
                    </div>
                </div>
                <div className="dk-res-stat-card">
                    <div className="stat-icon-wrap green"><CheckCircle size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Confirmed Stays</span>
                        <h2 className="stat-value">{stats.confirmedCount}</h2>
                    </div>
                </div>
                <div className="dk-res-stat-card">
                    <div className="stat-icon-wrap blue"><Users size={24} /></div>
                    <div className="stat-info">
                        <span className="stat-label">Total Network</span>
                        <h2 className="stat-value">{stats.totalCount}</h2>
                    </div>
                </div>
            </div>

            {/* INTELLIGENCE BAR */}
            <div className="dk-res-toolbar">
                <div className="dk-res-search">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by Booking ID or Guest Email..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="dk-res-filters">
                    <div className="filter-select-wrapper">
                        <Filter size={16} className="filter-icon" />
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending Approval</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="filter-select-wrapper">
                        <Clock size={16} className="filter-icon" />
                        <select value={dateRange} onChange={e => setDateRange(e.target.value as any)}>
                            <option value="30days">Last 30 Days</option>
                            <option value="all">Full History</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <div className="dk-res-error-alert">{error}</div>}

            {/* CONTENT */}
            <div className="dk-res-content-card">
                {loading && bookings.length === 0 ? (
                    <div className="dk-res-loading">
                        <RefreshCw size={40} className="spin-icon" />
                        <p>Syncing Reservation Data...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="dk-res-empty">
                        <div className="empty-icon-circle">
                            <SearchX size={40} />
                        </div>
                        <h3>No Reservations Found</h3>
                        <p>Adjust your filters or try a different search term to find what you're looking for.</p>
                        {searchTerm && (
                            <button className="dk-res-btn-ghost mt-4" onClick={() => setSearchTerm('')}>
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="dk-res-table-wrapper">
                        <table className="dk-res-table">
                            <thead>
                                <tr>
                                    <th>Guest & Identification</th>
                                    <th>Stay Timeline</th>
                                    <th>Capacity</th>
                                    <th>Yield Action</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(b => {
                                    const firstItem = b.items?.[0];
                                    const checkIn = firstItem?.checkIn ? new Date(firstItem.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                                    const checkOut = firstItem?.checkOut ? new Date(firstItem.checkOut).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
                                    const guestInitial = b.user?.email?.[0].toUpperCase() || 'G';

                                    return (
                                        <tr key={b.id} onClick={() => setSelectedBooking(b)}>
                                            <td>
                                                <div className="td-guest">
                                                    <div className="guest-avatar">{guestInitial}</div>
                                                    <div className="guest-details">
                                                        <span className="guest-id">#{b.bookingNumber}</span>
                                                        <span className="guest-email">{b.user?.email || 'Guest Protocol'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-dates">
                                                    <span className="date-badge">{checkIn}</span>
                                                    <ArrowRight size={14} className="date-arrow" />
                                                    <span className="date-badge">{checkOut}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-capacity">
                                                    <strong>{firstItem?.adults} Adults</strong>
                                                    {firstItem?.children ? <span>, {firstItem.children} Child</span> : null}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="td-price">
                                                    {b.totalPrice.toLocaleString()} {b.currency || '₼'}
                                                </span>
                                            </td>
                                            <td>
                                                {getStatusBadge(b.status)}
                                            </td>
                                            <td className="text-right">
                                                <button className="dk-res-btn-view">Review</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* DETAIL DRAWER / MODAL */}
            {selectedBooking && (
                <div className="dk-res-modal-overlay" onClick={() => setSelectedBooking(null)}>
                    <div onClick={(e) => e.stopPropagation()}>
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
                </div>
            )}
        </div>
    );
}