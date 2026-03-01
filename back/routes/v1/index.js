import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from '../../modules/auth/auth.routes.js';
import userRoutes from '../../modules/users/user.routes.js';
import adminRoutes from '../../modules/admins/admin.routes.js';
import vendorRoutes from '../../modules/vendors/vendor.routes.js';

import hotelRoutes from '../../modules/businesses/hotel/hotel/hotel.routes.js';
import tourRoutes from '../../modules/businesses/tour/tour.routes.js';
import eventRoutes from '../../modules/businesses/event/event/event.routes.js';
import restaurantRoutes from '../../modules/businesses/restaurant/restaurant.routes.js';
import attractionRoutes from '../../modules/businesses/attraction/index.js';
import bookingRoutes from '../../modules/booking/booking.routes.js';
import reviewRoutes from '../../modules/interactions/review/review.routes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admins', adminRoutes);
router.use('/hotels', hotelRoutes);
router.use('/tours', tourRoutes);
router.use('/events', eventRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/attractions', attractionRoutes);
router.use('/vendors', vendorRoutes);


// Interaction Routes
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);

// Transport Routes
import transportRoutes from '../../modules/transport/transport.routes.js';
router.use('/transport', transportRoutes);

export default router;
