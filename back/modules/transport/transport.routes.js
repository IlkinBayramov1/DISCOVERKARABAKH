import { Router } from 'express';
import { createTransfer, getTransfer, getMyTransfers, updateTransferStatus, getAllTransfers, getDriverRides } from './passenger/transfer/transfer.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import vehicleRoutes from './passenger/vehicle/vehicle.routes.js';
import driverRoutes from './driver/driver.routes.js';
import passengerLocationRoutes from './passenger/location/location.routes.js';

// Cargo imports
import cargoVehicleRoutes from './cargo/vehicle/cargoVehicle.routes.js';
import shipmentRoutes from './cargo/shipment/shipment.routes.js';

import { calculateRidePrice, getPricingRules, createPricingRule, updatePricingRule, deletePricingRule } from './passenger/pricing/pricing.controller.js';
import { calculatePriceSchema, createPricingRuleSchema, updatePricingRuleSchema } from './passenger/pricing/pricing.validation.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authorize } from '../../middlewares/auth.middleware.js';
import { transportBanMiddleware, cargoRoleMiddleware } from './transport.middleware.js';

const router = Router();

// --- Public / User Routes ---
// Calculate Price (Pre-booking)
router.post('/price/calculate', validate(calculatePriceSchema), calculateRidePrice);

// Public location search (Autocomplete)
router.use('/passenger/location', passengerLocationRoutes);

// --- Protected Routes ---
router.use(authMiddleware);

// Rides (Protected by Transport Ban)
router.post('/rides', transportBanMiddleware, createTransfer);
router.get('/rides', getMyTransfers);
router.get('/rides/me', authorize('driver'), getDriverRides);
router.get('/rides/all', authorize('admin', 'vendor'), getAllTransfers);
router.get('/rides/:id', getTransfer);
router.patch('/rides/:id/status', updateTransferStatus);

// --- Admin / Vendor Routes ---
router.get('/pricing', authorize('admin', 'vendor'), getPricingRules);
router.post('/pricing', authorize('admin', 'vendor'), validate(createPricingRuleSchema), createPricingRule);
router.put('/pricing/:id', authorize('admin', 'vendor'), validate(updatePricingRuleSchema), updatePricingRule);
router.delete('/pricing/:id', authorize('admin', 'vendor'), deletePricingRule);

// Sub-modules (Passenger Transport mainly)
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);

// --- Cargo Logistics (Restricted to non-tourists) ---
router.use('/cargo/vehicles', cargoRoleMiddleware, cargoVehicleRoutes);
router.use('/cargo/shipments', cargoRoleMiddleware, shipmentRoutes);

export default router;
