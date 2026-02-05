import { Router } from 'express';
import {
    createTour,
    getTours,
    getTourById,
    updateTour,
    deleteTour
} from './tour.controller.js';
import { authMiddleware } from '../../../middlewares/auth.middleware.js';
import roleMiddleware from '../../../middlewares/role.middleware.js';

const router = Router();

router.get('/', getTours);
router.get('/:id', getTourById);

router.use(authMiddleware);

router.post('/', roleMiddleware(['vendor', 'admin']), createTour);
router.put('/:id', roleMiddleware(['vendor', 'admin']), updateTour);
router.delete('/:id', roleMiddleware(['vendor', 'admin']), deleteTour);

export default router;
