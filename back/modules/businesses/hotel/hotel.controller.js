import { hotelRepository } from './hotel.repository.js';
import { ApiError } from '../../../core/api.error.js';

export const createHotel = async (req, res, next) => {
    try {
        // Ensure the creator owns the hotel
        req.body.owner = req.user._id;

        const hotel = await hotelRepository.create(req.body);
        res.status(201).json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

export const getHotels = async (req, res, next) => {
    try {
        const hotels = await hotelRepository.findAll(req.query);
        res.status(200).json({ success: true, count: hotels.length, data: hotels });
    } catch (error) {
        next(error);
    }
};

export const getHotelById = async (req, res, next) => {
    try {
        const hotel = await hotelRepository.findById(req.params.id);
        if (!hotel) throw ApiError.notFound('Hotel not found');

        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

export const updateHotel = async (req, res, next) => {
    try {
        let hotel = await hotelRepository.findById(req.params.id);
        if (!hotel) throw ApiError.notFound('Hotel not found');

        // Check ownership
        // Pass ownership check to service layer in future, currently here for simplicity
        if (hotel.owner._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw ApiError.forbidden('You are not authorized to update this hotel');
        }

        hotel = await hotelRepository.update(req.params.id, req.body);
        res.status(200).json({ success: true, data: hotel });
    } catch (error) {
        next(error);
    }
};

export const deleteHotel = async (req, res, next) => {
    try {
        const hotel = await hotelRepository.findById(req.params.id);
        if (!hotel) throw ApiError.notFound('Hotel not found');

        if (hotel.owner._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw ApiError.forbidden('You are not authorized to delete this hotel');
        }

        await hotelRepository.delete(req.params.id);
        res.status(200).json({ success: true, data: {}, message: 'Hotel deleted' });
    } catch (error) {
        next(error);
    }
};
