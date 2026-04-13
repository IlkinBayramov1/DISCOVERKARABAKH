import { useState, useCallback, useEffect } from 'react';
import { tourApi } from '../api/tour.api';
import type { ITour, ITourPayload } from '../types';

export function useTours(autoFetch = true) {
    const [data, setData] = useState<ITour[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTours = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await tourApi.getVendorTours();
            const payload = (response as any).data || response;
            setData(payload as ITour[]);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tours');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchTours();
        }
    }, [autoFetch, fetchTours]);

    const createTour = async (payload: ITourPayload) => {
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
        refetch: fetchTours,
        createTour,
        removeTour
    };
}
