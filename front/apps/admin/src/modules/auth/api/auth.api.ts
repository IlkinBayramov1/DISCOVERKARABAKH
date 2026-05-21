import axios from 'axios';
import type { AuthResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
            email,
            password
        });
        return response.data;
    }
};
