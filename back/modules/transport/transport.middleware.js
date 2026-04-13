import { ApiError } from '../../core/api.error.js';

export const transportBanMiddleware = (req, res, next) => {
    // Check if user is banned from transport services
    if (req.user && req.user.isTransportBanned) {
        return next(ApiError.forbidden('You are banned from using transport services.'));
    }
    next();
};

export const cargoRoleMiddleware = (req, res, next) => {
    // Tourists cannot use Cargo services
    if (req.user && req.user.role === 'tourist') {
        return next(ApiError.forbidden('Tourists are not allowed to use Cargo services.'));
    }
    next();
};
