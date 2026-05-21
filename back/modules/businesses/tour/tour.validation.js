import Joi from 'joi';

const activitySchema = Joi.object({
    time: Joi.string().required(),
    description: Joi.string().required(),
});

const dayItinerarySchema = Joi.object({
    day: Joi.number().integer().min(1).required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    activities: Joi.array().items(activitySchema).default([]),
    meals: Joi.array().items(Joi.string()).default([]),
});

export const tourSchemas = {
    create: Joi.object({
        name: Joi.string().required().max(100),
        description: Joi.string().required().max(2000),
        city: Joi.string().optional(),
        address: Joi.string().required(),
        destinationLink: Joi.string().optional().allow('', null).max(500),
        meetingAddress: Joi.string().optional().allow('', null).max(500),
        phone: Joi.string().optional(),
        email: Joi.string().email().optional(),
        images: Joi.array().items(Joi.string()).default([]),
        meetingPoint: Joi.string().optional().allow('', null).max(1000),
        mapLink: Joi.string().optional().allow('', null).max(500),
        
        durationDays: Joi.number().integer().min(1).required(),
        durationNights: Joi.number().integer().min(0).required(),
        difficulty: Joi.string().valid('Easy', 'Medium', 'Hard', 'Extreme').default('Medium'),
        groupSizeMin: Joi.number().integer().min(1).default(1),
        groupSizeMax: Joi.number().integer().min(1).required(),
        pricePerPerson: Joi.number().positive().required(),
        
        startDate: Joi.date().optional(),
        itinerary: Joi.array().items(dayItinerarySchema).optional(),
        inclusions: Joi.array().items(Joi.string()).optional(),
        exclusions: Joi.array().items(Joi.string()).optional(),
    }),
    
    update: Joi.object({
        name: Joi.string().max(100).optional(),
        description: Joi.string().max(2000).optional(),
        city: Joi.string().optional(),
        address: Joi.string().optional(),
        destinationLink: Joi.string().optional().allow('', null).max(500),
        meetingAddress: Joi.string().optional().allow('', null).max(500),
        phone: Joi.string().optional(),
        email: Joi.string().email().optional(),
        images: Joi.array().items(Joi.string()).optional(),
        meetingPoint: Joi.string().optional().allow('', null).max(1000),
        mapLink: Joi.string().optional().allow('', null).max(500),
        
        durationDays: Joi.number().integer().min(1).optional(),
        durationNights: Joi.number().integer().min(0).optional(),
        difficulty: Joi.string().valid('Easy', 'Medium', 'Hard', 'Extreme').optional(),
        groupSizeMin: Joi.number().integer().min(1).optional(),
        groupSizeMax: Joi.number().integer().min(1).optional(),
        pricePerPerson: Joi.number().positive().optional(),
        
        startDate: Joi.date().optional(),
        itinerary: Joi.array().items(dayItinerarySchema).optional(),
        inclusions: Joi.array().items(Joi.string()).optional(),
        exclusions: Joi.array().items(Joi.string()).optional(),
    }).min(1),
};
