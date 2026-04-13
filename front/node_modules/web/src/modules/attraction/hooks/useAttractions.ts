import { useState, useCallback, useEffect } from 'react';
import { attractionApi } from '../api/attraction.api';
import type { Attraction, AttractionCategory } from '../types';

interface UseAttractionsProps {
    initialParams?: Record<string, any>;
}

export function useAttractions({ initialParams = {} }: UseAttractionsProps = {}) {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [categories, setCategories] = useState<AttractionCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState(initialParams);

    const fetchAttractions = useCallback(async (currentParams: Record<string, any>) => {
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
            // Assuming categories are returned inside data.data or similar structure
            // Adjust based on your generic response format
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

    const updateFilters = useCallback((newParams: Record<string, any>) => {
        setParams(prev => ({ ...prev, ...newParams }));
    }, []);

    return {
        attractions,
        categories,
        isLoading,
        error,
        updateFilters,
        params,
        refresh: () => fetchAttractions(params),
    };
}
