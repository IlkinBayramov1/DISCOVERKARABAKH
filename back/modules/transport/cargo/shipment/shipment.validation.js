import Joi from 'joi';

export const createShipmentSchema = Joi.object({
    idempotencyKey: Joi.string().optional(),
    pickupLocation: Joi.object().required(),
    dropoffLocation: Joi.object().required(),
    weightKg: Joi.number().positive().required(),
    volumeM3: Joi.number().positive().optional(),
    dimensions: Joi.object({
        length: Joi.number(),
        width: Joi.number(),
        height: Joi.number()
    }).optional(),
    cargoDescription: Joi.string().optional(),
    isHazardous: Joi.boolean().default(false),
    requiresRefrigeration: Joi.boolean().default(false),
    declaredValue: Joi.number().min(0).optional()
});

export const assignDriverSchema = Joi.object({
    cargoVehicleId: Joi.string().uuid().required(),
    driverProfileId: Joi.string().uuid().required()
});

export const advanceStatusSchema = Joi.object({
    nextStatus: Joi.string().valid(
        'DriverAssigned', 'VehicleArrived', 'PickedUp', 'InTransit',
        'AtDropoff', 'Delivered', 'Completed', 'Cancelled', 'Failed'
    ).required(),
    extraPayload: Joi.object().optional()
});
