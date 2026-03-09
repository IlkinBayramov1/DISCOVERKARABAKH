import { useMemo, useState } from 'react';
import { useBookings } from '../../hooks/useBookings';
import { Calendar, CheckCircle, Clock, XCircle, ChevronDown, Filter } from 'lucide-react';
import './Reservations.css';

export default function Reservations() {
    const { bookings, loading, error, updateStatus } = useBookings(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredBookings = useMemo(() => {
        if (filterStatus === 'all') return bookings;
        return bookings.filter(b => b.status === filterStatus);
    }, [bookings, filterStatus]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <span className="status-badge success"><CheckCircle size={14} /> Confirmed</span>;
            case 'pending':
            case 'draft': return <span className="status-badge warning"><Clock size={14} /> Pending</span>;
            case 'cancelled': return <span className="status-badge danger"><XCircle size={14} /> Cancelled</span>;
            default: return <span className="status-badge neutral">{status}</span>;
        }
    };

    const getPaymentBadge = (status: string) => {
        const lower = status.toLowerCase();
        if (lower === 'paid' || lower === 'captured') return <span className="payment-badge paid">Paid</span>;
        if (lower === 'refunded') return <span className="payment-badge refunded">Refunded</span>;
        return <span className="payment-badge unpaid">Unpaid / Initiated</span>;
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header split-header">
                <div>
                    <h1><Calendar size={24} className="heading-icon" /> Reservations</h1>
                    <p>Manage incoming bookings and guest details</p>
                </div>
                <div className="filter-group">
                    <Filter size={16} />
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="select-filter">
                        <option value="all">All Statuses</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="draft">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {error && <div className="alert error">{error}</div>}

            <div className="dashboard-content">
                {loading ? (
                    <div className="loading-state"><div className="spinner"></div><p>Loading Bookings...</p></div>
                ) : filteredBookings.length === 0 ? (
                    <div className="empty-state">
                        <Calendar size={48} className="empty-icon text-muted" />
                        <h3>No Active Reservations</h3>
                        <p>When guests book your properties, they will appear here.</p>
                    </div>
                ) : (
                    <div className="glassmorphism-card table-responsive">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Property</th>
                                    <th>Check In / Out</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map(b => {
                                    const firstItem = b.items && b.items.length > 0 ? b.items[0] : null;
                                    const checkIn = firstItem?.checkIn ? new Date(firstItem.checkIn).toLocaleDateString() : 'N/A';
                                    const checkOut = firstItem?.checkOut ? new Date(firstItem.checkOut).toLocaleDateString() : 'N/A';

                                    return (
                                        <tr key={b.id}>
                                            <td className="booking-id">
                                                <strong>{b.bookingNumber}</strong>
                                                <div className="guest-email">{b.user?.email || 'Guest User'}</div>
                                                <div className="booking-date text-muted">Booked: {new Date(b.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td>
                                                <strong>{b.hotel?.name || 'Multiple / Unknown'}</strong>
                                                <div className="text-muted">{b.items?.length || 0} item(s)</div>
                                            </td>
                                            <td>
                                                <div className="date-range">
                                                    <span>{checkIn}</span>
                                                    <ChevronDown size={12} className="rotate-negative-90 text-muted mx-1" />
                                                    <span>{checkOut}</span>
                                                </div>
                                                {firstItem && <div className="text-muted">{firstItem.adults} Adults, {firstItem.children} Children</div>}
                                            </td>
                                            <td>
                                                <strong>{b.totalPrice.toFixed(2)} {b.currency}</strong>
                                            </td>
                                            <td>
                                                {getStatusBadge(b.status)}
                                                <div style={{ marginTop: '0.5rem' }}>
                                                    {getPaymentBadge(b.paymentStatus)}
                                                </div>
                                            </td>
                                            <td className="booking-actions">
                                                {(b.status === 'draft' || b.status === 'pending') ? (
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-approve"
                                                            onClick={() => updateStatus(b.id, 'approve')}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn-reject"
                                                            onClick={() => updateStatus(b.id, 'reject')}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">No actions</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
