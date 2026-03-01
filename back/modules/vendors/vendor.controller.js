// Refactored to Prism
// I must refactor `vendor.controller.js` to usage Prisma first, or just append the new function if the user hasn't refactored it yet.
// Actually, `task.md` said "Refactor Auth & User Module" was done. "Vendor" wasn't explicitly refactored in my memory/logs, check file content from step 1036.
// Yes! Step 1036 showed `import { Vendor } from './vendor.model.js';` which implies Mongoose model.
// BUT `schema.prisma` has `VendorProfile`.
// I should refactor `vendor.controller.js` to Prisma AND add the ban logic.

import prisma from '../../config/db.js';
import { ApiError } from '../../core/api.error.js';

export const getVendorProfile = async (req, res, next) => {
    try {
        const vendor = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id },
            include: { user: { select: { email: true, role: true } } }
        });

        if (!vendor) {
            throw ApiError.notFound('Vendor profile not found');
        }

        res.status(200).json({ success: true, data: vendor });
    } catch (error) {
        next(error);
    }
};

export const updateVendorProfile = async (req, res, next) => {
    try {
        // Prevent updating critical fields directly if needed, e.g. user, category
        if (req.body.userId) delete req.body.userId;
        if (req.body.category) delete req.body.category;

        const vendor = await prisma.vendorProfile.update({
            where: { userId: req.user.id },
            data: req.body
        });

        res.status(200).json({ success: true, data: vendor });
    } catch (error) {
        next(error);
    }
};

// New: Transport Vendor Ban Logic
export const banUserFromTransport = async (req, res, next) => {
    try {
        const { targetUserId, ban } = req.body; // ban = true/false

        // 1. Check if requester is a Transport Vendor
        const requesterProfile = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id }
        });

        if (!requesterProfile || requesterProfile.category !== 'transport') {
            throw ApiError.forbidden('Only Transport Vendors can perform this action');
        }

        // 2. Update Target User
        const user = await prisma.user.update({
            where: { id: targetUserId },
            data: { isTransportBanned: ban }
        });

        res.status(200).json({
            success: true,
            message: `User transport ban status set to ${ban}`,
            data: { userId: user.id, isTransportBanned: user.isTransportBanned }
        });
    } catch (error) {
        next(error);
    }
};
