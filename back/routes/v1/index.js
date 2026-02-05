import { Router } from 'express';
import healthRoutes from './health.routes.js';
import authRoutes from '../../modules/auth/auth.routes.js';
import userRoutes from '../../modules/users/user.routes.js';
import adminRoutes from '../../modules/admins/admin.routes.js';
import vendorRoutes from '../../modules/vendors/vendor.routes.js';

import hotelRoutes from '../../modules/businesses/hotel/hotel.routes.js';
import tourRoutes from '../../modules/businesses/tour/tour.routes.js';
import bookingRoutes from '../../modules/interactions/booking/booking.routes.js';
import reviewRoutes from '../../modules/interactions/review/review.routes.js';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admins', adminRoutes);
router.use('/hotels', hotelRoutes);
router.use('/tours', tourRoutes);
router.use('/vendors', vendorRoutes);


// Interaction Routes
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);

export default router;
