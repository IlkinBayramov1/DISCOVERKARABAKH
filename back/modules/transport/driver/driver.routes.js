import { Router } from 'express';
import { registerDriver, getMyDriverProfile, getDrivers, approveDriver, updateDriverStatus } from './driver.controller.js';
import { registerDriverSchema, updateStatusSchema } from './driver.validation.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Public (for users becoming drivers)
router.post('/register', validate(registerDriverSchema), registerDriver);
router.get('/me', getMyDriverProfile);

// Management (Admin/Vendor)
router.get('/', authorize('admin', 'vendor'), getDrivers);
router.patch('/:id/approve', authorize('admin', 'vendor'), approveDriver);

// Driver Actions
router.patch('/:id/status', authorize('driver'), validate(updateStatusSchema), updateDriverStatus);

export default router;
