import promoService from './promo.service.js';
import { successResponse } from '../../../../core/api.response.js';

class PromoController {
    async create(req, res, next) {
        try {
            const vendorId = req.user.id;
            const { restaurantId } = req.params;
            const promo = await promoService.createPromo(restaurantId, vendorId, req.body);
            return successResponse(res, promo, { message: 'Promo Code activated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async validate(req, res, next) {
        try {
            // Expected in body: { code: 'WINTER20', cartTotal: 45.00 }
            const { restaurantId } = req.params;
            const { code, cartTotal } = req.body;

            const result = await promoService.validatePromoCode(restaurantId, code, parseFloat(cartTotal));
            return successResponse(res, result);
        } catch (error) {
            next(error);
        }
    }
}

export default new PromoController();
