import Joi from 'joi';

export const registerDriverSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    licenseExpiryDate: Joi.date().iso().min('now').optional(),
    licenseCategories: Joi.array().items(Joi.string().min(1)).min(1).optional(),
    licenseImages: Joi.array().items(Joi.string().min(3)).optional(),
    idCardImages: Joi.array().items(Joi.string().min(3)).optional(),
    managedById: Joi.string().uuid().optional(),
    driverType: Joi.string().valid('passenger', 'cargo').required()
});

export const createDriverSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).optional(),
    phone: Joi.string().required(),
    licenseNumber: Joi.string().required(),
    licenseExpiryDate: Joi.date().iso().min('now').optional(),
    licenseCategories: Joi.array().items(Joi.string().min(1)).min(1).optional(),
    licenseImages: Joi.array().items(Joi.string().min(3)).optional(),
    idCardImages: Joi.array().items(Joi.string().min(3)).optional()
});

export const updateLicenseSchema = Joi.object({
    licenseNumber: Joi.string().required(),
    licenseExpiryDate: Joi.date().iso().min('now').required(),
    licenseCategories: Joi.array().items(Joi.string().min(1)).min(1).required(),
    licenseImages: Joi.array().items(Joi.string().min(3)).min(1).required(),
    idCardImages: Joi.array().items(Joi.string().min(3)).optional()
});

export const updateStatusSchema = Joi.object({
    status: Joi.string().valid('Online', 'Offline', 'Busy').required()
});

export const assignDriverVehicleSchema = Joi.object({
    vehicleId: Joi.string().uuid().allow(null).optional(),
    cargoVehicleId: Joi.string().uuid().allow(null).optional()
}).min(1);

