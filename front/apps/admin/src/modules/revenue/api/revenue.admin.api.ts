import api from '../../../lib/axios';
import type { 
    AdminRevenueReportResponse, 
    AdminPayoutsResponse, 
    AdminPayoutActionResponse 
} from '../types';

export const revenueAdminApi = {
    /** Müəyyən dövr üçün gəlir hesabatını gətirir */
    getRevenueReport: async (params?: any): Promise<AdminRevenueReportResponse> => {
        const response = await api.get('/admins/revenue/report', { params });
        return response.data;
    },

    /** Satıcılara ediləcək ödənişlərin siyahısını gətirir */
    getPayouts: async (params?: any): Promise<AdminPayoutsResponse> => {
        const response = await api.get('/admins/revenue/payouts', { params });
        return response.data;
    },

    /** Ödənişin həyata keçirildiyini təsdiqləyir */
    processPayout: async (id: string): Promise<AdminPayoutActionResponse> => {
        const response = await api.post(`/admins/revenue/payouts/${id}/process`);
        return response.data;
    }
};

export default revenueAdminApi;
