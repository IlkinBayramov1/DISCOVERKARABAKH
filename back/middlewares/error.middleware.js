import { ApiError } from '../core/api.error.js';
import { env } from '../config/index.js';

export const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Resolve status code
  const statusCode = err.statusCode || error.statusCode || 500;

  // Log error for dev
  if (statusCode >= 500) {
    console.error(err);
  } else {
    console.warn(`[Client Error - ${statusCode}]: ${err.message}`);
  }

  // Prisma Errors
  // P2002: Unique constraint failed
  if (err.code === 'P2002') {
    const target = err.meta?.target;
    const field = Array.isArray(target) ? target.join(', ') : (target || 'field');
    const message = `Duplicate value entered for ${field}.`;
    error = new ApiError(400, message);
  }

  // P2025: Record not found (when using update/delete)
  if (err.code === 'P2025') {
    const message = 'Resource not found';
    error = new ApiError(404, message);
  }

  // P2003: Foreign key constraint failed
  if (err.code === 'P2003') {
    const field = err.meta?.field_name || 'relation';
    const message = `Invalid data reference in ${field}`;
    error = new ApiError(400, message);
  }

  // Mongoose CastError equivalent in Prisma is usually P2001 or validation error
  // But Validation errors often come from Joi so they are generic Errors or Joi errors.

  if (err.name === 'ValidationError') {
    // Joi validation error check (if not handled by validate middleware)
    // or other lib
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ApiError(400, message);
  }

  // Multer Errors
  if (err.name === 'MulterError') {
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Yüklənən şəkil çox böyükdür! Maksimum limit: 20MB.';
    }
    error = new ApiError(400, message);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    stack: env.nodeEnv === 'development' ? err.stack : undefined,
  });
};
