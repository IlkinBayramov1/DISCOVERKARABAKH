import { ROLES } from './constants.js';

export const PERMISSIONS = {
  // USERS
  READ_PROFILE: 'read_profile',
  UPDATE_PROFILE: 'update_profile',

  // BUSINESSES (sonra lazım olacaq)
  CREATE_BUSINESS: 'create_business',
  UPDATE_BUSINESS: 'update_business',
  DELETE_BUSINESS: 'delete_business',

  // ADMIN
  MANAGE_USERS: 'manage_users',
  MANAGE_VENDORS: 'manage_vendors',
};

export const ROLE_PERMISSIONS = {
  [ROLES.USER]: [
    PERMISSIONS.READ_PROFILE,
    PERMISSIONS.UPDATE_PROFILE,
  ],

  [ROLES.VENDOR]: [
    PERMISSIONS.READ_PROFILE,
    PERMISSIONS.UPDATE_PROFILE,
    PERMISSIONS.CREATE_BUSINESS,
    PERMISSIONS.UPDATE_BUSINESS,
  ],

  [ROLES.ADMIN]: Object.values(PERMISSIONS),
};
