import api from '../../../lib/axios';
import type { 
    AdminPromotionsResponse, 
    AdminPromotionActionResponse, 
    PromotionCreateInput 
} from '../types';

export const promotionAdminApi = {
    /** Mövcud olan bütün kuponları gətirir */
    getPromotions: async (): Promise<AdminPromotionsResponse> => {
        const response = await api.get('/admins/promotions');
        return response.data;
    },

    /** Yeni administrativ kupon yaradılması */
    createPromotion: async (data: PromotionCreateInput): Promise<AdminPromotionActionResponse> => {
        const response = await api.post('/admins/promotions', data);
        return response.data;
    },

    /** Kuponun sistemdən silinməsi */
    deletePromotion: async (id: string): Promise<AdminPromotionActionResponse> => {
        const response = await api.delete(`/admins/promotions/${id}`);
        return response.data;
    }
};

export default promotionAdminApi;
