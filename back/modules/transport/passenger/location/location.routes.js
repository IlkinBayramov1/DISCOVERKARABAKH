import { Router } from 'express';
import locationController from './location.controller.js';
// Optional: import { authMiddleware } from '../../../../middlewares/auth.middleware.js';

const router = Router();

// /api/v1/transport/location/search?q=hazi
router.get('/search', locationController.search);

// /api/v1/transport/location/123/select
router.post('/:id/select', locationController.selectLocation);

export default router;
