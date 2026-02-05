import { User } from '../users/models/user.base.model.js';
import { comparePassword } from '../../utils/hash.util.js';
import { signToken } from '../../utils/jwt.util.js';
import { ApiError } from '../../core/api.error.js';

class AuthService {
  async register(data) {
    const { email, password, role } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.badRequest('User already exists');
    }

    // Password hashing is handled by User model pre-save hook
    // Spread data to include subtype specific fields (nationality, permitNumber etc.)
    const user = await User.create({
      ...data,
      email,
      password,
      role: role || 'user',
    });

    // Special handling for Vendor (separate collection/profile)
    if (role === 'vendor') {
      // Vendors must be approved by admin
      user.isApproved = false;
      await user.save();

      const { companyName, category } = data;
      if (!companyName || !category) {
        // Cleanup if vendor details missing
        await user.deleteOne();
        throw ApiError.badRequest('Vendor requires companyName and category');
      }

      try {
        await import('../vendors/vendor.model.js').then(async ({ Vendor }) => {
          await Vendor.create({
            user: user._id,
            companyName,
            category,
          });
        });
      } catch (err) {
        await user.deleteOne();
        throw new Error('Failed to create vendor profile: ' + err.message);
      }

      // Return message instead of token for pending vendors
      return {
        user: { email: user.email, role: user.role, isApproved: false },
        message: 'Registration successful. Please wait for Admin approval.'
      };
    }

    const token = signToken({ _id: user._id, role: user.role });

    return { user, token };
  }

  async login(email, password) {
    if (!email || !password) {
      throw ApiError.badRequest('Please provide email and password');
    }

    // Select password because it's excluded by default
    const user = await User.findOne({ email }).select('+password');
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
    // Also general check if we use isApproved for others later
    if (!user.isApproved) {
      throw ApiError.forbidden('Account pending approval.');
    }

    const token = signToken({ _id: user._id, role: user.role });

    // Remove password from response
    user.password = undefined;

    return { user, token };
  }
}

export const authService = new AuthService();
