import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().max(50).optional().allow('', null),
  lastName: Joi.string().max(50).optional().allow('', null),
  phone: Joi.string().max(20).optional().allow('', null),
  gender: Joi.string().valid('male', 'female', 'other').optional().allow('', null),
  birthDate: Joi.date().iso().optional().allow(null, ''),
  language: Joi.string().valid('AZ', 'EN', 'RU').optional().default('AZ'),
  avatarUrl: Joi.string().uri().optional().allow('', null),

  // Tourist specific
  nationality: Joi.string().optional().allow('', null),
  passportNumber: Joi.string().optional().allow('', null),
  interests: Joi.array().items(Joi.string()).optional(),
  emergencyContact: Joi.object({
    name: Joi.string().optional(),
    phone: Joi.string().optional(),
    relation: Joi.string().optional()
  }).optional().allow(null),

  // Resident specific
  permitNumber: Joi.string().optional().allow('', null),
  localAddress: Joi.string().optional().allow('', null),
  familyMembers: Joi.array().items(Joi.object({
    name: Joi.string().optional(),
    relation: Joi.string().optional()
  })).optional(),

  // Vendor specific (for profile management)
  companyName: Joi.string().optional(),
  category: Joi.string().valid('hotel', 'tour', 'event', 'transport', 'restaurant', 'attraction').optional()
});
