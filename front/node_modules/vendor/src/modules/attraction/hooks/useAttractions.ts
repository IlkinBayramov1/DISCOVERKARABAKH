import { useState, useCallback, useEffect } from 'react';
import { vendorAttractionApi } from '../api/attraction.api';
import type { Attraction } from '../types';

export function useAttractions(autoFetch = true, initialParams: Record<string, any> = {}) {
    const [data, setData] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<Record<string, any>>(initialParams);

    const fetchAttractions = useCallback(async (currentParams = params) => {
        setLoading(true);
        setError(null);
        try {
            const response = await vendorAttractionApi.getAttractions(currentParams);
            const payload = (response as any).data;
            setData(Array.isArray(payload) ? payload : []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Məkanları yükləmək mümkün olmadı');
            }
        } finally {
            setLoading(false);
        }
    }, [params]);

    useEffect(() => {
        if (autoFetch) {
            fetchAttractions();
        }
    }, [autoFetch, fetchAttractions]);

    const createAttraction = async (payload: Partial<Attraction>) => {
        setLoading(true);
        try {
            const res = await vendorAttractionApi.createAttraction(payload);
            await fetchAttractions();
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Məkan yaradılarkən xəta baş verdi');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateAttraction = async (id: string, payload: Partial<Attraction>) => {
        setLoading(true);
        try {
            const res = await vendorAttractionApi.updateAttraction(id, payload);
            await fetchAttractions();
            return res.data;
        } catch (err: any) {
            setError(err.message || 'Məkan yenilənərkən xəta baş verdi');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteAttraction = async (id: string) => {
        setLoading(true);
        try {
            await vendorAttractionApi.deleteAttraction(id);
            await fetchAttractions();
        } catch (err: any) {
            setError(err.message || 'Məkan silinərkən xəta baş verdi');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (newParams: Record<string, any>) => {
        const updatedParams = { ...params, ...newParams };
        setParams(updatedParams);
        fetchAttractions(updatedParams);
    };

    return {
        data,
        loading,
        error,
        params,
        refetch: fetchAttractions,
        createAttraction,
        updateAttraction,
        deleteAttraction,
        handleFilterChange
    };
}
