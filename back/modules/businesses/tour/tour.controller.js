import { tourRepository } from './tour.repository.js';
import { ApiError } from '../../../core/api.error.js';

export const createTour = async (req, res, next) => {
    try {
        req.body.owner = req.user._id;
        const tour = await tourRepository.create(req.body);
        res.status(201).json({ success: true, data: tour });
    } catch (error) {
        next(error);
    }
};

export const getTours = async (req, res, next) => {
    try {
        const tours = await tourRepository.findAll(req.query);
        res.status(200).json({ success: true, count: tours.length, data: tours });
    } catch (error) {
        next(error);
    }
};

export const getTourById = async (req, res, next) => {
    try {
        const tour = await tourRepository.findById(req.params.id);
        if (!tour) throw ApiError.notFound('Tour not found');
        res.status(200).json({ success: true, data: tour });
    } catch (error) {
        next(error);
    }
};

export const updateTour = async (req, res, next) => {
    try {
        let tour = await tourRepository.findById(req.params.id);
        if (!tour) throw ApiError.notFound('Tour not found');

        if (tour.owner._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw ApiError.forbidden('Not authorized');
        }

        tour = await tourRepository.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: tour });
    } catch (error) {
        next(error);
    }
};

export const deleteTour = async (req, res, next) => {
    try {
        const tour = await tourRepository.findById(req.params.id);
        if (!tour) throw ApiError.notFound('Tour not found');

        if (tour.owner._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw ApiError.forbidden('Not authorized');
        }

        await tourRepository.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Tour deleted' });
    } catch (error) {
        next(error);
    }
};
