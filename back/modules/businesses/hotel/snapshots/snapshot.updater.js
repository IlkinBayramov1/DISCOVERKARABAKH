import prisma from '../../../../config/db.js';
import { hotelEvents } from '../hotel.events.js';

class SnapshotUpdaterService {

    constructor() {
        this._registerListeners();
    }

    _registerListeners() {
        // Triggered post Booking OR Cancel to recalculate instantaneous Availabilities
        hotelEvents.on('RESERVATION_CREATED', this._handleInventoryChange.bind(this));
        hotelEvents.on('RESERVATION_CANCELLED', this._handleInventoryChange.bind(this));

        // Triggered upon successful Review creation
        hotelEvents.on('REVIEW_CREATED', this._handleReviewChange.bind(this));

        // Cron-triggered full catalog flush
        hotelEvents.on('NIGHTLY_CATALOG_SYNC', this._fullCatalogSync.bind(this));
    }

    /**
     * Recomputes `popularity` and `availableToday` 
     * based on active Bookings hitting the current date range.
     */
    async _handleInventoryChange({ hotelId }) {
        if (!hotelId) return;

        try {
            // Find popularity metric (e.g. recent dailyStats check)
            const stats = await prisma.hotelDailyStat.findUnique({
                where: {
                    hotelId_date: {
                        hotelId,
                        date: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            });

            // Fallback for null stats
            const popularity = stats ? (stats.totalBookings * 10) + stats.clicks : 0;

            // Simplified exact-date availability scan
            const rooms = await prisma.roomType.findMany({
                where: { hotelId },
                include: { availabilities: { where: { date: new Date(new Date().setHours(0, 0, 0, 0)) } } }
            });

            // If any room has `availableRooms` > 0
            const availableToday = rooms.some(rt =>
                !rt.availabilities.length || rt.availabilities[0].availableRooms > 0
            );

            await this._mergeSnapshot(hotelId, { popularity, availableToday });

        } catch (error) {
            console.error(`[Snapshot Updater] Error processing Inventory Sync for Hotel: ${hotelId}`, error);
        }
    }

    /**
     * Recomputes the `reviewScore` float dynamically when a new review lands.
     */
    async _handleReviewChange({ hotelId }) {
        if (!hotelId) return;

        try {
            const aggregations = await prisma.review.aggregate({
                where: {
                    hotelId,
                    status: 'approved' // Only approved count towards Snapshot bounds
                },
                _avg: { rating: true }
            });

            const reviewScore = aggregations._avg.rating || 0;

            await this._mergeSnapshot(hotelId, { reviewScore });

        } catch (error) {
            console.error(`[Snapshot Updater] Error processing Review Sync for Hotel: ${hotelId}`, error);
        }
    }

    /**
     * Nightly full sync - heavy operation computing `minPrice` across catalog arrays.
     */
    async _fullCatalogSync() {
        console.log('[Snapshot Updater] Initiating Nightly Sync...');
        const hotels = await prisma.hotel.findMany({ select: { id: true } });

        for (const hotel of hotels) {
            try {
                // Determine Minimum basePrice across active RoomTypes
                const pricing = await prisma.dailyPricing.aggregate({
                    where: {
                        roomType: { hotelId: hotel.id },
                        date: { gte: new Date() } // Scans into the future slightly for baseline
                    },
                    _min: { basePrice: true }
                });

                const minPrice = pricing._min.basePrice || 0;

                await this._mergeSnapshot(hotel.id, { minPrice });

            } catch (err) {
                console.error(`[Snapshot Updater] Sync failed for hotel ${hotel.id}`);
            }
        }
    }

    /**
     * Safely updates or creates the Materialized View entry without touching untouched columns
     */
    async _mergeSnapshot(hotelId, partialData) {
        await prisma.hotelSearchSnapshot.upsert({
            where: { hotelId },
            create: {
                hotelId,
                minPrice: partialData.minPrice || 0,
                reviewScore: partialData.reviewScore || 0,
                availableToday: partialData.availableToday ?? true,
                popularity: partialData.popularity || 0
            },
            update: partialData
        });
    }
}

export const snapshotUpdaterService = new SnapshotUpdaterService();
