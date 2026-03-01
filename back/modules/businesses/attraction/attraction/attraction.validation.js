import Joi from 'joi';

export const attractionValidation = {
    createAttraction: Joi.object({
        name: Joi.string().min(2).max(200).required(),
        slug: Joi.string().min(2).max(200).required(),
        description: Joi.string().min(10).required(),
        address: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        entryType: Joi.string().valid('free', 'paid', 'donation').default('free'),
        price: Joi.number().min(0).optional(),
        crowdLevel: Joi.string().valid('low', 'medium', 'high').default('low'),
        isFeatured: Joi.boolean().default(false),
        status: Joi.string().valid('active', 'closed', 'maintenance').default('active'),
        categoryId: Joi.string().uuid().required(),
        vendorId: Joi.string().uuid().optional()
    }),

    updateAttraction: Joi.object({
        name: Joi.string().min(2).max(200).optional(),
        slug: Joi.string().min(2).max(200).optional(),
        description: Joi.string().min(10).optional(),
        address: Joi.string().optional(),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
        entryType: Joi.string().valid('free', 'paid', 'donation').optional(),
        price: Joi.number().min(0).optional(),
        crowdLevel: Joi.string().valid('low', 'medium', 'high').optional(),
        isFeatured: Joi.boolean().optional(),
        status: Joi.string().valid('active', 'closed', 'maintenance').optional(),
        categoryId: Joi.string().uuid().optional(),
        vendorId: Joi.string().uuid().optional().allow(null)
    }),

    queryAttractions: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        categoryId: Joi.string().uuid().optional(),
        status: Joi.string().valid('active', 'closed', 'maintenance').optional(),
        isFeatured: Joi.boolean().optional(),
        entryType: Joi.string().valid('free', 'paid', 'donation').optional()
    })
};
