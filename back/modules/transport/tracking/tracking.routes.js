import { Router } from 'express';
import { getFleetMap } from './tracking.controller.js';
import { authMiddleware, authorize } from '../../../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Endpoint for Vendor to get all of their drivers' current Redis coordinates
router.get('/fleet', authorize('admin', 'vendor'), getFleetMap);

export default router;
