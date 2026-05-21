import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
    const isAuthenticated = !!sessionStorage.getItem('token');

    if (!isAuthenticated) {
        // İstifadəçi giriş etməyibsə, login səhifəsinə yönləndirilir
        return <Navigate to="/login" replace />;
    }

    // Giriş edilibsə, alt marşrutlar (admin paneli) göstərilir
    return <Outlet />;
};

export default ProtectedRoute;
