import React, { useEffect, useState } from 'react';
import { bookingApi } from '../../../../modules/booking/api/booking.api';
import { utilityApi } from '../../../../modules/utility/api/utility.api';
import { useNavigate } from 'react-router-dom';
import { 
    Calendar, MapPin, Tag, ChevronRight, 
    XCircle, Loader2, Compass, Building2, CreditCard,
    Car, Map, Flame, Droplet, Zap, Receipt
} from 'lucide-react';
import './TripsPage.css';

type ActiveTab = 'bookings' | 'utility';

export const TripsPage: React.FC = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [utilityPayments, setUtilityPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<ActiveTab>('bookings');
    const navigate = useNavigate();

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const [bookingsRes, utilityRes] = await Promise.allSettled([
                bookingApi.getMyBookings(),
                utilityApi.getMyPayments()
            ]);

            if (bookingsRes.status === 'fulfilled') {
                setBookings(bookingsRes.value.data || []);
            }
            if (utilityRes.status === 'fulfilled') {
                // axios response: {data: {success, data: [...], meta: {...}}}
                const utilityData = (utilityRes.value as any)?.data?.data || [];
                setUtilityPayments(utilityData);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Warning: Are you sure you want to cancel this booking?')) return;
        
        setCancelling(id);
        try {
            await bookingApi.cancelBooking(id);
            await fetchBookings(); 
        } catch (err) {
            alert('Failed to cancel booking. Please contact support.');
        } finally {
            setCancelling(null);
        }
    };

    if (loading) {
        return (
            <div className="dk-trips-layout">
                <div className="dk-trips-container">
                    <div className="dk-trips-loading">
                        <div className="spinner"></div>
                        <p>Loading your adventures...</p>
                    </div>
                </div>
            </div>
        );
    }

    const getTripIcon = (type: string) => {
        switch (type) {
            case 'hotel': return <Building2 size={16} />;
            case 'tour': return <Tag size={16} />;
            case 'attraction': return <Map size={16} />;
            case 'transfer': return <Car size={16} />;
            default: return <Compass size={16} />;
        }
    };

    const getUtilityIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'gas': return <Flame size={20} style={{ color: '#f97316' }} />;
            case 'water': return <Droplet size={20} style={{ color: '#0ea5e9' }} />;
            case 'electricity': return <Zap size={20} style={{ color: '#eab308' }} />;
            default: return <Receipt size={20} style={{ color: '#6366f1' }} />;
        }
    };

    const getUtilityProviderName = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'gas': return 'Azəriqaz';
            case 'water': return 'Azərsu';
            case 'electricity': return 'Azərişıq';
            default: return 'Kommunal Xidmət';
        }
    };

    const getUtilityBgGradient = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'gas': return 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)';
            case 'water': return 'linear-gradient(135deg, #bae6fd 0%, #7dd3fc 100%)';
            case 'electricity': return 'linear-gradient(135deg, #fef08a 0%, #fde047 100%)';
            default: return 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)';
        }
    };

    return (
        <div className="dk-trips-layout">
            <div className="dk-trips-container">
                
                {/* HEADER */}
                <header className="dk-trips-header">
                    <div className="header-text">
                        <h1 className="dk-title">My Trips</h1>
                        <p className="dk-subtitle">View and manage your upcoming and past adventures in Karabakh.</p>
                    </div>
                </header>

                {/* TABS */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '28px',
                    borderBottom: '2px solid #e2e8f0',
                    paddingBottom: '0'
                }}>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            background: 'none',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            borderBottom: activeTab === 'bookings' ? '3px solid #0f172a' : '3px solid transparent',
                            color: activeTab === 'bookings' ? '#0f172a' : '#64748b',
                            marginBottom: '-2px',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Compass size={16} />
                        Bronlar
                        {bookings.length > 0 && (
                            <span style={{
                                background: '#0f172a',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '1px 8px',
                                fontSize: '12px',
                                fontWeight: 700
                            }}>{bookings.length}</span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('utility')}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            background: 'none',
                            fontSize: '15px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            borderBottom: activeTab === 'utility' ? '3px solid #0f172a' : '3px solid transparent',
                            color: activeTab === 'utility' ? '#0f172a' : '#64748b',
                            marginBottom: '-2px',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Receipt size={16} />
                        Kommunal Ödənişlər
                        {utilityPayments.length > 0 && (
                            <span style={{
                                background: '#0f172a',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '1px 8px',
                                fontSize: '12px',
                                fontWeight: 700
                            }}>{utilityPayments.length}</span>
                        )}
                    </button>
                </div>

                {/* BOOKINGS TAB */}
                {activeTab === 'bookings' && (
                    bookings.length === 0 ? (
                        <div className="dk-trips-empty">
                            <div className="empty-icon-circle">
                                <Compass size={40} strokeWidth={1.5} />
                            </div>
                            <h2>No adventures found</h2>
                            <p>You haven't booked any trips yet. Explore our curated tours and premium hotels to start your journey!</p>
                            <button onClick={() => navigate('/tours')} className="dk-btn-ghost mt-6">
                                Explore Experiences
                            </button>
                        </div>
                    ) : (
                        <div className="dk-trips-list">
                            {bookings.map((booking) => {
                                const details = booking.hotel || booking.tour || booking.attraction || booking.vehicle || {};
                                const checkInDate = booking.items?.[0] ? new Date(booking.items[0].checkIn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'TBA';
                                
                                let title = details.name || details.title || 'Untitled Adventure';
                                if (booking.bookingType === 'transfer' && details.brand) {
                                    title = `${details.brand} ${details.model}`;
                                }

                                let imgUrl = null;
                                if (details.images) {
                                    const images = Array.isArray(details.images) ? details.images : 
                                                 (typeof details.images === 'string' ? [details.images] : 
                                                 (typeof details.images === 'object' ? Object.values(details.images) : []));
                                    if (images.length > 0) {
                                        imgUrl = typeof images[0] === 'string' ? images[0] : (images[0] as any)?.url;
                                    }
                                }

                                return (
                                    <div 
                                        key={booking.id} 
                                        className={`dk-trip-card premium-card ${booking.status === 'cancelled' ? 'cancelled-card' : ''}`}
                                        onClick={() => navigate(`/booking-confirmation/${booking.id}`)}
                                    >
                                        <div className="dk-trip-image-box">
                                            {imgUrl ? (
                                                <img src={imgUrl} alt={title} className="trip-bg-img" />
                                            ) : (
                                                <div className="trip-placeholder-bg">
                                                    <Compass size={32} opacity={0.2} />
                                                </div>
                                            )}
                                            <div className="trip-type-badge">
                                                {getTripIcon(booking.bookingType)}
                                                <span className="capitalize">{booking.bookingType}</span>
                                            </div>
                                        </div>

                                        <div className="dk-trip-details">
                                            <div className="trip-top-row">
                                                <div>
                                                    <h3 className="trip-title">{title}</h3>
                                                    <p className="trip-location">
                                                        <MapPin size={14} /> {details.address || details.city || details.vendorCompany || 'Karabakh Region'}
                                                    </p>
                                                </div>
                                                <span className={`dk-status-pill ${booking.status}`}>
                                                    {booking.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="dk-trip-meta-grid">
                                                <div className="meta-item">
                                                    <label>Booking ID</label>
                                                    <span className="value-mono">#{booking.bookingNumber}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <label>Date</label>
                                                    <span className="value-highlight"><Calendar size={14} /> {checkInDate}</span>
                                                </div>
                                                <div className="meta-item">
                                                    <label>Total Price</label>
                                                    <span className="value-price">
                                                        <CreditCard size={14} /> {booking.totalPrice} {booking.currency || '₼'}
                                                    </span>
                                                </div>
                                                <div className="meta-item">
                                                    <label>Payment</label>
                                                    <span className={`capitalize ${booking.paymentStatus === 'captured' ? 'text-success' : 'text-warning'}`}>
                                                        {booking.paymentStatus}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="trip-action-row">
                                                <span className="view-details-text">
                                                    View Receipt <ChevronRight size={16} />
                                                </span>
                                                
                                                {booking.status !== 'cancelled' && (
                                                    <button 
                                                        onClick={(e) => handleCancel(booking.id, e)}
                                                        disabled={cancelling === booking.id}
                                                        className="btn-cancel-trip"
                                                    >
                                                        {cancelling === booking.id ? (
                                                            <><Loader2 size={14} className="spin-icon" /> Cancelling...</>
                                                        ) : (
                                                            <><XCircle size={14} /> Cancel Booking</>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )
                )}

                {/* UTILITY PAYMENTS TAB */}
                {activeTab === 'utility' && (
                    utilityPayments.length === 0 ? (
                        <div className="dk-trips-empty">
                            <div className="empty-icon-circle">
                                <Receipt size={40} strokeWidth={1.5} />
                            </div>
                            <h2>Heç bir kommunal ödəniş tapılmadı</h2>
                            <p>Hələ heç bir kommunal borc ödəməmisiniz. Qaz, su və işıq borclarınızı sürətlə ödəmək üçün Kommunal Ödənişlər bölməsinə keçin.</p>
                            <button onClick={() => navigate('/utility')} className="dk-btn-ghost mt-6">
                                Kommunal Ödənişlər
                            </button>
                        </div>
                    ) : (
                        <div className="dk-trips-list">
                            {utilityPayments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="dk-trip-card premium-card"
                                    onClick={() => navigate(`/utility-confirmation/${payment.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* CARD IMAGE AREA — Utility gradient */}
                                    <div className="dk-trip-image-box">
                                        <div className="trip-placeholder-bg" style={{ background: getUtilityBgGradient(payment.utilityType) }}>
                                            <div style={{ opacity: 0.7, transform: 'scale(2)' }}>
                                                {getUtilityIcon(payment.utilityType)}
                                            </div>
                                        </div>
                                        <div className="trip-type-badge">
                                            {getUtilityIcon(payment.utilityType)}
                                            <span>{getUtilityProviderName(payment.utilityType)}</span>
                                        </div>
                                    </div>

                                    {/* CARD DETAILS */}
                                    <div className="dk-trip-details">
                                        <div className="trip-top-row">
                                            <div>
                                                <h3 className="trip-title">{getUtilityProviderName(payment.utilityType)} Ödənişi</h3>
                                                <p className="trip-location" style={{ fontSize: '13px', color: '#64748b' }}>
                                                    Abonent: <strong>{payment.abonentCode}</strong> · {payment.abonentName}
                                                </p>
                                            </div>
                                            <span className={`dk-status-pill ${payment.paymentStatus === 'completed' ? 'confirmed' : payment.paymentStatus === 'failed' ? 'cancelled' : 'pending'}`}>
                                                {payment.paymentStatus === 'completed' ? 'ÖDƏNİLDİ' : payment.paymentStatus === 'failed' ? 'RƏDD EDİLDİ' : 'GÖZLƏMƏDƏ'}
                                            </span>
                                        </div>

                                        <div className="dk-trip-meta-grid">
                                            <div className="meta-item">
                                                <label>Tranzaksiya ID</label>
                                                <span className="value-mono" style={{ fontSize: '11px' }}>{payment.transactionId || 'Gözlənilir...'}</span>
                                            </div>
                                            <div className="meta-item">
                                                <label>Tarix</label>
                                                <span className="value-highlight">
                                                    <Calendar size={14} /> {new Date(payment.createdAt).toLocaleDateString('az-AZ', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                            <div className="meta-item">
                                                <label>Məbləğ</label>
                                                <span className="value-price">
                                                    <CreditCard size={14} /> {payment.totalAmount?.toFixed(2)} ₼
                                                </span>
                                            </div>
                                            <div className="meta-item">
                                                <label>Borc sayı</label>
                                                <span>{payment.itemCount} adet</span>
                                            </div>
                                        </div>

                                        <div className="trip-action-row">
                                            <span className="view-details-text">
                                                Qəbzi Gör <ChevronRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

            </div>
        </div>
    );
};