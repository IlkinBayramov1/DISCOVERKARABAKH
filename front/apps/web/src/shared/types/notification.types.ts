export interface INotification {
    id: string;
    type: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    link: string | null;
}

export interface INotificationResponse {
    success: boolean;
    data: {
        notifications: INotification[];
        unreadCount: number;
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    };
    message?: string;
}
