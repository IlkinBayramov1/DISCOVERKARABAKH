import { userRepository } from '../users/user.repository.js';
import { hashPassword, comparePassword } from '../../utils/hash.util.js';
import { signToken } from '../../utils/jwt.util.js';
import { ApiError } from '../../core/api.error.js';
import prisma from '../../config/db.js'; // Direct prisma access for transactions

const ROLE_PERMISSIONS = {
  tourist: [
    'passenger_only',
    'hotel_booking',
    'tour_booking',
    'event_booking',
    'restaurant_booking'
  ],
  user: [
    'cargo_access',
    'passenger_only',
    'hotel_booking',
    'tour_booking',
    'event_booking',
    'restaurant_booking'
  ],
  admin: [
    'admin_panel'
  ],
  vendor: [
    'vendor_panel'
  ]
};

class AuthService {
  async register(data) {
    const { email, password, role, firstName, lastName } = data;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw ApiError.badRequest('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    // Transaction to create User + Profile
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Base User
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role || 'user',
          firstName,
          lastName,
          isApproved: role !== 'vendor', // Vendors need approval
        },
      });

      // 2. Create Specific Profile
      if (role === 'vendor') {
        const { companyName, category } = data;
        if (!companyName || !category) throw ApiError.badRequest('Vendor details missing');

        await tx.vendorProfile.create({
          data: {
            userId: user.id,
            companyName,
            category
          }
        });
      } else if (role === 'tourist') {
        const { nationality, passportNumber, interests } = data;
        await tx.touristProfile.create({
          data: { userId: user.id, nationality, passportNumber, interests }
        });
      } else if (role === 'resident') {
        const { permitNumber, localAddress } = data;
        await tx.residentProfile.create({
          data: { userId: user.id, permitNumber, localAddress }
        });
      }

      return user;
    });

    if (role === 'vendor') {
      return {
        user: { email: result.email, role: result.role, isApproved: false },
        message: 'Registration successful. Please wait for Admin approval.'
      };
    }

    const permissions = ROLE_PERMISSIONS[result.role] || [];
    const token = signToken({ id: result.id, role: result.role });
    return { user: { ...result, permissions }, token };
  }

  async login(email, password) {
    if (!email || !password) {
      throw ApiError.badRequest('Please provide email and password');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Check Status
    if (user.isBanned) {
      throw ApiError.forbidden('Your account has been banned by Admin.');
    }

    if (user.role === 'vendor' && !user.isApproved) {
      throw ApiError.forbidden('Your vendor account is pending approval.');
    }

    if (!user.isApproved) {
      throw ApiError.forbidden('Account pending approval.');
    }

    const token = signToken({ id: user.id, role: user.role });

    // Remove password from response
    const userWithoutPass = { ...user };
    delete userWithoutPass.password;

    const permissions = ROLE_PERMISSIONS[user.role] || [];
    userWithoutPass.permissions = permissions;

    return { user: userWithoutPass, token };
  }
}

export const authService = new AuthService();
