import { createBrowserRouter, Navigate } from 'react-router-dom';
import VendorLogin from '../modules/auth/pages/login/VendorLogin';
import VendorRegister from '../modules/auth/pages/register/VendorRegister';
import VendorLayout from './VendorLayout';

// Hotel Vendor Pages
import HotelDashboard from '../modules/hotel/pages/dashboard/HotelDashboard';
import CreateHotel from '../modules/hotel/pages/create/CreateHotel';
import Reservations from '../modules/hotel/pages/reservations/Reservations';
import RoomManagement from '../modules/hotel/pages/rooms/RoomManagement/RoomManagement';
import PhysicalRooms from '../modules/hotel/pages/rooms/PhysicalRooms/PhysicalRooms';
import RoomReviews from '../modules/hotel/pages/rooms/RoomReviews/RoomReviews';
import Availability from '../modules/hotel/pages/availability/Availability/Availability';
import Reviews from '../modules/hotel/pages/reviews/Reviews';
import PhotosAndContent from '../modules/hotel/pages/content/PhotosAndContent';
import PricingRules from '@/modules/hotel/pages/pricing/PricingRules';
import MyHotel from '../modules/hotel/pages/my-hotel/MyHotel';

// Transport Vendor Pages
import VendorFleetPage from '../modules/transport/pages/VendorFleetPage/VendorFleetPage';
import VendorDriverPage from '../modules/transport/pages/VendorDriverPage/VendorDriverPage';
import VendorPricingPage from '../modules/transport/pages/VendorPricingPage/VendorPricingPage';
import VendorTransportOrdersPage from '../modules/transport/pages/VendorTransportOrdersPage/VendorTransportOrdersPage';
import TransportDashboard from '../modules/transport/pages/dashboard/TransportDashboard';
import VendorLocationsPage from '../modules/transport/pages/VendorLocationsPage/VendorLocationsPage';
import VendorAvailabilityPage from '../modules/transport/pages/VendorAvailabilityPage/VendorAvailabilityPage';

// Tour Vendor Pages
import VendorTourDashboard from '../modules/tour/pages/VendorTourDashboard/VendorTourDashboard';
import ManageTourPage from '../modules/tour/pages/ManageTourPage/ManageTourPage';
import TourBookings from '../modules/tour/pages/TourBookings/TourBookings';
import TourReviews from '../modules/tour/pages/TourReviews/TourReviews';
import TourSchedule from '../modules/tour/pages/Schedule/TourSchedule';

// Attraction Vendor Pages
import VendorAttractionDashboard from '../modules/attraction/pages/dashboard/VendorAttractionDashboard';
import ManageAttractionPage from '../modules/attraction/pages/manage/ManageAttractionPage';
import AttractionReviews from '../modules/attraction/pages/reviews/AttractionReviews';
import AttractionAnalyticsPage from '../modules/attraction/pages/analytics/AttractionAnalyticsPage';
import AttractionBookingsPage from '../modules/attraction/pages/bookings/AttractionBookingsPage';

import DashRedirect from './DashRedirect';
import ProtectedRoute from '../shared/components/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />
    },
    {
        path: '/login',
        element: <VendorLogin />
    },
    {
        path: '/register',
        element: <VendorRegister />
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <VendorLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/login" replace />
            },
            {
                path: 'dashboard',
                element: <DashRedirect />
            },
            {
                path: 'hotel/dashboard',
                element: <HotelDashboard />
            },
            // ... (rest of the children paths were already relative or partially relative, let's keep them clean)
            {
                path: 'transport/dashboard',
                element: <TransportDashboard />
            },
            {
                path: 'reservations',
                element: <Reservations />
            },
            {
                path: 'rooms',
                element: <RoomManagement />
            },
            {
                path: 'rooms/inventory',
                element: <PhysicalRooms />
            },
            {
                path: 'rooms/reviews',
                element: <RoomReviews />
            },
            {
                path: 'availability',
                element: <Availability />
            },
            {
                path: 'reviews',
                element: <Reviews />
            },
            {
                path: 'content',
                element: <PhotosAndContent />
            },
            {
                path: 'hotel/pricing',
                element: <PricingRules />
            },
            {
                path: 'hotel/my-property',
                element: <MyHotel />
            },
            {
                path: 'hotel/create',
                element: <CreateHotel />
            },
            {
                path: 'hotel/edit/:id',
                element: <CreateHotel />
            },
            // Transport Routes
            {
                path: 'transport/fleet',
                element: <VendorFleetPage />
            },
            {
                path: 'transport/drivers',
                element: <VendorDriverPage />
            },
            {
                path: 'transport/pricing',
                element: <VendorPricingPage />
            },
            {
                path: 'transport/orders',
                element: <VendorTransportOrdersPage />
            },
            {
                path: 'transport/locations',
                element: <VendorLocationsPage />
            },
            {
                path: 'transport/availability',
                element: <VendorAvailabilityPage />
            },
            // Tour Routes
            {
                path: 'tours',
                element: <VendorTourDashboard />
            },
            {
                path: 'tours/create',
                element: <ManageTourPage />
            },
            {
                path: 'tours/edit/:id',
                element: <ManageTourPage />
            },
            {
                path: 'tours/bookings',
                element: <TourBookings />
            },
            {
                path: 'tours/reviews',
                element: <TourReviews />
            },
            {
                path: 'tours/schedule',
                element: <TourSchedule />
            },
            // Attraction Routes
            {
                path: 'attractions',
                element: <VendorAttractionDashboard />
            },
            {
                path: 'attractions/create',
                element: <ManageAttractionPage />
            },
            {
                path: 'attractions/edit/:id',
                element: <ManageAttractionPage />
            },
            {
                path: 'attractions/reviews',
                element: <AttractionReviews />
            },
            {
                path: 'attractions/analytics',
                element: <AttractionAnalyticsPage />
            },
            {
                path: 'attractions/bookings',
                element: <AttractionBookingsPage />
            },
            {
                path: 'attractions/analytics/:id',
                element: <AttractionAnalyticsPage />
            },
            {
                path: '*',
                element: <Navigate to="/dashboard" replace />
            }
        ]
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />
    }
], {
    basename: '/vendor'
});
