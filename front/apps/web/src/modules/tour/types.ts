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
    description: string;
    address: string;
    phone?: string;
    email?: string;
    images: string[];
    businessType: 'Tour';
    
    duration: {
        days: number;
        nights: number;
    };
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
    groupSize: {
        min: number;
        max: number;
    };
    startDates: string[];
    itinerary: ITourItineraryDay[];
    inclusions: string[];
    exclusions: string[];
    pricePerPerson: number;
    
    createdAt: string;
    updatedAt: string;
}

export interface ITourFilters {
    city?: string;
    difficulty?: string[];
    minPrice?: number;
    maxPrice?: number;
    duration?: number[];
}
