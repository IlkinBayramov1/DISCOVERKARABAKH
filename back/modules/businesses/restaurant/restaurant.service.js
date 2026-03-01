import restaurantRepo from './restaurant.repository.js';
import { ApiError } from '../../../core/api.error.js';

class RestaurantService {
    async createRestaurant(vendorId, data) {
        // Business logic validations if needed
        return await restaurantRepo.create(vendorId, data);
    }

    async getRestaurant(id) {
        const restaurant = await restaurantRepo.findById(id);
        if (!restaurant) throw ApiError.notFound('Restaurant not found');
        return restaurant;
    }

    async getRestaurantBySlug(slug) {
        const restaurant = await restaurantRepo.findBySlug(slug);
        if (!restaurant) throw ApiError.notFound('Restaurant mapping error');
        return restaurant;
    }

    async searchRestaurants(query) {
        const filters = {
            lat: query.lat ? parseFloat(query.lat) : null,
            lng: query.lng ? parseFloat(query.lng) : null,
            radiusKm: query.radius ? parseFloat(query.radius) : 50,
            cuisineId: query.cuisineId,
            priceRange: query.priceRange ? parseInt(query.priceRange) : null,
            isFeatured: query.isFeatured === 'true',
            status: 'active'
        };

        const pagination = {
            limit: parseInt(query.limit) || 20,
            offset: parseInt(query.offset) || 0
        };

        const { count, results } = await restaurantRepo.search(filters, pagination);
        return { count, results };
    }

    async updateRestaurant(id, vendorId, data) {
        return await restaurantRepo.update(id, vendorId, data);
    }

    async deleteRestaurant(id, vendorId) {
        return await restaurantRepo.delete(id, vendorId);
    }

    async adminUpdateStatus(id, status) {
        return await restaurantRepo.updateStatus(id, status);
    }
}

export default new RestaurantService();
