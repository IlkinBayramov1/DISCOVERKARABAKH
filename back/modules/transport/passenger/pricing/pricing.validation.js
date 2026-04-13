import Joi from 'joi';

const locationSchema = Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required(),
    address: Joi.string().optional()
}).unknown(true);

export const calculatePriceSchema = Joi.object({
    pickupLocation: locationSchema.optional(),
    dropoffLocation: locationSchema.optional(),
    waypoints: Joi.array().items(locationSchema).optional(),
    distanceKm: Joi.number().min(0).optional(),
    durationMin: Joi.number().min(0).optional(),
    category: Joi.string().valid('Economy', 'Business', 'Premium', 'Minivan', 'Bus').required()
});

export const createPricingRuleSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid('Fixed', 'PerKm', 'Hourly').required(),
    basePrice: Joi.number().required(),
    pricePerKm: Joi.number().optional(),
    pricePerMin: Joi.number().optional(),
    config: Joi.object().optional()
});

export const updatePricingRuleSchema = Joi.object({
    name: Joi.string().optional(),
    type: Joi.string().valid('Fixed', 'PerKm', 'Hourly').optional(),
    basePrice: Joi.number().optional(),
    pricePerKm: Joi.number().optional(),
    pricePerMin: Joi.number().optional(),
    config: Joi.object().optional()
});
