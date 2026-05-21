import type { VendorCategory } from '@/shared/types/auth.types';

export interface ILoginCredentials {
    email: string;
    password?: string;
}

export interface IVendorRegisterPayload {
    email: string;
    password?: string;
    role: 'vendor';
    companyName: string;
    category: VendorCategory;
}
