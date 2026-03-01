import { hotelService } from './hotel.service.js';
import { successResponse } from '../../../../core/api.response.js';

class HotelController {
    async create(req, res, next) {
        try {
            const hotel = await hotelService.create(req.user.id, req.body);
            return successResponse(res, hotel, { message: 'Hotel listing created successfully and is pending approval.' }, 201);
        } catch (error) {
            next(error);
        }
    }

    async getHotels(req, res, next) {
        try {
            const hotels = await hotelService.findAll(req.query);
            return successResponse(res, hotels, { count: hotels.length });
        } catch (error) {
            next(error);
        }
    }

    async getHotelById(req, res, next) {
        try {
            const hotel = await hotelService.findById(req.params.id);
            return successResponse(res, hotel);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const hotel = await hotelService.update(req.params.id, req.user.id, req.body, req.user.role);
            return successResponse(res, hotel, { message: 'Hotel updated successfully.' });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await hotelService.delete(req.params.id, req.user.id, req.user.role);
            return successResponse(res, null, { message: 'Hotel permanently deleted.' });
        } catch (error) {
            next(error);
        }
    }
}

export const hotelController = new HotelController();
