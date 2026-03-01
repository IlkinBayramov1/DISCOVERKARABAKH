import Joi from 'joi';

export const createTransferSchema = Joi.object({
    pickupLocation: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        address: Joi.string().required()
    }).required(),
    dropoffLocation: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        address: Joi.string().required()
    }).required(),
    distanceKm: Joi.number().optional(),
    durationMin: Joi.number().optional(),
    vehicleCategory: Joi.string().valid('Economy', 'Business', 'Premium', 'Minivan', 'Bus').optional()
});

export const updateStatusSchema = Joi.object({
    status: Joi.string().valid('Pending', 'DriverAssigned', 'OnWayToPickup', 'ArrivedAtPickup', 'Ongoing', 'Completed', 'Cancelled').required()
});
