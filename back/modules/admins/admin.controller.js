import { User } from '../users/models/user.base.model.js';
import { ApiError } from '../../core/api.error.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
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
    const user = await User.findById(req.params.id);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await user.deleteOne();

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
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true });
    if (!user) throw ApiError.notFound('User not found');
    res.status(200).json({ success: true, message: 'User banned', data: user });
  } catch (error) {
    next(error);
  }
};

export const unbanUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true });
    if (!user) throw ApiError.notFound('User not found');
    res.status(200).json({ success: true, message: 'User unbanned', data: user });
  } catch (error) {
    next(error);
  }
};

export const approveUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!user) throw ApiError.notFound('User not found');
    res.status(200).json({ success: true, message: 'User approved', data: user });
  } catch (error) {
    next(error);
  }
};

export const rejectUser = async (req, res, next) => {
  try {
    // Rejection strategy: Delete user OR Set isApproved false?
    // User asked "reject". Usually deletions are cleaner for "pending" ones, but maybe they want to keep record?
    // Let's implement SOFT reject (isApproved: false). If they want delete, they can use deleteUser endpoint.
    // Actually, "reject" often implies "Denied" status. let's just ensure isApproved = false.
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: false }, { new: true });
    if (!user) throw ApiError.notFound('User not found');
    res.status(200).json({ success: true, message: 'User rejected (isApproved=false)', data: user });
  } catch (error) {
    next(error);
  }
};
