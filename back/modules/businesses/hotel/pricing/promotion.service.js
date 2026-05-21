import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class PromotionService {
    /**
     * Finds and validates a coupon code
     * @param {string} code 
     * @param {number} bookingTotal 
     * @param {string} hotelId 
     * @returns {Promise<Object>} The validated promotion object
     */
    async validateCoupon(code, bookingTotal, hotelId = null) {
        if (!code) return null;

        const promo = await prisma.promotion.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!promo) {
            throw ApiError.badRequest('Invalid coupon code');
        }

        if (!promo.isActive) {
            throw ApiError.badRequest('This coupon is no longer active');
        }

        const now = new Date();
        if (now < promo.validFrom || now > promo.validTo) {
            throw ApiError.badRequest('This coupon has expired');
        }

        if (promo.maxUses > 0 && promo.usedCount >= promo.maxUses) {
            throw ApiError.badRequest('This coupon has reached its usage limit');
        }

        if (bookingTotal < promo.minBookingValue) {
            throw ApiError.badRequest(`Minimum booking value of ${promo.minBookingValue} AZN required for this coupon`);
        }

        if (promo.hotelId && hotelId && promo.hotelId !== hotelId) {
            throw ApiError.badRequest('This coupon is not valid for this hotel');
        }

        return promo;
    }

    /**
     * Calculates the discount amount based on promotion type
     * @param {number} total 
     * @param {Object} promo 
     * @returns {number}
     */
    calculateDiscount(total, promo) {
        if (!promo) return 0;

        if (promo.discountType === 'percentage') {
            return total * (promo.discountValue / 100);
        } else if (promo.discountType === 'fixed') {
            return Math.min(promo.discountValue, total); // Cannot discount more than total
        }

        return 0;
    }

    /**
     * Increment the usage count of a coupon
     * @param {string} promoId 
     */
    async incrementUsage(promoId) {
        await prisma.promotion.update({
            where: { id: promoId },
            data: { usedCount: { increment: 1 } }
        });
    }
}

export const promotionService = new PromotionService();
