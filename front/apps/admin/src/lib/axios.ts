import axios from 'axios';

const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL && !import.meta.env.VITE_API_URL.includes('localhost')) {
        return import.meta.env.VITE_API_URL;
    }
    return typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : '/api/v1';
};

// Backend xidməti üçün baza URL
export const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json'
    }
});

// Admin üçün token əlavə edən interseptor
api.interceptors.request.use(
    (config) => {
        if (!config.baseURL || config.baseURL.includes('localhost')) {
            config.baseURL = getApiBaseUrl();
        }
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 401 xətalarını idarə edən interseptor (vaxtı keçmiş token zamanı avtomatik çıxış)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isAuthRoute = error.config?.url?.includes('/auth/login');
            if (!isAuthRoute) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
