import { useState, useCallback, useEffect } from 'react';
import { hotelApi } from '../api/hotel.api';
import type { IReviewItem } from '../types';

export function useReviews(autoFetch = true) {
    const [reviews, setReviews] = useState<IReviewItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await hotelApi.getVendorReviews();

            // Native fetch JSON format returning from backend successResponse 
            const payload = (response as any).data;

            setReviews(Array.isArray(payload) ? payload : []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to fetch reviews');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchReviews();
        }
    }, [autoFetch, fetchReviews]);

    return {
        reviews,
        loading,
        error,
        refetch: fetchReviews
    };
}
