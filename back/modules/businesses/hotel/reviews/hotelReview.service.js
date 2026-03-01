import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class HotelReviewService {

    /**
     * Submit a Review for a Hotel specifically enforcing Enterprise Business rules:
     * 1. The user MUST have a non-cancelled booking at this hotel.
     * 2. The Check-Out Date of that booking must be IN THE PAST (they actually stayed).
     * 3. The user can only leave ONE review per booking.
     */
    async createReview(userId, hotelId, reviewData) {

        // 1. Verify Ownership & Completed Stay
        const eligibleBooking = await prisma.booking.findFirst({
            where: {
                userId: userId,
                hotelId: hotelId,
                status: {
                    in: ['checked_out', 'completed', 'confirmed'] // Depending on runtime state mapping
                },
                items: {
                    some: {
                        checkOut: {
                            lt: new Date() // Checkout must be in the past
                        }
                    }
                }
            },
            include: { items: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!eligibleBooking) {
            throw ApiError.forbidden('You can only review hotels after you have completed a stay.');
        }

        // 2. Prevent Double Reviewing for the same Booking explicitly
        // (Booking model doesn't link directly to Review currently, so we check general duplicate lock)
        const recentReview = await prisma.review.findUnique({
            where: {
                userId_hotelId: {
                    userId: userId,
                    hotelId: hotelId
                }
            }
        });

        if (recentReview) {
            throw ApiError.badRequest('You have already submitted a review for this hotel.');
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
                status: 'pending' // Requires admin approval or automated sentiment analysis
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
}

export const hotelReviewService = new HotelReviewService();
