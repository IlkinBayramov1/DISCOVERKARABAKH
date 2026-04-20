import { useState, useCallback, useEffect } from 'react';
import { attractionApi } from '../api/attraction.api';
import type { Attraction, AttractionCategory } from '../types';

interface UseAttractionsProps {
    initialParams?: {
        q?: string;
        city?: string;
        categoryId?: string;
        status?: string;
        page?: number;
        limit?: number;
    };
}

export function useAttractions({ initialParams = {} }: UseAttractionsProps = {}) {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [categories, setCategories] = useState<AttractionCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState(initialParams);

    const fetchAttractions = useCallback(async (currentParams: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await attractionApi.getAttractions(currentParams);
            setAttractions(data.data || []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch attractions');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await attractionApi.getCategories();
            setCategories(data.data || []);
        } catch (err: any) {
            console.error('Failed to fetch attraction categories');
        }
    }, []);

    useEffect(() => {
        fetchAttractions(params);
    }, [params, fetchAttractions]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const updateFilters = useCallback((newParams: Partial<typeof initialParams>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    }, []);

    const handleSearch = useCallback((query: string) => {
        setParams(prev => ({ ...prev, q: query, page: 1 }));
    }, []);

    return {
        attractions,
        categories,
        isLoading,
        error,
        updateFilters,
        handleSearch,
        params,
        refresh: () => fetchAttractions(params),
    };
}
