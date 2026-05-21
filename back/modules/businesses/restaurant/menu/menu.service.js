import menuRepo from './menu.repository.js';
import restaurantRepo from '../restaurant.repository.js';
import { ApiError } from '../../../../core/api.error.js';

class MenuService {
    // Helper to ensure vendor owns the restaurant before modifying its menu
    async _verifyOwnership(restaurantId, vendorId) {
        const restaurant = await restaurantRepo.findById(restaurantId);
        if (!restaurant) throw ApiError.notFound('Restaurant not found');
        if (restaurant.vendorId !== vendorId) {
            throw ApiError.forbidden('You do not own this restaurant');
        }
    }

    // --- CATEGORIES ---
    async addCategory(restaurantId, vendorId, data) {
        await this._verifyOwnership(restaurantId, vendorId);
        return await menuRepo.createCategory(restaurantId, data);
    }

    async removeCategory(categoryId, restaurantId, vendorId) {
        await this._verifyOwnership(restaurantId, vendorId);
        // Note: Prisma Cascades will automatically delete all Items under this category
        return await menuRepo.deleteCategory(categoryId);
    }

    // --- ITEMS ---
    async addItem(restaurantId, vendorId, categoryId, data) {
        await this._verifyOwnership(restaurantId, vendorId);
        return await menuRepo.createItem(categoryId, data);
    }

    async toggleItemAvailability(restaurantId, vendorId, itemId, isAvailable) {
        await this._verifyOwnership(restaurantId, vendorId);
        return await menuRepo.updateItemAvailability(itemId, isAvailable);
    }

    async removeItem(restaurantId, vendorId, itemId) {
        await this._verifyOwnership(restaurantId, vendorId);
        return await menuRepo.deleteItem(itemId);
    }
}

export default new MenuService();
