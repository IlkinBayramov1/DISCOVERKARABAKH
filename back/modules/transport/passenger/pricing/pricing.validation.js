import Joi from 'joi';

export const calculatePriceSchema = Joi.object({
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
