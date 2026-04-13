import { useState, useEffect, useCallback } from 'react';
import { hotelWebApi } from '../api/hotel.web.api';

export interface IReview {
    id: string;
    userId: string;
    hotelId: string;
    rating: number;
    cleanlinessScore?: number;
    locationScore?: number;
    staffScore?: number;
    comment?: string;
    createdAt: string;
    user?: {
        email: string;
    };
}

export function useHotelReviews(hotelId: string) {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = useCallback(async (targetPage: number = 1) => {
        if (!hotelId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await hotelWebApi.getReviews(hotelId, targetPage);
            // Handle both { data: [...] } and direct array if backend varies
            const reviewsData = data.data || data.reviews || data;
            const totalCount = data.total || 0;
            const pagesCount = data.totalPages || 1;

            if (targetPage === 1) {
                setReviews(reviewsData);
            } else {
                setReviews(prev => [...prev, ...reviewsData]);
            }

            setTotal(totalCount);
            setPage(targetPage);
            setTotalPages(pagesCount);
        } catch (err: any) {
            setError(err.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    }, [hotelId]);

    const submitReview = async (reviewData: any) => {
        try {
            const result = await hotelWebApi.createReview(hotelId, reviewData);
            // Refetch reviews after successful submission
            fetchReviews(1);
            return result;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to submit review');
        }
    };

    useEffect(() => {
        if (hotelId) {
            fetchReviews(1);
        }
    }, [hotelId, fetchReviews]);

    return {
        reviews,
        loading,
        error,
        total,
        page,
        totalPages,
        fetchMore: () => page < totalPages && fetchReviews(page + 1),
        submitReview,
        refresh: () => fetchReviews(1)
    };
}
