import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';

export const signToken = (payload, options = {}) => {
  return jwt.sign(payload, env.jwt_secret || process.env.JWT_SECRET, {
    expiresIn: env.jwt_expires_in || process.env.JWT_EXPIRES_IN || '7d',
    ...options,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.jwt_secret || process.env.JWT_SECRET);
};
