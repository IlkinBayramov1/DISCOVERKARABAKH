import { attractionService } from './attraction.service.js';
import { successResponse, paginatedResponse } from '../../../../core/api.response.js';

export class AttractionController {

    async create(req, res, next) {
        try {
            const data = {
                ...req.body,
                // Automatically assign vendor if admin hasn't overridden
                vendorId: req.body.vendorId || (req.user?.role === 'vendor' ? req.user.id : null)
            };
            const attraction = await attractionService.createAttraction(data);
            return res.status(201).json({ success: true, data: attraction, message: 'Attraction created successfully' });
        } catch (error) {
            next(error);
        }
    }

    async getList(req, res, next) {
        try {
            const result = await attractionService.getAttractions(req.query);
            return successResponse(res, result.data, { totalItems: result.totalItems });
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const attraction = await attractionService.getAttractionById(req.params.id);
            return successResponse(res, attraction);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const updated = await attractionService.updateAttraction(req.params.id, req.body);
            return successResponse(res, updated, { message: 'Attraction updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await attractionService.deleteAttraction(req.params.id);
            return successResponse(res, null, { message: 'Attraction deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export const attractionController = new AttractionController();
