import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';
import analyticsAdminApi from '../api/analytics.admin.api';

/** Dashboard analitikalarını (statistikalar, trendlər, son fəaliyyətlər) gətirən hook */
export const useDashboardAnalytics = (period: string = '30d') => {
    const forceRefreshRef = useRef(false);

    const query = useQuery({
        queryKey: ['admin', 'analytics', 'dashboard', period],
        queryFn: async () => {
            const isRefresh = forceRefreshRef.current;
            forceRefreshRef.current = false; // Reset immediately
            return analyticsAdminApi.getAnalytics(period, isRefresh);
        },
        staleTime: 5 * 60 * 1000 // 5 minutes standard stale time
    });

    const triggerRefresh = async () => {
        forceRefreshRef.current = true;
        return query.refetch();
    };

    return {
        ...query,
        triggerRefresh
    };
};
