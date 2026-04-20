import { useState, useCallback, useEffect } from 'react';
import { vendorAttractionApi } from '../api/attraction.api';
import type { AttractionAnalytics } from '../types';

export function useAttractionAnalytics(id: string, days: number = 90, autoFetch = true) {
    const [data, setData] = useState<AttractionAnalytics | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        try {
            const response = await vendorAttractionApi.getAnalytics(id, days);
            const payload = (response as any).data;
            setData(payload);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Analitika məlumatlarını yükləmək mümkün olmadı');
            }
        } finally {
            setLoading(false);
        }
    }, [id, days]);

    useEffect(() => {
        if (autoFetch && id) {
            fetchAnalytics();
        }
    }, [autoFetch, id, fetchAnalytics]);

    return {
        data,
        loading,
        error,
        refetch: fetchAnalytics
    };
}
