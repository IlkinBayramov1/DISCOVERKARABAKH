import Joi from 'joi';

export const createVehicleSchema = Joi.object({
    brand: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2100).required(),
    color: Joi.string().required(),
    plateNumber: Joi.string().required(),
    category: Joi.string().valid('Economy', 'Business', 'Premium', 'Minivan', 'Bus').required(),
    seats: Joi.number().integer().min(1).required(),
    luggage: Joi.number().integer().min(0).required(),
    description: Joi.string().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(), // Image URLs
    status: Joi.string().valid('Active', 'Inactive', 'Maintenance').optional()
});

export const updateVehicleSchema = Joi.object({
    brand: Joi.string().optional(),
    model: Joi.string().optional(),
    year: Joi.number().integer().optional(),
    color: Joi.string().optional(),
    plateNumber: Joi.string().optional(),
    category: Joi.string().valid('Economy', 'Business', 'Premium', 'Minivan', 'Bus').optional(),
    seats: Joi.number().integer().optional(),
    luggage: Joi.number().integer().optional(),
    description: Joi.string().optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    status: Joi.string().valid('Active', 'Inactive', 'Maintenance').optional()
});
