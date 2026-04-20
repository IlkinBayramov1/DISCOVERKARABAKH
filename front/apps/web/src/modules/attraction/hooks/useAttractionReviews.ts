import { useState, useCallback, useEffect } from 'react';
import { attractionApi } from '../api/attraction.api';
import type { AttractionReview } from '../types';
import { getToken } from '../../../shared/utils/token'; // Or however auth token is accessed in your app

export function useAttractionReviews(attractionId: string | undefined) {
    const [reviews, setReviews] = useState<AttractionReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        if (!attractionId) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const data = await attractionApi.getReviews(attractionId);
            setReviews(data.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch reviews');
        } finally {
            setIsLoading(false);
        }
    }, [attractionId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const submitReview = async (rating: number, comment?: string, images?: string[]) => {
        if (!attractionId) return { success: false, error: 'No attraction selected' };
        
        const token = getToken();
        if (!token) return { success: false, error: 'You must be logged in to leave a review' };

        try {
            await attractionApi.submitReview(attractionId, { rating, comment, images }, token);
            await fetchReviews();
            return { success: true };
        } catch (err: any) {
            return { 
                success: false, 
                error: err.response?.data?.message || 'Failed to submit review' 
            };
        }
    };

    const updateReview = async (reviewId: string, rating?: number, comment?: string) => {
        if (!attractionId) return { success: false, error: 'No attraction selected' };
        
        const token = getToken();
        if (!token) return { success: false, error: 'Authorization missing' };

        try {
            await attractionApi.updateReview(attractionId, reviewId, { rating, comment }, token);
            await fetchReviews();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || 'Update failed' };
        }
    };

    const deleteReview = async (reviewId: string) => {
        if (!attractionId) return { success: false, error: 'No attraction selected' };
        
        const token = getToken();
        if (!token) return { success: false, error: 'Authorization missing' };

        try {
            await attractionApi.deleteReview(attractionId, reviewId, token);
            await fetchReviews();
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || 'Deletion failed' };
        }
    };

    const reportReview = async (reviewId: string, reason: string, customNote?: string) => {
        if (!attractionId) return { success: false, error: 'No attraction selected' };
        
        const token = getToken();
        if (!token) return { success: false, error: 'You must be logged in to report a review' };

        try {
            await attractionApi.reportReview(attractionId, reviewId, { reason, customNote }, token);
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err.response?.data?.message || 'Report failed' };
        }
    };

    return {
        reviews,
        isLoading,
        error,
        refresh: fetchReviews,
        submitReview,
        updateReview,
        deleteReview,
        reportReview,
    };
}
