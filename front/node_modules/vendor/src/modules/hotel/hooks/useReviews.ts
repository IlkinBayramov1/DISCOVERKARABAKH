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

    const replyToReview = async (reviewId: string, reply: string) => {
        setLoading(true);
        try {
            await hotelApi.replyToReview(reviewId, reply);
            // Optimistic update
            setReviews(prev => prev.map(r => 
                r.id === reviewId ? { ...r, vendorReply: reply } : r
            ));
            return true;
        } catch (err: any) {
            setError(err.message || 'Failed to send reply');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        reviews,
        loading,
        error,
        refetch: fetchReviews,
        replyToReview
    };
}
