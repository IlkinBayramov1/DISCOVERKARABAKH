import { useQuery } from '@tanstack/react-query';
import analyticsAdminApi from '../api/analytics.admin.api';

/** Dashboard analitikalarını (statistikalar, trendlər, son fəaliyyətlər) gətirən hook */
export const useDashboardAnalytics = (period: string = '30d') => {
    return useQuery({
        queryKey: ['admin', 'analytics', 'dashboard', period],
        queryFn: () => analyticsAdminApi.getAnalytics(period),
        // Dashboard məlumatları tez-tez dəyişə bilər, amma hər saniyə yox
        staleTime: 5 * 60 * 1000 // 5 dəqiqə
    });
};
