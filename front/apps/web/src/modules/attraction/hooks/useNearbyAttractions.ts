import { useState, useEffect } from 'react';
import { attractionApi } from '../api/attraction.api';

export const useNearbyAttractions = (lat?: number, lng?: number, radiusKm: number = 50, limit: number = 5) => {
    const [nearby, setNearby] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lat || !lng) return;

        const fetchNearby = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await attractionApi.getNearbyAttractions({ lat, lng, radiusKm, limit });
                if (response.success) {
                    setNearby(response.data);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch nearby attractions');
            } finally {
                setIsLoading(false);
            }
        };

        fetchNearby();
    }, [lat, lng, radiusKm, limit]);

    return { nearby, isLoading, error };
};
