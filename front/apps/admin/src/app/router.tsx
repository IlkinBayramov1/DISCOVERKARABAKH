import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainAdminLayout from '../components/layout/MainAdminLayout';
import Overview from '../modules/dashboard/Overview';
import UserList from '../modules/users/UserList';
import VendorApprovals from '../modules/vendors/VendorApprovals';
import BusinessApprovals from '../modules/businesses/BusinessApprovals';
import LoginPage from '../modules/auth/pages/LoginPage';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Yeni modulların importları
import BookingList from '../modules/bookings/pages/BookingList';
import PaymentList from '../modules/payments/pages/PaymentList';
import TransportManagement from '../modules/transport/pages/TransportManagement';
import ModerationList from '../modules/interactions/pages/ModerationList';
import NotificationList from '../modules/notifications/pages/NotificationList';

// Vendor Alt-modulların importları
import HotelVendors from '../modules/vendors/pages/hotels/HotelVendors';
import RestaurantVendors from '../modules/vendors/pages/restaurants/RestaurantVendors';
import TourVendors from '../modules/vendors/pages/tours/TourVendors';

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
          { 
            path: 'vendors', 
            children: [
              { index: true, element: <VendorApprovals /> },
              { path: 'hotels', element: <HotelVendors /> },
              { path: 'restaurants', element: <RestaurantVendors /> },
              { path: 'tours', element: <TourVendors /> },
            ]
          },
          { path: 'businesses', element: <BusinessApprovals /> },
          { path: 'bookings', element: <BookingList /> },
          { path: 'payments', element: <PaymentList /> },
          { path: 'transport', element: <TransportManagement /> },
          { path: 'interactions', element: <ModerationList /> },
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
