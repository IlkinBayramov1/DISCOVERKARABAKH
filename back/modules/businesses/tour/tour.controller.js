import { tourService } from './tour.service.js';
import { tourSchemas } from './tour.validation.js';
import { ApiError } from '../../../core/api.error.js';

export const createTour = async (req, res, next) => {
    try {
        const { error, value } = tourSchemas.create.validate(req.body);
        if (error) throw ApiError.badRequest(error.details[0].message);

        value.ownerId = req.user.id;
        const tour = await tourService.createTour(value);
        res.status(201).json({ success: true, data: tour });
    } catch (error) {
        next(error);
    }
};

export const getVendorTours = async (req, res, next) => {
    try {
        const { tours, totalCount } = await tourService.getVendorTours(req.user.id, req.query);
        res.status(200).json({ 
            success: true, 
            count: tours.length, 
            data: tours,
            pagination: {
                totalCount,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                totalPages: Math.ceil(totalCount / (parseInt(req.query.limit) || 10))
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getTours = async (req, res, next) => {
    try {
        const { tours, totalCount } = await tourService.getTours(req.query);
        res.status(200).json({ 
            success: true, 
            count: tours.length, 
            data: tours,
            pagination: {
                totalCount,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 12,
                totalPages: Math.ceil(totalCount / (parseInt(req.query.limit) || 12))
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getTourById = async (req, res, next) => {
    try {
        const tour = await tourService.getTourById(req.params.id);
        res.status(200).json({ success: true, data: tour });
    } catch (error) {
        next(error);
    }
};

export const getTourBySlug = async (req, res, next) => {
    try {
        const tour = await tourService.getTourBySlug(req.params.slug);
        res.status(200).json({ success: true, data: tour });
    } catch (error) {
        next(error);
    }
};

export const updateTour = async (req, res, next) => {
    try {
        const { error, value } = tourSchemas.update.validate(req.body);
        if (error) throw ApiError.badRequest(error.details[0].message);

        const updatedTour = await tourService.updateTour(req.params.id, value, req.user.id, req.user.role);
        res.status(200).json({ success: true, data: updatedTour });
    } catch (error) {
        next(error);
    }
};

export const deleteTour = async (req, res, next) => {
    try {
        await tourService.deleteTour(req.params.id, req.user.id, req.user.role);
        res.status(200).json({ success: true, message: 'Tour deleted' });
    } catch (error) {
        next(error);
    }
};

export const getTourAvailability = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { date } = req.query;

        if (!date) throw ApiError.badRequest('Date query parameter is required');

        const availability = await tourService.getTourAvailability(id, date);
        res.status(200).json({ success: true, data: availability });
    } catch (error) {
        next(error);
    }
};

export const getMonthlyAvailability = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) throw ApiError.badRequest('startDate and endDate are required');

        const availability = await tourService.getMonthlyAvailability(id, startDate, endDate);
        res.status(200).json({ success: true, data: availability });
    } catch (error) {
        next(error);
    }
};

export const bulkUpdateAvailability = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await tourService.bulkUpdateAvailability(id, req.body);
        res.status(200).json({ success: true, message: 'Availability updated successfully', data: result });
    } catch (error) {
        next(error);
    }
};
