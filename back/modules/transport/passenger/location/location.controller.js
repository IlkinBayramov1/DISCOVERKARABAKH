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

    // Optional endpoint: when passenger selects an autocomplete point, frontend calls this to increment popularity
    async selectLocation(req, res, next) {
        try {
            const { id } = req.params;
            await locationService.incrementPopularity(id);
            return successResponse(res, { message: "Popularity recorded" });
        } catch (error) {
            next(error);
        }
    }
}

export default new LocationController();
