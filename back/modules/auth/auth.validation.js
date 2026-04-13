import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'vendor', 'tourist', 'resident', 'admin', 'driver').default('user'),
  // Vendor specific fields
  companyName: Joi.string().when('role', { is: 'vendor', then: Joi.required() }),
  category: Joi.string().valid('hotel', 'tour', 'event', 'transport', 'restaurant', 'attraction').when('role', { is: 'vendor', then: Joi.required() }),
  // Tourist fields
  nationality: Joi.string().when('role', { is: 'tourist', then: Joi.optional() }),
  passportNumber: Joi.string().optional(),
  interests: Joi.array().items(Joi.string()).optional(),

  // Resident fields
  permitNumber: Joi.string().when('role', { is: 'resident', then: Joi.optional() }),
  localAddress: Joi.string().when('role', { is: 'resident', then: Joi.optional() }),
  familyMembers: Joi.array().items(Joi.object({
    name: Joi.string(),
    relation: Joi.string()
  })).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
