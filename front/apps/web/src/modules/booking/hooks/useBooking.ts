import { useState } from 'react';
import type { CreateBookingParams } from '../api/booking.api';
import { bookingApi } from '../api/booking.api';

export const useBooking = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitBooking = async (params: CreateBookingParams) => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookingApi.createBooking(params);
            return data;
        } catch (err: any) {
            setError(err.message || 'Failed to complete booking');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { submitBooking, loading, error };
};
