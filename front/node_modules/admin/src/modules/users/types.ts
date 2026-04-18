export type AdminUserRole = 'admin' | 'vendor' | 'user';

export interface UserStats {
    hotels: number;
    restaurants: number;
    tours: number;
    vehicles: number;
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
    vendorProfile: VendorProfile | null;
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
