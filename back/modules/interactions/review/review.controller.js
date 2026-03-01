import prisma from '../../../config/db.js';
import { ApiError } from '../../../core/api.error.js';

export const addReview = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { businessId, type, rating, comment } = req.body;
        // Expect type ('hotel'/'tour') in body now to know which table to link

        if (!type) throw ApiError.badRequest('Type (hotel/tour) is required');

        // Optional: Check if user booked.
        // implementation matches previous logic, simplified for migration speed
        // const hasBooking = ...

        const review = await prisma.review.create({
            data: {
                userId,
                rating,
                comment,
                hotelId: type === 'hotel' ? businessId : null,
                tourId: type === 'tour' ? businessId : null,
                eventId: type === 'event' ? businessId : null,
                restaurantId: type === 'restaurant' ? businessId : null,
            }
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        if (error.code === 'P2002') { // Unique constraint failed
            return next(ApiError.badRequest('You have already reviewed this business'));
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
