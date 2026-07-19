import { httpClient } from './httpClient';
import type { INotificationResponse } from '../types/notification.types';

export const notificationApi = {
    getNotifications(page = 1, limit = 20): Promise<INotificationResponse> {
        return httpClient<INotificationResponse>(`/notifications?page=${page}&limit=${limit}`);
    },

    markAsRead(id: string): Promise<any> {
        return httpClient<any>(`/notifications/${id}/read`, {
            method: 'PATCH'
        });
    },

    markAllAsRead(): Promise<any> {
        return httpClient<any>('/notifications/read-all', {
            method: 'PATCH'
        });
    },

    deleteNotification(id: string): Promise<any> {
        return httpClient<any>(`/notifications/${id}`, {
            method: 'DELETE'
        });
    }
};
