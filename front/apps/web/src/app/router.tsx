import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from '../shared/components/ProtectedRoute';

// ─── Home Module ─────────────────────────────────────────────────────────────
import {
    HomeLayout,
    HomePage as Home,
    AccommodationPage,
    ArticlesPage,
    ContactPage,
    CorporatePage,
    ExploreAboutPage,
    ExploreCulturePage,
    ExploreNaturePage,
    VisaPermissionsPage,
    TransportationPage,
    DiscoverCardPage,
    PartnershipsPage,
    InvestmentsPage,
    JobsPage,
    InternationalPage
} from '../modules/home';

import CityPage from '../modules/home/pages/City/City';
import ErrorBoundary from '../shared/components/Error/ErrorBoundary';
import ErrorPage from '../shared/components/Error/ErrorPage';

// ─── Service Layouts ─────────────────────────────────────────────────────────
import WebLayout from '../modules/layout/WebLayout/WebLayout';
import WebLogin from '../modules/auth/pages/WebLogin';
import WebRegister from '../modules/auth/pages/WebRegister';
import { HotelSearchPage } from '../modules/hotel/pages/HotelSearch';
import { HotelDetailPage } from '../modules/hotel/pages/HotelDetail';
import { RoomDetailPage } from '../modules/hotel/pages/RoomDetail/RoomDetailPage';
import { ReservationPage } from '../modules/hotel/pages/Reservation';
import { BookingConfirmationPage } from '../modules/booking/pages/BookingConfirmation';
import { PassengerTransportPage, TransportDetailsPage } from '../modules/transport/pages/passenger';
import { TransportReservationPage } from '../modules/transport/pages/passenger/TransportReservationPage';
import { CargoTransportPage } from '../modules/transport/pages/cargo/CargoTransportPage';
import { DriverTransportPage } from '../modules/transport/pages/driver/DriverTransportPage';
import { ToursPage } from '../modules/tour/pages/ToursPage/ToursPage';
import { TourDetailsPage } from '../modules/tour/pages/TourDetailsPage/TourDetailsPage';
import { TourReservationPage } from '../modules/tour/pages/TourReservationPage/TourReservationPage';
import { AttractionsPage } from '../modules/attraction/pages/AttractionsPage/AttractionsPage';
import { AttractionDetailsPage } from '../modules/attraction/pages/AttractionDetailsPage/AttractionDetailsPage';
import { AttractionReservationPage } from '../modules/attraction/pages/AttractionReservationPage/AttractionReservationPage';

import { ProfilePage } from '../modules/account/pages/ProfilePage/ProfilePage';
import { TripsPage } from '../modules/account/pages/TripsPage/TripsPage';
import { FavoritesPage } from '../modules/account/pages/FavoritesPage/FavoritesPage';
import { WalletPage } from '../modules/account/pages/WalletPage/WalletPage';
import UtilitySearch from '../modules/utility/pages/UtilitySearch';
import UtilityProviders from '../modules/utility/pages/UtilityProviders';
import UtilityConfirmationPage from '../modules/utility/pages/UtilityConfirmationPage';
import UtilityCheckoutPage from '../modules/utility/pages/UtilityCheckoutPage';

// ─── Driver Portal ────────────────────────────────────────────────────────────
import DriverLayout from '../modules/driver/components/DriverLayout';
import DriverDashboard from '../modules/driver/pages/DriverDashboard';
import DriverProfile from '../modules/driver/pages/DriverProfile';
import DriverOrders from '../modules/driver/pages/DriverOrders';

/**
 * ROUTER ARXITEKTURASI
 * ─────────────────────────────────────────────────────────────────────────────
 * React Router v6-da "pathless layout routes" istifadə olunur.
 * path olmayan element={<Layout />} — sadəcə layout wrapperı kimi işləyir.
 * Bu, iki `path: '/'` konflikitini tam aradan qaldırır.
 */
const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorBoundary />,
        children: [
            {
                // ─── HomeLayout — Landing & Content Pages ─────────────────────────────
                element: <HomeLayout />,
                children: [
                    {
                        index: true,          // localhost:PORT/  →  Home
                        element: <Home />,
                    },
                    {
                        path: 'about',
                        element: <ExploreAboutPage />,
                    },
                    {
                        path: 'explore/about',
                        element: <ExploreAboutPage />,
                    },
                    {
                        path: 'explore/culture',
                        element: <ExploreCulturePage />,
                    },
                    {
                        path: 'explore/nature',
                        element: <ExploreNaturePage />,
                    },
                    {
                        path: 'explore/articles',
                        element: <ArticlesPage />,
                    },
                    {
                        path: 'explore/articles/:slug',
                        element: <div className="p-20 text-center">Article detail coming soon…</div>,
                    },
                    {
                        path: 'things-to-do',
                        element: <div className="p-20 text-center">Things To Do coming soon…</div>,
                    },
                    {
                        path: 'things-to-do/attractions',
                        element: <AttractionsPage />,
                    },
                    {
                        path: 'things-to-do/restaurants',
                        element: <div className="p-20 text-center">Restaurants coming soon…</div>,
                    },
                    {
                        path: 'things-to-do/tours',
                        element: <div className="p-20 text-center">Guided Tours coming soon…</div>,
                    },
                    {
                        path: 'things-to-do/wellness',
                        element: <div className="p-20 text-center">Health & Wellness coming soon…</div>,
                    },
                    {
                        path: 'corporate',
                        element: <CorporatePage />,
                    },
                    {
                        path: 'corporate/investments',
                        element: <InvestmentsPage />,
                    },
                    {
                        path: 'corporate/partnerships',
                        element: <PartnershipsPage />,
                    },
                    {
                        path: 'corporate/international',
                        element: <InternationalPage />,
                    },
                    {
                        path: 'corporate/jobs',
                        element: <JobsPage />,
                    },
                    {
                        path: 'contact',
                        element: <ContactPage />,
                    },
                    {
                        path: 'plan/accommodation',
                        element: <AccommodationPage />,
                    },
                    {
                        path: 'plan/visa-permissions',
                        element: <VisaPermissionsPage />,
                    },
                    {
                        path: 'plan/transportation',
                        element: <TransportationPage />,
                    },
                    {
                        path: 'card-and-passes',
                        element: <DiscoverCardPage />,
                    },
                    {
                        // City detail — CityPage city prop-u optional etdiyi üçün placeholder göstərəcək
                        path: 'where/:slug',
                        element: <CityPage />,
                    },
                ],
            },
            {
                // ─── WebLayout — Travel Services (Search & Booking) ───────────────────
                element: <WebLayout />,
                children: [
                    {
                        path: 'hotels',
                        element: <HotelSearchPage />,
                    },
                    {
                        path: 'hotels/:id',
                        element: <HotelDetailPage />,
                    },
                    {
                        path: 'hotels/:hotelId/rooms/:roomId',
                        element: <RoomDetailPage />,
                    },
                    {
                        path: 'checkout',
                        element: <ReservationPage />,
                    },
                    {
                        path: 'booking-confirmation/:id',
                        element: <BookingConfirmationPage />,
                    },
                    {
                        path: 'tours',
                        element: <ToursPage />,
                    },
                    {
                        path: 'tours/:id',
                        element: <TourDetailsPage />,
                    },
                    {
                        path: 'tour-checkout',
                        element: <TourReservationPage />,
                    },
                    {
                        path: 'events',
                        element: <div className="p-20 text-center">Events coming soon…</div>,
                    },
                    {
                        path: 'restaurants',
                        element: <div className="p-20 text-center">Restaurants Dashboard coming soon…</div>,
                    },
                    {
                        path: 'attractions',
                        element: <AttractionsPage />,
                    },
                    {
                        path: 'attractions/:id',
                        element: <AttractionDetailsPage />,
                    },
                    {
                        path: 'attraction-checkout',
                        element: <AttractionReservationPage />,
                    },
                    {
                        path: 'transport/cargo',
                        element: <CargoTransportPage />,
                    },
                    {
                        path: 'transport/passenger',
                        element: <PassengerTransportPage />,
                    },
                    {
                        path: 'transport/details/:id',
                        element: <TransportDetailsPage />,
                    },
                    {
                        path: 'transport-checkout',
                        element: <TransportReservationPage />,
                    },
                    {
                        path: 'transport/driver',
                        element: <DriverTransportPage />,
                    },
                    {
                        path: 'account/profile',
                        element: <ProfilePage />,
                    },
                    {
                        path: 'account/wallet',
                        element: <WalletPage />,
                    },
                    {
                        path: 'account/trips',
                        element: <TripsPage />,
                    },
                    {
                        path: 'account/favorites',
                        element: <FavoritesPage />,
                    },
                    {
                        path: 'auth/login',
                        element: <WebLogin />,
                    },
                    {
                        path: 'auth/register',
                        element: <WebRegister />,
                    },
                    {
                        element: <ProtectedRoute />,
                        children: [
                            {
                                path: 'utility',
                                element: <UtilityProviders />,
                            },
                            {
                                path: 'utility/:provider',
                                element: <UtilitySearch />,
                            },
                            {
                                path: 'utility-confirmation/:paymentId',
                                element: <UtilityConfirmationPage />,
                            },
                            {
                                path: 'utility-checkout/:paymentId',
                                element: <UtilityCheckoutPage />,
                            }
                        ]
                    },
                ],
            },

            {
                // ─── Driver Portal (Standalone) ───────────────────────────────────────
                path: '/driver',
                element: <ProtectedRoute allowedRoles={['driver', 'admin']} />,
                children: [
                    {
                        path: '',
                        element: <DriverLayout />,
                        children: [
                            { path: 'dashboard', element: <DriverDashboard /> },
                            { path: 'orders', element: <DriverOrders /> },
                            { path: 'profile', element: <DriverProfile /> },
                        ],
                    },
                ],
            },
            {
                path: '*',
                element: <ErrorPage status={404} />,
            },
        ],
    },
]);

export default function AppRouter() {
    return <RouterProvider router={router} />;
}