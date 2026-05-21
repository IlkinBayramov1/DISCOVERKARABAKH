import { attractionReviewRepository } from './attractionReview.repository.js';
import { attractionEvents, REVIEW_CREATED } from '../attraction.events.js';
import { ApiError } from '../../../../core/api.error.js';

class AttractionReviewService {
    async createReview(userId, attractionId, reviewData) {
        // Ensure user hasn't already reviewed this attraction
        const existingReview = await attractionReviewRepository.findOne({ 
            userId, 
            attractionId 
        });
        
        if (existingReview) {
            throw ApiError.badRequest('You have already reviewed this attraction.');
        }

        const data = {
            rating: parseInt(reviewData.rating),
            comment: reviewData.comment,
            images: reviewData.images, // Array of strings (Json field in Prisma)
            userId,
            attractionId,
            status: 'approved'
        };

        const review = await attractionReviewRepository.create(data);

        // Emit event to update stats asynchronously
        attractionEvents.emit(REVIEW_CREATED, { attractionId });

        return review;
    }

    async getAttractionReviews(attractionId, query = { status: 'approved' }) {
        return await attractionReviewRepository.findByAttractionId(attractionId, query);
    }

    async updateReview(userId, reviewId, updateData) {
        const review = await attractionReviewRepository.findById(reviewId);
        if (!review) throw ApiError.notFound('Review not found');

        // Check ownership
        if (review.userId !== userId) {
            throw ApiError.forbidden('You are not authorized to edit this review');
        }

        return await attractionReviewRepository.update(reviewId, updateData);
    }

    async deleteReview(userId, reviewId, role) {
        const review = await attractionReviewRepository.findById(reviewId);
        if (!review) throw ApiError.notFound('Review not found');

        // Check ownership or admin rights
        if (review.userId !== userId && role !== 'admin') {
            throw ApiError.forbidden('You are not authorized to delete this review');
        }

        return await attractionReviewRepository.delete(reviewId);
    }

    async moderateReview(reviewId, status) {
        return await attractionReviewRepository.update(reviewId, { status });
    }

    async replyToReview(vendorId, reviewId, reply) {
        const review = await attractionReviewRepository.findById(reviewId);
        if (!review) throw ApiError.notFound('Review not found');

        // Verify that this vendor owns the attraction the review is for
        const { attractionService } = await import('../attraction/attraction.service.js');
        const attraction = await attractionService.getAttractionById(review.attractionId);
        
        if (attraction.vendorId !== vendorId) {
            throw ApiError.forbidden('You can only reply to reviews for your own attractions');
        }

        return await attractionReviewRepository.update(reviewId, { vendorReply: reply });
    }
}

export const attractionReviewService = new AttractionReviewService();
