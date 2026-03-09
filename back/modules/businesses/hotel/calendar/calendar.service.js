import prisma from '../../../../config/db.js';
import { ApiError } from '../../../../core/api.error.js';

class CalendarService {

    /**
     * Fetches all daily pricing and availability for a hotel's room types within a date range.
     */
    async getCalendarData(hotelId, startDateStr, endDateStr) {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw ApiError.badRequest('Invalid date format');
        }

        // 1. Get all room types for this hotel
        const roomTypes = await prisma.roomType.findMany({
            where: { hotelId },
            select: { id: true, name: true, totalInventory: true }
        });

        const roomTypeIds = roomTypes.map(rt => rt.id);

        if (roomTypeIds.length === 0) {
            return [];
        }

        // 2. Fetch Pricing
        const pricing = await prisma.dailyPricing.findMany({
            where: {
                roomTypeId: { in: roomTypeIds },
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        // 3. Fetch Availability
        const availability = await prisma.roomAvailability.findMany({
            where: {
                roomTypeId: { in: roomTypeIds },
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        // Combine logic (for frontend consumption)
        // Group by roomType
        const result = roomTypes.map(rt => {
            const rtPricing = pricing.filter(p => p.roomTypeId === rt.id);
            const rtAvail = availability.filter(a => a.roomTypeId === rt.id);

            // Construct a map by Date "YYYY-MM-DD"
            const daysMap = {};

            // Initialize all dates in range with default mapping
            let current = new Date(startDate);
            while (current <= endDate) {
                const dateKey = current.toISOString().split('T')[0];
                daysMap[dateKey] = {
                    date: dateKey,
                    basePrice: null, // Signals no explicit override
                    minStay: 1,
                    closedToArrival: false,
                    closedToDeparture: false,
                    availableRooms: rt.totalInventory,
                    reservedRooms: 0
                };
                current.setDate(current.getDate() + 1);
            }

            // Overlay actual database records
            rtPricing.forEach(p => {
                const dateKey = p.date.toISOString().split('T')[0];
                if (daysMap[dateKey]) {
                    daysMap[dateKey].basePrice = p.basePrice;
                    daysMap[dateKey].minStay = p.minStay;
                    daysMap[dateKey].closedToArrival = p.closedToArrival;
                    daysMap[dateKey].closedToDeparture = p.closedToDeparture;
                }
            });

            rtAvail.forEach(a => {
                const dateKey = a.date.toISOString().split('T')[0];
                if (daysMap[dateKey]) {
                    daysMap[dateKey].availableRooms = a.availableRooms;
                    daysMap[dateKey].reservedRooms = a.reservedRooms;
                }
            });

            return {
                roomTypeId: rt.id,
                roomTypeName: rt.name,
                totalInventory: rt.totalInventory,
                days: Object.values(daysMap).sort((a, b) => new Date(a.date) - new Date(b.date))
            };
        });

        return result;
    }

    /**
     * Bulk Upserts DailyPricing and RoomAvailability for a single RoomType over a date range.
     * Payload expected:
     * {
     *   roomTypeId: "uuid",
     *   startDate: "YYYY-MM-DD",
     *   endDate: "YYYY-MM-DD",
     *   days: [ "Mon", "Tue", ... ] // optional days of week filter
     *   basePrice: 150,
     *   availableRooms: 5,
     *   minStay: 2,
     *   closedToArrival: false,
     *   closedToDeparture: false
     * }
     */
    async bulkUpdateCalendar(hotelId, payload) {
        const { roomTypeId, startDate, endDate, days, basePrice, availableRooms, minStay, closedToArrival, closedToDeparture } = payload;

        if (!roomTypeId || !startDate || !endDate) {
            throw ApiError.badRequest('roomTypeId, startDate, and endDate are required');
        }

        // Verify hotel ownership of roomType
        const roomType = await prisma.roomType.findFirst({
            where: { id: roomTypeId, hotelId }
        });

        if (!roomType) {
            throw ApiError.notFound('Room Type not found for this hotel');
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw ApiError.badRequest('Invalid date range');
        }

        const dateArray = [];
        let current = new Date(start);

        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        while (current <= end) {
            const dayName = daysOfWeek[current.getDay()];
            // If specific days of week are targeted, filter here
            if (!days || days.length === 0 || days.includes(dayName)) {
                dateArray.push(new Date(current)); // clone
            }
            current.setDate(current.getDate() + 1);
        }

        // We use transactions to reliably upsert all dates
        const transactionOps = [];

        dateArray.forEach(dateObj => {
            // Pricing Upsert
            if (basePrice !== undefined || minStay !== undefined || closedToArrival !== undefined || closedToDeparture !== undefined) {
                const pricingUpdate = {};
                if (basePrice !== undefined) pricingUpdate.basePrice = basePrice;
                if (minStay !== undefined) pricingUpdate.minStay = minStay;
                if (closedToArrival !== undefined) pricingUpdate.closedToArrival = closedToArrival;
                if (closedToDeparture !== undefined) pricingUpdate.closedToDeparture = closedToDeparture;

                transactionOps.push(
                    prisma.dailyPricing.upsert({
                        where: {
                            roomTypeId_date: {
                                roomTypeId: roomTypeId,
                                date: dateObj
                            }
                        },
                        update: pricingUpdate,
                        create: {
                            roomTypeId,
                            date: dateObj,
                            basePrice: basePrice !== undefined ? basePrice : 0, // Should have a fallback if creating
                            minStay: minStay !== undefined ? minStay : 1,
                            closedToArrival: closedToArrival || false,
                            closedToDeparture: closedToDeparture || false
                        }
                    })
                );
            }

            // Availability Upsert
            if (availableRooms !== undefined) {
                transactionOps.push(
                    prisma.roomAvailability.upsert({
                        where: {
                            roomTypeId_date: {
                                roomTypeId: roomTypeId,
                                date: dateObj
                            }
                        },
                        update: {
                            availableRooms: availableRooms,
                            totalRooms: roomType.totalInventory
                        },
                        create: {
                            roomTypeId,
                            date: dateObj,
                            totalRooms: roomType.totalInventory,
                            availableRooms: availableRooms,
                            reservedRooms: 0
                        }
                    })
                );
            }
        });

        if (transactionOps.length > 0) {
            await prisma.$transaction(transactionOps);
        }

        return true;
    }
}

export const calendarService = new CalendarService();
