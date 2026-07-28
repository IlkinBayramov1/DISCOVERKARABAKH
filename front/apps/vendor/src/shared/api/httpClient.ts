import { getToken, removeToken } from '../utils/token';

const getApiBaseUrl = () => import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : '/api/v1');

export async function httpClient<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const API_BASE_URL = getApiBaseUrl();
    const token = getToken();

    const headers = new Headers(options.headers || {});

    // Only set JSON content type if it's not FormData
    if (!(options.body instanceof FormData)) {
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }
    } else {
        // Let the browser automatically set the correct Content-Type with boundary
        headers.delete('Content-Type');
    }

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
            removeToken();
            window.location.href = '/vendor/login';
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    return response.json();
}
