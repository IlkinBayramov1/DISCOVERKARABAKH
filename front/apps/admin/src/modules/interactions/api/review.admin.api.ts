import api from '../../../lib/axios';
import type { AdminReviewsResponse, AdminReviewActionResponse, ReviewStatus } from '../types';

export const reviewAdminApi = {
    /** Bütün rəyləri gətirir (status və hədəf tipli filtrli) */
    getReviews: async (params?: any): Promise<AdminReviewsResponse> => {
        const response = await api.get('/admins/reviews', { params });
        return response.data;
    },

    /** Rəyin statusunu dəyişir (approved, rejected, flagged) */
    updateReviewStatus: async (id: string, status: ReviewStatus): Promise<AdminReviewActionResponse> => {
        const response = await api.patch(`/admins/reviews/${id}/status`, { status });
        return response.data;
    },

    /** Rəyi sistemdən tamamilə silir */
    deleteReview: async (id: string): Promise<AdminReviewActionResponse> => {
        const response = await api.delete(`/admins/reviews/${id}`);
        return response.data;
    }
};

export default reviewAdminApi;
