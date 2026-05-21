import type { ILoginCredentials, IVendorRegisterPayload } from '../types';
import type { IAuthResponse } from '@/shared/types/auth.types';
import { httpClient } from '@/shared/api/httpClient';

export const authApi = {
    /**
     * Logs in a vendor user
     */
    async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
        return httpClient<IAuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    /**
     * Registers a new vendor
     */
    async registerVendor(payload: IVendorRegisterPayload): Promise<IAuthResponse> {
        return httpClient<IAuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
};
