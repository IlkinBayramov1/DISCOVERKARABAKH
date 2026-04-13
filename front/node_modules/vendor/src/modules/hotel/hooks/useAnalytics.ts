import { useState, useCallback, useEffect } from 'react';
import { analyticsApi } from '../api/analytics.api';
import type { IAnalyticsResponse } from '../types';

export function useAnalytics(hotelId?: string, startDate?: string, endDate?: string) {
    const [data, setData] = useState<IAnalyticsResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await analyticsApi.getHotelAnalytics({ hotelId, startDate, endDate });
            setData(res);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    }, [hotelId, startDate, endDate]);

    useEffect(() => {
        if (hotelId) {
            fetchAnalytics();
        }
    }, [fetchAnalytics, hotelId]);

    return {
        data,
        loading,
        error,
        refetch: fetchAnalytics
    };
}
