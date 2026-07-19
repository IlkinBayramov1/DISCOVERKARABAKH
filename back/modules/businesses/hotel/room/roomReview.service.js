import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';
import { ReviewEligibilityService } from '../../../interactions/review/reviewEligibility.service.js';

class RoomReviewService {

    /**
     * Submit a Review for a particular Room Type.
     * Logic: Users who booked the hotel can leave a specific room review if they stayed in that room type.
     * Note: For MVP or simplified testing, we'll allow creation directly.
     */
    async createReview(userId, roomTypeId, reviewData) {
        // 1. Centralized Eligibility Check
        const eligibility = await ReviewEligibilityService.canReview(prisma, userId, 'room', roomTypeId);
        if (!eligibility.eligible) {
            throw new ApiError(403, eligibility.message, eligibility.code);
        }

        const { rating, comment } = reviewData;

        if (!rating) {
            throw ApiError.badRequest('Rating is required for room reviews.');
        }

        // Create the Room Review
        const newReview = await prisma.roomreview.create({
            data: {
                userId,
                roomTypeId,
                rating,
                comment
            }
        });

        return newReview;
    }

    async getReviewsByRoom(roomTypeId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.roomreview.findMany({
                where: {
                    roomTypeId: roomTypeId
                },
                include: {
                    user: { select: { email: true } }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.roomreview.count({
                where: {
                    roomTypeId: roomTypeId
                }
            })
        ]);

        return { reviews, total, page, totalPages: Math.ceil(total / limit) };
    }
}

export const roomReviewService = new RoomReviewService();
