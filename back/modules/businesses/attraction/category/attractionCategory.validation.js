import Joi from 'joi';

export const attractionCategoryValidation = {
    createCategory: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        slug: Joi.string().min(2).max(100).required(),
        description: Joi.string().max(1000).optional().allow(null, '')
    }),

    updateCategory: Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        slug: Joi.string().min(2).max(100).optional(),
        description: Joi.string().max(1000).optional().allow(null, '')
    })
};
