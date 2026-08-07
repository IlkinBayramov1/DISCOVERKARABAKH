import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from '../shared/components/ProtectedRoute';
import ErrorBoundary from '../shared/components/Error/ErrorBoundary';
import ErrorPage from '../shared/components/Error/ErrorPage';

// ─── Minimal Page Loading Fallback Spinner ─────────────────────────────────────
const PageLoader = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{
            width: 36,
            height: 36,
            border: '3px solid #e2e8f0',
            borderTopColor: '#059669',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
);

// ─── Home Module (Home & HomeLayout remain direct for instant LCP) ─────────────
import { HomeLayout, HomePage as Home } from '../modules/home';

// Lazy-loaded Home subpages
const ExploreAboutPage = lazy(() => import('../modules/home/pages/ExploreAbout/ExploreAbout'));
const ExploreCulturePage = lazy(() => import('../modules/home/pages/ExploreCulture/ExploreCulture'));
const ExploreNaturePage = lazy(() => import('../modules/home/pages/ExploreNature/ExploreNature'));
const ArticlesPage = lazy(() => import('../modules/home/pages/Articles/Articles'));
const AccommodationPage = lazy(() => import('../modules/home/pages/Accommodation/Accommodation'));
const ContactPage = lazy(() => import('../modules/home/pages/Contact/Contact'));
const CorporatePage = lazy(() => import('../modules/home/pages/Corporate/Corporate'));
const VisaPermissionsPage = lazy(() => import('../modules/home/pages/VisaPermissions/VisaPermissions'));
const TransportationPage = lazy(() => import('../modules/home/pages/Transportation/Transportation'));
const DiscoverCardPage = lazy(() => import('../modules/home/pages/DiscoverCard/DiscoverCard'));
const PartnershipsPage = lazy(() => import('../modules/home/pages/Partnerships/Partnerships'));
const InvestmentsPage = lazy(() => import('../modules/home/pages/Investments/Investments'));
const JobsPage = lazy(() => import('../modules/home/pages/Jobs/Jobs'));
const InternationalPage = lazy(() => import('../modules/home/pages/International/International'));
const CityPage = lazy(() => import('../modules/home/pages/City/City'));

// ─── Service Layouts & Pages ───────────────────────────────────────────────────
const WebLayout = lazy(() => import('../modules/layout/WebLayout/WebLayout'));
const WebLogin = lazy(() => import('../modules/auth/pages/WebLogin'));
const WebRegister = lazy(() => import('../modules/auth/pages/WebRegister'));

const HotelSearchPage = lazy(() => import('../modules/hotel/pages/HotelSearch').then(m => ({ default: m.HotelSearchPage })));
const HotelDetailPage = lazy(() => import('../modules/hotel/pages/HotelDetail').then(m => ({ default: m.HotelDetailPage })));
const RoomDetailPage = lazy(() => import('../modules/hotel/pages/RoomDetail/RoomDetailPage').then(m => ({ default: m.RoomDetailPage })));
const ReservationPage = lazy(() => import('../modules/hotel/pages/Reservation').then(m => ({ default: m.ReservationPage })));
const BookingConfirmationPage = lazy(() => import('../modules/booking/pages/BookingConfirmation').then(m => ({ default: m.BookingConfirmationPage })));

const PassengerTransportPage = lazy(() => import('../modules/transport/pages/passenger').then(m => ({ default: m.PassengerTransportPage })));
const TransportDetailsPage = lazy(() => import('../modules/transport/pages/passenger').then(m => ({ default: m.TransportDetailsPage })));
const TransportReservationPage = lazy(() => import('../modules/transport/pages/passenger/TransportReservationPage').then(m => ({ default: m.TransportReservationPage })));
const CargoTransportPage = lazy(() => import('../modules/transport/pages/cargo/CargoTransportPage').then(m => ({ default: m.CargoTransportPage })));
const DriverTransportPage = lazy(() => import('../modules/transport/pages/driver/DriverTransportPage').then(m => ({ default: m.DriverTransportPage })));

const ToursPage = lazy(() => import('../modules/tour/pages/ToursPage/ToursPage').then(m => ({ default: m.ToursPage })));
const TourDetailsPage = lazy(() => import('../modules/tour/pages/TourDetailsPage/TourDetailsPage').then(m => ({ default: m.TourDetailsPage })));
const TourReservationPage = lazy(() => import('../modules/tour/pages/TourReservationPage/TourReservationPage').then(m => ({ default: m.TourReservationPage })));

const AttractionsPage = lazy(() => import('../modules/attraction/pages/AttractionsPage/AttractionsPage').then(m => ({ default: m.AttractionsPage })));
const AttractionDetailsPage = lazy(() => import('../modules/attraction/pages/AttractionDetailsPage/AttractionDetailsPage').then(m => ({ default: m.AttractionDetailsPage })));
const AttractionReservationPage = lazy(() => import('../modules/attraction/pages/AttractionReservationPage/AttractionReservationPage').then(m => ({ default: m.AttractionReservationPage })));

const ProfilePage = lazy(() => import('../modules/account/pages/ProfilePage/ProfilePage').then(m => ({ default: m.ProfilePage })));
const TripsPage = lazy(() => import('../modules/account/pages/TripsPage/TripsPage').then(m => ({ default: m.TripsPage })));
const FavoritesPage = lazy(() => import('../modules/account/pages/FavoritesPage/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const WalletPage = lazy(() => import('../modules/account/pages/WalletPage/WalletPage').then(m => ({ default: m.WalletPage })));

const UtilitySearch = lazy(() => import('../modules/utility/pages/UtilitySearch'));
const UtilityProviders = lazy(() => import('../modules/utility/pages/UtilityProviders'));
const UtilityConfirmationPage = lazy(() => import('../modules/utility/pages/UtilityConfirmationPage'));
const UtilityCheckoutPage = lazy(() => import('../modules/utility/pages/UtilityCheckoutPage'));

// ─── Driver Portal ────────────────────────────────────────────────────────────
const DriverLayout = lazy(() => import('../modules/driver/components/DriverLayout'));
const DriverDashboard = lazy(() => import('../modules/driver/pages/DriverDashboard'));
const DriverProfile = lazy(() => import('../modules/driver/pages/DriverProfile'));
const DriverOrders = lazy(() => import('../modules/driver/pages/DriverOrders'));

const router = createBrowserRouter([
    {
        path: '/',
        errorElement: <ErrorBoundary />,
        children: [
            {
                element: <HomeLayout />,
                children: [
                    {
                        index: true,
                        element: <Home />,
                    },
                    {
                        path: 'about',
                        element: <Suspense fallback={<PageLoader />}><ExploreAboutPage /></Suspense>,
                    },
                    {
                        path: 'explore/about',
                        element: <Suspense fallback={<PageLoader />}><ExploreAboutPage /></Suspense>,
                    },
                    {
                        path: 'explore/culture',
                        element: <Suspense fallback={<PageLoader />}><ExploreCulturePage /></Suspense>,
                    },
                    {
                        path: 'explore/nature',
                        element: <Suspense fallback={<PageLoader />}><ExploreNaturePage /></Suspense>,
                    },
                    {
                        path: 'explore/articles',
                        element: <Suspense fallback={<PageLoader />}><ArticlesPage /></Suspense>,
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
                        element: <Suspense fallback={<PageLoader />}><AttractionsPage /></Suspense>,
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
                        element: <Suspense fallback={<PageLoader />}><CorporatePage /></Suspense>,
                    },
                    {
                        path: 'corporate/investments',
                        element: <Suspense fallback={<PageLoader />}><InvestmentsPage /></Suspense>,
                    },
                    {
                        path: 'corporate/partnerships',
                        element: <Suspense fallback={<PageLoader />}><PartnershipsPage /></Suspense>,
                    },
                    {
                        path: 'corporate/international',
                        element: <Suspense fallback={<PageLoader />}><InternationalPage /></Suspense>,
                    },
                    {
                        path: 'corporate/jobs',
                        element: <Suspense fallback={<PageLoader />}><JobsPage /></Suspense>,
                    },
                    {
                        path: 'contact',
                        element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense>,
                    },
                    {
                        path: 'plan/accommodation',
                        element: <Suspense fallback={<PageLoader />}><AccommodationPage /></Suspense>,
                    },
                    {
                        path: 'plan/visa-permissions',
                        element: <Suspense fallback={<PageLoader />}><VisaPermissionsPage /></Suspense>,
                    },
                    {
                        path: 'plan/transportation',
                        element: <Suspense fallback={<PageLoader />}><TransportationPage /></Suspense>,
                    },
                    {
                        path: 'card-and-passes',
                        element: <Suspense fallback={<PageLoader />}><DiscoverCardPage /></Suspense>,
                    },
                    {
                        path: 'where/:slug',
                        element: <Suspense fallback={<PageLoader />}><CityPage /></Suspense>,
                    },
                ],
            },
            {
                element: <Suspense fallback={<PageLoader />}><WebLayout /></Suspense>,
                children: [
                    {
                        path: 'hotels',
                        element: <Suspense fallback={<PageLoader />}><HotelSearchPage /></Suspense>,
                    },
                    {
                        path: 'hotels/:id',
                        element: <Suspense fallback={<PageLoader />}><HotelDetailPage /></Suspense>,
                    },
                    {
                        path: 'hotels/:hotelId/rooms/:roomId',
                        element: <Suspense fallback={<PageLoader />}><RoomDetailPage /></Suspense>,
                    },
                    {
                        path: 'checkout',
                        element: <Suspense fallback={<PageLoader />}><ReservationPage /></Suspense>,
                    },
                    {
                        path: 'booking-confirmation/:id',
                        element: <Suspense fallback={<PageLoader />}><BookingConfirmationPage /></Suspense>,
                    },
                    {
                        path: 'tours',
                        element: <Suspense fallback={<PageLoader />}><ToursPage /></Suspense>,
                    },
                    {
                        path: 'tours/:id',
                        element: <Suspense fallback={<PageLoader />}><TourDetailsPage /></Suspense>,
                    },
                    {
                        path: 'tour-checkout',
                        element: <Suspense fallback={<PageLoader />}><TourReservationPage /></Suspense>,
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
                        element: <Suspense fallback={<PageLoader />}><AttractionsPage /></Suspense>,
                    },
                    {
                        path: 'attractions/:id',
                        element: <Suspense fallback={<PageLoader />}><AttractionDetailsPage /></Suspense>,
                    },
                    {
                        path: 'attraction-checkout',
                        element: <Suspense fallback={<PageLoader />}><AttractionReservationPage /></Suspense>,
                    },
                    {
                        path: 'transport/cargo',
                        element: <Suspense fallback={<PageLoader />}><CargoTransportPage /></Suspense>,
                    },
                    {
                        path: 'transport/passenger',
                        element: <Suspense fallback={<PageLoader />}><PassengerTransportPage /></Suspense>,
                    },
                    {
                        path: 'transport/details/:id',
                        element: <Suspense fallback={<PageLoader />}><TransportDetailsPage /></Suspense>,
                    },
                    {
                        path: 'transport-checkout',
                        element: <Suspense fallback={<PageLoader />}><TransportReservationPage /></Suspense>,
                    },
                    {
                        path: 'transport/driver',
                        element: <Suspense fallback={<PageLoader />}><DriverTransportPage /></Suspense>,
                    },
                    {
                        path: 'account/profile',
                        element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>,
                    },
                    {
                        path: 'account/wallet',
                        element: <Suspense fallback={<PageLoader />}><WalletPage /></Suspense>,
                    },
                    {
                        path: 'account/trips',
                        element: <Suspense fallback={<PageLoader />}><TripsPage /></Suspense>,
                    },
                    {
                        path: 'account/favorites',
                        element: <Suspense fallback={<PageLoader />}><FavoritesPage /></Suspense>,
                    },
                    {
                        path: 'auth/login',
                        element: <Suspense fallback={<PageLoader />}><WebLogin /></Suspense>,
                    },
                    {
                        path: 'auth/register',
                        element: <Suspense fallback={<PageLoader />}><WebRegister /></Suspense>,
                    },
                    {
                        element: <ProtectedRoute />,
                        children: [
                            {
                                path: 'utility',
                                element: <Suspense fallback={<PageLoader />}><UtilityProviders /></Suspense>,
                            },
                            {
                                path: 'utility/:provider',
                                element: <Suspense fallback={<PageLoader />}><UtilitySearch /></Suspense>,
                            },
                            {
                                path: 'utility-confirmation/:paymentId',
                                element: <Suspense fallback={<PageLoader />}><UtilityConfirmationPage /></Suspense>,
                            },
                            {
                                path: 'utility-checkout/:paymentId',
                                element: <Suspense fallback={<PageLoader />}><UtilityCheckoutPage /></Suspense>,
                            }
                        ]
                    },
                ],
            },

            {
                path: '/driver',
                element: <ProtectedRoute allowedRoles={['driver', 'admin']} />,
                children: [
                    {
                        path: '',
                        element: <Suspense fallback={<PageLoader />}><DriverLayout /></Suspense>,
                        children: [
                            { path: 'dashboard', element: <Suspense fallback={<PageLoader />}><DriverDashboard /></Suspense> },
                            { path: 'orders', element: <Suspense fallback={<PageLoader />}><DriverOrders /></Suspense> },
                            { path: 'profile', element: <Suspense fallback={<PageLoader />}><DriverProfile /></Suspense> },
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