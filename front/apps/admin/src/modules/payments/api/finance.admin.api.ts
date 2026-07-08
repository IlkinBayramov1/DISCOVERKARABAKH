import api from '../../../lib/axios';
import type { 
    AdminTransactionsResponse, 
    AdminTransactionDetailResponse,
    CompanyFinanceStatsResponse,
    UserFinanceStatsResponse,
    UserFinancialDetailsResponse
} from '../types';

export const financeAdminApi = {
    /** Bütün tranzaksiyaları gətirir (tarix, status və provayder filtrli) */
    getTransactions: async (params?: any): Promise<AdminTransactionsResponse> => {
        const response = await api.get('/admins/finance/transactions', { params });
        return response.data;
    },

    /** Tranzaksiyanın bütün texniki detallarını gətirir */
    getTransactionDetails: async (id: string): Promise<AdminTransactionDetailResponse> => {
        const response = await api.get(`/admins/finance/transactions/${id}`);
        return response.data;
    },

    /** Şirkət dövriyyə statistikasını gətirir */
    getCompanyStats: async (params?: any): Promise<CompanyFinanceStatsResponse> => {
        const response = await api.get('/admins/finance/stats/companies', { params });
        return response.data;
    },

    /** İstifadəçi cüzdan və xərc statistikasını gətirir */
    getUserStats: async (params?: any): Promise<UserFinanceStatsResponse> => {
        const response = await api.get('/admins/finance/stats/users', { params });
        return response.data;
    },

    /** İstifadəçinin ətraflı maliyyə hesabatını (cüzdan, kart, bronlar) gətirir */
    getUserFinancialDetails: async (id: string): Promise<UserFinancialDetailsResponse> => {
        const response = await api.get(`/admins/finance/stats/users/${id}`);
        return response.data;
    }
};

export default financeAdminApi;
