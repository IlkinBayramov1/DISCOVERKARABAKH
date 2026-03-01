import { Router } from 'express';
import { bookingController } from './booking.controller.js';
import { authMiddleware, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

// Only authenticated users can interact with bookings
router.use(authMiddleware);

router.post('/', bookingController.create);
router.get('/my', bookingController.getMine);
router.patch('/:id/cancel', bookingController.cancel);

// Vendor viewing all bookings mapped to their physical entities
router.get('/vendor', authorize('vendor'), bookingController.getVendorDashboard);

export default router;
