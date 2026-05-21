import menuService from './menu.service.js';
import { successResponse } from '../../../../core/api.response.js';

class MenuController {

    // --- CATEGORY ---
    async createCategory(req, res, next) {
        try {
            const vendorId = req.user.id;
            const { restaurantId } = req.params;
            const category = await menuService.addCategory(restaurantId, vendorId, req.body);
            return successResponse(res, category, { message: 'Menu category added' });
        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const vendorId = req.user.id;
            const { restaurantId, categoryId } = req.params;
            await menuService.removeCategory(categoryId, restaurantId, vendorId);
            return successResponse(res, { message: 'Menu category deleted' });
        } catch (error) {
            next(error);
        }
    }

    // --- ITEMS ---
    async createItem(req, res, next) {
        try {
            const vendorId = req.user.id;
            const { restaurantId, categoryId } = req.params;
            const item = await menuService.addItem(restaurantId, vendorId, categoryId, req.body);
            return successResponse(res, item, { message: 'Menu item created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async toggleAvailability(req, res, next) {
        try {
            const vendorId = req.user.id;
            const { restaurantId, itemId } = req.params;
            const { isAvailable } = req.body;
            const item = await menuService.toggleItemAvailability(restaurantId, vendorId, itemId, isAvailable);
            return successResponse(res, item, { message: `Item marked as ${isAvailable ? 'available' : 'unavailable'}` });
        } catch (error) {
            next(error);
        }
    }

    async deleteItem(req, res, next) {
        try {
            const vendorId = req.user.id;
            const { restaurantId, itemId } = req.params;
            await menuService.removeItem(restaurantId, vendorId, itemId);
            return successResponse(res, { message: 'Menu item deleted' });
        } catch (error) {
            next(error);
        }
    }
}

export default new MenuController();
