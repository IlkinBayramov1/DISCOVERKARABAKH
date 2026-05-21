import { authService } from './auth.service.js';

export const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body.email, req.body.password);
    res.status(200).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is already populated by authMiddleware
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
