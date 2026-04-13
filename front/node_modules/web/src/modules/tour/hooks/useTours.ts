import { useState, useEffect, useCallback } from 'react';
import { tourWebApi } from '../api/tour.api';
import type { ITour, ITourFilters } from '../types';

export function useTours(initialFilters?: ITourFilters) {
    const [tours, setTours] = useState<ITour[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTours = useCallback(async (filters?: ITourFilters) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tourWebApi.getTours(filters);
            
            if (data?.data && Array.isArray(data.data)) {
                setTours(data.data);
            } else if (Array.isArray(data)) {
                setTours(data);
            } else {
                setTours([]);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tours');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTours(initialFilters);
    }, [
        JSON.stringify(initialFilters)
    ]);

    return { tours, loading, error, refetch: fetchTours };
}
