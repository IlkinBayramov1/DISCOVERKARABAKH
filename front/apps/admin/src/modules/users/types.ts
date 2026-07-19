export type AdminUserRole = 'admin' | 'vendor' | 'user' | 'tourist' | 'resident' | 'investor' | 'driver';

export interface UserStats {
    hotel: number;
    restaurant: number;
    tour: number;
    vehicle: number;
}

export interface TouristProfile {
    interests?: string;
    emergencyContact?: string;
    nationality?: string;
    passportNumber?: string;
}

export interface ResidentProfile {
    permitNumber: string;
    localAddress: string;
    familyMembers?: string;
}

export interface InvestorProfile {
    investmentFocus: string;
    budgetRange: string;
    companyName?: string;
}

import type { LicenseCategory } from '@dk/ui';

export interface DriverProfile {
    licenseNumber: string;
    licenseExpiryDate?: string;
    licenseCategories?: LicenseCategory[];
    licenseImages?: string[];
    idCardImages?: string[];
    rating?: number;
    totalRides?: number;
    vehicle?: {
        id: string;
        brand: string;
        model: string;
        plateNumber: string;
        category: string;
        color?: string;
        seats?: number;
    } | null;
}

export interface VendorProfile {
    companyName: string;
    category: string;
}

export type UserProfile = TouristProfile | ResidentProfile | InvestorProfile | DriverProfile | VendorProfile;

export interface AdminUser {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
    balance?: number;
    role: AdminUserRole;
    isBanned: boolean;
    isApproved: boolean;
    createdAt: string;
    vendorprofile: VendorProfile | null;
    profile?: UserProfile | null;
    _count: UserStats | null;
}

export interface AdminUsersResponse {
    success: boolean;
    count: number;
    data: AdminUser[];
}

export interface AdminUserDetailResponse {
    success: boolean;
    data: AdminUser;
}

export interface AdminUserActionResponse {
    success: boolean;
    message: string;
    data?: AdminUser;
}
