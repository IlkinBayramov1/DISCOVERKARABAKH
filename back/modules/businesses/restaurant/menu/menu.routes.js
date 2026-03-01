import { Router } from 'express';
import menuController from './menu.controller.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

// Important: This router is intended to be mounted with `mergeParams: true` 
// if defined inside the restaurant router, or we specify full paths.
const router = Router({ mergeParams: true });

const vendorAuth = [authMiddleware, authorize('vendor')];

// /api/v1/restaurants/:restaurantId/menu...

// Categories
router.post('/categories', vendorAuth, menuController.createCategory);
router.delete('/categories/:categoryId', vendorAuth, menuController.deleteCategory);

// Items (belonging to a category)
router.post('/categories/:categoryId/items', vendorAuth, menuController.createItem);

// Item standalone actions
router.patch('/items/:itemId/availability', vendorAuth, menuController.toggleAvailability);
router.delete('/items/:itemId', vendorAuth, menuController.deleteItem);

// Note: GET requests for menus are inherently fetched alongside the parent `Restaurant` 
// object during `GET /restaurants/:id`, simplifying the frontend fetching structure.

export default router;
