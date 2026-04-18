import { Router } from 'express';
import {
    createTour,
    getTours,
    getVendorTours,
    getTourById,
    getTourBySlug,
    getTourAvailability,
    updateTour,
    deleteTour
} from './tour.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import roleMiddleware from '../../../middlewares/role.middleware.js';

const router = Router();

router.get('/', getTours);
router.get('/vendor/my-tours', authMiddleware, roleMiddleware(['vendor']), getVendorTours);
router.get('/:id', getTourById);
router.get('/:id/availability', getTourAvailability);
router.get('/slug/:slug', getTourBySlug);

router.use(authMiddleware);

router.post('/', roleMiddleware(['vendor', 'admin']), createTour);
router.put('/:id', roleMiddleware(['vendor', 'admin']), updateTour);
router.delete('/:id', roleMiddleware(['vendor', 'admin']), deleteTour);

export default router;
