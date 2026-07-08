import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainAdminLayout from '../components/layout/MainAdminLayout';
import Overview from '../modules/dashboard/Overview';
import UserList from '../modules/users/UserList';
import BusinessApprovals from '../modules/businesses/BusinessApprovals';
import LoginPage from '../modules/auth/pages/LoginPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Yeni modulların importları
import BookingList from '../modules/bookings/pages/BookingList';
import PaymentList from '../modules/payments/pages/PaymentList';
import TransportManagement from '../modules/transport/pages/TransportManagement';
import ModerationList from '../modules/interactions/pages/ModerationList';
import NotificationList from '../modules/notifications/pages/NotificationList';
import FraudManagement from '../modules/fraud/pages/FraudManagement';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />, // Giriş yoxlanılması bu səviyyədə edilir
    children: [
      {
        element: <MainAdminLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <Overview /> },
          { path: 'users', element: <UserList /> },
          { path: 'businesses', element: <BusinessApprovals /> },
          { path: 'bookings', element: <BookingList /> },
          { path: 'payments', element: <PaymentList /> },
          { path: 'transport', element: <TransportManagement /> },
          { path: 'interactions', element: <ModerationList /> },
          { path: 'fraud', element: <FraudManagement /> },
          { path: 'notifications', element: <NotificationList /> },
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />, // Naməlum yollar dashboard-a yönləndirilir
  }
], {
  basename: import.meta.env.VITE_BASE_PATH || '/admin'
});
