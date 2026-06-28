import { ApiError } from '../core/api.error.js';

export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return next(ApiError.badRequest(errorMessage));
    }
    next();
};
