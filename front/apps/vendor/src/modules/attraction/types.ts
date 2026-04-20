export interface AttractionCategory {
    id: string;
    name: string;
    slug: string;
    image?: string;
    description?: string;
    order?: number;
}

export type AttractionImageType = 'image' | '360_image' | 'vr_tour';

export interface AttractionImage {
    id: string;
    url: string;
    isCover: boolean;
    type: AttractionImageType;
    order?: number;
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
    popularityScore?: number;
}

export interface NearbyEvent {
    id: string;
    title: string;
    city: string;
    startDate: string;
    endDate: string;
    image?: string;
}

export interface Attraction {
    id: string;
    name: string;
    slug: string;
    city: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    entryType: 'free' | 'paid' | 'donation';
    price?: number;
    crowdLevel: 'low' | 'medium' | 'high';
    audioUrl?: string;
    virtualTourUrl?: string;
    searchKeywords?: string;
    isFeatured: boolean;
    status: 'active' | 'closed' | 'maintenance';
    categoryId: string;
    category?: AttractionCategory;
    images: AttractionImage[];
    stats?: AttractionStat;
    workingHours: AttractionWorkingHour[];
    nearbyEvents?: NearbyEvent[];
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
    status: 'approved' | 'under_review' | 'rejected';
    images?: string[];
    createdAt: string;
}

export interface ReviewReport {
    id: string;
    reviewId: string;
    reporterId: string;
    reason: string;
    customNote?: string;
    status: 'pending' | 'investigated' | 'resolved' | 'dismissed';
    createdAt: string;
}

export interface AttractionAnalytics {
    totalViews: number;
    periodDays: number;
    hourlyDistribution: Array<{
        hour: number;
        count: number;
    }>;
    dailyDistribution: Array<{
        day: string;
        count: number;
    }>;
}
