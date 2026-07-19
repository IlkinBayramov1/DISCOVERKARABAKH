import api from '../../../lib/axios';
import type { AnalyticsResponse } from '../types';

export const analyticsAdminApi = {
    /** Qlobal performans göstəricilərini və trendləri gətirir */
    getAnalytics: async (period: string = '30d', refresh: boolean = false): Promise<AnalyticsResponse> => {
        const response = await api.get('/admins/analytics', { 
            params: { period, refresh: refresh ? 'true' : undefined } 
        });
        return response.data;
    }
};

export default analyticsAdminApi;
