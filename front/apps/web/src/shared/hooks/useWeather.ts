import { useState, useEffect, useCallback } from 'react';
import { attractionApi } from '../../modules/attraction/api/attraction.api';

export function useWeather(city: string) {
    const [weather, setWeather] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        if (!city) return;

        setIsLoading(true);
        setError(null);
        try {
            const data = await attractionApi.getWeatherByCity(city);
            setWeather(data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Weather unavailable');
            console.error('Weather fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    }, [city]);

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
