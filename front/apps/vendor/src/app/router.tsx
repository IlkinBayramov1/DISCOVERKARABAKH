import { createBrowserRouter, Navigate } from 'react-router-dom';
import VendorLogin from '../modules/auth/pages/login/VendorLogin';
import VendorRegister from '../modules/auth/pages/register/VendorRegister';
import VendorLayout from './VendorLayout';
import HotelDashboard from '../modules/hotel/pages/dashboard/HotelDashboard';
import CreateHotel from '../modules/hotel/pages/create/CreateHotel';
import Reservations from '../modules/hotel/pages/reservations/Reservations';
import RoomManagement from '../modules/hotel/pages/rooms/RoomManagement';
import Availability from '../modules/hotel/pages/availability/Availability';
import Reviews from '../modules/hotel/pages/reviews/Reviews';
import PhotosAndContent from '../modules/hotel/pages/content/PhotosAndContent';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/vendor/login" replace />
    },
    {
        path: '/vendor/login',
        element: <VendorLogin />
    },
    {
        path: '/vendor/register',
        element: <VendorRegister />
    },
    {
        path: '/vendor',
        element: <VendorLayout />,
        children: [
            {
                path: 'dashboard',
                element: <HotelDashboard />
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
                path: 'hotel/create',
                element: <CreateHotel />
            },
            {
                path: 'hotel/edit/:id',
                element: <CreateHotel />
            }
        ]
    }
]);
