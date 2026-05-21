import prisma from '../../../../config/db.js';
import { successResponse } from '../../../../core/api.response.js';
import { ApiError } from '../../../../core/api.error.js';

class BlacklistController {
    /**
     * Get all blacklisted entries
     */
    async getBlacklist(req, res, next) {
        try {
            const blacklist = await prisma.blacklist.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return successResponse(res, blacklist);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Add a value to the blacklist
     */
    async addToBlacklist(req, res, next) {
        try {
            const { type, value, reason } = req.body;

            if (!type || !value) {
                throw ApiError.badRequest('Type and Value are required');
            }

            const entry = await prisma.blacklist.upsert({
                where: { value },
                update: { type, reason },
                create: { type, value, reason }
            });

            return successResponse(res, entry, 'Value added to blacklist');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Remove an entry from the blacklist
     */
    async removeFromBlacklist(req, res, next) {
        try {
            const { id } = req.params;

            await prisma.blacklist.delete({
                where: { id }
            });

            return successResponse(res, null, 'Entry removed from blacklist');
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get history of fraud risk evaluations
     */
    async getRiskLogs(req, res, next) {
        try {
            const logs = await prisma.bookingAuditLog.findMany({
                where: { action: 'risk_evaluation' },
                orderBy: { createdAt: 'desc' },
                take: 100 // Last 100 entries
            });

            // Parse details if they are stored as JSON stirngs
            const parsedLogs = logs.map(log => ({
                ...log,
                details: typeof log.details === 'string' ? JSON.parse(log.details) : log.details
            }));

            return successResponse(res, parsedLogs);
        } catch (error) {
            next(error);
        }
    }
}

export const blacklistController = new BlacklistController();
