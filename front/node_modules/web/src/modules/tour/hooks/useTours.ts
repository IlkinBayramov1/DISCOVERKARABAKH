import { useState, useEffect, useCallback } from 'react';
import { tourWebApi } from '../api/tour.api';
import type { ITour, ITourFilters } from '../types';

export function useTours(initialFilters?: ITourFilters) {
    const [tours, setTours] = useState<ITour[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Pagination state
    const [page, setPage] = useState(initialFilters?.page || 1);
    const [limit] = useState(initialFilters?.limit || 10);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchTours = useCallback(async (filters?: ITourFilters) => {
        setLoading(true);
        setError(null);
        try {
            const currentFilters = {
                ...filters,
                page: filters?.page ?? page,
                limit: filters?.limit ?? limit
            };
            
            const data = await tourWebApi.getTours(currentFilters);
            
            if (data?.data && Array.isArray(data.data)) {
                setTours(data.data);
                if (data.pagination) {
                    setTotalCount(data.pagination.totalCount || 0);
                    setTotalPages(data.pagination.totalPages || 0);
                    setPage(data.pagination.page || page);
                }
            } else if (Array.isArray(data)) {
                setTours(data);
                setTotalCount(data.length);
                setTotalPages(1);
            } else {
                setTours([]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tours');
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        fetchTours(initialFilters);
    }, [
        JSON.stringify(initialFilters),
        page
    ]);

    return { 
        tours, 
        loading, 
        error, 
        refetch: fetchTours,
        pagination: {
            page,
            setPage,
            totalCount,
            totalPages,
            limit
        }
    };
}
