import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ShieldCheck, Info, Users, CreditCard,
    ChevronLeft, MapPin, Calendar, Navigation,
    Car, Wallet
} from 'lucide-react';
import { useBooking } from '../../../booking/hooks/useBooking';
import { useProfile } from '../../../account/hooks/useProfile';
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

        const scheduledAt = new Date(bookingDate || new Date()).toISOString();

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
            // Redirect to shared booking confirmation page
            navigate(`/booking-confirmation/${bId}`);
        }
    };

    if (!vehicleId) {
        return (
            <div className="pt-checkout-error">
                <h2>Sifariş məlumatları tapılmadı</h2>
                <button onClick={() => navigate('/transport/passenger')} className="btn-primary">Geri Qayıt</button>
            </div>
        );
    }

    return (
        <div className="pt-checkout-container">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate(-1)} className="btn-back-link">
                    <ChevronLeft size={20} /> Detallara qayıt
                </button>

                <div className="pt-checkout-layout">
                    {/* Sol tərəf - Form */}
                    <div className="pt-checkout-main">
                        <h1 className="text-3xl font-black text-gray-900 mb-8">Sifarişi Tamamla</h1>

                        {bookingError && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 font-medium">
                                {bookingError}
                            </div>
                        )}

                        {/* İstifadəçi Məlumatları */}
                        <section className="glass-panel p-8 mb-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Users size={22} className="text-indigo-600" /> Şəxsi Məlumatlar
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ad</label>
                                    <input
                                        type="text"
                                        className="form-input-checkout"
                                        placeholder="Məs: Əli"
                                        value={firstName} onChange={e => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Soyad</label>
                                    <input
                                        type="text"
                                        className="form-input-checkout"
                                        placeholder="Məs: Məmmədov"
                                        value={lastName} onChange={e => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="form-input-checkout"
                                        placeholder="ali@example.com"
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
                                    <input
                                        type="text"
                                        className="form-input-checkout"
                                        placeholder="e.g. +994 50 123 45 67"
                                        value={phone} onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Ödəmə Metodu */}
                        <section className="glass-panel p-8 mb-6">
                            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <CreditCard size={22} className="text-indigo-600" /> Ödəmə Metodu
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">Ödəniş üsulunu seçin.</p>

                            <div className="space-y-4">
                                <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <div className="flex-1">
                                        <span className="block font-bold text-gray-900">Bank Kartı</span>
                                        <span className="text-sm text-gray-500">İndi onlayn ödə</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="card-badge">VISA</span>
                                        <span className="card-badge">MC</span>
                                    </div>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === 'cash'}
                                        onChange={() => setPaymentMethod('cash')}
                                    />
                                    <div className="flex-1">
                                        <span className="block font-bold text-gray-900">Yerində ödəmə</span>
                                        <span className="text-sm text-gray-500">Sürücüyə çatanda ödə</span>
                                    </div>
                                    <Wallet size={24} className="text-gray-400" />
                                </label>
                            </div>
                        </section>
                    </div>

                    {/* Sağ tərəf - Xülasə */}
                    <div className="pt-checkout-sidebar">
                        <div className="sticky-summary glass-panel p-8">
                            <div className="mb-6 flex gap-4 border-b border-gray-100 pb-6">
                                <div className="vehicle-thumb">
                                    {vehicleImage ? <img src={vehicleImage} alt="Vehicle" /> : <Car size={32} />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-900">{vehicleBrand} {vehicleModel}</h3>
                                    <p className="text-gray-500 text-sm">Qarabağ Daxili Transfer</p>
                                </div>
                            </div>

                            <div className="summary-info-box mb-6">
                                <div className="si-row">
                                    <MapPin size={16} />
                                    <span>{pickupLocation?.address || 'N/A'}</span>
                                </div>
                                <div className="si-divider">
                                    <Navigation size={12} className="rotate-90" />
                                </div>
                                <div className="si-row">
                                    <MapPin size={16} />
                                    <span>{dropoffLocation?.address || 'N/A'}</span>
                                </div>
                                <div className="si-row mt-4 pt-4 border-t border-gray-100">
                                    <Calendar size={16} />
                                    <span>{bookingDate ? new Date(bookingDate).toLocaleString('az-AZ') : 'N/A'}</span>
                                </div>
                                <div className="si-row">
                                    <Users size={16} />
                                    <span>{paxCount} Sərnişin</span>
                                </div>
                            </div>

                            <div className="total-calculation mb-8">
                                <div className="flex justify-between items-center text-xl font-black text-gray-900">
                                    <span>Yekun Məbləğ</span>
                                    <span>{totalPrice} AZN</span>
                                </div>
                            </div>

                            <button
                                className={`btn-complete-booking ${bookingLoading ? 'loading' : ''}`}
                                onClick={handleBooking}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? (
                                    <div className="loader-sm"></div>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} />
                                        Sifarişi Tamamla
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium text-center">
                                <Info size={14} />
                                Seçdiyiniz üsula görə ödəmə baş tutacaq
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

