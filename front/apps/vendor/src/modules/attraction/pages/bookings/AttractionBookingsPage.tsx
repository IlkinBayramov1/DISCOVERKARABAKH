import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Search,
    Filter, RefreshCw, MapPin, CheckCircle, Clock, X, CreditCard, SearchX, Calendar
} from 'lucide-react';
import { vendorAttractionApi } from '../../api/attraction.api';
import AttractionBookingDetails from './AttractionBookingDetails';
import './AttractionBookingsPage.css';

export default function AttractionBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const res = await vendorAttractionApi.getBookings();
            // Filter for attraction bookings only
            const attractionBookings = res.data?.filter(b => b.bookingType === 'attraction') || [];
            setBookings(attractionBookings);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            const attractionName = booking.attraction?.name || booking.items?.[0]?.name || '';

            const matchesSearch =
                booking.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (booking.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                attractionName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

            return matchesSearch && matchesStatus;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [bookings, searchTerm, statusFilter]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <span className="dk-tb-badge success"><CheckCircle size={14} /> Confirmed</span>;
            case 'pending':
            case 'pending_payment': return <span className="dk-tb-badge warning"><Clock size={14} /> Action Needed</span>;
            case 'cancelled': return <span className="dk-tb-badge danger"><X size={14} /> Cancelled</span>;
            case 'completed': return <span className="dk-tb-badge info"><CheckCircle size={14} /> Completed</span>;
            default: return <span className="dk-tb-badge neutral">{status}</span>;
        }
    };

    const handleStatusUpdate = async (id: string, action: 'approve' | 'reject') => {
        // Implementation for status update
        console.log(`Updating attraction booking ${id} to ${action}`);
        setSelectedBooking(null);
        fetchBookings();
    };

    return (
        <div className="dk-tb-layout">
            <header className="dk-tb-header">
                <button className="dk-btn-back-minimal" onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} /> Geri
                </button>
                <div>
                    <h1 className="dk-tb-title">Atraksion Rezervasiyaları</h1>
                    <p className="dk-tb-subtitle">Bütün gələn bilet və giriş rezervasiyalarını buradan idarə edin.</p>
                </div>
            </header>

            <div className="dk-tb-toolbar">
                <div className="dk-tb-search">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="PNR, atraksion və ya e-poçt ilə axtar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="dk-tb-filters">
                    <div className="filter-wrap">
                        <Filter size={16} className="filter-icon" />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="all">Bütün Statuslar</option>
                            <option value="confirmed">Təsdiqləndi</option>
                            <option value="pending">Gözləmədə</option>
                            <option value="cancelled">Ləğv edildi</option>
                            <option value="completed">Tamamlandı</option>
                        </select>
                    </div>

                    <button className="dk-btn-refresh" onClick={fetchBookings} disabled={isLoading} title="Refresh Data">
                        <RefreshCw size={18} className={isLoading ? 'spin-icon' : ''} />
                    </button>
                </div>
            </div>

            <div className="dk-tb-content-card">
                {isLoading && bookings.length === 0 ? (
                    <div className="dk-tb-loading">
                        <RefreshCw size={40} className="spin-icon" />
                        <p>Rezervasiyalar sinxronizasiya olunur...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="dk-tb-empty">
                        <div className="empty-icon-circle">
                            {searchTerm || statusFilter !== 'all' ? <SearchX size={40} /> : <Calendar size={40} />}
                        </div>
                        <h3>{searchTerm || statusFilter !== 'all' ? 'Nəticə Tapılmadı' : 'Rezervasiya Yoxdur'}</h3>
                        <p>Axtarış kriteriyalarını dəyişin və ya yeni sifarişləri gözləyin.</p>
                    </div>
                ) : (
                    <div className="dk-tb-table-wrapper">
                        <table className="dk-tb-table">
                            <thead>
                                <tr>
                                    <th>Qonaq & PNR</th>
                                    <th>Atraksion / Məkan</th>
                                    <th>Tarix & Say</th>
                                    <th>Məbləğ</th>
                                    <th>Status</th>
                                    <th className="text-right">Hərəkət</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBookings.map((booking) => {
                                    const firstItem = booking.items?.[0];
                                    const bookingDate = firstItem?.checkIn
                                        ? new Date(firstItem.checkIn).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' })
                                        : 'N/A';

                                    const totalPax = (firstItem?.adults || 0) + (firstItem?.children || 0);
                                    const guestInitial = booking.user?.email?.[0]?.toUpperCase() || 'G';

                                    const attractionName = booking.attraction?.name || firstItem?.name || 'Unnamed Attraction';

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
                                                        <span title={attractionName}>{attractionName}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="td-schedule">
                                                    <span className="date-badge">{bookingDate}</span>
                                                    <span className="capacity-text">{totalPax} Qonaq</span>
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

            {selectedBooking && (
                <AttractionBookingDetails
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
        </div>
    );
}
