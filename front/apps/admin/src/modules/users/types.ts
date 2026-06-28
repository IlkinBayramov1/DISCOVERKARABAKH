export type AdminUserRole = 'admin' | 'vendor' | 'user';

export interface UserStats {
    hotel: number;
    restaurant: number;
    tour: number;
    vehicle: number;
}

export interface VendorProfile {
    companyName: string;
    category: string;
}

export interface AdminUser {
    id: string;
    email: string;
    role: AdminUserRole;
    isBanned: boolean;
    isApproved: boolean;
    createdAt: string;
    vendorprofile: VendorProfile | null;
    _count: UserStats | null;
}

export interface AdminUsersResponse {
    success: boolean;
    count: number;
    data: AdminUser[];
}

export interface AdminUserActionResponse {
    success: boolean;
    message: string;
    data?: AdminUser;
}
