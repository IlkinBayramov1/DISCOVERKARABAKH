import { Router } from 'express';
import { registerDriver, createDriver, getMyDriverProfile, getDrivers, approveDriver, updateDriverStatus, getTransportVendors, assignDriverVehicle, updateDriverLicense } from './driver.controller.js';
import { registerDriverSchema, createDriverSchema, updateStatusSchema, assignDriverVehicleSchema, updateLicenseSchema } from './driver.validation.js';
import { validate } from '../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Public (for users becoming drivers)
router.get('/vendors', getTransportVendors); // Add before /register or it might treat /vendors as /:id if not careful, but no /:id GET route exists so it's fine.
router.post('/register', validate(registerDriverSchema), registerDriver);
router.get('/me', getMyDriverProfile);

// Management (Admin/Vendor)
router.post('/create', authorize('admin', 'vendor'), validate(createDriverSchema), createDriver);
router.get('/', authorize('admin', 'vendor'), getDrivers);
router.patch('/:id/approve', authorize('admin', 'vendor'), approveDriver);
router.patch('/:id/assign', authorize('admin', 'vendor'), validate(assignDriverVehicleSchema), assignDriverVehicle);
router.put('/:id/license', authorize('admin', 'vendor'), validate(updateLicenseSchema), updateDriverLicense);

// Driver Actions
router.patch('/:id/status', authorize('driver'), validate(updateStatusSchema), updateDriverStatus);
router.put('/me/license', authorize('driver'), validate(updateLicenseSchema), updateDriverLicense);

export default router;
