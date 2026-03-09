import axios, { AxiosError } from 'axios';
import { getToken, removeToken } from '../utils/token';

const API_BASE_URL = 'http://localhost:4004/api/v1'; // Update to your local or deployed backend URL

export const httpClient = axios.create({
    baseURL: API_BASE_URL,
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
        if (error.response?.status === 401 || error.response?.status === 403) {
            removeToken();
            window.location.href = '/auth/login'; // Redirect to login on invalid token
        }
        const errorMessage = (error.response?.data as any)?.message || 'An unexpected error occurred';
        console.error('API Error:', errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);
