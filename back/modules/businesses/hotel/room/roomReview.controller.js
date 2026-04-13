import { roomReviewService } from './roomReview.service.js';
import { successResponse } from '../../../../core/api.response.js';

class RoomReviewController {

    async create(req, res, next) {
        try {
            const { roomId } = req.params; // roomId maps to roomTypeId in DB
            const reviewData = req.body;

            const review = await roomReviewService.createReview(req.user.id, roomId, reviewData);
            return successResponse(res, review, { message: 'Room review successfully submitted.' }, 201);
        } catch (error) {
            next(error);
        }
    }

    async getReviewsByRoom(req, res, next) {
        try {
            const { roomId } = req.params; // roomId maps to roomTypeId
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await roomReviewService.getReviewsByRoom(roomId, page, limit);
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

export const roomReviewController = new RoomReviewController();
