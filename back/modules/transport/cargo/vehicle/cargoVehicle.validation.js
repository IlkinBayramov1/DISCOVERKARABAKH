import Joi from 'joi';

export const createCargoVehicleSchema = Joi.object({
    brand: Joi.string().required(),
    model: Joi.string().required(),
    year: Joi.number().integer().min(1990).max(new Date().getFullYear() + 1).required(),
    licensePlate: Joi.string().required(),
    cargoType: Joi.string().valid('Box', 'Refrigerated', 'Flatbed', 'Liquid').required(),
    maxWeightKg: Joi.number().positive().required(),
    maxVolumeM3: Joi.number().positive().required(),
    isRefrigerated: Joi.boolean().default(false),
    temperatureRangeMin: Joi.number().when('isRefrigerated', { is: true, then: Joi.required() }),
    temperatureRangeMax: Joi.number().when('isRefrigerated', { is: true, then: Joi.required() }),
    insuranceValidUntil: Joi.date().iso().required(),
});

export const updateCargoVehicleSchema = Joi.object({
    brand: Joi.string().optional(),
    model: Joi.string().optional(),
    year: Joi.number().integer().optional(),
    licensePlate: Joi.string().optional(),
    cargoType: Joi.string().valid('Box', 'Refrigerated', 'Flatbed', 'Liquid').optional(),
    maxWeightKg: Joi.number().positive().optional(),
    maxVolumeM3: Joi.number().positive().optional(),
    isRefrigerated: Joi.boolean().optional(),
    temperatureRangeMin: Joi.number().optional(),
    temperatureRangeMax: Joi.number().optional(),
    insuranceValidUntil: Joi.date().iso().optional(),
    status: Joi.string().valid('Available', 'Reserved', 'Maintenance').optional(),
});
