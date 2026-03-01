import { Router } from 'express';
import { createTransfer, getTransfer, getMyTransfers, updateTransferStatus } from './passenger/transfer/transfer.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import vehicleRoutes from './passenger/vehicle/vehicle.routes.js';
import driverRoutes from './driver/driver.routes.js';
import passengerLocationRoutes from './passenger/location/location.routes.js'; // Added import

// Cargo imports
import cargoVehicleRoutes from './cargo/vehicle/cargoVehicle.routes.js';
import shipmentRoutes from './cargo/shipment/shipment.routes.js';

import { calculateRidePrice, getPricingRules, createPricingRule } from './passenger/pricing/pricing.controller.js';
import { calculatePriceSchema, createPricingRuleSchema } from './passenger/pricing/pricing.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authorize } from '../../middlewares/auth.middleware.js';
import { transportBanMiddleware } from './transport.middleware.js';

const router = Router();

// Middleware applied to all transport routes
router.use(authMiddleware);

// --- Public / User Routes ---
// Calculate Price (Pre-booking)
router.post('/price/calculate', validate(calculatePriceSchema), calculateRidePrice);

// Rides (Protected by Transport Ban)
router.post('/rides', transportBanMiddleware, createTransfer);
router.get('/rides', getMyTransfers);
router.get('/rides/:id', getTransfer);
router.patch('/rides/:id/status', updateTransferStatus);

// --- Admin / Vendor Routes ---
router.get('/pricing', getPricingRules); // Public or Admin? Let's say public can see rules
router.post('/pricing', authorize('admin'), validate(createPricingRuleSchema), createPricingRule);

// Sub-modules (Passenger Transport mainly)
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/passenger/location', passengerLocationRoutes); // Mounted route

// --- Cargo Logistics ---
router.use('/cargo/vehicles', cargoVehicleRoutes);
router.use('/cargo/shipments', shipmentRoutes);

export default router;
