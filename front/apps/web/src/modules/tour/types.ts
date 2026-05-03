export interface ITourActivity {
    time: string;
    description: string;
}

export interface ITourItineraryDay {
    day: number;
    title: string;
    description: string;
    activities: ITourActivity[];
    meals: string[];
}

export interface ITour {
    id: string;
    name: string;
    slug: string;
    city?: string;
    description: string;
    address: string;
    phone?: string;
    email?: string;
    images: string[];
    businessType: 'Tour';
    
    durationDays: number;
    durationNights: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
    groupSizeMin: number;
    groupSizeMax: number;
    pricePerPerson: number;
    
    startDate: string;
    itinerary: ITourItineraryDay[];
    inclusions: string[];
    exclusions: string[];
    
    ownerId: string;
    isApproved: boolean;
    isFeatured: boolean;
    availableSlots?: number;
    meetingAddress?: string;
    meetingPoint?: string;
    mapLink?: string;
    destinationLink?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ITourAvailabilityResponse {
    tourId: string;
    date: string;
    maxSeats: number;
    bookedCount: number;
    remainingSeats: number;
    isFull: boolean;
    isStopped: boolean;
    price: number;
}

export interface ITourFilters {
    page?: number;
    limit?: number;
    city?: string;
    q?: string;
    minPrice?: number;
    maxPrice?: number;
    duration?: number;
    difficulty?: string;
    sortBy?: string;
}

export type TourEventType = 
    | 'TOUR_CREATED'
    | 'TOUR_UPDATED'
    | 'TOUR_DELETED'
    | 'TOUR_RESERVATION_CREATED'
    | 'TOUR_RESERVATION_CANCELLED';

export interface ITourReservationCreatedPayload {
    bookingId: string;
    tourId: string;
    totalPrice: number;
    timestamp: string;
}

export interface ITourReservationCancelledPayload {
    bookingId: string;
    tourId: string;
    timestamp: string;
}
