import { Router } from 'express';
import { registerDriver, getMyDriverProfile, getDrivers, approveDriver, updateDriverStatus, getTransportVendors, assignDriverVehicle } from './driver.controller.js';
import { registerDriverSchema, updateStatusSchema, assignDriverVehicleSchema } from './driver.validation.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Public (for users becoming drivers)
router.get('/vendors', getTransportVendors); // Add before /register or it might treat /vendors as /:id if not careful, but no /:id GET route exists so it's fine.
router.post('/register', validate(registerDriverSchema), registerDriver);
router.get('/me', getMyDriverProfile);

// Management (Admin/Vendor)
router.get('/', authorize('admin', 'vendor'), getDrivers);
router.patch('/:id/approve', authorize('admin', 'vendor'), approveDriver);
router.patch('/:id/assign', authorize('admin', 'vendor'), validate(assignDriverVehicleSchema), assignDriverVehicle);

// Driver Actions
router.patch('/:id/status', authorize('driver'), validate(updateStatusSchema), updateDriverStatus);

export default router;
