const TOKEN_KEY = '@dk_vendor_token';
const CATEGORY_KEY = '@dk_vendor_category';

export const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
};

export const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(TOKEN_KEY);
    }
    return null;
};

export const setVendorCategory = (category: string): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem(CATEGORY_KEY, category);
    }
};

export const getVendorCategory = (): string | null => {
    if (typeof window !== 'undefined') {
        return sessionStorage.getItem(CATEGORY_KEY);
    }
    return null;
};

export const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(CATEGORY_KEY);
    }
};

export const isAuthenticated = (): boolean => {
    const token = getToken();
    return !!token && token !== 'undefined' && token !== 'null' && token.length > 10;
};

export const clearAuthData = (): void => {
    removeToken();
};
