import { Router } from 'express';
import { hotelController } from './hotel.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';
import roomRoutes from '../room/room.routes.js';
import reviewRoutes from '../reviews/hotelReview.routes.js';
import calendarRoutes from '../calendar/calendar.routes.js';
import calendarNoteRoutes from '../calendar/calendarNote.routes.js';
import revenueRoutes from '../pricing/revenue.routes.js';
import blacklistRoutes from '../fraud/blacklist.routes.js';

const router = Router();

// Public advanced search route
router.get('/', hotelController.getHotels);
router.post('/validate-coupon', hotelController.validateCoupon);

// ============================================
// Protected Vendor & Admin Routes (Must be top)
// ============================================
router.post('/', authMiddleware, authorize('vendor', 'admin'), hotelController.create);
router.get('/vendor/my-hotels', authMiddleware, authorize('vendor', 'admin'), hotelController.getVendorHotels);
router.get('/vendor/my-rooms', authMiddleware, authorize('vendor', 'admin'), hotelController.getVendorRooms);
router.get('/vendor/reviews', authMiddleware, authorize('vendor', 'admin'), hotelController.getVendorHotelReviews);
router.get('/analytics', authMiddleware, authorize('vendor', 'admin'), hotelController.getAnalytics);
router.put('/:id', authMiddleware, authorize('vendor', 'admin'), hotelController.update);
router.delete('/:id', authMiddleware, authorize('vendor', 'admin'), hotelController.delete);

// ============================================
// Dynamic ID & Nested Routes (Must be bottom)
// ============================================
router.get('/:id', hotelController.getHotelById);

// Map Nested Room Routes
router.use('/:hotelId/rooms', roomRoutes);

// Map Nested Review Routes
router.use('/:hotelId/reviews', reviewRoutes);

// Map Calendar Routes
router.use('/:hotelId/calendar', calendarRoutes);

// Map Calendar Note Routes
router.use('/:hotelId/notes', calendarNoteRoutes);

// Map Revenue Management Routes
router.use('/:hotelId/pricing-rules', revenueRoutes);

// Map Fraud/Blacklist Routes (Admin Only)
router.use('/fraud/blacklist', blacklistRoutes);

export default router;
