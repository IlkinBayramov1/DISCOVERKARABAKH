import { Router } from 'express';
import restaurantController from './restaurant.controller.js';
import { authMiddleware, authorize } from '../../../middlewares/auth.middleware.js';

const router = Router();

// --- Public Tourism Searches ---
router.get('/search', restaurantController.search);
router.get('/:id', restaurantController.getById);
router.get('/slug/:slug', restaurantController.getBySlug);

// --- Vendor Controls ---
router.post('/', authMiddleware, authorize('vendor'), restaurantController.create);
router.put('/:id', authMiddleware, authorize('vendor'), restaurantController.update);
router.delete('/:id', authMiddleware, authorize('vendor'), restaurantController.delete);

// --- Admin Controls ---
router.patch('/:id/status', authMiddleware, authorize('admin'), restaurantController.adminUpdateStatus);

// --- Sub-Modules ---
import menuRoutes from './menu/menu.routes.js';
import promoRoutes from './promo/promo.routes.js';
router.use('/:restaurantId/menu', menuRoutes);
router.use('/:restaurantId/promos', promoRoutes);

export default router;
