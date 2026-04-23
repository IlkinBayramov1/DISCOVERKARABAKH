import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ChevronLeft, Search, Calendar, User, Ticket, 
    MoreHorizontal, Filter, Download, ArrowUpDown, Clock, CheckCircle2
} from 'lucide-react';
import { vendorAttractionApi } from '../../api/attraction.api';
import './AttractionBookingsPage.css';

export default function AttractionBookingsPage() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
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
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(b => 
        b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
        b.attraction?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('az-AZ', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bookings-layout">
            <div className="bookings-container">
                {/* Header */}
                <header className="bookings-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        <ChevronLeft size={20} /> Geri
                    </button>
                    <div className="header-content">
                        <h1>Atraksion Rezervasiyaları</h1>
                        <p>Bütün gələn bilet və giriş rezervasiyalarını buradan idarə edin.</p>
                    </div>
                </header>

                {/* Toolbar */}
                <div className="bookings-toolbar">
                    <div className="search-box">
                        <Search size={18} />
                        <input 
                            type="text" 
                            placeholder="PNR, atraksion və ya e-poçt ilə axtar..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="tools">
                        <button className="tool-btn"><Filter size={18} /> Filtrlər</button>
                        <button className="tool-btn"><Download size={18} /> Export</button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bookings-content">
                    {isLoading ? (
                        <div className="loading-state">Yüklənir...</div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <Ticket size={48} />
                            <h3>Rezervasiya tapılmadı</h3>
                            <p>Hələ ki, heç bir atraksion rezervasiyası mövcud deyil.</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="bookings-table">
                                <thead>
                                    <tr>
                                        <th>PNR & Tarix <ArrowUpDown size={14} /></th>
                                        <th>Atraksion</th>
                                        <th>İstifadəçi</th>
                                        <th>Qonaqlar</th>
                                        <th>Məbləğ</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td>
                                                <div className="pnr-cell">
                                                    <span className="pnr">#{booking.bookingNumber}</span>
                                                    <span className="date">
                                                        {booking.items?.[0]?.checkIn ? formatDate(booking.items[0].checkIn) : 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="attr-cell">
                                                    <span className="attr-name">{booking.attraction?.name || 'Unknown'}</span>
                                                    <span className="attr-city">{booking.attraction?.city}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="user-cell">
                                                    <User size={14} />
                                                    <span>{booking.user?.email || 'Guest'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="guests-cell">
                                                    {booking.items?.[0]?.adults || 0} böyük
                                                    {booking.items?.[0]?.children > 0 && `, ${booking.items[0].children} uşaq`}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="price-cell">
                                                    {booking.totalPrice} {booking.currency}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-pill ${booking.status}`}>
                                                    {booking.status === 'confirmed' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                                    {booking.status === 'confirmed' ? 'Təsdiqləndi' : 'Gözləmədə'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="action-btn">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
