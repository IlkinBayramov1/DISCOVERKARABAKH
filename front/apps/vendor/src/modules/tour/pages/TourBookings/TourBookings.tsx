import { useState, useMemo } from 'react';
import { 
    Search, 
    Filter, 
    Calendar, 
    RefreshCw,
    SearchX,
    MapPin,
    CheckCircle,
    Clock,
    X,
    CreditCard
} from 'lucide-react';
import { useTourBookings } from '../../hooks/useTourBookings';
import TourBookingDetails from '@/modules/tour/pages/TourBookingDetails/TourBookingDetails';
import './TourBookings.css';

export default function TourBookings() {
    const { bookings, loading, error, refetch } = useTourBookings();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    // DİQQƏT: IBooking əvəzinə "any" istifadə edərək TS xətasını aradan qaldırdıq
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const relatedTour = booking.tour || booking.Tour;
            const tName = relatedTour?.name || booking.items?.[0]?.name || '';

            const matchesSearch = 
                booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (booking.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                tName.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [bookings, searchTerm, statusFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <span className="dk-tb-badge success"><CheckCircle size={14}/> Confirmed</span>;
            case 'pending': 
            case 'pending_payment': return <span className="dk-tb-badge warning"><Clock size={14}/> Action Needed</span>;
            case 'cancelled': return <span className="dk-tb-badge danger"><X size={14}/> Cancelled</span>;
            case 'completed': return <span className="dk-tb-badge info"><CheckCircle size={14}/> Completed</span>;
            default: return <span className="dk-tb-badge neutral">{status}</span>;
        }
    };

    const handleStatusUpdate = async (id: string, action: 'approve' | 'reject') => {
        console.log(`Updating booking ${id} to ${action}`);
        // await tourApi.updateBookingStatus(id, action === 'approve' ? 'confirmed' : 'cancelled');
        setSelectedBooking(null);
        refetch();
    };

    return (
        <div className="dk-tb-layout">
            <header className="dk-tb-header">
                <div>
                    <h1 className="dk-tb-title">Tour Bookings</h1>
                    <p className="dk-tb-subtitle">Manage guest reservations, track revenue, and monitor tour schedules.</p>
                </div>
            </header>

            <div className="dk-tb-toolbar">
                <div className="dk-tb-search">
                    <Search size={18} className="search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search by Protocol ID, Email or Tour Name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="dk-tb-filters">
                    <div className="filter-wrap">
                        <Filter size={16} className="filter-icon" />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">All Statuses</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending Approval</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    
                    <button className="dk-btn-refresh" onClick={refetch} disabled={loading} title="Refresh Data">
                        <RefreshCw size={18} className={loading ? 'spin-icon' : ''} />
                    </button>
                </div>
            </div>

            {error && <div className="dk-alert-error mb-6">{error}</div>}

            <div className="dk-tb-content-card">
                {loading && bookings.length === 0 ? (
                    <div className="dk-tb-loading">
                        <RefreshCw size={40} className="spin-icon" />
                        <p>Syncing Experience Protocols...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="dk-tb-empty">
                        <div className="empty-icon-circle">
                            {searchTerm || statusFilter !== 'all' ? <SearchX size={40} /> : <Calendar size={40} />}
                        </div>
                        <h3>{searchTerm || statusFilter !== 'all' ? 'No Matches Found' : 'No Bookings Yet'}</h3>
                        <p>
                            {searchTerm || statusFilter !== 'all' 
                                ? "Adjust your filters or search parameters." 
                                : "When adventurers book your experiences, they will appear here."}
                        </p>
                        {(searchTerm || statusFilter !== 'all') && (
                            <button className="dk-btn-ghost mt-4" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="dk-tb-table-wrapper">
                        <table className="dk-tb-table">
                            <thead>
                                <tr>
                                    <th>Guest & Identification</th>
                                    <th>Tour / Experience</th>
                                    <th>Schedule & Capacity</th>
                                    <th>Total Yield</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => {
                                    const firstItem = booking.items?.[0];
                                    const tourDate = firstItem?.checkIn 
                                        ? new Date(firstItem.checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                                        : 'Date N/A';
                                    
                                    const totalPax = (firstItem?.adults || 0) + (firstItem?.children || 0);
                                    const guestInitial = booking.user?.email?.[0]?.toUpperCase() || 'G';
                                    
                                    const relatedTour = booking.tour || booking.Tour;
                                    const tourName = relatedTour?.name || firstItem?.name || firstItem?.tourName || firstItem?.title;

                                    return (
                                        <tr key={booking.id} onClick={() => setSelectedBooking(booking)}>
                                            <td>
                                                <div className="td-guest">
                                                    <div className="guest-avatar">{guestInitial}</div>
                                                    <div className="guest-details">
                                                        <span className="guest-id">#{booking.bookingNumber}</span>
                                                        <span className="guest-email">{booking.user?.email || 'Guest Protocol'}</span>
                                                        <span className="guest-date" style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                                            {booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-tour-info">
                                                    <div className="tour-name">
                                                        <MapPin size={14} className="text-blue-500" />
                                                        {tourName ? (
                                                            <span title={tourName}>{tourName}</span>
                                                        ) : (
                                                            <span className="text-slate-400 italic font-medium">Unnamed Experience</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-schedule">
                                                    <span className="date-badge">{tourDate}</span>
                                                    <span className="capacity-text">{totalPax} Explorers</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-yield">
                                                    <CreditCard size={14} className="text-emerald-500" />
                                                    <span className="price-tag">
                                                        {booking.totalPrice.toLocaleString()} {booking.currency || '₼'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                {getStatusBadge(booking.status)}
                                            </td>
                                            <td className="text-right">
                                                <button 
                                                    className="dk-btn-view"
                                                    onClick={(e) => { e.stopPropagation(); setSelectedBooking(booking); }}
                                                >
                                                    Review
                                                </button>
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
                <TourBookingDetails 
                    booking={selectedBooking} 
                    onClose={() => setSelectedBooking(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
}