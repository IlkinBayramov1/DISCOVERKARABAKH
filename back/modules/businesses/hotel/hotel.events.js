import { EventEmitter } from 'events';

class HotelDomainEvents extends EventEmitter { }

export const hotelEvents = new HotelDomainEvents();

// Example Domain Isolated Constants
export const HOTEL_CREATED = 'hotel:created';
export const HOTEL_DELETED = 'hotel:deleted';
export const ROOM_INVENTORY_DEPLETED = 'room:inventory:depleted';

// Real-time Snapshot Events
export const PRICING_UPDATED = 'pricing:updated';
export const AVAILABILITY_UPDATED = 'availability:updated';
export const ROOM_TYPE_CREATED = 'roomType:created';
export const ROOM_TYPE_UPDATED = 'roomType:updated';
export const ROOM_TYPE_DELETED = 'roomType:deleted';

// Booking and Reservation Events
export const RESERVATION_CREATED = 'reservation:created';
export const RESERVATION_CANCELLED = 'reservation:cancelled';

// Social and Feedback Events
export const REVIEW_CREATED = 'review:created';

// Sample Listener
hotelEvents.on(HOTEL_CREATED, (hotel) => {
    // In the future this could asynchronously trigger indexing in ElasticSearch
    // Or send a real-time Notification to Admins for review
    console.log(`[Domain Event] New Hotel Registered: ${hotel.name}`);
});
