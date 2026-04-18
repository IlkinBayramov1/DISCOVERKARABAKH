import { tourRepository } from './tour.repository.js';
import slugify from 'slugify';
import { ApiError } from '../../../core/api.error.js';

class TourService {
    async createTour(tourData) {
        if (tourData.name) {
            tourData.slug = slugify(tourData.name, { lower: true, strict: true });
        }
        return tourRepository.create(tourData);
    }

    async getTours(query) {
        return tourRepository.findAll(query);
    }

    async getTourById(id) {
        const tour = await tourRepository.findById(id);
        if (!tour) throw ApiError.notFound('Tour not found');
        return tour;
    }

    async getTourBySlug(slug) {
        const tour = await tourRepository.findBySlug(slug);
        if (!tour) throw ApiError.notFound('Tour not found');
        return tour;
    }

    async updateTour(id, updateData, userId, userRole) {
        const tour = await tourRepository.findById(id);
        if (!tour) throw ApiError.notFound('Tour not found');

        if (tour.ownerId !== userId && userRole !== 'admin') {
            throw ApiError.forbidden('Not authorized to update this tour');
        }

        if (updateData.name) {
            updateData.slug = slugify(updateData.name, { lower: true, strict: true });
        }

        return tourRepository.update(id, updateData);
    }

    async deleteTour(id, userId, userRole) {
        const tour = await tourRepository.findById(id);
        if (!tour) throw ApiError.notFound('Tour not found');

        if (tour.ownerId !== userId && userRole !== 'admin') {
            throw ApiError.forbidden('Not authorized to delete this tour');
        }

        return tourRepository.delete(id);
    }

    async getVendorTours(vendorId, query = {}) {
        return tourRepository.findAll({ ...query, ownerId: vendorId });
    }

    async getTourAvailability(tourId, date) {
        const tour = await tourRepository.findById(tourId);
        if (!tour) throw ApiError.notFound('Tour not found');

        const bookedCount = await tourRepository.countBookedParticipants(tourId, date);
        const remainingSeats = Math.max(0, tour.groupSizeMax - bookedCount);

        return {
            tourId,
            date,
            maxSeats: tour.groupSizeMax,
            bookedCount,
            remainingSeats,
            isFull: remainingSeats <= 0
        };
    }
}

export const tourService = new TourService();
