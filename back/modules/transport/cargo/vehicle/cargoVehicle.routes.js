import { Router } from 'express';
import {
    registerVehicle,
    getVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle
} from './cargoVehicle.controller.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { authMiddleware, authorize } from '../../../../middlewares/auth.middleware.js';
import { createCargoVehicleSchema, updateCargoVehicleSchema } from './cargoVehicle.validation.js';

const router = Router();

// Public routes for looking up vehicles
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Protected Vendor & Admin only routes
router.use(authMiddleware);
router.use(authorize('vendor', 'admin'));

router.post('/', validate(createCargoVehicleSchema), registerVehicle);
router.patch('/:id', validate(updateCargoVehicleSchema), updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;
