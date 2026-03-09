export interface IHotel {
    id: string;
    name: string;
    slug?: string;
    description: string;
    starRating?: number;
    propertyType: string;
    checkInTime?: string;
    checkOutTime?: string;
    address: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    email?: string;
    policies?: Record<string, unknown>;
    status: string;
    isFeatured: boolean;
    featuredUntil?: string;
    featuredPriority: number;
    ownerId: string;
    createdAt?: string;
    updatedAt?: string;
    images?: any[];
    dailyStats?: IHotelDailyStat[];
    reviews?: IReview[];
    rating?: number;
    reviewCount?: number;
}

export interface IHotelPayload {
    name: string;
    description: string;
    address: string;
    propertyType?: string;
    starRating?: number;
    phone?: string;
    email?: string;
    checkInTime?: string;
    checkOutTime?: string;
    latitude?: number;
    longitude?: number;
    amenities?: string[];
    images?: string[];
}

export interface IRoomType {
    id: string;
    name: string;
    description?: string;
    maxAdults: number;
    maxChildren: number;
    baseOccupancy: number;
    bedType?: string;
    roomSizeM2?: number;
    totalInventory: number;
    overbookingLimit: number;
    hotelId: string;
    images?: any[];
    roomAmenities?: any[];
}

export interface IHotelDailyStat {
    id: string;
    date: string;
    impressions: number;
    clicks: number;
    totalBookings: number;
    totalRevenue: number;
    conversionRate: number;
    cancellationRate: number;
}

export interface IReview {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    userId: string;
}

export interface IReviewItem {
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    status: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    hotel: {
        id: string;
        name: string;
    };
}

export interface IRoomTypePayload {
    name: string;
    description?: string;
    maxAdults?: number;
    maxChildren?: number;
    baseOccupancy?: number;
    bedType?: string;
    roomSizeM2?: number;
    totalInventory?: number;
    images?: string[];
    amenities?: string[];
}

export interface IBookingItem {
    id: string;
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    price: number;
}

export interface IBooking {
    id: string;
    bookingNumber: string;
    bookingType: string;
    status: string;
    paymentStatus: string;
    totalPrice: number;
    currency: string;
    createdAt: string;
    user?: { email: string };
    hotel?: { name: string };
    items?: IBookingItem[];
}
