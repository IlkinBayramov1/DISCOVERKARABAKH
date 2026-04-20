import { useState, useEffect, useCallback } from 'react';
import { attractionApi } from '../api/attraction.api';
import type { Attraction } from '../types';

export function useAttraction(idOrSlug: string | undefined) {
    const [attraction, setAttraction] = useState<Attraction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAttraction = useCallback(async () => {
        if (!idOrSlug) return;
        
        setIsLoading(true);
        setError(null);
        try {
            const data = await attractionApi.getAttractionById(idOrSlug);
            setAttraction(data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch attraction details');
        } finally {
            setIsLoading(false);
        }
    }, [idOrSlug]);

    useEffect(() => {
        fetchAttraction();
    }, [fetchAttraction]);

    return {
        attraction,
        isLoading,
        error,
        refresh: fetchAttraction,
    };
}
