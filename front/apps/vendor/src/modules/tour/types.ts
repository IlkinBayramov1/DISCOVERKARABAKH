export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Extreme';

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
    slug?: string;
    description: string;
    city?: string;
    address: string;
    phone?: string;
    email?: string;
    images?: string[];

    durationDays: number;
    durationNights: number;
    difficulty: Difficulty;
    groupSizeMin: number;
    groupSizeMax: number;
    pricePerPerson: number;

    startDate?: string;
    itinerary?: ITourItineraryDay[];
    inclusions?: string[];
    exclusions?: string[];

    ownerId: string;
    isApproved: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ITourPayload {
    name: string;
    description: string;
    city?: string;
    address: string;
    phone?: string;
    email?: string;
    images?: string[];

    durationDays: number;
    durationNights: number;
    difficulty: Difficulty;
    groupSizeMin: number;
    groupSizeMax: number;
    pricePerPerson: number;

    startDate?: string;
    itinerary?: ITourItineraryDay[];
    inclusions?: string[];
    exclusions?: string[];
}

export interface ITourAvailabilityResponse {
    tourId: string;
    date: string;
    maxSeats: number;
    bookedCount: number;
    remainingSeats: number;
    isFull: boolean;
}
