import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ShieldCheck, Info, Users, CreditCard,
    ChevronLeft, MapPin, Calendar, Navigation, User as UserIcon
} from 'lucide-react';
import { useBooking } from '../../../booking/hooks/useBooking';
import { useProfile } from '../../../account/hooks/useProfile';
import { WalletPaymentBox } from '../../../booking/components/WalletPaymentBox';
import { useAuth } from '../../../../shared/context/AuthContext';
import './TransportReservationPage.css';

export const TransportReservationPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve trip details passed through navigation state
    const tripData = location.state || {};
    const {
        pickupLocation,
        dropoffLocation,
        waypoints,
        paxCount,
        bookingDate,
        vehicleId,
        vehicleBrand,
        vehicleModel,
        vehicleImage,
        totalPrice
    } = tripData;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    const [isValidWallet, setIsValidWallet] = useState(true);
    const { refreshUser } = useAuth();

    const { submitBooking, loading: bookingLoading, error: bookingError } = useBooking();
    const { profile } = useProfile();

    useEffect(() => {
        if (profile) {
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setEmail(profile.email || '');
            setPhone(profile.phone || '');
        }
    }, [profile]);

    const handleBooking = async () => {
        if (!vehicleId || !firstName || !lastName || !email || !phone) {
            alert('Zəhmət olmasa bütün sahələri doldurun.');
            return;
        }

        if (!isValidWallet) {
            alert('Balansınızda kifayət qədər vəsait yoxdur.');
            return;
        }

        const scheduledAt = new Date(bookingDate || new Date()).toISOString();

        try {
            const data = await submitBooking({
                type: 'transfer',
                entityId: vehicleId,
                visitDate: scheduledAt,
                pickupLocation,
                dropoffLocation,
                distanceKm: tripData.distanceKm || 0,
                totalPrice: totalPrice, // Root level override
                participants: paxCount || 1,
                items: [{
                    checkIn: scheduledAt,
                    checkOut: scheduledAt,
                    adults: paxCount || 1,
                    children: 0,
                    price: totalPrice
                }],
                guests: [{
                    firstName,
                    lastName,
                    email,
                    phone
                }],
                paymentMethod,
                extraData: {
                    pickupLocation,
                    dropoffLocation,
                    waypoints,
                    paxCount,
                    scheduledAt
                }
            } as any);

            if (data && (data.data?.id || data.id)) {
                const bId = data.data?.id || data.id;
                await refreshUser();
                // Redirect to shared booking confirmation page
                navigate(`/booking-confirmation/${bId}`);
            }
        } catch (err: any) {
            alert(err.message || 'Booking failed');
            await refreshUser();
        }
    };

    if (!vehicleId) {
        return (
            <div className="reservation-loading" style={{ flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Sifariş məlumatları tapılmadı</h2>
                <button onClick={() => navigate('/transport/passenger')} className="confirm-button" style={{ maxWidth: '200px' }}>
                    Geri Qayıt
                </button>
            </div>
        );
    }

    return (
        <div className="reservation-page">
            <div className="reservation-container">
                <button onClick={() => navigate(-1)} className="back-link">
                    <ChevronLeft size={20} /> Detallara qayıt
                </button>

                <main className="reservation-content">
                    {/* LEFT COLUMN: FORMS */}
                    <div className="reservation-main-info">
                        <h1 className="page-title">Sifarişi Tamamla</h1>
                        <p className="page-subtitle">Məlumatlarınızı yoxlayın və sifarişi təsdiqləyin.</p>

                        {bookingError && <div className="error-banner">{bookingError}</div>}

                        {/* Contact Info */}
                        <section className="reservation-section card">
                            <h2 className="section-title">
                                <UserIcon size={20} /> Şəxsi Məlumatlar
                            </h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Ad</label>
                                    <input
                                        type="text"
                                        placeholder="Məs: Əli"
                                        value={firstName} onChange={e => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Soyad</label>
                                    <input
                                        type="text"
                                        placeholder="Məs: Məmmədov"
                                        value={lastName} onChange={e => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        placeholder="ali@example.com"
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                    <label>Telefon</label>
                                    <input
                                        type="text"
                                        placeholder="+994 -- --- -- --"
                                        value={phone} onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Payment Info */}
                        <section className="reservation-section card">
                            <h2 className="title-icon">
                                <CreditCard /> Payment Method
                            </h2>
                            <div className="options">
                                <label className={`option ${paymentMethod === 'card' ? 'active' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        checked={paymentMethod === 'card'} 
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <div className="option-content">
                                        <span className="option-name">DiscoverKarabakh Wallet</span>
                                        <span className="option-desc">Secure payment with SSL encryption</span>
                                    </div>
                                    <div className="card-icons">
                                        <span className="visa">VISA</span>
                                        <span className="mc">MC</span>
                                    </div>
                                </label>
                            </div>
                            <WalletPaymentBox totalPrice={Number(totalPrice) || 0} onValidationChange={setIsValidWallet} />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: SIDEBAR WIDGET */}
                    <aside className="reservation-sidebar">
                        <div className="summary-card card sticky-sidebar">
                            
                            <div className="hotel-brief">
                                <img 
                                    src={vehicleImage || 'https://placehold.co/100x100?text=Vehicle'} 
                                    alt="Vehicle" 
                                    className="brief-image" 
                                />
                                <div className="brief-details">
                                    <h3>{vehicleBrand} {vehicleModel}</h3>
                                    <p className="hotel-city">Qarabağ Daxili Transfer</p>
                                </div>
                            </div>

                            <div className="booking-config">
                                <div className="config-item">
                                    <label><MapPin size={16} /> Pickup Point</label>
                                    <div className="guest-text" style={{ fontSize: '13px' }}>
                                        {pickupLocation?.address || 'N/A'}
                                    </div>
                                </div>
                                <div className="config-item">
                                    <label><Navigation size={16} /> Drop-off Point</label>
                                    <div className="guest-text" style={{ fontSize: '13px' }}>
                                        {dropoffLocation?.address || 'N/A'}
                                    </div>
                                </div>
                                <div className="config-item">
                                    <label><Calendar size={16} /> Date & Time</label>
                                    <div className="guest-text">
                                        {bookingDate ? new Date(bookingDate).toLocaleString('az-AZ') : 'Immediate Departure'}
                                    </div>
                                </div>
                                <div className="config-item">
                                    <label><Users size={16} /> Passengers</label>
                                    <div className="guest-text">{paxCount} Şəxs</div>
                                </div>
                            </div>

                            <div className="price-breakdown">
                                <div className="breakdown-title">Qiymət Xülasəsi</div>
                                <div className="breakdown-row">
                                    <span className="day-info">Transfer</span>
                                    <span className="day-val">{totalPrice} AZN</span>
                                </div>

                                <div className="price-total">
                                    <span>Yekun Məbləğ</span>
                                    <span style={{ fontSize: '24px' }}>{totalPrice} AZN</span>
                                </div>
                            </div>

                            <button
                                className={`confirm-button ${bookingLoading || !isValidWallet ? 'disabled' : ''}`}
                                onClick={handleBooking}
                                disabled={bookingLoading || !isValidWallet}
                            >
                                {bookingLoading ? (
                                    <div className="loader"></div>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} />
                                        Sifarişi Tamamla
                                    </>
                                )}
                            </button>

                            <p className="secure-text">
                                <Info size={14} /> Seçdiyiniz üsula görə ödəmə baş tutacaq
                            </p>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );
};