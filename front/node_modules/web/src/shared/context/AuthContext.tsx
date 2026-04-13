import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authApi, type IUser } from '../../modules/auth/api/auth.api';
import { getToken, setToken, removeToken } from '../utils/token';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IAuthContext {
    user: IUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: IUser) => void;
    logout: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<IAuthContext | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser]         = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);  // true until we verify token

    // On mount: if a token exists, fetch the current user from /auth/me
    useEffect(() => {
        const token = getToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        authApi.getMe()
            .then((res) => {
                if (res.success && res.data) {
                    setUser(res.data);
                } else {
                    // Token is invalid / expired
                    removeToken();
                }
            })
            .catch(() => {
                removeToken();
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const login = (token: string, userData: IUser) => {
        setToken(token);
        setUser(userData);
    };

    const logout = () => {
        removeToken();
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): IAuthContext {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside <AuthProvider>');
    }
    return context;
}
