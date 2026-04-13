import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../../booking/api/booking.api';
import { CheckCircle, Clock, MapPin, Download } from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfirmation = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await bookingApi.getBookingDetails(id);
                setBooking(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load booking confirmation');
            } finally {
                setLoading(false);
            }
        };
        fetchConfirmation();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen py-20 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            Loading your reservation details...
        </div>;
    }

    if (error || !booking) {
        return (
            <div className="min-h-screen py-20 flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">!</div>
                    <h2 className="text-2xl font-bold mb-2">Wait, something went wrong</h2>
                    <p className="text-gray-500 mb-6">{error || 'Booking could not be loaded.'}</p>
                    <button onClick={() => navigate('/account/trips')} className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-blue-700 transition">
                        View My Trips
                    </button>
                </div>
            </div>
        );
    }

    const { 
        bookingNumber, 
        status, 
        paymentStatus, 
        paymentMethod,
        totalPrice, 
        currency,
        hotel, 
        items, 
        guests 
    } = booking;

    const primaryItem = items && items[0];
    const primaryGuest = guests && guests[0];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                
                {/* Header Success Banner */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="bg-green-600 p-8 text-center text-white">
                        <CheckCircle size={64} className="mx-auto mb-4 opacity-90" />
                        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                        <p className="text-green-100">You're all set. A digital receipt has been sent to your email.</p>
                    </div>
                    
                    <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Confirmation Number</p>
                            <p className="text-2xl font-mono font-bold text-gray-900">{bookingNumber}</p>
                        </div>
                        <button className="flex items-center gap-2 text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition">
                            <Download size={18} /> Download PDF
                        </button>
                    </div>
                </div>

                {/* Property & Stay Details */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
                    <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Stay Overview</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{hotel?.name || 'Hotel'}</h3>
                            <p className="text-gray-500 flex items-start gap-2 mb-4">
                                <MapPin size={18} className="shrink-0 mt-0.5" />
                                {hotel?.address || 'Address not provided'}
                            </p>
                            {primaryItem && primaryItem.roomType && (
                                <p className="font-medium text-gray-800">Room: {primaryItem.roomType.name}</p>
                            )}
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-xl flex gap-4">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Check-in</p>
                                <p className="font-bold text-gray-900">{primaryItem ? new Date(primaryItem.checkIn).toLocaleDateString() : 'N/A'}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Clock size={14}/> {hotel?.checkInTime || '14:00'}</p>
                            </div>
                            <div className="w-px bg-gray-200"></div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Check-out</p>
                                <p className="font-bold text-gray-900">{primaryItem ? new Date(primaryItem.checkOut).toLocaleDateString() : 'N/A'}</p>
                                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Clock size={14}/> {hotel?.checkOutTime || '12:00'}</p>
                            </div>
                        </div>
                    </div>

                    {primaryGuest && (
                        <div className="border border-gray-100 rounded-xl p-4 flex gap-4 items-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xl">
                                {primaryGuest.firstName.charAt(0)}{primaryGuest.lastName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{primaryGuest.firstName} {primaryGuest.lastName}</p>
                                <p className="text-sm text-gray-500">{primaryGuest.email}</p>
                            </div>
                            <div className="ml-auto text-right">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {status}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Payment Summary</h2>
                    
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Payment Status</span>
                        <span className={`font-semibold capitalize ${paymentStatus === 'captured' ? 'text-green-600' : 'text-amber-600'}`}>
                            {paymentStatus}
                        </span>
                    </div>
                    
                    <div className="flex justify-between items-center justify-between mb-4">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-medium">{paymentMethod || 'Credit Card'}</span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-lg">
                        <strong className="text-gray-900">Total Charged</strong>
                        <strong className="text-2xl font-bold text-gray-900">{totalPrice.toFixed(2)} {currency}</strong>
                    </div>
                </div>

                <div className="mt-8 text-center flex justify-center gap-4">
                    <button onClick={() => navigate('/hotels')} className="px-6 py-3 font-semibold text-gray-600 hover:text-gray-900 transition">
                        Explore more hotels
                    </button>
                    <button onClick={() => navigate('/account/trips')} className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition">
                        View My Trips
                    </button>
                </div>

            </div>
        </div>
    );
};
