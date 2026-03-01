import { ApiError } from '../../../../core/api.error.js';

/**
 * Pure Function Rule Engine for Cargo Shipments
 * Each rule checks a specific dimension of the shipment against the vehicle/driver.
 * Throws an ApiError if the rule is violated.
 */

export const checkWeightLimit = (shipment, vehicle, driver) => {
    if (shipment.weightKg > vehicle.maxWeightKg) {
        throw ApiError.badRequest(`Shipment weight (${shipment.weightKg}kg) exceeds vehicle capacity (${vehicle.maxWeightKg}kg).`);
    }
};

export const checkVolumeLimit = (shipment, vehicle, driver) => {
    // If volume is provided, check it. Sometimes volume is calculated from dimensions.
    if (shipment.volumeM3 && vehicle.maxVolumeM3) {
        if (shipment.volumeM3 > vehicle.maxVolumeM3) {
            throw ApiError.badRequest(`Shipment volume (${shipment.volumeM3}m3) exceeds vehicle capacity (${vehicle.maxVolumeM3}m3).`);
        }
    }
};

export const checkTemperature = (shipment, vehicle, driver) => {
    if (shipment.requiresRefrigeration) {
        if (!vehicle.isRefrigerated) {
            throw ApiError.badRequest('Shipment requires refrigeration, but the selected vehicle is not refrigerated.');
        }

        // Also ensure driver has REFRIGERATED capability
        const hasCapability = driver?.capabilities?.some(c => c.capability === 'REFRIGERATED');
        if (!hasCapability) {
            throw ApiError.badRequest('Assigned driver does not have the REFRIGERATED cargo capability.');
        }
    }
};

export const checkHazardous = (shipment, vehicle, driver) => {
    if (shipment.isHazardous) {
        const hasCapability = driver?.capabilities?.some(c => c.capability === 'HAZARDOUS');
        if (!hasCapability) {
            throw ApiError.badRequest('Shipment is hazardous, but the assigned driver lacks HAZARDOUS capability.');
        }
    }
};

export const checkInsurance = (shipment, vehicle, driver) => {
    // Example: If declared value > 50000, ensure vehicle insurance is valid
    if (shipment.declaredValue > 50000) {
        if (!vehicle.insuranceValidUntil || new Date(vehicle.insuranceValidUntil) < new Date()) {
            throw ApiError.badRequest('High value shipments require active vehicle insurance.');
        }
    }
};

/**
 * The Rule Engine Executor
 * Runs an array of pure functions sequentially.
 */
export const validateCargoPolicy = (shipmentContext, vehicleContext, driverContext) => {
    const rules = [
        checkWeightLimit,
        checkVolumeLimit,
        checkTemperature,
        checkHazardous,
        checkInsurance
    ];

    for (const rule of rules) {
        rule(shipmentContext, vehicleContext, driverContext);
    }
};
