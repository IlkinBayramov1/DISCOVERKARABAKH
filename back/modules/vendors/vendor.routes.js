import { Router } from 'express';
import { getVendorProfile, updateVendorProfile } from './vendor.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import roleMiddleware from '../../middlewares/role.middleware.js';

const router = Router();

// Protect all vendor routes
router.use(authMiddleware);
router.use(roleMiddleware('vendor'));

router.get('/profile', getVendorProfile);
router.put('/profile', updateVendorProfile);

export default router;
