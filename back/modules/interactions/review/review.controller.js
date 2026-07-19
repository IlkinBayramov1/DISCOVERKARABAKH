import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';
import { ReviewEligibilityService } from './reviewEligibility.service.js';
import crypto from 'crypto';

export const addReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { businessId, type, rating, comment } = req.body;

        if (!type) throw ApiError.badRequest('Type (hotel/tour/event/restaurant/attraction/room) is required');
        if (!businessId) throw ApiError.badRequest('Business ID is required');

        const review = await prisma.$transaction(
            async (tx) => {
                const eligibility = await ReviewEligibilityService.canReview(tx, userId, type, businessId);
                if (!eligibility.eligible) {
                    throw new ApiError(403, eligibility.message, eligibility.code);
                }

                if (type === 'attraction') {
                    return await tx.attractionreview.create({
                        data: {
                            id: crypto.randomUUID(),
                            userId,
                            attractionId: businessId,
                            rating: Number(rating),
                            comment,
                            status: 'approved'
                        }
                    });
                }

                if (type === 'room') {
                    return await tx.roomreview.create({
                        data: {
                            id: crypto.randomUUID(),
                            userId,
                            roomTypeId: businessId,
                            rating: Number(rating),
                            comment,
                            status: 'approved'
                        }
                    });
                }

                return await tx.review.create({
                    data: {
                        id: crypto.randomUUID(),
                        userId,
                        rating: Number(rating),
                        comment,
                        hotelId: type === 'hotel' ? businessId : null,
                        tourId: type === 'tour' ? businessId : null,
                        eventId: type === 'event' ? businessId : null,
                        restaurantId: type === 'restaurant' ? businessId : null,
                        status: 'pending'
                    }
                });
            },
            {
                isolationLevel: 'Serializable'
            }
        );

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        if (error.code === 'P2002') {
            return next(new ApiError(400, 'Siz artıq bu xidmət üçün rəy yazmısınız.', 'ALREADY_REVIEWED'));
        }
        next(error);
    }
};

export const getBusinessReviews = async (req, res, next) => {
    try {
        // We need to know if businessId is hotel or tour.
        // The route parameter is just :businessId.
        // We might need to query both or expect a query param ?type=hotel
        // OR we just try to find reviews where hotelId=id OR tourId=id

        const { businessId } = req.params;

        const reviews = await prisma.review.findMany({
            where: {
                OR: [
                    { hotelId: businessId },
                    { tourId: businessId },
                    { eventId: businessId },
                    { restaurantId: businessId }
                ]
            },
            include: {
                user: { select: { email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        next(error);
    }
};
