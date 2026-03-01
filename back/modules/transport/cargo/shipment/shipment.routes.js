import { Router } from 'express';
import {
    createShipment,
    assignDriver,
    advanceStatus,
    getShipment
} from './shipment.controller.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { createShipmentSchema, assignDriverSchema, advanceStatusSchema } from './shipment.validation.js';
import { authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router();

// Retrieve a specific shipment
router.get('/:id', getShipment);

// Create shipment (User, Vendor, Admin)
router.post('/', validate(createShipmentSchema), createShipment);

// Operations for Drivers, Vendors, Admins
router.post('/:id/assign', authorize('vendor', 'admin'), validate(assignDriverSchema), assignDriver);
router.patch('/:id/status', authorize('driver', 'vendor', 'admin'), validate(advanceStatusSchema), advanceStatus);

export default router;
