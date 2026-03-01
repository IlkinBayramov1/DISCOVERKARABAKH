import { userRepository } from '../users/user.repository.js';
import { hashPassword, comparePassword } from '../../utils/hash.util.js';
import { signToken } from '../../utils/jwt.util.js';
import { ApiError } from '../../core/api.error.js';
import prisma from '../../config/db.js'; // Direct prisma access for transactions

class AuthService {
  async register(data) {
    const { email, password, role } = data;

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
      } else if (role === 'investor') {
        const { investmentFocus, budgetRange, companyName } = data;
        await tx.investorProfile.create({
          data: { userId: user.id, investmentFocus, budgetRange, companyName }
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

    const token = signToken({ id: result.id, role: result.role });
    return { user: result, token };
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

    return { user: userWithoutPass, token };
  }
}

export const authService = new AuthService();
