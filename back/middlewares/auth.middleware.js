import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';
import { ApiError } from '../core/api.error.js';
import prisma from '../config/db.js';

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

    const decoded = jwt.verify(token, env.jwtSecret || process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!user.isActive) {
      throw ApiError.unauthorized('User account is inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    next(ApiError.unauthorized('Not authorized to access this route'));
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden(`User role ${req.user.role} is not authorized to access this route`));
    }

    next();
  };
};
