import { hotelReviewService } from './hotelReview.service.js';
import { successResponse } from '../../../../core/api.response.js';

class HotelReviewController {

    async create(req, res, next) {
        try {
            const { hotelId } = req.params;
            const reviewData = req.body;
            // The service securely enforces 'userId' restrictions internally.
            const review = await hotelReviewService.createReview(req.user.id, hotelId, reviewData);
            return successResponse(res, review, { message: 'Review successfully submitted and awaiting moderation.' }, 201);
        } catch (error) {
            next(error);
        }
    }

    async getReviewsByHotel(req, res, next) {
        try {
            const { hotelId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await hotelReviewService.getReviewsByHotel(hotelId, page, limit);
            return successResponse(res, result.reviews, {
                total: result.total,
                page: result.page,
                totalPages: result.totalPages
            });
        } catch (error) {
            next(error);
        }
    }
}

export const hotelReviewController = new HotelReviewController();
