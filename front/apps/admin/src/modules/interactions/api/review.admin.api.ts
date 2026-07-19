import api from '../../../lib/axios';
import type { AdminReviewsResponse, AdminReviewActionResponse, ReviewStatus } from '../types';

export const reviewAdminApi = {
    /** Bütün rəyləri gətirir (status və hədəf tipli filtrli) */
    getReviews: async (params?: any): Promise<AdminReviewsResponse> => {
        const response = await api.get('/admins/reviews', { params });
        return response.data;
    },

    /** Rəyin statusunu dəyişir (approved, rejected, flagged) */
    updateReviewStatus: async (id: string, status: ReviewStatus, type: 'general' | 'attraction'): Promise<AdminReviewActionResponse> => {
        const response = await api.patch(`/admins/reviews/${id}/status`, { status, type });
        return response.data;
    },

    /** Rəyi sistemdən tamamilə silir */
    deleteReview: async (id: string, type: 'general' | 'room' | 'attraction'): Promise<AdminReviewActionResponse> => {
        const response = await api.delete(`/admins/reviews/${id}`, { params: { type } });
        return response.data;
    },

    /** Bütün şikayətləri gətirir */
    getReports: async (params?: any): Promise<{ success: boolean; data: any[] }> => {
        const response = await api.get('/admins/reviews/reports', { params });
        return response.data;
    },

    /** Şikayətin statusunu yeniləyir */
    updateReportStatus: async (reportId: string, status: string): Promise<{ success: boolean; data: any }> => {
        const response = await api.patch(`/admins/reviews/reports/${reportId}`, { status });
        return response.data;
    }
};

export default reviewAdminApi;
