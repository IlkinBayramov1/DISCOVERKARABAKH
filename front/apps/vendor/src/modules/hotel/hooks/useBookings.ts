import { useState, useCallback, useEffect } from 'react';
import { bookingApi } from '../api/booking.api';
import type { IBooking } from '../types';

export function useBookings(autoFetch = true) {
    const [bookings, setBookings] = useState<IBooking[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await bookingApi.getVendorBookings();
            const payload = (response as unknown as Record<string, unknown>).data || response;
            setBookings(payload as IBooking[]);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to fetch bookings');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchBookings();
        }
    }, [autoFetch, fetchBookings]);

    const updateStatus = async (id: string, action: 'approve' | 'reject') => {
        try {
            await bookingApi.updateVendorBookingStatus(id, action);
            await fetchBookings(); // Refresh the list after mutation
            return true;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to update booking status';
            alert(msg);
            return false;
        }
    };

    return {
        bookings,
        loading,
        error,
        refetch: fetchBookings,
        updateStatus
    };
}
