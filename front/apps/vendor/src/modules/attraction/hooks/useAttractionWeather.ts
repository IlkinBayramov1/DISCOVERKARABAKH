import { useState, useCallback, useEffect } from 'react';
import { vendorAttractionApi } from '../api/attraction.api';

export function useAttractionWeather(id: string, autoFetch = true) {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = useCallback(async () => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await vendorAttractionApi.getWeather(id);
            setWeather((response as any).data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Hava məlumatını yükləmək mümkün olmadı');
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (autoFetch && id) {
            fetchWeather();
        }
    }, [autoFetch, id, fetchWeather]);

    return {
        weather,
        loading,
        error,
        refetch: fetchWeather
    };
}
