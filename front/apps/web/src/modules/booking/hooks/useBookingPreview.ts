import { useCallback, useState } from 'react';
import type { BookingPreviewParams } from '../api/booking.api';
import { bookingApi } from '../api/booking.api';

export const useBookingPreview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<any | null>(null);

    const fetchPreview = useCallback(async (params: BookingPreviewParams) => {
        setLoading(true);
        setError(null);
        try {
            const res = await bookingApi.previewPrice(params);
            setPreviewData(res.data || res);
        } catch (err: any) {
            setError(err.message || 'Failed to calculate pricing');
            setPreviewData(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const resetPreview = () => setPreviewData(null);

    return { previewData, loading, error, fetchPreview, resetPreview };
};
