import api from '../../../lib/axios';
import type { 
    AdminTransactionsResponse, 
    AdminTransactionDetailResponse 
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
    }
};

export default financeAdminApi;
