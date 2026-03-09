export type Role = 'user' | 'vendor' | 'tourist' | 'resident' | 'investor' | 'admin' | 'driver';

export interface IUser {
    id: string;
    email: string;
    role: Role;
    isActive: boolean;
    isBanned: boolean;
    isTransportBanned: boolean;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
}

export type VendorCategory =
    | 'hotel'
    | 'tour'
    | 'transport'
    | 'restaurant'
    | 'event'
    | 'attraction';

export interface IVendorProfile {
    id: string;
    companyName: string;
    category: VendorCategory;
    userId: string;
}

export interface IAuthResponse {
    success: boolean;
    data: {
        user: IUser;
        token?: string;
    };
    message?: string;
}
