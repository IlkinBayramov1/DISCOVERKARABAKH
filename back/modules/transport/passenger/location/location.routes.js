import { Router } from 'express';
import locationController from './location.controller.js';
import { authorize, authMiddleware } from '../../../../middlewares/auth.middleware.js';

const router = Router();

// Public / User Endpoints
router.get('/search', locationController.search);
router.post('/:id/select', locationController.selectLocation);

// Vendor / Admin Endpoints
router.use(authMiddleware);
router.post('/', authorize('admin', 'vendor'), locationController.createLocation);
router.get('/manage', authorize('admin', 'vendor'), locationController.getLocations);
router.put('/:id', authorize('admin', 'vendor'), locationController.updateLocation);
router.delete('/:id', authorize('admin', 'vendor'), locationController.deleteLocation);

export default router;
