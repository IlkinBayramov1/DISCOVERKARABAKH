import Joi from 'joi';

export const registerDriverSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    licenseImages: Joi.array().items(Joi.string().uri()).optional(), // URLs
    idCardImages: Joi.array().items(Joi.string().uri()).optional(),
    managedById: Joi.string().uuid().optional(), // If they know their vendor
    
    driverType: Joi.string().valid('passenger', 'cargo').required()
});

export const updateStatusSchema = Joi.object({
    status: Joi.string().valid('Online', 'Offline', 'Busy').required()
});

export const assignDriverVehicleSchema = Joi.object({
    vehicleId: Joi.string().uuid().allow(null).optional(),
    cargoVehicleId: Joi.string().uuid().allow(null).optional()
}).min(1);
