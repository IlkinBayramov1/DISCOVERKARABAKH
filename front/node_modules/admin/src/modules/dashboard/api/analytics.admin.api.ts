import api from '../../../lib/axios';
import type { AnalyticsResponse } from '../types';

export const analyticsAdminApi = {
    /** Qlobal performans göstəricilərini və trendləri gətirir */
    getAnalytics: async (period: string = '30d'): Promise<AnalyticsResponse> => {
        const response = await api.get('/admins/analytics', { params: { period } });
        return response.data;
    }
};

export default analyticsAdminApi;
