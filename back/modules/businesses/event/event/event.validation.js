import Joi from 'joi';

export const createEventSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    city: Joi.string().required(),
    location: Joi.string().required(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    capacity: Joi.number().integer().min(1).required(),
    ticketPrice: Joi.number().min(0).required()
});

export const updateEventSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    category: Joi.string().optional(),
    city: Joi.string().optional(),
    location: Joi.string().optional(),
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
    capacity: Joi.number().integer().min(1).optional(),
    ticketPrice: Joi.number().min(0).optional(),
    status: Joi.string().valid('active', 'cancelled', 'completed').optional()
});
