import Joi from 'joi';

export const attractionValidation = {
    createAttraction: Joi.object({
        name: Joi.string().min(2).max(200).required(),
        slug: Joi.string().min(2).max(200).optional(),
        description: Joi.string().min(10).required(),
        address: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        entryType: Joi.string().valid('free', 'paid', 'donation').default('free'),
        price: Joi.number().min(0).optional(),
        crowdLevel: Joi.string().valid('low', 'medium', 'high').default('low'),
        audioUrl: Joi.string().uri().optional().allow('', null).empty(''),
        virtualTourUrl: Joi.string().uri().optional().allow('', null).empty(''),
        googleMapsUrl: Joi.string().uri().optional().allow('', null).empty(''),
        searchKeywords: Joi.string().max(500).optional(),
        isFeatured: Joi.boolean().default(false),
        status: Joi.string().valid('active', 'closed', 'maintenance').default('active'),
        city: Joi.string().valid('Shusha', 'Lachin', 'Khankendi', 'Aghdam').required(),
        category: Joi.string().valid('Muzey', 'Park', 'Tarixi_Mekan', 'Tebiet_Abidesi', 'Memorial_Kompleks', 'Idman_Eylence').required(),
        vendorId: Joi.string().uuid().optional(),
        images: Joi.array().items(
            Joi.alternatives().try(
                Joi.string(),
                Joi.object({
                    url: Joi.string().required(),
                    type: Joi.string().valid('image', '360_image', 'vr_tour').default('image'),
                    isCover: Joi.boolean().optional(),
                    order: Joi.number().optional(),
                    id: Joi.string().optional()
                }).unknown(true)
            )
        ).optional()
    }).unknown(true),

    updateAttraction: Joi.object({
        name: Joi.string().min(2).max(200).optional(),
        slug: Joi.string().min(2).max(200).optional(),
        description: Joi.string().min(10).optional(),
        address: Joi.string().optional(),
        latitude: Joi.number().optional(),
        longitude: Joi.number().optional(),
        entryType: Joi.string().valid('free', 'paid', 'donation').optional(),
        price: Joi.number().min(0).optional(),
        audioUrl: Joi.string().uri().optional().allow('', null).empty(''),
        virtualTourUrl: Joi.string().uri().optional().allow('', null).empty(''),
        googleMapsUrl: Joi.string().uri().optional().allow('', null).empty(''),
        searchKeywords: Joi.string().max(500).optional(),
        crowdLevel: Joi.string().valid('low', 'medium', 'high').optional(),
        isFeatured: Joi.boolean().optional(),
        status: Joi.string().valid('active', 'closed', 'maintenance').optional(),
        city: Joi.string().valid('Shusha', 'Lachin', 'Khankendi', 'Aghdam').optional(),
        category: Joi.string().valid('Muzey', 'Park', 'Tarixi_Mekan', 'Tebiet_Abidesi', 'Memorial_Kompleks', 'Idman_Eylence').optional(),
        vendorId: Joi.string().uuid().optional().allow(null),
        images: Joi.array().items(
            Joi.alternatives().try(
                Joi.string(),
                Joi.object({
                    url: Joi.string().required(),
                    type: Joi.string().valid('image', '360_image', 'vr_tour').default('image'),
                    isCover: Joi.boolean().optional(),
                    order: Joi.number().optional(),
                    id: Joi.string().optional()
                }).unknown(true)
            )
        ).optional()
    }).unknown(true),

    queryAttractions: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        category: Joi.string().valid('Muzey', 'Park', 'Tarixi_Mekan', 'Tebiet_Abidesi', 'Memorial_Kompleks', 'Idman_Eylence').optional(),
        status: Joi.string().valid('active', 'closed', 'maintenance').optional(),
        city: Joi.string().valid('Shusha', 'Lachin', 'Khankendi', 'Aghdam').optional(),
        isFeatured: Joi.boolean().optional(),
        entryType: Joi.string().valid('free', 'paid', 'donation').optional(),
        keyword: Joi.string().optional().allow(''),
        q: Joi.string().optional().allow('')
    }),

    nearbyQuery: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        radiusKm: Joi.number().min(1).max(500).default(50),
        limit: Joi.number().integer().min(1).max(50).default(5)
    }),

    review: Joi.object({
        rating: Joi.number().integer().min(1).max(5).required(),
        comment: Joi.string().max(1000).optional().allow('', null),
        images: Joi.array().items(Joi.string().uri()).max(5).optional()
    })
};
