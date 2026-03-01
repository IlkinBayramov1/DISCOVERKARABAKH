import { userRepository } from './user.repository.js';
import { ApiError } from '../../core/api.error.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.id); // req.user.id from JWT
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // Remove password
    const { password, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    // Only allow updating certain fields? For now allow body
    // Remove sensitive fields just in case
    delete req.body.password;
    delete req.body.role;
    delete req.body.isBanned;
    delete req.body.isApproved;

    const user = await userRepository.update(req.user.id, req.body);

    const { password, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
