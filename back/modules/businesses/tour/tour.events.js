import { EventEmitter } from 'events';

class TourDomainEvents extends EventEmitter { }

export const tourEvents = new TourDomainEvents();

// Tour Lifecycle Events
export const TOUR_CREATED = 'tour:created';
export const TOUR_UPDATED = 'tour:updated';
export const TOUR_DELETED = 'tour:deleted';

// Booking and Reservation Events
export const TOUR_RESERVATION_CREATED = 'tour:reservation:created';
export const TOUR_RESERVATION_CANCELLED = 'tour:reservation:cancelled';

// Feedback Events
export const TOUR_REVIEW_CREATED = 'tour:review:created';

// Sample Listener (Expandable)
tourEvents.on(TOUR_CREATED, (tour) => {
    console.log(`[Domain Event] New Tour Registered: ${tour.name}`);
});
