import { useState, useCallback } from 'react';
import { tourApi } from '../api/tour.api';
import type { ITourAvailabilityResponse } from '../types';

export function useTourAvailability() {
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState<ITourAvailabilityResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const checkAvailability = useCallback(async (tourId: string, date: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await tourApi.getTourAvailability(tourId, date);
            setAvailability(response.data);
            return response.data;
        } catch (err: any) {
            const msg = err.message || 'Failed to check availability';
            setError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const resetAvailability = () => {
        setAvailability(null);
        setError(null);
    };

    return {
        checkAvailability,
        resetAvailability,
        availability,
        loading,
        error
    };
}
