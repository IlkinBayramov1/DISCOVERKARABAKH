import { Router } from 'express';
import {
    createShipment,
    assignDriver,
    advanceStatus,
    getShipment,
    getAllShipments,
    getMyShipments
} from './shipment.controller.js';
import { validate } from '../../../../middlewares/validate.middleware.js';
import { createShipmentSchema, assignDriverSchema, advanceStatusSchema } from './shipment.validation.js';
import { authorize } from '../../../../middlewares/auth.middleware.js';

const router = Router();

// Driver shipments
router.get('/me', authorize('driver'), getMyShipments);

// Retrieve a specific shipment
router.get('/:id', getShipment);

// Create shipment (User, Vendor, Admin)
router.post('/', validate(createShipmentSchema), createShipment);

// Vendor & Admin only routes
router.get('/', authorize('vendor', 'admin'), getAllShipments);

// Operations for Drivers, Vendors, Admins
router.post('/:id/assign', authorize('vendor', 'admin'), validate(assignDriverSchema), assignDriver);
router.patch('/:id/status', authorize('driver', 'vendor', 'admin'), validate(advanceStatusSchema), advanceStatus);

export default router;
