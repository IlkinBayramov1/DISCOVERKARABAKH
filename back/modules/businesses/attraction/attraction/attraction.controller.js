import { attractionService } from './attraction.service.js';
import { weatherService } from '../../../shared/weather/weather.service.js';
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
            const filters = { ...req.query };
            
            // If the user is a vendor, they should only see their own attractions in the vendor app context
            // We can detect this by checking if they are authenticated and have a vendor role
            // NOTE: Public users won't have req.user
            if (req.user && req.user.role === 'vendor' && !filters.all) {
                filters.vendorId = req.user.id;
            }

            const result = await attractionService.getAttractions(filters);
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

    async getNearby(req, res, next) {
        try {
            const results = await attractionService.getNearbyAttractions(req.query);
            return successResponse(res, results);
        } catch (error) {
            next(error);
        }
    }

    async getWeather(req, res, next) {
        try {
            const attraction = await attractionService.getAttractionById(req.params.id);
            const weather = await weatherService.getWeather(attraction.latitude, attraction.longitude);
            return successResponse(res, weather);
        } catch (error) {
            next(error);
        }
    }

    async getWeatherByCity(req, res, next) {
        try {
            const { city } = req.query;
            if (!city) throw ApiError.badRequest('City name is required');
            const weather = await weatherService.getWeatherByCity(city);
            return successResponse(res, weather);
        } catch (error) {
            next(error);
        }
    }

    async getVendorReviews(req, res, next) {
        try {
            const vendorId = req.user.id;
            const reviews = await attractionService.getVendorReviews(vendorId);
            return successResponse(res, reviews);
        } catch (error) {
            next(error);
        }
    }
}

export const attractionController = new AttractionController();
