import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/token';

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * A wrapper component that enforces authentication.
 * It strictly checks session-based tokens and redirects to login if not found.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const location = useLocation();
    const authenticated = isAuthenticated();

    if (!authenticated) {
        console.warn(`Unauthorized access attempt to ${location.pathname} - Redirecting to login`);
        // We use replace to prevent the unauthorized URL from staying in the history
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return <>{children}</>;
}
