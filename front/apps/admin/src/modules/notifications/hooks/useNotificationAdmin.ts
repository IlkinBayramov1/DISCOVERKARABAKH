import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import notificationAdminApi from '../api/notification.admin.api';
import type { SendAnnouncementInput } from '../types';

/** Bütün bildirişləri gətirən hook */
export const useNotifications = () => {
    return useQuery({
        queryKey: ['admin', 'notifications'],
        queryFn: () => notificationAdminApi.getNotifications()
    });
};

/** Bildiriş və elan əməliyyatları üçün hook (göndər, sil) */
export const useNotificationActions = () => {
    const queryClient = useQueryClient();

    /** Yeni elan göndərir */
    const sendAnnouncementMutation = useMutation({
        mutationFn: (data: SendAnnouncementInput) => notificationAdminApi.sendAnnouncement(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
        }
    });

    /** Bildirişi silir */
    const deleteNotificationMutation = useMutation({
        mutationFn: (id: string) => notificationAdminApi.deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] });
        }
    });

    return {
        sendAnnouncement: sendAnnouncementMutation.mutateAsync,
        isSending: sendAnnouncementMutation.isPending,
        
        deleteNotification: deleteNotificationMutation.mutateAsync,
        isDeleting: deleteNotificationMutation.isPending
    };
};
