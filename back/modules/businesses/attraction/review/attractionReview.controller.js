import { attractionReviewService } from './attractionReview.service.js';
import { successResponse } from '../../../../core/api.response.js';

export class AttractionReviewController {
    async create(req, res, next) {
        try {
            const result = await attractionReviewService.createReview(
                req.user.id, 
                req.params.id, 
                req.body
            );
            return successResponse(res, result, { status: 201 });
        } catch (error) {
            next(error);
        }
    }

    async getByAttractionId(req, res, next) {
        try {
            const results = await attractionReviewService.getAttractionReviews(req.params.id, req.query);
            return successResponse(res, results);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const result = await attractionReviewService.updateReview(
                req.user.id, 
                req.params.reviewId, 
                req.body
            );
            return successResponse(res, result);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await attractionReviewService.deleteReview(
                req.user.id, 
                req.params.reviewId, 
                req.user.role
            );
            return successResponse(res, null, { message: 'Review deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async reply(req, res, next) {
        try {
            const { reviewId } = req.params;
            const { reply } = req.body;
            const result = await attractionReviewService.replyToReview(req.user.id, reviewId, reply);
            return successResponse(res, result, { message: 'Reply submitted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export const attractionReviewController = new AttractionReviewController();
