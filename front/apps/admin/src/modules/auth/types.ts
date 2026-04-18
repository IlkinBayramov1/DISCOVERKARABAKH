export interface AdminUser {
    id: string;
    email: string;
    role: string;
    name?: string;
    permissions?: string[];
}

export interface AuthResponse {
    success: boolean;
    data: {
        user: AdminUser;
        token: string;
    };
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
}
