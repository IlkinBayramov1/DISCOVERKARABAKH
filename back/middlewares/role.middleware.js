import { ApiError } from '../core/api.error.js';

export default function roleMiddleware(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authenticated'));
    }

    // allowedRoles can be a string (single role) or array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Admin always has access (Super Admin)
    if (req.user.role === 'admin') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`Access denied. Requires one of the following roles: ${roles.join(', ')}`));
    }

    next();
  };
}
