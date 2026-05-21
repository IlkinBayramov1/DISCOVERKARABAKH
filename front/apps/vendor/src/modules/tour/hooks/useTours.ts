import { useState, useCallback, useEffect } from 'react';
import { tourApi } from '../api/tour.api';
import type { ITour, ITourPayload } from '../types';

export function useTours(autoFetch = true, initialLimit = 10) {
    const [data, setData] = useState<ITour[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initialLimit);
    const [totalCount, setTotalCount] = useState(0);

    const fetchTours = useCallback(async (customParams?: { page?: number; limit?: number }) => {
        setLoading(true);
        setError(null);
        try {
            const p = customParams?.page || page;
            const l = customParams?.limit || limit;
            
            const response = await tourApi.getVendorTours({ page: p, limit: l });
            
            setData(response.data || []);
            setTotalCount(response.count || 0);
            
            if (customParams?.page) setPage(customParams.page);
            if (customParams?.limit) setLimit(customParams.limit);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tours');
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        if (autoFetch) {
            fetchTours();
        }
    }, [autoFetch, fetchTours]);

    const createTour = async (payload: ITourPayload) => {
        // ... (previous logic)
        setLoading(true);
        setError(null);
        try {
            await tourApi.createTour(payload);
            if (autoFetch) await fetchTours();
        } catch (err: any) {
            setError(err.message || 'Failed to create tour');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeTour = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            await tourApi.deleteTour(id);
            if (autoFetch) await fetchTours();
        } catch (err: any) {
            setError(err.message || 'Failed to delete tour');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            setPage: (p: number) => fetchTours({ page: p }),
            setLimit: (l: number) => fetchTours({ limit: l, page: 1 })
        },
        refetch: fetchTours,
        createTour,
        removeTour
    };
}
