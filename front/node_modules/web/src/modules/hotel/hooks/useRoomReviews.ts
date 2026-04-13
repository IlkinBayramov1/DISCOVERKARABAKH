import { useState, useEffect, useCallback } from 'react';
import { hotelWebApi } from '../api/hotel.web.api';

export interface IRoomReview {
    id: string;
    userId: string;
    roomTypeId: string;
    rating: number;
    comment?: string;
    createdAt: string;
    user?: {
        email: string;
    };
}

export function useRoomReviews(hotelId: string, roomId: string) {
    const [reviews, setReviews] = useState<IRoomReview[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = useCallback(async (targetPage: number = 1) => {
        if (!hotelId || !roomId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await hotelWebApi.getRoomReviews(hotelId, roomId, targetPage);
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
            setError(err.message || 'Failed to load room reviews');
        } finally {
            setLoading(false);
        }
    }, [hotelId, roomId]);

    const submitReview = async (reviewData: any) => {
        try {
            const result = await hotelWebApi.createRoomReview(hotelId, roomId, reviewData);
            fetchReviews(1);
            return result;
        } catch (err: any) {
            throw new Error(err.message || 'Failed to submit room review');
        }
    };

    useEffect(() => {
        if (hotelId && roomId) {
            fetchReviews(1);
        }
    }, [hotelId, roomId, fetchReviews]);

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
