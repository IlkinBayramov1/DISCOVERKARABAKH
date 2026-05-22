import { httpClient } from '../../../shared/api/httpClient';

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IUserRegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: 'tourist' | 'resident';
}

export interface IUser {
    _id: string;
    id?: string;
    email: string;
    role: 'tourist' | 'resident' | 'driver' | 'admin';
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
    balance?: number;
}

export interface IAuthResponse {
    success: boolean;
    data?: {
        token: string;
        user: IUser;
    };
    message?: string;
}

export interface IGetMeResponse {
    success: boolean;
    data?: IUser;
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
    },

    getMe: async (): Promise<IGetMeResponse> => {
        const response = await httpClient.get<IGetMeResponse>('/auth/me');
        return response.data;
    }
};
