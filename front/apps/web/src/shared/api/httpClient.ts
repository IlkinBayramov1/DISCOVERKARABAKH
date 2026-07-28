import axios, { AxiosError } from 'axios';
import { getToken, removeToken } from '../utils/token';

const getApiBaseUrl = () => import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : '/api/v1');

export const httpClient = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

httpClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

httpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
            if (!isAuthRoute) {
                console.error('Auth Error at:', error.config?.url, 'Status:', error.response?.status);
                removeToken();
                window.location.href = '/auth/login'; 
            }
        }
        const errorMessage = (error.response?.data as any)?.message || 'An unexpected error occurred';
        console.error('API Error:', errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);
