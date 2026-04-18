import axios from 'axios';

// Backend xidməti üçün baza URL
export const api = axios.create({
    baseURL: 'http://localhost:4004/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Admin üçün token əlavə edən interseptor
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
