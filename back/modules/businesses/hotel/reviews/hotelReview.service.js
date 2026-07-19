import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';
import { ReviewEligibilityService } from '../../../interactions/review/reviewEligibility.service.js';

class HotelReviewService {

    /**
     * Submit a Review for a Hotel specifically enforcing Enterprise Business rules:
     * 1. The user MUST have a non-cancelled booking at this hotel.
     * 2. The Check-Out Date of that booking must be IN THE PAST (they actually stayed).
     * 3. The user can only leave ONE review per booking.
     */
    async createReview(userId, hotelId, reviewData) {
        // 1. Centralized Eligibility Check
        const eligibility = await ReviewEligibilityService.canReview(prisma, userId, 'hotel', hotelId);
        if (!eligibility.eligible) {
            throw new ApiError(403, eligibility.message, eligibility.code);
        }

        // 3. Extract Detailed Scoring for Hotel Subdomain
        const {
            rating,
            comment,
            cleanlinessScore,
            locationScore,
            staffScore
        } = reviewData;

        // Optionally compute average rating if child scores are provided but no master rating
        let finalRating = rating;
        if (!finalRating && cleanlinessScore && locationScore && staffScore) {
            finalRating = (cleanlinessScore + locationScore + staffScore) / 3;
        }

        if (!finalRating) {
            throw ApiError.badRequest('Overall rating is required.');
        }

        // 4. Create the Review
        const newReview = await prisma.review.create({
            data: {
                userId,
                hotelId,
                rating: finalRating,
                cleanlinessScore,
                locationScore,
                staffScore,
                comment,
                status: 'approved' // Automatically bypass moderation for MVP
            }
        });

        // 5. Trigger async materialized view Recalculation (or Queue)
        // This recalculates the `HotelSearchSnapshot` average Review score.
        // E.g: eventEmitter.emit('REVIEW_CREATED', { hotelId });

        return newReview;
    }

    async getReviewsByHotel(hotelId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: {
                    hotelId,
                    status: 'approved'
                },
                include: {
                    user: { select: { email: true } } // Mask PI if needed
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.review.count({
                where: {
                    hotelId,
                    status: 'approved'
                }
            })
        ]);

        return { reviews, total, page, totalPages: Math.ceil(total / limit) };
    }
    async replyToReview(reviewId, vendorId, reply) {
        // Try to find in general reviews first
        let review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: { hotel: true }
        });

        let model = 'review';

        if (!review) {
            // Try in room reviews
            review = await prisma.roomreview.findUnique({
                where: { id: reviewId },
                include: { roomtype: { include: { hotel: true } } }
            });
            model = 'roomreview';
        }

        if (!review) throw ApiError.notFound('Review not found');

        // Authorization check
        const hotel = model === 'review' ? review.hotel : review.roomtype.hotel;
        if (hotel.ownerId !== vendorId) {
            throw ApiError.forbidden('You can only reply to reviews for your own hotels');
        }

        // Update the reply
        return prisma[model].update({
            where: { id: reviewId },
            data: { vendorReply: reply }
        });
    }
}

export const hotelReviewService = new HotelReviewService();
