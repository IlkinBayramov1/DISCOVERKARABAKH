import { Router } from 'express';
import {
    createHotel,
    getHotels,
    getHotelById,
    updateHotel,
    deleteHotel
} from './hotel.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import roleMiddleware from '../../../middlewares/role.middleware.js';

const router = Router();

// Public routes
router.get('/', getHotels);
router.get('/:id', getHotelById);

// Protected routes (Vendor/Admin)
router.use(authMiddleware);

router.post('/', roleMiddleware(['vendor', 'admin']), createHotel);
router.put('/:id', roleMiddleware(['vendor', 'admin']), updateHotel);
router.delete('/:id', roleMiddleware(['vendor', 'admin']), deleteHotel);

export default router;
