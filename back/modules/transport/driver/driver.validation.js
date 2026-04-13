import Joi from 'joi';

export const registerDriverSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    licenseImages: Joi.array().items(Joi.string().uri()).optional(), // URLs
    idCardImages: Joi.array().items(Joi.string().uri()).optional(),
    managedById: Joi.string().uuid().optional(), // If they know their vendor
    
    driverType: Joi.string().valid('passenger', 'cargo').required(),

    // Vehicle specifics - base
    vehicleBrand: Joi.string().required(),
    vehicleModel: Joi.string().required(),
    vehicleColor: Joi.string().required(),
    vehiclePlateNumber: Joi.string().required(),
    
    // Passenger specific
    vehicleSeats: Joi.when('driverType', {
        is: 'passenger',
        then: Joi.number().integer().min(1).max(100).required(),
        otherwise: Joi.forbidden()
    }),
    vehicleCategory: Joi.when('driverType', {
        is: 'passenger',
        then: Joi.string().valid('Economy', 'Business', 'Premium', 'Minivan', 'Bus').required(),
        otherwise: Joi.forbidden()
    }),

    // Cargo specific
    maxWeightKg: Joi.when('driverType', {
        is: 'cargo',
        then: Joi.number().positive().required(),
        otherwise: Joi.forbidden()
    }),
    maxVolumeM3: Joi.when('driverType', {
        is: 'cargo',
        then: Joi.number().positive().required(),
        otherwise: Joi.forbidden()
    }),
    cargoType: Joi.when('driverType', {
        is: 'cargo',
        then: Joi.string().valid('Box', 'Refrigerated', 'Flatbed', 'Liquid').required(),
        otherwise: Joi.forbidden()
    })
});

export const updateStatusSchema = Joi.object({
    status: Joi.string().valid('Online', 'Offline', 'Busy').required()
});
