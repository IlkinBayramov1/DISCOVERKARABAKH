import api from '../../../lib/axios';
import type { 
    AdminNotificationResponse, 
    AdminNotificationActionResponse,
    SendAnnouncementInput
} from '../types';

export const notificationAdminApi = {
    /** Bütün bildiriş tarixçəsini və elanları gətirir */
    getNotifications: async (): Promise<AdminNotificationResponse> => {
        const response = await api.get('/admins/notifications');
        return response.data;
    },

    /** Yeni elan göndərir */
    sendAnnouncement: async (data: SendAnnouncementInput): Promise<AdminNotificationActionResponse> => {
        const response = await api.post('/admins/notifications/announcement', data);
        return response.data;
    },

    /** Bildirişi sistemdən silir */
    deleteNotification: async (id: string): Promise<AdminNotificationActionResponse> => {
        const response = await api.delete(`/admins/notifications/${id}`);
        return response.data;
    }
};

export default notificationAdminApi;
