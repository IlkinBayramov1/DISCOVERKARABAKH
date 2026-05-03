import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class RevenueService {
    async createRule(hotelId, data) {
        const sanitized = this._sanitizeData(data);
        return prisma.pricingRule.create({
            data: {
                ...sanitized,
                hotelId
            }
        });
    }

    async getRules(hotelId, roomTypeId = null, onlyActive = true) {
        const where = {
            hotelId,
            OR: [
                { roomTypeId: roomTypeId },
                { roomTypeId: null }
            ]
        };

        if (onlyActive) {
            where.isActive = true;
        }

        return prisma.pricingRule.findMany({
            where,
            orderBy: { priority: 'desc' }
        });
    }

    async updateRule(ruleId, hotelId, data) {
        const rule = await prisma.pricingRule.findUnique({ where: { id: ruleId } });
        if (!rule || rule.hotelId !== hotelId) throw ApiError.notFound('Rule not found');

        const sanitized = this._sanitizeData(data);
        return prisma.pricingRule.update({
            where: { id: ruleId },
            data: sanitized
        });
    }

    async deleteRule(ruleId, hotelId) {
        const rule = await prisma.pricingRule.findUnique({ where: { id: ruleId } });
        if (!rule || rule.hotelId !== hotelId) throw ApiError.notFound('Rule not found');

        return prisma.pricingRule.delete({ where: { id: ruleId } });
    }

    /**
     * Applies active rules to a base price for a given date.
     */
    applyRules(basePrice, rules, date, currentOccupancy = 0) {
        let adjustedPrice = basePrice;
        const d = new Date(date);
        const dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];

        for (const rule of rules) {
            let matches = false;

            if (rule.type === 'WEEKEND') {
                const targetDays = rule.daysOfWeek ? rule.daysOfWeek.split(',') : ["Fri", "Sat"];
                if (targetDays.includes(dayName)) matches = true;
            } else if (rule.type === 'SEASONAL' || rule.type === 'HOLIDAY') {
                if (rule.startDate && rule.endDate) {
                    const start = new Date(rule.startDate);
                    const end = new Date(rule.endDate);
                    if (d >= start && d <= end) matches = true;
                }
            } else if (rule.type === 'OCCUPANCY_BASED') {
                if (rule.occupancyThreshold !== null && currentOccupancy >= rule.occupancyThreshold) {
                    matches = true;
                }
            }

            if (matches) {
                if (rule.adjustment === 'PERCENTAGE') {
                    adjustedPrice += adjustedPrice * (rule.value / 100);
                } else if (rule.adjustment === 'FIXED_ADDITION') {
                    adjustedPrice += rule.value;
                } else if (rule.adjustment === 'FIXED_OVERRIDE') {
                    adjustedPrice = rule.value;
                }
            }
        }

        return adjustedPrice;
    }
    _sanitizeData(data) {
        const sanitized = { ...data };
        
        // Convert empty strings to null for optional DateTime and Relation fields
        if (sanitized.startDate === "" || sanitized.startDate === undefined) sanitized.startDate = null;
        if (sanitized.endDate === "" || sanitized.endDate === undefined) sanitized.endDate = null;
        if (sanitized.roomTypeId === "" || sanitized.roomTypeId === undefined) sanitized.roomTypeId = null;

        // Ensure dates are valid ISO strings if present
        if (sanitized.startDate) sanitized.startDate = new Date(sanitized.startDate);
        if (sanitized.endDate) sanitized.endDate = new Date(sanitized.endDate);

        return sanitized;
    }
}

export const revenueService = new RevenueService();
