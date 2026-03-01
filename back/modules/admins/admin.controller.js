import { userRepository } from '../users/user.repository.js';
import { ApiError } from '../../core/api.error.js';
import prisma from '../../config/db.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isBanned: true,
        isApproved: true,
        createdAt: true,
        vendorProfile: true, // Include profile data if needed
      }
    });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.params.id);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await userRepository.delete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const user = await userRepository.update(req.params.id, { isBanned: true });
    // Prisma throws if not found usually, but update returns object. 
    // If we want safe check, findById first or handle prisma error.
    // updateUser in repo assumes ID exists or prisma throws.
    // Let's rely on repo or wrap. Repo update maps to prisma.update which throws P2025 if not found.

    res.status(200).json({ success: true, message: 'User banned', data: user });
  } catch (error) {
    // Handle Prisma "Record to update not found."
    if (error.code === 'P2025') return next(ApiError.notFound('User not found'));
    next(error);
  }
};

export const unbanUser = async (req, res, next) => {
  try {
    const user = await userRepository.update(req.params.id, { isBanned: false });
    res.status(200).json({ success: true, message: 'User unbanned', data: user });
  } catch (error) {
    if (error.code === 'P2025') return next(ApiError.notFound('User not found'));
    next(error);
  }
};

export const approveUser = async (req, res, next) => {
  try {
    const user = await userRepository.update(req.params.id, { isApproved: true });
    res.status(200).json({ success: true, message: 'User approved', data: user });
  } catch (error) {
    if (error.code === 'P2025') return next(ApiError.notFound('User not found'));
    next(error);
  }
};

export const rejectUser = async (req, res, next) => {
  try {
    const user = await userRepository.update(req.params.id, { isApproved: false });
    res.status(200).json({ success: true, message: 'User rejected (isApproved=false)', data: user });
  } catch (error) {
    if (error.code === 'P2025') return next(ApiError.notFound('User not found'));
    next(error);
  }
};
