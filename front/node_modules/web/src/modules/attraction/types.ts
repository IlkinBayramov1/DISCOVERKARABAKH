export interface AttractionCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface AttractionImage {
    id: string;
    url: string;
    type: 'image' | '360_image' | 'vr_tour';
    isCover: boolean;
    order: number;
}

export interface AttractionStat {
    averageRating: number;
    viewCount: number;
    favoriteCount: number;
    popularityScore: number;
}

export interface AttractionWorkingHour {
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed: boolean;
}

export interface NearbyEvent {
    id: string;
    title: string;
    city: string;
    startDate: string;
    endDate: string;
}

export interface Attraction {
    id: string;
    name: string;
    slug: string;
    city?: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    entryType: string;
    price?: number;
    crowdLevel: string;
    audioUrl?: string | null;
    virtualTourUrl?: string | null;
    searchKeywords?: string | null;
    isFeatured: boolean;
    status: string;
    categoryId: string;
    category?: AttractionCategory;
    images: AttractionImage[];
    stats?: AttractionStat;
    workingHours: AttractionWorkingHour[];
    nearbyEvents?: NearbyEvent[];
    createdAt: string;
    updatedAt: string;
}

export interface AttractionReview {
    id: string;
    attractionId: string;
    userId: string;
    user: {
        id: string;
        firstName: string;
        lastName: string;
    };
    rating: number;
    comment?: string;
    images?: string[];
    status: 'approved' | 'under_review' | 'rejected';
    createdAt: string;
}
