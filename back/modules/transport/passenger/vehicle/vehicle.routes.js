import { Router } from 'express';
import { createVehicle, getVehicles, getVehicle, updateVehicle, deleteVehicle } from './vehicle.controller.js';
import { createVehicleSchema, updateVehicleSchema } from './vehicle.validation.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Only Admins and Vendors (Transport) can manage vehicles
router.post('/', authorize('admin', 'vendor'), validate(createVehicleSchema), createVehicle);
router.get('/', authorize('admin', 'vendor'), getVehicles);
router.get('/:id', authorize('admin', 'vendor'), getVehicle);
router.put('/:id', authorize('admin', 'vendor'), validate(updateVehicleSchema), updateVehicle);
router.delete('/:id', authorize('admin', 'vendor'), deleteVehicle);

export default router;
