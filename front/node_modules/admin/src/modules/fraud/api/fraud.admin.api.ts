import api from '../../../lib/axios';
import type { 
    AdminBlacklistResponse, 
    AdminRiskLogsResponse, 
    AdminFraudActionResponse,
    BlacklistCreateInput 
} from '../types';

export const fraudAdminApi = {
    /** Qara siyahıda olan bütün elementləri gətirir */
    getBlacklist: async (): Promise<AdminBlacklistResponse> => {
        const response = await api.get('/admins/fraud/blacklist');
        return response.data;
    },

    /** Yeni element (email, ip, phone) əlavə edir */
    addToBlacklist: async (data: BlacklistCreateInput): Promise<AdminFraudActionResponse> => {
        const response = await api.post('/admins/fraud/blacklist', data);
        return response.data;
    },

    /** Elementi qara siyahıdan çıxarır */
    removeFromBlacklist: async (id: string): Promise<AdminFraudActionResponse> => {
        const response = await api.delete(`/admins/fraud/blacklist/${id}`);
        return response.data;
    },

    /** Sistem tərəfindən qeydə alınan risk loqlarını gətirir */
    getRiskLogs: async (params?: any): Promise<AdminRiskLogsResponse> => {
        const response = await api.get('/admins/fraud/risk-logs', { params });
        return response.data;
    }
};

export default fraudAdminApi;
