import { Router } from 'express';
import { getVendorProfile, updateVendorProfile, banUserFromTransport } from './vendor.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
// import roleMiddleware from '../../middlewares/role.middleware.js'; // Prisma uses authMiddleware usually?
// Let's stick to authMiddleware and check role inline or use authorize()

const router = Router();

router.use(authMiddleware);

// Profile
router.get('/profile', getVendorProfile);
router.put('/profile', updateVendorProfile);

// Transport Vendor Governance
// No specific role middleware here, controller checks category.
router.post('/ban-transport', banUserFromTransport);

export default router;
