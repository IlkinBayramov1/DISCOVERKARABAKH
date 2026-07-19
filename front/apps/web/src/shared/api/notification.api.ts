import { httpClient } from './httpClient';
import type { INotificationResponse } from '../types/notification.types';

export const notificationApi = {
    getNotifications: async (page = 1, limit = 20): Promise<INotificationResponse> => {
        const response = await httpClient.get<INotificationResponse>(`/notifications?page=${page}&limit=${limit}`);
        return response.data;
    },

    markAsRead: async (id: string): Promise<any> => {
        const response = await httpClient.patch<any>(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async (): Promise<any> => {
        const response = await httpClient.patch<any>('/notifications/read-all');
        return response.data;
    },

    deleteNotification: async (id: string): Promise<any> => {
        const response = await httpClient.delete<any>(`/notifications/${id}`);
        return response.data;
    }
};
