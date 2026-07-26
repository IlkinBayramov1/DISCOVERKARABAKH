import { userRepository } from '../users/user.repository.js';
import { hashPassword, comparePassword } from '../../utils/hash.util.js';
import { signToken } from '../../utils/jwt.util.js';
import { ApiError } from '../../core/api.error.js';
import prisma from '../../config/db.js'; // Direct prisma access for transactions
import crypto from 'crypto';

import redisClient from '../../cache/redis.client.js';

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
      const userId = crypto.randomUUID();

      // 1. Create Base User
      const user = await tx.user.create({
        data: {
          id: userId,
          email,
          password: hashedPassword,
          role: role || 'user',
          firstName,
          lastName,
          isApproved: role !== 'vendor', // Vendors need approval
          updatedAt: new Date()
        },
      });

      // 2. Create Specific Profile
      if (role === 'vendor') {
        const { companyName, category } = data;
        if (!companyName || !category) throw ApiError.badRequest('Vendor details missing');

        await tx.vendorprofile.create({
          data: {
            id: crypto.randomUUID(),
            userId: user.id,
            companyName,
            category
          }
        });
      } else if (role === 'tourist') {
        const { nationality, passportNumber, interests } = data;
        await tx.touristprofile.create({
          data: { 
            id: crypto.randomUUID(),
            userId: user.id, 
            nationality, 
            passportNumber, 
            interests 
          }
        });
      } else if (role === 'resident') {
        const { permitNumber, localAddress } = data;
        await tx.residentprofile.create({
          data: { 
            id: crypto.randomUUID(),
            userId: user.id, 
            permitNumber, 
            localAddress 
          }
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

    const emailKey = email.toLowerCase().trim();

    // 1. Check if user is locked out in Redis
    if (redisClient.isReady()) {
      const isLocked = await redisClient.get(`lockout:${emailKey}`);
      if (isLocked) {
        throw ApiError.forbidden('Hesabınız çoxlu sayda yanlış şifrə cəhdi səbəbindən 15 dəqiqəlik kilidlənib.');
      }
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      // Increment failed attempts in Redis
      if (redisClient.isReady()) {
        const attemptsKey = `attempts:${emailKey}`;
        const attemptsVal = await redisClient.get(attemptsKey);
        const attempts = attemptsVal ? parseInt(attemptsVal) + 1 : 1;
        
        if (attempts >= 5) {
          // Lock out user for 15 minutes (900 seconds)
          await redisClient.setEx(`lockout:${emailKey}`, 900, 'locked');
          await redisClient.del(attemptsKey);
          throw ApiError.forbidden('Hesabınız 5 dəfə yanlış şifrə daxil edildiyi üçün 15 dəqiqəlik kilidləndi.');
        } else {
          // Store attempts with 15 minutes expiry
          await redisClient.setEx(attemptsKey, 900, attempts.toString());
        }
      }
      throw ApiError.unauthorized('Invalid credentials');
    }

    // Clear failed attempts on successful login
    if (redisClient.isReady()) {
      await redisClient.del(`attempts:${emailKey}`);
      await redisClient.del(`lockout:${emailKey}`);
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
