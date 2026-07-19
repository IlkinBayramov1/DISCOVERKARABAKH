export interface SystemNotification {
    id: string;
    title: string;
    message: string;
    type: 'announcement' | 'booking_alert' | 'system';
    target: string; // 'all', 'guest', 'vendor', or specific user ID
    bookingId?: string | null;
    isRead: boolean;
    senderId?: string | null;
    createdAt: string;
}

export interface AdminNotificationResponse {
    success: boolean;
    data: SystemNotification[];
}

export interface AdminNotificationActionResponse {
    success: boolean;
    message: string;
    data?: SystemNotification;
}

export interface SendAnnouncementInput {
    title: string;
    message: string;
    target: 'all' | 'guest' | 'vendor';
}
