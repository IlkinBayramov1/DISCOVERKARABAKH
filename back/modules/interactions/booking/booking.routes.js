import { Router } from 'express';
import {
    createBooking,
    getMyBookings,
    getVendorBookings
} from './booking.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import roleMiddleware from '../../../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

// Users create bookings and view their own
router.post('/', roleMiddleware(['user', 'tourist', 'resident', 'investor', 'admin']), createBooking);
router.get('/my', roleMiddleware(['user', 'tourist', 'resident', 'investor', 'admin']), getMyBookings);

// Vendors view bookings for their businesses
router.get('/vendor', roleMiddleware(['vendor', 'admin']), getVendorBookings);

export default router;
