import locationService from './location.service.js';
import { successResponse } from '../../../../core/api.response.js';

class LocationController {
    async search(req, res, next) {
        try {
            const { q } = req.query;
            const results = await locationService.search(q);
            return successResponse(res, results);
        } catch (error) {
            next(error);
        }
    }

    async selectLocation(req, res, next) {
        try {
            const { id } = req.params;
            await locationService.incrementPopularity(id);
            return successResponse(res, { message: "Popularity recorded" });
        } catch (error) {
            next(error);
        }
    }

    // --- Admin/Vendor Management ---
    async createLocation(req, res, next) {
        try {
            const location = await locationService.createLocation(req.body, req.user.id, req.user.role);
            res.status(201).json({ success: true, data: location });
        } catch (error) {
            next(error);
        }
    }

    async getLocations(req, res, next) {
        try {
            const locations = await locationService.getLocations(req.user.id, req.user.role, req.query);
            res.status(200).json({ success: true, count: locations.length, data: locations });
        } catch (error) {
            next(error);
        }
    }

    async updateLocation(req, res, next) {
        try {
            const location = await locationService.updateLocation(req.params.id, req.body, req.user.id, req.user.role);
            res.status(200).json({ success: true, data: location });
        } catch (error) {
            next(error);
        }
    }

    async deleteLocation(req, res, next) {
        try {
            await locationService.deleteLocation(req.params.id, req.user.id, req.user.role);
            res.status(200).json({ success: true, message: 'Location deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

export default new LocationController();
