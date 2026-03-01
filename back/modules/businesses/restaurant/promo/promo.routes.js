import { Router } from 'express';
import promoController from './promo.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router({ mergeParams: true });

// Mounted via /api/v1/restaurants/:restaurantId/promos

router.post('/', authMiddleware, authorize('vendor'), promoController.create);
router.post('/validate', authMiddleware, promoController.validate);

export default router;
