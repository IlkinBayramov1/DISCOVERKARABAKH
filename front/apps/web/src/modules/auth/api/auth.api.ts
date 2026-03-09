import { httpClient } from '../../../shared/api/httpClient';

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IUserRegisterPayload {
    email: string;
    password: string;
    role: 'tourist' | 'resident';
}

export interface IAuthResponse {
    success: boolean;
    data?: {
        token: string;
        user: any;
    };
    message?: string;
}

export const authApi = {
    login: async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
        const response = await httpClient.post<IAuthResponse>('/auth/login', credentials);
        return response.data;
    },

    registerUser: async (payload: IUserRegisterPayload): Promise<IAuthResponse> => {
        const response = await httpClient.post<IAuthResponse>('/auth/register', payload);
        return response.data;
    }
};
