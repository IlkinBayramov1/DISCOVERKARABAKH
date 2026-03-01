import { Router } from 'express';
import { hotelController } from './hotel.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';
import roomRoutes from '../room/room.routes.js';
import reviewRoutes from '../reviews/hotelReview.routes.js';

const router = Router();

// Public advanced search route
router.get('/', hotelController.getHotels);
router.get('/:id', hotelController.getHotelById);

// Map Nested Room Routes
router.use('/:hotelId/rooms', roomRoutes);

// Map Nested Review Routes
router.use('/:hotelId/reviews', reviewRoutes);

// Protected Vendor & Admin Routes
router.use(authMiddleware);
router.post('/', authorize('vendor', 'admin'), hotelController.create);
router.put('/:id', authorize('vendor', 'admin'), hotelController.update);
router.delete('/:id', authorize('vendor', 'admin'), hotelController.delete);

export default router;
