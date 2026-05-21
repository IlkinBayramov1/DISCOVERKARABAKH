import jwt from 'jsonwebtoken';
import { env } from '../config/index.js';

export const signToken = (payload, options = {}) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    ...options,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};
