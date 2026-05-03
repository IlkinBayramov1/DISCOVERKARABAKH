import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, Info, Users, CreditCard, ChevronLeft, Phone, Mail, User as UserIcon, MapPin } from 'lucide-react';
import "./ReservationPage.css";
import { useBookingPreview } from '../../../booking/hooks/useBookingPreview';
import { useBooking } from '../../../booking/hooks/useBooking';
import { useProfile } from '../../../account/hooks/useProfile';
import { hotelWebApi } from '../../api/hotel.web.api';

export const ReservationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const hotelId = searchParams.get('hotelId');
    const roomId = searchParams.get('roomId');

    const [checkIn, setCheckIn] = useState<string>(searchParams.get('checkIn') || '');
    const [checkOut, setCheckOut] = useState<string>(searchParams.get('checkOut') || '');
    const [adults] = useState<number>(Number(searchParams.get('adults')) || 2);
    const [children] = useState<number>(Number(searchParams.get('children')) || 0);

    // Guest Info
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Hotel & Room Data for summary
    const [hotel, setHotel] = useState<any | null>(null);
    const [room, setRoom] = useState<any | null>(null);
    const [dataLoading, setDataLoading] = useState(true);

    // API Hooks
    const { fetchPreview, previewData, loading: previewLoading, error: previewError } = useBookingPreview();
    const { submitBooking, loading: bookingLoading, error: bookingError } = useBooking();
    const { profile } = useProfile();

    // Auto-populate from profile
    useEffect(() => {
        if (profile) {
            if (!firstName) setFirstName(profile.firstName || '');
            if (!lastName) setLastName(profile.lastName || '');
            if (!email) setEmail(profile.email || '');
            if (!phone) setPhone(profile.phone || '');
        }
    }, [profile]);

    // Fetch Hotel & Room details
    useEffect(() => {
        if (hotelId && roomId) {
            setDataLoading(true);
            Promise.all([
                hotelWebApi.getHotelById(hotelId),
                hotelWebApi.getRoomById(hotelId, roomId, { checkIn, checkOut })
            ]).then(([hotelRes, roomRes]) => {
                setHotel(hotelRes.data || hotelRes);
                setRoom(roomRes.data || roomRes);
                setDataLoading(false);
            }).catch(() => {
                setDataLoading(false);
            });
        }
    }, [hotelId, roomId, checkIn, checkOut]);

    // Trigger Dynamic Pricing API when dates are valid
    useEffect(() => {
        if (checkIn && checkOut && hotelId && roomId) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);

            if (end > start) {
                fetchPreview({
                    type: 'hotel',
                    entityId: hotelId,
                    items: [{
                        roomTypeId: roomId,
                        checkIn,
                        checkOut,
                        adults,
                        children
                    }]
                });
            }
        }
    }, [checkIn, checkOut, hotelId, roomId, fetchPreview]);

    const handleBooking = async () => {
        if (!hotelId || !roomId || !checkIn || !checkOut || !firstName || !lastName || !email || !phone) {
            alert('Please fill out all required details');
            return;
        }

        const data = await submitBooking({
            type: 'hotel',
            entityId: hotelId,
            items: [{
                roomTypeId: roomId,
                checkIn,
                checkOut,
                adults,
                children
            }],
            guests: [{
                firstName,
                lastName,
                email,
                phone
            }],
            paymentMethod
        });

        if (data && data.data?.id) {
            navigate(`/booking-confirmation/${data.data.id}`);
        }
    };

    if (dataLoading) {
        return (
            <div className="reservation-loading">
                <div className="spinner"></div>
                <p>Preparing your secure checkout...</p>
            </div>
        );
    }

    if (!hotelId || !roomId || !hotel || !room) {
        return (
            <div className="min-h-screen py-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Invalid Booking Request</h2>
                    <p className="text-gray-500 mb-6">We couldn't find the room you selected.</p>
                    <button onClick={() => navigate('/hotels')} className="btn-primary">Back to Hotels</button>
                </div>
            </div>
        );
    }

    const getImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/800x600?text=No+Image';
        if (url.startsWith('http') || url.startsWith('/images/')) return url;
        return `http://localhost:4004${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const roomImage = room.images && room.images.length > 0 ? room.images[0].url : hotel.images?.[0]?.url;

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = end.getTime() - start.getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const nights = calculateNights();

    return (
        <div className="reservation-page">
            <div className="reservation-container">
                <button onClick={() => navigate(-1)} className="back-link">
                    <ChevronLeft size={20} /> Back to Room Details
                </button>

                <main className="reservation-content">
                    <div className="reservation-main-info">
                        <h1 className="page-title">Secure your reservation</h1>
                        <p className="page-subtitle">Verify your details and complete your booking.</p>

                        {bookingError && <div className="error-banner">{bookingError}</div>}

                        {/* Contact Info */}
                        <section className="reservation-section card">
                            <h2 className="section-title">
                                <UserIcon size={20} className="text-blue-600" /> Who's checking in?
                            </h2>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. John" 
                                        value={firstName} onChange={e => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Doe"
                                        value={lastName} onChange={e => setLastName(e.target.value)} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label><Mail size={16} /> Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="Confirmation goes here" 
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label><Phone size={16} /> Phone Number</label>
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
                            <h2 className="section-title">
                                <CreditCard size={20} className="text-blue-600" /> Payment Method
                            </h2>
                            <div className="payment-options">
                                <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        checked={paymentMethod === 'card'} 
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <div className="option-content">
                                        <span className="option-name">Credit / Debit Card</span>
                                        <span className="option-desc">Secure payment with SSL encryption</span>
                                    </div>
                                    <div className="card-icons">
                                        <span className="visa">VISA</span>
                                        <span className="mc">MC</span>
                                    </div>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        checked={paymentMethod === 'cash'} 
                                        onChange={() => setPaymentMethod('cash')}
                                    />
                                    <div className="option-content">
                                        <span className="option-name">Pay at Property</span>
                                        <span className="option-desc">No pre-payment required</span>
                                    </div>
                                </label>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Pricing Engine Widget */}
                    <aside className="reservation-sidebar">
                        <div className="summary-card card sticky-sidebar">
                            <div className="hotel-brief">
                                <img src={getImageUrl(roomImage)} alt={room.name} className="brief-image" />
                                <div className="brief-details">
                                    <h3>{room.name}</h3>
                                    <p className="hotel-name">{hotel.name}</p>
                                    <p className="hotel-city"><MapPin size={12} /> {hotel.city}, Azerbaijan</p>
                                </div>
                            </div>

                            <div className="booking-config">
                                <div className="config-item">
                                    <label><Calendar size={16} /> Check-in</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="config-item">
                                    <label><Calendar size={16} /> Check-out</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="config-item guest-summary">
                                    <label><Users size={16} /> Guests</label>
                                    <div className="guest-text">
                                        {adults} Adults, {children} Children
                                    </div>
                                </div>
                            </div>

                            <div className="price-breakdown">
                                {previewLoading ? (
                                    <div className="breakdown-loading">
                                        <div className="mini-spinner"></div>
                                        <span>Calculating live rates...</span>
                                    </div>
                                ) : previewError ? (
                                    <div className="breakdown-error">{previewError}</div>
                                ) : previewData?.pricingResult ? (
                                    <div className="daily-breakdown-wrapper">
                                        <div className="breakdown-title">Price Breakdown ({nights} {nights === 1 ? 'night' : 'nights'})</div>
                                        <div className="breakdown-items">
                                            {previewData.pricingResult.breakdowns[0].log.map((day: any, idx: number) => (
                                                <div key={idx} className="breakdown-row">
                                                    <span className="day-info">
                                                        {new Date(day.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                    <span className="day-val">₼{day.finalPrice.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="tax-summary">
                                            {previewData.pricingResult.taxes.map((t: any, idx: number) => (
                                                <div key={idx} className="tax-row">
                                                    <span>{t.name}</span>
                                                    <span>₼{t.amount.toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="price-total">
                                            <span>Total Amount</span>
                                            <span>₼{previewData.exactTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="breakdown-notice">
                                        <Info size={16} />
                                        <span>Select valid dates to calculate price.</span>
                                    </div>
                                )}
                            </div>

                            <button
                                className={`confirm-button ${(!previewData || bookingLoading) ? 'disabled' : ''}`}
                                onClick={handleBooking}
                                disabled={!previewData || bookingLoading}
                            >
                                {bookingLoading ? (
                                    <div className="loader"></div>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} />
                                        Secure & Complete
                                    </>
                                )}
                            </button>

                            <p className="secure-text">
                                <ShieldCheck size={14} /> 100% Secure Checkout
                            </p>
                        </div>
                    </aside>
                </main>
            </div>
        </div>
    );

};
