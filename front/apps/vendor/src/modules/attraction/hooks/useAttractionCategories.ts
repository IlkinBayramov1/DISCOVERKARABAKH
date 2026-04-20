import { useState, useCallback, useEffect } from 'react';
import { vendorAttractionApi } from '../api/attraction.api';
import type { AttractionCategory } from '../types';

export function useAttractionCategories(autoFetch = true) {
    const [categories, setCategories] = useState<AttractionCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await vendorAttractionApi.getCategories();
            const payload = (response as any).data;
            setCategories(Array.isArray(payload) ? payload : []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Kateqoriyaları yükləmək mümkün olmadı');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchCategories();
        }
    }, [autoFetch, fetchCategories]);

    return {
        categories,
        loading,
        error,
        refetch: fetchCategories
    };
}
