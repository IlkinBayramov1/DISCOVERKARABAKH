export interface AttractionCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface AttractionImage {
    id: string;
    url: string;
    isCover: boolean;
}

export interface AttractionWorkingHour {
    dayOfWeek: number;
    openTime?: string;
    closeTime?: string;
    isClosed: boolean;
}

export interface AttractionStat {
    averageRating: number;
    viewCount: number;
    favoriteCount: number;
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
    entryType: 'free' | 'paid';
    price?: number;
    crowdLevel: 'low' | 'medium' | 'high';
    isFeatured: boolean;
    status: 'active' | 'closed' | 'maintenance';
    categoryId: string;
    category?: AttractionCategory;
    images: AttractionImage[];
    stats?: AttractionStat;
    workingHours: AttractionWorkingHour[];
    createdAt?: string;
    updatedAt?: string;
}

export interface AttractionReview {
    id: string;
    attractionId: string;
    userId: string;
    user: {
        _id: string;
        firstName: string;
        lastName: string;
    };
    rating: number;
    comment?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}
