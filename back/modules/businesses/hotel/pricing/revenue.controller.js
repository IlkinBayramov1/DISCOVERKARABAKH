import { revenueService } from './revenue.service.js';
import { successResponse } from '../../../../core/api.response.js';

class RevenueController {
    async createRule(req, res, next) {
        try {
            const { hotelId } = req.params;
            const rule = await revenueService.createRule(hotelId, req.body);
            return successResponse(res, rule, { message: 'Pricing rule created successfully', statusCode: 201 });
        } catch (error) {
            next(error);
        }
    }

    async getRules(req, res, next) {
        try {
            const { hotelId } = req.params;
            const { roomTypeId } = req.query;
            const rules = await revenueService.getRules(hotelId, roomTypeId, false);
            return successResponse(res, rules);
        } catch (error) {
            next(error);
        }
    }

    async updateRule(req, res, next) {
        try {
            const { hotelId, ruleId } = req.params;
            const rule = await revenueService.updateRule(ruleId, hotelId, req.body);
            return successResponse(res, rule, { message: 'Pricing rule updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async deleteRule(req, res, next) {
        try {
            const { hotelId, ruleId } = req.params;
            await revenueService.deleteRule(ruleId, hotelId);
            return successResponse(res, null, { message: 'Pricing rule deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export const revenueController = new RevenueController();
