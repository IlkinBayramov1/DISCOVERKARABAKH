import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface AdminUser {
    id: string;
    email: string;
    role: 'super_admin' | 'admin' | 'moderator';
    name: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!sessionStorage.getItem('token'));
    const navigate = useNavigate();

    // Giriş simulyasiyası
    const login = useCallback((token: string, userData: AdminUser) => {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        navigate('/dashboard');
    }, [navigate]);

    // Çıxış prosesi
    const logout = useCallback(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate]);

    // İlk yüklənmədə seansın yoxlanılması
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return {
        user,
        isAuthenticated,
        login,
        logout
    };
};
