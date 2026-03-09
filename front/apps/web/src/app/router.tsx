import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WebLayout from './WebLayout'

// Modules
import WebLogin from '../modules/auth/pages/WebLogin';
import WebRegister from '../modules/auth/pages/WebRegister';
import Home from '../modules/home/Home';
import HotelSearch from '../modules/hotel/pages/search/HotelSearch';
import HotelDetails from '../modules/hotel/pages/details/HotelDetails';

const router = createBrowserRouter([
    {
        path: '/',
        element: <WebLayout />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: 'hotels',
                element: <HotelSearch />
            },
            {
                path: 'hotels/:id',
                element: <HotelDetails />
            },
            {
                path: 'tours',
                element: <div>Tours Coming Soon</div>
            },
            {
                path: 'events',
                element: <div>Events Coming Soon</div>
            },
            {
                path: 'restaurants',
                element: <div>Restaurants Coming Soon</div>
            },
            {
                path: 'attractions',
                element: <div>Attractions Coming Soon</div>
            },
            {
                path: 'transport/cargo',
                element: <div>Cargo Transport Coming Soon</div>
            },
            {
                path: 'transport/passenger',
                element: <div>Passenger Transport Coming Soon</div>
            },
            {
                path: 'account/profile',
                element: <div>Profile Overview Coming Soon</div>
            },
            {
                path: 'account/trips',
                element: <div>My Trips Coming Soon</div>
            },
            {
                path: 'auth/login',
                element: <WebLogin />
            },
            {
                path: 'auth/register',
                element: <WebRegister />
            }
        ]
    }
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}
