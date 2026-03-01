import { PrismaClient } from '@prisma/client';
import restaurantRepo from '../restaurant.repository.js';
import { ApiError } from '../../../../core/api.error.js';

const prisma = new PrismaClient();

class PromoService {

    async createPromo(restaurantId, vendorId, data) {
        // Enforce ownership
        const restaurant = await restaurantRepo.findById(restaurantId);
        if (!restaurant || restaurant.vendorId !== vendorId) {
            throw ApiError.forbidden('Access denied to creating promos for this restaurant');
        }

        const existingPromo = await prisma.promoCode.findUnique({ where: { code: data.code.toUpperCase() } });
        if (existingPromo) throw ApiError.badRequest('Promo code already exists');

        return await prisma.promoCode.create({
            data: {
                restaurantId,
                code: data.code.toUpperCase(),
                discountType: data.discountType, // PERCENTAGE or FIXED
                discountValue: parseFloat(data.discountValue),
                minOrderValue: data.minOrderValue ? parseFloat(data.minOrderValue) : null,
                maxDiscountAmount: data.maxDiscountAmount ? parseFloat(data.maxDiscountAmount) : null,
                validFrom: new Date(data.validFrom),
                validUntil: new Date(data.validUntil),
                usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
                isStackable: data.isStackable || false,
                isActive: true
            }
        });
    }

    // Checking promo logic during checkout
    async validatePromoCode(restaurantId, code, cartTotal) {
        const promo = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });

        if (!promo) throw ApiError.notFound('Invalid promo code');
        if (promo.restaurantId !== restaurantId) throw ApiError.badRequest('Promo not valid at this restaurant');
        if (!promo.isActive) throw ApiError.badRequest('Promo code is disabled');

        const now = new Date();
        if (now < promo.validFrom || now > promo.validUntil) {
            throw ApiError.badRequest('Promo code has expired or is not yet active');
        }

        if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
            throw ApiError.badRequest('Promo code limit reached');
        }

        if (promo.minOrderValue && cartTotal < promo.minOrderValue) {
            throw ApiError.badRequest(`Minimum order amount of ${promo.minOrderValue} required`);
        }

        // Calculate actual discount mapped against limits
        let discountApplied = 0;
        if (promo.discountType === 'PERCENTAGE') {
            discountApplied = cartTotal * (promo.discountValue / 100);
            if (promo.maxDiscountAmount && discountApplied > promo.maxDiscountAmount) {
                discountApplied = promo.maxDiscountAmount;
            }
        } else if (promo.discountType === 'FIXED') {
            discountApplied = promo.discountValue;
        }

        // Prevent discount from surpassing total
        discountApplied = Math.min(discountApplied, cartTotal);

        return {
            promoId: promo.id,
            originalTotal: cartTotal,
            discountApplied: Number(discountApplied.toFixed(2)),
            finalTotal: Number((cartTotal - discountApplied).toFixed(2)),
            isStackable: promo.isStackable
        };
    }

    async deletePromo(promoId, vendorId) {
        // Validate ownership logic (pseudo-code expanded in reality)
        await prisma.promoCode.delete({ where: { id: promoId } });
    }
}

export default new PromoService();
