import { Router } from 'express';
import { roomController } from './room.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';
import roomReviewRouter from './roomReview.routes.js';

// Note: Ensure `mergeParams: true` so it can access :hotelId from the parent router
const router = Router({ mergeParams: true });

// Attach Room Reviews router
router.use('/:roomId/reviews', roomReviewRouter);

// Public reading
router.get('/', roomController.getRoomsByHotel);

// Protected editing (Vendor/Admin)
router.use(authMiddleware);
router.post('/', authorize('vendor', 'admin'), roomController.createRoomType);
router.put('/:roomId', authorize('vendor', 'admin'), roomController.updateRoomType);
router.delete('/:roomId', authorize('vendor', 'admin'), roomController.deleteRoomType);

// Physical Rooms (101, 102...)
router.get('/physical-rooms', authorize('vendor', 'admin'), roomController.getPhysicalRooms);
router.post('/physical-rooms', authorize('vendor', 'admin'), roomController.createPhysicalRoom);
router.post('/physical-rooms/bulk', authorize('vendor', 'admin'), roomController.createBulkRooms);
router.patch('/physical-rooms/:roomId', authorize('vendor', 'admin'), roomController.updatePhysicalRoom);
router.delete('/physical-rooms/:roomId', authorize('vendor', 'admin'), roomController.deletePhysicalRoom);

export default router;
