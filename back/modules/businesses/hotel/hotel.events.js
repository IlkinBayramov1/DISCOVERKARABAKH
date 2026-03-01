import { EventEmitter } from 'events';

class HotelDomainEvents extends EventEmitter { }

export const hotelEvents = new HotelDomainEvents();

// Example Domain Isolated Constants
export const HOTEL_CREATED = 'hotel:created';
export const HOTEL_DELETED = 'hotel:deleted';
export const ROOM_INVENTORY_DEPLETED = 'room:inventory:depleted';

// Sample Listener
hotelEvents.on(HOTEL_CREATED, (hotel) => {
    // In the future this could asynchronously trigger indexing in ElasticSearch
    // Or send a real-time Notification to Admins for review
    console.log(`[Domain Event] New Hotel Registered: ${hotel.name}`);
});
