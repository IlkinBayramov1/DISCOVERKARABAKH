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
            const rooms = await roomService.getRoomsByHotel(hotelId, req.query);
            return successResponse(res, rooms, { count: rooms.length });
        } catch (error) {
            next(error); 
        }
    }

    async getRoomById(req, res, next) {
        try {
            const { hotelId, roomId } = req.params;
            const room = await roomService.getRoomById(hotelId, roomId, req.query);
            return successResponse(res, room);
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

    // ============================================
    // Physical Rooms (101, 102...)
    // ============================================

    async getPhysicalRooms(req, res, next) {
        try {
            const { hotelId } = req.params;
            const rooms = await roomService.getPhysicalRooms(hotelId, req.user.id, req.query);
            return successResponse(res, rooms, { count: rooms.length });
        } catch (error) {
            next(error);
        }
    }

    async createPhysicalRoom(req, res, next) {
        try {
            const { hotelId } = req.params;
            const room = await roomService.createPhysicalRoom(hotelId, req.user.id, req.body);
            return successResponse(res, room, { message: 'Physical room created.' }, 201);
        } catch (error) {
            next(error);
        }
    }

    async updatePhysicalRoom(req, res, next) {
        try {
            const { hotelId, roomId } = req.params;
            const updated = await roomService.updatePhysicalRoomStatus(hotelId, roomId, req.user.id, req.body);
            return successResponse(res, updated, { message: 'Room status/details updated.' });
        } catch (error) {
            next(error);
        }
    }

    async deletePhysicalRoom(req, res, next) {
        try {
            const { hotelId, roomId } = req.params;
            await roomService.deletePhysicalRoom(hotelId, roomId, req.user.id);
            return successResponse(res, null, { message: 'Physical room deleted.' });
        } catch (error) {
            next(error);
        }
    }

    async createBulkRooms(req, res, next) {
        try {
            const { hotelId } = req.params;
            const result = await roomService.createBulkPhysicalRooms(hotelId, req.user.id, req.body);
            return successResponse(res, result, { message: `${result.count} physical rooms created successfully.` }, 201);
        } catch (error) {
            next(error);
        }
    }
}

export const roomController = new RoomController();
