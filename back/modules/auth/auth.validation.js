import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'vendor', 'tourist', 'resident', 'investor', 'admin', 'driver').default('user'),
  // Vendor specific fields
  companyName: Joi.string().when('role', { is: 'vendor', then: Joi.required() }),
  category: Joi.string().valid('hotel', 'tour', 'event').when('role', { is: 'vendor', then: Joi.required() }),
  // Tourist fields
  nationality: Joi.string().when('role', { is: 'tourist', then: Joi.required() }),
  passportNumber: Joi.string().optional(),
  interests: Joi.array().items(Joi.string()).optional(),

  // Resident fields
  permitNumber: Joi.string().when('role', { is: 'resident', then: Joi.required() }),
  localAddress: Joi.string().when('role', { is: 'resident', then: Joi.required() }),
  familyMembers: Joi.array().items(Joi.object({
    name: Joi.string(),
    relation: Joi.string()
  })).optional(),

  // Investor fields
  // companyName is shared with Vendor logic above but acts as optional for Investor if not strictly enforced here
  // We can allow companyName generally or strictly conditional. Let's allow it generally optional, required for Vendor.
  // Actually, line 8 says companyName required if vendor. So it is optional otherwise, which matches Investor needs (if they have one).
  investmentFocus: Joi.array().items(Joi.string()).optional(),
  budgetRange: Joi.object({
    min: Joi.number(),
    max: Joi.number()
  }).optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
