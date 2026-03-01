import { Router } from 'express';
import { roomController } from './room.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

// Note: Ensure `mergeParams: true` so it can access :hotelId from the parent router
const router = Router({ mergeParams: true });

// Public reading
router.get('/', roomController.getRoomsByHotel);

// Protected editing (Vendor/Admin)
router.use(authMiddleware);
router.post('/', authorize('vendor', 'admin'), roomController.createRoomType);
router.put('/:roomId', authorize('vendor', 'admin'), roomController.updateRoomType);
router.delete('/:roomId', authorize('vendor', 'admin'), roomController.deleteRoomType);

export default router;
