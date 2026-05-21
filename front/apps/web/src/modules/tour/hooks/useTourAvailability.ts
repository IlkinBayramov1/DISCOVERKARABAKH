import { useState, useCallback } from 'react';
import { tourWebApi } from '../api/tour.api';
import type { ITourAvailabilityResponse } from '../types';

export function useTourAvailability() {
    const [availability, setAvailability] = useState<ITourAvailabilityResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkAvailability = useCallback(async (tourId: string, date: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await tourWebApi.getTourAvailability(tourId, date);
            if (data.success) {
                setAvailability(data.data);
            } else {
                setError(data.message || 'Could not fetch availability');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to check availability');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        availability,
        loading,
        error,
        checkAvailability
    };
}
