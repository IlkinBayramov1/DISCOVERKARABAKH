import { useState, useEffect, useCallback } from 'react';
import { attractionApi } from '../api/attraction.api';

export function useAttractionWeather(id: string | undefined) {
    const [weather, setWeather] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        if (!id) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await attractionApi.getWeather(id);
            setWeather(data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch weather data');
            console.error('Weather fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    return {
        weather,
        isLoading,
        error,
        refresh: fetchWeather
    };
}
