import { Router } from 'express';
import { hotelController } from './hotel.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';
import roomRoutes from '../room/room.routes.js';
import reviewRoutes from '../reviews/hotelReview.routes.js';
import calendarRoutes from '../calendar/calendar.routes.js';

const router = Router();

// Public advanced search route
router.get('/', hotelController.getHotels);

// ============================================
// Protected Vendor & Admin Routes (Must be top)
// ============================================
router.post('/', authMiddleware, authorize('vendor', 'admin'), hotelController.create);
router.get('/vendor/my-hotels', authMiddleware, authorize('vendor', 'admin'), hotelController.getVendorHotels);
router.get('/vendor/my-rooms', authMiddleware, authorize('vendor', 'admin'), hotelController.getVendorRooms);
router.get('/vendor/reviews', authMiddleware, authorize('vendor', 'admin'), hotelController.getVendorHotelReviews);
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

export default router;
