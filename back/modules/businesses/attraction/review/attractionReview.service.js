import { attractionReviewRepository } from './attractionReview.repository.js';
import { ApiError } from '../../../../core/api.error.js';

class AttractionReviewService {
    async createReview(userId, attractionId, reviewData) {
        // Ensure user hasn't already reviewed this attraction
        const existingReview = await attractionReviewRepository.findOne({ 
            user: userId, 
            attraction: attractionId 
        });
        
        if (existingReview) {
            throw ApiError.badRequest('You have already reviewed this attraction.');
        }

        const data = {
            ...reviewData,
            user: userId,
            attraction: attractionId,
        };

        return attractionReviewRepository.create(data);
    }

    async getAttractionReviews(attractionId, query = { status: 'approved' }) {
        return attractionReviewRepository.findByAttractionId(attractionId, query);
    }

    async updateReview(userId, reviewId, updateData) {
        const review = await attractionReviewRepository.findById(reviewId);
        if (!review) throw ApiError.notFound('Review not found');

        // Check ownership
        if (review.user._id.toString() !== userId.toString()) {
            throw ApiError.forbidden('You are not authorized to edit this review');
        }

        return attractionReviewRepository.update(reviewId, updateData);
    }

    async deleteReview(userId, reviewId, role) {
        const review = await attractionReviewRepository.findById(reviewId);
        if (!review) throw ApiError.notFound('Review not found');

        // Check ownership or admin rights
        if (review.user._id.toString() !== userId.toString() && role !== 'admin') {
            throw ApiError.forbidden('You are not authorized to delete this review');
        }

        return attractionReviewRepository.delete(reviewId);
    }

    async moderateReview(reviewId, status) {
        return attractionReviewRepository.update(reviewId, { status });
    }
}

export const attractionReviewService = new AttractionReviewService();
