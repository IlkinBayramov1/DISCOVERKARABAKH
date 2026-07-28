import api from '../../../lib/axios';
import type { AuthResponse } from '../types';

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', {
            email,
            password
        });
        return response.data;
    }
};
