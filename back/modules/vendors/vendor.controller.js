import { Vendor } from './vendor.model.js';
import { ApiError } from '../../core/api.error.js';

export const getVendorProfile = async (req, res, next) => {
    try {
        const vendor = await Vendor.findOne({ user: req.user._id }).populate('user', 'email role');
        if (!vendor) {
            throw ApiError.notFound('Vendor profile not found');
        }

        res.status(200).json({
            success: true,
            data: vendor,
        });
    } catch (error) {
        next(error);
    }
};

export const updateVendorProfile = async (req, res, next) => {
    try {
        // Prevent updating critical fields directly if needed, e.g. user, category
        if (req.body.user) delete req.body.user;
        if (req.body.category) delete req.body.category; // Category typically shouldn't change easily

        const vendor = await Vendor.findOneAndUpdate(
            { user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!vendor) {
            throw ApiError.notFound('Vendor profile not found');
        }

        res.status(200).json({
            success: true,
            data: vendor,
        });
    } catch (error) {
        next(error);
    }
};
