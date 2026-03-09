/**
 * Manages JWT tokens for the end-user Web Application.
 */
export const getToken = (): string | null => {
    return localStorage.getItem('web_token');
};

export const setToken = (token: string): void => {
    localStorage.setItem('web_token', token);
};

export const removeToken = (): void => {
    localStorage.removeItem('web_token');
};
