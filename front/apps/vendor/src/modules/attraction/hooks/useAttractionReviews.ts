import { useState, useCallback, useEffect } from 'react';
import { vendorAttractionApi } from '../api/attraction.api';
import type { AttractionReview } from '../types';

export function useAttractionReviews(attractionId?: string, autoFetch = true) {
    const [reviews, setReviews] = useState<AttractionReview[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await vendorAttractionApi.getReviews(attractionId);
            const payload = (response as any).data;
            setReviews(Array.isArray(payload) ? payload : []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Rəyləri yükləmək mümkün olmadı');
            }
        } finally {
            setLoading(false);
        }
    }, [attractionId]);

    useEffect(() => {
        if (autoFetch) {
            fetchReviews();
        }
    }, [autoFetch, fetchReviews]);

    const replyToReview = async (reviewId: string, reply: string, manualAttractionId?: string) => {
        const targetId = attractionId || manualAttractionId;
        if (!targetId) return false;
        
        setLoading(true);
        try {
            await vendorAttractionApi.replyToReview(targetId, reviewId, reply);
            // Optimistic update or refetch
            setReviews(prev => prev.map(r => 
                r.id === reviewId ? { ...r, status: 'approved' } : r
            ));
            return true;
        } catch (err: any) {
            setError(err.message || 'Cavab göndərilərkən xəta baş verdi');
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
