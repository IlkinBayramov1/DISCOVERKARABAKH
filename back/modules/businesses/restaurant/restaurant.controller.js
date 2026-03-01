import restaurantService from './restaurant.service.js';
import { successResponse, paginatedResponse } from '../../../core/api.response.js';

class RestaurantController {
    async create(req, res, next) {
        try {
            const vendorId = req.user.id;
            const restaurant = await restaurantService.createRestaurant(vendorId, req.body);
            return successResponse(res, restaurant, { message: 'Restaurant pending approval' });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const restaurant = await restaurantService.getRestaurant(req.params.id);
            return successResponse(res, restaurant);
        } catch (error) {
            next(error);
        }
    }

    async getBySlug(req, res, next) {
        try {
            const restaurant = await restaurantService.getRestaurantBySlug(req.params.slug);
            return successResponse(res, restaurant);
        } catch (error) {
            next(error);
        }
    }

    async search(req, res, next) {
        try {
            const { count, results } = await restaurantService.searchRestaurants(req.query);
            return paginatedResponse(res, results, { total: count });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const vendorId = req.user.id;
            const restaurant = await restaurantService.updateRestaurant(req.params.id, vendorId, req.body);
            return successResponse(res, restaurant);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const vendorId = req.user.id;
            await restaurantService.deleteRestaurant(req.params.id, vendorId);
            return successResponse(res, { message: 'Restaurant deactivated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async adminUpdateStatus(req, res, next) {
        try {
            const { status } = req.body;
            const restaurant = await restaurantService.adminUpdateStatus(req.params.id, status);
            return successResponse(res, restaurant, { message: `Restaurant marked as ${status}` });
        } catch (error) {
            next(error);
        }
    }
}

export default new RestaurantController();
