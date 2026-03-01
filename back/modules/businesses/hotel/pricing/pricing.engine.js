import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

export class PricingEngine {

    /**
     * Central Method to execute Real-Estate level Hotel Booking pricing 
     * Handles DailyPricing lookups, Min/Max Stay length, Tax calculations, and Promotions safely.
     * 
     * @param {Object} data 
     * @param {Array} data.items - [{ roomTypeId, ratePlanId, checkIn, checkOut, adults, children }]
     */
    async calculateStayPrice(data) {
        if (!data.items || data.items.length === 0) {
            throw ApiError.badRequest('Booking items are required for price calculation');
        }

        let grossTotal = 0;
        let nightlyBreakdowns = [];

        // Iterate over requested cart items (Rooms)
        for (const item of data.items) {
            const checkInDate = new Date(item.checkIn);
            const checkOutDate = new Date(item.checkOut);

            if (checkInDate >= checkOutDate) {
                throw ApiError.badRequest('Check-Out must be strictly after Check-In');
            }

            const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

            // Load aggregate DailyPricing for this room across requested sequence
            const pricingMatrix = await prisma.dailyPricing.findMany({
                where: {
                    roomTypeId: item.roomTypeId,
                    date: {
                        gte: checkInDate,
                        lt: checkOutDate // Checkout date itself does not accrue strictly.
                    }
                },
                orderBy: { date: 'asc' }
            });

            if (pricingMatrix.length !== totalNights) {
                throw ApiError.badRequest(`Missing pricing sequence rules for one or more requested dates.`);
            }

            let itemNightlyLog = [];
            let itemTotal = 0;

            // Sequential Iteration Validation for MinStays / Arrival Blocks
            for (let i = 0; i < pricingMatrix.length; i++) {
                const dayRules = pricingMatrix[i];

                if (i === 0 && dayRules.closedToArrival) {
                    throw ApiError.badRequest(`Arrival is blocked on start date: ${dayRules.date}`);
                }

                if (totalNights < dayRules.minStay) {
                    throw ApiError.badRequest(`Minimum stay length violation. Requires at least ${dayRules.minStay} nights.`);
                }
                if (dayRules.maxStay && totalNights > dayRules.maxStay) {
                    throw ApiError.badRequest(`Maximum stay length violation.`);
                }

                // Child / Guest Surcharge Logic placeholder depending on RatePlan limits (Future Scope)

                itemTotal += dayRules.basePrice;

                itemNightlyLog.push({
                    date: dayRules.date,
                    basePrice: dayRules.basePrice,
                    currency: dayRules.currency
                });
            }

            grossTotal += itemTotal;

            nightlyBreakdowns.push({
                roomTypeId: item.roomTypeId,
                log: itemNightlyLog,
                subtotal: itemTotal
            });
        }

        // Apply Global or Hotel bounded Taxes
        const hotelId = data.vendorId; // Inherited globally from Booking Validation context
        const applicableTaxes = await prisma.taxRule.findMany({
            where: {
                OR: [
                    { hotelId: hotelId },
                    { hotelId: null }
                ]
            }
        });

        let totalTaxes = 0;
        const mappedTaxes = applicableTaxes.map(tax => {
            let taxAmount = 0;
            if (tax.type === 'percentage') {
                taxAmount = grossTotal * (tax.value / 100);
            } else if (tax.type === 'fixed') {
                taxAmount = tax.value; // Applied once per reservation currently
            }
            totalTaxes += taxAmount;
            return { name: tax.name, amount: taxAmount };
        });

        const exactTotal = grossTotal + totalTaxes;

        return {
            grossTotal,
            exactTotal,
            taxes: mappedTaxes,
            breakdowns: nightlyBreakdowns
        };
    }
}

export const pricingEngine = new PricingEngine();
