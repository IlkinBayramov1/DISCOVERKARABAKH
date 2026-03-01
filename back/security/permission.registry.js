/**
 * Global Permission Registry
 * Allows dynamically registering module-specific permissions at boot time
 * rather than hardcoding a massive static array.
 */
class PermissionRegistry {
    constructor() {
        this.permissions = new Set();
        this.modulePermissions = new Map();

        // Base roles structure
        this.roles = {
            user: new Set(['read_profile', 'update_profile']),
            vendor: new Set(['read_profile', 'update_profile']), // Extended via Domains
            admin: new Set(['*']) // Admin has wildcard
        };
    }

    /**
     * Registers a list of scoped permissions for a specific module
     * @param {string} moduleName - (e.g., 'hotel', 'booking')
     * @param {Array<string>} perms - List of permission strings
     */
    register(moduleName, perms = []) {
        this.modulePermissions.set(moduleName, perms);
        perms.forEach(p => this.permissions.add(p));
    }

    /**
     * Maps permissions to a specific role globally
     */
    grantRolePermissions(role, perms = []) {
        if (!this.roles[role]) {
            this.roles[role] = new Set();
        }
        perms.forEach(p => this.roles[role].add(p));
    }

    hasPermission(role, permission) {
        if (role === 'admin') return true; // Wildcard
        if (!this.roles[role]) return false;
        return this.roles[role].has(permission);
    }

    getAllPermissions() {
        return Array.from(this.permissions);
    }
}

export const permissionRegistry = new PermissionRegistry();
