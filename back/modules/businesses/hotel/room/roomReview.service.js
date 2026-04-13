import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class RoomReviewService {

    /**
     * Submit a Review for a particular Room Type.
     * Logic: Users who booked the hotel can leave a specific room review if they stayed in that room type.
     * Note: For MVP or simplified testing, we'll allow creation directly.
     */
    async createReview(userId, roomTypeId, reviewData) {

        // MVP: Bypass strict booking check for ease of testing room reviews
        // In full production, you would check if user booked THIS roomTypeId

        const { rating, comment } = reviewData;

        if (!rating) {
            throw ApiError.badRequest('Rating is required for room reviews.');
        }

        // Prevent double reviewing same room
        const recentReview = await prisma.roomReview.findFirst({
            where: {
                userId: userId,
                roomTypeId: roomTypeId
            }
        });

        if (recentReview) {
            throw ApiError.badRequest('You have already submitted a review for this room type.');
        }

        // Create the Room Review
        const newReview = await prisma.roomReview.create({
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
            prisma.roomReview.findMany({
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
            prisma.roomReview.count({
                where: {
                    roomTypeId: roomTypeId
                }
            })
        ]);

        return { reviews, total, page, totalPages: Math.ceil(total / limit) };
    }
}

export const roomReviewService = new RoomReviewService();
