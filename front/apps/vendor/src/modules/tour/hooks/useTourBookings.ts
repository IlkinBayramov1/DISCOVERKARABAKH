import { useState, useEffect } from 'react';
import { tourApi } from '../api/tour.api';

export function useTourBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await tourApi.getVendorBookings();
            if (response.success) {
                // Filter only tour bookings (though API should handle this, for safety)
                const tourBookings = response.data.filter(b => b.bookingType === 'tour' || b.tourId);
                setBookings(tourBookings);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return {
        bookings,
        loading,
        error,
        refetch: fetchBookings
    };
}
