import { permissionRegistry } from './permission.registry.js';
import { ApiError } from '../core/api.error.js';

class RbacService {

    /**
     * Express middleware to check if user has a specific permission
     */
    requirePermission(requiredPermission) {
        return (req, res, next) => {
            const userRole = req.user?.role;

            if (!userRole) {
                return next(ApiError.unauthorized('Authentication required'));
            }

            const isAllowed = permissionRegistry.hasPermission(userRole, requiredPermission);

            if (!isAllowed) {
                return next(ApiError.forbidden(`Missing required permission: ${requiredPermission}`));
            }

            next();
        };
    }

    /**
     * Checks permission contextually within Business Layer logic (Service level validation)
     */
    validateAccess(role, permission) {
        if (!permissionRegistry.hasPermission(role, permission)) {
            throw ApiError.forbidden(`Access Denied: Requires ${permission} privilege`);
        }
        return true;
    }
}

export const rbacService = new RbacService();
