import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { ApiError } from '../core/api.error.js';
import { User } from '../modules/users/models/user.base.model.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Not authorized to access this route');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw ApiError.unauthorized('Not authorized to access this route');
    }

    const decoded = jwt.verify(token, env.jwt_secret || process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(ApiError.unauthorized('Not authorized to access this route'));
  }
};
