import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    /** Giriş tələb olunan rollar. Boş buraxılsa hər login olan user keçə bilər. */
    allowedRoles?: Array<'tourist' | 'resident' | 'driver' | 'admin'>;
    /** Auth yüklənərkən göstəriləcək element (default: null — heç nə göstərmir) */
    fallback?: React.ReactNode;
}

/**
 * Qorunan route wrapper.
 *
 * İstifadə:
 * ```tsx
 * <Route element={<ProtectedRoute />}>
 *   <Route path="dashboard" element={<Dashboard />} />
 * </Route>
 *
 * // Rol əsaslı:
 * <Route element={<ProtectedRoute allowedRoles={['driver', 'admin']} />}>
 *   <Route path="driver/orders" element={<DriverOrders />} />
 * </Route>
 * ```
 */
export default function ProtectedRoute({
    allowedRoles,
    fallback = null,
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Auth yoxlanılır — gözlə
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                fontSize: '1rem',
                color: '#888',
            }}>
                {fallback || <span>Yüklənir...</span>}
            </div>
        );
    }

    // Login olmayıb → login səhifəsinə yönləndir, geri qayıtmaq üçün `from` saxla
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Rol yoxlaması — əgər allowedRoles verilib amma user-in rolu orada yoxdursa
    if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
        return <Navigate to="/" replace />;
    }

    // Keçid verilib — child route-ları render et
    return <Outlet />;
}
