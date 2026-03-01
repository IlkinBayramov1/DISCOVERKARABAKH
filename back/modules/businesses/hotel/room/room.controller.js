import { roomService } from './room.service.js';
import { successResponse } from '../../../../core/api.response.js';

class RoomController {
    async createRoomType(req, res, next) {
        try {
            const { hotelId } = req.params;
            const room = await roomService.createRoomType(hotelId, req.user.id, req.body);
            return successResponse(res, room, { message: 'Room type successfully allocated to Hotel.' }, 201);
        } catch (error) {
            next(error);
        }
    }

    async getRoomsByHotel(req, res, next) {
        try {
            const { hotelId } = req.params;
            const rooms = await roomService.getRoomsByHotel(hotelId);
            return successResponse(res, rooms, { count: rooms.length });
        } catch (error) {
            next(error);
        }
    }

    async updateRoomType(req, res, next) {
        try {
            const { hotelId, roomId } = req.params;
            const updated = await roomService.updateRoomType(hotelId, roomId, req.user.id, req.body);
            return successResponse(res, updated, { message: 'Room inventory/properties updated.' });
        } catch (error) {
            next(error);
        }
    }

    async deleteRoomType(req, res, next) {
        try {
            const { hotelId, roomId } = req.params;
            await roomService.deleteRoomType(hotelId, roomId, req.user.id);
            return successResponse(res, null, { message: 'Room type removed entirely.' });
        } catch (error) {
            next(error);
        }
    }
}

export const roomController = new RoomController();
