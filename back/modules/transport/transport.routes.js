import { Router } from 'express';
import { searchTaxis, getTransfer, getMyTransfers, updateTransferStatus, getAllTransfers, getDriverRides, acceptRide, rejectRide, arriveAtPickup, startRide, completeRide } from './passenger/transfer/transfer.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import vehicleRoutes from './passenger/vehicle/vehicle.routes.js';
import driverRoutes from './driver/driver.routes.js';
import passengerLocationRoutes from './passenger/location/location.routes.js';
import trackingRoutes from './tracking/tracking.routes.js';

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

// Public Taxi Search (Now Protected)
router.post('/rides/search', searchTaxis);

// Rides (Protected by Transport Ban)
router.get('/rides', getMyTransfers);
router.get('/rides/me', authorize('driver'), getDriverRides);
router.get('/rides/all', authorize('admin', 'vendor'), getAllTransfers);
router.get('/rides/:id', getTransfer);
router.patch('/rides/:id/status', updateTransferStatus);

// Driver Lifecycle Actions
router.post('/rides/:id/accept', authorize('driver'), acceptRide);
router.post('/rides/:id/reject', authorize('driver'), rejectRide);
router.post('/rides/:id/arrive', authorize('driver'), arriveAtPickup);
router.post('/rides/:id/start', authorize('driver'), startRide);
router.post('/rides/:id/complete', authorize('driver'), completeRide);

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

// Tracking (Websocket info docs, and REST Maps for vendors)
router.use('/tracking', trackingRoutes);

export default router;
