import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, Info, Users, CreditCard } from 'lucide-react';
import "./ReservationPage.css";
import { useBookingPreview } from '../../../booking/hooks/useBookingPreview';
import { useBooking } from '../../../booking/hooks/useBooking';

export const ReservationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const hotelId = searchParams.get('hotelId');
    const roomId = searchParams.get('roomId');

    const [checkIn, setCheckIn] = useState<string>('');
    const [checkOut, setCheckOut] = useState<string>('');

    // Guest Info
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    // API Hooks
    const { fetchPreview, previewData, loading: previewLoading, error: previewError } = useBookingPreview();
    const { submitBooking, loading: bookingLoading, error: bookingError } = useBooking();

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
                        adults: 1, // Defaulting for simple mock UI for now
                        children: 0
                    }]
                });
            }
        }
    }, [checkIn, checkOut, hotelId, roomId, fetchPreview]);

    const handleBooking = async () => {
        if (!hotelId || !roomId || !checkIn || !checkOut || !firstName || !lastName) {
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
                adults: 1,
                children: 0
            }],
            guests: [{
                firstName,
                lastName,
                email
            }],
            paymentMethod
        });

        if (data && data.id) {
            navigate(`/booking-confirmation/${data.id}`);
        }
    };

    if (!hotelId || !roomId) {
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

    return (
        <div className="reservation-page py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* Left Column: Form Details */}
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure your reservation</h1>

                    {bookingError && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-100">
                            {bookingError}
                        </div>
                    )}

                    {/* Contact Info */}
                    <section className="reservation-card p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Users size={20} className="text-blue-600" /> Who's checking in?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="reservation-label">First Name</label>
                                <input 
                                    type="text" 
                                    className="reservation-input" 
                                    placeholder="e.g. John" 
                                    value={firstName} onChange={e => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="reservation-label">Last Name</label>
                                <input 
                                    type="text" 
                                    className="reservation-input" 
                                    placeholder="e.g. Doe"
                                    value={lastName} onChange={e => setLastName(e.target.value)} 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="reservation-label">Email Address</label>
                                <input 
                                    type="email" 
                                    className="reservation-input" 
                                    placeholder="Confirmation goes here" 
                                    value={email} onChange={e => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Payment Info */}
                    <section className="reservation-card p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CreditCard size={20} className="text-blue-600" /> Payment Methods
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">Secure payment processing.</p>
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center gap-3">
                            <input 
                                type="radio" 
                                name="payment" 
                                id="card" 
                                checked={paymentMethod === 'card'} 
                                onChange={() => setPaymentMethod('card')}
                                className="w-4 h-4 text-blue-600" 
                            />
                            <label htmlFor="card" className="font-medium cursor-pointer flex-1">Credit / Debit Card</label>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg flex items-center gap-3 mt-2">
                            <input 
                                type="radio" 
                                name="payment" 
                                id="cash" 
                                checked={paymentMethod === 'cash'} 
                                onChange={() => setPaymentMethod('cash')}
                                className="w-4 h-4 text-blue-600" 
                            />
                            <label htmlFor="cash" className="font-medium cursor-pointer flex-1">Pay at Property</label>
                        </div>
                    </section>
                </div>

                {/* Right Column: Pricing Engine Widget */}
                <div className="w-full lg:w-[400px]">
                    <div className="reservation-card p-6 sticky top-24">
                        <div className="mb-6 border-b border-gray-100 pb-6">
                            <h3 className="summary-title mb-2">Booking Summary</h3>
                            <p className="text-sm text-gray-500">Live Availability Enabled</p>
                        </div>

                        {/* Date Picker */}
                        <div className="pricing-box mb-6">
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <Calendar size={16} /> Choose Dates
                            </h4>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="reservation-label">Check-in</label>
                                    <input
                                        type="date"
                                        className="reservation-input text-sm bg-white"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="reservation-label">Check-out</label>
                                    <input
                                        type="date"
                                        className="reservation-input text-sm bg-white"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        min={checkIn || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing Breakdown (Live From API) */}
                        {previewLoading && (
                            <div className="mb-6 text-sm flex items-center justify-center gap-2 text-gray-500 p-4 border rounded-lg bg-gray-50">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                Calculating exact rate...
                            </div>
                        )}

                        {!previewLoading && previewError && (
                            <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg">
                                {previewError}
                            </div>
                        )}

                        {!previewLoading && !previewError && previewData && previewData.pricingResult && (
                            <div className="mb-6 space-y-3 text-sm">
                                {previewData.pricingResult.breakdowns.map((b: any, idx: number) => (
                                    <div key={idx} className="price-row">
                                        <span>Room Gross (incl. {b.log?.length || 0} nights)</span>
                                        <span>₼{b.subtotal.toFixed(2)}</span>
                                    </div>
                                ))}
                                
                                {previewData.pricingResult.taxes.map((t: any, idx: number) => (
                                    <div key={idx} className="price-row text-gray-500">
                                        <span className="flex items-center gap-1">{t.name} <Info size={12} /></span>
                                        <span>₼{t.amount.toFixed(2)}</span>
                                    </div>
                                ))}

                                <div className="price-total mt-4 pt-3 border-t border-gray-100">
                                    <span>Net Total</span>
                                    <span>₼{previewData.exactTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {!previewLoading && !previewData && !previewError && (
                            <div className="mb-6 text-sm flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-lg">
                                <Info size={16} className="shrink-0" /> 
                                <span>Select valid dates to calculate pricing based on live hotel rules & minimum stays.</span>
                            </div>
                        )}

                        <button
                            className={`booking-button flex items-center justify-center gap-2 ${(!previewData || bookingLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleBooking}
                            disabled={!previewData || bookingLoading}
                        >
                            {bookingLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    Secure & Complete
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
