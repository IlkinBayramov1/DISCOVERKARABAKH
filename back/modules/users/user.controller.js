import { User } from './models/user.base.model.js';
import { ApiError } from '../../core/api.error.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    // Prevent password update from this route
    if (req.body.password) {
      delete req.body.password;
    }

    // Prevent role update
    if (req.body.role) {
      delete req.body.role;
    }

    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
