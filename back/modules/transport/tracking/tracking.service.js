import { getIO } from './tracking.gateway.js';

class TrackingService {
    /**
     * Sends a new ride offer to a specific driver's personal socket room
     * @param {string} driverId The user ID of the driver
     * @param {Object} rideOffer Payload containing pickup, dropoff, price, etc.
     */
    broadcastRideOffer(driverId, rideOffer) {
        try {
            const io = getIO();
            io.to(`driver_${driverId}`).emit('ride_offer', rideOffer);
            console.log(`✉️ Ride offer sent to driver: ${driverId} for ride: ${rideOffer.id}`);
        } catch (error) {
            console.error("Failed to broadcast ride offer via Socket.IO:", error.message);
        }
    }

    /**
     * Sends an update to everyone in a specific ride room (Passenger and Assigned Driver)
     */
    broadcastRideUpdate(rideId, eventName, payload) {
        try {
            const io = getIO();
            io.to(`ride_${rideId}`).emit(eventName, payload);
        } catch (error) {
            console.error(`Failed to broadcast ride update [${eventName}] via Socket.IO:`, error.message);
        }
    }
}

export const trackingService = new TrackingService();
