import api from '../../../lib/axios';
import type {
    PendingBusinessesResponse,
    Hotel,
    BlacklistEntry,
    BlacklistCreate,
    FraudRiskLog,
    AnalyticsResponse,
    PricingRule,
    PricingRuleCreate,
    User,
    BusinessStatus
} from '../types';

export const businessApi = {
    /**
     * ==========================================
     * İstifadəçilər və Satıcılar (Vendors)
     * ==========================================
     */

    /** Bütün istifadəçiləri (və ya yalnız vendorları) gətirir */
    getVendors: async () => {
        const response = await api.get<{ success: boolean; data: User[] }>('/admins/users');
        return response.data.data.filter(u => u.role === 'vendor');
    },

    /**
     * ==========================================
     * Biznes İdarəetməsi (Global)
     * ==========================================
     */

    /** Bütün biznesləri (type və statusa görə süzülmüş) gətirir */
    getBusinesses: async (params: { type?: 'hotel' | 'restaurant' | 'tour'; status?: BusinessStatus }) => {
        const response = await api.get<{ success: boolean; data: any }>('/admins/businesses', {
            params
        });
        return response.data.data;
    },
    
    /** Təsdiq gözləyən bütün biznesləri gətirir */
    getPendingBusinesses: async () => {
        const response = await api.get<{ success: boolean; data: PendingBusinessesResponse }>('/admins/businesses/pending');
        return response.data.data;
    },

    /** Konkret bir biznesi təsdiqləyir */
    approveBusiness: async (type: 'hotel' | 'restaurant' | 'tour', id: string) => {
        const response = await api.patch(`/admins/businesses/${type}/${id}/approve`);
        return response.data;
    },

    /** Hotelin detal məlumatlarını gətirir */
    getHotelDetails: async (id: string) => {
        const response = await api.get<{ success: boolean; data: Hotel }>(`/hotels/${id}`);
        return response.data.data;
    },

    /**
     * ==========================================
     * Moderasiya və Təhlükəsizlik (Fraud)
     * ==========================================
     */

    /** Qara siyahını gətirir */
    getBlacklist: async () => {
        const response = await api.get<{ success: boolean; data: BlacklistEntry[] }>('/admins/fraud/blacklist');
        return response.data.data;
    },

    /** Qara siyahıya element əlavə edir */
    addToBlacklist: async (data: BlacklistCreate) => {
        const response = await api.post('/admins/fraud/blacklist', data);
        return response.data;
    },

    /** Qara siyahıdan element silir */
    removeFromBlacklist: async (id: string) => {
        const response = await api.delete(`/admins/fraud/blacklist/${id}`);
        return response.data;
    },

    /** Risk qiymətləndirmə loqlarını gətirir */
    getRiskLogs: async () => {
        const response = await api.get<{ success: boolean; data: FraudRiskLog[] }>('/admins/fraud/risk-logs');
        return response.data.data;
    },

    /**
     * ==========================================
     * Analitika və Hesabatlar
     * ==========================================
     */

    /** Platforma analitikasını gətirir */
    getAnalytics: async (startDate?: string, endDate?: string) => {
        const response = await api.get<{ success: boolean; data: AnalyticsResponse }>('/admins/analytics', {
            params: { startDate, endDate }
        });
        return response.data.data;
    },

    /**
     * ==========================================
     * Gəlir İdarəetməsi (Revenue Management)
     * ==========================================
     */

    /** Otelin bütün qiymət qaydalarını gətirir */
    getPricingRules: async (hotelId: string) => {
        const response = await api.get<{ success: boolean; data: PricingRule[] }>(`/admins/hotels/${hotelId}/pricing-rules`);
        return response.data.data;
    },

    /** Yeni qiymət qaydası yaradır */
    createPricingRule: async (hotelId: string, data: PricingRuleCreate) => {
        const response = await api.post(`/admins/hotels/${hotelId}/pricing-rules`, data);
        return response.data;
    },

    /** Qiymət qaydasını silir */
    deletePricingRule: async (hotelId: string, ruleId: string) => {
        const response = await api.delete(`/admins/hotels/${hotelId}/pricing-rules/${ruleId}`);
        return response.data;
    }
};
